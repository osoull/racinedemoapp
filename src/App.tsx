import { PlatformSettingsProvider } from "@/contexts/PlatformSettingsContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MaintenanceMode } from "@/components/MaintenanceMode";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import { Auth } from "@/components/Auth";

function App() {
  return (
    <PlatformSettingsProvider>
      <Router>
        <MaintenanceMode>
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <Toaster />
        </MaintenanceMode>
      </Router>
    </PlatformSettingsProvider>
  );
}

export default App;