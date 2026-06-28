/**
 * Workspace Engine — YouTube DOM Observer
 *
 * Manages the observation lifecycle for YouTube's async, SPA-driven DOM.
 *
 * Knows:     when the DOM is ready to be queried.
 * Does not know: what to query, what components exist, or what to do with them.
 *
 * Lifecycle:
 *   INITIALIZING → DISCOVERING → READY → INVALIDATED → DISCOVERING
 *
 * Ownership:
 *   The observer owns its lifecycle.
 *   The adapter reports discovery results.
 *   The observer decides how to react to those results.
 */

import { YouTubeAdapterConfig } from './config.js';

// ---------------------------------------------------------------------------
// Lifecycle States
// ---------------------------------------------------------------------------

export const ObserverState = Object.freeze({
  INITIALIZING: 'INITIALIZING',
  DISCOVERING:  'DISCOVERING',
  READY:        'READY',
  INVALIDATED:  'INVALIDATED',
});

// ---------------------------------------------------------------------------
// DOMObserver
// ---------------------------------------------------------------------------

export class DOMObserver {
  /**
   * @param {object}   options
   * @param {Function} options.onDiscoveryPulse
   *   Called when the DOM has settled during DISCOVERING state.
   *   The adapter should query for components and then call
   *   onDiscoveryResult() with the outcome.
   *
   * @param {Function} options.onInvalidated
   *   Called when the observer enters INVALIDATED state.
   *   The adapter should release stale references and then call
   *   onDiscoveryResult({ found: false }) to resume DISCOVERING.
   */
  constructor({ onDiscoveryPulse, onInvalidated }) {
    this._onDiscoveryPulse = onDiscoveryPulse;
    this._onInvalidated    = onInvalidated;

    this._state            = ObserverState.INITIALIZING;
    this._mutationObserver = null;
    this._debounceTimer    = null;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * Starts the observer.
   * Attaches the MutationObserver and the SPA navigation listener.
   * Transitions from INITIALIZING to DISCOVERING.
   * Must be called exactly once.
   */
  start() {
    this._attachMutationObserver();
    this._attachNavigationListener();
    this._transitionTo(ObserverState.DISCOVERING);
  }

  /**
   * Receives a discovery result from the adapter.
   * The observer — not the adapter — decides what state transition follows.
   *
   * { found: true }
   *   All components located. Transitions DISCOVERING → READY.
   *
   * { found: false } from INVALIDATED
   *   Adapter cleanup complete. Transitions INVALIDATED → DISCOVERING.
   *
   * { found: false } from DISCOVERING
   *   Components not yet found. No transition — remains in DISCOVERING.
   *
   * @param {object}  result
   * @param {boolean} result.found
   */
  onDiscoveryResult({ found }) {
    if (found && this._state === ObserverState.DISCOVERING) {
      this._transitionTo(ObserverState.READY);
      return;
    }

    if (!found && this._state === ObserverState.INVALIDATED) {
      this._transitionTo(ObserverState.DISCOVERING);
      return;
    }
  }

  /**
   * Returns the current lifecycle state.
   *
   * @returns {string}
   */
  getState() {
    return this._state;
  }

  // -------------------------------------------------------------------------
  // State Machine
  // -------------------------------------------------------------------------

  _transitionTo(nextState) {
    console.log(`[DOMObserver] ${this._state} → ${nextState}`);
    this._state = nextState;
  }

  /**
   * Enters INVALIDATED state and notifies the adapter.
   * Clears any pending debounce timer — it belongs to the previous page.
   *
   * Does not self-transition back to DISCOVERING. The adapter signals
   * readiness to resume via onDiscoveryResult({ found: false }), ensuring
   * any cleanup (synchronous or asynchronous) completes first.
   */
  _invalidate() {
    if (this._state === ObserverState.INVALIDATED) return;

    clearTimeout(this._debounceTimer);
    this._transitionTo(ObserverState.INVALIDATED);
    this._onInvalidated();
  }

  // -------------------------------------------------------------------------
  // MutationObserver
  // -------------------------------------------------------------------------

  _attachMutationObserver() {
    this._mutationObserver = new MutationObserver(() => this._onMutation());

    // childList: detects nodes being added and removed.
    // subtree:   required — YouTube renders components deep in the tree.
    this._mutationObserver.observe(document.body, {
      childList: true,
      subtree:   true,
    });
  }

  _onMutation() {
    if (this._state === ObserverState.DISCOVERING) {
      this._schedulePulse();
    }

    // READY state: reserved for component ejection detection.
    // Implemented when detach behavior is introduced in Milestone 4.
  }

  /**
   * Debounces the discovery pulse.
   * Each mutation resets the timer. The pulse fires only after the DOM
   * has been quiet for DEBOUNCE_MS milliseconds.
   */
  _schedulePulse() {
    clearTimeout(this._debounceTimer);

    this._debounceTimer = setTimeout(() => {
      if (this._state !== ObserverState.DISCOVERING) return;
      this._onDiscoveryPulse();
    }, YouTubeAdapterConfig.observer.DEBOUNCE_MS);
  }

  // -------------------------------------------------------------------------
  // SPA Navigation
  // -------------------------------------------------------------------------

  /**
   * YouTube fires 'yt-navigate-finish' on every SPA navigation.
   * More reliable than History API interception — YouTube fires this event
   * after its own internal state update is complete.
   */
  _attachNavigationListener() {
    window.addEventListener('yt-navigate-finish', () => this._onNavigation());
  }

  _onNavigation() {
    console.log('[DOMObserver] SPA navigation detected.');
    this._invalidate();
  }
}