import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Target, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — e-waste ready" },
      { name: "description", content: "Learn about our mission to make responsible e-waste disposal accessible across the Philippines." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">About us</span>
        <h1 className="mt-3 text-5xl sm:text-6xl font-semibold leading-tight text-foreground">
          Building a circular future for Filipino electronics.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
          e-waste ready connects citizens, communities, and policymakers with the resources they
          need to dispose of electronics responsibly. We believe that making the right choice
          should always be the easy choice.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, t: "Our mission", d: "Empower every Filipino household to safely recycle electronic waste through clear, local information." },
            { icon: Leaf, t: "Our values", d: "Sustainability, transparency, and community-first design guide every decision we make." },
            { icon: Users, t: "Our community", d: "Volunteers, LGUs, and recyclers nationwide united around a single, healthier vision." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-3xl bg-card border border-border p-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-leaf-soft text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-[2rem] bg-card border border-border p-10">
          <h2 className="text-3xl font-semibold">Why the Philippines?</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The Philippines generates over <span className="text-primary font-semibold">130,000 tons</span>{" "}
            of e-waste each year — and that number keeps climbing. With the passage of the Extended
            Producer Responsibility Act (RA 11898), the country has taken its biggest step yet
            toward holding both producers and consumers accountable. We're here to make that
            transition tangible for everyone.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
