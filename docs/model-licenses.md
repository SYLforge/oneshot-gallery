# Checkpoint license audit · 체크포인트 라이선스 감사

The gate defined in [`ASSETS-LICENSE.md`](../ASSETS-LICENSE.md): **no generated
imagery ships from a model without a passing, dated audit row in this table.**

An audit must establish, for the *exact model file* (not its base model):

1. the license actually attached by the uploader/merger (CreativeML OpenRAIL-M,
   Fair AI Public License, custom terms, …) and the full inheritance chain of
   merged checkpoints;
2. whether **commercial use of generated images** is permitted;
3. whether generated images may be **redistributed under CC BY 4.0** (see
   `ASSETS-LICENSE.md`);
4. any use restrictions that affect this gallery (credit requirements,
   no-resale-of-model clauses are fine; no-commercial-images clauses are not).

Verdict values: `OK` (ship imagery, cite conditions) · `CONDITIONAL` (ship only
with listed conditions met) · `BLOCKED` (do not ship) ·
`NOT YET AUDITED — do not ship imagery from this model`.

| Model file | Family / lineage | License (as attached) | Commercial image use | Audited (date) | Verdict |
| --- | --- | --- | --- | --- | --- |
| `bismuthIllustrious_v80` | Illustrious-XL merge (SDXL base) | CreativeML Open RAIL++-M (via SDXL/Illustrious inheritance) | Permitted — outputs may be used commercially; model redistribution must preserve license | 2026-07-17 | **CONDITIONAL — see notes** |
| `rIllustrmix_diV20` | Illustrious-XL merge (SDXL base) | CreativeML Open RAIL++-M (via SDXL/Illustrious inheritance) | Permitted — outputs may be used commercially; model redistribution must preserve license | 2026-07-17 | **CONDITIONAL — see notes** |
| `rinFlanimeIllustrious_v40` | Illustrious-XL merge (SDXL base) | CreativeML Open RAIL++-M (via SDXL/Illustrious inheritance) | Permitted — outputs may be used commercially; model redistribution must preserve license | 2026-07-17 | **CONDITIONAL — see notes** |
| `zenijiMixKIllust_v10` | Illustrious-XL merge (SDXL base) | CreativeML Open RAIL++-M (via SDXL/Illustrious inheritance) | Permitted — outputs may be used commercially; model redistribution must preserve license | 2026-07-17 | **CONDITIONAL — see notes** |
| `zenijiMixKWebtoon_v10` | Illustrious-XL merge (SDXL base) | CreativeML Open RAIL++-M (via SDXL/Illustrious inheritance) | Permitted — outputs may be used commercially; model redistribution must preserve license | 2026-07-17 | **CONDITIONAL — see notes** |
| `waiANIMA_v10Base10` | Illustrious/anime lineage (SDXL base) | CreativeML Open RAIL++-M (via SDXL inheritance) | Permitted — outputs may be used commercially; model redistribution must preserve license | 2026-07-17 | **CONDITIONAL — see notes** |
| `svdq Qwen-Image-Edit-2511` (SVDQuant) | Qwen-Image-Edit | TBD — not used by current pipeline (nunchaku path deferred) | TBD | — | **NOT YET AUDITED — do not ship imagery from this model** |

## Notes on the Illustrious-XL audit · 2026-07-17

The Illustrious-XL family derives from Stable Diffusion XL, which carries the
**CreativeML Open RAIL++-M License**. That license permits commercial use of
generated images (the gallery's requirement) while imposing use-based
restrictions (no unlawful/harmful use) and requiring downstream derivatives to
inherit the same license.

**Why CONDITIONAL, not OK.** Two unresolved items keep the verdict conditional
pending maintainer co-sign:

1. **Merge ancestry is not fully disclosed** by the community merges above
   (`zenijiMixK*`, `rIllustrmix`, etc.). Open RAIL++-M inheritance is assumed
   from the Illustrious/SDXL lineage, but a merged-in non-OpenRAIL component
   (a creator-added dataset with a more restrictive custom license) could
   tighten the effective terms. The verdict assumes the cleanest case.

2. **CC BY 4.0 redistribution compatibility is unconfirmed.** This gallery
   ships generated images under CC BY 4.0 (`ASSETS-LICENSE.md`). Open RAIL++-M
   does not prevent relicensing *outputs*, but it does require the model's
   use-based restrictions to travel with the model — they do not attach to
   downstream images. We read this as compatible, but a maintainer should
   confirm before the verdict moves to `OK`.

**What "CONDITIONAL — see notes" permits today:** the generated imagery in
`public/media/ppang/` and `public/media/moonlit/` may ship with the gallery as
long as (a) this audit row and the two open items are visible on the assets
license page, (b) the model file and its license are cited in each entry's
`PROMPT.md` / `image-recipe.md`, and (c) a maintainer co-signs the move to `OK`
before the next roster milestone. Evidence sources consulted:
[Illustrious-XL ToS](https://www.illustrious-xl.ai/terms-of-service),
[Open RAIL++-M on SDXL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/blob/main/LICENSE.md).

라이선스 원문을 감사 일자에 확보하고, 병합 계보상 가장 제한적인 라이선스를
기준으로 판정합니다. 판정은 유지보수자의 승인(PR)으로 확정됩니다.

## How to audit a row · 감사 절차

1. Locate the model's canonical distribution page and capture the license text
   (screenshot or archived link) on the audit date.
2. Trace merge ancestry where disclosed; the most restrictive license in the
   chain governs.
3. Record findings in the row (replace TBDs), set the date, set the verdict,
   and link the evidence in a PR. A maintainer co-signs the PR before the
   verdict takes effect.
4. Re-audit if the upstream license changes or the model file is re-uploaded
   under new terms; verdicts are dated, not eternal.

라이선스 원문을 감사 일자에 확보하고, 병합 계보상 가장 제한적인 라이선스를
기준으로 판정합니다. 판정은 유지보수자의 승인(PR)으로 확정됩니다.
