import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — e-waste ready" },
      { name: "description", content: "Reach the e-waste ready team for pickups, partnerships, and questions." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Contact</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-semibold text-foreground leading-tight">
            Let's keep the Philippines green, together.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            Got a question, want to host a drive, or interested in partnering? Drop us a note and
            we'll be in touch within two business days.
          </p>

          <ul className="mt-10 space-y-5">
            {[
              { icon: Mail, label: "Email", v: "hello@ewasteready.ph" },
              { icon: Phone, label: "Phone", v: "+63 (0) 917 000 0000" },
              { icon: MapPin, label: "Office", v: "Quezon City, Philippines" },
            ].map(({ icon: Icon, label, v }) => (
              <li key={label} className="flex items-start gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="text-foreground font-medium mt-0.5">{v}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-[2rem] bg-card border border-border p-8 sm:p-10 shadow-elevated"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name"><input required className={fieldCls} placeholder="Juan dela Cruz" /></Field>
            <Field label="Email"><input required type="email" className={fieldCls} placeholder="you@example.com" /></Field>
          </div>
          <Field label="Subject"><input className={fieldCls} placeholder="How can we help?" /></Field>
          <Field label="Message">
            <textarea required rows={6} className={fieldCls + " resize-none"} placeholder="Tell us a bit about your request..." />
          </Field>

          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-elevated transition"
          >
            Send message <Send className="h-4 w-4" />
          </button>

          {sent && (
            <p className="mt-4 text-sm text-primary">Thanks! Your message has been received.</p>
          )}
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}

const fieldCls =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mt-4 first:mt-0">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
