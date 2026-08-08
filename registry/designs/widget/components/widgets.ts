/**
 * Spatial dashboard widgets — eight pieces of glass suspended in depth.
 *
 * Each widget is a real piece of content in the DOM: fully readable as a
 * static list without JavaScript, in source order, bilingual. The spatial
 * tilt (see usePointerParallax) is a *reveal* of already-present content, so
 * it degrades cleanly to a static dashboard under reduced motion and with
 * JavaScript off.
 *
 * Numeric values carry `unit` separately so the renderer can apply
 * `font-variant-numeric: tabular-nums` to the digits and keep units visually
 * muted — columns of figures line up the way a dashboard demands.
 *
 * `depth` drives the parallax: near widgets float forward most under the
 * cursor, far widgets barely move — the visionOS spatial cue. `span` hints
 * the grid track the widget should claim (col/row spans for the bento).
 */

export type Depth = "near" | "mid" | "far";

export type WidgetSpan = {
  /** grid-column span (mobile collapses to 1). */
  col: number;
  /** grid-row span. */
  row: number;
};

export type HourlyWeather = {
  hour: string;
  temp: number;
  icon: "sun" | "cloud" | "rain";
};

export type Meeting = {
  time: string;
  titleEn: string;
  titleKo: string;
  withEn: string;
  withKo: string;
};

export type Message = {
  fromEn: string;
  fromKo: string;
  previewEn: string;
  previewKo: string;
  time: string;
};

export type Widget =
  | {
      id: string;
      kind: "weather";
      depth: Depth;
      span: WidgetSpan;
      labelEn: string;
      labelKo: string;
      temp: number;
      tempUnit: string;
      conditionEn: string;
      conditionKo: string;
      cityEn: string;
      cityKo: string;
      hourly: HourlyWeather[];
    }
  | {
      id: string;
      kind: "schedule";
      depth: Depth;
      span: WidgetSpan;
      labelEn: string;
      labelKo: string;
      nextEn: string;
      nextKo: string;
      countdownEn: string;
      countdownKo: string;
      meetings: Meeting[];
    }
  | {
      id: string;
      kind: "chart";
      depth: Depth;
      span: WidgetSpan;
      labelEn: string;
      labelKo: string;
      total: number;
      totalUnit: string;
      deltaEn: string;
      deltaKo: string;
      bars: { dayEn: string; dayKo: string; value: number }[];
    }
  | {
      id: string;
      kind: "music";
      depth: Depth;
      span: WidgetSpan;
      labelEn: string;
      labelKo: string;
      trackEn: string;
      trackKo: string;
      artistEn: string;
      artistKo: string;
      elapsed: string;
      duration: string;
      progress: number; // 0–1
    }
  | {
      id: string;
      kind: "health";
      depth: Depth;
      span: WidgetSpan;
      labelEn: string;
      labelKo: string;
      steps: number;
      stepsGoal: number;
      stepsUnit: string;
      ringPct: number; // 0–100 for the activity ring
      ringLabelEn: string;
      ringLabelKo: string;
    }
  | {
      id: string;
      kind: "air";
      depth: Depth;
      span: WidgetSpan;
      labelEn: string;
      labelKo: string;
      pm25: number;
      pm25Unit: string;
      pm25LabelEn: string;
      pm25LabelKo: string;
      uv: number;
      uvLabelEn: string;
      uvLabelKo: string;
      wind: number;
      windUnit: string;
      windLabelEn: string;
      windLabelKo: string;
    }
  | {
      id: string;
      kind: "timer";
      depth: Depth;
      span: WidgetSpan;
      labelEn: string;
      labelKo: string;
      remaining: string;
      taskEn: string;
      taskKo: string;
      progress: number; // 0–1 of elapsed
    }
  | {
      id: string;
      kind: "messages";
      depth: Depth;
      span: WidgetSpan;
      labelEn: string;
      labelKo: string;
      count: number;
      countUnit: string;
      messages: Message[];
    };

export const WIDGETS: Widget[] = [
  {
    id: "w-weather",
    kind: "weather",
    depth: "near",
    span: { col: 2, row: 2 },
    labelEn: "Weather",
    labelKo: "날씨",
    temp: 21,
    tempUnit: "°",
    conditionEn: "Clear",
    conditionKo: "맑음",
    cityEn: "Seoul",
    cityKo: "서울",
    hourly: [
      { hour: "12", temp: 19, icon: "sun" },
      { hour: "14", temp: 21, icon: "sun" },
      { hour: "16", temp: 22, icon: "cloud" },
      { hour: "18", temp: 20, icon: "cloud" },
      { hour: "20", temp: 17, icon: "rain" },
    ],
  },
  {
    id: "w-schedule",
    kind: "schedule",
    depth: "mid",
    span: { col: 2, row: 1 },
    labelEn: "Today",
    labelKo: "오늘 일정",
    nextEn: "Design review",
    nextKo: "디자인 리뷰",
    countdownEn: "in 38 min",
    countdownKo: "38분 후",
    meetings: [
      {
        time: "10:00",
        titleEn: "Standup",
        titleKo: "일일 스탠드업",
        withEn: "Product squad",
        withKo: "프로덕트 팀",
      },
      {
        time: "11:00",
        titleEn: "Design review",
        titleKo: "디자인 리뷰",
        withEn: "Spatial team",
        withKo: "공간 팀",
      },
      {
        time: "15:30",
        titleEn: "1:1 with Jisu",
        titleKo: "지수와 1:1",
        withEn: "Engineering",
        withKo: "엔지니어링",
      },
    ],
  },
  {
    id: "w-chart",
    kind: "chart",
    depth: "far",
    span: { col: 2, row: 1 },
    labelEn: "Weekly done",
    labelKo: "주간 완료",
    total: 48,
    totalUnit: "tasks",
    deltaEn: "↑ 12% vs last week",
    deltaKo: "↑ 지난주 대비 12%",
    bars: [
      { dayEn: "Mon", dayKo: "월", value: 60 },
      { dayEn: "Tue", dayKo: "화", value: 85 },
      { dayEn: "Wed", dayKo: "수", value: 45 },
      { dayEn: "Thu", dayKo: "목", value: 92 },
      { dayEn: "Fri", dayKo: "금", value: 70 },
      { dayEn: "Sat", dayKo: "토", value: 30 },
      { dayEn: "Sun", dayKo: "일", value: 55 },
    ],
  },
  {
    id: "w-music",
    kind: "music",
    depth: "mid",
    span: { col: 2, row: 1 },
    labelEn: "Now playing",
    labelKo: "재생 중",
    trackEn: "Dawn Tape",
    trackKo: "새벽 녹음",
    artistEn: "Room 404",
    artistKo: "룸 404",
    elapsed: "1:42",
    duration: "3:28",
    progress: 0.49,
  },
  {
    id: "w-health",
    kind: "health",
    depth: "near",
    span: { col: 1, row: 2 },
    labelEn: "Activity",
    labelKo: "활동",
    steps: 7420,
    stepsGoal: 10000,
    stepsUnit: "steps",
    ringPct: 74,
    ringLabelEn: "Move",
    ringLabelKo: "움직임",
  },
  {
    id: "w-air",
    kind: "air",
    depth: "far",
    span: { col: 1, row: 1 },
    labelEn: "Air & sun",
    labelKo: "공기와 햇빛",
    pm25: 32,
    pm25Unit: "µg/m³",
    pm25LabelEn: "PM2.5 · Good",
    pm25LabelKo: "미세먼지 · 좋음",
    uv: 6,
    uvLabelEn: "UV · High",
    uvLabelKo: "자외선 · 높음",
    wind: 3.4,
    windUnit: "m/s",
    windLabelEn: "Wind · Light",
    windLabelKo: "바람 · 약함",
  },
  {
    id: "w-timer",
    kind: "timer",
    depth: "mid",
    span: { col: 1, row: 1 },
    labelEn: "Focus timer",
    labelKo: "집중 타이머",
    remaining: "18:42",
    taskEn: "Deep work block",
    taskKo: "딥워크 시간",
    progress: 0.62,
  },
  {
    id: "w-messages",
    kind: "messages",
    depth: "far",
    span: { col: 2, row: 1 },
    labelEn: "Messages",
    labelKo: "메시지",
    count: 3,
    countUnit: "new",
    messages: [
      {
        fromEn: "Jisu",
        fromKo: "지수",
        previewEn: "Pushed the glass tokens to main.",
        previewKo: "글래스 토큰 메인에 올렸어.",
        time: "2m",
      },
      {
        fromEn: "Mira",
        fromKo: "미라",
        previewEn: "Loved the spatial tilt — ship it.",
        previewKo: "공간 기울임 좋다 — 가자.",
        time: "14m",
      },
      {
        fromEn: "Build bot",
        fromKo: "빌드 봇",
        previewEn: "Deploy succeeded in 41s.",
        previewKo: "배포 41초 만에 성공.",
        time: "1h",
      },
    ],
  },
];
