/**
 * Convert registry/designs/sticker/styles.css into a JS string export
 * (styles-string.ts), so the sticker entry can inline its CSS as a <style>
 * tag. This bypasses a Next 16 Turbopack quirk that drops the entry's
 * stylesheet chunk on client-side dynamic import.
 *
 *   node scripts/sticker-css-to-js.mjs
 *
 * Re-run after editing sticker/styles.css.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const src = path.join(ROOT, "registry/designs/sticker/styles.css");
const out = path.join(ROOT, "registry/designs/sticker/styles-string.ts");

const css = fs.readFileSync(src, "utf8");
// Escape for a JS template literal: backslashes, backticks, ${ ... }
const escaped = css
  .replace(/\\/g, "\\\\")
  .replace(/`/g, "\\`")
  .replace(/\$\{/g, "\\${");

const banner = [
  "/**",
  " * AUTO-GENERATED from styles.css by scripts/sticker-css-to-js.mjs.",
  " * Inlined as a string so the sticker entry's CSS renders even though Next 16",
  " * Turbopack drops this entry's stylesheet <link> on client dynamic import.",
  " * Do not edit by hand — edit styles.css and re-run the generator.",
  " */",
  "export const stickerCss = `" + escaped + "`;",
  ""
].join("\n");

fs.writeFileSync(out, banner);
console.log("[sticker-css-to-js] wrote " + path.relative(ROOT, out) + " (" + css.length + " css chars)");
