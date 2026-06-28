/**
 * YouTube Adapter — Configuration
 *
 * All timing and observation constants for the YouTube adapter.
 * These are YouTube-specific tuning decisions, not engine-wide constants.
 *
 * A different adapter would define its own configuration independently.
 */

export const YouTubeAdapterConfig = {
  observer: {
    /**
     * Milliseconds to wait after the last DOM mutation before emitting
     * a discovery pulse.
     *
     * YouTube renders in bursts. Debouncing prevents redundant queries
     * mid-burst and waits for the DOM to reach a stable state.
     * 300ms is imperceptible to users and sufficient to outlast
     * YouTube's typical render burst duration.
     */
    DEBOUNCE_MS: 300,

    /**
     * Maximum discovery attempts before the observer stops retrying.
     * Not enforced in the PoC. Placeholder for future timeout behavior.
     * null = disabled.
     */
    MAX_RETRIES: null,

    /**
     * Maximum milliseconds to spend in DISCOVERING before giving up.
     * Not enforced in the PoC. Placeholder for future timeout behavior.
     * null = disabled.
     */
    OBSERVATION_TIMEOUT_MS: null,
  },
};