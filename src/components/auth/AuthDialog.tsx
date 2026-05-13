import { AuthForm, type AuthMode } from "@/components/auth/AuthForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthDialogProps = {
  mode: AuthMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess?: () => void;
  oauthRedirectTo?: string;
  redirectOnLogin?: boolean;
};

export function AuthDialog({
  mode,
  open,
  onOpenChange,
  onModeChange,
  onSuccess,
  oauthRedirectTo,
  redirectOnLogin,
}: AuthDialogProps) {
  const isLogin = mode === "login";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] border-border p-8 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Use Google or your email and password to continue."
              : "Sign up with Google or email to start saving your account details."}
          </DialogDescription>
        </DialogHeader>

        <AuthForm
          mode={mode}
          onSuccess={onSuccess ?? (() => onOpenChange(false))}
          onModeChange={onModeChange}
          oauthRedirectTo={oauthRedirectTo}
          redirectOnLogin={redirectOnLogin}
          successDelayMs={1200}
        />
      </DialogContent>
    </Dialog>
  );
}
