import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type SignInValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onSuccess: () => void;
}

const SignInForm = ({ onSuccess }: SignInFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, attempt to sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      if (authData.user) {
        // After successful sign in, get the user's profile to check their type
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setError("حدث خطأ في تحميل بيانات المستخدم");
          return;
        }

        console.log("User profile:", profile); // Debug log

        toast.success("تم تسجيل الدخول بنجاح");

        // Redirect based on user type
        if (profile?.user_type === 'admin') {
          navigate('/admin');
        } else if (profile?.user_type === 'investment_manager') {
          navigate('/investment-manager');
        } else {
          navigate('/dashboard');
        }
        
        onSuccess();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input 
                  dir="ltr"
                  placeholder="أدخل بريدك الإلكتروني" 
                  {...field} 
                  autoComplete="email"
                />
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
                <Input 
                  dir="ltr"
                  type="password" 
                  placeholder="أدخل كلمة المرور" 
                  {...field} 
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;