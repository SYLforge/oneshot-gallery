"use client";

import { useEffect, useRef } from "react";
import {
  RIDGE_LAYERS,
  SEASON_ORDER,
  blendSeasons,
  clamp,
  growTree,
  mulberry32,
  ridgeHeight,
  type RidgeLayer,
} from "../hooks/landscape";
import { usePointerMist } from "../hooks/usePointerMist";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { ScrollSample } from "../hooks/useScrollProgress";

/* -- rendering ------------------------------------------------------------ */
/** Backing-store resolution cap. */
const MAX_DPR = 2;
/** Skip frames faster than ~64fps (high-refresh displays). */
const FRAME_MS = 15.5;

/* -- scroll → world ------------------------------------------------------- */
/** World-px scrolled per CSS-px of page scroll. The scroll unrolls the scroll. */
const WORLD_PER_SCROLL = 1.0;
/** A sample older than this reads as "stopped". */
const SCROLL_STALE_MS = 140;
/** Mist horizontal drift target from scroll velocity (px/s per px/ms). */
const SCROLL_MIST_WIND = 40;
const SCROLL_MIST_CAP = 60;

/* -- pointer -------------------------------------------------------------- */
/** Pointer presence attack/release per 60fps frame (token: pointer-breath). */
const PTR_ATTACK = 0.045;
const PTR_RELEASE = 0.016;
/** How strongly the pointer biases mist pooling. */
const PTR_MIST_PULL = 0.6;

/* -- mist ----------------------------------------------------------------- */
/** Number of autonomous mist blobs pooled in valleys + drifting. */
const MIST_COUNT = 26;
/** Autonomous breeze periods (mutually prime). */
const BREEZE_A = 0.13;
const BREEZE_B = 0.31;

/** Static time for the reduced-motion composed still (mid-breath). */
const STILL_T = 7.2;

type MistBlob = {
  /** Center x in world-px. */
  x: number;
  /** Center y in stage-px (drifts within its valley band). */
  y: number;
  /** Resting y — where it pools when no hand pulls it. */
  ry: number;
  /** Radius in px. */
  r: number;
  /** Base alpha. */
  a: number;
  /** Phase for the slow breathe. */
  ph: number;
  /** Which ridge layer's valley it pools in (0..RIDGE_LAYERS-2). */
  band: number;
};

/**
 * The signature moment. A live, infinitely-scrolling Chinese ink-wash
 * landscape that paints itself on canvas as you read. Mountains are built
 * from four octaves of seeded value noise and drawn as filled silhouette
 * paths in five ink-density layers — the aerial perspective of shan-shui
 * (远山如黛): distance is ink density, not perspective. Mist pools in the
 * valleys as soft radial-gradient blobs and follows your hand, breathing
 * toward a fine pointer with asymmetric attack/release; on touch or when the
 * hand goes quiet an autonomous two-sine breeze keeps it alive. As the deep
 * scroll advances the weather slowly cycles through four seasons — spring
 * plum haze to drowned winter cloud — never cutting, always weather.
 *
 * The scroll IS the unrolling of the hand scroll: page scroll drives a
 * world-x offset, every layer parallaxed by its depth, the same noise
 * function generating forever in both directions. The painting was already
 * mid-scroll on first paint (a warmup shift) so you arrive into a painting,
 * not a loading state.
 *
 * Reduced motion renders one composed still (a held breath of mist). No-JS
 * sees the SSR-painted SVG backdrop behind the canvas — the landscape is
 * already there. The loop pauses offscreen and on tab-hide.
 */
export default function LandscapeCanvas({
  scrollRef,
}: {
  scrollRef: React.RefObject<ScrollSample | null>;
}) {
  const { stageRef, target: ptrTarget } = usePointerMist<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let inView = false;
    let last = 0;
    let t = reduced ? STILL_T : 0;
    /** World-x offset driven by page scroll (the scroll unrolls). */
    let worldX = 480; // warmup — the painting is already partway along
    let scrollMistDrift = 0;

    /** The mist blobs, generated once into the valleys and advected each frame. */
    const mist: MistBlob[] = [];

    /** The pointer state (lerped from target). */
    const ptr = { x: 0, y: 0, e: 0 };

    /** Cached trees on the foreground ridge — deterministic per world-x tile. */
    type CachedTree = { wx: number; branches: { pts: number[]; w: number }[]; scale: number };
    const treeCache = new Map<number, CachedTree>();
    const TREE_SPACING = 260; // world-px between foreground trees

    /** Get (or grow) the foreground tree at world-tile index `ti`. */
    const treeAt = (ti: number): CachedTree => {
      const cached = treeCache.get(ti);
      if (cached) return cached;
      // sparse — only every other tile actually grows a tree, deterministically
      const rnd = mulberry32(ti * 7919 + 13);
      const grow = rnd() < 0.5;
      const wx = ti * TREE_SPACING;
      if (!grow) {
        const empty: CachedTree = { wx, branches: [], scale: 0 };
        treeCache.set(ti, empty);
        return empty;
      }
      const scale = 0.7 + rnd() * 0.5;
      const branches = growTree(ti * 104729 + 3, 0, 0, scale);
      const tree: CachedTree = { wx, branches, scale };
      treeCache.set(ti, tree);
      return tree;
    };

    const build = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Mist blobs pool in the valleys between ridge layers. Each is born
      // already mid-breath so the first (and only, under reduced motion)
      // frame is composed.
      mist.length = 0;
      const rnd = mulberry32(20260717);
      for (let i = 0; i < MIST_COUNT; i++) {
        const band = Math.min(RIDGE_LAYERS.length - 2, Math.floor(rnd() * (RIDGE_LAYERS.length - 1)));
        const layer = RIDGE_LAYERS[band];
        const nextLayer = RIDGE_LAYERS[band + 1];
        // resting y sits in the valley between this layer and the next
        const ry = ((layer.baseY + nextLayer.baseY) * 0.5) * H;
        const r = (0.12 + rnd() * 0.22) * H;
        mist.push({
          x: rnd() * (W + 400) - 200,
          y: ry,
          ry,
          r,
          a: 0.06 + rnd() * 0.08,
          ph: rnd() * Math.PI * 2,
          band,
        });
      }
    };

    /**
     * The season blend for the current deep-scroll position. The weather
     * cycles slowly through spring → summer → autumn → winter and back,
     * never cutting. One full cycle is ~4× the viewport's worth of world-x.
     */
    const seasonAt = (wx: number) => {
      const cycle = 2400; // world-px per season boundary
      const f = ((wx / cycle) % SEASON_ORDER.length + SEASON_ORDER.length) %
        SEASON_ORDER.length;
      const i = Math.floor(f);
      const frac = f - i;
      const a = SEASON_ORDER[i];
      const b = SEASON_ORDER[(i + 1) % SEASON_ORDER.length];
      return blendSeasons(a, b, frac);
    };

    /** Draw one ridge layer as a filled silhouette path. */
    const drawRidge = (
      layer: RidgeLayer,
      wx: number,
      inkMul: number,
    ) => {
      const step = 6; // px between profile samples — smooth enough at this scale
      ctx.beginPath();
      ctx.moveTo(-step, H + 2);
      const yTopFirst = ridgeHeight(layer, -step, wx, H);
      ctx.lineTo(-step, yTopFirst);
      for (let x = 0; x <= W + step; x += step) {
        const y = ridgeHeight(layer, x, wx, H);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + step, H + 2);
      ctx.closePath();
      ctx.fillStyle = `rgba(${layer.rgb[0]},${layer.rgb[1]},${layer.rgb[2]},${layer.ink * inkMul})`;
      ctx.fill();
      // a soft top-edge wash where the ridge meets the mist — wet-on-wet
      if (layer.depth >= 1) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        let yTop = ridgeHeight(layer, 0, wx, H);
        ctx.moveTo(0, yTop);
        for (let x = step; x <= W + step; x += step) {
          yTop = ridgeHeight(layer, x, wx, H);
          ctx.lineTo(x, yTop);
        }
        ctx.lineTo(W + step, yTop + 18);
        ctx.lineTo(0, ridgeHeight(layer, 0, wx, H) + 18);
        ctx.closePath();
        ctx.fillStyle = `rgba(${layer.rgb[0]},${layer.rgb[1]},${layer.rgb[2]},${layer.ink * inkMul * 0.4})`;
        ctx.filter = "blur(4px)";
        ctx.fill();
        ctx.filter = "none";
        ctx.restore();
      }
    };

    const drawMist = (wx: number, mistMul: number, ts: number) => {
      // two-sine autonomous breeze (touch / idle)
      const breeze =
        7 * Math.sin(ts * BREEZE_A) + 4 * Math.sin(ts * BREEZE_B + 0.7);
      const drift = breeze + scrollMistDrift;
      const breathe = 0.5 + 0.5 * Math.sin(ts * 0.92);

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      for (const m of mist) {
        // mist drifts horizontally with the breeze + scroll, wrapping
        m.x += drift * 0.016 * 60 * 0.016;
        // pointer pulls mist toward its y when energy is present
        let targetY = m.ry;
        let pull = 0;
        if (ptr.e > 0.01) {
          const dx = ptr.x - (m.x % (W + 400));
          const dy = ptr.y - m.y;
          const reach = Math.exp(-(dx * dx) / (W * W * 0.08));
          targetY = m.ry + dy * reach * PTR_MIST_PULL;
          pull = reach * ptr.e;
        }
        m.y += (targetY - m.y) * 0.04;
        // wrap horizontally across the world
        if (m.x > W + 260) m.x -= W + 520;
        if (m.x < -260) m.x += W + 520;

        const localBreathe = 0.78 + 0.22 * Math.sin(ts * 0.6 + m.ph);
        const alpha = (m.a + pull * 0.12) * mistMul * localBreathe * (0.8 + 0.2 * breathe);
        if (alpha < 0.004) continue;
        const r = m.r * (0.9 + 0.1 * localBreathe);
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r);
        grad.addColorStop(0, `rgba(244,237,224,${alpha})`);
        grad.addColorStop(0.45, `rgba(244,237,224,${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(244,237,224,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      void wx;
    };

    /** The rare seasonal accent — plum dots in spring, snow in winter. */
    const drawAccents = (wx: number, season: string, ts: number) => {
      if (season !== "spring" && season !== "winter") return;
      ctx.save();
      const rnd = mulberry32(Math.floor(wx / 600) * 31 + 7);
      const n = season === "spring" ? 14 : 22;
      for (let i = 0; i < n; i++) {
        const px = rnd() * W;
        // place on the foreground ridge
        const fg = RIDGE_LAYERS[4];
        const py = ridgeHeight(fg, px, wx, H) + 8 + rnd() * 40;
        const sway = Math.sin(ts * 0.5 + i) * 2;
        if (season === "spring") {
          // plum blossom — a single vermillion dot, the seal's cousin
          ctx.fillStyle = `rgba(168,50,50,${0.4 + rnd() * 0.3})`;
          ctx.beginPath();
          ctx.arc(px + sway, py, 1.3 + rnd() * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // a slow-falling snow mote
          const fallY = (py + ts * 14 + i * 40) % H;
          ctx.fillStyle = `rgba(248,248,252,${0.5 + rnd() * 0.3})`;
          ctx.beginPath();
          ctx.arc(px + sway, fallY, 1.1 + rnd() * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawForegroundTrees = (wx: number) => {
      // find the world-tile range visible on screen
      const startTi = Math.floor((wx - 80) / TREE_SPACING);
      const endTi = Math.ceil((wx + W + 80) / TREE_SPACING);
      const fg = RIDGE_LAYERS[4];
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(20,17,15,0.9)";
      for (let ti = startTi; ti <= endTi; ti++) {
        const tree = treeAt(ti);
        if (tree.branches.length === 0) continue;
        const sx = tree.wx - wx; // screen-x
        // sit the tree on the foreground ridge
        const sy = ridgeHeight(fg, sx + wx, wx, H) - 2;
        for (const b of tree.branches) {
          ctx.beginPath();
          ctx.moveTo(sx + b.pts[0], sy + b.pts[1]);
          for (let i = 2; i < b.pts.length; i += 2) {
            ctx.lineTo(sx + b.pts[i], sy + b.pts[i + 1]);
          }
          ctx.lineWidth = b.w;
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const ts = t;

      // ---- sky wash + season ---------------------------------------------
      const season = seasonAt(worldX);
      // a faint tonal wash over the upper sky
      ctx.fillStyle = `rgba(${season.wash[0].toFixed(0)},${season.wash[1].toFixed(0)},${season.wash[2].toFixed(0)},${season.wash[3].toFixed(3)})`;
      ctx.fillRect(0, 0, W, H * 0.7);

      // ---- ridges, farthest first ---------------------------------------
      for (let i = 0; i < RIDGE_LAYERS.length; i++) {
        const layer = RIDGE_LAYERS[i];
        // parallax: far layers move slower (less world-x shift)
        const layerWorld = worldX * (0.4 + layer.depth * 0.16);
        const farFade = i <= 1 ? season.farFade : 1;
        const inkMul = farFade;
        drawRidge(layer, layerWorld, inkMul);
      }

      // ---- mist pooled in the valleys -----------------------------------
      drawMist(worldX, season.mist, ts);

      // ---- seasonal accents (plum / snow) -------------------------------
      drawAccents(worldX, season.accent, ts);

      // ---- foreground trees on the nearest ridge ------------------------
      drawForegroundTrees(worldX);
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(now - last, 48) / 1000;
      last = now;
      t += dt;

      // scroll → world-x (the scroll unrolls the hand scroll). The absolute
      // scroll position is the primary, infinite driver; velocity only flavors
      // mist drift so a flick sends a gust through the valleys.
      const s = scrollRef.current ?? { y: 0, v: 0, t: 0 };
      const eff = now - s.t < SCROLL_STALE_MS ? s.v : 0;
      worldX = 480 + s.y * WORLD_PER_SCROLL;
      const mistTarget = clamp(eff * SCROLL_MIST_WIND, -SCROLL_MIST_CAP, SCROLL_MIST_CAP);
      scrollMistDrift += (mistTarget - scrollMistDrift) * (1 - Math.exp(-dt * 5));

      // pointer energy lerp (asymmetric — token: pointer-breath)
      const tgt = ptrTarget.current;
      if (fine && now - tgt.t < 4000) {
        const k = tgt.e > ptr.e ? PTR_ATTACK : PTR_RELEASE;
        const fr = clamp(dt * 60, 0, 3);
        ptr.x += (tgt.x - ptr.x) * 0.1 * fr;
        ptr.y += (tgt.y - ptr.y) * 0.1 * fr;
        ptr.e += (tgt.e - ptr.e) * k * fr;
      } else {
        ptr.e += (0 - ptr.e) * PTR_RELEASE * clamp(dt * 60, 0, 3);
      }

      draw();
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };

    build();
    if (reduced) {
      // one composed still — a held breath of mist, mid-plum-spring
      ptr.x = W * 0.5;
      ptr.y = H * 0.55;
      draw();
    }

    const ro = new ResizeObserver(() => {
      build();
      if (!running) draw();
    });
    ro.observe(stage);

    let io: IntersectionObserver | null = null;
    if (!reduced) {
      io = new IntersectionObserver(
        (hits) => {
          inView = hits[hits.length - 1].isIntersecting;
          if (inView && !document.hidden) start();
          else stop();
        },
        { rootMargin: "120px 0px" },
      );
      io.observe(stage);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      stop();
      ro.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, scrollRef, stageRef, ptrTarget]);

  return (
    <div
      ref={stageRef}
      className="shan-landscape"
      role="img"
      aria-label="A procedurally-drawn Chinese ink-wash landscape — five mountain layers receding into mist, fog pooling in the valleys and leaning toward your hand, foreground pines, the weather slowly cycling through the four seasons as you scroll. 程序化生成的水墨山水 — 五重山峦隐入烟岚，云雾聚于谷间并向你手边倾来，前景松林，随卷轴展开四季缓缓流转。"
    >
      <canvas ref={canvasRef} className="shan-landscape__canvas" aria-hidden="true" />
    </div>
  );
}
