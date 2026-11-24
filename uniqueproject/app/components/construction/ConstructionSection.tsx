"use client";

import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/manrope";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { ConstructionOverlay } from "./ConstructionOverlay";
import { useConstructionTimeline } from "./ConstructionTimeline";
import { constructionStages } from "./constructionStages";

const ConstructionScene = dynamic(() => import("./ConstructionScene"), {
  ssr: false,
  loading: () => <p className="construction-message" role="status">Loading the 3D site…</p>,
});

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ConstructionSection() {
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [reduced, setReduced] = useState<boolean | null>(null);
  const [available, setAvailable] = useState(true);
  const [progress, setProgress] = useState(0);
  const interactive = reduced === false && available;
  const showSteps = reduced === true || !available;
  const stage = Math.min(constructionStages.length - 1, Math.floor(progress * constructionStages.length));

  useConstructionTimeline(section, panel, interactive, setProgress);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(motion.matches);
    update();
    motion.addEventListener("change", update);
    const element = section.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNear(true);
      observer.disconnect();
    }, { rootMargin: "100% 0px" });
    if (element) observer.observe(element);

    return () => {
      motion.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="process" ref={section} className="construction" aria-labelledby="construction-title">
      <div ref={panel} className="construction-panel grid items-center">
        <div className="construction-viewport relative isolate overflow-hidden">
          {near && available && reduced !== null && (
            <SceneBoundary onFailure={() => setAvailable(false)}>
              <ConstructionScene progress={reduced ? 1 : progress} still={reduced} />
            </SceneBoundary>
          )}
          {!available && (
            <p className="construction-message">3D preview unavailable on this device.</p>
          )}
        </div>
        <ConstructionOverlay stage={stage} progress={progress} interactive={interactive}>
          {!showSteps ? (
            <div className="construction-stage">
              <span>0{stage + 1} / 0{constructionStages.length}</span>
              <h3>{constructionStages[stage].title}</h3>
              <p>{constructionStages[stage].description}</p>
            </div>
          ) : (
            <details className="construction-steps">
              <summary>From the first drawing to the final handover</summary>
              <ol className="list-decimal pl-5">
                {constructionStages.map(({ title, description }) => (
                  <li key={title}><strong>{title}</strong> — {description}</li>
                ))}
              </ol>
            </details>
          )}
        </ConstructionOverlay>
      </div>
    </section>
  );
}
