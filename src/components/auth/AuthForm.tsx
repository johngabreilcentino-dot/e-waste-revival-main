import { Link, useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { loadIsAdmin } from "@/lib/admin";

export type AuthMode = "login" | "signup";
type PostLoginRoute = "/admin/iws-profiles" | "/";

type AuthFormProps = {
  mode: AuthMode;
  onSuccess?: () => void;
  onModeChange?: (mode: AuthMode) => void;
  oauthRedirectTo?: string;
  redirectOnLogin?: boolean;
  successDelayMs?: number;
};

export function AuthForm({
  mode,
  onSuccess,
  onModeChange,
  oauthRedirectTo,
  redirectOnLogin = true,
  successDelayMs = 0,
}: AuthFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isLogin = mode === "login";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    if (isLogin && data.user) {
      const destination = await getPostLoginRoute(data.user);

      setLoading(false);
      setMessage("Login successful.");
      window.setTimeout(() => {
        onSuccess?.();
        if (redirectOnLogin) navigate({ to: destination });
      }, successDelayMs);
      return;
    }

    setLoading(false);

    if (!isLogin && data.session) {
      setMessage("Registered successfully.");
      if (onSuccess) window.setTimeout(onSuccess, successDelayMs);
      return;
    }

    setMessage("Registered successfully. Check your email to confirm your account.");
    if (onSuccess) window.setTimeout(onSuccess, successDelayMs);
  }

  function handleModeSwitch() {
    setMessage(null);
    onModeChange?.(isLogin ? "signup" : "login");
  }

  async function handleGoogleSignIn() {
    setMessage(null);
    setOauthLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: oauthRedirectTo ?? window.location.origin,
      },
    });

    if (error) {
      setOauthLoading(false);
      setMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading || oauthLoading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-leaf-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
        >
          G
        </span>
        {oauthLoading ? "Opening Google..." : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>{isLogin ? "or sign in with email" : "or sign up with email"}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
      </label>

      {message ? (
        <div className="rounded-3xl border border-border bg-slate-950/5 px-4 py-3 text-sm text-foreground">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading || oauthLoading}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        {onModeChange ? (
          <button
            type="button"
            onClick={handleModeSwitch}
            className="font-semibold text-primary hover:text-primary/80"
          >
            {isLogin ? "Create one" : "Sign in"}
          </button>
        ) : (
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="font-semibold text-primary hover:text-primary/80"
          >
            {isLogin ? "Create one" : "Sign in"}
          </Link>
        )}
      </p>
    </form>
  );
}

async function getPostLoginRoute(user: User): Promise<PostLoginRoute> {
  return (await loadIsAdmin(user)) ? "/admin/iws-profiles" : "/";
}
