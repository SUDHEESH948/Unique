import type { ReactNode } from "react";

export function ConstructionOverlay({
  stage, progress, interactive, children,
}: {
  stage: number;
  progress: number;
  interactive: boolean;
  children: ReactNode;
}) {
  return (
    <div className="construction-copy grid content-center gap-4">
      <div className="section-label"><span>04</span> Our process</div>
      <h2 id="construction-title">
        <span>If you can</span>
        <em>Dream it...</em>
        <span>We can</span>
        <strong>Build it.</strong>
      </h2>
      {children}
      {interactive && (
        <progress className="construction-progress w-full" value={progress} max={1} aria-label="Construction progress" />
      )}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {interactive && stage === 0 && <span className="construction-scroll">↓ Scroll to build</span>}
        <a className="text-link" href="#projects">Explore projects ↗</a>
      </div>
    </div>
  );
}
