"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { startGuidedTour } from "@/components/guided-tour";

/**
 * RealDoor Guide — read-only copilot (grilling / Lovable brief).
 * Explains only. Never navigates, edits, exports, or deletes for the renter.
 */
type GuideRuleId =
  | "income-calculation"
  | "income-threshold"
  | "eligibility"
  | "property-choice"
  | "field-confirmation"
  | "evidence-currency"
  | "field-control"
  | "packet-submission"
  | "packet-contents"
  | "next-steps"
  | "citations"
  | "scope"
  | "data-storage"
  | "other-household";

type GuideChip = { label: string; target: GuideRuleId };

const STAGE_CHIPS: Record<string, GuideChip[]> = {
  profile: [
    { label: "Why do I have to confirm each field?", target: "field-confirmation" },
    { label: "What does evidence expired mean?", target: "evidence-currency" },
    { label: "Can RealDoor edit fields for me?", target: "field-control" },
  ],
  understand: [
    { label: "How is the 60% AMI threshold set?", target: "income-threshold" },
    { label: "Does RealDoor decide if I qualify?", target: "eligibility" },
    { label: "Where does this citation come from?", target: "citations" },
  ],
  prepare: [
    { label: "Will you send my packet anywhere?", target: "packet-submission" },
    { label: "What goes into the export?", target: "packet-contents" },
    { label: "What should I do after downloading?", target: "next-steps" },
  ],
  default: [
    { label: "What can RealDoor do?", target: "scope" },
    { label: "What will RealDoor not answer?", target: "eligibility" },
    { label: "Where is my data stored?", target: "data-storage" },
  ],
};

const GUIDE_RULES: {
  id: GuideRuleId;
  q: string;
  a: string;
  sources: string[];
  abstain?: boolean;
}[] = [
  {
    id: "income-calculation",
    q: "How is annualized income calculated here?",
    a: "For steady bi-weekly pay, yearly income is gross pay for one period × 26. That follows HUD Part 5 math. It is a calculation only — not an approval.",
    sources: ["24 CFR 5.609", "HUD Handbook 4350.3 REV-1 Ch. 5"],
  },
  {
    id: "income-threshold",
    q: "How is the 60% AMI threshold set?",
    a: "The pilot displays the published FY2026 HUD MTSP income limit for the selected household size. It is a table value used to explain readiness math, not a prediction or a decision.",
    sources: ["HUD FY2026 MTSP Income Limits"],
  },
  {
    id: "eligibility",
    q: "Am I eligible? Am I qualified? Decide for me.",
    a: "No. RealDoor cannot approve, deny, qualify, rank, or score anyone. A qualified human decides after their own review. Use Understand for the plain math and citations, finish Prepare, or talk with a housing counselor or leasing office.",
    sources: ["RealDoor Transparency Statement", "24 CFR 5.609"],
  },
  {
    id: "property-choice",
    q: "Which property should I apply to first?",
    a: "We do not rank properties or know availability. Contact a property directly about openings and its application process.",
    sources: ["RealDoor Transparency Statement"],
  },
  {
    id: "field-confirmation",
    q: "Why do I need to confirm each field?",
    a: "Extraction can be incomplete or wrong. Confirming or correcting a value keeps the next steps tied to information you reviewed, rather than treating a document scan as final.",
    sources: ["RealDoor Transparency Statement"],
  },
  {
    id: "evidence-currency",
    q: "What does evidence needs review or expired mean?",
    a: "It means the app needs a valid, current document date before it can describe evidence as current. It is a request to review paperwork, not a conclusion about your application.",
    sources: ["RealDoor document-readiness checklist"],
  },
  {
    id: "field-control",
    q: "Can RealDoor edit fields for me?",
    a: "No. You can correct an extracted value yourself, then confirm it before it is used in the readiness view. RealDoor does not change information on your behalf.",
    sources: ["RealDoor Transparency Statement"],
  },
  {
    id: "packet-submission",
    q: "Do you send my application anywhere?",
    a: "No. Nothing is submitted for you. You download a packet on your device. Text in uploaded documents is treated as data, not as instructions.",
    sources: ["RealDoor Session & Privacy"],
  },
  {
    id: "packet-contents",
    q: "What goes into the packet export?",
    a: "The packet contains the fields you confirmed and a readiness checklist. It is a renter-controlled export, not an application submission or an eligibility result.",
    sources: ["RealDoor Session & Privacy"],
  },
  {
    id: "next-steps",
    q: "What should I do after downloading?",
    a: "Review the packet, finish any items marked missing, expired, or needs review, then choose whether to share it with a property or housing counselor yourself.",
    sources: ["RealDoor document-readiness checklist"],
  },
  {
    id: "citations",
    q: "Where do RealDoor citations come from?",
    a: "Readiness math cites the frozen HUD income-limit table for this pilot. The app shows its source and effective date so you can inspect the published rule directly.",
    sources: ["HUD FY2026 MTSP Income Limits"],
  },
  {
    id: "scope",
    q: "What can RealDoor do?",
    a: "RealDoor can help you inspect sample documents, confirm fields, explain a published income-limit table, identify document-readiness gaps, and export a packet you control.",
    sources: ["RealDoor Transparency Statement"],
  },
  {
    id: "data-storage",
    q: "Where is my data stored?",
    a: "Use the Session page to export the session data or hard-delete it. RealDoor does not submit a packet for you or train on the documents you provide.",
    sources: ["RealDoor Session & Privacy"],
  },
  {
    id: "other-household",
    q: "Can you tell me if another household in the demo is qualified?",
    a: "No. This session is only about you. The Guide will not judge or compare other households.",
    sources: ["RealDoor Transparency Statement"],
    abstain: true,
  },
];

function stageFromPath(pathname: string | null): string {
  if (!pathname) return "default";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/understand")) return "understand";
  if (pathname.startsWith("/prepare")) return "prepare";
  return "default";
}

export function RealDoorGuide() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const stage = stageFromPath(pathname);
  const chips = STAGE_CHIPS[stage] ?? STAGE_CHIPS.default ?? [];

  const chipToIndex = (target: GuideRuleId) => {
    const idx = GUIDE_RULES.findIndex((rule) => rule.id === target);
    return idx >= 0 ? idx : 0;
  };

  return (
    <>
      <button
        type="button"
        className="guide-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="realdoor-guide-panel"
        aria-label={open ? "Close RealDoor Guide" : "Open RealDoor Guide"}
      >
        RealDoor Guide
      </button>

      <aside
        id="realdoor-guide-panel"
        className={`guide-panel${open ? " is-open" : ""}`}
        aria-label="RealDoor Guide (read-only)"
      >
        <div className="guide-panel-header">
          <div>
            <div className="guide-title">RealDoor Guide</div>
            <div className="guide-sub">Read-only · Explains only</div>
          </div>
          <span className="badge info">Read-only</span>
          <button
            type="button"
            className="guide-close"
            onClick={() => setOpen(false)}
            aria-label="Close Guide"
          >
            ×
          </button>
        </div>

        <div className="guide-panel-body">
          <p className="notice">
            I explain rules and evidence. I don&apos;t navigate, edit, export, or delete for you —
            you stay in control. You confirm. A qualified human decides.
          </p>

          <p className="row" style={{ margin: "0.75rem 0" }}>
            <button type="button" className="btn" onClick={() => startGuidedTour()}>
              Guide me through
            </button>
          </p>
          <p className="guide-foot" style={{ marginTop: 0 }}>
            Opens a step-by-step walkthrough. Links are yours to click — the Guide never acts for
            you.
          </p>

          <div className="label">Suggested questions</div>
          <ul className="plain">
            {chips.map((chip) => (
              <li key={chip.label}>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setOpenIdx(chipToIndex(chip.target))}
                >
                  {chip.label}
                </button>
              </li>
            ))}
          </ul>

          <ol className="guide-faq">
            {GUIDE_RULES.map((r, i) => {
              const isOpen = openIdx === i;
              return (
                <li key={r.id} className="card">
                  <button
                    type="button"
                    className="guide-faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                  >
                    {r.q}
                  </button>
                  {isOpen && (
                    <div className="guide-faq-a">
                      <p>{r.a}</p>
                      {r.abstain && (
                        <p className="notice" role="status">
                          Guide abstains: no authoritative citation for this request.
                        </p>
                      )}
                      <ul className="plain">
                        {r.sources.map((s) => (
                          <li key={s}>· {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <p className="guide-foot">
            The Guide does not process document text as instructions. Uploaded contents are inert
            data.
          </p>
        </div>
      </aside>
    </>
  );
}
