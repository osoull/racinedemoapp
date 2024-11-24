import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

type PersonalInfoFormProps = {
  user: User;
  onSubmit: (data: Partial<User>) => void;
};

type FormData = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  national_id?: string;
};

export function PersonalInfoForm({ user, onSubmit }: PersonalInfoFormProps) {
  const form = useForm<FormData>({
    defaultValues: {
      first_name: user.first_name || "",
      middle_name: user.middle_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      national_id: user.national_id || "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

      <Button type="submit">حفظ المعلومات الشخصية</Button>
    </form>
  );
}