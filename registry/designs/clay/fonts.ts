import "@fontsource/baloo-2/500.css";
import "@fontsource/baloo-2/600.css";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import "@fontsource/gowun-dodum/400.css";

/**
 * CLAY 클레이 — a 3D-clay product studio on warm cream. The voice is soft,
 * rounded, squeezable. Baloo 2 — a rounded display whose chubby terminals
 * already read as extruded clay; the wordmark and headings. Gowun Dodum —
 * a round, soft Korean sans whose open terminals match Baloo 2's squeezable
 * voice far better than a neutral grotesque.
 *
 * Self-hosted via @fontsource (no build-time Google Fonts fetch). styles.css
 * references the families directly; no CSS-variable wrapper is needed.
 */

// Sentinel values kept for source compatibility with page.tsx, which spreads
// `.variable` into the root className. They are empty strings — the @font-face
// rules are global once the CSS imports above are bundled.
export const baloo2 = { variable: "" };
export const gowunDodum = { variable: "" };
