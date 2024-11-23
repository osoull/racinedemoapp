import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import BirthDateSelector from "./BirthDateSelector";
import { SignUpValues, signUpSchema } from "./types";

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

      if (error) {
        if (error.message.includes('email')) {
          toast.error("البريد الإلكتروني مستخدم بالفعل");
        } else {
          toast.error("حدث خطأ أثناء إنشاء الحساب");
        }
        return;
      }

      toast.success("تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.");
      onSuccess();
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

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
          <BirthDateSelector form={form} />
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