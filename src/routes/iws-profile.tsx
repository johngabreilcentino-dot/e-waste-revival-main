import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthDialog } from "@/components/auth/AuthDialog";
import type { AuthMode } from "@/components/auth/AuthForm";
import { supabase } from "@/lib/supabase";
import { iwsWomen, type IwsWoman } from "@/lib/iws-women";

type IwsProfileRow = {
  id: string;
  name: string;
  title: string;
  location: string;
  photo_url: string;
  summary: string;
  story: string;
  focus: string;
  goal: string;
  sponsorship: string | null;
  impact: string;
};

export const Route = createFileRoute("/iws-profile")({
  head: () => ({
    meta: [
      { title: "Sponsor an IWS woman — e-waste ready" },
      {
        name: "description",
        content:
          "Meet IWS women leaders working on repair, reuse, education, and community recycling across the Philippines.",
      },
    ],
  }),
  component: SponsorsPage,
});

function SponsorsPage() {
  const navigate = useNavigate();
  const [women, setWomen] = useState<IwsWoman[]>(iwsWomen);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [pendingSponsor, setPendingSponsor] = useState<IwsWoman | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfiles() {
      setLoading(true);

      const { data, error } = await supabase
        .from("iws_profiles")
        .select("id,name,title,location,photo_url,summary,story,focus,goal,sponsorship,impact")
        .order("name", { ascending: true });

      if (!active) return;

      if (error || !data?.length) {
        setWomen(iwsWomen);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      setWomen(data.map(mapProfileRow));
      setUsingFallback(false);
      setLoading(false);
    }

    loadProfiles();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser && pendingSponsor) {
        setAuthOpen(false);
        navigate({ to: "/contact" });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate, pendingSponsor]);

  function handleSponsor(woman: IwsWoman) {
    if (user) {
      navigate({ to: "/contact" });
      return;
    }

    setPendingSponsor(woman);
    setAuthMode("login");
    setAuthOpen(true);
  }

  function handleAuthSuccess() {
    setAuthOpen(false);

    if (pendingSponsor) {
      navigate({ to: "/contact" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Sponsor an IWS woman
          </span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-semibold text-foreground">
            See their background, mission, and how you can support them.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Each profile shows a real woman leading an e-waste solution in her community. Sponsors
            can choose who they want to support and learn how their contribution makes a concrete
            impact.
          </p>

          <div className="mt-10 rounded-[2rem] border border-border bg-card p-10 shadow-elevated">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wider text-primary">
                  How sponsoring works
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-foreground">
                  Choose a woman, read her story, and support her next project.
                </h2>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-elevated whitespace-nowrap"
              >
                Contact us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <p className="mb-6 text-sm text-muted-foreground">Loading IWS profiles...</p>
        ) : null}
        {!loading && !usingFallback ? (
          <p className="mb-6 rounded-3xl border border-primary/20 bg-primary/5 px-5 py-3 text-sm text-primary">
            IWS profiles loaded from your Supabase database.
          </p>
        ) : null}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {women.map((woman) => (
            <article
              key={woman.id}
              className="rounded-[2rem] border border-border bg-card p-6 shadow-soft transition hover:shadow-elevated"
            >
              <div className="overflow-hidden rounded-[1.75rem] bg-slate-950/5">
                <img src={woman.photo} alt={woman.name} className="h-64 w-full object-cover" />
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-4 w-4" />
                  {woman.focus}
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">{woman.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{woman.title}</p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{woman.summary}</p>
              </div>

              <details className="mt-6 rounded-3xl border border-border bg-background p-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-foreground">
                  View full story
                  <span className="rounded-full border border-border/80 px-3 py-1 text-xs text-muted-foreground">
                    Read more
                  </span>
                </summary>
                <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p>{woman.location}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Her mission</p>
                    <p>{woman.story}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Sponsorship goal</p>
                    <p>{woman.goal}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Impact</p>
                    <p>{woman.impact}</p>
                  </div>
                </div>
              </details>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleSponsor(woman)}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
                >
                  Sponsor {woman.name}
                </button>
                <span className="text-xs text-muted-foreground">
                  {user
                    ? "Sponsors can contact us to specify the woman and support preference."
                    : "Log in or create an account first to sponsor this IWS profile."}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
      <AuthDialog
        mode={authMode}
        open={authOpen}
        onOpenChange={setAuthOpen}
        onModeChange={setAuthMode}
        oauthRedirectTo={
          typeof window === "undefined" ? undefined : `${window.location.origin}/contact`
        }
        redirectOnLogin={false}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function mapProfileRow(row: IwsProfileRow): IwsWoman {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    location: row.location,
    photo: row.photo_url,
    summary: row.summary,
    story: row.story,
    focus: row.focus,
    goal: row.goal,
    sponsorship: row.sponsorship ?? "",
    impact: row.impact,
  };
}
