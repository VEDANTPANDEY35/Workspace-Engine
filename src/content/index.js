/**
 * Workspace Engine — Content Script Entry Point
 *
 * Executed by the browser on every page matching the manifest pattern.
 * Confirms we are on a YouTube watch page, then boots the YouTube adapter.
 *
 * This is the only file that knows it is running inside a browser extension.
 * All files below this layer are extension-agnostic.
 */

import { YouTubeAdapter } from '../adapters/youtube/index.js';

/**
 * Returns true if the current page is a YouTube video watch page.
 *
 * The manifest pattern already scopes injection to /watch URLs.
 * This guard exists because YouTube is a SPA — the URL can change after
 * the content script has been injected without triggering a page reload.
 */
function isWatchPage() {
  return window.location.pathname === '/watch';
}

/**
 * Boots the Workspace Engine YouTube adapter.
 * Called immediately on script execution.
 */
function boot() {
  if (!isWatchPage()) {
    return;
  }

  console.log('[WorkspaceEngine] Booting.');

  const adapter = new YouTubeAdapter();
  adapter.init();
}

boot();