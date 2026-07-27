/**
 * Pixel-art sprite data + a tiny renderer that turns a grid of (x, y, color)
 * tuples into a single CSS `box-shadow` value.
 *
 * Each sprite is one box-shadow per lit pixel: a 1px×1px anchor element
 * carries a shadow list of `${x}px ${y}px 0 ${color}` tuples. The browser
 * composites the whole sprite as one element, so a 200-pixel mascot is one
 * DOM node — this is the "ascii-render" technique: pixel density described
 * by a character grid, rendered by the shadow stack instead of an <img>.
 *
 * Coordinates are in pixel units from the sprite's top-left. Colors are
 * looked up in SPRITE_PALETTE so the data stays compact and the palette
 * stays declared in one place (every rendered color is a named token).
 *
 * The two hero mascot frames share every pixel except the eyes — frame 0
 * is open, frame 1 is a blink — so the idle cycle is a real two-frame
 * animation, not a re-render. Reduced motion parks on frame 0.
 */

export const SPRITE_PALETTE = {
  k: "#0a0a12", // outline / ground — the CRT mask around the sprite
  p: "#ff3d8a", // bubblegum body
  pl: "#ff8fb8", // bubblegum highlight
  pd: "#c8265f", // bubblegum shadow
  c: "#00e5ff", // cyan screen
  cl: "#7df4ff", // cyan screen highlight
  w: "#ffffff", // eye white / sparkle
  y: "#fff44f", // acid lamp
  m: "#4dff9f", // mint cheek
  s: "#c8d0d8", // chrome buckle
} as const;

export type Pixel = readonly [number, number, keyof typeof SPRITE_PALETTE];

/** Hero mascot — frame 0 (eyes open). A cheerful 16×16 cabinet sprite. */
export const HERO_FRAME_0: readonly Pixel[] = [
  // outline crown
  [0, 1, "k"], [1, 0, "k"], [2, 0, "k"], [3, 1, "k"],
  [12, 1, "k"], [13, 0, "k"], [14, 0, "k"], [15, 1, "k"],
  // top row body
  [1, 1, "p"], [2, 1, "p"], [3, 2, "p"], [12, 2, "p"], [13, 1, "p"], [14, 1, "p"],
  [2, 2, "pl"], [13, 2, "pl"],
  // body block rows 2-12
  ...row(2, 13, 2, "p"),
  ...row(1, 14, 3, "p"),
  ...row(0, 15, 4, "p"),
  ...row(0, 15, 5, "p"),
  ...row(0, 15, 6, "p"),
  ...row(0, 15, 7, "p"),
  ...row(0, 15, 8, "p"),
  ...row(0, 15, 9, "p"),
  ...row(0, 15, 10, "p"),
  ...row(1, 14, 11, "p"),
  ...row(2, 13, 12, "p"),
  // screen bezel (cyan inset)
  ...border(3, 4, 12, 8, "c"),
  // screen face fill highlight top-left
  [4, 5, "cl"], [5, 5, "cl"], [4, 6, "cl"],
  // eyes OPEN
  [5, 6, "k"], [6, 6, "k"],
  [9, 6, "k"], [10, 6, "k"],
  // mouth smile
  [5, 7, "k"], [6, 7, "k"], [7, 7, "k"], [8, 7, "k"], [9, 7, "k"], [10, 7, "k"],
  // cheeks (mint)
  [3, 7, "m"], [12, 7, "m"],
  // bottom shadow line
  ...row(2, 13, 13, "pd"),
  // feet
  [3, 13, "k"], [4, 14, "k"], [5, 14, "k"],
  [10, 14, "k"], [11, 14, "k"], [12, 13, "k"],
  // antenna lamp
  [7, 0, "y"], [8, 0, "y"],
] as const;

/**
 * Hero mascot — blink overlay. Frame 1 is frame 0 with the open eyes
 * removed and two short closed-eye bars drawn one row lower. Rather than
 * ship a second full grid, the component renders frame 0 and overlays
 * these few pixels (in the body color, to erase the open eyes) plus the
 * closed-eye bars. The blink is a real second frame; the data stays small.
 */
export const HERO_BLINK_ERASE: readonly Pixel[] = [
  [5, 6, "c"], [6, 6, "c"],
  [9, 6, "c"], [10, 6, "c"],
] as const;

export const HERO_BLINK_EYES: readonly Pixel[] = [
  [5, 7, "k"], [6, 7, "k"],
  [9, 7, "k"], [10, 7, "k"],
] as const;

/** A small coin sprite for the credits/high-score list. */
export const COIN: readonly Pixel[] = [
  [1, 0, "y"], [2, 0, "y"],
  [0, 1, "y"], [1, 1, "w"], [2, 1, "y"], [3, 1, "y"],
  [0, 2, "y"], [1, 2, "y"], [2, 2, "w"], [3, 2, "y"],
  [1, 3, "y"], [2, 3, "y"],
] as const;

/** A heart sprite (extra-life marker). */
export const HEART: readonly Pixel[] = [
  [1, 0, "p"], [3, 0, "p"],
  [0, 1, "p"], [1, 1, "pl"], [2, 1, "p"], [3, 1, "pl"], [4, 1, "p"],
  [0, 2, "p"], [1, 2, "p"], [2, 2, "p"], [3, 2, "p"], [4, 2, "p"],
  [1, 3, "p"], [2, 3, "p"], [3, 3, "p"],
  [2, 4, "p"],
] as const;

/** A star sprite (hi-score burst). */
export const STAR: readonly Pixel[] = [
  [2, 0, "y"],
  [2, 1, "y"],
  [0, 2, "y"], [1, 2, "y"], [2, 2, "w"], [3, 2, "y"], [4, 2, "y"],
  [1, 3, "y"], [2, 3, "y"], [3, 3, "y"],
  [1, 4, "y"], [3, 4, "y"],
] as const;

/* ----------------------------- helpers --------------------------------- */

function row(
  x0: number,
  x1: number,
  y: number,
  c: keyof typeof SPRITE_PALETTE,
): Pixel[] {
  const out: Pixel[] = [];
  for (let x = x0; x <= x1; x++) out.push([x, y, c] as Pixel);
  return out;
}

function border(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  c: keyof typeof SPRITE_PALETTE,
): Pixel[] {
  const out: Pixel[] = [];
  for (let x = x0; x <= x1; x++) {
    out.push([x, y0, c] as Pixel);
    out.push([x, y1, c] as Pixel);
  }
  for (let y = y0 + 1; y < y1; y++) {
    out.push([x0, y, c] as Pixel);
    out.push([x1, y, c] as Pixel);
  }
  return out;
}

/**
 * Render a sprite's pixels into a CSS `box-shadow` value. Each pixel becomes
 * one shadow tuple `${x}px ${y}px 0 0 ${color}` on a 1px×1px anchor.
 * `scale` multiplies the pixel pitch so the same sprite can render at 2x/3x.
 */
export function spriteToBoxShadow(
  pixels: readonly Pixel[],
  scale = 1,
): string {
  return pixels
    .map(([x, y, c]) => `${x * scale}px ${y * scale}px 0 0 ${SPRITE_PALETTE[c]}`)
    .join(", ");
}

/** Sprite bounding-box width/height in pixel units (for sizing the anchor). */
export function spriteSize(pixels: readonly Pixel[]): {
  width: number;
  height: number;
} {
  let maxX = 0;
  let maxY = 0;
  for (const [x, y] of pixels) {
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { width: maxX + 1, height: maxY + 1 };
}
