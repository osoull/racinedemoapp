import { z } from "zod";

export const signUpSchema = z.object({
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

export type SignUpValues = z.infer<typeof signUpSchema>;