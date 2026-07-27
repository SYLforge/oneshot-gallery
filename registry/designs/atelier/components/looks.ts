/**
 * The RESERVE collection — five looks, each a fictional garment with a
 * gradient "photograph" defined entirely in CSS (see styles.css). The look
 * book crossfades through them in the pinned section. No raster imagery.
 *
 * `swatch` is a CSS class applied to the gradient frame; the gradient itself
 * lives in styles.css so the visual stays in the stylesheet (where all
 * palette tokens live) and the data stays in the DOM.
 */
export type Look = {
  id: string;
  no: string;
  name: string;
  nameKo: string;
  fabric: string;
  fabricKo: string;
  line: string;
  lineKo: string;
  /** CSS class on the gradient frame — defines the "photograph". */
  swatch: string;
};

export const LOOKS: Look[] = [
  {
    id: "silk",
    no: "01",
    name: "Silk Shift",
    nameKo: "실크 쉬프트",
    fabric: "triple-crepe silk",
    fabricKo: "트리플 크레이프 실크",
    line: "A column of bone silk, cut on the cross, that forgets the body by noon.",
    lineKo: "뼛빛 실크의 단면. 정오가 되면 몸을 잊는다.",
    swatch: "atelier-look__art--silk",
  },
  {
    id: "wool",
    no: "02",
    name: "Wool Notch",
    nameKo: "울 노치",
    fabric: "double-faced wool",
    fabricKo: "겉감 안감 없는 울",
    line: "Shoulder built like a doorway. The notch is the only permission it gives.",
    lineKo: "어깨는 문지방처럼. 노치만이 유일한 허락이다.",
    swatch: "atelier-look__art--wool",
  },
  {
    id: "organza",
    no: "03",
    name: "Organza Veil",
    nameKo: "오간자 베일",
    fabric: "crisp silk organza",
    fabricKo: " crisp한 실크 오간자",
    line: "Two layers of organza over nothing — the garment is the light it admits.",
    lineKo: "아무것도 입지 않은 위의 오간자 두 겹 — 옷은 들여보내는 빛이다.",
    swatch: "atelier-look__art--organza",
  },
  {
    id: "trench",
    no: "04",
    name: "The Trench",
    nameKo: "트렌치",
    fabric: "waxed cotton, gold seam",
    fabricKo: "왁스 가공 코튼, 골드 솔기",
    line: "A trench cut for rain it will never see. One seam, in gold, remembers why.",
    lineKo: "다시는 보지 못할 비를 위해 깎은 트렌치. 골드 솔기 하나가 그 까닭을 기억한다.",
    swatch: "atelier-look__art--trench",
  },
  {
    id: "gown",
    no: "05",
    name: "Closing Gown",
    nameKo: "피날레 가운",
    fabric: "matte crêpe, paper spine",
    fabricKo: "무광 크레이프, 종이 등골",
    line: "Near-black, with a spine of paper-white. The collection's last word, set down softly.",
    lineKo: "거의 검정, 그 위로 종이빛 등골 하나. 컬렉션의 마지막 말을, 조용히 내려놓는다.",
    swatch: "atelier-look__art--gown",
  },
];
