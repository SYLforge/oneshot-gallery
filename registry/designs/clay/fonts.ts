import { Baloo_2, Gowun_Dodum } from "next/font/google";

/**
 * CLAY 클레이 — a 3D-clay product studio on warm cream. The voice is soft,
 * rounded, squeezable. Baloo 2 — a rounded display whose chubby terminals
 * already read as extruded clay; the wordmark and headings. Gowun Dodum —
 * a round, soft Korean sans whose open terminals match Baloo 2's squeezable
 * voice far better than a neutral grotesque.
 *
 * styles.css consumes these as var(--font-baloo) / var(--font-gowun-dodum);
 * page.tsx applies the .variable classes on the entry root.
 */
export const baloo2 = Baloo_2({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
});

export const gowunDodum = Gowun_Dodum({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-gowun-dodum",
  display: "swap",
});
