"use client";

import { useEffect, useRef } from "react";

/** Backing-store resolution cap. */
const MAX_DPR = 2;
/** Skip frames faster than ~64fps (high-refresh displays). */
const FRAME_MS = 15.5;
/** Pointer lerp toward target, normalized to 60fps inside the loop. */
const POINTER_LERP = 0.09;
/** Chrome energy attack / release: notices slowly, forgets slower. */
const ENERGY_ATTACK = 0.06;
const ENERGY_RELEASE = 0.025;
/** Pointer silence before the autonomous ripple takes back over (ms). */
const IDLE_MS = 2400;
/** Hand-picked timestamp for the reduced-motion still frame. */
const STILL_T = 4200;

/**
 * The chrome shader: a single full-quad fragment program that paints a
 * horizontally-stacked chrome gradient (silver → highlight → shadow →
 * silver) and displaces the gradient coordinate with layered sine ripples
 * plus a gaussian lens that follows the pointer. The metal reads as a
 * liquid that notices your hand.
 *
 * Uniforms:
 *   uRes   — backing-store pixels (vec2)
 *   uTime  — seconds (float)
 *   uPtr   — pointer in 0..1 UV, .z = energy 0..1 (vec3)
 *
 * The hook returns a ref to attach to the <canvas>. On any failure (no
 * WebGL, context lost, shader compile error) the canvas stays hidden and
 * the CSS chrome-gradient text fill behind it carries the headline — the
 * page loses the ripple, never the wordmark.
 *
 * The rAF loop only runs while the canvas is near the viewport and the tab
 * is visible. Under reduced motion, a single composed still frame is drawn
 * at STILL_T and the loop never starts.
 */
export function useChromeShader<T extends HTMLCanvasElement>(
  disabled: boolean,
) {
  const canvasRef = useRef<T | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      }) ||
      canvas.getContext("experimental-webgl", {
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null;
    if (!gl) return; // CSS chrome-gradient fallback carries the headline

    const vert = `
      attribute vec2 aPos;
      void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `;
    // The chrome: a horizontal silver band stack, displaced vertically by
    // summed sines plus a pointer gaussian lens. The palette is fixed to
    // the entry's chrome tokens so the shader is a literal token render.
    const frag = `
      precision mediump float;
      uniform vec2  uRes;
      uniform float uTime;
      uniform vec3  uPtr; // xy in 0..1, z = energy 0..1

      // chrome palette stops (entry tokens, 0..1 rgb)
      const vec3 SHADOW  = vec3(0.165, 0.165, 0.227); // #2a2a3a chrome-ink
      const vec3 SILVER  = vec3(0.784, 0.816, 0.847); // #c8d0d8 chrome-silver
      const vec3 HILITE  = vec3(1.000, 1.000, 1.000); // #ffffff chrome-highlight
      const vec3 MIST    = vec3(0.957, 0.945, 1.000); // #f4f1ff holo-mist
      const vec3 PINK    = vec3(1.000, 0.541, 0.847); // #ff8ad8 accent (fill)

      // 5-stop chrome band: shadow edge -> silver -> highlight -> silver -> shadow
      vec3 chrome(float v) {
        v = clamp(v, 0.0, 1.0);
        vec3 a = mix(SHADOW, SILVER, smoothstep(0.00, 0.28, v));
        vec3 b = mix(a,       HILITE, smoothstep(0.28, 0.46, v));
        vec3 c = mix(b,       SILVER, smoothstep(0.46, 0.74, v));
        return   mix(c,       SHADOW, smoothstep(0.74, 1.00, v));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes.xy;
        float aspect = uRes.x / uRes.y;
        vec2 p = uv;
        p.x *= aspect;

        // vertical gradient coordinate — the metal bands run across
        float g = uv.y;

        // layered ripples displace the gradient up/down
        float t = uTime * 0.001;
        float r1 = sin((p.x * 7.0)  + t * 1.8) * 0.05;
        float r2 = sin((p.x * 13.0) - t * 1.1 + 1.3) * 0.028;
        float r3 = sin((p.x * 23.0) + t * 2.7 + 2.1) * 0.014;
        g += (r1 + r2 + r3);

        // pointer gaussian lens — the metal leans where you look
        float dx = p.x - (uPtr.x * aspect);
        float dy = uv.y - uPtr.y;
        float lens = exp(-(dx * dx * 3.5 + dy * dy * 6.0));
        g += lens * 0.10 * uPtr.z;

        vec3 col = chrome(g);

        // holographic underglow toward the warm band — pink seams
        float seam = smoothstep(0.42, 0.50, g) - smoothstep(0.50, 0.58, g);
        col += PINK * seam * 0.18;

        // soft mist ambient so the metal never reads as flat plastic
        col = mix(col, MIST, 0.06);

        // premultiplied-ish output for the transparent quad over the scrim
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string): WebGLShader | null {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(sh);
        return null;
      }
      return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return; // shader compile failed — CSS fallback stands

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    gl.useProgram(prog);

    // full-quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uPtr = gl.getUniformLocation(prog, "uPtr");

    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    let disposed = false;
    let running = false;
    let inView = false;
    let raf = 0;
    let last = 0;
    let t = disabled ? STILL_T : 0;

    const ptr = { x: 0.5, y: 0.5, e: disabled ? 0.5 : 0 };
    const target = { x: 0.5, y: 0.5, e: 0 };
    let lastMove = -1e9;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const draw = () => {
      gl.uniform1f(uTime, t);
      gl.uniform3f(uPtr, ptr.x, ptr.y, ptr.e);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.classList.add("is-live");
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48);
      last = now;
      t += dt;

      // autonomous ripple on touch, or when the pointer goes quiet
      if (!fine || now - lastMove > IDLE_MS) {
        target.x = 0.5 + 0.28 * Math.sin(t * 0.00021);
        target.y = 0.5 + 0.18 * Math.sin(t * 0.00033 + 0.7);
        target.e = 0.35 + 0.12 * Math.sin(t * 0.00045);
      }
      const k = dt / 16.7; // frame-rate normalization
      ptr.x += (target.x - ptr.x) * POINTER_LERP * k;
      ptr.y += (target.y - ptr.y) * POINTER_LERP * k;
      const ek = target.e > ptr.e ? ENERGY_ATTACK : ENERGY_RELEASE;
      ptr.e += (target.e - ptr.e) * ek * k;

      draw();
    };

    const start = () => {
      if (running || disabled) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" && ev.pointerType !== "pen") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1) return;
      target.x = (ev.clientX - rect.left) / rect.width;
      target.y = 1 - (ev.clientY - rect.top) / rect.height;
      target.e = 1;
      lastMove = performance.now();
    };
    const onPointerLeave = () => {
      lastMove = -1e9;
    };

    resize();
    // Always paint at least one frame — the reduced-motion still.
    draw();

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(canvas);

    let io: IntersectionObserver | null = null;
    if (!disabled) {
      if (fine) {
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerleave", onPointerLeave);
      }
      io = new IntersectionObserver(
        (hits) => {
          inView = hits[hits.length - 1].isIntersecting;
          if (inView && !document.hidden) start();
          else stop();
        },
        { rootMargin: "120px 0px" },
      );
      io.observe(canvas);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [disabled]);

  return canvasRef;
}
