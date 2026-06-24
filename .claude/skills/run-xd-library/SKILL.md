---
name: run-xd-library
description: Build, run, and drive the xd-library React/Vite SPA (christopherrangelux-dev.github.io/xd-library). Use when asked to start the dev server, build the site, take a screenshot, or interact with its UI (resource library, process vault, approval queue, submission wizard).
---

xd-library is a Vite + React 18 SPA (GitHub Pages, project base path `/xd-library/`), no router — `App.tsx` switches views via a single `currentView` state string. `chromium-cli` is not available in this environment, so a Playwright driver at `.claude/skills/run-xd-library/driver.mjs` is the agent-facing way to drive it — it starts the dev server itself and exposes a small REPL of commands over stdin. Modeled directly on the sibling `nexus-ops-mcp`/`nexus-ops` repos' driver (same driver, unchanged aside from comments/paths) — see those repos if this one's gotchas section is missing something already solved there.

All paths below are relative to the repo root (`xd-library/`).

## Prerequisites

```bash
npm install   # includes playwright as a devDependency
npx playwright install chromium   # no-op if already cached
```

## Build

```bash
npm run build   # outputs to dist/
```

## Run (agent path)

The driver manages its own dev server (kills stray `vite` processes first, clears `node_modules/.vite`) and a headless Chromium page. Pipe commands to it via a heredoc:

```bash
node .claude/skills/run-xd-library/driver.mjs <<'EOF'
launch
click-text Process Vault
ss vault
quit
EOF
```

Screenshots land in `/tmp/shots/` (override: `SCREENSHOT_DIR`). Commands run strictly in the order given, even though the dev server takes a few seconds to come up on `launch`.

For interactive back-and-forth instead of a fixed script, run it without a heredoc and type commands at the `driver>` prompt (foreground only — there's no tmux on this machine).

### Commands

| command | what it does |
|---|---|
| `launch` | kill stray dev servers, start `vite`, open a headless page at the site root |
| `click <css-sel>` | click an element, then settle ~350ms (no URL to wait on — pure React state) |
| `click-text <text>` | click the first element containing `<text>`, same settle wait |
| `ss [name]` | screenshot → `/tmp/shots/<name>.png` |
| `hover <css-sel>` | hover an element |
| `resize <width> <height>` | resize the viewport (e.g. `resize 375 800` for a mobile check) |
| `type <text>` / `press <key>` | keyboard input (e.g. `press Enter`, `press Tab`) |
| `wait <css-sel>` | wait up to 10s for a selector to appear |
| `eval <js>` | evaluate an expression in the page, print JSON |
| `text [css-sel]` | print `innerText` of a selector (or `document.body`) |
| `console` | print and clear captured browser console/page errors since last call |
| `quit` | close the browser and kill the dev server |

## Run (human path)

```bash
npm run dev   # opens http://localhost:5173/xd-library/ — Ctrl-C to stop
```

## App map (for navigating without a router)

- Default view on load is **Library** (`ResourceGrid` of `ResourceCard`s). A header nav bar switches between **Library** / **Process Vault** / **Approval Queue** (Approval Queue only shows when in Manager mode) — `click-text Library` / `click-text "Process Vault"` / `click-text "Approval Queue"`.
- A view-mode toggle bar (below the header) switches **Associate** / **Manager** — `click-text Associate` / `click-text Manager`. Manager mode reveals per-card audit-status badges and the Approval Queue nav item.
- **Library** → `Sidebar` (Discipline + Resource Type checkboxes, mobile gets a slide-in drawer via a "Filters" button) + a search box in the header. Each `ResourceCard` has a "View" button (no-op until the Resource Detail build lands).
- **Process Vault** → `ProcessVault`, a Taxonomy Explorer (click a discipline tile to expand its subcategories) plus a "Service Map" card, "Governance Playbook" card, and a "Key Metrics" panel.
- **Approval Queue** (Manager mode only) → `ManagerApprovalQueue`. A status-filter pill row (`All`/`Pending`/`Reviewing`/`Flagged`), a table (desktop) / card list (mobile) of pending resources, click a row to open a review panel on the right with "Verify & Publish" and "Request Clarification" (requires comments) actions.
- **Submit Resource** — header button, opens `SubmissionWizard` as a modal overlay (works from any view). 3 steps: Asset Details → Taxonomy Tagging → Contributor Info, with Back/Next/Submit footer buttons and a step-progress bar.
- Flagship resources for screenshots: id `'2'` (`Design System Foundations Guide`, `Pending`, has a contributor) and id `'16'` (`Voice & Tone Guidelines`, `Flagged`, has a contributor) — good for exercising the approval/resubmission flows once built. id `'7'` (`Brand Assets Library`, `Deprecated`) is the only deprecated resource.

## Test

No test suite exists in this repo (`package.json` only has `dev`/`build`). `npm run build` succeeding is the correctness gate.

---

## Gotchas

- **Two dev servers running at once on the same port** will make the second `vite` instance pick a different port — the driver parses the real port out of `vite`'s own "Local: http://localhost:PORT/xd-library/" line rather than hardcoding 5173, so this is handled, but if you started a manual `npm run dev` separately in another terminal, kill it first (`pkill -f 'node_modules/.bin/vite'`) to avoid two servers serving slightly different in-memory state.
- **No router means no URL to poll.** `click`/`click-text` here don't wait for `location.href` to change — they just click and settle. If a future interaction here ever becomes async (e.g. a real API call), revisit this.
- **Scripted clicks need more settle time than you'd expect — 150ms isn't enough.** A real trusted mouse click flushes React's state update synchronously before paint; clicks dispatched via Playwright (or raw `element.click()` via `eval`) appear to commit measurably slower in headless Chromium (confirmed empirically in the sibling `nexus-ops`/`nexus-ops-mcp` repos — same driver code, same effect expected here). `click`/`click-text` settle for 350ms for this reason — if you bypass them with a raw `eval(...).click()`, add your own `await new Promise(r => setTimeout(r, 350))` before reading computed styles or taking a screenshot.
- **Piped/heredoc stdin races the REPL's own queue.** An explicit FIFO queue serializes commands, and `close` (EOF) waits for the queue to drain before tearing down the browser/dev server.

## Troubleshooting

- **`ERROR: launch first` on every command:** `launch` is still starting the dev server — use a heredoc with `launch` as line 1 so the queue handles the ordering correctly.
- **Click-text matches the wrong element:** `click-text` matches the *first* element containing the given text, including badges/labels nested inside larger clickable rows. If two rows share similar text, target unique text instead (a status badge, not a shared label).
