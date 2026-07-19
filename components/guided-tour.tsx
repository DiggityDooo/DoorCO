"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const STORAGE_KEY = "realdoor-tour-dismissed";
const START_EVENT = "realdoor:start-tour";

export type TourStep = {
  id: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

const STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "How RealDoor works",
    body: "Four short steps help you get application-ready. You confirm every fact. A qualified human at the property decides. RealDoor never says yes or no on eligibility.",
  },
  {
    id: "profile",
    title: "1 · Profile",
    body: "Upload a sample pay stub or benefit letter. We pull only allowed fields and show where each value came from. Confirm or fix each one before anything else uses it.",
    href: "/profile",
    linkLabel: "Open Profile",
  },
  {
    id: "understand",
    title: "2 · Understand",
    body: "See the published income limit for your household size (sometimes called AMI / MTSP), the math, the source, and the effective date. Uncertain inputs mean we stop and ask — we do not guess.",
    href: "/understand",
    linkLabel: "Open Understand",
  },
  {
    id: "prepare",
    title: "3 · Prepare",
    body: "Compare your profile to a document checklist. Flag missing or outdated items. Preview, edit, download, or delete your packet. Nothing is sent for you.",
    href: "/prepare",
    linkLabel: "Open Prepare",
  },
  {
    id: "session",
    title: "4 · Session",
    body: "Export your session or permanently delete it when you choose. RealDoor does not submit anything for you.",
    href: "/session",
    linkLabel: "Open Session",
  },
];

export function startGuidedTour() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(START_EVENT));
}

export function GuidedTour() {
  const titleId = useId();
  const bodyId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  const close = useCallback((persist = true) => {
    setActive(false);
    setIndex(0);
    if (persist && typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  }, []);

  const open = useCallback(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIndex(0);
    setActive(true);
  }, []);

  useEffect(() => {
    const onStart = () => open();
    window.addEventListener(START_EVENT, onStart);
    return () => window.removeEventListener(START_EVENT, onStart);
  }, [open]);

  useEffect(() => {
    if (!active) return;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    document.body.style.overflow = "hidden";
    initialFocusRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
    };
  }, [active, close]);

  if (!active) return null;

  const step = STEPS[index]!;
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;

  const chipLabel = (s: TourStep, i: number) => {
    if (i === 0) return "Intro";
    const head = s.title.split("·")[0]?.trim();
    return head || s.id;
  };

  return (
    <div className="tour-root">
      <div className="tour-backdrop" onClick={() => close()} />
      <section
        ref={dialogRef}
        className="tour-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
      >
        <div className="tour-chips">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={i === index}
              className={`tour-chip${i === index ? " is-active" : ""}`}
              onClick={() => setIndex(i)}
            >
              {chipLabel(s, i)}
            </button>
          ))}
        </div>

        <h2 id={titleId} className="tour-title">
          {step.title}
        </h2>
        <p id={bodyId} className="tour-body">
          {step.body}
        </p>

        {step.href && (
          <p className="tour-link-row">
            <Link className="btn secondary" href={step.href} onClick={() => close()}>
              {step.linkLabel ?? "Open step"}
            </Link>
            <span className="tour-hint">
              You choose when to go — the tour does not click for you.
            </span>
          </p>
        )}

        <div className="tour-actions">
          <button
            ref={initialFocusRef}
            type="button"
            className="btn secondary"
            onClick={() => close()}
          >
            Skip
          </button>
          <div className="tour-nav">
            <button
              type="button"
              className="btn secondary"
              disabled={isFirst}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              Back
            </button>
            {isLast ? (
              <button type="button" className="btn" onClick={() => close()}>
                Done
              </button>
            ) : (
              <button
                type="button"
                className="btn"
                onClick={() => setIndex((i) => Math.min(STEPS.length - 1, i + 1))}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
