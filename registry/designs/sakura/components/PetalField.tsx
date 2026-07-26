"use client";

import BloomCanvas from "./BloomCanvas";

/**
 * Section 03 — the open garden. A wide, shorter stage where the bloom canvas
 * runs at low intensity as ambient atmosphere — petals already adrift, ink
 * falling occasionally — while the copy explains the physics plainly: this
 * is curl noise, divergence-free, the same field that carries KEMURI's smoke
 * but inverted (ink→petal, not smoke→air). The section exists to let the
 * reader dwell in the bloom and read how it is made, in both voices.
 *
 * On touch the garden self-drifts; pointer-move leans the petals. Reduced
 * motion: one composed still.
 */
export default function PetalField() {
  return (
    <section className="sakura-garden" aria-labelledby="sakura-garden-title">
      <div className="sakura-sechead" data-reveal>
        <p className="sakura-eyebrow" aria-hidden="true">
          <span lang="ko">03 — 바람의 장</span>{" "}
          <span lang="ja">風の場</span>
        </p>
        <h2 className="sakura-sechead__title" id="sakura-garden-title">
          <span lang="ko">꽃잎을 나르는 바람</span>{" "}
          <span lang="ja" className="sakura-sechead__ja">
            花弁を運ぶ風
          </span>
        </h2>
        <p className="sakura-sechead__line">
          <span lang="ko">
            이 장은 발산이 없다. 컬 노이즈가 만드는 하나의 흐름 위에서,
            이웃한 꽃잎은 함께 흔들리고, 소용돌이는 피고, 꽃잎은 뭉치지도
            찢어지지도 않는다. 연기가 하늘로 오르는 물리를 거꾸로 뒤집은
            것 — 잉크가 꽃으로 내려오는 장.
          </span>{" "}
          <span lang="ja" className="sakura-sechead__lineja">
            この場は発散がない。カールノイズが紡ぐ一つの流れの上で、隣り合う
            花弁は共に揺れ、渦は巻き、花弁は凝縮も裂断もしない。煙が空へ
            昇る物理を裏返したもの — 墨が花として下りてくる場。
          </span>
        </p>
      </div>

      <BloomCanvas
        className="sakura-garden__bloom"
        ariaLabel="바람에 흩날리는 벚꽃잎밭. A field of cherry petals drifting on a curl-noise wind."
      />

      <div className="sakura-garden__notes" data-reveal>
        <div className="sakura-garden__note">
          <p className="sakura-garden__notenum" lang="ja" aria-hidden="true">
            壱
          </p>
          <p className="sakura-garden__noteko" lang="ko">
            먹방울은 중력으로 떨어지고, 수면에서 튀어오른 뒤 꽃으로 핀다.
          </p>
          <p className="sakura-garden__noteen" lang="en">
            Ink falls by gravity, splashes on the waterline, and blooms.
          </p>
        </div>
        <div className="sakura-garden__note">
          <p className="sakura-garden__notenum" lang="ja" aria-hidden="true">
            弐
          </p>
          <p className="sakura-garden__noteko" lang="ko">
            꽃잎은 컬 노이즈 바람에 실려, 가라앉으며, 천천히 진다.
          </p>
          <p className="sakura-garden__noteen" lang="en">
            Petals ride a curl-noise wind, sink gently, and fade.
          </p>
        </div>
        <div className="sakura-garden__note">
          <p className="sakura-garden__notenum" lang="ja" aria-hidden="true">
            参
          </p>
          <p className="sakura-garden__noteko" lang="ko">
            당신의 손이 지나가면, 꽃잎이 그 쪽으로 기운다.
          </p>
          <p className="sakura-garden__noteen" lang="en">
            Pass your hand across, and the petals lean toward it.
          </p>
        </div>
      </div>
    </section>
  );
}
