import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, Building2, GraduationCap, Recycle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const serviceImages = {
  pickup:
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=900&q=80",
  business:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  education:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  policy:
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
  cta:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — e-waste ready" },
      { name: "description", content: "Collection drives, business pickup, education programs, and policy resources." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Truck, t: "Household pickup", d: "Schedule a drop-off or arrange a pickup for old phones, laptops, batteries, and more.", image: serviceImages.pickup },
  { icon: Building2, t: "Business partnerships", d: "Compliant disposal programs for offices, schools, and producers under RA 11898.", image: serviceImages.business },
  { icon: GraduationCap, t: "Education programs", d: "Workshops and curricula for schools, LGUs, and barangays on responsible disposal.", image: serviceImages.education },
  { icon: Recycle, t: "Policy advocacy", d: "Resources, briefings, and campaigns to keep regional policies moving forward.", image: serviceImages.policy },
];

function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">What we offer</span>
        <h1 className="mt-3 text-5xl sm:text-6xl font-semibold text-foreground max-w-3xl leading-tight">
          Services tailored for every Filipino household and business.
        </h1>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, t, d, image }) => (
            <div key={t} className="overflow-hidden rounded-3xl bg-card border border-border hover:shadow-elevated transition-shadow group">
              <img src={image} alt="" className="h-44 w-full object-cover" />
              <div className="p-8">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-leaf-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">{t}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-elevated lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-12">
            <h2 className="text-3xl sm:text-4xl font-semibold">Ready to start recycling?</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Contact our team to schedule a pickup or set up a partnership for your organization.
            </p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <img
            src={serviceImages.cta}
            alt="Technology hardware representing responsible electronics recycling"
            className="h-full min-h-[20rem] w-full object-cover"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
