import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/realdoor/app-shell";
import { PaperCard } from "@/components/realdoor/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Info, Map as MapIcon, Layers } from "lucide-react";
import { useRealDoor } from "@/lib/realdoor-store";
import { PROPERTIES, type PropertyListing } from "@/lib/realdoor-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — RealDoor" },
      {
        name: "description",
        content:
          "Browse an unranked list of Boston-area affordable properties. Availability is unknown; RealDoor does not rank or filter by eligibility.",
      },
    ],
  }),
  component: DiscoverPage,
});

// Relative coordinate mapping for our abstract SVG Boston map
const MAP_COORDS: Record<string, { x: number; y: number; label: string }> = {
  "p-01": { x: 130, y: 230, label: "Roxbury" },
  "p-02": { x: 90, y: 150, label: "Cambridge" },
  "p-03": { x: 240, y: 270, label: "Quincy" },
  "p-04": { x: 160, y: 260, label: "Dorchester" },
  "p-05": { x: 80, y: 100, label: "Somerville" },
  "p-06": { x: 140, y: 70, label: "Malden" },
  "p-07": { x: 195, y: 110, label: "Chelsea" },
  "p-08": { x: 275, y: 55, label: "Lynn" },
};

function DiscoverPage() {
  const rd = useRealDoor();
  useEffect(() => {
    rd.visitStage("discover"); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  const [q, setQ] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>("p-01");
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);

  const list = useMemo(() => {
    const zip = rd.municipalityFilter.trim().toLowerCase();
    const query = q.trim().toLowerCase();
    return PROPERTIES.filter((p) => {
      const matchesFilter =
        !zip || p.zip.toLowerCase().includes(zip) || p.municipality.toLowerCase().includes(zip);
      const matchesQuery =
        !query || p.name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [q, rd.municipalityFilter]);

  const hidden = PROPERTIES.length - list.length;

  const currentSelection = useMemo(() => {
    return PROPERTIES.find((p) => p.id === (hoveredId || selectedId)) || PROPERTIES[0];
  }, [hoveredId, selectedId]);

  return (
    <AppShell>
      <header className="mb-6">
        <div className="text-[11px] uppercase font-mono tracking-[0.14em] text-muted-foreground">
          Stage 1 · Discover
        </div>
        <h1 className="ink-title mt-1 text-3xl sm:text-4xl">Boston-area properties</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Unfiltered public property set. Unranked list — RealDoor does not order results by
          suitability, eligibility, or predicted match. Availability is unknown; contact each
          property directly.
        </p>
      </header>

      {/* Segmented controls for mobile toggling */}
      <div className="flex rounded-lg bg-muted p-1 mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setShowMapOnMobile(false)}
          className={cn(
            "flex-1 rounded-md py-1.5 text-xs font-medium transition-all",
            !showMapOnMobile ? "bg-paper text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          List View ({list.length})
        </button>
        <button
          type="button"
          onClick={() => setShowMapOnMobile(true)}
          className={cn(
            "flex-1 rounded-md py-1.5 text-xs font-medium transition-all",
            showMapOnMobile ? "bg-paper text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          Public Location Context
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column (Search + Listings) */}
        <div className={cn("space-y-4", showMapOnMobile ? "hidden lg:block" : "block")}>
          <PaperCard className="p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="q" className="text-xs font-medium">
                  Search by name or address
                </Label>
                <div className="relative mt-1">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="q"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-8 text-sm"
                    placeholder="e.g. Franklin Park"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zip" className="text-xs font-medium">
                  Municipality or ZIP (optional)
                </Label>
                <Input
                  id="zip"
                  value={rd.municipalityFilter}
                  onChange={(e) => rd.setMunicipalityFilter(e.target.value)}
                  className="mt-1 text-sm"
                  placeholder="e.g. Cambridge or 02139"
                />
              </div>
            </div>
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground border-t border-border/45 pt-2.5">
              <p className="flex items-start gap-1.5">
                <Info className="mt-0.5 h-3 w-3 shrink-0 text-primary" aria-hidden />
                <span>
                  Locations have{" "}
                  <span className="font-semibold text-foreground">medium precision</span>. Verify
                  directly.
                </span>
              </p>
              <p aria-live="polite" className="tabular-nums font-mono">
                Showing <span className="font-semibold text-foreground">{list.length}</span> of{" "}
                {PROPERTIES.length}
                {hidden > 0 && (
                  <span className="text-[color:var(--color-attention-foreground)]">
                    {" "}
                    ({hidden} hidden)
                  </span>
                )}
              </p>
            </div>
          </PaperCard>

          <ul className="grid gap-4 sm:grid-cols-2">
            {list.map((p) => {
              const isActive = selectedId === p.id || hoveredId === p.id;
              return (
                <li
                  key={p.id}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedId(p.id)}
                  className="cursor-pointer"
                >
                  <PaperCard
                    className={cn(
                      "h-full p-4 border transition-all duration-200",
                      isActive
                        ? "border-primary/60 bg-accent/40 ring-1 ring-primary/20 shadow-md scale-[1.01]"
                        : "hover:border-border/85",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-base text-foreground leading-tight">
                          {p.name}
                        </h2>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
                          <span className="truncate">{p.address}</span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded bg-muted border border-border/50 px-1.5 py-0.5 text-[9px] font-mono uppercase text-muted-foreground">
                        Unknown
                      </span>
                    </div>
                    <dl className="mt-3.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono border-t border-border/30 pt-2.5">
                      <dt className="text-muted-foreground">Total units</dt>
                      <dd className="text-foreground text-right">{p.totalUnits}</dd>
                      <dt className="text-muted-foreground">Bedroom mix</dt>
                      <dd className="text-foreground text-right">{p.bedroomMix}</dd>
                    </dl>
                    {p.dataQualityFlags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {p.dataQualityFlags.map((flag) => (
                          <span
                            key={flag}
                            className="rounded bg-attention/15 px-1.5 py-0.5 text-[9px] font-mono text-[color:var(--color-attention-foreground)] border border-attention/20"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </PaperCard>
                </li>
              );
            })}
            {list.length === 0 && (
              <li className="col-span-full">
                <PaperCard className="p-8 text-center text-sm text-muted-foreground border-2 border-dashed">
                  No properties match this filter. Clear the search or municipality fields to view
                  all.
                </PaperCard>
              </li>
            )}
          </ul>
        </div>

        {/* Right Column (Public Location Context Map) */}
        <div className={cn("space-y-4", !showMapOnMobile ? "hidden lg:block" : "block")}>
          <PaperCard
            className="p-4 flex flex-col h-[520px] justify-between relative overflow-hidden"
            raised
          >
            <div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-foreground">
                    Public Location Context
                  </h2>
                </div>
                <Badge
                  variant="outline"
                  className="border-border text-[10px] font-mono uppercase bg-muted/30"
                >
                  Availability: Unknown
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-normal">
                Abstract spatial coordinates of properties in the unranked pilot set.
              </p>
            </div>

            {/* Abstract SVG Map */}
            <div className="my-4 bg-muted/40 rounded-xl border border-border/60 relative h-[250px] overflow-hidden">
              <svg
                className="w-full h-full text-muted-foreground/30 pointer-events-none"
                viewBox="0 0 320 300"
                aria-hidden="true"
              >
                {/* River network paths */}
                <path
                  d="M 0,160 Q 60,170 110,150 T 200,160 T 320,185"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeDasharray="3 3"
                  className="opacity-45"
                />
                <path
                  d="M 120,0 Q 140,50 160,100 T 200,160"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="2 2"
                  className="opacity-30"
                />

                {/* Abstract grid guides */}
                <line
                  x1="40"
                  y1="0"
                  x2="40"
                  y2="300"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="4"
                  className="opacity-15"
                />
                <line
                  x1="160"
                  y1="0"
                  x2="160"
                  y2="300"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="4"
                  className="opacity-15"
                />
                <line
                  x1="280"
                  y1="0"
                  x2="280"
                  y2="300"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="4"
                  className="opacity-15"
                />
                <line
                  x1="0"
                  y1="100"
                  x2="320"
                  y2="100"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="4"
                  className="opacity-15"
                />
                <line
                  x1="0"
                  y1="200"
                  x2="320"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="4"
                  className="opacity-15"
                />

                {/* Geography Text Anchors */}
                <text
                  x="35"
                  y="125"
                  className="text-[9px] font-mono fill-muted-foreground/50 uppercase font-semibold"
                >
                  Somerville
                </text>
                <text
                  x="45"
                  y="175"
                  className="text-[9px] font-mono fill-muted-foreground/50 uppercase font-semibold"
                >
                  Cambridge
                </text>
                <text
                  x="145"
                  y="215"
                  className="text-[9px] font-mono fill-muted-foreground/50 uppercase font-semibold"
                >
                  Roxbury
                </text>
                <text
                  x="175"
                  y="285"
                  className="text-[9px] font-mono fill-muted-foreground/50 uppercase font-semibold"
                >
                  Quincy
                </text>
                <text
                  x="215"
                  y="85"
                  className="text-[9px] font-mono fill-muted-foreground/50 uppercase font-semibold"
                >
                  Chelsea
                </text>
                <text
                  x="285"
                  y="30"
                  className="text-[9px] font-mono fill-muted-foreground/50 uppercase font-semibold"
                >
                  Lynn
                </text>
              </svg>

              {/* Interactive SVG Pins container */}
              <div className="absolute inset-0">
                {PROPERTIES.map((p, idx) => {
                  const coord = MAP_COORDS[p.id];
                  if (!coord) return null;

                  const isFilteredOut = !list.some((item) => item.id === p.id);
                  const isHovered = hoveredId === p.id || selectedId === p.id;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onMouseEnter={() => setHoveredId(p.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setSelectedId(p.id)}
                      className={cn(
                        "absolute w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all shadow-sm border -translate-x-1/2 -translate-y-1/2 cursor-pointer active:scale-95",
                        isFilteredOut
                          ? "bg-muted/10 border-muted-foreground/25 text-muted-foreground/35 opacity-40 pointer-events-none"
                          : isHovered
                            ? "bg-primary border-primary text-primary-foreground scale-125 z-20 shadow-md ring-4 ring-primary/20"
                            : "bg-paper border-border text-foreground hover:border-primary/50 hover:bg-accent/40 z-10",
                      )}
                      style={{ left: `${coord.x}px`, top: `${coord.y}px` }}
                      title={`${p.name} (${coord.label})`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Property Details Panel */}
            <div className="border-t border-border/60 pt-3 bg-muted/10 -mx-4 -mb-4 p-4 rounded-b-xl flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-1.5">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1 leading-snug">
                    {currentSelection.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-border/70 text-[9px] font-mono shrink-0"
                  >
                    ID: {currentSelection.id}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 font-mono">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">
                      {currentSelection.address} · {currentSelection.zip}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-0.5 border-t border-border/25 pt-1.5 mt-1.5">
                    <span className="text-muted-foreground/80">Total units:</span>
                    <span className="text-foreground text-right font-semibold">
                      {currentSelection.totalUnits}
                    </span>
                    <span className="text-muted-foreground/80">Bedroom mix:</span>
                    <span className="text-foreground text-right font-semibold">
                      {currentSelection.bedroomMix}
                    </span>
                    <span className="text-muted-foreground/80">Retrieved on:</span>
                    <span className="text-foreground text-right">
                      {currentSelection.retrievedOn}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[9.5px] font-mono text-muted-foreground mt-3 flex items-center justify-between border-t border-border/20 pt-2">
                <span className="truncate max-w-[210px]">{currentSelection.source}</span>
                <span className="shrink-0 bg-muted px-1 rounded border">PUBLIC</span>
              </div>
            </div>
          </PaperCard>
        </div>
      </div>
    </AppShell>
  );
}
