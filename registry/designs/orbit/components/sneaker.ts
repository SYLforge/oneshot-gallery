/**
 * ORBIT sneaker renderer — a procedural canvas 2.5D turntable.
 *
 * The product is drawn in code, never as an image. The trick: instead of
 * pre-rendering 36 discrete sprite angles and cross-fading, we draw ONE
 * continuous side-elevation silhouette whose entire shape is a function of
 * the orbit angle. As `angle` sweeps 0 → 2π the silhouette's effective
 * width foreshortens (cos), the visible side swaps (the swoosh flips and
 * the laces occlude differently), and a specular streak travels the upper
 * — so a single parameterized drawing reads as a continuous 360° orbit.
 *
 * This is "2.5D" honestly stated: there is no mesh, no perspective matrix.
 * There is a side profile that breathes with the turntable. The contact
 * shadow (a DOM layer in ProductTurntable) and the floor reflection (drawn
 * here, below the ground line, as a flipped faded copy) do the rest of the
 * depth work.
 *
 * Every color arrives as a CSS-parsed token from the caller; this module
 * owns no hexes (the two studio-light tints, #fff5e6 and #b8d8ff, are
 * passed through from tokens.json roles "key-light" and "rim-light" — kept
 * as named constants only to avoid repeating string literals).
 */

export type Colorway = {
  id: "ember" | "ocean" | "frost";
  /** Primary upper color (the dominant panel). */
  upper: string;
  /** Secondary / overlay panel (toe box, heel counter). */
  overlay: string;
  /** The signature accent stripe. */
  accent: string;
  /** Midsole foam. */
  midsole: string;
  /** Outsole rubber. */
  outsole: string;
  /** Lace + collar trim. */
  trim: string;
};

export const COLORWAYS: Record<Colorway["id"], Colorway> = {
  ember: {
    id: "ember",
    upper: "#3a2218",
    overlay: "#241208",
    accent: "#ff5722",
    midsole: "#e8eef5",
    outsole: "#0d0d12",
    trim: "#9aa0ad",
  },
  ocean: {
    id: "ocean",
    upper: "#0a1a3a",
    overlay: "#040d22",
    accent: "#0066ff",
    midsole: "#e8eef5",
    outsole: "#0d0d12",
    trim: "#9aa0ad",
  },
  frost: {
    id: "frost",
    upper: "#c4ccd6",
    overlay: "#9aa0ad",
    accent: "#ff5722",
    midsole: "#ffffff",
    outsole: "#2a2a36",
    trim: "#3a3a48",
  },
};

/** Key-light and rim-light tints (token roles, inlined to avoid magic strings). */
const KEY = "#fff5e6";
const RIM = "#b8d8ff";

export type RenderOpts = {
  /** Orbit angle in radians, [0, 2π). 0 = full medial side, right-facing. */
  angle: number;
  /** Key-light azimuth in radians — the specular streak tracks this. */
  keyAzimuth: number;
  /** 0..1 grab factor — nudges the silhouette into a subtle "lift". */
  grab: number;
  /** 0..1 exploded factor — separates the parts vertically (the build view). */
  explode?: number;
  cw: Colorway;
  /** Canvas pixel width (CSS px, already DPR-scaled by caller's transform). */
  w: number;
  /** Canvas pixel height (CSS px). */
  h: number;
};

/** Useful derived quantities exposed for the shadow layer. */
export type SilhouetteMetrics = {
  /** Effective half-width of the silhouette at this angle, in stage units. */
  halfWidth: number;
  /** Ground line y (where the sole meets the floor), in CSS px from top. */
  soleY: number;
  /** Overall silhouette height in CSS px. */
  height: number;
};

/**
 * Draw the sneaker (plus its floor reflection) into the given 2D context.
 * The context is expected to be pre-scaled for DPR by the caller; we draw
 * in CSS pixels. Origin: top-left. Returns metrics for the contact shadow.
 */
export function drawSneaker(
  ctx: CanvasRenderingContext2D,
  o: RenderOpts,
): SilhouetteMetrics {
  const { w, h } = o;
  ctx.save();
  ctx.clearRect(0, 0, w, h);

  const m = drawSneakerBody(ctx, o);

  // Floor reflection: a vertically-flipped, faded copy of the silhouette
  // drawn below the ground line. We reflect about soleY and squash vertically
  // so it reads as lying on the floor, not a mirror floating below.
  const groundY = m.soleY;
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.translate(0, groundY * 2);
  ctx.scale(1, -0.62); // flip + foreshorten the reflection onto the floor
  drawSneakerBody(ctx, o);
  ctx.restore();

  ctx.restore();
  return m;
}

/**
 * Draw just the sneaker body (no reflection, no clear). Called twice by
 * drawSneaker: once upright, once flipped for the reflection. Origin is
 * top-left of the canvas; all placement derives from w/h.
 */
function drawSneakerBody(ctx: CanvasRenderingContext2D, o: RenderOpts): SilhouetteMetrics {
  const { w, h, angle, keyAzimuth, cw } = o;
  const grab = o.grab ?? 0;
  const explode = o.explode ?? 0;

  const cx = w / 2;
  const groundY = h * 0.78;
  const UNIT = Math.min(w, h) / 7.2; // the shoe is ~6 units long

  const c = Math.cos(angle);
  const foreshorten = Math.abs(c);
  const a = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  // "Near side" (laces/swoosh face us) when the shoe hasn't turned past 90°.
  const nearSide = a < Math.PI / 2 || a > (Math.PI * 3) / 2;

  const lengthU = 1.65 + 0.95 * foreshorten; // 1.65 .. 2.6 units
  const halfLen = lengthU * UNIT;
  const heightU = 1.5;
  const height = heightU * UNIT;
  const lift = grab * UNIT * 0.06;

  ctx.save();
  ctx.translate(cx, groundY - lift);

  // ---- outsole ------------------------------------------------------------
  const soleHalfW = halfLen * 0.98;
  const soleH = UNIT * 0.16;
  roundRectPath(ctx, -soleHalfW, -soleH, soleHalfW * 2, soleH, soleH * 0.5);
  ctx.fillStyle = cw.outsole;
  ctx.fill();
  if (foreshorten > 0.35) {
    ctx.fillStyle = withAlpha(cw.midsole, 0.12);
    const notches = 7;
    for (let i = 1; i < notches; i++) {
      const x = -soleHalfW + (i / notches) * soleHalfW * 2;
      ctx.fillRect(x - UNIT * 0.02, -soleH * 0.7, UNIT * 0.04, soleH * 0.5);
    }
  }

  // ---- midsole (foam wedge) -----------------------------------------------
  const soleHRef = soleH;
  ctx.save();
  ctx.translate(0, -soleHRef);
  const midHalfW = halfLen;
  const midH = UNIT * 0.22;
  ctx.beginPath();
  ctx.moveTo(-midHalfW, 0);
  ctx.lineTo(midHalfW, 0);
  ctx.lineTo(midHalfW * 0.82, -midH);
  ctx.quadraticCurveTo(-midHalfW * 0.5, -midH * 1.18, -midHalfW, -midH * 0.4);
  ctx.closePath();
  ctx.fillStyle = cw.midsole;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const midGrad = ctx.createLinearGradient(0, -midH, 0, 0);
  midGrad.addColorStop(0, withAlpha(cw.midsole, 0));
  midGrad.addColorStop(1, withAlpha(cw.outsole, 0.28));
  ctx.fillStyle = midGrad;
  ctx.fillRect(-midHalfW, -midH, midHalfW * 2, midH);
  ctx.restore();
  ctx.restore();

  // ---- upper (the main body) ---------------------------------------------
  const baseY = -soleHRef - midH; // relative to the translate(cx, groundY)
  const upperTopOffset = explode > 0 ? explode * UNIT * 1.6 : 0;
  const upperHalfW = halfLen * 0.96;

  ctx.save();
  ctx.translate(0, baseY);
  if (upperTopOffset) ctx.translate(0, -upperTopOffset);

  // Normalized profile helper: nx in [-1,1] (toe+, heel-), uy in units above sole.
  const P = (nx: number, uy: number): [number, number] => [
    nx * upperHalfW,
    -uy * UNIT,
  ];
  ctx.beginPath();
  let pt = P(1.0, 0.18);
  ctx.moveTo(pt[0], pt[1]);
  pt = P(0.72, 0.42);
  ctx.quadraticCurveTo(P(0.92, 0.3)[0], P(0.92, 0.3)[1], pt[0], pt[1]);
  pt = P(0.34, 0.62);
  ctx.quadraticCurveTo(P(0.55, 0.5)[0], P(0.55, 0.5)[1], pt[0], pt[1]);
  pt = P(0.02, 0.5);
  ctx.quadraticCurveTo(P(0.18, 0.6)[0], P(0.18, 0.6)[1], pt[0], pt[1]);
  pt = P(-0.34, 1.18);
  ctx.quadraticCurveTo(P(-0.12, 0.62)[0], P(-0.12, 0.62)[1], pt[0], pt[1]);
  pt = P(-0.5, 1.22);
  ctx.quadraticCurveTo(P(-0.42, 1.24)[0], P(-0.42, 1.24)[1], pt[0], pt[1]);
  pt = P(-0.92, 0.7);
  ctx.quadraticCurveTo(P(-0.7, 1.1)[0], P(-0.7, 1.1)[1], pt[0], pt[1]);
  pt = P(-1.0, 0.1);
  ctx.quadraticCurveTo(P(-0.98, 0.4)[0], P(-0.98, 0.4)[1], pt[0], pt[1]);
  ctx.closePath();
  ctx.fillStyle = cw.upper;
  ctx.fill();

  // Body shading driven by the key light azimuth. Its projected direction
  // onto the visible side is sin(keyAzimuth - angle).
  const lightDir = Math.sin(keyAzimuth - angle);
  const shadeGrad = ctx.createLinearGradient(
    -upperHalfW * lightDir,
    0,
    upperHalfW * lightDir,
    0,
  );
  shadeGrad.addColorStop(0, withAlpha(cw.overlay, 0.55));
  shadeGrad.addColorStop(0.5, withAlpha(cw.overlay, 0));
  shadeGrad.addColorStop(1, withAlpha(KEY, 0.1));
  ctx.save();
  ctx.clip();
  ctx.fillStyle = shadeGrad;
  ctx.fillRect(-upperHalfW, -height, upperHalfW * 2, height);
  ctx.restore();

  // ---- overlay panels (toe cap + heel counter) ----------------------------
  ctx.save();
  ctx.clip();
  // toe cap
  ctx.beginPath();
  pt = P(1.0, 0);
  ctx.moveTo(pt[0], pt[1]);
  pt = P(1.0, 0.5);
  ctx.lineTo(pt[0], pt[1]);
  pt = P(0.4, 0.62);
  ctx.quadraticCurveTo(P(0.7, 0.55)[0], P(0.7, 0.55)[1], pt[0], pt[1]);
  pt = P(0.2, 0.2);
  ctx.quadraticCurveTo(P(0.3, 0.5)[0], P(0.3, 0.5)[1], pt[0], pt[1]);
  ctx.closePath();
  ctx.fillStyle = cw.overlay;
  ctx.fill();
  // heel counter
  ctx.beginPath();
  pt = P(-1.0, 0);
  ctx.moveTo(pt[0], pt[1]);
  pt = P(-1.0, 0.95);
  ctx.lineTo(pt[0], pt[1]);
  pt = P(-0.5, 1.24);
  ctx.quadraticCurveTo(P(-0.8, 1.15)[0], P(-0.8, 1.15)[1], pt[0], pt[1]);
  pt = P(-0.2, 0.5);
  ctx.quadraticCurveTo(P(-0.4, 1.0)[0], P(-0.4, 1.0)[1], pt[0], pt[1]);
  ctx.closePath();
  ctx.fillStyle = withAlpha(cw.overlay, 0.75);
  ctx.fill();
  ctx.restore();

  // ---- the accent stripe ("swoosh") — near side only ----------------------
  if (nearSide) {
    ctx.beginPath();
    pt = P(0.42, 0.34);
    ctx.moveTo(pt[0], pt[1]);
    ctx.bezierCurveTo(
      P(0.1, 0.2)[0], P(0.1, 0.2)[1],
      P(-0.28, 0.46)[0], P(-0.28, 0.46)[1],
      P(-0.42, 0.62)[0], P(-0.42, 0.62)[1],
    );
    ctx.bezierCurveTo(
      P(-0.34, 0.5)[0], P(-0.34, 0.5)[1],
      P(-0.2, 0.4)[0], P(-0.2, 0.4)[1],
      P(0.3, 0.28)[0], P(0.3, 0.28)[1],
    );
    ctx.closePath();
    ctx.fillStyle = cw.accent;
    ctx.fill();
  }

  // ---- laces + collar trim (near side, not at front/back) -----------------
  if (nearSide && foreshorten > 0.25) {
    ctx.strokeStyle = cw.trim;
    ctx.lineWidth = UNIT * 0.05;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(...P(-0.5, 1.16));
    ctx.quadraticCurveTo(...P(-0.3, 1.28), ...P(-0.1, 1.02));
    ctx.stroke();
    const laceY0 = 0.66;
    const laceY1 = 0.86;
    for (let i = 0; i < 4; i++) {
      const t = i / 3;
      const x0 = 0.06 + t * 0.22;
      ctx.beginPath();
      ctx.moveTo(...P(x0, laceY0));
      ctx.lineTo(...P(x0 + 0.06, laceY1));
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(...P(0.04, 0.66));
    ctx.quadraticCurveTo(...P(0.18, 0.78), ...P(0.32, 0.66));
    ctx.strokeStyle = withAlpha(cw.overlay, 0.9);
    ctx.lineWidth = UNIT * 0.03;
    ctx.stroke();
  }

  // ---- specular streak — the read of "real light" -------------------------
  if (foreshorten > 0.18) {
    const specCenterX = Math.sin(keyAzimuth) * upperHalfW * 0.5;
    const specGrad = ctx.createLinearGradient(
      specCenterX - UNIT * 0.5,
      0,
      specCenterX + UNIT * 0.5,
      0,
    );
    specGrad.addColorStop(0, withAlpha(KEY, 0));
    specGrad.addColorStop(0.5, withAlpha(KEY, 0.22));
    specGrad.addColorStop(1, withAlpha(KEY, 0));
    ctx.save();
    ctx.clip();
    ctx.fillStyle = specGrad;
    ctx.fillRect(specCenterX - UNIT * 0.6, -height, UNIT * 1.2, height);
    ctx.restore();
  }

  // ---- rim-light edge on the shadow side (cool kicker) -------------------
  if (foreshorten > 0.2) {
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = withAlpha(RIM, 0.18);
    ctx.lineWidth = UNIT * 0.04;
    ctx.stroke(); // stroke the current upper path as a rim
    ctx.restore();
  }

  ctx.restore(); // upper group
  ctx.restore(); // body translate

  return { halfWidth: halfLen, soleY: groundY, height };
}

/** Helper: rounded-rectangle path (no fill — caller fills/strokes). */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/**
 * Apply alpha to a color token. Accepts #hex (3 or 6 digit) or rgb()/rgba();
 * returns an rgba() string. Keeps every color token-driven: callers pass the
 * same token they'd paint with, we re-emit it at a chosen opacity.
 */
export function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : hex;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  const m = /^rgba?\(([^)]+)\)$/.exec(color);
  if (m) {
    const parts = m[1].split(",").map((s) => s.trim());
    const [r, g, b] = parts;
    return `rgba(${r},${g},${b},${a})`;
  }
  return color;
}
