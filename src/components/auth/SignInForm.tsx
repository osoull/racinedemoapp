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

  const handleRedirect = async (userId: string) => {
    try {
      console.log("Fetching user profile for ID:", userId);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw new Error("Failed to fetch user profile");
      }

      console.log("User profile data:", profile);

      if (!profile) {
        console.error("No profile found for user");
        throw new Error("No profile found");
      }

      switch (profile.user_type) {
        case 'admin':
          console.log("Redirecting to admin dashboard");
          navigate('/admin');
          break;
        case 'investment_manager':
          console.log("Redirecting to investment manager dashboard");
          navigate('/investment-manager');
          break;
        default:
          console.log("Redirecting to user dashboard");
          navigate('/dashboard');
      }

      toast.success("تم تسجيل الدخول بنجاح");
      onSuccess();
    } catch (error) {
      console.error("Redirect error:", error);
      setError("حدث خطأ في توجيه المستخدم");
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: SignInValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Attempting sign in for email:", values.email);

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        console.error("No user data returned after sign in");
        setError("فشل تسجيل الدخول");
        setIsLoading(false);
        return;
      }

      console.log("Sign in successful, user:", authData.user);
      await handleRedirect(authData.user.id);
      
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
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