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
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
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
            navigate('/dashboard');
            break;
          case 'investor':
            navigate('/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error in handleRedirect:', error);
      toast.error("Une erreur est survenue lors de la redirection. Veuillez réessayer.");
      navigate('/dashboard');
    }
  };

  const onSubmit = async (values: SignInValues) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign in with:', values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Email ou mot de passe incorrect");
        } else {
          toast.error("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
        }
        return;
      }

      if (data.user) {
        console.log('Sign in successful:', data.user.id);
        toast.success("Connexion réussie");
        await handleRedirect(data.user.id);
        onSuccess();
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast.error("Une erreur inattendue est survenue. Veuillez réessayer.");
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Entrez votre email" 
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
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Entrez votre mot de passe" 
                  {...field} 
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;