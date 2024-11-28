import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ErrorMessage } from "@/components/ui/error-message";

function App() {
  const { loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <ErrorMessage message={error} />
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;