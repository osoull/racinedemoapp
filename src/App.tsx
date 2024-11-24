import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import BorrowerDashboard from "@/pages/borrower/Dashboard";
import SubmitProject from "@/pages/borrower/SubmitProject";
import AdminDashboard from "@/pages/admin/Dashboard";
import BorrowerManagement from "@/components/admin/borrower/BorrowerManagement";
import InvestorManagement from "@/components/admin/investor/InvestorManagement";
import ProjectManagement from "@/components/admin/ProjectManagement";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import BorrowerSignUp from "@/pages/auth/BorrowerSignUp";
import InvestorSignUp from "@/pages/auth/InvestorSignUp";
import BorrowerKYC from "@/pages/borrower/KYC";
import InvestorKYC from "@/pages/investor/KYC";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
            <Route path="/borrower/submit-project" element={<SubmitProject />} />
            <Route path="/admin" element={<ProtectedRoute userType="admin"><AdminDashboard /></ProtectedRoute>}>
              <Route path="borrowers" element={<BorrowerManagement />} />
              <Route path="investors" element={<InvestorManagement />} />
              <Route path="projects" element={<ProjectManagement />} />
            </Route>
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/signup/borrower" element={<BorrowerSignUp />} />
            <Route path="/auth/signup/investor" element={<InvestorSignUp />} />
            <Route path="/borrower/kyc" element={<ProtectedRoute userType="borrower"><BorrowerKYC /></ProtectedRoute>} />
            <Route path="/investor/kyc" element={<ProtectedRoute userType="investor"><InvestorKYC /></ProtectedRoute>} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;