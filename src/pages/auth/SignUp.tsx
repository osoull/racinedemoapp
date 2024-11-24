import { useNavigate } from "react-router-dom";
import { SignUpForm } from "@/components/auth/SignUpForm";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <SignUpForm
        userType="investor"
        onBack={() => navigate("/auth/signin")}
        onSuccess={() => navigate("/auth/signin")}
      />
    </div>
  );
};

export default SignUp;