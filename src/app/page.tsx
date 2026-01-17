import DebugProbe from "../components/DebugProbe";
import HeadphoneScroll from "../components/HeadphoneScroll";

export default function Home() {
  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/994b9798-6ef7-4236-9b99-30f6b77b26f6", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "page.tsx:4",
      message: "Home server render",
      data: { path: "/" },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H1",
    }),
  }).catch(() => {});
  // #endregion

  return (
    <main className="min-h-screen w-full bg-[#163377] text-white">
      <DebugProbe />
      <HeadphoneScroll />
      <section className="relative w-full bg-[#163377] px-6 pb-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            OceanparkDigital
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white/90 md:text-5xl">
            Crafted for audiophiles. Tuned for cinematic clarity.
          </h2>
          <p className="max-w-2xl text-base text-white/60 md:text-lg">
            We build immersive product moments that fuse industrial design,
            spatial sound, and storytelling for the next generation of premium
            audio.
          </p>
        </div>
      </section>
    </main>
  );
}
