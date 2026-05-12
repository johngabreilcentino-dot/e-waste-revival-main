import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
  onSuccess?: () => void;
  onModeChange?: (mode: AuthMode) => void;
  successDelayMs?: number;
};

export function AuthForm({ mode, onSuccess, onModeChange, successDelayMs = 0 }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isLogin = mode === "login";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (isLogin && data.user) {
      setMessage("Login successful.");
      if (onSuccess) window.setTimeout(onSuccess, successDelayMs);
      return;
    }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        disabled={loading}
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
