import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — e-waste ready" },
      { name: "description", content: "Sign in to your e-waste ready account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-10 shadow-elevated">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Welcome back
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-foreground">Sign in to your account</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Use your email and password to sign in. If you don&apos;t have an account yet, create
              one below.
            </p>
          </div>

          <AuthForm mode="login" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
