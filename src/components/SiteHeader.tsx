import { Link, useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { LogIn, LogOut, Menu, ShieldCheck, UserCircle, UserPlus, X } from "lucide-react";
import logo from "@/assets/e-waste-logo.png";
import { supabase } from "@/lib/supabase";
import { loadIsAdmin } from "@/lib/admin";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { AuthStatusDialog } from "@/components/auth/AuthStatusDialog";
import type { AuthMode } from "@/components/auth/AuthForm";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/services" as const, label: "Services" },
  { to: "/iws-profile" as const, label: "IWS Profile" },
];

export function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const allowed = await loadIsAdmin(user);

      if (active) setIsAdmin(allowed);
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [user]);

  function openAuthModal(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
    setProfileOpen(false);
    setOpen(false);
  }

  async function handleLogout() {
    setProfileOpen(false);
    setOpen(false);
    setStatusTitle("Logging out");
    setStatusMessage("Please wait while we sign you out.");
    setStatusOpen(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setStatusTitle("Logout failed");
      setStatusMessage(error.message);
      return;
    }

    setStatusTitle("Logged out");
    setStatusMessage("You have been logged out successfully.");
    navigate({ to: "/" });
    window.setTimeout(() => setStatusOpen(false), 1200);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="e-waste ready" className="h-35 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-leaf-soft hover:text-primary data-[status=active]:bg-leaf-soft data-[status=active]:text-primary"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-3 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:opacity-90 hover:shadow-elevated"
            >
              Get Involved
            </Link>
            <div className="relative ml-3">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="rounded-full p-2 text-foreground transition-colors hover:bg-leaf-soft"
                aria-label="Account menu"
              >
                <AccountAvatar user={user} size="lg" />
              </button>

              {profileOpen && (
                <AccountMenu
                  user={user}
                  isAdmin={isAdmin}
                  onLogin={() => openAuthModal("login")}
                  onSignup={() => openAuthModal("signup")}
                  onLogout={handleLogout}
                  onClose={() => setProfileOpen(false)}
                />
              )}
            </div>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border/60 bg-background md:hidden">
            <nav className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-foreground/80 hover:bg-leaf-soft hover:text-primary data-[status=active]:bg-leaf-soft data-[status=active]:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground/80 hover:bg-leaf-soft"
              >
                <AccountAvatar user={user} size="sm" />
                Account
              </button>
              {profileOpen && (
                <div className="mt-3 rounded-2xl border border-border/60 bg-card/80 px-3 py-3">
                  <MobileAccountMenu
                    user={user}
                    isAdmin={isAdmin}
                    onLogin={() => openAuthModal("login")}
                    onSignup={() => openAuthModal("signup")}
                    onLogout={handleLogout}
                    onClose={() => {
                      setProfileOpen(false);
                      setOpen(false);
                    }}
                  />
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthDialog
        mode={authMode}
        open={authOpen}
        onOpenChange={setAuthOpen}
        onModeChange={setAuthMode}
      />
      <AuthStatusDialog
        open={statusOpen}
        title={statusTitle}
        message={statusMessage}
        onOpenChange={setStatusOpen}
      />
    </>
  );
}

function AccountMenu({
  user,
  isAdmin,
  onLogin,
  onSignup,
  onLogout,
  onClose,
}: {
  user: User | null;
  isAdmin: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-xl border border-border/60 bg-background shadow-elevated">
      <div className="border-b border-border/40 bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">Account</h3>
        <p className="mt-1 truncate text-xs text-foreground/60">
          {user?.email ?? "Login or create an account"}
        </p>
      </div>
      <div className="space-y-2 p-3">
        {user ? (
          <>
            <Link
              to="/profile"
              onClick={onClose}
              className="inline-flex w-full items-center gap-3 rounded-lg bg-leaf-soft/50 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              <AccountAvatar user={user} size="sm" />
              <span>Profile</span>
            </Link>
            {isAdmin ? (
              <Link
                to="/admin/iws-profiles"
                onClick={onClose}
                className="inline-flex w-full items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin IWS</span>
              </Link>
            ) : null}
            <button
              onClick={onLogout}
              className="inline-flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onLogin}
              className="inline-flex w-full items-center gap-3 rounded-lg bg-leaf-soft/50 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
            <button
              onClick={onSignup}
              className="inline-flex w-full items-center gap-3 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:shadow-elevated"
            >
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AccountAvatar({ user, size }: { user: User | null; size: "sm" | "lg" }) {
  const [failed, setFailed] = useState(false);
  const rawAvatarUrl = getAvatarUrl(user);
  const avatarUrl = failed ? null : rawAvatarUrl;
  const imageSize = size === "lg" ? "h-8 w-8" : "h-5 w-5";
  const iconSize = size === "lg" ? "h-8 w-8" : "h-5 w-5";

  useEffect(() => {
    setFailed(false);
  }, [rawAvatarUrl]);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={user?.email ? `${user.email} profile photo` : "Account profile photo"}
        onError={() => setFailed(true)}
        className={`${imageSize} rounded-full border border-border object-cover shadow-soft`}
      />
    );
  }

  return <UserCircle className={iconSize} />;
}

function getAvatarUrl(user: User | null) {
  if (!user) return null;

  const metadata = user.user_metadata;
  const metadataAvatar = metadata.avatar_url ?? metadata.picture ?? metadata.avatar;

  if (typeof metadataAvatar === "string" && metadataAvatar.trim().length > 0) {
    return metadataAvatar;
  }

  for (const identity of user.identities ?? []) {
    const identityData = identity.identity_data;
    const identityAvatar =
      identityData?.avatar_url ?? identityData?.picture ?? identityData?.avatar;

    if (typeof identityAvatar === "string" && identityAvatar.trim().length > 0) {
      return identityAvatar;
    }
  }

  return null;
}

function MobileAccountMenu({
  user,
  isAdmin,
  onLogin,
  onSignup,
  onLogout,
  onClose,
}: {
  user: User | null;
  isAdmin: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {user?.email ?? "Account"}
      </p>
      {user ? (
        <>
          <Link
            to="/profile"
            onClick={onClose}
            className="inline-flex w-full items-center gap-3 rounded-3xl bg-leaf-soft/50 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            <AccountAvatar user={user} size="sm" />
            <span>Profile</span>
          </Link>
          {isAdmin ? (
            <Link
              to="/admin/iws-profiles"
              onClick={onClose}
              className="mt-2 inline-flex w-full items-center gap-3 rounded-3xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin IWS</span>
            </Link>
          ) : null}
          <button
            onClick={onLogout}
            className="mt-2 inline-flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onLogin}
            className="inline-flex w-full items-center gap-3 rounded-3xl bg-leaf-soft/50 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </button>
          <button
            onClick={onSignup}
            className="mt-2 inline-flex w-full items-center gap-3 rounded-3xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:shadow-elevated"
          >
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </button>
        </>
      )}
    </>
  );
}
