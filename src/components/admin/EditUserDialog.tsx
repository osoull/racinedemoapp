import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { BusinessInfoForm } from "./forms/BusinessInfoForm";

type EditUserDialogProps = {
  user: User;
  onSave: (userId: string, updatedData: Partial<User>) => void;
};

export function EditUserDialog({ user, onSave }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: Partial<User>) => {
    if (!data.first_name?.trim() || !data.last_name?.trim() || !data.email?.trim()) {
      toast({
        title: "خطأ",
        description: "الاسم الأول والأخير والبريد الإلكتروني مطلوبة",
        variant: "destructive",
      });
      return;
    }

    onSave(user.id, data);
    setOpen(false);
    toast({
      title: "تم التحديث",
      description: "تم تحديث معلومات المستخدم بنجاح",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل معلومات المستخدم</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PersonalInfoForm user={user} onSubmit={handleSubmit} />
          <BusinessInfoForm user={user} onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}