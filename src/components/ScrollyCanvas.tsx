"use client";

import { ReactNode, RefObject, useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";

import {
  SEQUENCE_FRAME_COUNT,
  SEQUENCE_FRAME_URLS,
} from "../lib/sequenceFrames";

type ScrollyCanvasProps = {
  className?: string;
  frameUrls?: string[];
  heightVh?: number;
  children?: ReactNode;
  containerRef?: RefObject<HTMLDivElement>;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) => {
  const scale = Math.max(width / img.width, height / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const { width, height } = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.scale(dpr, dpr);

  }

  return { width, height };
};

const useAnimationFrame = () => {
  const rafRef = useRef<number | null>(null);

  const schedule = (fn: () => void) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(fn);
  };

  useEffect(
    () => () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    },
    [],
  );

  return schedule;
};

export default function ScrollyCanvas({
  className = "",
  frameUrls = SEQUENCE_FRAME_URLS,
  heightVh = 500,
  children,
  containerRef,
}: ScrollyCanvasProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const sectionRef = containerRef ?? internalRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const drawRaf = useAnimationFrame();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, (value) =>
    clamp(Math.round(value * (frameUrls.length - 1)), 0, frameUrls.length - 1),
  );

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;
  
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
  
    // Prevent flashing
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);
  
    drawImageCover(ctx, img, width, height);
  };
  

  
    const images = frameUrls.map((src) => {
      const img = new Image();
      img.src = src;
      img.decoding = "async";
      return img;
    });

    imagesRef.current = images;

    let cancelled = false;
    const first = images[0];

    const handleReady = () => {
      if (!cancelled) {
        drawFrame(0);
      }
    };

    if (first?.decode) {
      first.decode().then(handleReady).catch(handleReady);
    } else if (first) {
      first.onload = handleReady;
    }

    return () => {
      cancelled = true;
    };
  }, [frameUrls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    resizeCanvas(canvas);
    drawFrame(currentFrameRef.current);
  
    let timeout: number;
  
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        resizeCanvas(canvas);
        drawFrame(currentFrameRef.current);
      }, 150);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const targetIndex = clamp(latest, 0, frameUrls.length - 1);
    if (targetIndex === currentFrameRef.current) return;

    currentFrameRef.current = targetIndex;
    drawRaf(() => drawFrame(targetIndex));
  });

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${className}`}
      style={{ height: `${heightVh}vh` }}
      aria-label="Scroll-driven image sequence"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`Scrollytelling sequence with ${SEQUENCE_FRAME_COUNT} frames`}
        />
        <div className="absolute inset-0 z-10">{children}</div>
      </div>
    </section>
  );
}
