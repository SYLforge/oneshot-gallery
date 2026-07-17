"use client";

/**
 * Section 05 — the mortise-and-tenon (장부이음) blueprint.
 *
 * A hanok's structure is held together by joinery, not nails: the tenon
 * (장부) of one timber slots into the mortise (장부구멍) of another, and
 * the friction of the interlock — wedged, sometimes pinned with a
 * wooden dowel — is what keeps the roof up for centuries. This section
 * draws one such joint in the draftsman's language: timber solids, a
 * dashed blueprint baseline, the tenon outlined in the eave-red (the one
 * color that marks "this is the joinery"), and the bilingual part labels
 * with their dimensions.
 *
 * It is intentionally a technical drawing, not an illustration — the page
 * has already shown the building disassemble; here it shows why the pieces
 * stay together once reassembled. No animation; the joint is studied, not
 * performed. (The char-split and scroll-scrub techniques are earned
 * elsewhere; this section earns the page's stillness.)
 */
export default function JoineryDetail() {
  return (
    <section className="hanok-joinery" aria-labelledby="hanok-joinery-title">
      <div className="hanok-sechead">
        <span className="hanok-sechead__no" aria-hidden="true">
          05
        </span>
        <h2 className="hanok-sechead__title" id="hanok-joinery-title">
          Why it stands — the joint <span lang="ko">장부이음</span>
        </h2>
        <p className="hanok-sechead__note">
          No nails. The wood holds itself. <span lang="ko">못이 없다. 나무가 스스로를 잡는다.</span>
        </p>
      </div>

      <div className="hanok-joinery__grid">
        <svg
          className="hanok-joinery__svg"
          viewBox="0 0 420 320"
          role="img"
          aria-label="Mortise-and-tenon joint detail: a horizontal beam with a protruding tenon slotting into a vertical post's mortise, drawn as a blueprint with the tenon outlined in dancheong red. 장부이음 결구 상세도 — 가로 들보의 장부가 세로 기둥의 장부구멍으로 들어가는 모습."
        >
          {/* blueprint baseline + measure lines (dashed) */}
          <line className="hanok-joinery__blueprint" x1="20" y1="280" x2="400" y2="280" />
          <line className="hanok-joinery__blueprint" x1="40" y1="40" x2="40" y2="280" />

          {/* the vertical post (기둥) with a mortise cut into it */}
          <rect className="hanok-joinery__timber" x="210" y="50" width="70" height="230" rx="3" />
          {/* the mortise — a void cut into the post, outlined in red */}
          <rect className="hanok-joinery__mortise" x="210" y="140" width="70" height="44" rx="1" />
          {/* mortise interior hatch — the empty socket */}
          <line x1="222" y1="140" x2="222" y2="184" stroke="var(--hanok-red)" strokeWidth="0.8" opacity="0.5" />
          <line x1="234" y1="140" x2="234" y2="184" stroke="var(--hanok-red)" strokeWidth="0.8" opacity="0.5" />
          <line x1="246" y1="140" x2="246" y2="184" stroke="var(--hanok-red)" strokeWidth="0.8" opacity="0.5" />
          <line x1="258" y1="140" x2="258" y2="184" stroke="var(--hanok-red)" strokeWidth="0.8" opacity="0.5" />
          <line x1="270" y1="140" x2="270" y2="184" stroke="var(--hanok-red)" strokeWidth="0.8" opacity="0.5" />

          {/* the horizontal beam (들보) with the tenon protruding toward the post */}
          <rect className="hanok-joinery__timber" x="40" y="138" width="150" height="48" rx="3" />
          {/* the tenon — the protruding tongue, outlined in red (the joinery) */}
          <rect className="hanok-joinery__tenon" x="190" y="148" width="40" height="28" rx="1.5" />
          {/* a wooden dowel pin (목못) through the joint — secondary locking */}
          <ellipse cx="245" cy="162" rx="4" ry="6" fill="var(--hanok-wood)" stroke="var(--hanok-ink)" strokeWidth="0.8" />

          {/* labels with leader arrows */}
          {/* tenon label */}
          <path className="hanok-joinery__arrow" d="M 210 148 L 188 96 L 150 96" />
          <text className="hanok-joinery__dim" x="146" y="92" textAnchor="end">TENON · 장부</text>

          {/* mortise label */}
          <path className="hanok-joinery__arrow" d="M 280 162 L 330 120 L 372 120" />
          <text className="hanok-joinery__dim" x="376" y="116" textAnchor="start">MORTISE · 장부구멍</text>

          {/* dowel label */}
          <path className="hanok-joinery__arrow" d="M 245 168 L 245 240 L 300 240" />
          <text className="hanok-joinery__dim" x="304" y="236" textAnchor="start">WOODEN DOWEL · 목못</text>

          {/* dimension on the baseline */}
          <line className="hanok-joinery__blueprint" x1="40" y1="296" x2="190" y2="296" />
          <line x1="40" y1="290" x2="40" y2="302" stroke="var(--hanok-ink-faint)" strokeWidth="0.8" />
          <line x1="190" y1="290" x2="190" y2="302" stroke="var(--hanok-ink-faint)" strokeWidth="0.8" />
          <text className="hanok-joinery__dim" x="115" y="312" textAnchor="middle">BEAM · 들보</text>
        </svg>

        <div className="hanok-joinery__copy">
          <p>
            The joint is where the building thinks. A tenon is cut from the
            end of one timber; a mortise of the same shape is chiseled into
            the next; the two slide together and the geometry itself resists
            the pull. A wooden dowel pins the assembly so it cannot back out.
            Three pieces of wood, no metal, and the roof holds for three
            hundred winters.
          </p>
          <p lang="ko">
            결구는 집이 생각하는 자리다. 한 쪽 나무 끝에서 장부를 깎아내고,
            다른 쪽에 같은 모양의 장부구멍을 찍어내어, 둘이 맞물리게 한다.
            형태 자체가 당김을 견딘다. 목못 하나로 빠지지 않게 걸어두면,
            쇠는 쓰지 않고도 지붕이 삼백 겨울을 견딘다.
          </p>
          <ul className="hanok-joinery__list">
            <li>
              tenon · <span lang="ko">장부</span> — the tongue, cut from the beam end
            </li>
            <li>
              mortise · <span lang="ko">장부구멍</span> — the socket, chiseled into the post
            </li>
            <li>
              dowel · <span lang="ko">목못</span> — a wooden pin, the only &ldquo;fastener&rdquo;
            </li>
            <li>
              no nails · <span lang="ko">못 없는 집</span> — metal nowhere in the frame
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
