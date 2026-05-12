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
};

export function AuthDialog({ mode, open, onOpenChange, onModeChange }: AuthDialogProps) {
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
              ? "Use your email and password to continue."
              : "Sign up with your email to start saving your account details."}
          </DialogDescription>
        </DialogHeader>

        <AuthForm
          mode={mode}
          onSuccess={() => onOpenChange(false)}
          onModeChange={onModeChange}
          successDelayMs={1200}
        />
      </DialogContent>
    </Dialog>
  );
}
