import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "__generated__/**",
  ]),
  {
    // Entries must stay self-contained: the same files serve as app routes,
    // shadcn registry items, and displayed source. Alias imports would break
    // after installation into a consumer app.
    files: ["registry/designs/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/*", "~/*"],
              message:
                "Entries are self-contained — use relative imports within the entry folder only.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
