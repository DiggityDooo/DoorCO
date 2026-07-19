import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/realdoor/app-shell";
import { PaperCard } from "@/components/realdoor/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Edit3, AlertCircle, FileText, Search } from "lucide-react";
import { useRealDoor } from "@/lib/realdoor-store";
import {
  FIELD_ALLOWLIST,
  FROZEN,
  sanitizeEvidenceSnippet,
  type ExtractedField,
} from "@/lib/realdoor-data";
import { isEvidenceExpired } from "@/lib/realdoor-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — RealDoor" },
      {
        name: "description",
        content: "Review OCR-extracted fields from a synthetic document and confirm each one.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const rd = useRealDoor();

  useEffect(() => {
    rd.visitStage("profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleFields = useMemo(
    () => rd.fields.filter((f) => FIELD_ALLOWLIST.has(f.id)),
    [rd.fields],
  );

  const [highlightFieldId, setHighlightFieldId] = useState<string | null>(null);

  if (!rd.consented || !rd.documentName) {
    return <Navigate to="/" />;
  }

  const confirmedCount = visibleFields.filter((f) => f.confirmed).length;
  const total = visibleFields.length;
  const pct = total ? Math.round((confirmedCount / total) * 100) : 0;
  const allReviewed = confirmedCount === total;
  const expired = isEvidenceExpired(rd.documentDate);

  return (
    <AppShell>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Stage 2 · Profile
          </div>
          <h1 className="ink-title mt-1 text-3xl sm:text-4xl">Review what we read</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            RealDoor extracts an allowlist of fields from your synthetic document. Confidence is an
            extraction-quality label, not an approval signal. Confirm or edit every field.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-foreground">
            {confirmedCount}/{total} confirmed · {pct}%
          </Badge>
        </div>
      </header>

      {expired && (
        <div
          role="status"
          className="mb-6 flex items-start gap-2 rounded-md border border-attention/50 bg-attention/15 p-3 text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden />
          <div>
            <div className="font-medium">Evidence outside currency window</div>
            <div className="text-xs text-muted-foreground">
              Document date {rd.documentDate}. Simulation date {FROZEN.simulationDate}. Evidence
              older than {FROZEN.evidenceCurrencyDays} days is flagged as expired. Not an
              eligibility decision.
            </div>
          </div>
        </div>
      )}

      {(() => {
        const { excludedLineCount, hadInjection } = sanitizeEvidenceSnippet(rd.evidenceSnippet);
        if (!hadInjection) return null;
        return (
          <div
            role="status"
            className="mb-6 flex items-start gap-2 rounded-md border border-border bg-accent/60 p-3 text-sm"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              <div className="font-medium">Unrelated content excluded from this document</div>
              <div className="text-xs text-muted-foreground">
                {excludedLineCount} {excludedLineCount === 1 ? "line was" : "lines were"} treated as
                inert data and left out of extraction. Document text is never used as instructions.
                No user action is required and no field was affected.
              </div>
            </div>
          </div>
        );
      })()}

      {/* Desktop: side-by-side. Mobile: tabs. */}
      <div className="hidden lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <DocumentPanel highlightFieldId={highlightFieldId} onHighlight={setHighlightFieldId} />
        <FieldsPanel onHover={setHighlightFieldId} highlight={highlightFieldId} />
      </div>

      <div className="lg:hidden">
        <Tabs defaultValue="fields">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="doc">Document</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
          </TabsList>
          <TabsContent value="doc" className="mt-3">
            <DocumentPanel highlightFieldId={highlightFieldId} onHighlight={setHighlightFieldId} />
          </TabsContent>
          <TabsContent value="fields" className="mt-3">
            <FieldsPanel onHover={setHighlightFieldId} highlight={highlightFieldId} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-paper p-4 text-sm">
        <div className="flex items-center gap-2">
          <Label htmlFor="hh" className="whitespace-nowrap">
            Household size
          </Label>
          <Input
            id="hh"
            type="number"
            min={1}
            max={8}
            value={rd.householdSize}
            onChange={(e) =>
              rd.setHouseholdSize(Math.min(8, Math.max(1, Number(e.target.value) || 1)))
            }
            className="w-20"
            aria-describedby="hh-hint"
          />
          <span id="hh-hint" className="text-[11px] text-muted-foreground">
            Frozen MTSP table covers 1–8.
          </span>
          <span className="text-xs text-muted-foreground">{rd.cityZip}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/understand">Continue to Understand</a>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function DocumentPanel({
  highlightFieldId,
  onHighlight,
}: {
  highlightFieldId: string | null;
  onHighlight: (id: string | null) => void;
}) {
  const rd = useRealDoor();

  const sanitized = useMemo(
    () => sanitizeEvidenceSnippet(rd.evidenceSnippet).text,
    [rd.evidenceSnippet],
  );

  const segments = useMemo(() => {
    const occurrences: { start: number; end: number; fieldId: string; text: string }[] = [];

    for (const f of rd.fields) {
      if (!FIELD_ALLOWLIST.has(f.id)) continue;
      const t = f.evidence.text;
      if (!t) continue;

      let idx = sanitized.indexOf(t);
      while (idx >= 0) {
        if (!occurrences.some((o) => o.start === idx)) {
          occurrences.push({
            start: idx,
            end: idx + t.length,
            fieldId: f.id,
            text: t,
          });
        }
        idx = sanitized.indexOf(t, idx + 1);
      }
    }

    occurrences.sort((a, b) => a.start - b.start);

    const result: { text: string; fieldId?: string }[] = [];
    let lastIdx = 0;

    for (const occ of occurrences) {
      if (occ.start >= lastIdx) {
        if (occ.start > lastIdx) {
          result.push({ text: sanitized.slice(lastIdx, occ.start) });
        }
        result.push({ text: sanitized.slice(occ.start, occ.end), fieldId: occ.fieldId });
        lastIdx = occ.end;
      }
    }

    if (lastIdx < sanitized.length) {
      result.push({ text: sanitized.slice(lastIdx) });
    }

    return result;
  }, [rd.fields, sanitized]);

  const scrollToField = (fieldId: string) => {
    onHighlight(fieldId);
    const el = document.getElementById(`field-card-${fieldId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary", "scale-[1.01]", "bg-accent/80");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-primary", "scale-[1.01]", "bg-accent/80");
      }, 1200);
    }
  };

  return (
    <PaperCard className="p-0">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{rd.documentName}</div>
            <div className="text-[11px] text-muted-foreground">
              {rd.documentType} · {rd.sizeKb} KB · {rd.pages} page · {rd.ocrEngine}
            </div>
          </div>
        </div>
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
          SYNTHETIC
        </span>
      </div>

      <div
        className="scan relative m-4 overflow-hidden rounded-md border border-border bg-paper p-4 font-mono text-[12.5px] leading-relaxed text-foreground"
        onMouseLeave={() => onHighlight(null)}
      >
        <pre className="whitespace-pre-wrap break-words">
          {segments.map((seg, i) => {
            if (!seg.fieldId) {
              return <span key={i}>{seg.text}</span>;
            }
            const isHighlighted = highlightFieldId === seg.fieldId;
            return (
              <button
                key={i}
                type="button"
                onClick={() => scrollToField(seg.fieldId!)}
                onMouseEnter={() => onHighlight(seg.fieldId!)}
                className={cn(
                  "cursor-pointer rounded font-mono px-1 py-0.5 transition-all text-left inline-block my-0.5",
                  isHighlighted
                    ? "bg-primary/20 text-foreground ring-2 ring-primary scale-[1.02] shadow font-semibold"
                    : "bg-primary/5 hover:bg-primary/15 hover:ring-1 hover:ring-primary/40 border border-dashed border-primary/20",
                )}
                title={`Click to focus matching field: ${seg.fieldId}`}
              >
                {seg.text}
              </button>
            );
          })}
        </pre>
      </div>

      <div className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
        <div className="flex items-start gap-1.5">
          <Search className="mt-0.5 h-3 w-3" aria-hidden />
          <span>
            Click a highlighted document segment to focus its extracted field card, or hover the
            cards directly.
          </span>
        </div>
      </div>
    </PaperCard>
  );
}

function FieldsPanel({
  highlight,
  onHover,
}: {
  highlight: string | null;
  onHover: (id: string | null) => void;
}) {
  const rd = useRealDoor();
  const list = rd.fields.filter((f) => FIELD_ALLOWLIST.has(f.id));

  return (
    <PaperCard className="p-0">
      <div className="border-b border-border px-4 py-3">
        <div className="text-sm font-medium">Extracted fields (allowlist)</div>
        <div className="text-[11px] text-muted-foreground">
          Uploaded document text is inert. Only these field IDs are read.
        </div>
      </div>
      <ul className="divide-y divide-border">
        {list.map((f) => (
          <FieldRow key={f.id} f={f} highlighted={highlight === f.id} onHover={onHover} />
        ))}
      </ul>
    </PaperCard>
  );
}

function FieldRow({
  f,
  highlighted,
  onHover,
}: {
  f: ExtractedField;
  highlighted: boolean;
  onHover: (id: string | null) => void;
}) {
  const rd = useRealDoor();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(f.value);

  return (
    <li
      id={`field-card-${f.id}`}
      onMouseEnter={() => onHover(f.id)}
      onFocus={() => onHover(f.id)}
      className={cn(
        "px-4 py-4 transition-all scroll-mt-24 border-l-2",
        highlighted ? "bg-accent/40 border-l-primary" : "border-l-transparent",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              {f.label}
            </span>
            <ConfidencePill f={f} />
            {f.confirmed && (
              <span
                aria-label="Confirmed by you"
                className="inline-flex items-center gap-1 rounded bg-[color:var(--color-success)]/10 px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-success)] border border-[color:var(--color-success)]/30"
              >
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                Confirmed
              </span>
            )}
            {f.id === "monthly_benefit" && rd.activeScenarioId === "HH-003" && (
              <span className="inline-flex items-center gap-1 rounded bg-[color:var(--color-attention)]/15 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-attention-foreground)] border border-[color:var(--color-attention)]/30 animate-pulse">
                Demo correction moment
              </span>
            )}
          </div>
          {editing ? (
            <Input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="mt-2 h-8 max-w-xs text-sm"
            />
          ) : (
            <div className="mt-1 text-[15px] font-semibold text-foreground">{f.value}</div>
          )}
          {f.suggested && !f.confirmed && (
            <button
              type="button"
              className="mt-1.5 text-xs text-primary font-medium hover:underline block"
              onClick={() => {
                rd.setField(f.id, { value: f.suggested! });
                setDraft(f.suggested!);
              }}
            >
              Suggested correction: {f.suggested}
            </button>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          {editing ? (
            <>
              <Button
                size="sm"
                onClick={() => {
                  rd.setField(f.id, { value: draft });
                  rd.confirmField(f.id);
                  setEditing(false);
                  toast.success("Field updated and confirmed");
                }}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDraft(f.value);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
                aria-label={`Edit ${f.label}`}
              >
                <Edit3 className="h-3.5 w-3.5" aria-hidden />
                <span>Edit</span>
              </Button>
              <Button
                size="sm"
                disabled={f.confirmed}
                onClick={() => rd.confirmField(f.id)}
                aria-label={`Confirm ${f.label}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                <span>Confirm</span>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mt-2 text-[11px] font-mono text-muted-foreground bg-muted/30 p-1.5 rounded border border-border/40 inline-block">
        Page {f.evidence.page}, Line {f.evidence.line} · &ldquo;{f.evidence.text}&rdquo;
      </div>
    </li>
  );
}

function ConfidencePill({ f }: { f: ExtractedField }) {
  const label = f.confidenceLabel;
  const pct = Math.round(f.confidence * 100);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded bg-muted/40 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground border border-border/50 shadow-sm"
      title="Extraction quality — not an approval signal"
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          label === "High"
            ? "bg-[color:var(--color-success)]"
            : label === "Medium"
              ? "bg-[color:var(--color-warning)]"
              : "bg-[color:var(--color-attention)]",
        )}
      />
      {label} · {pct}%
    </span>
  );
}
