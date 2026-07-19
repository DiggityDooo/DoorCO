# Lovable Change Requests — RealDoor

Source of truth: `REALDOOR_LOVABLE_BRIEF.md`. Items below are corrections, gaps to verify, and additions after reviewing the current preview state and the 3D Guide wiring summary.

## 1. 3D Guide Avatar (delivered — verify + polish)

Confirmed delivered: GLB at `src/assets/realdoor-guide.glb.asset.json`, rendered by `guide-avatar-3d.tsx` + `guide-avatar-3d.scene.tsx` (R3F, useGLTF, Bounds auto-fit), docked header h-52 desktop / h-40 mobile sheet, idle yaw + breathing, reduced-motion disable, `aria-hidden` canvas with `role="img"` container.

- [ ] **1.1** Verify avatar loads lazily and does not block first paint of Profile/Understand/Prepare. Add a lightweight static placeholder (poster image or silhouette) while GLB streams.
- [ ] **1.2** Confirm the label reads exactly `RealDoor Guide` next to the avatar in both desktop panel and mobile sheet — the name is a product decision, not just an aria-label.
- [ ] **1.3** Verify dark theme: `city` environment lighting must not blow out or silhouette the model on the dark palette. Check both themes.
- [ ] **1.4** Confirm no gesture ever fires on calculation results or readiness status changes — avatar must never appear to react to a threshold comparison (reads as judgment).

## 2. Missing stages / routes (verify existence)

Lovable summary only mentions `/profile`, `/understand`, `/prepare`.

- [ ] **2.1** **Discover stage** must exist and come **before** Profile in the stage rail (order: Discover → Profile → Understand → Prepare). Unranked list primary, optional synced map, municipality/ZIP filter only, hidden-record count shown, `Availability: unknown` on every card, transparent public facts per brief.
- [ ] **2.2** **Welcome screen** as first renter-facing screen: layered-document stage imagery, explicit pre-upload consent (plain-language data use + required checkbox + privacy/deletion links), two equal entry actions (upload / try synthetic example).
- [ ] **2.3** Demo scenario chooser with three scenarios: HH-003 Avery Moss (default, employment + benefit income, guided monthly-benefit correction), HH-005 Tess Alder (expired 2026-04-14 employment letter vs 60-day rule), HH-002 Jonas Vale (embedded-instruction pay stub → neutral safety notice).

## 3. Geography / rules baseline

- [ ] **3.1** All copy, limits, and calculations must use **Boston-Cambridge-Quincy, MA-NH HMFA**, FY 2026 MTSP, effective 2026-05-01, simulation date 2026-07-18. The prior app defaulted to Sacramento — confirm no Sacramento values or labels leaked in. 60% limits (HH size 1–8): 72,000 / 82,320 / 92,580 / 102,840 / 111,120 / 119,340 / 127,560 / 135,780.
- [ ] **3.2** Evidence currency = **60 days** (challenge convention), not 90 days / 3 months.
- [ ] **3.3** Persistent context badge: `Boston pilot | FY 2026 rules`, expandable to simulation date, effective date, corpus version, safety boundary.

## 4. Profile stage

- [ ] **4.1** Side-by-side document viewer + editable field cards (desktop); labeled document/fields tabs (mobile).
- [ ] **4.2** Bidirectional focus link: field → zoom/outline source box; source box → highlight/scroll field card.
- [ ] **4.3** Per-field Confirm + Edit; bulk confirm only after all fields reviewed; no unconfirmed value flows downstream.
- [ ] **4.4** Confidence shown as label + percent, e.g. `High confidence (94%)`, with note that it measures extraction quality, not truth.
- [ ] **4.5** Correction propagates immediately: recalc + readiness update, accessible change summary, Guide explains update in chat.
- [ ] **4.6** Conflict handling: side-by-side discrepancy panel (values, source boxes, dates); contested field blocked from reuse until corrected or marked for human review; never auto-select.
- [ ] **4.7** Embedded-instruction docs: ignore instruction, show neutral notice that unrelated content was excluded.

## 5. Understand stage

- [ ] **5.1** Neutral calculation ledger: confirmed annualized income, formula, frozen 60% threshold, comparison, source, effective date, plus "not an eligibility decision" note.
- [ ] **5.2** Abstention = inline result replacement: card stays, numeric result replaced by warning naming the exact uncertainty + link to fix. No tentative numbers.
- [ ] **5.3** Household size outside 1–8: `Needs review: no frozen threshold for this household size`. Never extrapolate.
- [ ] **5.4** Rules Q&A: plain-language answer + expandable evidence card (rule text, authority, locator, version, effective date). No citation → abstain with guidance, never a best-effort rule claim.
- [ ] **5.5** Contextual starter-question chips per stage.

## 6. Prepare stage

- [ ] **6.1** Headline status `Ready for human review` / `Needs review` + exact evidence states (current, missing, expired, conflicting, unverified).
- [ ] **6.2** Packet builder: full evidence packet preselected, include/exclude controls, live preview, animated tray Prepare-only (compact count link elsewhere in rail).
- [ ] **6.3** Export: PDF (inline citation refs + full source appendix) and ZIP (summary PDF at root; `documents/`, `citations/`, `activity-history/` folders + contents file). Selected-items confirmation before download. No send action ever.
- [ ] **6.4** Calm completion moment (`Your selected packet is ready to review`) + neutral next-steps handoff panel. No celebratory/approval visuals.

## 7. Safety / privacy controls (live demo requirements)

- [ ] **7.1** `Delete this session` in visible session menu on every stage; confirm irreversible; purge data + exports; announce completion.
- [ ] **7.2** Demo reset = delete ephemeral session → back to scenario chooser, clean state.
- [ ] **7.3** Privacy & activity panel: timestamped consent/confirm/correct/rule-version/export/deletion events; no raw document contents.
- [ ] **7.4** Data-use register in context panel: each allowlisted field, purpose, where it appears, what is not inferred.
- [ ] **7.5** `How RealDoor protects you` expandable trust panel.
- [ ] **7.6** Guide refusals: decisioning requests → detailed policy explanation, then point to calculation/rules/checklist/human handoff. Cross-household requests → detailed privacy explanation, then return to own session.
- [ ] **7.7** Persistent notices: `Prototype: use synthetic documents only.` + `You confirm. A qualified human decides.` in workspace header.

## 8. Visual system / interaction

- [ ] **8.1** Light + dark themes, OS-preference default; ink/paper/teal palette with ochre attention states; verify overlays, stamps, citations, focus in both.
- [ ] **8.2** Humanist sans with tabular numerals for all figures/dates/calculations.
- [ ] **8.3** Status = stamped labels + icons + text; color never sole signal. No traffic-light scoring.
- [ ] **8.4** Stage rail = slim vertical numbered progress spine with stamped statuses + packet-count link; mobile = stacked panels + sticky stage summary; copilot = bottom sheet on mobile.
- [ ] **8.5** Motion: restrained kinetic utility, modular cards-in-motion grammar; reading/evidence views still; `prefers-reduced-motion` respected everywhere (not only avatar). No custom cursor, no magnetic hover.
- [ ] **8.6** Text-size control (S/M/L) persisted for the ephemeral session.
- [ ] **8.7** WCAG 2.2 AA: keyboard-complete journey, visible focus, labeled errors, structured headings, announced updates.

## 9. Access for review

- [ ] **9.1** Preview URL returns `Internal Lovable project ... only available to authorized workspace members` to outside tooling. Publish a shareable preview or grant access so the journey can be reviewed end-to-end before the demo run-through.
