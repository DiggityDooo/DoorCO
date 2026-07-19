"use client";

import Link from "next/link";
import { startGuidedTour } from "@/components/guided-tour";

type DocLink = { id: string; type: string };

type Props = {
  metro: string;
  program: string;
  ruleYear: string;
  effectiveDate: string;
  geography: string;
  amiThreshold: number;
  /** Neutral published income limit for a 4-person household at the demo AMI band — not a score. */
  hh4Limit: number;
  docs: DocLink[];
};

const STAGES = [
  {
    key: "profile",
    href: "/profile",
    title: "Profile",
    blurb: "Upload a sample document. Confirm or fix each extracted field.",
  },
  {
    key: "understand",
    href: "/understand",
    title: "Understand",
    blurb: "See the income limit, math, source, and date for your confirmed numbers.",
  },
  {
    key: "prepare",
    href: "/prepare",
    title: "Prepare",
    blurb: "Check missing papers, then download or delete your packet. You stay in control.",
  },
  {
    key: "session",
    href: "/session",
    title: "Session",
    blurb: "Export or delete your session whenever you choose.",
  },
] as const;

export function BentoHome({
  metro,
  program,
  ruleYear,
  effectiveDate,
  geography,
  amiThreshold,
  hh4Limit,
  docs,
}: Props) {
  return (
    <div className="bento-home">
      <section className="bento-hero">
        <p className="bento-kicker">
          <span className="badge info">Pilot</span>
          <span className="bento-kicker-text">You confirm. A qualified human decides.</span>
        </p>
        <h1 className="bento-brand">RealDoor</h1>
        <p className="bento-lede">
          A clear, renter-controlled workspace to prepare {program} application materials for{" "}
          {metro}. We explain rules and surface gaps — never make a decision for you.
        </p>
        <div className="bento-cta-row">
          <button type="button" className="btn" onClick={() => startGuidedTour()}>
            Take the guided tour
          </button>
          <Link className="btn secondary" href="/profile">
            Build your profile
          </Link>
          <Link className="btn secondary" href="/transparency">
            What we use &amp; why
          </Link>
        </div>
      </section>

      <div className="bento-grid" aria-label="Pilot facts and journey">
        <article className="bento-tile bento-tile--wide">
          <div className="bento-visual bento-visual--scope" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h2 className="bento-tile-title">Frozen pilot scope</h2>
          <p className="bento-tile-body">
            One metro, one program, one rule year. Numbers come from the official published
            income-limit table — not from guesses or AI invention.
          </p>
          <dl className="bento-facts">
            <div>
              <dt>Area</dt>
              <dd>{geography}</dd>
            </div>
            <div>
              <dt>Program / year</dt>
              <dd>
                {program} · {ruleYear}
              </dd>
            </div>
            <div>
              <dt>Effective</dt>
              <dd>{effectiveDate}</dd>
            </div>
          </dl>
        </article>

        <article className="bento-tile bento-tile--stat">
          <div className="bento-visual bento-visual--stat" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="bento-stat-label">
            Income limit · 4-person household · {amiThreshold}% AMI
          </p>
          <p className="bento-stat-line">
            $
            <span className="bento-stat-num" data-hh4-limit={hh4Limit}>
              {hh4Limit.toLocaleString("en-US")}
            </span>
            <span className="bento-stat-unit">/ year</span>
          </p>
          <p className="bento-tile-body">
            AMI / MTSP here means the published income limit for your household size. This number is
            a fact from the table — not a score, rank, or approval.
          </p>
        </article>

        <article className="bento-tile bento-tile--assist">
          <div className="bento-visual bento-visual--assist" aria-hidden="true">
            <span />
            <span />
          </div>
          <h2 className="bento-tile-title">Assistive only</h2>
          <ul className="bento-checklist">
            <li>Extracts fields you can correct</li>
            <li>Shows citations and effective dates</li>
            <li>Flags missing or outdated documents</li>
            <li>Never approves, denies, or ranks</li>
          </ul>
        </article>

        {STAGES.map((s, i) => (
          <Link
            key={s.key}
            href={s.href}
            className={`bento-tile bento-tile--stage bento-tile--${s.key}`}
          >
            <span className="bento-stage-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="bento-stage-rail" aria-hidden="true" />
            <h2 className="bento-tile-title">{s.title}</h2>
            <p className="bento-tile-body">{s.blurb}</p>
            <span className="bento-tile-go">Open →</span>
          </Link>
        ))}

        <article className="bento-tile bento-tile--docs">
          <div className="bento-visual bento-visual--docs" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h2 className="bento-tile-title">Try a sample document</h2>
          <p className="bento-tile-body">Synthetic demo files only — no real personal data.</p>
          <ul className="plain bento-doc-list">
            {docs.map((d) => (
              <li key={d.id}>
                <code>{d.id}</code> — {d.type}{" "}
                <Link href={`/profile?doc=${d.id}`}>open in Profile</Link>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
