"use client";

/**
 * Section 06 — footer on ink-beam, the atelier's stamp.
 *
 * The page closes on the dark structural timber, the way a hanok closes on
 * its darkest element. The giant line is the building's thesis; the records
 * are the atelier's (fictional) coordinates. One eave-red underline on the
 * mailto link is the only dancheong trim down here — restrained, like the
 * eaves themselves.
 *
 * No interactivity beyond a mailto link; the season toggle and exploded
 * scrub are done. The footer is the building signed.
 */
export default function HanokFooter() {
  return (
    <footer className="hanok-footer">
      <div className="hanok-footer__inner">
        <p className="hanok-footer__giant">
          The layout is the building, and the building stands.
          <span lang="ko">레이아웃이 집이고, 집은 선다.</span>
        </p>

        <dl className="hanok-footer__data">
          <div>
            <dt>Atelier</dt>
            <dd>
              Jipdam <span lang="ko">집담 아틀리에</span> · Hahoe Village
            </dd>
          </div>
          <div>
            <dt>Built</dt>
            <dd>
              Restoration of an 1807 house <span lang="ko">1807년가 복원</span>
            </dd>
          </div>
          <div>
            <dt>Award</dt>
            <dd>
              In dialogue with IIDA 2024 heritage work{" "}
              <span lang="ko">IIDA 2024 유산 작업과 대화하며</span>
            </dd>
          </div>
          <div>
            <dt>Write</dt>
            <dd>
              <a className="hanok-footer__link" href="mailto:jipdam@hanok.example">
                jipdam@hanok.example
              </a>
            </dd>
          </div>
        </dl>

        <p className="hanok-footer__legal">
          © 2026 Jipdam Atelier — HANOK, the building is the layout.{" "}
          <span lang="ko">집이 곧 레이아웃.</span>
        </p>
      </div>
    </footer>
  );
}
