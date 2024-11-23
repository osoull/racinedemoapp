import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SignInForm from "./SignInForm";

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInDialog = ({ isOpen, onClose }: SignInDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تسجيل الدخول</DialogTitle>
        </DialogHeader>
        <SignInForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;