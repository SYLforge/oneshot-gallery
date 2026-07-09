"use client";

import InkLink from "./InkLink";

/**
 * The colophon — set like a masthead page at the back of the issue:
 * publisher, editor, type credits, the journal's standing statement, and
 * the two working links (subscription, back to the cover), both carrying
 * the rubber-band underline draw.
 */
export default function Colophon() {
  return (
    <footer className="yeobaek-colophon" aria-labelledby="yb-colophon-title">
      <div className="yeobaek-colophon__inner">
        <header className="yeobaek-colophon__head" data-reveal>
          <p className="yeobaek-kicker">
            <span lang="ko">판권</span> · Colophon
          </p>
          <h2 id="yb-colophon-title" className="yeobaek-colophon__title" lang="ko">
            여백
          </h2>
          <p className="yeobaek-colophon__statement">
            <span lang="ko">여백은 계간으로, 말과 말 사이에서 발행됩니다.</span>{" "}
            <em>Yeobaek is published quarterly, in the space between words.</em>
          </p>
        </header>

        <dl className="yeobaek-colophon__masthead" data-reveal>
          <div>
            <dt>
              <span lang="ko">발행</span> · Publisher
            </dt>
            <dd>
              <span lang="ko">여백사, 서울</span> — Yeobaek Press, Seoul
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ko">편집인</span> · Editor
            </dt>
            <dd>
              <span lang="ko">한이수</span> — Han I-su
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ko">이번 호 에세이</span> · Essay
            </dt>
            <dd>
              <span lang="ko">문서정</span> — Moon Seo-jeong
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ko">활자</span> · Type
            </dt>
            <dd>
              <span lang="ko">나눔명조</span> · Nanum Myeongjo — Libre Caslon
              Text
            </dd>
          </div>
          <div>
            <dt>
              <span lang="ko">구독</span> · Subscribe
            </dt>
            <dd>
              <InkLink href="mailto:margin@yeobaek.press">
                margin@yeobaek.press
              </InkLink>
            </dd>
          </div>
        </dl>

        <div className="yeobaek-colophon__end" data-reveal>
          <p className="yeobaek-colophon__legal">
            © 2026 <span lang="ko">여백</span> —{" "}
            <span lang="ko">남은 것은 여백뿐.</span> What remains is the
            margin.
          </p>
          <p className="yeobaek-colophon__top">
            <InkLink href="#yeobaek-top">
              <span lang="ko">처음으로</span> · Back to the cover
            </InkLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
