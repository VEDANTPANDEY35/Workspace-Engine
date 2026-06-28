# Workspace Engine — Roadmap

## Current Stage: Proof of Concept

Target: YouTube only.

Goal: Validate that reorganizing a website's interface produces a natural
user preference for the reorganized layout over the original.

---

## Milestone 1 — Bootstrap Lifecycle
**Status: Complete**

Prove the extension can reliably synchronize with YouTube's page lifecycle.

Deliverables:
- `manifest.json`
- `src/content/index.js`
- `src/adapters/youtube/config.js`
- `src/adapters/youtube/dom-observer.js`
- `src/adapters/youtube/index.js`

Success condition: The extension boots on every YouTube watch page, detects
DOM stabilization, handles SPA navigation, and produces zero runtime errors.

---

## Milestone 2 — Component Discovery
**Status: Planned**

Prove the adapter can reliably locate the Comments component across all
YouTube rendering conditions.

Deliverables:
- `src/adapters/youtube/component-locator.js`
- `src/adapters/youtube/components/comments.js`

Success condition: Console confirms Comments is found on every page load
and every SPA navigation, with no missed detections and no stale references.

---

## Milestone 3 — Workspace Container
**Status: Planned**

Build a draggable, resizable, lockable container as a standalone UI component.

Deliverables:
- `src/engine/workspace-container.js`
- `src/styles/workspace-container.css`

Success condition: The container can be dragged, resized, and locked
independently of any YouTube integration.

---

## Milestone 4 — Detach
**Status: Planned**

Move the Comments component into the Workspace Container on a live YouTube page.

Deliverables:
- `src/engine/component-manager.js`
- `src/adapters/youtube/index.js` (updated)

Success condition: Comments renders fully functional inside the Workspace
Container. All interactivity is preserved.

---

## Milestone 5 — Reset
**Status: Planned**

Return the interface to YouTube's original layout on demand.

Success condition: Clicking reset moves Comments back to its original
position. The page is indistinguishable from an unmodified YouTube page.

---

## Milestone 6 — PoC Evaluation
**Status: Planned**

Use the working prototype on real YouTube for an extended session.
Answer the product hypothesis.

Success condition: A clear answer — yes or no — to the question:
Does reorganizing the interface produce a natural preference for the
reorganized layout?

---

## Explicitly Deferred (Post-PoC)

These features are out of scope until the hypothesis is validated:

- Multiple detachable components
- Saved layouts
- Docking and zone-based layout
- Cross-site adapter support
- Cloud sync
- User accounts
- AI suggestions
- Plugin system
- Settings UI