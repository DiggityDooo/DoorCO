import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import {
  UploadCloud,
  ArrowRight,
  ShieldCheck,
  Lock,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import { WelcomeStage } from "@/components/realdoor/welcome-stage";
import { AvatarGuide } from "@/components/realdoor/avatar-guide";
import { AppShell } from "@/components/realdoor/app-shell";
import { PaperCard } from "@/components/realdoor/glass-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRealDoor } from "@/lib/realdoor-store";
import { SCENARIOS, FROZEN, type ScenarioId } from "@/lib/realdoor-data";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome — RealDoor" },
      {
        name: "description",
        content:
          "RealDoor helps Boston-area renters prepare affordable-housing applications with confirmed inputs and HUD FY2026 LIHTC references. Assistive, not adjudicative.",
      },
      { property: "og:title", content: "Welcome — RealDoor" },
      {
        property: "og:description",
        content:
          "RealDoor helps Boston-area renters prepare affordable-housing applications with confirmed inputs and HUD FY2026 LIHTC references. Assistive, not adjudicative.",
      },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  const nav = useNavigate();
  const rd = useRealDoor();
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  const start = (scenario: ScenarioId | null, uploaded?: File) => {
    if (!agreed) {
      toast.error("Please review and accept the consent notice first.");
      return;
    }
    setBusy(true);
    rd.giveConsent();
    if (scenario) {
      rd.loadScenario(scenario);
    } else {
      rd.loadDemoDocument(uploaded?.name);
    }
    rd.visitStage("profile");
    setTimeout(() => nav({ to: "/profile" }), 120);
  };

  return (
    <AppShell showRail={false} showCopilot={false}>
      <main id="welcome-main" className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3">
                <AvatarGuide size={44} active />
                <span className="text-xs uppercase font-mono tracking-[0.16em] text-muted-foreground">
                  RealDoor Guide · Active Session Copilot
                </span>
              </div>
              <h1 className="ink-title mt-5 text-4xl leading-tight sm:text-5xl">
                Get ready to apply — with confidence you own.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                RealDoor helps Boston-area renters prepare affordable-housing applications under
                frozen HUD FY 2026 LIHTC rules. RealDoor is a preparation tool; final outcomes are
                decided entirely by human administrators.
              </p>
            </div>

            <PaperCard className="p-6" raised>
              <h2 className="text-base font-semibold border-b border-border/60 pb-3">
                Consent & Security Protocol
              </h2>
              <ul className="mt-4 space-y-3.5 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <span className="font-semibold text-foreground">100% Local & Ephemeral:</span>{" "}
                    Nothing leaves your browser. All document extractions reside solely in active
                    temporary memory.
                  </div>
                </li>
                <li className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <span className="font-semibold text-foreground">Inert Extractor:</span> Uploaded
                    text is treated as passive data. Prompt-injection attempts are rendered
                    completely inert and omitted from extraction.
                  </div>
                </li>
                <li className="flex gap-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <span className="font-semibold text-foreground">Strict Field Allowlist:</span>{" "}
                    RealDoor only queries pre-approved field IDs necessary for income evaluation. It
                    does not scan personal diaries or unrelated metadata.
                  </div>
                </li>
              </ul>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-accent/60 p-4">
                <Checkbox
                  id="consent"
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(v === true)}
                  aria-describedby="consent-desc"
                />
                <Label
                  htmlFor="consent"
                  className="text-sm leading-relaxed cursor-pointer select-none"
                >
                  <span className="font-semibold text-foreground block">
                    I accept the privacy protocol &amp; consent terms.
                  </span>
                  <span id="consent-desc" className="mt-1 block text-xs text-muted-foreground">
                    I agree to use synthetic example documents. RealDoor does not guarantee or
                    predict application outcomes. Read the{" "}
                    <Link to="/privacy" className="underline underline-offset-2 hover:text-primary">
                      Session &amp; Privacy
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/transparency"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Transparency
                    </Link>{" "}
                    guidelines.
                  </span>
                </Label>
              </div>

              <div className="mt-6">
                <label
                  className={cn(
                    "group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-paper p-6 text-center transition-all hover:border-primary hover:bg-accent/30",
                    !agreed && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <UploadCloud
                    className="h-8 w-8 text-primary transition-transform group-hover:scale-110"
                    aria-hidden
                  />
                  <span className="mt-3 text-sm font-semibold">Upload synthetic document</span>
                  <span className="mt-1 text-xs text-muted-foreground max-w-xs">
                    PDF, JPG, or PNG. Your document is processed locally on your machine.
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    disabled={!agreed || busy}
                    onChange={(e) => start(null, e.target.files?.[0] ?? undefined)}
                    className="sr-only"
                  />
                </label>
              </div>
            </PaperCard>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-paper/40 p-4">
              <h2 className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                Select a Synthetic Scenario Stack
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Explore preset test scenarios built to verify different safety postures and
                verification guidelines.
              </p>
            </div>

            <div className="grid gap-6">
              <ScenarioPaperStack
                id="HH-003"
                disabled={!agreed || busy}
                onClick={(id) => start(id)}
                title="HH-003 · Avery Moss"
                subtitle="Bi-weekly stub, monthly-benefit correction"
              />
              <ScenarioPaperStack
                id="HH-005"
                disabled={!agreed || busy}
                onClick={(id) => start(id)}
                title="HH-005 · Tess Alder"
                subtitle="Evidence currency check (flagged expired)"
              />
              <ScenarioPaperStack
                id="HH-002"
                disabled={!agreed || busy}
                onClick={(id) => start(id)}
                title="HH-002 · Jonas Vale"
                subtitle="Prompt-injection safety (inert block)"
              />
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function ScenarioPaperStack({
  id,
  title,
  subtitle,
  onClick,
  disabled,
}: {
  id: ScenarioId;
  title: string;
  subtitle: string;
  onClick: (id: ScenarioId) => void;
  disabled?: boolean;
}) {
  const s = SCENARIOS[id];
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group relative w-full text-left transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer h-[155px] flex items-stretch"
      aria-label={`Load scenario ${title}: ${s.headline}`}
    >
      {/* Back sheets for tactile look */}
      <div
        className={cn(
          "absolute inset-x-3 inset-y-1.5 rounded-xl border border-border bg-paper shadow-sm transition-all duration-300 origin-bottom-left",
          hovered ? "rotate-[-2.5deg] translate-x-[-3px] translate-y-[-3px]" : "rotate-[-1.2deg]",
        )}
        style={{ zIndex: 1 }}
      />
      <div
        className={cn(
          "absolute inset-x-1.5 inset-y-0.5 rounded-xl border border-border bg-paper/95 shadow-sm transition-all duration-300 origin-bottom-right",
          hovered ? "rotate-[2deg] translate-x-[3px] translate-y-[-1.5px]" : "rotate-[0.8deg]",
        )}
        style={{ zIndex: 2 }}
      />

      {/* Front sheet (main card) */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl border p-4 bg-paper transition-all duration-300 flex flex-col justify-between shadow-sm",
          hovered ? "border-primary/60 -translate-y-1 shadow-md bg-paper" : "border-border",
        )}
        style={{ zIndex: 3 }}
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              {id}
            </span>
            {/* Stamp-like indicator */}
            {id === "HH-003" && (
              <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-mono font-medium text-accent-foreground border border-border">
                Correction invited
              </span>
            )}
            {id === "HH-005" && (
              <span className="rounded bg-[color:var(--color-attention)]/15 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-[color:var(--color-attention-foreground)] border border-[color:var(--color-attention)]/35">
                EXPIRED EVIDENCE
              </span>
            )}
            {id === "HH-002" && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-primary border border-primary/25">
                INJECTION INERT
              </span>
            )}
          </div>

          <h3 className="font-semibold text-base text-foreground leading-snug">
            {s.applicantName}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{s.headline}</p>
        </div>

        {/* Telemetry metadata footer */}
        <div className="mt-3 border-t border-border/40 pt-2.5 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
          <span className="truncate max-w-[180px]">{s.documentName}</span>
          <span className="shrink-0">
            {s.sizeKb} KB · {s.pages} Page
          </span>
        </div>
      </div>
    </button>
  );
}
