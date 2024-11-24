import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

type BusinessInfoFormProps = {
  user: User;
  onSubmit: (data: Partial<User>) => void;
};

type FormData = {
  company_name?: string;
  commercial_register?: string;
  business_type?: string;
  business_address?: string;
  business_description?: string;
};

export function BusinessInfoForm({ user, onSubmit }: BusinessInfoFormProps) {
  const form = useForm<FormData>({
    defaultValues: {
      company_name: user.company_name || "",
      commercial_register: user.commercial_register || "",
      business_type: user.business_type || "",
      business_address: user.business_address || "",
      business_description: user.business_description || "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

      <Button type="submit">حفظ معلومات الشركة</Button>
    </form>
  );
}