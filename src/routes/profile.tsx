import { createFileRoute } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { Mail, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile - e-waste ready" },
      { name: "description", content: "View your e-waste ready account profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-border bg-card p-8 shadow-elevated">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserCircle className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Account
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-foreground">Profile</h1>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-background p-5">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading your profile...</p>
            ) : user ? (
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email address</p>
                  <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Please log in to view your account profile.
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
