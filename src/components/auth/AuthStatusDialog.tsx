import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthStatusDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onOpenChange: (open: boolean) => void;
};

export function AuthStatusDialog({ open, title, message, onOpenChange }: AuthStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] border-border p-8 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
