import { lazy, Suspense, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Lazy so three.js only loads client-side after hydration
const Scene = lazy(() => import("./guide-avatar-3d.scene"));

interface Props {
  className?: string;
  /** Height utility class, e.g. "h-48". Width fills container. */
  heightClassName?: string;
}

/**
 * RealDoor Guide — 3D read-only avatar.
 * - Renders GLB with @react-three/fiber + drei.
 * - Subtle idle sway/breathing; static under prefers-reduced-motion.
 * - Never animates approval, judgment, or emotional assessment.
 */
export function GuideAvatar3D({ className, heightClassName = "h-40" }: Props) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-gradient-to-b from-muted/50 to-paper border-b border-border",
        heightClassName,
        className,
      )}
      role="img"
      aria-label="RealDoor Guide avatar"
    >
      {/* Subtle paper grid texture backdrop */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none text-foreground"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Decorative municipal "city-light" glow elements */}
      <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-primary/40 pointer-events-none animate-pulse" />
      <div className="absolute bottom-12 right-8 w-1 h-1 rounded-full bg-primary/25 pointer-events-none" />
      <div className="absolute top-1/3 right-12 w-1.5 h-1.5 rounded-full bg-primary/15 pointer-events-none animate-pulse [animation-duration:3s]" />

      {hydrated ? (
        <Suspense fallback={<AvatarSkeleton />}>
          <Scene />
        </Suspense>
      ) : (
        <AvatarSkeleton />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}

function AvatarSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center text-[11px] text-muted-foreground">
      <div className="h-16 w-16 animate-pulse rounded-full bg-accent/70" />
    </div>
  );
}
