"use client";

/**
 * The lead essay — the zine's editorial centerpiece. A drop-cap opener, a
 * bilingual manifesto set in CSS multi-column running text (the dense
 * newsprint register, the opposite of the editorial-serif sibling's airy
 * single measure), a highlighter-stroked pull quote dropped between the
 * columns, and a margin rail of marginalia — handwritten-feeling notes
 * pinned beside the text like a reader's annotations on a photocopy.
 *
 * The drop cap is a real wrapped glyph with the highlighter behind it; the
 * pull quote carries the same marker pass. Marginalia sit in a margin rail
 * at wide viewports and fold beneath the column at narrow ones. Every
 * paragraph is in the server HTML; with JavaScript off the essay reads as a
 * finished document.
 */
export default function LeadEssay() {
  return (
    <section
      id="zine-essay"
      className="zine-essay"
      aria-labelledby="zine-essay-title"
    >
      <header className="zine-essay__head" data-reveal>
        <p className="zine-kicker">
          <span lang="ko">권두 칼럼</span> · Editor’s Note
        </p>
        <h2 id="zine-essay-title" className="zine-essay__title" lang="ko">
          왜 아직도 종이를 접는가
        </h2>
        <p className="zine-essay__title-en">Why We Still Fold Paper</p>
        <p className="zine-essay__byline">
          <span lang="ko">발행인 노지현</span> · Publisher Noh Ji-hyun
        </p>
      </header>

      <div className="zine-essay__columns">
        <p className="zine-essay__p zine-essay__p--ko zine-essay__p--drop" lang="ko" data-reveal>
          <span className="zine-essay__drop" aria-hidden="true">
            왜
          </span>
          아직도 종이를 접는가. 스크린은 즉각적이고, 알고리즘은 완벽하게
          취향을 맞춘다. 그런데도 우리는 매달 천 장의 종이를 접고, 복사하고,
          스테이플러로 묶는다. 그 일이 합리적이지 않기 때문이다.
        </p>
        <p className="zine-essay__p zine-essay__p--en" data-reveal>
          Why do we still fold paper? The screen is instant, the algorithm
          perfectly tuned to taste — and yet every month we fold, photocopy,
          and staple a thousand sheets. Because the work is not reasonable.
        </p>

        <p className="zine-essay__p zine-essay__p--ko" lang="ko" data-reveal>
          독립지는 이익을 내지 않는다. 그것은 손해를 전제로 한다. 그 손해를
          누가 감당할 것인가를 두고, 우리는 매번 싸운다 — 누가 인쇄비를 내고,
          누가 배포를 맡고, 누가 마지막 불을 끄는가.
        </p>
        <p className="zine-essay__p zine-essay__p--en" data-reveal>
          A zine does not turn a profit. It presupposes a loss. We fight,
          every issue, over who absorbs that loss — who pays the print run,
          who carries the bundle, who kills the last light.
        </p>

        <blockquote className="zine-pull" data-reveal>
          <p className="zine-pull__text" lang="ko">
            “<mark className="zine-pull__hl">좋은 잡지는 손해보는 잡지다.</mark>
            손해를 두려워하지 않는 사람만이 인쇄 버튼을 누른다.”
          </p>
          <p className="zine-pull__text-en">
            “A good zine is a losing zine. Only someone unafraid to lose
            presses print.”
          </p>
        </blockquote>

        <p className="zine-essay__p zine-essay__p--ko" lang="ko" data-reveal>
          복사기 소리를 좋아한다고 하면 거짓말이겠지만, 그 소리에 익숙해진
          것은 사실이다. 새벽 네 시, 드럼이 돌아가는 소리. 한 장이 나오고,
          또 한 장. 그 사이의 정적이 우리의 호흡이 되었다.
        </p>
        <p className="zine-essay__p zine-essay__p--en" data-reveal>
          It would be a lie to say we love the sound of the copier, but we
          have grown used to it. Four in the morning, the drum turning. One
          sheet out, then another. The silence between is how we breathe now.
        </p>

        <p className="zine-essay__p zine-essay__p--ko" lang="ko" data-reveal>
          그래서 우리는 접는다. 종이를, 시간을, 그리고 조금의 돈을. 그것이
          남기는 것 — 잉크 자국, 접힌 모서리, 한 독자의 가방 바닥에 들어가는
          무게 — 가 우리가 원하는 전부다. 화면은 꺼진다. 종이는 남는다.
        </p>
        <p className="zine-essay__p zine-essay__p--en" data-reveal>
          So we fold. Paper, time, and a little money. What it leaves — an
          ink mark, a creased corner, the weight of it at the bottom of a
          reader’s bag — is all we wanted. The screen goes dark. The paper
          stays.
        </p>
      </div>

      <aside className="zine-marginalia" aria-label="여백 주석 · marginalia">
        <p className="zine-marg zine-marg--a" data-reveal="margin">
          <span className="zine-marg__star" aria-hidden="true">
            ※
          </span>
          <span lang="ko">
            2019년 첫 호는 87부였다. 지금도 87부는 남이 읽어준다.
          </span>
        </p>
        <p className="zine-marg zine-marg--b" data-reveal="margin">
          <span className="zine-marg__star" aria-hidden="true">
            ※
          </span>
          <span lang="ko">
            인쇄비는 늘 부족했고, 그 덕에 우리는 늘 두 도수를 썼다. 제약이
            미학이 되었다.
          </span>
        </p>
        <p className="zine-marg zine-marg--c" data-reveal="margin">
          <span className="zine-marg__star" aria-hidden="true">
            ※
          </span>
          <span lang="ko">
            독자가 보내온 사진 한 장이 한 호를 만든 적이 있다. 그 호는 아직도
            가장 많이 읽힌다.
          </span>
        </p>
      </aside>
    </section>
  );
}
