export const SEQUENCE = {
  baseUrl: "https://zenman.vercel.app/sequence",
  prefix: "frame_",
  suffix: "_delay-0.042s.webp",
  digits: 3,
  start: 0,
  count: 145,
};

export const currentFrame = (i: number) =>
  `${SEQUENCE.baseUrl}/${SEQUENCE.prefix}${String(i).padStart(
    SEQUENCE.digits,
    "0",
  )}${SEQUENCE.suffix}`;

export const SEQUENCE_FRAME_URLS = Array.from(
  { length: SEQUENCE.count },
  (_, index) => currentFrame(SEQUENCE.start + index),
);

export const SEQUENCE_FRAME_COUNT = SEQUENCE.count;
