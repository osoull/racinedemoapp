import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { supabase } from "@/integrations/supabase/client"

const userFormSchema = z.object({
  first_name: z.string().min(1, "الاسم الأول مطلوب"),
  last_name: z.string().min(1, "اسم العائلة مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  user_type: z.enum([
    "basic_investor",
    "qualified_investor",
    "borrower",
    "investment_manager",
    "admin",
  ]),
  kyc_status: z.enum(["pending", "approved", "rejected"]),
})

interface UserEditDialogProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      user_type: user?.user_type || "basic_investor",
      kyc_status: user?.kyc_status || "pending",
    },
  })

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          user_type: values.user_type,
          kyc_status: values.kyc_status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      toast({
        title: "تم التحديث",
        description: "تم تحديث معلومات المستخدم بنجاح",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث معلومات المستخدم",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تعديل معلومات المستخدم</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الأول</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-right" dir="rtl" />
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
                    <Input {...field} className="text-right" dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="text-right" dir="rtl" />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر نوع المستخدم" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent align="end" className="text-right" dir="rtl">
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
            <FormField
              control={form.control}
              name="kyc_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>حالة KYC</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر حالة KYC" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent align="end" className="text-right" dir="rtl">
                      <SelectItem value="pending">قيد المراجعة</SelectItem>
                      <SelectItem value="approved">معتمد</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">حفظ التغييرات</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}