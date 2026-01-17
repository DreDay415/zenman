import DebugProbe from "../components/DebugProbe";
import HeadphoneScroll from "../components/HeadphoneScroll";

export default function Home() {
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
            Crafted with precision. Tuned for cinematic clarity.
          </h2>
          <p className="max-w-2xl text-base text-white/60 md:text-lg">
            We build web products that fuse Design, Engineering,
            and the art of storytelling for the next generation of premium web 
            Design.
          </p>
        </div>
      </section>
    </main>
  );
}
