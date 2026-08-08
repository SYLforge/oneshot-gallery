"use client";

import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { inter, notoSansKR, spaceGrotesk } from "./fonts";
import Hero from "./components/Hero";
import ExplodedBuild from "./components/ExplodedBuild";
import ColorwayPicker from "./components/ColorwayPicker";
import OrbitFooter from "./components/OrbitFooter";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useReveal } from "./hooks/useReveal";
import type { Colorway } from "./components/sneaker";

/**
 * ORBIT — studio configurator. A fictional studio that drops one silhouette
 * at a time; the page IS the configurator. A procedural canvas turntable
 * holds the signature sneaker under a seamless cyclorama — drag to orbit it
 * 360° with real specular lighting and a turntable contact shadow. Three
 * colorways, an exploded build scrubbed by scroll, and panels that wipe in.
 *
 * `.orbit-js` is added on mount so every scroll-reveal and clip-wipe
 * pre-state is JS-gated — with JavaScript disabled the full page is simply
 * readable, the canvas turntable replaced by its CSS seamless understudy
 * and the angle held at the hero pose.
 */
export default function OrbitPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [colorway, setColorway] = useState<Colorway["id"]>("ember");

  useReveal(rootRef, reduced);

  useEffect(() => {
    rootRef.current?.classList.add("orbit-js");
    window.parent?.postMessage(
      { type: "oneshot:ready", slug: "orbit" },
      "*",
    );
  }, []);

  return (
    <div
      id="orbit-top"
      ref={rootRef}
      className="orbit-root"
      // `orbit-js` is NOT in the className on purpose: it is added on mount
      // by the effect above so the SSR/ no-JS markup is the completed page,
      // and every reveal pre-state (gated behind .orbit-js) stays hidden only
      // when JavaScript is actually alive.
    >
      <Hero colorway={colorway} reduced={reduced} />
      <main>
        <ExplodedBuild />
        <ColorwayPicker colorway={colorway} onPick={setColorway} />
      </main>
      <OrbitFooter />
    </div>
  );
}
