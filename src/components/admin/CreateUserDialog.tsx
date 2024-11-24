import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type CreateUserDialogProps = {
  onUserCreated?: () => void;
};

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("investor");
  const [investorType, setInvestorType] = useState("basic");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Create the user in auth.users
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
            investor_type: userType === "investor" ? investorType : undefined,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 2. Update the profile with additional information
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
          email: email,
          investor_type: userType === "investor" ? investorType : undefined,
        })
        .eq('id', authData.user?.id);

      if (updateError) throw updateError;

      toast({
        title: "نجاح",
        description: "تم إنشاء المستخدم بنجاح",
      });
      
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      setOpen(false);
      if (onUserCreated) onUserCreated();
      
      // Reset form
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setUserType("investor");
      setInvestorType("basic");

    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء المستخدم",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة مستخدم جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">الاسم الأول</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="الاسم الأول"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">اسم العائلة</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="اسم العائلة"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">نوع المستخدم</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع المستخدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investor">مستثمر</SelectItem>
                <SelectItem value="borrower">طالب تمويل</SelectItem>
                <SelectItem value="investment_manager">مدير استثمار</SelectItem>
                <SelectItem value="admin">مشرف</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {userType === "investor" && (
            <div className="space-y-2">
              <Label htmlFor="investorType">نوع المستثمر</Label>
              <Select value={investorType} onValueChange={setInvestorType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المستثمر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">مستثمر أساسي</SelectItem>
                  <SelectItem value="qualified">مستثمر مؤهل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="submit">إنشاء المستخدم</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}