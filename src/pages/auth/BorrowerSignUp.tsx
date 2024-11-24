import { useNavigate } from "react-router-dom";
import { BorrowerSignUpForm } from "@/components/auth/BorrowerSignUpForm";

const BorrowerSignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <BorrowerSignUpForm
        onBack={() => navigate("/auth/signup")}
        onSuccess={() => navigate("/auth/signin")}
      />
    </div>
  );
};

export default BorrowerSignUp;