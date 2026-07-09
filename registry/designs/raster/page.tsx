"use client";

import { useEffect, useRef } from "react";
import "./styles.css";
import { archivo, ibmPlexSansKR, spaceMono } from "./fonts";
import GridProvider, { GridToggle } from "./components/GridProvider";
import Hero from "./components/Hero";
import ModularScale from "./components/ModularScale";
import SpecimenTable from "./components/SpecimenTable";
import Footer from "./components/Footer";

/**
 * RASTER — bureau for grid systems.
 * A fictional standards bureau that certifies grid systems the way a
 * metrology institute certifies weights. Three colors (paper, ink, one
 * red), one typeface family whose WIDTH axis does the talking, and a
 * 6↔12 column re-certification that FLIPs the whole sheet into place.
 *
 * `.raster-js` is added on mount so every entrance animation and FLIP
 * transition is JS-gated — with JavaScript disabled the page is simply the
 * finished document: twelve columns, statically correct.
 */
export default function RasterPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Imperative on purpose: the class is a signal to CSS that JS is alive,
    // not React state — and it never changes once set.
    rootRef.current?.classList.add("raster-js");
    window.parent?.postMessage({ type: "oneshot:ready", slug: "raster" }, "*");
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${archivo.variable} ${ibmPlexSansKR.variable} ${spaceMono.variable} raster-root`}
    >
      <GridProvider>
        <Hero />
        <main>
          <GridToggle />
          <ModularScale />
          <SpecimenTable />
        </main>
        <Footer />
      </GridProvider>
    </div>
  );
}
