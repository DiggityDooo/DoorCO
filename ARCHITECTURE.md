# RealDoor — Two Apps, One Contract

This repo intentionally contains **two applications** that must stay aligned:

| App | Location | Stack | Owns |
|-----|----------|-------|------|
| **Engine** | `app/`, `lib/`, `data/`, `prisma/` | Next.js 15 | Extraction, rules math, Prisma sessions, tests, safety guards |
| **UI prototype** | `src/` | Lovable / TanStack Start | Renter UX, copilot, 3D Guide, stage rail, export flows |

They do **not** share a single `package.json` runtime. Merging them into one app will break both.

## Single source of truth

**`shared/realdoor-contract.json`** — frozen Boston FY2026 geography, MTSP limits, demo scenarios, field allowlists, safety copy, and sync rules.

**Before any agent changes geography, limits, or field names:**

1. Edit `shared/realdoor-contract.json`
2. Update `data/config.json` + `lib/` (engine)
3. Update `src/lib/realdoor-data.ts` (Lovable UI) or tell Lovable to import the contract
4. Run `npm run test` (engine)

## GitHub layout

| Remote | Purpose |
|--------|---------|
| [HackNationProto](https://github.com/DiggityDooo/HackNationProto) | Canonical repo. `main` = engine. `lovable/realdoor-ui` = engine + Lovable UI |
| [realdoor-copilot](https://github.com/DiggityDooo/realdoor-copilot) | Lovable auto-sync mirror (UI only) |

**Do not** expect Lovable to push into HackNationProto automatically. Pull from `realdoor-copilot` into `lovable/realdoor-ui` when needed.

## Commands

```bash
# Engine (Next.js)
npm run dev
npm run test

# Lovable UI (TanStack / Vite)
npm run dev:lovable
```

## Agent instructions

### Cursor agents (local)

- Read `ARCHITECTURE.md` and `shared/realdoor-contract.json` first.
- Engine work → `lib/`, `app/`, `data/`. UI parity notes → `LOVABLE_CHANGE_REQUESTS.md`.
- Do not edit `src/` unless syncing with Lovable or implementing agreed contract changes.
- Lovable preview: project **RealDoor Copilot** on Lovable.

### Lovable agent

- Product brief: `REALDOOR_LOVABLE_BRIEF.md`
- Frozen constants: `shared/realdoor-contract.json` on GitHub (never invent limits).
- Engine behavior reference: `lib/rules/`, `lib/safety/guard.ts`, `lib/types.ts`
- Do not rebuild server logic in `src/` — mirror contract values and UX only.

## Known drift (fix via contract)

- `data/config.json` still says Sacramento — brief requires **Boston**.
- `src/lib/realdoor-data.ts` has illustrative limits — must match `shared/realdoor-contract.json`.
- Field keys differ: organizer pack (`employer`, `employee`, …) vs legacy Next (`applicantName`, …). Contract documents the mapping.
