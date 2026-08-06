"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./styles.css";
import { jetbrainsMono, notoSansKR } from "./fonts";
import { useReveal } from "./hooks/useReveal";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const TITLE = "ASCII";

/**
 * ASCII 아스키 — pictures drawn in characters. The signature is an ASCII
 * density-field renderer on canvas: a brightness function (a lit sphere, a
 * sine landscape) is sampled on a character grid and each cell is mapped to
 * a char on the ramp .:-=+*#%@, then drawn green-on-black like a phosphor
 * terminal. Every value is NaN-guarded (clamped radii, Number.isFinite
 * fallback) so a single bad sample never crashes the page.
 *
 * `.ascii-js` is added on mount so the no-JS markup is the finished page:
 * the canvas replaced by a static ASCII understudy <pre>, the wordmark lit.
 */
export default function AsciiPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const sphereRef = useRef<HTMLCanvasElement | null>(null);
  const landRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("ascii-js");
    const id = requestAnimationFrame(() => root.classList.add("is-mounted"));
    window.parent?.postMessage({ type: "oneshot:ready", slug: "ascii" }, "*");
    return () => cancelAnimationFrame(id);
  }, []);

  // ASCII sphere renderer. brightness = diffuse shading of a lit sphere,
  // mapped to the char ramp. Slowly rotating light source. NaN-safe.
  useEffect(() => {
    const canvas = sphereRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const RAMP = " .:-=+*#%@";
    const COLS = 46;
    const ROWS = 22;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();

    let raf = 0;
    let t = 0;
    const fontPx = 13;

    const render = () => {
      t += reduced ? 0 : 0.012;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#020604";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontPx}px var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, monospace`;
      ctx.font = `${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";

      const cellW = w / COLS;
      const cellH = h / ROWS;
      // light direction (normalized), slowly orbiting
      const lx = Math.cos(t * 0.6);
      const ly = -0.5;
      const lz = Math.sin(t * 0.6);
      const llen = Math.max(1e-6, Math.sqrt(lx * lx + ly * ly + lz * lz));

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          // normalized coords centered in the grid
          const u = (col / (COLS - 1)) * 2 - 1; // -1..1
          const v = (row / (ROWS - 1)) * 2 - 1; // -1..1
          // sphere: only inside the unit disc has shading
          const r2 = u * u + v * v;
          if (r2 > 1) {
            ctx.fillStyle = "rgba(94, 255, 160, 0.05)";
            ctx.fillText(" ", col * cellW, row * cellH);
            continue;
          }
          // z on the front hemisphere
          const z = Math.sqrt(Math.max(0, 1 - r2));
          // surface normal = (u, -v mapping to y up, z)
          const nx = u;
          const ny = -v;
          const dot = (nx * lx + ny * ly + z * lz) / llen;
          let bright = dot; // -1..1
          if (!Number.isFinite(bright)) bright = 0;
          // ambient + diffuse, clamp 0..1
          let intensity = 0.12 + 0.88 * Math.max(0, bright);
          if (!Number.isFinite(intensity)) intensity = 0;
          intensity = Math.max(0, Math.min(1, intensity));
          const idx = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.round(intensity * (RAMP.length - 1))),
          );
          const ch = RAMP[idx];
          // edge of the disc reads dimmer; core reads brighter green
          const edgeFade = Math.max(0, 1 - r2);
          const alpha = 0.25 + 0.75 * edgeFade;
          ctx.fillStyle = `rgba(94, 255, 160, ${alpha.toFixed(3)})`;
          ctx.fillText(ch, col * cellW, row * cellH);
        }
      }
      if (!reduced) raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      resize();
      if (reduced) render();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // ASCII sine landscape renderer. brightness = height of a sum of sines,
  // mapped to the char ramp, scrolling horizontally. NaN-safe.
  useEffect(() => {
    const canvas = landRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const RAMP = " .:-=+*#%@";
    const COLS = 70;
    const ROWS = 20;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();

    let raf = 0;
    let t = 0;
    const fontPx = 12;

    const render = () => {
      t += reduced ? 0 : 0.03;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#020604";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";

      const cellW = w / COLS;
      const cellH = h / ROWS;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const u = col / (COLS - 1); // 0..1
          const v = row / (ROWS - 1); // 0..1
          // heightfield: a couple of sines traveling in u, perspective in v
          const wave =
            Math.sin((u * 6 - t) * 1.0) * 0.5 +
            Math.sin((u * 3 + v * 4 - t * 0.7) * 1.0) * 0.3 +
            Math.cos((v * 5 + t * 0.4) * 1.0) * 0.2;
          let hgt = (wave + 1) / 2; // 0..1
          if (!Number.isFinite(hgt)) hgt = 0;
          hgt = Math.max(0, Math.min(1, hgt));
          // perspective: rows further "back" (lower v) read dimmer
          const persp = 0.4 + 0.6 * v;
          let intensity = hgt * persp;
          if (!Number.isFinite(intensity)) intensity = 0;
          intensity = Math.max(0, Math.min(1, intensity));
          const idx = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.round(intensity * (RAMP.length - 1))),
          );
          const ch = RAMP[idx];
          ctx.fillStyle = `rgba(94, 255, 160, ${(0.3 + 0.7 * hgt).toFixed(3)})`;
          ctx.fillText(ch, col * cellW, row * cellH);
        }
      }
      if (!reduced) raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      resize();
      if (reduced) render();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`${jetbrainsMono.variable} ${notoSansKR.variable} ascii-root`}
    >
      <div className="ascii-grid-bg" aria-hidden="true" />
      <div ref={revealRef} className="ascii-doc">
        <header className="ascii-hero" data-reveal="">
          <p className="as-kicker">
            <span lang="ko">아스키 아트 렌더러</span> · ASCII RENDERER · v.064
          </p>
          <h1 className="as-title" aria-label={TITLE}>
            <span aria-hidden="true" className="as-title__row">
              {TITLE.split("").map((ch, i) => (
                <span
                  key={i}
                  className="ascii-glyph"
                  style={{ "--as-i": i } as CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span lang="ko" className="as-title__kr" aria-hidden="true">
              아스키
            </span>
          </h1>
          <p className="as-sub" data-reveal="">
            <span lang="ko">문자로 그린 그림.</span> Pictures drawn in characters —
            a density field mapped to{" "}
            <code className="as-ramp">.:-=+*#%@</code>.
          </p>
        </header>

        <section className="as-stage" aria-labelledby="as-sphere-title">
          <div className="as-sechead" data-reveal="">
            <p className="as-eyebrow">
              02 — <span lang="ko">구</span> · the sphere
            </p>
            <h2 id="as-sphere-title" className="as-secthead__title">
              lit sphere
            </h2>
            <p className="as-secthead__kr" lang="ko">
              빛이 도는 구 — 확산 음영을 문자로.
            </p>
          </div>
          <div className="as-frame" data-reveal="">
            {/* No-JS understudy: a static ASCII sphere the page ships with. */}
            <pre className="as-understudy" aria-hidden="true">{`        .....         
     .:=+*#%%*=:..     
   :=+*#%%@@@@%#*+=:.   
  =+*#%@@@@@@@@@@%#*+=  
 :*#%@@@@@@@@@@@@@@%#*: 
:+#%@@@@@@@@@@@@@@@@%#+:
=*%@@@@@@@@@@@@@@@@@@%*=
=+%@@@@@@@@@@@@@@@@@@%+=
 :*#%@@@@@@@@@@@@@@%#*: 
  =+*#%@@@@@@@@@@%#*+=  
   :=+*#%%@@@@%#*+=:.   
     .:=+*#%%*=:..     
        .....         `}</pre>
            <canvas
              ref={sphereRef}
              className="as-canvas"
              aria-label="ASCII 렌더: 빛이 도는 구. ASCII render: a lit sphere rotating under a moving light."
            />
            <p className="as-readout">
              <span lang="ko">확산 음영 → 문자 램프</span> · DIFFUSE → RAMP · 46×22
            </p>
          </div>
        </section>

        <section className="as-stage" aria-labelledby="as-land-title">
          <div className="as-sechead" data-reveal="">
            <p className="as-eyebrow">
              03 — <span lang="ko">파형</span> · the landscape
            </p>
            <h2 id="as-land-title" className="as-secthead__title">
              sine landscape
            </h2>
            <p className="as-secthead__kr" lang="ko">
              사인파 고도장이 흐르는 풍경.
            </p>
          </div>
          <div className="as-frame" data-reveal="">
            <pre className="as-understudy" aria-hidden="true">{`::::::::::::::::::::::::::::::::::::::::::::::::::::
:::::::-====---=---==----=-==---=-====---==---=-:::::
:::-=+*#%%%*+=--=+*#%%#*+=---=+*#%%%*+=--=+*#%%#+-:::
:-=*%@@@@@%#+:--+%@@@@@%#=:--+%@@@@@%#+:--+%@@@@@%*::
:=+%@@@@@@@%*:--+#@@@@@@@#+:-=*@@@@@@@%*:--+#@@@@@@@#:
:=*%@@@@@@@#=---=*@@@@@@@#=:-=*@@@@@@@#=---=*@@@@@@@#:
:-+#@@@@@@@*:----=#@@@@@@#=---=#@@@@@@@*:----=#@@@@@@#
:--+%@@@@@%#=-----=*%@@@%#=----=*%@@@%#=-----=*%@@@%#:
:::=*#%%%#*=:------:=*##*=:------:=*##*=:------:=*##*:
::::-----:::--------:::::--------:::::--------:::::--`}</pre>
            <canvas
              ref={landRef}
              className="as-canvas"
              aria-label="ASCII 렌더: 흐르는 사인파 풍경. ASCII render: a scrolling sine-wave landscape."
            />
            <p className="as-readout">
              <span lang="ko">고도장 → 문자 램프</span> · HEIGHTFIELD → RAMP · 70×20
            </p>
          </div>
        </section>

        <section className="as-how" aria-labelledby="as-how-title">
          <div className="as-sechead" data-reveal="">
            <p className="as-eyebrow">
              04 — <span lang="ko">방법</span> · how
            </p>
            <h2 id="as-how-title" className="as-secthead__title">
              the ramp
            </h2>
            <p className="as-secthead__kr" lang="ko">
              밝기 → 문자. 열 개의 문자로 명암을 그린다.
            </p>
          </div>
          <div className="as-ramp-row" data-reveal="" aria-hidden="true">
            <span className="as-ramp-ch">.</span>
            <span className="as-ramp-ch">:</span>
            <span className="as-ramp-ch">-</span>
            <span className="as-ramp-ch">=</span>
            <span className="as-ramp-ch">+</span>
            <span className="as-ramp-ch">*</span>
            <span className="as-ramp-ch">#</span>
            <span className="as-ramp-ch">%</span>
            <span className="as-ramp-ch">@</span>
          </div>
          <p className="as-ramp-cap" data-reveal="">
            <span lang="ko">왼쪽이 어둡고, 오른쪽이 밝다.</span> Left is dark, right
            is bright — ten glyphs are the whole palette.
          </p>
        </section>

        <footer className="as-foot" data-reveal="">
          <p className="as-foot__brand">
            ASCII <span lang="ko">아스키</span> ·{" "}
            <span lang="ko">문자로 그린 그림</span>
          </p>
          <p className="as-foot__line">
            <span lang="ko">순수 코드 — 이미지 없음.</span> Pure code · no
            images · MIT
          </p>
        </footer>
      </div>
      <div className="ascii-scan" aria-hidden="true" />
    </div>
  );
}
