"use client";

import { useRef } from "react";

import Overlay from "./Overlay";
import ScrollyCanvas from "./ScrollyCanvas";

export default function ScrollySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollyCanvas containerRef={sectionRef} className="bg-[#163377]">
      <div className="absolute left-6 top-6 z-20 text-xs uppercase tracking-[0.4em] text-white/70">
        OceanPark Digital
      </div>
      <Overlay targetRef={sectionRef} />
    </ScrollyCanvas>
  );
}
