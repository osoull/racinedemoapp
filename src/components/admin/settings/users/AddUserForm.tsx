import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { UserType } from "@/types/user"

const userFormSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  first_name: z.string().min(1, "الاسم الأول مطلوب"),
  last_name: z.string().min(1, "اسم العائلة مطلوب"),
  user_type: z.enum([
    "basic_investor",
    "qualified_investor",
    "borrower",
    "investment_manager",
    "admin",
  ]),
})

interface AddUserFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function AddUserForm({ onSuccess, onCancel }: AddUserFormProps) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      user_type: "basic_investor",
    },
  })

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            user_type: values.user_type,
          },
        },
      })

      if (error) throw error

      // Le trigger handle_new_user s'occupera de créer le profil

      toast({
        title: "تم إنشاء المستخدم",
        description: "تم إرسال رابط تأكيد البريد الإلكتروني",
      })
      onSuccess()
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء المستخدم",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input {...field} dir="rtl" />
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
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" {...field} dir="rtl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الأول</FormLabel>
              <FormControl>
                <Input {...field} dir="rtl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم العائلة</FormLabel>
              <FormControl>
                <Input {...field} dir="rtl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع المستخدم</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المستخدم" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="basic_investor">مستثمر أساسي</SelectItem>
                  <SelectItem value="qualified_investor">مستثمر مؤهل</SelectItem>
                  <SelectItem value="borrower">طالب تمويل</SelectItem>
                  <SelectItem value="investment_manager">مدير استثمار</SelectItem>
                  <SelectItem value="admin">مشرف</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit">إضافة المستخدم</Button>
        </div>
      </form>
    </Form>
  )
}