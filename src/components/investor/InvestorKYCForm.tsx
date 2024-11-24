import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function InvestorKYCForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      national_id_number: "",
      occupation: "",
      employer: "",
      annual_income: "",
      source_of_funds: "",
      risk_tolerance: "moderate",
      investment_experience: "intermediate"
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('investor_kyc')
        .insert([
          {
            id: user?.id,
            ...data
          }
        ]);

      if (error) throw error;

      toast({
        title: "تم إرسال المعلومات بنجاح",
        description: "سيتم مراجعة معلوماتك قريباً"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال المعلومات",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="national_id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهوية الوطنية</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المهنة</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>جهة العمل</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="annual_income"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدخل السنوي</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source_of_funds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مصدر الأموال</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="risk_tolerance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تحمل المخاطر</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى تحمل المخاطر" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">منخفض</SelectItem>
                  <SelectItem value="moderate">متوسط</SelectItem>
                  <SelectItem value="high">مرتفع</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">إرسال</Button>
      </form>
    </Form>
  );
}