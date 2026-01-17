"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

import { SEQUENCE_FRAME_URLS } from "../lib/sequenceFrames";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const drawImageContain = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) => {
  const scale = Math.min(width / img.width, height / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0, dpr: 1 };

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "HeadphoneScroll.tsx:52",
      message: "resizeCanvas applied",
      data: {
        dpr,
        cssSize: { width, height },
        pixelSize: { width: canvas.width, height: canvas.height },
        transform: ctx.getTransform(),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H4",
    }),
  }).catch(() => {});
  // #endregion

  return { width, height, dpr };
};

export default function HeadphoneScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const imageErrorCountRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  const loadingRef = useRef<Set<number>>(new Set());
  const loadedCountRef = useRef(0);

  const frames = useMemo(() => SEQUENCE_FRAME_URLS, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, (value) =>
    clamp(Math.round(value * (frames.length - 1)), 0, frames.length - 1),
  );

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) {
      if (!canvas || !img) {
        // #region agent log
        fetch(
          "http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "HeadphoneScroll.tsx:76",
              message: "Draw skipped: missing canvas or image",
              data: { hasCanvas: Boolean(canvas), hasImage: Boolean(img), index },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "H3",
            }),
          },
        ).catch(() => {});
        // #endregion
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = sizeRef.current;
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "HeadphoneScroll.tsx:90",
        message: "drawFrame called",
        data: { index, cssSize: { width, height } },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H4",
      }),
    }).catch(() => {});
    // #endregion
    ctx.clearRect(0, 0, width, height);
    drawImageContain(ctx, img, width, height);
  }, []);

  const scheduleDraw = (index: number) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => drawFrame(index));
  };

  const finalizeLoad = useCallback(
    (index: number) => {
    loadingRef.current.delete(index);
    loadedCountRef.current += 1;
    setLoadedCount(loadedCountRef.current);

    if (index === 0 && !isFirstFrameReady) {
      setIsFirstFrameReady(true);
      drawFrame(0);
    }

    if (loadedCountRef.current >= frames.length) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "HeadphoneScroll.tsx:116",
            message: "All images decoded",
            data: { loaded: loadedCountRef.current, total: frames.length },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "H2",
          }),
        },
      ).catch(() => {});
      // #endregion
    }
    },
    [drawFrame, frames.length, isFirstFrameReady],
  );

  const loadFrame = useCallback(
    (index: number) => {
    if (index < 0 || index >= frames.length) return;
    if (imagesRef.current[index] || loadingRef.current.has(index)) return;

    const img = new Image();
    imagesRef.current[index] = img;
    loadingRef.current.add(index);

    const src = frames[index];
    img.src = src;
    img.decoding = "async";

    img.onerror = () => {
      imageErrorCountRef.current += 1;
      if (imageErrorCountRef.current <= 3) {
        // #region agent log
        fetch(
          "http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "HeadphoneScroll.tsx:144",
              message: "Image load error",
              data: { src, errorCount: imageErrorCountRef.current },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "H2",
            }),
          },
        ).catch(() => {});
        // #endregion
      }
        finalizeLoad(index);
    };

    if (img.decode) {
      img
          .decode()
          .then(() => finalizeLoad(index))
          .catch(() => finalizeLoad(index));
    } else {
        img.onload = () => finalizeLoad(index);
    }
    },
    [finalizeLoad, frames],
  );

  const preloadWindow = useCallback(
    (centerIndex: number) => {
    const ahead = 14;
    const behind = 8;

    for (let i = centerIndex; i <= centerIndex + ahead; i += 1) {
      loadFrame(i);
    }
    for (let i = centerIndex - 1; i >= centerIndex - behind; i -= 1) {
      loadFrame(i);
    }
    },
    [loadFrame],
  );

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "HeadphoneScroll.tsx:97",
        message: "HeadphoneScroll mounted",
        data: {
          frameCount: frames.length,
          firstUrl: frames[0],
          lastUrl: frames[frames.length - 1],
          href: typeof window !== "undefined" ? window.location.href : "server",
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H1",
      }),
    }).catch(() => {});
    // #endregion

    imagesRef.current = new Array(frames.length).fill(null);
    loadingRef.current.clear();
    loadedCountRef.current = 0;

    loadFrame(0);
    preloadWindow(0);

    const loadingSet = loadingRef.current;
    return () => {
      loadingSet.clear();
    };
  }, [frames, isFirstFrameReady, loadFrame, preloadWindow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const { width, height } = resizeCanvas(canvas);
      sizeRef.current = { width, height };
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "HeadphoneScroll.tsx:167",
        message: "Canvas resize handled",
        data: {
          rect: canvas.getBoundingClientRect().toJSON?.() ?? {
            width: canvas.getBoundingClientRect().width,
            height: canvas.getBoundingClientRect().height,
          },
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H3",
      }),
    }).catch(() => {});
    // #endregion

    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const targetIndex = clamp(latest, 0, frames.length - 1);
    if (targetIndex === currentFrameRef.current) return;

    currentFrameRef.current = targetIndex;
    preloadWindow(targetIndex);
    scheduleDraw(targetIndex);
  });

  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.32],
    [1, 1, 0],
  );
  const introY = useTransform(scrollYProgress, [0, 0.32], [0, -40]);

  const precisionOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.44, 0.6],
    [0, 1, 0],
  );
  const precisionY = useTransform(scrollYProgress, [0.28, 0.6], [40, -40]);

  const titaniumOpacity = useTransform(
    scrollYProgress,
    [0.56, 0.72, 0.86],
    [0, 1, 0],
  );
  const titaniumY = useTransform(scrollYProgress, [0.56, 0.86], [40, -40]);

  const ctaOpacity = useTransform(
    scrollYProgress,
    [0.88, 0.96, 1],
    [0, 1, 1],
  );
  const ctaY = useTransform(scrollYProgress, [0.88, 1], [40, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[400vh] w-full bg-[#163377]"
      aria-label="OceanparkDigital headphone scrollytelling"
    >
      <div className="sticky top-0 h-screen w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Headphone image sequence"
        />

        {!isFirstFrameReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#163377]">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/60">
                Loading {Math.round((loadedCount / frames.length) * 100)}%
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 z-10">
          <div className="absolute left-6 top-6 text-xs uppercase tracking-[0.4em] text-white/60">
            OceanparkDigital
          </div>

          <motion.div
            className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ opacity: introOpacity, y: introY }}
          >
            <h1 className="text-5xl font-semibold tracking-tight text-white/90 md:text-7xl">
              Hold your light
            </h1>
          </motion.div>

          <motion.div
            className="absolute left-8 top-1/2 w-full max-w-md -translate-y-1/2 text-left md:left-20"
            style={{ opacity: precisionOpacity, y: precisionY }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">
              Precision Engineering
            </p>
          </motion.div>

          <motion.div
            className="absolute right-8 top-1/2 w-full max-w-xl -translate-y-1/2 text-right md:right-24"
            style={{ opacity: titaniumOpacity, y: titaniumY }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">
              Built for impact
            </p>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-[70%] w-full -translate-x-1/2 text-center"
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-white/90 md:text-5xl">
              Build something exceptional 
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
