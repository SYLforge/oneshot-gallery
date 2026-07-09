"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PRESETS = [
  { id: "desktop", label: "Desktop 1440", width: 1440 },
  { id: "tablet", label: "Tablet 768", width: 768 },
  { id: "mobile", label: "Mobile 390", width: 390 },
] as const;

type PresetId = (typeof PRESETS)[number]["id"];

export type PreviewFrameLabels = {
  loadDemo: string;
  loading: string;
  openFull: string;
  reload: string;
  viewportAria: string;
};

/**
 * Framed live-demo area. The iframe mounts only when the panel scrolls
 * near the viewport (or on explicit play), stays invisible until the demo
 * posts {type:"oneshot:ready"}, and can be resized between three
 * viewport presets.
 */
export default function PreviewFrame({
  slug,
  title,
  labels,
}: {
  slug: string;
  title: string;
  labels: PreviewFrameLabels;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const readyTimer = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState<PresetId>("desktop");
  const [frameKey, setFrameKey] = useState(0);

  // Mount the iframe when the panel approaches the viewport.
  useEffect(() => {
    if (mounted) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  // The demo announces itself when it has painted.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: unknown; slug?: unknown } | null;
      if (data && data.type === "oneshot:ready" && data.slug === slug) {
        if (readyTimer.current !== null) window.clearTimeout(readyTimer.current);
        setReady(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [slug]);

  useEffect(
    () => () => {
      if (readyTimer.current !== null) window.clearTimeout(readyTimer.current);
    },
    [],
  );

  // Safety net for demos that load but never post ready.
  const handleLoad = useCallback(() => {
    if (readyTimer.current !== null) window.clearTimeout(readyTimer.current);
    readyTimer.current = window.setTimeout(() => setReady(true), 4000);
  }, []);

  const reload = useCallback(() => {
    if (readyTimer.current !== null) window.clearTimeout(readyTimer.current);
    setReady(false);
    setFrameKey((k) => k + 1);
  }, []);

  const activePreset = PRESETS.find((p) => p.id === preset) ?? PRESETS[0];

  return (
    <div ref={rootRef}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-3">
        <div
          role="group"
          aria-label={labels.viewportAria}
          className="flex flex-wrap items-center gap-1"
        >
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              aria-pressed={p.id === preset}
              className={`border-b px-2 py-1 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 ease-out ${
                p.id === preset
                  ? "border-accent text-text"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2">
          {mounted && (
            <button
              type="button"
              onClick={reload}
              className="border-b border-transparent px-1 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:text-text"
            >
              {labels.reload}
            </button>
          )}
          <a
            href={`/view/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="border-b border-transparent px-1 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:text-text"
          >
            {labels.openFull}
          </a>
        </div>
      </div>

      <div
        className="mx-auto w-full transition-[max-width] duration-[250ms] ease-out motion-reduce:transition-none"
        style={{ maxWidth: `${activePreset.width}px` }}
      >
        <div className="relative aspect-[16/10] overflow-hidden border border-hairline bg-surface">
          {mounted ? (
            <>
              <iframe
                key={frameKey}
                src={`/view/${slug}`}
                title={title}
                loading="lazy"
                onLoad={handleLoad}
                className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                  ready ? "opacity-100" : "opacity-0"
                }`}
              />
              {!ready && (
                <div
                  role="status"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3"
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-accent motion-safe:animate-pulse"
                  />
                  <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
                    {labels.loading}
                  </span>
                </div>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => setMounted(true)}
              className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4"
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-200 ease-out group-hover:scale-125 motion-reduce:transition-none"
              />
              <span className="border border-hairline px-4 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-muted transition-colors duration-200 ease-out group-hover:border-accent/60 group-hover:text-text">
                {labels.loadDemo}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
