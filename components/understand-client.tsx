"use client";

import { useState, useTransition } from "react";
import { askRule, computeReadiness } from "@/app/actions";
import { DEMO_CONFIG } from "@/data/config";
import type { RuleResult } from "@/lib/types";

export function UnderstandClient({
  initialResult,
  qa,
}: {
  initialResult: RuleResult | null;
  qa: { id: string; question: string; citation: string }[];
}) {
  const [result, setResult] = useState<RuleResult | null>(initialResult);
  const [answer, setAnswer] = useState<string | null>(null);
  const [citation, setCitation] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [pending, start] = useTransition();

  async function handleCalc() {
    start(async () => {
      const res = await computeReadiness();
      if (res.status === "success") setResult(res.data);
    });
  }

  async function handleAsk(prompt = question) {
    const normalizedQuestion = prompt.trim();
    if (!normalizedQuestion) return;
    start(async () => {
      const res = await askRule(normalizedQuestion);
      if (res.status === "success") {
        setAnswer(res.data.answer);
        setCitation(res.data.citation ?? null);
      }
    });
  }

  return (
    <div>
      <h1>Understand the rule</h1>
      <p className="notice">
        <span className="badge info">Pilot</span> For <strong>{DEMO_CONFIG.program}</strong> in{" "}
        <strong>{DEMO_CONFIG.ruleYear}</strong>, we compare your confirmed income to the published
        income limit for your household size ({DEMO_CONFIG.amiThreshold}% AMI / MTSP), effective{" "}
        <strong>{DEMO_CONFIG.effectiveDate}</strong>. That limit is a table fact — not a score. This
        screen never decides eligibility.
      </p>
      <p className="notice">You confirm. A qualified human decides.</p>

      <div className="card">
        <button className="btn" onClick={handleCalc} disabled={pending}>
          Compute income-to-limit readiness
        </button>
        {result && (
          <div style={{ marginTop: "1rem" }}>
            {result.abstained ? (
              <p className="error">
                Cannot compute yet: {result.abstainReason} Confirm your household size and annual
                income in Profile first.
              </p>
            ) : (
              <>
                <p>
                  <strong>Readiness:</strong>{" "}
                  <span className={`badge ${result.band === "below limit" ? "ok" : "warn"}`}>
                    {result.band}
                  </span>
                </p>
                <ul className="plain">
                  <li>Confirmed household size: {result.inputRefs.householdSize}</li>
                  <li>
                    Confirmed annual income: $
                    {Number(result.inputRefs.annualIncome).toLocaleString()}
                  </li>
                  <li>
                    {DEMO_CONFIG.amiThreshold}% AMI limit ({result.inputRefs.householdSize}-person):
                    ${result.threshold.toLocaleString()}
                  </li>
                  <li>
                    Formula: <code>{result.formula}</code>
                  </li>
                  <li>Result: {result.value}% of the limit</li>
                  <li>Effective date: {result.effectiveDate}</li>
                  <li>Geography: {result.geography}</li>
                </ul>
                <p className="evidence">Citation: {result.citation}</p>
                <p>
                  <a href={result.sourceUrl} target="_blank" rel="noreferrer">
                    Open authoritative source ↗
                  </a>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <h2>Ask about the rules</h2>
      <label className="label" htmlFor="q">
        Your question
      </label>
      <input
        id="q"
        className="input"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. How is the income limit determined?"
      />
      <p style={{ marginTop: "0.5rem" }}>
        <button className="btn secondary" onClick={() => void handleAsk()} disabled={pending}>
          Ask
        </button>
      </p>
      {answer && (
        <div className="card" role="status">
          <p>{answer}</p>
          {citation && <p className="evidence">Citation: {citation}</p>}
        </div>
      )}

      <h2>Common questions</h2>
      <ul className="plain">
        {qa.map((q) => (
          <li key={q.id}>
            <button
              className="btn secondary"
              onClick={() => {
                setQuestion(q.question);
                void handleAsk(q.question);
              }}
            >
              {q.question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
