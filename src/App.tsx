import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, NavigateOptions, To } from "react-router-dom";
import { ErrorMessage } from "@/components/ui/error-message";
import { useEffect, useRef } from "react";

// Navigation throttling component
const NavigationThrottler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastNavigationTime = useRef(Date.now());

  useEffect(() => {
    const originalNavigate = navigate;
    const throttleTime = 1000; // 1 second throttle

    (navigate as any).original = originalNavigate;
    (navigate as any).throttled = (to: To, options?: NavigateOptions) => {
      const now = Date.now();
      if (now - lastNavigationTime.current >= throttleTime) {
        lastNavigationTime.current = now;
        return originalNavigate(to, options);
      }
    };
  }, [navigate]);

  return <>{children}</>;
};

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
        <NavigationThrottler>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NavigationThrottler>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;