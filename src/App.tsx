import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";
import { RoleRoutes } from "@/components/auth/RoleRoutes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Page d'accueil - Authentification */}
            <Route path="/" element={<Auth />} />
            
            {/* Routes basées sur les rôles */}
            <Route path="/*" element={<RoleRoutes />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;