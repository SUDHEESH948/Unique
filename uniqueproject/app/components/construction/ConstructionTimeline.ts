import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useConstructionTimeline(
  section: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  update: (progress: number) => void,
) {
  useEffect(() => {
    if (!enabled || !section.current || !panel.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = section.current;
    const pin = panel.current;
    const playhead = { progress: 0 };
    const context = gsap.context(() => {
      const headline = pin.querySelector("h2");
      if (headline) {
        gsap.from(headline.children, {
          y: 14,
          opacity: 0.55,
          stagger: 0.075,
          ease: "power2.out",
          scrollTrigger: {
            trigger,
            start: "top 90%",
            end: "top 35%",
            scrub: true,
          },
        });
      }

      gsap.to(playhead, {
        progress: 1,
        ease: "none",
        onUpdate: () => update(playhead.progress),
        scrollTrigger: {
          trigger,
          pin,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 4.5),
          scrub: 0.35,
          anticipatePin: 1,
        },
      });
    }, trigger);

    return () => context.revert();
  }, [enabled, panel, section, update]);
}
