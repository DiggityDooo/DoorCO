# Lovable Prompt — RealDoor Visual Upgrade + Grilling Compliance

Sync pass for RealDoor Copilot. Canonical product source: `REALDOOR_LOVABLE_BRIEF.md`. Frozen contract source:

https://raw.githubusercontent.com/DiggityDooo/HackNationProto/lovable/realdoor-ui/shared/realdoor-contract.json

Work only in `src/`. Do **not** touch `app/`, `lib/`, `data/`, `prisma/`, or engine tests. Do not invent MTSP values, geography, eligibility language, or field allowlists.

## Current Compliance Snapshot

Mostly met:

- Boston FY2026 contract mirrored in `src/lib/realdoor-contract.ts` and `src/lib/realdoor-data.ts`.
- Stages exist in correct order: Discover, Profile, Understand, Prepare.
- Welcome page has consent gate, synthetic-only notice, HH-003/HH-005/HH-002 scenarios.
- Profile supports side-by-side evidence/fields, per-field confirm/edit, confidence label + percent, injection notice, expired-evidence notice.
- Understand has neutral calculation ledger, citation cards, abstention on unconfirmed annualized income and household size outside 1-8.
- Prepare has checklist states, packet preview, PDF/ZIP export, no send workflow, selected-items confirmation, neutral handoff copy.
- Persistent top notices, privacy/activity page, data-use register, delete-session control, light/dark themes, reduced-motion handling, RealDoor Guide 3D avatar.

Gaps / polish needed:

- Visual system still feels like a functional form app, not a crafted Hello Monday-inspired renter workspace.
- Stage rail is not visually a true vertical progress spine yet; it lacks the timeline line, stamped statuses, and stronger packet-count moment.
- Discover says optional map is `coming`; brief asks optional synced map. If map is too much, make the placeholder feel intentional and transparent, not unfinished.
- Profile evidence linking is mostly hover/focus text highlight. It needs stronger bidirectional feel: source rows as clickable evidence boxes, field cards scroll/focus from document line click, focused state with source-box framing.
- Profile `Confirm all reviewed` is disabled until all fields already confirmed, so it is useless. Either remove it or make it work as intended after the user has viewed all fields.
- HH-003 guided correction exists as suggested value, but not visually framed as the scripted demo moment. Make monthly benefit correction more discoverable without adding an auto-correct button.
- Prepare blocks export when expired/conflicting included. Brief allowed selected full packet with removable items; blocking expired evidence may hurt demo export. Prefer: allow export after final confirmation while clearly stamping expired/conflicting items as `Needs review`, unless status is unresolved conflict with no renter acknowledgement.
- Safety copy uses forbidden/verdict words often inside policy sentences. Keep boundary copy clear, but reduce repeated verdict vocabulary in visible UI. Prefer: `RealDoor prepares; human reviewers decide.` and `No acceptance or application outcome is predicted.`
- Typography decision was humanist sans, but current CSS uses serif headings. Move closer to humanist sans-led product. If keeping serif accent, use it sparingly for brand only.

## Upgrade Goal

Make RealDoor feel like a polished, warm civic-trust product with restrained kinetic utility: dense and operational, but visually memorable. Keep all safety and hackathon constraints intact.

## Visual Direction

Use:

- Warm paper and deep ink base.
- Muted teal for primary action and links.
- Restrained ochre for attention states.
- Stamped labels with icons for every status.
- Modular cards in motion: cards expand from triggers, selected packet items subtly lift/lock into a tray, stage changes crossfade/slide briefly.
- No custom cursor, no magnetic hover.
- Respect `prefers-reduced-motion` globally.
- Light + dark themes must both look intentional.

Avoid:

- Generic SaaS dashboard feel.
- Big blue default button aesthetic.
- Confetti/success animations.
- Eligibility/verdict vibes.
- Any property ranking, availability prediction, or acceptance implication.

## Specific Work Items

### 1. App shell + stage rail

- Convert `StageRail` into a true vertical progress spine: continuous vertical line, numbered nodes, stamped status label per stage (`not started`, `needs attention`, `complete/current`), compact packet-count card below.
- Make current stage card feel physically selected: soft paper lift, teal edge, stamped label. Keep keyboard focus strong.
- On mobile, add sticky stage summary with current stage, key status, and packet count above content.

### 2. Welcome page

- Make welcome feel more like an art-directed entry: bigger layered-document stage, subtle paper tabs/lines, cleaner type hierarchy, stronger two-entry action layout.
- Keep consent card prominent and plain-language.
- Make demo scenarios feel like intentional cards, not tiny secondary buttons. Show: HH-003 default, HH-005 expired evidence, HH-002 injection test.

### 3. RealDoor Guide panel

- Keep avatar relaxed at top of chat panel. Add better composition: model stage with subtle paper/city-light backdrop, compact `RealDoor Guide` label, `Read-only` stamp.
- Improve starter question cards: make them look like tactile chips/cards. Opening an answer should reveal a cited evidence card with clear source metadata.
- Do not let avatar gesture or animate based on calculation comparison/readiness result.

### 4. Discover

- Keep list primary and unranked. Add a refined optional map/context panel. If no real map, label as `Public location context` and show abstract map grid/pins with same ordering as list, not `coming`.
- Show reported address, municipality/ZIP, unit counts, bedroom mix, source, retrieval date, data flags, and `Availability: unknown` stamp.
- Keep filter limited to municipality/ZIP plus transparent name/address search. Always show hidden count.

### 5. Profile

- Strengthen bidirectional evidence: field card focus should draw an outlined source box; source line click should focus matching field card. Use smooth but brief scroll/focus.
- Make monthly benefit guided correction for HH-003 visually clear: `Demo correction moment` small stamp on the field, normal edit flow only.
- Fix/remove broken `Confirm all reviewed` behavior.
- Make confidence pills more stamp-like and less colorful-status-like. Text + icon + percent.

### 6. Understand

- Turn calculation ledger into a premium audit card: left side formula stack, right side threshold/comparison, persistent source footer. No gauges, no meters.
- Abstention states should replace numeric result area with a strong inline warning and clear action.
- Citation cards should feel expandable and official: authority, locator, version, effective date, source link.

### 7. Prepare

- Make packet builder more tactile: selected items lift into a Prepare-only packet tray; packet preview feels like a print-ready document.
- Full evidence packet starts selected, but every item removable.
- Export confirmation should list included categories before PDF/ZIP download.
- Prefer allowing export with expired/missing items if clearly stamped `Needs review`, because demo requires identify missing/expired then export packet. Do not hide gaps; include them in packet.
- Add calm completion state after export: `Your selected packet is ready to review` plus neutral next steps. No celebration.

### 8. Copy cleanup

- Preserve safety meaning but reduce repeated verdict terms in visible UI. Use:
  - `RealDoor prepares. Human reviewers decide.`
  - `No application outcome is predicted.`
  - `This is a numeric comparison only.`
- Keep explicit refusal answers in Guide for direct decisioning questions, but avoid sprinkling verdict words across every screen.

## Report Back

After changes, report:

1. Contract match: yes/no.
2. Files changed.
3. Which work items completed.
4. Any remaining gaps.
5. Preview URL.
