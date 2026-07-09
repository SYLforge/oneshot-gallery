# Assets License · 에셋 라이선스

This repository ships two kinds of things under two different licenses.

## 1. Code — MIT

All source code — every `registry/designs/<slug>/` entry (components, hooks,
styles, fonts config), the site chrome, and the scripts — is licensed under the
[MIT License](./LICENSE). Install it, ship it, sell with it. Attribution
appreciated, not required beyond the MIT notice.

## 2. Generated imagery — CC BY 4.0, with an honest caveat

Generated image and video assets under `public/media/<slug>/` (and any media
committed inside an entry folder) are released under
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
(**CC BY 4.0**). Attribution: *"Oneshot Gallery — oneshot.gallery"*.

**The honest caveat · 정직한 단서.** Much of this imagery is AI-generated. In
several jurisdictions — including the United States, per current Copyright
Office guidance — purely AI-generated images may not be copyrightable at all.
Where that is the case, we may hold no rights to license, and CC BY 4.0 cannot
attach to what nobody owns. So read our grant this way:

- **To the extent we hold rights** in these assets (selection, arrangement,
  human-authored editing, curated composites), we license them CC BY 4.0.
- **To the extent we hold none**, the assets are effectively public-domain and
  you need no license from us. We still *request* attribution, and the
  provenance files travel with the asset either way.
- We will not assert rights we do not have, and we will not pretend the legal
  status of AI imagery is more settled than it is.

일부 관할권(미국 저작권청의 현행 지침 포함)에서는 순수 AI 생성 이미지에 저작권이
성립하지 않을 수 있습니다. 권리가 성립하는 범위에서는 CC BY 4.0으로 제공하며,
성립하지 않는 범위에서는 사실상 퍼블릭 도메인입니다 — 그 경우에도 출처 표기를
부탁드립니다.

## Per-entry provenance disclosure · 엔트리별 출처 공개 (required)

Any entry whose `meta.json` declares `media.source` of `"comfyui"` or `"hybrid"`
**must** ship, inside its entry folder:

- **`image-recipe.md`** — human-readable recipe: model/checkpoint names and
  versions, LoRAs, prompts and negative prompts, seeds, samplers/steps/CFG,
  post-processing (upscale, encode settings), and which assets each recipe
  produced.
- **`workflows/*.json`** — the exported ComfyUI workflow graph(s), runnable as
  committed.

These are documentation, not shipped registry files (`workflows/` and media are
excluded from the shadcn install by the registry builder). A generated asset
without its recipe is a **G4 provenance gate failure** — it does not merge.

`meta.media.provenance` (bilingual, shown in the gallery UI) must summarize the
same facts honestly.

## Checkpoint-license audit gate · 체크포인트 라이선스 감사 게이트

AI image models carry their own license terms, and several popular checkpoint
lineages restrict commercial image use. Therefore:

> **No generated imagery ships from a model that does not have a passing,
> dated audit row in [`docs/model-licenses.md`](./docs/model-licenses.md).**

The audit records the model file, its family/lineage, the license actually
attached to it (not the license of its base model), whether generated *images*
may be used commercially and redistributed, the audit date, and a verdict.
Until a checkpoint's row says otherwise, treat it as
**NOT YET AUDITED — do not ship imagery from this model**. CI and reviewers
enforce this at the G4 gate.

체크포인트별 라이선스 감사표(`docs/model-licenses.md`)에 통과 판정이 기록되기
전에는 해당 모델로 생성한 이미지를 이 저장소에 커밋할 수 없습니다.

## Third-party assets · 서드파티 에셋

- **Fonts** are not redistributed here; entries load them via `next/font`
  (Google Fonts / OFL or equivalent). Each entry's `tokens.json` names every
  family and its source, and font licensing is confirmed in the entry PR.
- Any hand-made photography/illustration contributed to an entry must be owned
  by the contributor and is licensed CC BY 4.0 on merge (stated in the PR).
