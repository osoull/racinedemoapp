import { useNavigate } from "react-router-dom";
import { InvestorSignUpForm } from "@/components/auth/InvestorSignUpForm";

const InvestorSignUp = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/auth/signup");
  };

  const handleSuccess = () => {
    navigate("/auth/signin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <InvestorSignUpForm onBack={handleBack} onSuccess={handleSuccess} />
    </div>
  );
};

export default InvestorSignUp;