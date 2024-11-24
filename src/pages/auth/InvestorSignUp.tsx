import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestorSignUpForm } from "@/components/auth/InvestorSignUpForm";

const InvestorSignUp = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>تسجيل حساب مستثمر جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <InvestorSignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorSignUp;