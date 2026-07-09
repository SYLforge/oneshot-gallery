"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Backing-store cap — neon lines gain nothing above 2. */
const MAX_DPR = 2;
/** Grid scroll speed in lane-units/second: at rest, and added at full rush. */
const BASE_SPEED = 0.5;
const RUSH_SPEED = 4.2;
/** Projection constant: screen depth d = NEAR / z (z in lane units). */
const NEAR = 0.92;
/** Horizontal grid rows evaluated per frame. */
const ROWS = 26;
/** Reduced motion renders exactly one composed frame at this time/offset. */
const STILL_TIME = 28_000;
const STILL_OFFSET = 0.42;

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  tw: number;
  phase: number;
  drift: number;
};

type Props = {
  reduced: boolean;
  /** Live scroll energy 0→1 from useScrollEnergy — read inside rAF only. */
  energyRef: RefObject<number>;
};

/**
 * The signature scene: an infinite perspective grid floor on a DPR-capped
 * 2D canvas — striped gradient sun, drifting star particles, and a horizon
 * that glows harder the faster you scroll. The grid always drifts gently on
 * its own (so touch devices get a living floor without hovering anything);
 * scroll velocity multiplies the speed up to ~9× and the floor rushes.
 *
 * The rAF loop pauses when the hero leaves the viewport and when the tab
 * hides. Reduced motion draws one composed still frame and never loops.
 * A CSS gradient sky sits underneath as the no-JS view, so the hero is
 * never a black rectangle.
 */
export default function Hero({ reduced, energyRef }: Props) {
  const stageRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let time = reduced ? STILL_TIME : 0;
    let offset = STILL_OFFSET;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];

    const makeStars = () => {
      const skyH = h * 0.58;
      const count = Math.min(200, Math.round((w * skyH) / 6500));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * skyH * 0.94,
        r: Math.random() < 0.12 ? 2 : 1.2,
        base: 0.2 + Math.random() * 0.55,
        tw: 0.0003 + Math.random() * 0.0014,
        phase: Math.random() * Math.PI * 2,
        drift: 0.002 + Math.random() * 0.006, // px per ms, leftward
      }));
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      makeStars();
    };

    const draw = (t: number, off: number, energy: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const horizon = h * 0.58;
      const cx = w / 2;

      // -- sky ------------------------------------------------------------
      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, "#0d0518");
      sky.addColorStop(0.6, "#1a0b2e");
      sky.addColorStop(1, "#2b1152");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, horizon);

      // -- stars: position is a pure function of t, so the reduced-motion
      //    still frame is simply one honest moment of the same sky --------
      ctx.fillStyle = "#efe6ff";
      for (const s of stars) {
        const x = (((s.x - t * s.drift) % w) + w) % w;
        ctx.globalAlpha = s.base * (0.55 + 0.45 * Math.sin(t * s.tw + s.phase));
        ctx.fillRect(x, s.y, s.r, s.r);
      }
      ctx.globalAlpha = 1;

      // -- sun halo (breathes a little wider when you rush) ---------------
      const sunR = Math.min(w, h) * 0.2;
      const sunX = cx;
      const sunY = horizon - sunR * 0.3;
      const halo = ctx.createRadialGradient(
        sunX,
        sunY,
        sunR * 0.3,
        sunX,
        sunY,
        sunR * 2.5,
      );
      halo.addColorStop(0, `rgba(255, 113, 206, ${(0.3 + energy * 0.2).toFixed(3)})`);
      halo.addColorStop(1, "rgba(255, 113, 206, 0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, horizon);

      // -- sun disc in 2px slices; venetian blinds widen toward the floor -
      for (let dy = -sunR; dy < sunR; dy += 2) {
        const y = sunY + dy;
        if (y >= horizon) break; // the sun sets behind the grid
        if (dy > 0) {
          const period = 9 + dy * 0.55;
          if (dy % period < 2.5 + dy * 0.14) continue; // blind gap
        }
        const half = Math.sqrt(sunR * sunR - dy * dy);
        const m = (dy + sunR) / (2 * sunR); // pink → violet, top to bottom
        ctx.fillStyle = `rgb(${Math.round(255 - 70 * m)} ${Math.round(
          113 - 10 * m,
        )} ${Math.round(206 + 49 * m)})`;
        ctx.fillRect(sunX - half, y, half * 2, 2);
      }

      // -- floor ------------------------------------------------------------
      const floor = ctx.createLinearGradient(0, horizon, 0, h);
      floor.addColorStop(0, "#170a31");
      floor.addColorStop(1, "#0d0518");
      ctx.fillStyle = floor;
      ctx.fillRect(0, horizon, w, h - horizon);

      // -- vertical rays: every lane converges on the vanishing point ------
      const fade = ctx.createLinearGradient(0, horizon, 0, h);
      fade.addColorStop(0, "rgba(1, 205, 254, 0)");
      fade.addColorStop(0.16, "rgba(1, 205, 254, 0.3)");
      fade.addColorStop(1, `rgba(1, 205, 254, ${(0.42 + energy * 0.3).toFixed(3)})`);
      ctx.strokeStyle = fade;
      ctx.lineWidth = 1;
      const laneW = Math.max(w * 0.07, 48);
      const lanes = Math.ceil((w * 0.75) / laneW) + 2;
      ctx.beginPath();
      for (let i = -lanes; i <= lanes; i++) {
        ctx.moveTo(cx, horizon);
        ctx.lineTo(cx + i * laneW * 1.9, h + 2);
      }
      ctx.stroke();

      // -- horizontal rows sliding down the projection ----------------------
      const frac = off % 1;
      for (let j = 0; j < ROWS; j++) {
        const z = j + 1 - frac;
        if (z < NEAR) continue; // this row has already passed the camera
        const d = NEAR / z; // 1 at the bottom edge → 0 at the horizon
        const y = horizon + (h - horizon) * d;
        const a = Math.min(0.8, d * 0.9) * (0.55 + energy * 0.45);
        ctx.strokeStyle = `rgba(1, 205, 254, ${a.toFixed(3)})`;
        ctx.lineWidth = 1 + d * 1.6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // -- horizon glow: the part that rushes with you ----------------------
      const g = 0.3 + energy * 0.55;
      const glow = ctx.createLinearGradient(0, horizon - 30, 0, horizon + 24);
      glow.addColorStop(0, "rgba(5, 255, 161, 0)");
      glow.addColorStop(0.55, `rgba(5, 255, 161, ${(0.38 * g).toFixed(3)})`);
      glow.addColorStop(1, "rgba(1, 205, 254, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, horizon - 30, w, 54);
      ctx.fillStyle = `rgba(5, 255, 161, ${Math.min(1, 0.5 + energy * 0.5).toFixed(3)})`;
      ctx.fillRect(0, horizon - 1, w, 1.25);
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 64);
      last = now;
      time += dt;
      const energy = energyRef.current;
      offset += (dt / 1000) * (BASE_SPEED + energy * RUSH_SPEED);
      draw(time, offset, energy);
    };

    const shouldRun = () => !reduced && visible && !document.hidden;

    const sync = () => {
      if (shouldRun()) {
        if (!running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(step);
        }
      } else if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onVisibility = () => sync();

    resize();
    draw(time, offset, 0); // first frame now — also the reduced-motion still

    const io = new IntersectionObserver(
      (hits) => {
        visible = hits[hits.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: "60px 0px" },
    );
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(time, offset, 0);
    });
    ro.observe(stage);

    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, energyRef]);

  return (
    <header ref={stageRef} className="plaza-hero">
      <div className="plaza-hero__backdrop" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="plaza-hero__canvas"
        role="img"
        aria-label="A neon perspective grid floor rushes toward a striped gradient sun on the horizon of an empty mall. 텅 빈 쇼핑몰의 지평선 — 네온 원근 그리드 바닥이 줄무늬 석양을 향해 달려간다."
      />
      <div className="plaza-hero__content">
        <p className="plaza-hero__station">
          <span className="plaza-onair">
            <span className="plaza-onair__lamp" aria-hidden="true" />
            ON AIR
          </span>
          <span className="plaza-hero__freq">
            FM 88.8 · midnight mall radio
          </span>
        </p>
        <h1 className="plaza-hero__title plaza-ab" data-text="GRADIENT PLAZA">
          GRADIENT PLAZA
        </h1>
        <p className="plaza-hero__sub" lang="ko">
          미드나잇 몰 라디오 — 그라디언트 플라자
        </p>
        <p className="plaza-hero__line">
          Broadcasting nightly from a shopping mall that only exists after
          closing.{" "}
          <span lang="ko" className="plaza-hero__ko">
            폐점 후에만 존재하는 쇼핑몰에서, 매일 밤 송출 중.
          </span>
        </p>
        <p className="plaza-hero__hint">
          scroll — the floor rushes ·{" "}
          <span lang="ko">스크롤 — 바닥이 달립니다</span>
        </p>
      </div>
    </header>
  );
}
