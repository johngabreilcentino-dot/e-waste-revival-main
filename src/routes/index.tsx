import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Recycle,
  MapPin,
  ScrollText,
  Sparkles,
  Cpu,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EcoMap } from "@/components/EcoMap";
import { drives, policies, PH_CENTER } from "@/lib/ewaste-data";
import heroWorkers from "@/assets/484031.jpg";

const homeImages = {
  devices:
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "e-waste ready — Drives & Policies in the Philippines" },
      {
        name: "description",
        content:
          "Discover e-waste collection drives near you and learn about Philippine recycling policies.",
      },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const [tab, setTab] = useState<"drives" | "policies">("drives");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={heroWorkers}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background/90 to-primary/30"
        />
        <div
          aria-hidden
          className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-leaf)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-32 h-[24rem] w-[24rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-leaf)" }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Greener appliance recycling for the Philippines
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] text-foreground">
              Recycle smarter.
              <br />
              <span className="text-primary">Live greener.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Find collection drives near you, understand local e-waste policies, and join a
              nationwide movement to keep old appliances out of landfills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#explore"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-elevated hover:opacity-95"
              >
                Find a drive <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-leaf-soft transition"
              >
                Learn more
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: "6+", l: "Active drives" },
                { v: "5", l: "Regional policies" },
                { v: "100%", l: "Local focus" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-3xl text-primary">{s.v}</dt>
                  <dd className="text-xs text-muted-foreground mt-1">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 -z-10 rounded-[2rem] rotate-3"
              style={{ background: "var(--gradient-leaf)" }}
            />
            <div className="rounded-[2rem] bg-card/90 border border-border p-8 shadow-elevated backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cpu, t: "Refrigerators", c: "leaf" },
                  { icon: Recycle, t: "Microwaves", c: "accent" },
                  { icon: ShieldCheck, t: "Certified disposal", c: "leaf" },
                  { icon: Leaf, t: "Washing machines", c: "accent" },
                ].map(({ icon: Icon, t }, i) => (
                  <div key={i} className="rounded-2xl bg-leaf-soft/70 p-5 border border-border/50">
                    <Icon className="h-6 w-6 text-primary" />
                    <div className="mt-3 font-medium text-sm text-foreground">{t}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-primary text-primary-foreground p-5">
                <div className="text-xs uppercase tracking-wider opacity-80">Today's tip</div>
                <div className="mt-1 font-display text-xl">
                  Unplug and clean appliances before pickup.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP EXPLORER */}
      <section id="explore" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Explore the map
            </span>
            <h2 className="mt-2 text-4xl sm:text-5xl font-semibold text-foreground">
              Drives & policies, on one map.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Toggle between upcoming collection events and regional regulations across the
              Philippines.
            </p>
          </div>
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-soft">
            <button
              onClick={() => setTab("drives")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                tab === "drives"
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <MapPin className="h-4 w-4" /> Drives
            </button>
            <button
              onClick={() => setTab("policies")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                tab === "policies"
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <ScrollText className="h-4 w-4" /> Policies
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-card border border-border p-3 sm:p-4 shadow-elevated">
          <div className="h-[60vh] min-h-[480px]">
            {tab === "drives" ? (
              <EcoMap data={drives} center={PH_CENTER} />
            ) : (
              <EcoMap data={policies} center={PH_CENTER} />
            )}
          </div>
        </div>
      </section>

      {/* WHY RECYCLE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Why it matters
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-semibold text-foreground">
            Every appliance has a responsible next step.
          </h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft">
            <img
              src={homeImages.devices}
              alt="Household appliances representing responsible recycling"
              className="h-full min-h-[22rem] w-full object-cover"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-1">
            {[
              {
                t: "Protect ecosystems",
                d: "Refrigerants, oils, metals, and appliance parts can harm soil and water when dumped improperly.",
                icon: Leaf,
              },
              {
                t: "Recover materials",
                d: "Gold, copper, and rare earths can be reclaimed and reused — reducing mining demand.",
                icon: Recycle,
              },
              {
                t: "Comply with RA 11898",
                d: "The EPR Act encourages responsible recovery and disposal of covered waste streams.",
                icon: ShieldCheck,
              },
            ].map(({ t, d, icon: Icon }) => (
              <div
                key={t}
                className="rounded-3xl bg-card border border-border p-8 hover:shadow-elevated transition-shadow"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-leaf-soft text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div
          className="rounded-[2rem] p-12 sm:p-16 text-primary-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-semibold">
              Got old appliances taking up space?
            </h2>
            <p className="mt-4 text-primary-foreground/85 text-lg">
              Find your nearest drive or get in touch — we'll help you dispose of them the right
              way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-cream text-primary px-6 py-3 font-semibold hover:opacity-90 transition"
              >
                Contact us <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 font-semibold hover:bg-primary-foreground/10 transition"
              >
                See services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
