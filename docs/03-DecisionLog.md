# Workspace Engine — Decision Log

Short-form record of engineering decisions.
For significant architectural decisions, see `docs/adr/`.

---

## DL-000 — Project Philosophy

**Decision:** Establish the Workspace Engine philosophy as the root constraint
for all engineering decisions.

**Reason:** Every technical decision must be traceable to one principle:
*Applications provide features. Users decide how those features belong on
their screen.* Engineering choices that make the engine more opinionated
about layout violate this principle. Choices that give users more control
reinforce it.

**Status:** Permanent.

---

## DL-001 — Manifest V3

**Decision:** Use Manifest V3 for the browser extension.

**Reason:** MV2 is deprecated. Building on MV3 ensures the PoC does not
require a forced migration before it can evolve.

**Alternatives:** MV2 (deprecated), Electron (too heavy for a PoC).

**Status:** Decided.

---

## DL-002 — esbuild as Build Tool

**Decision:** Use esbuild as the sole build tool.

**Reason:** MV3 content scripts do not support native ES module syntax at
runtime. A build step is required to maintain a modular source architecture.
esbuild is the lightest option: zero configuration, sub-50ms rebuilds,
native source maps.

**Alternatives:** Single file (destroys module architecture), multiple
content scripts with window globals (fragile), dynamic import with
web_accessible_resources (expands security surface), Webpack/Vite
(unnecessary complexity at this scale).

**Status:** Decided.

---

## DL-003 — Injection Scoped to Watch Pages

**Decision:** Inject the content script only on `*://www.youtube.com/watch*`.

**Reason:** The PoC targets YouTube video pages. Injecting on the homepage,
search, or channel pages adds noise with no benefit to the hypothesis.

**Status:** Decided.

---

## DL-004 — Move DOM Node Instead of Clone

**Decision:** Move the real DOM node into the Workspace Container.

**Reason:** Cloning breaks YouTube's Polymer event listeners and internal
references. A shadow overlay is read-only. Moving the real node preserves
all existing functionality — reorganize, never replace.

**Alternatives:** DOM cloning (breaks interactivity), shadow overlay
(read-only).

**Status:** Decided.

---

## DL-005 — Engine is Platform-Agnostic

**Decision:** The engine layer never references the DOM, YouTube selectors,
or any platform-specific detail. All platform knowledge lives in adapters.

**Reason:** The extension is the first adapter, not the product. The engine
must be portable so future adapters can be added without touching the core.

**Status:** Decided.

---

## DL-006 — Continuous Observer Lifecycle

**Decision:** The DOM observer runs a continuous state machine:
`INITIALIZING → DISCOVERING → READY → INVALIDATED → DISCOVERING`

**Reason:** YouTube's SPA navigation tears down the DOM without a page
reload. A simple start/stop model creates a gap where mutations can be
missed. A continuous lifecycle with explicit states is always predictable.

**Alternatives:** Start/stop on navigation (misses mutations during the
gap), polling with setInterval (wasteful, less responsive).

**Status:** Decided.

---

## DL-007 — Named Configuration Constants

**Decision:** All observer timing values are named constants in a
configuration file, never hardcoded inline.

**Reason:** Named constants make intent explicit, make tuning visible,
and signal to future engineers that these values are deliberate choices
with trade-offs.

**Status:** Decided.

---

## DL-008 — Source Directory Structure

**Decision:** Organize source under `src/` with subdirectories per layer:
`adapters/`, `engine/`, `content/`, `styles/`. Build output in `dist/`.
Documentation in `docs/`. Static assets in `assets/`.

**Reason:** Layer boundaries are enforced by directory structure. The
separation between engine and adapter is visible in the file tree, not
just in code conventions.

**Status:** Decided.

---

## DL-009 — Observer Config Belongs in the Adapter Layer

**Decision:** Move observer configuration from `src/config/observer.js`
to `src/adapters/youtube/config.js`.

**Reason:** Debounce timing, retry intervals, and observation timeout are
YouTube-specific tuning decisions. Placing them in a shared `src/config/`
directory implied they were engine-wide constants. A future adapter would
need different values and must define its own config independently.

**Alternatives:** Keep in `src/config/` with YouTube-specific naming —
rejected because the directory itself implies shared scope.

**Status:** Decided.

---

## DL-010 — Observer Owns Its Lifecycle

**Decision:** Replace `observer.markReady()` with
`observer.onDiscoveryResult({ found })`.

**Reason:** `markReady()` was a command from the adapter to the observer,
inverting lifecycle ownership. The observer owns its lifecycle. The adapter
reports facts. The observer reacts to those facts by deciding its next
state. This boundary also provides a natural async seam for future cleanup
operations during invalidation.

**Alternatives:** `markReady()` command model (inverts ownership),
`discoveryCompleted()` (less extensible than a result object).

**Status:** Decided.