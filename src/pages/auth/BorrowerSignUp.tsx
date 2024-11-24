import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BorrowerSignUpForm } from "@/components/auth/BorrowerSignUpForm";

const BorrowerSignUp = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>تسجيل حساب مقترض جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <BorrowerSignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowerSignUp;