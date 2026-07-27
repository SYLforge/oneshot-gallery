"use client";

import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import {
  COLORWAYS,
  drawSneaker,
  type Colorway,
} from "./sneaker";
import { useOrbit } from "../hooks/useOrbit";

/** Backing-store resolution cap — a 2.5D silhouette gains nothing above 2. */
const MAX_DPR = 2;

type Props = {
  colorway: Colorway["id"];
  reduced: boolean;
};

/**
 * The turntable. A DPR-capped canvas draws the sneaker (and its floor
 * reflection) every frame from the live orbit state, read off the ref —
 * never React state. A DOM contact-shadow layer beneath it foreshortens
 * and re-centers with rotation.
 *
 * Drag rotates the product 1:1; release flings with inertia. The key light
 * holds while you drag and circles on its own after a few seconds of quiet,
 * so touch devices still see a living specular. Under reduced motion the
 * orbit is 1:1 with no inertia and the light is held — the shoe is a still
 * you can re-pose.
 *
 * The canvas owns one rAF, paused when the stage leaves the viewport and
 * when the tab hides. The stage is a real focusable control: left/right
 * arrow keys nudge the angle, Home resets it.
 */
export default function ProductTurntable({ colorway, reduced }: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const cwRef = useRef<Colorway>(COLORWAYS[colorway]);

  useEffect(() => {
    cwRef.current = COLORWAYS[colorway];
  }, [colorway]);

  const orbit = useOrbit(reduced);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const shadow = shadowRef.current;
    if (!canvas || !stage || !shadow) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let visible = false;

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const s = orbit.ref.current;
      const rect = stage.getBoundingClientRect();
      drawSneaker(ctx, {
        angle: s.angle,
        keyAzimuth: s.keyAzimuth,
        grab: s.grab,
        cw: cwRef.current,
        w: rect.width,
        h: rect.height,
      });
      // Contact shadow foreshortens with |cos(angle)| and softens on grab.
      const cos = Math.abs(Math.cos(s.angle));
      const scaleX = 0.78 + 0.22 * cos;
      const opacity = Math.max(0.3, 0.55 + 0.25 * cos - s.grab * 0.15);
      shadow.style.setProperty("--orbit-shadow-sx", scaleX.toFixed(3));
      shadow.style.setProperty("--orbit-shadow-op", opacity.toFixed(3));
      shadow.style.setProperty("--orbit-shadow-lift", `${(s.grab * 6).toFixed(1)}px`);
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      draw();
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      const should = visible && !document.hidden;
      if (should) start();
      else stop();
    };

    resize();
    draw(); // first frame — also the reduced-motion still

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(stage);

    const io = new IntersectionObserver(
      (hits) => {
        visible = hits[hits.length - 1].isIntersecting;
        orbit.setVisible(visible);
        sync();
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(stage);

    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    orbit.sync(); // start the orbit's angle/key-light rAF

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [orbit]);

  const onKeyDown = useCallback((ev: React.KeyboardEvent<HTMLDivElement>) => {
    const step = Math.PI / 12; // 15° per press
    if (ev.key === "ArrowLeft") {
      orbit.nudge(step);
      ev.preventDefault();
    } else if (ev.key === "ArrowRight") {
      orbit.nudge(-step);
      ev.preventDefault();
    } else if (ev.key === "Home") {
      orbit.reset();
      ev.preventDefault();
    }
  }, [orbit]);

  const deg = Math.round(
    ((((orbit.state.angle * 180) / Math.PI) % 360) + 360) % 360,
  );

  return (
    <div
      ref={stageRef}
      className="orbit-stage"
      role="slider"
      tabIndex={0}
      aria-label="Product turntable — drag to orbit the sneaker 360 degrees. Use left and right arrow keys to rotate, Home to reset. 제품 턴테이블 — 드래그해 스니커즈를 360도로 돌아보세요. 좌우 화살표 키로 회전, Home 키로 되돌리기."
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={deg}
      onKeyDown={onKeyDown}
      {...orbit.handlers}
    >
      {/* Affordance ring — 36 ticks at 10° each, purely decorative */}
      <div className="orbit-stage__ring" aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => (
          <span
            key={i}
            className="orbit-stage__tick"
            style={{ transform: `rotate(${i * 10}deg)` }}
          />
        ))}
      </div>

      {/* Contact shadow — foreshortens with rotation */}
      <div ref={shadowRef} className="orbit-stage__shadow" aria-hidden="true" />

      {/* The product (canvas draws the sneaker + its floor reflection) */}
      <canvas
        ref={canvasRef}
        className="orbit-stage__canvas"
        aria-hidden="true"
      />

      {/* Drag hint, fades after first interaction */}
      <p
        className="orbit-stage__hint"
        aria-hidden="true"
        data-active={orbit.state.grab < 0.5 ? "true" : "false"}
      >
        drag to orbit · <span lang="ko">드래그해 돌아보기</span>
      </p>

      {/* Angle readout — a studio instrument read */}
      <p className="orbit-stage__readout" aria-hidden="true">
        <span className="orbit-stage__readout-deg">{String(deg).padStart(3, "0")}°</span>
        <span className="orbit-stage__readout-ko" lang="ko">
          회전각
        </span>
      </p>
    </div>
  );
}
