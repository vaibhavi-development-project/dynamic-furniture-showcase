import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero.jpg";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Studio — MaisonOr" },
      { name: "description", content: "The story of MaisonOr — a design studio of hand-finished modern furniture made in India." },
      { property: "og:title", content: "Our Studio — MaisonOr" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Our Studio</div>
          <h1 className="font-display text-6xl md:text-8xl max-w-4xl leading-[0.95]">
            A house built around <span className="text-gradient-gold italic">restraint</span>.
          </h1>
        </motion.div>

        <div className="mt-20 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <img src={heroImg} alt="Our studio" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </motion.div>

          <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
            <p>
              MaisonOr was founded on a single conviction: that a piece of furniture is the slowest object in a room, and should be made accordingly. Our studio brings together master cabinetmakers from Jodhpur, upholsterers from Mumbai, and stoneworkers from Rajasthan.
            </p>
            <p>
              Every commission begins with a sketch and ends, sometimes a year later, with a hand-rubbed wax finish. The pieces leave us only when they are ready. Not before.
            </p>
            <div className="gold-divider" />
            <p className="font-display text-2xl text-foreground italic">
              "Quiet now, quiet in fifty years."
            </p>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-10">
          {[
            { n: "01", t: "Designed slowly", d: "Months of sketching before a single cut. Proportions earned, not invented." },
            { n: "02", t: "Made by hand", d: "Joinery, upholstery, finishing — each by a single maker, signed and dated." },
            { n: "03", t: "Owned for life", d: "A 10-year structural warranty and a lifetime restoration program." },
          ].map((b, i) => (
            <motion.div
              key={b.n}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass rounded-2xl p-8 hover-lift"
            >
              <div className="text-gradient-gold font-display text-4xl">{b.n}</div>
              <h3 className="mt-4 font-display text-2xl">{b.t}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
