# RealDoor Grilling Audit

Audit date: 2026-07-19. Scope: Lovable UI under `src/`, compared to `REALDOOR_LOVABLE_BRIEF.md`.

## Verdict

Grilling mostly met functionally. Site now has correct product spine and Boston safety posture. Biggest miss is visual craft: implementation reads as a competent compliance dashboard, not yet a distinctive Hello Monday-inspired renter copilot.

## Met

- Contract baseline: `src/lib/realdoor-contract.ts` mirrors `shared/realdoor-contract.json` for Boston FY2026, 60-day evidence, HH 1-8 abstention.
- Welcome: consent before upload, synthetic-only notice, HH-003/HH-005/HH-002 scenarios.
- Flow: Discover → Profile → Understand → Prepare exists.
- Copilot: `RealDoor Guide`, read-only copy, 3D avatar, stage-specific chips, reduced-motion handling.
- Profile: allowlisted fields, confirm/edit controls, confidence label + percent, side-by-side desktop, mobile tabs, injection notice, expired notice.
- Understand: neutral ledger, no tentative values when annualized field unconfirmed, HH>8 abstention path, citation cards.
- Prepare: checklist states, packet preview, include/exclude controls, PDF/ZIP exports, no send workflow, confirmation checkbox.
- Privacy: delete session control, redacted activity log, data-use register, privacy/transparency pages.
- Visual base: light/dark themes, warm paper/deep ink/teal/ochre tokens, reduced-motion CSS.

## Partially Met / Needs Fix

- Stage rail: has ordered stages and packet count, but not full vertical progress spine with stamped states.
- Discover: map is `coming`, not optional synced map/context. Acceptable for MVP if reframed as deliberate public-location context.
- Profile evidence linking: hover/focus highlight works, but source text is not a true clickable box; document-to-field direction weak.
- `Confirm all reviewed`: disabled when not all fields confirmed and remains useless. Needs logic fix or removal.
- HH-003 correction: suggested value exists, but scripted correction moment is too subtle.
- Prepare export: blocks export when expired/conflicting included. Brief needs identify missing/expired then export packet. Better to export with strong `Needs review` stamps after final confirmation.
- Safety vocabulary: UI repeats `eligible`, `eligibility`, `qualified`, `approved`, `denied`, `rank`, `score` in many visible places. Some is boundary/refusal copy, but visible copy can be cleaner.
- Typography: brief asked humanist sans; CSS uses serif headings broadly. Looks less aligned.
- Visual craft: not enough modular motion/tactile packet tray/stamped labels to meet user's desired Hello Monday-like feel.

## Not Met / Unknown

- Optional synced map: not implemented.
- Full packet PDF citation appendix: PDF includes citation section, but not clearly source appendix with rule text/locator/version/effective date.
- ZIP root summary PDF: ZIP has README text, not summary PDF at root.
- Export completion state: toast only; no calm packet-assembly completion panel observed.
- Text-size control exists in app shell import path but audit did not verify behavior end-to-end.

## Highest-Leverage Lovable Prompt

Use `LOVABLE_VISUAL_UPGRADE_PROMPT.md`.
