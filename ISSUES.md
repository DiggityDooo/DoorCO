# RealDoor — Issues Index

**Indexed:** 2026-07-19  
**Branch:** `lovable/realdoor-ui`  
**Vite server:** stopped (port 5173 free)

Severity: **P0** blocks local demo · **P1** product/correctness drift · **P2** tooling · **P3** polish / checklist verify

---

## P0 — Runtime blockers (observed locally)

### P0-1 · 3D Guide GLB 404 (local Vite)

| | |
|--|--|
| **Symptom** | `Could not load /__l5e/assets-v1/.../realdoor-guide.glb` → 404; `<CanvasImpl>` error boundary; route warning `__root__/` |
| **Cause** | `src/assets/realdoor-guide.glb.asset.json` points at Lovable CDN path `/__l5e/assets-v1/...` — not served by local Vite |
| **Local asset exists** | `AI 3D avatar/Meshy_AI_The_Architect_Cyberpu_0719020306_image-to-3d-texture.glb` (~49MB) |
| **Used by** | `src/components/realdoor/guide-avatar-3d.scene.tsx` via `useGLTF(guideAsset.url)` |
| **Fix** | Copy/symlink GLB into `public/` or `src/assets/` and point `url` at a local path (e.g. `/realdoor-guide.glb`); keep Lovable CDN URL only in cloud |

### P0-2 · Vitest fails: PostCSS ESM / CJS mismatch

| | |
|--|--|
| **Symptom** | `Failed to load PostCSS config: module is not defined in ES module scope` |
| **Cause** | `package.json` has `"type": "module"` but `postcss.config.js` uses `module.exports` |
| **Impact** | `npm run test` / Vitest cannot start |
| **Fix** | Rename to `postcss.config.cjs` or convert to `export default { ... }` |

### P0-3 · Volta npm/node shim launches Chromium

| | |
|--|--|
| **Symptom** | `npm` / default `node` on PATH → Electron/Chromium dbus `UnitExists`; scripts never run |
| **Cause** | `/home/seanb/.volta/bin/npm` → `volta-shim` misbehaving in this environment |
| **Workaround** | `PATH="/usr/bin:/bin" /usr/bin/node …` and `/usr/bin/npm` |
| **Fix** | Repair Volta shim or put `/usr/bin` first in shell profile for this project |

---

## P1 — Product / correctness drift

### P1-1 · Engine still Sacramento; contract/UI Boston

| Surface | Geography |
|---------|-----------|
| `shared/realdoor-contract.json` | Boston-Cambridge-Quincy |
| Lovable UI (`src/`) | Boston (verified on Welcome) |
| `data/config.json` | **Sacramento--Roseville--Arden-Arcade** |
| `tests/*.test.ts` | Expects **78840** (Sacramento HH4 @60%), not Boston **102840** |

Brief forbids Sacramento. Engine calc/tests wrong for demo until cutover.

### P1-2 · Engine ignores shared contract

Engine loads `data/config.json` + `data/mtsp-fy2026.json`. Does **not** import `shared/realdoor-contract.json`. Dual SSOT risk.

### P1-3 · Evidence currency: 60 days vs 3 months

| Source | Window |
|--------|--------|
| Contract / brief / UI scenarios | **60 days** |
| `data/checklist.json` `income-proof` | **`expiryMonths`: 3** |
| Same file: household 6 mo, asset 3 mo, rental 12 mo | months, not 60-day convention |

### P1-4 · Two field vocabularies not unified in engine

- Organizer/UI: `employer`, `employee`, `annualized`, …  
- Engine `lib/types.ts`: `applicantName`, `annualIncome`, …  
Mapping only in contract; extractor still legacy keys.

### P1-5 · Next engine missing Discover / Welcome

| App | Stages |
|-----|--------|
| Lovable | Welcome + Discover → Profile → Understand → Prepare |
| Next `app/` | Profile, Understand, Prepare, Session, Transparency — **no Discover** |

### P1-6 · Contract schema file missing

`$schema`: `./realdoor-contract.schema.json` — **file absent**.

### P1-7 · README `.env.example` missing

README says `cp .env.example .env` — file not in repo.

### P1-8 · Zod version split (latent)

Lovable mirror wants `zod@^4`; local kept `zod@^3.25.76` for engine. Future Lovable sync may re-introduce conflict.

### P1-9 · Stale Sacramento docs

`PLAN.md`, `review_notes.md` celebrate Sacramento cutover — contradict brief. Agents may follow wrong plan.

### P1-10 · Lovable cloud project blurb (external)

Project description still mentioned Sacramento Metro (observed earlier via MCP). UI copy is Boston; metadata stale.

---

## P2 — Tooling / deps / env

### P2-1 · npm peer dependency conflict

Clean `npm install` fails with ERESOLVE (vite 5 vs 8 / `@lovable.dev/vite-tanstack-config`). Needs `--legacy-peer-deps`.

### P2-2 · npm audit: 6 vulnerabilities

`moderate: 3`, `high: 1`, `critical: 2` (as of last install). Not triaged here.

### P2-3 · Install scripts blocked by default

Prisma / esbuild / sharp postinstalls blocked until `npm install-scripts approve …`. Fresh clone may break without approve.

### P2-4 · Vite plugin warning

`vite-tsconfig-paths` redundant — Vite 8 has native `resolve.tsconfigPaths`.

### P2-5 · THREE.Clock deprecated

Console warn: use `THREE.Timer` instead (from R3F/drei stack). Non-blocking.

### P2-6 · Dual package.json scripts fragile

One `package.json` serves Next + Lovable. Mirror `package.json` would wipe Next if merged wholesale. Sync must be selective (already practiced).

### P2-7 · Large binary not in Vite public

48–49MB GLB in `AI 3D avatar/` — not wired for local serve; GitHub may need LFS if committed to public path.

---

## P3 — Lovable checklist / polish (from `LOVABLE_CHANGE_REQUESTS.md`)

Still open as of checklist file (many may be partially delivered — verify):

| ID | Topic |
|----|--------|
| 1.1–1.4 | Avatar lazy-load, label, dark lighting, no judgment gestures |
| 2.1–2.3 | Discover / Welcome / scenarios *(UI routes exist — verify completeness)* |
| 3.1–3.3 | Boston baseline / 60-day / badge *(UI largely done; engine not)* |
| 4.1–4.7 | Profile evidence linking, conflict panel, injection notice |
| 5.1–5.5 | Understand ledger, abstention, Q&A cards, chips |
| 6.1–6.4 | Prepare status, ZIP folder layout, completion moment |
| 7.1–7.7 | Session delete, activity log, trust panels, refusals |
| 8.1–8.7 | Theme, type, a11y, text-size S/M/L |
| 9.1 | Shareable preview (workspace-gated) |

---

## Verification snapshot (2026-07-19)

| Check | Result |
|-------|--------|
| Vite local Welcome | Loaded (Boston copy) before shutdown |
| Guide 3D | **Fail** — GLB 404 |
| `tsc -p tsconfig.next.json` | Pass (exit 0) |
| `tsc -p tsconfig.json` | Pass (exit 0) |
| `vitest run` | **Fail** — PostCSS config ESM |
| Engine geography | Sacramento in `data/config.json` |
| Port 5173 after shutdown | Free |

---

## Suggested fix order

1. **P0-2** rename `postcss.config.js` → `.cjs` (unblock tests)  
2. **P0-1** local GLB path for Guide avatar  
3. **P1-1** Boston cutover: `data/config.json` + update test thresholds to 102840  
4. **P1-3** checklist expiry → 60-day convention where brief requires  
5. **P0-3** document PATH workaround in README  
6. Work down `LOVABLE_CHANGE_REQUESTS.md` for demo polish  

---

## Runtime log excerpts (Vite session)

```
Error: Could not load /__l5e/assets-v1/eda0f2b0-e220-4905-9fc1-dcc5ca530996/realdoor-guide.glb
  … responded with 404
The above error occurred in the <CanvasImpl> component.
Warning: Error in route match: __root__/
THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.
```

```
Failed to load PostCSS config: module is not defined in ES module scope
(postcss.config.js + "type": "module")
```
