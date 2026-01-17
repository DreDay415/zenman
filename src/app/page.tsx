import DebugProbe from "../components/DebugProbe";
import HeadphoneScroll from "../components/HeadphoneScroll";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#163377] text-white">
      <DebugProbe />
      <HeadphoneScroll />

      {/* Brand Statement */}
      <section className="relative w-full bg-[#163377] px-6 pb-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Ocean Park Digital
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white/90 md:text-5xl">
            Engineered for performance.
            <br className="hidden md:block" />
            Designed for impact.
          </h2>

          <p className="max-w-2xl text-base text-white/60 md:text-lg">
            We design and build high-performance web products where design,
            engineering, and storytelling converge. Every experience is
            intentional. Every interaction earns attention.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative w-full bg-[#163377] px-6 pb-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <h3 className="text-2xl font-medium text-white/90 md:text-3xl">
            Built with intent. Shipped with discipline.
          </h3>

          <p className="max-w-2xl text-base text-white/60 md:text-lg">
            Ocean Park Digital partners with founders and operators to build
            modern web platforms that convert, scale, and endure. From first
            impression to long-term growth, we obsess over clarity, speed, and
            measurable results.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative w-full bg-[#163377] px-6 pb-32">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm uppercase tracking-[0.35em] text-white/60">
              Capabilities
            </h4>
            <h3 className="text-2xl font-medium text-white/90 md:text-3xl">
              Digital growth solutions
            </h3>
          </div>

          <ul className="space-y-4 text-white/60">
            <li>
              <span className="font-medium text-white/80">SEO Optimization</span>{" "}
              — Capture high-intent demand with technical and content-driven SEO.
            </li>
            <li>
              <span className="font-medium text-white/80">
                Paid Media Campaigns
              </span>{" "}
              — Performance marketing optimized for ROAS, not vanity metrics.
            </li>
            <li>
              <span className="font-medium text-white/80">
                Google Business Profile
              </span>{" "}
              — Local visibility engineered to convert attention into action.
            </li>
            <li>
              <span className="font-medium text-white/80">
                Website Development
              </span>{" "}
              — Fast, resilient websites from landing pages to full platforms.
            </li>
            <li>
              <span className="font-medium text-white/80">AI Integrations</span>{" "}
              — Custom workflows connecting commerce, analytics, and operations.
            </li>
            <li>
              <span className="font-medium text-white/80">
                Digital Commerce
              </span>{" "}
              — Monetize domains, products, and digital ecosystems.
            </li>
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative w-full bg-[#163377] px-6 pb-32">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <h3 className="text-2xl font-medium text-white/90 md:text-3xl">
            Let’s build something that lasts.
          </h3>
          <p className="max-w-xl text-base text-white/60 md:text-lg">
            If you’re serious about growth, performance, and long-term value,
            we should talk.
          </p>

          <button className="mt-4 w-fit rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white/80 transition hover:bg-white/10">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full border-t border-white/10 bg-[#163377] px-6 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Ocean Park Digital. All rights reserved.</span>
          <nav className="flex gap-6">
            <a href="/" className="hover:text-white/80">
              Home
            </a>
            <a href="/blog" className="hover:text-white/80">
              Blog
            </a>
            <a href="/sitemap" className="hover:text-white/80">
              Sitemap
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
