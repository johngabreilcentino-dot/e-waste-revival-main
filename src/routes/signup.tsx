import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — e-waste ready" },
      { name: "description", content: "Create a new e-waste ready account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-10 shadow-elevated">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Join the movement
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-foreground">Create your account</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Sign up with your email and start saving your account details for future access.
            </p>
          </div>

          <AuthForm mode="signup" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
