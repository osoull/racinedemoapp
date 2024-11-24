import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type EditUserDialogProps = {
  user: User;
  onSave: (userId: string, updatedData: Partial<User>) => void;
};

type FormData = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  national_id?: string;
  company_name?: string;
  commercial_register?: string;
  business_type?: string;
  business_address?: string;
  business_description?: string;
};

export function EditUserDialog({ user, onSave }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      first_name: user.first_name || "",
      middle_name: user.middle_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      national_id: user.national_id || "",
      company_name: user.company_name || "",
      commercial_register: user.commercial_register || "",
      business_type: user.business_type || "",
      business_address: user.business_address || "",
      business_description: user.business_description || "",
    },
  });

  const handleSubmit = (data: FormData) => {
    if (!data.first_name.trim() || !data.last_name.trim() || !data.email.trim()) {
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">المعلومات الشخصية</h3>
              <div className="space-y-2">
                <Label htmlFor="first_name">الاسم الأول *</Label>
                <Input
                  id="first_name"
                  {...form.register("first_name")}
                  placeholder="الاسم الأول"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="middle_name">الاسم الأوسط</Label>
                <Input
                  id="middle_name"
                  {...form.register("middle_name")}
                  placeholder="الاسم الأوسط"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">اسم العائلة *</Label>
                <Input
                  id="last_name"
                  {...form.register("last_name")}
                  placeholder="اسم العائلة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="البريد الإلكتروني"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="رقم الهاتف"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="national_id">رقم الهوية</Label>
                <Input
                  id="national_id"
                  {...form.register("national_id")}
                  placeholder="رقم الهوية"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="العنوان"
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">معلومات الشركة</h3>
              <div className="space-y-2">
                <Label htmlFor="company_name">اسم الشركة</Label>
                <Input
                  id="company_name"
                  {...form.register("company_name")}
                  placeholder="اسم الشركة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commercial_register">السجل التجاري</Label>
                <Input
                  id="commercial_register"
                  {...form.register("commercial_register")}
                  placeholder="رقم السجل التجاري"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_type">نوع النشاط التجاري</Label>
                <Input
                  id="business_type"
                  {...form.register("business_type")}
                  placeholder="نوع النشاط التجاري"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_address">عنوان الشركة</Label>
                <Input
                  id="business_address"
                  {...form.register("business_address")}
                  placeholder="عنوان الشركة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_description">وصف النشاط التجاري</Label>
                <Input
                  id="business_description"
                  {...form.register("business_description")}
                  placeholder="وصف النشاط التجاري"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" className="bg-primary">حفظ التغييرات</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}