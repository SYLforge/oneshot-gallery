<!--
Submitting a design entry? Use the entry template instead:
append ?template=entry.md to this PR's URL, or open:
  https://github.com/<org>/<repo>/compare/main...<branch>?template=entry.md
디자인 엔트리 제출이라면 entry.md 템플릿을 사용해 주세요.
-->

## What & why · 무엇을, 왜

<!-- One or two sentences. Link the issue if there is one. -->

## Checklist

- [ ] `pnpm validate`, `pnpm lint`, and `pnpm exec tsc --noEmit` pass locally
- [ ] `pnpm registry:build` re-run and any diff to `registry.json` / `__generated__/` committed
- [ ] Docs updated if behavior or policy changed
- [ ] Commits are DCO signed-off (`git commit -s`)
