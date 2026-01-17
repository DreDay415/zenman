const projects = [
  {
    title: "Oceanline",
    description: "Brand system and motion language for a coastal hospitality group.",
    tag: "Brand Systems",
  },
  {
    title: "Lumen Grid",
    description: "Immersive product site with responsive 3D storytelling layers.",
    tag: "Web Experience",
  },
  {
    title: "Pulse Studio",
    description: "Creative campaign platform built for a global design launch.",
    tag: "Campaign",
  },
  {
    title: "Drift Labs",
    description: "Data-driven interface for autonomous mobility research.",
    tag: "Digital Product",
  },
];

export default function Projects() {
  return (
    <section className="relative z-10 w-full bg-[#0d1f4b] py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.35em] text-white/50">
            OceanPark Digital
          </p>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">
            Creative design built for forward-thinking brands.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-8 text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.65)] backdrop-blur-xl transition hover:border-white/30 hover:bg-white/15"
            >
              <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                <span>{project.tag}</span>
                <span className="opacity-60">View</span>
              </div>
              <h3 className="text-2xl font-semibold">{project.title}</h3>
              <p className="mt-3 text-base text-white/75">
                {project.description}
              </p>
              <div className="mt-8 h-px w-full bg-gradient-to-r from-white/10 via-white/40 to-white/10" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
