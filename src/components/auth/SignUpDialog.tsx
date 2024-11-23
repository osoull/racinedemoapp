import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SignUpForm from "./SignUpForm";

interface SignUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpDialog = ({ isOpen, onClose }: SignUpDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء حساب</DialogTitle>
        </DialogHeader>
        <SignUpForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;