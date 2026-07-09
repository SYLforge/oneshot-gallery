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
| `bismuthIllustrious_v80` | Illustrious-XL merge | TBD | TBD | — | **NOT YET AUDITED — do not ship imagery from this model** |
| `rIllustrmix_diV20` | Illustrious-XL merge | TBD | TBD | — | **NOT YET AUDITED — do not ship imagery from this model** |
| `rinFlanimeIllustrious_v40` | Illustrious-XL merge | TBD | TBD | — | **NOT YET AUDITED — do not ship imagery from this model** |
| `zenijiMixKIllust_v10` | Illustrious-XL merge | TBD | TBD | — | **NOT YET AUDITED — do not ship imagery from this model** |
| `zenijiMixKWebtoon_v10` | Illustrious-XL merge | TBD | TBD | — | **NOT YET AUDITED — do not ship imagery from this model** |
| `waiANIMA_v10Base10` | Illustrious/anime lineage | TBD | TBD | — | **NOT YET AUDITED — do not ship imagery from this model** |
| `svdq Qwen-Image-Edit-2511` (SVDQuant) | Qwen-Image-Edit | TBD | TBD | — | **NOT YET AUDITED — do not ship imagery from this model** |

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
