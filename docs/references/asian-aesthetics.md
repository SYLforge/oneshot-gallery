# East-Asian aesthetic reference library · 동아시아 미학 레퍼런스

A curated, dated reference set consulted when designing the gallery's
Asian-aesthetic entries (KEMURI, GIWA, HANJI SLATE, and successors).
This document exists so every design decision has a citable source and so
future contributors can trace and surpass these references.

> **The bar.** Every entry built from this document should aim to be
> *better* than the references cited here, not a copy. References are
> scaffolding for taste, not a ceiling.

---

## 1. Award galleries & curators (where the bar is set)

| Source | What to mine it for | URL |
| --- | --- | --- |
| Awwwards — Japan sites | Minimalist, wabi-sabi, ink-heavy award winners | https://www.awwwards.com/websites/Japan/ |
| Awwwards — South Korea sites | Best browse-source for Korean award winners | https://www.awwwards.com/websites/South%20Korea/ |
| Awwwards — China sites | Current Chinese creative pool (CHAGEE, CHANDO, etc.) | https://www.awwwards.com/websites/China/ |
| Awwwards — Scrolling | Strong scroll-interaction reference | https://www.awwwards.com/websites/scrolling/ |
| Awwwards — Sites of the Year | Annual highest-awarded craft | https://www.awwwards.com/websites/sites_of_the_year/ |
| KOKUYO DESIGN AWARD 2025 | Current Japanese design-award trends | https://www.kokuyo.com/en/award/archive/prizepast/2025/ |
| CSS Design Awards — Parallax | Parallax gallery | https://www.cssdesignawards.com/website-gallery?feature=parallax |
| MaxiBestOf — Japanese Websites | Dedicated Japan category ("craft and restraint") | https://maxibestof.com/ |
| Japan Web Design Gallery | Japan-focused gallery/blog | https://www.japanwebdesign.com/blog/ |

**The highest-value single article:** Utsubo — "Japanese Web Design: Style,
Aesthetics & Examples" — consolidates the *density paradox*, *ma*,
*tategaki*, and typography mixing better than anything else.
https://www.utsubo.com/blog/japanese-web-design-style-guide

**Takeaway:** Japanese award-winners succeed through *restraint* — vast
negative space (ma / 間), a single accent, and typography as the hero.
They rarely lean on heavy decoration; the craft is in what is omitted.

### Verified award-winning benchmark sites (re-verify live before citing)

| Site | Award | Aesthetic root | URL |
| --- | --- | --- | --- |
| **SAKAZUKI** | Awwwards **Site of the Day** | Sake culture as portal to Japanese craft | https://www.awwwards.com/sites/sakazuki |
| **THE TAWARAYA** | Awwwards Honorable Mention + CSSDA | Wabi-sabi, 300-yr Kyoto ryokan, seasonal (*kisetsu*) | https://www.awwwards.com/sites/the-tawaraya |
| **&Tea** | Awwwards Honorable Mention | Taiwanese tea culture, parallax | https://www.awwwards.com/sites/tea |
| **Mr. Pandas Paper Portfolio** | Awwwards Site of the Day | Hand-drawn papercraft (washi/sumi-e sensibility) | https://www.awwwards.com/sites/mr-pandas-paper-portfolio |
| **JIEJOE** | Awwwards Honorable Mention | Modern Chinese creative portfolio | https://www.awwwards.com/sites/jiejoe |
| **Studio Linear** | Awwwards Honorable Mention | Korean studio-portfolio benchmark | https://www.awwwards.com/sites/studio-linear-2 |
| **Wewe Liu — "Scroll"** | Awwwards Inspiration | Scroll + Chinese design elements | https://www.awwwards.com/inspiration/scroll-wewe-liu-2 |

### Studios that produce most of Japan's award winners
- **SHIFTBRAIN** (Tokyo/Hiroshima/Amsterdam) — https://www.awwwards.com/shiftbrain-inc/
- **Garden Eight** (Tokyo) — Mobile of the Week for "The Shift"
- **monopo**, **Takram**, **WOW Inc.**

### ⚠️ The Korean-traditional gap (opportunity)
No verified Awwwards/FWA winner exists whose explicit theme is *dancheong*,
*minhwa*, or *hanji*. Korean award winners skew toward minimalist studios
and typography. **A gallery entry that overtly modernizes minhwa (tiger/
magpie), dancheong obangsaek, or Goryeo celadon has no direct competitor.**
This is the gap the gallery's Korean-traditional entries (GIWA, HANJI SLATE,
and the planned MINHWA) are positioned to fill.

---

## 2. The benchmark procedural landscape (to surpass)

### `{Shan, Shui}*` by LingDong
- **What:** Procedurally-generated, vector-format, infinitely-scrolling
  Chinese landscape painting that runs in the browser. Mountains, trees,
  mist and waterfalls are synthesized from noise functions and drawn as SVG
  — no images, no painting assets.
- **Why it matters:** This is the canonical "can code BE the painting?"
  reference. Widely admired in the creative-coding community.
- **Our goal:** KEMURI already answers this for *sumi-e smoke* (curl-noise
  on canvas). A future entry should answer it for *landscape* — a
  procedural shan-shui scroll where the mountains and mist are drawn live
  from noise, responding to scroll and pointer.
- **Live demo:** https://lingdong-.github.io/shan-shui-inf/
- **Source:** https://github.com/LingDong-/shan-shui-inf

---

## 3. Aesthetic traditions & their modern web translation

### 3.1 Wabi-sabi & ma (Japanese imperfection + negative space)
The beauty of impermanence, imperfection, and the empty space *between*
things. `ma` (間) is the active, meaningful pause.
- **Web translation:** generous whitespace, asymmetric layouts, a muted
  palette with one imperfect accent, slow easing curves that breathe.
- **Reference:** Preserving Japanese Culture with Sumi-e Painting Classes
  (YouTube) — the cultural roots of ink aesthetics.
  https://www.youtube.com/watch?v=mVyz3iyBhxo

### 3.2 Sumi-e & shodō (ink-wash painting & brush calligraphy)
- **Web translation:** SVG `stroke-dashoffset` brush-draw reveals that
  mimic the one-directional, no-going-back motion of a brush; ink-bleed
  transitions via `feTurbulence` + `feDisplacementMap`.
- **Key stroke vocabulary:** *harai* (sweeping stroke), *tome* (emphatic
  stop). Source: Shodō Brush Calligraphy – Writing from the Heart.
  https://www.youtube.com/watch?v=swEUKk5doew
- **Implementation bible:** CSS-Tricks, "Animate Calligraphy with SVG"
  (mask-path writing effect).
  https://css-tricks.com/animate-calligraphy-with-svg/

### 3.3 Minhwa (Korean folk painting 민화)
Bold, charming, symbolic folk art from late Joseon. Tigers, magpies,
peonies (wealth), suns/moons, the *sipjangsaeng* (十長生, ten symbols of
longevity). Unlike refined literati painting, minhwa is *naive and vivid*.
- **Web translation:** saturated but warm palettes, flat illustration
  motifs as decorative UI, symbolic iconography (tiger/magpie = good news,
  peony = prosperity). A minhwa entry should feel *generous and joyful*,
  not austere.
- **References:**
  - MINHWA & minhwa: Korean Folk Paintings in Dialogue with the
    Contemporary (Korean Cultural Center).
    https://www.koreanculture.org/multimedia/2020/03/11/minhwa-minhwa-korean-folk-paintings-in-dialogue-with-the-contemporary
  - The Art of Minhwa: Traditions and Identity.
    https://www.cosycolours.nl/post/the-art-of-minhwa

### 3.4 Dancheong (Korean decorative coloring 단청)
The five-color (obangsaek 오방색) system painted on wooden architecture:
blue/green (east), red (south), yellow/white (west), black (north). Each
color carries directional and cosmological meaning.
- **Web translation:** a disciplined five-color token system where the
  palette is not arbitrary — each hue has a *role*. GIWA already explores
  the eave-line drawing; a deeper dancheong entry could make the obangsaek
  a navigational color system.
- **Reference:** Dancheong — Korean Culture Organization.
  https://www.korean-culture.org/eng/webzine/201905/sub07.html

### 3.5 Hanji (Korean paper 한지) & celadon (청자)
- **Hanji:** warm, fibrous mulberry paper — the *texture* substrate. Use
  as a noise overlay or paper-grain background (HANJI SLATE already does).
- **Celadon:** the jade-green glaze of Goryeo celadon — a muted,
  sophisticated green-gray for elegant, high-end minimal palettes.
- **Combined reference:** "Dancheong Wired Keyboard / Celadon" — a modern
  product fusing hanok curves, hanji texture, celadon tones, and dancheong
  aesthetics (a model for cross-tradition fusion).
  https://www.instagram.com/p/DYWhjRUE3kd/

### 3.6 Shanshui (Chinese mountain-water landscape 山水)
Tang-dynasty ink landscape painting emphasizing the *relationship* between
mountains, water, and mist, with distance expressed through layered ink
density (not perspective).
- **Web translation:** parallax layers of decreasing saturation/opacity
  receding into mist; a scroll that *is* the unrolling of a hand scroll.
- **Reference:** Shan shui — Wikipedia.
  https://en.wikipedia.org/wiki/Shan_shui
- **Museum guide:** Shan Shui: Home — M+ Research Guide.
  https://mplus.libguides.com/shanshui

### 3.7 Hanok (Korean traditional architecture 한옥)
Wooden structure, ondol (underfloor heating), maru (wooden hall), curved
eaves, courtyard orientation to sun and seasons. Balance of nature and
craft.
- **Web translation:** structural grids that echo wooden joinery (no
  nails — mortise-and-tenon logic visible in the layout); sectioned
  spaces (maru/ondol) as content regions.
- **Reference:** Korean Hanok Design: Nature, Balance, and Craft.
  https://blog.materialbank.com/korean-hanok-design-nature-balance-and-craft/
- **Award note:** The Hanok Heritage won the IIDA Global Excellence Awards
  2024 (Hotel category) — traditional Korean architecture is being
  recognized internationally.
  https://www.thehanokheritage.com/information/news/24?lang=en

---

## 4. Recurring high-impact interaction patterns

These are the techniques the best East-Asian-aesthetic sites share. Each
is implementable with vanilla JS/CSS/SVG (no heavy dependencies). Ranked
by impact-to-rarity ratio — Tier 1 is where the differentiation lives.

### Tier 1 — Distinctive, under-used, high-impact (claim these)

| Pattern | How | Where it shines |
| --- | --- | --- |
| **Ink-brush SVG mask reveal on scroll** | An SVG `<mask>` uses a brush-stroke path as the mask element, animated against scroll progress. The *trailing* motion is what makes it physical. | Section transitions, image reveals — **the signature move** |
| **Scroll-as-hand-scroll-painting** | Layered landscape planes (mountains → mist → water → figures) parallax at different rates and ink densities; the scroll *is* unrolling a scroll | Landscape storytelling (SHAN-SHUI) |
| **Vertical text (tategaki 縦書き)** | `writing-mode: vertical-rl`. The most authentic Japanese interaction and the most frequently skipped by Western "Japanese-inspired" sites | Headers, poetry, calligraphy display |
| **Ink-bleeding / wash transition** | Black ink bleeds outward (water-drop diffusion) to reveal the next section — canvas displacement or WebGL fluid | Full-screen section transitions |

**Canonical tutorial for the Tier-1 mask reveal:** Codrops — "SVG Mask
Transitions on Scroll with GSAP and ScrollTrigger" by Hiroki Watanabe
(4 patterns). We adapt the mask concept to vanilla scroll + IntersectionObserver.
https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/

**Tategaki reference:** "Making Vertical Layouts a Web Standard"
https://tategaki.github.io/en/ — the project dedicated to promoting
CSS vertical-RL Japanese layouts. Core technique: `writing-mode: vertical-rl`.

### Tier 2 — Established but still effective

| Pattern | How | Where it shines |
| --- | --- | --- |
| **Brush-stroke draw-on** | `path.getTotalLength()` → set `stroke-dasharray`/`offset` → animate `offset`→0 on scroll-in | Logo reveal, section dividers, calligraphy headers |
| **Seal-stamp interaction** | A red `feTurbulence`-textured stamp descends/rotates on click or scroll, "certifying" a section | CTAs, section punctuation |
| **Seasonal / atmospheric background** | Subtle background shifts by season/time-of-day (cherry blossom → cicada summer → maple → snow). TAWARAYA's "12 months captured" is the reference | Ambient mood, hero scenes |
| **Parallax landscape layers** | Multi-plane parallax with traditional motifs (Hokusai wave strata, mountain haze) | Hero scenes, landscapes |
| **Calligraphic / shodō text reveal** | Characters drawn stroke-by-stroke via SVG `stroke-dasharray`, timed to scroll or a brush cursor. Pairs with vertical text | Headers, poetry |

### Tier 3 — Supporting techniques

| Pattern | How | Where it shines |
| --- | --- | --- |
| **Washi / hanji paper texture** | `feTurbulence` grain overlay, fiber noise, low-opacity paper-color base | Any paper/traditional entry (HANJI SLATE) |
| **Ma (間) — deliberate negative space + slow timing** | Long pauses, slow eases (`power4.out`, 1.2s+), generous whitespace | Editorial pacing, any premium section |
| **Obangsaek / dancheong five-color accents** (Korean) | Blue, red, yellow, white, black as a *structured* (not decorative) color system | Dancheong family (GIWA) |
| **Blue-and-white (青花瓷) palette** (Chinese) | Cobalt blue on porcelain white | Porcelain/ceramic themes |

**Implementation notes:**
- `stroke-dashoffset` reveal on scroll: MDN,
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/stroke-dashoffset
- CSS-Tricks "Animate Calligraphy with SVG" (mask-path writing effect):
  https://css-tricks.com/animate-calligraphy-with-svg/
- The gallery's policy is **vanilla implementation** — these patterns are
  hand-built per entry, not pulled from a library (no GSAP, no Vivus).

---

## 5. Sources consulted (full list)

**Awwwards / awards / curators**
- https://www.awwwards.com/websites/Japan/
- https://www.awwwards.com/websites/South%20Korea/
- https://www.awwwards.com/websites/China/
- https://www.awwwards.com/websites/scrolling/
- https://www.awwwards.com/websites/sites_of_the_year/
- https://www.awwwards.com/winner-list/Japan
- https://www.kokuyo.com/en/award/archive/prizepast/2025/
- https://www.cssdesignawards.com/website-gallery?feature=parallax
- https://www.utsubo.com/blog/japanese-web-design-style-guide (highest-value article)
- https://www.utsubo.com/blog/best-japanese-web-design-studios-2026

**Verified benchmark sites**
- https://www.awwwards.com/sites/sakazuki (SOTD — sake/craft)
- https://www.awwwards.com/sites/the-tawaraya (HM — wabi-sabi ryokan)
- https://www.awwwards.com/sites/tea (HM — Taiwanese tea)
- https://www.awwwards.com/sites/mr-pandas-paper-portfolio (SOTD — papercraft)
- https://www.awwwards.com/sites/jiejoe (HM — Chinese portfolio)
- https://www.awwwards.com/sites/studio-linear-2 (HM — Korean studio)
- https://www.awwwards.com/inspiration/scroll-wewe-liu-2 (scroll + Chinese)

**Procedural landscape benchmark (to surpass)**
- https://github.com/LingDong-/shan-shui-inf
- https://lingdong-.github.io/shan-shui-inf/
- https://arxiv.org/abs/2508.16612 (Negative Shanshui — real-time AI ink synthesis)
- https://www.creativeapplications.net/member/shanshui-dada-ai-assists-human-creator-in-drawing-chinese-ink-wash-landscape-painting/

**Japanese aesthetics**
- https://www.youtube.com/watch?v=mVyz3iyBhxo (sumi-e roots)
- https://www.youtube.com/watch?v=swEUKk5doew (shodō stroke vocabulary)
- https://millenniumgalleryjp.com/en-us/blogs/journal/japanese-calligraphy-the-art-of-expressing-the-spirit-in-writing
- https://fontvibe.ai/styles/brush-japanese-ink
- https://tategaki.github.io/en/ (vertical text standard)
- https://ippodotea.com/ / https://global.ippodo-tea.co.jp/ (heritage tea brand)
- https://kinto-europe.com/ (craft minimalism)
- https://hokusai.anotherstory.world/en/ (Hokusai immersive)
- https://www.ukiyoeimmersiveart.com/en (ukiyo-e immersive)

**Korean aesthetics**
- https://www.koreanculture.org/multimedia/2020/03/11/minhwa-minhwa-korean-folk-paintings-in-dialogue-with-the-contemporary
- https://www.cosycolours.nl/post/the-art-of-minhwa
- https://en.wikipedia.org/wiki/Minhwa (minhwa overview)
- https://washingtondc.korean-culture.org/en/1126/board/890/read/140745 (hojakdo tiger-magpie)
- https://www.korean-culture.org/eng/webzine/201905/sub07.html (dancheong)
- https://www.instagram.com/p/DYWhjRUE3kd/ (hanok+hanji+celadon+dancheong fusion)
- https://blog.materialbank.com/korean-hanok-design-nature-balance-and-craft/
- https://www.thehanokheritage.com/information/news/24?lang=en (IIDA 2024 winner)
- https://www.metmuseum.org/essays/goryeo-celadon (Goryeo celadon)
- https://www.morisawa-usa.com/post/hangeul-typogarphy-guide (Hangeul typography)
- https://agbook.co.kr/en/books/hangeul-typography-guide/ (canonical KR type book)

**Chinese aesthetics**
- https://en.wikipedia.org/wiki/Shan_shui
- https://mplus.libguides.com/shanshui
- https://chinainstitute.org/edc-press/china-institute-gallery-presents-shan-shui-rebootre-envisioning-landscape-for-a-changing-world/
- https://intl.dpm.org.cn/index.html?l=en (Palace Museum)
- https://mw17.mwconf.org/glami/forbidden-city-is-a-museum-digital-exhibition/index.html (Digital Hand-scrolls)
- https://global.chagee.com/ (国风 tea brand)
- https://www.vam.ac.uk/articles/chinese-blue-and-white-ceramics (青花瓷)
- https://smarthistory.org/gardens-microcosms-spotlight-zhuozhengyuan/ (Suzhou gardens)

**Implementation**
- https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/ (Tier-1 mask reveal)
- https://css-tricks.com/animate-calligraphy-with-svg/
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/stroke-dashoffset
- https://www.boundev.ai/blog/svg-animation-css-tutorial-guide
- https://www.zionandzion.com/how-to-manipulate-an-svg-to-create-brush-stroke-animation/

---

*Compiled 2026-07-17 from direct web search + a deep research agent pass.
Re-audit references before relying on a specific award-winning site — the
web moves fast and links rot.*
