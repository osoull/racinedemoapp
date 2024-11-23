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
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (profile) {
        switch (profile.user_type) {
          case 'admin':
            navigate('/admin');
            break;
          case 'investment_manager':
            navigate('/investment-manager');
            break;
          case 'project_owner':
          case 'investor':
          default:
            navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error in handleRedirect:', error);
      toast.error("حدث خطأ أثناء توجيهك. يرجى المحاولة مرة أخرى.");
      navigate('/dashboard');
    }
  };

  const onSubmit = async (values: SignInValues) => {
    try {
      setIsLoading(true);
      console.log('Tentative de connexion avec:', values.email); // Log de débogage
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error('Erreur détaillée:', error); // Log détaillé de l'erreur
        
        switch (error.message) {
          case 'Invalid login credentials':
            toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
            break;
          case 'Email not confirmed':
            toast.error("يرجى تأكيد بريدك الإلكتروني أولاً");
            break;
          case 'Too many requests':
            toast.error("محاولات كثيرة جداً، يرجى المحاولة لاحقاً");
            break;
          default:
            toast.error(`خطأ: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        console.log('Connexion réussie pour:', data.user.email); // Log de succès
        toast.success("تم تسجيل الدخول بنجاح");
        await handleRedirect(data.user.id);
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur inattendue:', error);
      toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

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
                <Input 
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