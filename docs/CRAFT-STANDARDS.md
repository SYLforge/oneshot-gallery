# Craft Standards — 2026 프리미엄 프론트엔드 기준서

이 문서는 Oneshot Gallery의 모든 디자인 항목이 따라야 할 "세밀한 영역의 아름다움" 기준이다.
Awwwards SOTD 수상작 분석, 2025-2026 타이포그래피/모션 트렌드 리서치, 그리고 갤러리 내
벤치마크 항목(memphis, zine, dream, atelier, grid, neon, riso)에서 추출한 패턴을 바탕으로 한다.

> **원칙**: "그럴듯한 느낌"과 "프리미엄"의 차이는 8가지 디테일의 누적이다.
> 디폴트 `ease`, 매직넘버 간격, 단일 shadow, 정적 타이포그래피가 그 격차를 만든다.

---

## 1. 이징(Easing) — 디폴트 `ease`/`linear` 절대 금지

가장 흔한 "매끄럽지 못한" 느낌의 원인. 모든 transition/animation에 커스텀 곡선을 써라.

```css
:root {
  /* 입장/리빌 — 강력한 ease-out */
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:   cubic-bezier(0.25, 1, 0.5, 1);
  /* 페이지 전환 — 대칭 */
  --ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
  /* hover/누름 — 미세 바운스 (y값 > 1) */
  --ease-back:        cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-back-soft:   cubic-bezier(0.5, 1.5, 0.5, 1);
}
```

**Duration 가이드라인:**
- hover/focus (마이크로): `100-200ms`
- 토글/상태 변경: `200-300ms`
- 카드 enter / 섹션 리빌: `300-450ms` (stagger와 함께)
- 디스플레이 타이포그래피 reveal: `500-900ms`
- 페이지 전환: `400-700ms`

---

## 2. Fluid 타이포그래피 — `clamp()` 전면 적용

미디어쿼리 점프가 아닌 부드러운 스케일링. **Major Third (1.320)** 비율이 가장 안전한 프리미엄 비율.

```css
:root {
  --step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.94rem);  /* caption */
  --step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.19rem);  /* body */
  --step-1:  clamp(1.32rem, 1.24rem + 0.40vw, 1.56rem);  /* h4 */
  --step-2:  clamp(1.74rem, 1.61rem + 0.65vw, 2.13rem);  /* h3 */
  --step-3:  clamp(2.30rem, 2.10rem + 1.02vw, 2.94rem);  /* h2 */
  --step-4:  clamp(3.04rem, 2.74rem + 1.54vw, 4.06rem);  /* h1 */
  --step-5:  clamp(4.01rem, 3.57rem + 2.27vw, 5.61rem);  /* display */
}
```

**Letter-spacing 표준:**
| 용도 | 값 | 비고 |
|---|---|---|
| 디스플레이 헤딩 | `-0.02em` ~ `-0.04em` | 클수록 더 타이트 |
| 본문 (산세리프) | `-0.011em` | Inter/JetBrains 권장 |
| 본문 (세리프) | `-0.003em` ~ `0` | 세리프는 거의 0 |
| 한국어 본문 | `0` 또는 `-0.005em` | 한글은 트래킹 벌리지 않음 |
| 라벨/킥커 (uppercase) | `0.15em` ~ `0.25em` | 영화 자막/크레딧 느낌 |

**Line-height 표준:**
| 용도 | 값 |
|---|---|
| 디스플레이 헤딩 | `1.0` ~ `1.1` |
| 일반 헤딩 | `1.1` ~ `1.2` |
| 본문 (산세리프) | `1.5` ~ `1.7` |
| 본문 (세리프) | `1.6` ~ `1.8` |
| 한국어 본문 | `1.7` ~ `1.9` (여유) |

---

## 3. 간격 시스템 — 4px 베이스라인

매직넘버(`margin-bottom: 48px`)를 쓰지 말고 토큰화된 스케일을 써라.

```css
:root {
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px — 기본 단위 */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
}
```

큰 여백은 `clamp()`로 반응형: `padding: clamp(56px, 9vh, 120px)`.

---

## 4. 다층 Shadow — 깊이의 3단 레이어링

단일 `box-shadow`는 평면적이다. 프리미엄은 ambient + key + contact의 조합이다.

```css
/* 프리미엄 카드 — 3단 깊이 */
.card {
  box-shadow:
    0 1px 2px  rgba(0,0,0,0.04),   /* ambient — 표면 접촉 */
    0 8px 16px rgba(0,0,0,0.08),   /* key — 주 그림자 */
    0 24px 48px rgba(0,0,0,0.06);  /* contact — 원경 확산 */
}
/* 다크 테마용 — 더 깊고 투명하게 */
.card-dark {
  box-shadow:
    0 1px 0   rgba(255,255,255,0.04),
    0 8px 24px rgba(0,0,0,0.4),
    0 32px 64px rgba(0,0,0,0.3);
}
/* 글래스 — 미세 밝은 보더 + 깊은 그림자 */
.glass {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.25);  /* 접근성 필수 */
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
/* 네오-브루탈리즘 — hard offset, blur 없음 */
.brutal {
  box-shadow: 6px 6px 0 #0A0A0A;
  transition: transform 150ms var(--ease-out-expo), box-shadow 150ms var(--ease-out-expo);
}
.brutal:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 #0A0A0A;
}
```

---

## 5. 색 토큰 명암비 주석 — 접근성 의도 문서화

벤치마크 항목들은 모든 색 토큰에 명암비와 용도를 주석으로 남긴다. 이것은 "왜 이 색인지"를
설명하고, 접근성을 실수가 아닌 의도로 만든다.

```css
:root {
  --x-teal: #2bb1a8;   /* ink on it: 6.59:1 (AA). 본문용 가능 */
  --x-coral: #ff6b6b;  /* large/decorative only 3.2:1 — 본문 불가, 표면 전용 */
  --x-ink: #1a1a2e;    /* paper 위에서 15.3:1 (AAA) */
}
```

---

## 6. 광학 정렬 — 수학적 중앙이 아닌 시각 중앙

텍스트/아이콘의 수학적 중앙은 눈에 어긋나 보인다. 미세 transform으로 보정하라.

```css
/* 대문자/눈이 큰 글자는 위로 살짝 */
.label { padding: 0.75rem 1rem 0.625rem; } /* 위 12px, 아래 10px — 시각 균형 */
/* 아이콘 중앙 정렬 보정 */
.icon-centered { transform: translateY(-0.0625em); }
```

---

## 7. Hover/Focus — 색상이 아닌 transform으로 입체감

```css
.card { transition: transform 200ms var(--ease-out-expo); }
.card:hover { transform: translateY(-2px); }  /* -2px ~ -4px이 sweet spot */
/* focus-visible로 접근성 + 디자인 */
:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 2px;
}
```

---

## 8. 한국어 별도 처리

한국어는 라틴과 다른 line-height/letter-spacing이 필요하다. `:lang(ko)`로 별도 규칙을 만들어라.

```css
:lang(ko) {
  line-height: 1.9;           /* 라틴 1.6보다 여유 */
  letter-spacing: 0;          /* 한글은 트래킹 벌리지 않음 */
  word-break: keep-all;       /* 단어 단위 줄바꿈 */
  word-wrap: break-word;
}
```

---

## Aesthetic별 레퍼런스 패턴

### neo-brutalist (block)
- `border: 2-4px solid #0A0A0A`, `border-radius: 0` (또는 고정 4-8px, 혼용 금지)
- `box-shadow: 6px 6px 0 #0A0A0A` (blur 0, hard offset)
- hover: `transform: translate(-2px,-2px)` + shadow 확대
- 타이포: 모노스페이스/grotesk, weight 700-900, `letter-spacing: -0.02em`
- 고채도 액센트 1개 (#FF6B35, #FFE600), gradient 절대 금지

### cinematic-dark (reel, noir)
- 배경 `#0A0A0B` (pure black 아닌 살짝 푸른/회색)
- label: `text-transform: uppercase; letter-spacing: 0.15-0.25em; color: #8A8A8E`
- 헤딩: `font-weight: 300; letter-spacing: -0.03em; line-height: 1.0`
- 카드: `border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(4px)`

### glass-futurism (prism, widget)
- `background: rgba(255,255,255,0.12)` (alpha 10-15%)
- `backdrop-filter: blur(12px) saturate(160%)` — 12px가 검증된 sweet spot
- `border: 1px solid rgba(255,255,255,0.25)` — 접근성 필수
- 뒤에 오로라: `radial-gradient` 다중 + `filter: blur(40px)`

### editorial-serif (chapter, zine)
- 본문 `max-width: 65ch; line-height: 1.7; text-wrap: pretty`
- 드롭캡: `::first-letter { font-size: 3.5em; float: left; }`
- 다단: `column-count` + `column-rule`
- 헤딩: `font-weight: 400; font-style: italic` (light/regular가 고급스러움)
- 산세리프 small-caps 캡션과 믹스

### terminal-core (wave, grid)
- `font-size: 14px` 정적 (모노스페이스는 고정)
- `ch` 단위 그리드: `grid-template-columns: repeat(80, 1ch)`
- `repeating-linear-gradient` 스캔라인
- 3단 phosphor glow: `text-shadow: 0 0 2px, 0 0 8px, 0 0 20px`
- `font-variant-numeric: tabular-nums`, `letter-spacing: 0` (건드리지 말 것)

### organic-nature (forest, dream)
- 3단 깊이 패럴랙스 (far/mid/near, 서로 다른 속도)
- `color-mix(in oklab)`로 스크롤에 따른 색 보간
- `feTurbulence` 잎사귀/안개 텍스처
- 서로소 주기 애니메이션 (13s/17s/23s — 루프 겹침 방지)

### product-3d (orbit)
- `perspective: 1000px; perspective-origin: 50% 40%`
- `transform-style: preserve-3d`
- contact shadow 필수: `filter: drop-shadow(0 30px 40px rgba(0,0,0,0.25))`
- 입장: Z축에서 `translateZ(-200px) → 0`

---

## Craft 체크리스트 (모든 항목 필수)

- [ ] 색 토큰마다 명암비 주석 (`/* ink on it: X.XX:1 (AA) */`)
- [ ] 디스플레이 폰트 `letter-spacing: -0.02em ~ -0.04em`
- [ ] 한국어 `:lang(ko)` 별도 line-height/letter-spacing
- [ ] 용도별 2개+ cubic-bezier (입장용/hover용 분리)
- [ ] 모든 `font-size`와 큰 여백에 `clamp()` 사용
- [ ] 간격 4px 배수 토큰 (`--space-*`), 매직넘버 금지
- [ ] 다층 box-shadow (ambient + key + contact)
- [ ] 미디어쿼리 3개+ (720/900/1200px)
- [ ] 모든 애니메이션에 `prefers-reduced-motion` 대응
- [ ] `transition: all` 금지 — 개별 프로퍼티 명시
- [ ] `:focus-visible` 스타일 포함
- [ ] `text-wrap: pretty` 본문 적용

---

## 출처

- [Awwwards](https://www.awwwards.com/), [wavespace 2026](https://www.wavespace.agency/blog/best-website-design-examples)
- [Smashing - Fluid Typography](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/), [Aleksandr Hovhannisyan - Type Scale](https://www.aleksandrhovhannisyan.com/blog/fluid-type-scale-with-css-clamp/)
- [Carmen Ansio - Spring Physics in CSS](https://www.carmenansio.com/articles/spring-physics-css/), [Josh Collinsworth - Easing Curves](https://joshcollinsworth.com/blog/easing-curves)
- [UX Design - Baseline Grids](https://uxdesign.cc/baseline-grids-design-systems-ae23b5af8cec)
- [Superdesign - Glassmorphism](https://superdesign.dev/styles/glassmorphism), [Bejamas - Neubrutalism](https://bejamas.com/blog/neubrutalism-web-design-trend)
- [The Monospace Web](https://owickstrom.github.io/the-monospace-web/)
