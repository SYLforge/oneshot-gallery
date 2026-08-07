/**
 * Patches global fetch with a retry layer so next/font/google's build-time
 * fetches of fonts.gstatic.com / fonts.googleapis.com survive transient
 * network failures (a known Vercel-build flake — see AGENTS.md).
 *
 * Loaded via NODE_OPTIONS=--require before `next build`. CommonJS so it loads
 * with no compiler. Only retries GETs to the Google Fonts hosts; everything
 * else passes through untouched.
 */
// @ts-check
const FONTS_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const originalFetch = globalThis.fetch;

if (typeof originalFetch === "function") {
  /**
   * @param {string} url
   */
  function isFontsUrl(url) {
    if (typeof url !== "string") return false;
    try {
      return FONTS_HOSTS.some((h) => new URL(url).host === h);
    } catch {
      return false;
    }
  }

  /**
   * @param {any} input
   * @param {any} [init]
   */
  async function fetchWithRetry(input, init) {
    const url = typeof input === "string" ? input : input && input.url;
    const method = init && init.method ? String(init.method).toUpperCase() : "GET";
    // Non-font GETs and non-GETs pass straight through.
    if (!isFontsUrl(url) || method !== "GET") {
      return originalFetch(input, init);
    }

    const MAX = 8;
    const BASE_DELAY = 800;
    for (let attempt = 1; attempt <= MAX; attempt++) {
      try {
        const res = await originalFetch(input, init);
        // A 2xx/3xx/4xx is final; only 5xx is worth retrying.
        if (res.status < 500) return res;
      } catch (_err) {
        // Network error (ETIMEDOUT/ENETUNREACH) — the case we retry.
      }
      if (attempt < MAX) {
        const delay = BASE_DELAY * Math.pow(1.7, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    // Last attempt: let the original throw so next/font reports a real error.
    return originalFetch(input, init);
  }

  globalThis.fetch = fetchWithRetry;
}
