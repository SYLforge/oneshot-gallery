"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** Backing-store resolution cap — a gradient field gains nothing above 2. */
const MAX_DPR = 2;
/** Pointer position lerp per 60fps-normalized frame. */
const POINTER_LERP = 0.07;
/** Energy attack / release — quick to notice you, slow to forget. */
const ENERGY_ATTACK = 0.05;
const ENERGY_RELEASE = 0.02;
/** After this much pointer silence, the sky drifts on its own (ms). */
const IDLE_MS = 3200;
/**
 * Page scroll progress is amplified for the shader: the sky reaches deep
 * night a third of the way down, while the CSS tokens take the whole page.
 */
const TEMP_GAIN = 3;
/** Reduced motion renders exactly one composed frame at this time (s). */
const STILL_TIME = 38;

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_energy;
uniform float u_temp;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 q = vec2(uv.x * aspect, uv.y);

  // The pointer pushes the curtains: a capped gaussian displacement,
  // already lerped on the CPU so the warp arrives like weather, not a cursor.
  vec2 ptr = vec2(u_pointer.x * aspect, u_pointer.y);
  vec2 d = q - ptr;
  float fall = exp(-dot(d, d) * 4.5);
  q += normalize(d + 0.0001) * fall * 0.22 * u_energy;

  float t = u_time * 0.045;

  // Flow field: one fbm advects the domain of the next (domain warping).
  float flow = fbm(vec2(q.x * 1.1 + t * 0.6, q.y * 1.8 - t * 0.25));
  float rib = fbm(vec2(
    q.x * 2.4 + flow * 2.2 - t * 0.4,
    q.y * 0.9 + flow * 0.8 + t * 0.15
  ));

  // Sharpen the noise into curtains: ridged fbm, then a hard power.
  float rid = 1.0 - abs(rib * 2.0 - 1.0);
  rid = pow(rid, 2.6);

  // Curtains hang in the upper sky and die toward the horizon.
  float sky = smoothstep(0.06, 0.5, uv.y);
  // Fine vertical striation — the "rays" auroras are combed into.
  float ray = 0.72 + 0.28 * noise(vec2(q.x * 24.0 + flow * 3.0, t * 0.5));
  float glow = rid * (0.32 + 0.68 * flow) * sky * ray;
  // The sky leans toward your hand.
  glow *= 1.0 + fall * u_energy * 0.9;

  // Real curtains: green skirt low, magenta hem high.
  // u_temp shifts the weights — dusk leans magenta, deep night leans green.
  float hueMix = clamp(
    uv.y * 1.35 - 0.25 + (flow - 0.5) * 0.7 + (0.5 - u_temp) * 0.5,
    0.0, 1.0
  );
  vec3 green = vec3(0.435, 0.949, 0.765);
  vec3 magenta = vec3(0.761, 0.420, 0.949);
  vec3 aurora = mix(green, magenta, hueMix);

  vec3 night = vec3(0.055, 0.075, 0.188);
  vec3 deep = vec3(0.030, 0.045, 0.130);
  vec3 bg = mix(night, deep, u_temp);

  // Stars: stable hashed cells, each twinkling at its own rate,
  // swallowed where the curtain burns.
  vec2 sp = vec2(q.x, uv.y) * 90.0;
  float s = hash(floor(sp));
  float star = step(0.994, s) * max(0.0, 1.0 - length(fract(sp) - 0.5) * 4.0);
  star *= 0.35 + 0.65 * (0.5 + 0.5 * sin(u_time * (0.5 + s) + s * 80.0));
  star *= smoothstep(0.3, 0.75, uv.y) * (1.0 - min(glow * 2.2, 1.0));

  vec3 col = bg + aurora * glow + vec3(0.87, 0.91, 1.0) * star * 0.55;
  // A faint horizon breath in the ridge-line blue.
  col += vec3(0.153, 0.251, 0.420) * exp(-uv.y * 8.0) * 0.4;

  // Ordered-ish dither: kills gradient banding on dark displays.
  col += (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.006;

  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  /** The hero section — pointer events and sizing come from it. */
  stageRef: RefObject<HTMLElement | null>;
  reduced: boolean;
  paused: boolean;
};

/**
 * The aurora itself: a hand-rolled WebGL fragment shader (no libraries) on a
 * DPR-capped canvas. Layer order is the fallback plan — the CSS gradient
 * aurora is always painted underneath, and the canvas fades in over it only
 * after a first frame actually lands. No WebGL, a failed compile, or a lost
 * context all resolve to the same thing: the CSS sky, never a black hole.
 *
 * The rAF loop pauses when the hero leaves the viewport (IO), when the tab
 * hides (visibilitychange), and when the visitor presses "pause the sky".
 * Reduced motion draws exactly one composed frame and never starts the loop.
 */
export default function AuroraCanvas({ stageRef, reduced, paused }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fallback, setFallback] = useState(false);
  const pausedRef = useRef(paused);
  const syncRef = useRef<(() => void) | null>(null);

  // The pause button must not rebuild the GL context — it only pokes sync().
  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    if (fallback) return;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !stage || !wrap) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFallback(true);
      return;
    }

    const bail = () => {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setFallback(true);
    };

    const compile = (type: number, src: string): WebGLShader | null => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      bail();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      bail();
      return;
    }
    gl.useProgram(prog);

    // One oversized triangle beats a quad: no diagonal seam, one draw call.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uPointer = gl.getUniformLocation(prog, "u_pointer");
    const uEnergy = gl.getUniformLocation(prog, "u_energy");
    const uTemp = gl.getUniformLocation(prog, "u_temp");

    let raf = 0;
    let running = false;
    let visible = true;
    let disposed = false;
    let last = 0;
    let time = reduced ? STILL_TIME : 0;

    const ptr = { x: 0.5, y: 0.62, e: reduced ? 0.55 : 0 };
    let target = { x: 0.5, y: 0.62, e: 0 };
    let lastMove = -1e9;

    const temp = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      return Math.min(1, (window.scrollY / max) * TEMP_GAIN);
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, ptr.x, ptr.y);
      gl.uniform1f(uEnergy, ptr.e);
      gl.uniform1f(uTemp, temp());
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 50);
      last = now;
      time += dt / 1000;

      // Touch, or an idle pointer: the sky scans on its own (slow lissajous).
      if (now - lastMove > IDLE_MS) {
        target = {
          x: 0.5 + 0.3 * Math.sin(time * 0.13),
          y: 0.6 + 0.18 * Math.sin(time * 0.21 + 1.7),
          e: 0.55 + 0.18 * Math.sin(time * 0.29),
        };
      }
      const k = dt / 16.7; // frame-rate normalization
      ptr.x += (target.x - ptr.x) * POINTER_LERP * k;
      ptr.y += (target.y - ptr.y) * POINTER_LERP * k;
      const ek = target.e > ptr.e ? ENERGY_ATTACK : ENERGY_RELEASE;
      ptr.e += (target.e - ptr.e) * ek * k;

      draw();
    };

    const shouldRun = () =>
      !reduced && !pausedRef.current && visible && !document.hidden;

    const sync = () => {
      if (disposed) return;
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
    syncRef.current = sync;

    const onPointerMove = (ev: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      target = {
        x: (ev.clientX - rect.left) / rect.width,
        y: 1 - (ev.clientY - rect.top) / rect.height, // GL is y-up
        e: 1,
      };
      lastMove = performance.now();
    };
    const onPointerLeave = () => {
      lastMove = -1e9;
    };
    const onVisibility = () => sync();
    const onContextLost = () => {
      // Do not restore — hand the sky to the CSS fallback underneath.
      running = false;
      cancelAnimationFrame(raf);
      setFallback(true);
    };

    resize();
    draw(); // first frame now — also the one still frame under reduced motion
    wrap.classList.add("is-live");

    if (!reduced) {
      stage.addEventListener("pointermove", onPointerMove, { passive: true });
      stage.addEventListener("pointerleave", onPointerLeave);
    }
    canvas.addEventListener("webglcontextlost", onContextLost);
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      (hits) => {
        visible = hits[hits.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(stage);

    sync();

    return () => {
      disposed = true;
      syncRef.current = null;
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibility);
      wrap.classList.remove("is-live");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [stageRef, reduced, fallback]);

  return (
    <div
      ref={wrapRef}
      className={`lumen-aurora${paused ? " is-paused" : ""}`}
      aria-hidden="true"
    >
      {/* Always painted: the CSS aurora is the no-JS view, the no-WebGL view,
          and the safety net under the canvas. */}
      <div className="lumen-aurora__fallback" />
      {!fallback && <canvas ref={canvasRef} className="lumen-aurora__canvas" />}
    </div>
  );
}
