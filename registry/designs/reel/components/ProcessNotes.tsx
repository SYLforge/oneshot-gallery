"use client";

type Step = {
  /** exposure-data style timecode, like the edge of a strip */
  no: string;
  name: string;
  note: string;
  ko: string;
  /** one of these is the frame the photographer crossed out */
  rejected?: boolean;
};

const STEPS: Step[] = [
  {
    no: "STEP 01",
    name: "Load in the dark",
    note: "Tri-X 400 into a borrowed Pentax. The leader curls the wrong way; it always does.",
    ko: "빌린 펜탁스에 Tri-X 400을 건다. 필름 리더가 늘 그렇듯 반대로 말린다.",
  },
  {
    no: "STEP 02",
    name: "Meter for the skin, not the sun",
    note: "Spot on the cheekbone, open up two-thirds. Let the windows blow out — that's the look.",
    ko: "뺨에 스팟, +2/3 스톱. 창은 날려 버린다 — 그게 이 사진의 결이다.",
  },
  {
    no: "STEP 03",
    name: "Develop in the kitchen, 20°C",
    note: "HC-110 dilution B, 7 minutes 30 seconds. Agitate the first 30 seconds, then once a minute.",
    ko: "HC-110 희석 B, 7분 30초. 처음 30초는 흔들고, 이후 매 분 한 번씩.",
  },
  {
    no: "STEP 04",
    name: "Fix for twice the clear time",
    note: "Ilford Rapid, four minutes. The fixer is older than the couple — it still works.",
    ko: "정정(淸澄) 시간의 두 배, 일포드 래피드 4분. 정착액은 그 부부보다 나이가 많다 — 여전히 잘 듣는다.",
    rejected: true,
  },
  {
    no: "STEP 05",
    name: "Wash, hang, wait",
    note: "Twenty-minute wash, then a clip on the shower rail. Dust is the enemy; the cat is worse.",
    ko: "20분 수세, 샤워기 봉에 집게 하나. 먼지가 적, 고양이는 더 큰 적이다.",
  },
  {
    no: "STEP 06",
    name: "Scan, then forget the scan",
    note: "A flatbed at 3200 dpi. The contact print is still the one we frame.",
    ko: "평판 스캐너, 3200dpi. 결국 벽에 거는 건 밀착 인화지 쪽이다.",
  },
];

/**
 * Frame 03 — the process notes, set like a darkroom log. Exposure data and
 * hand-written directions, the way a photographer keeps a notebook by the
 * tray. Everything is plain DOM — visible without JavaScript, revealed with
 * a small stagger when it is available. Exactly one step is crossed out; its
 * amber spine is the section's only accent mark.
 */
export default function ProcessNotes() {
  return (
    <section
      className="reel-process"
      aria-labelledby="reel-process-title"
    >
      <header className="reel-process__head" data-reveal>
        <p className="reel-sechead__no reel-mono" aria-hidden="true">
          FRAME 03
        </p>
        <h2 className="reel-sechead" id="reel-process-title">
          The darkroom log{" "}
          <span lang="ko" className="reel-sechead__ko">
            암실 일지
          </span>
        </h2>
        <p className="reel-process__slug reel-mono">
          HOW A ROLL BECOMES A PRINT.{" "}
          <span lang="ko">한 롤이 인화지가 되기까지.</span>
        </p>
      </header>

      <ol className="reel-process__list">
        {STEPS.map((step) => (
          <li
            key={step.no}
            className={`reel-step${step.rejected ? " reel-step--rejected" : ""}`}
            data-reveal
          >
            <span className="reel-step__no reel-mono">{step.no}</span>
            <div className="reel-step__body">
              <h3 className="reel-step__name">
                {step.rejected ? <s>{step.name}</s> : step.name}
                {step.rejected && (
                  <span className="reel-step__flag reel-mono">
                    {" "}
                    REJECTED · <span lang="ko">폐기</span>
                  </span>
                )}
              </h3>
              <p className="reel-step__note">
                {step.note} <span lang="ko">{step.ko}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
