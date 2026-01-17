"use client";

import { useEffect } from "react";

export default function DebugProbe() {
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "DebugProbe.tsx:9",
        message: "Client hydration probe",
        data: {
          href: window.location.href,
          viewport: { w: window.innerWidth, h: window.innerHeight },
          userAgent: navigator.userAgent,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H1",
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return null;
}
