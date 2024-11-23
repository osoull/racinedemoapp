import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const signUpSchema = z.object({
  nationalId: z.string().min(10, "رقم الهوية يجب أن يكون 10 أرقام على الأقل"),
  birthDay: z.string().min(1, "اختر يوم الميلاد"),
  birthMonth: z.string().min(1, "اختر شهر الميلاد"),
  birthYear: z.string().min(1, "اختر سنة الميلاد"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  phone: z.string().min(9, "رقم الجوال يجب أن يكون 9 أرقام على الأقل"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "يجب الموافقة على الشروط والأحكام",
  }),
});

type SignUpValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess: () => void;
}

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nationalId: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      email: "",
      password: "",
      phone: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    try {
      setIsLoading(true);
      
      // Combine birth date fields
      const birthDate = `${values.birthYear}-${values.birthMonth}-${values.birthDay}`;
      
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            national_id: values.nationalId,
            birth_date: birthDate,
            phone: `+966${values.phone}`,
          },
        },
      });

      if (error) throw error;

      toast.success("تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.");
      onSuccess();
    } catch (error) {
      toast.error("فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate arrays for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهوية الوطنية / رقم الإقامة<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="رقم الهوية الوطنية / رقم الإقامة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>تاريخ الميلاد<span className="text-red-500">*</span></FormLabel>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="birthYear"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="سنة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthMonth"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="شهر" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDay"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="يوم" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان البريد الإلكتروني<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="email" placeholder="البريد الإلكتروني" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="password" placeholder="كلمة المرور" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الجوال<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                    +966
                  </span>
                  <Input className="rounded-r-none" placeholder="5XXXXXXXX" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  موافق على كافة <Link to="/terms" className="text-primary hover:underline">الشروط والأحكام</Link>
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;