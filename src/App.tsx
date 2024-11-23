import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { NotificationsProvider } from "@/components/ui/notifications";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/ui/theme";
import { queryClient } from "@/lib/utils";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Index from "@/pages/index";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import InvestmentManagerDashboard from "@/pages/InvestmentManagerDashboard";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <NotificationsProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/investment-manager" element={<InvestmentManagerDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
          <Toaster />
        </NotificationsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
