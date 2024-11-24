import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestorKYCForm } from "@/components/investor/InvestorKYCForm";

const InvestorKYC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>التحقق من الهوية - المستثمر</CardTitle>
        </CardHeader>
        <CardContent>
          <InvestorKYCForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorKYC;