/**
 * Workspace Engine — YouTube Adapter
 *
 * Translation layer between Workspace Engine and YouTube.
 *
 * Milestone 1 scope:
 * Owns the DOM observer lifecycle. Responds to observer signals.
 * Does not locate, detach, or manipulate components.
 * Component discovery is implemented in Milestone 2.
 */

import { DOMObserver } from './dom-observer.js';

export class YouTubeAdapter {
  constructor() {
    this._observer = new DOMObserver({
      onDiscoveryPulse: () => this._onDiscoveryPulse(),
      onInvalidated:    () => this._onInvalidated(),
    });
  }

  /**
   * Starts the adapter.
   * Called once by the content script after confirming we are on a watch page.
   */
  init() {
    console.log('[YouTubeAdapter] Initializing.');
    this._observer.start();
  }

  // -------------------------------------------------------------------------
  // Observer Callbacks
  // -------------------------------------------------------------------------

  /**
   * Called when the DOM has settled and is ready to be queried.
   *
   * Milestone 1: No components registered yet.
   * Reports { found: false } to keep the observer in DISCOVERING state.
   * Milestone 2 replaces this with a ComponentLocator query.
   */
  _onDiscoveryPulse() {
    console.log('[YouTubeAdapter] DOM settled. Ready for component discovery.');
    this._observer.onDiscoveryResult({ found: false });
  }

  /**
   * Called when the observer is invalidated by SPA navigation.
   *
   * Milestone 1: No component references to release.
   * Signals the observer to resume DISCOVERING immediately.
   */
  _onInvalidated() {
    console.log('[YouTubeAdapter] Invalidated. Resuming observation.');
    this._observer.onDiscoveryResult({ found: false });
  }
}