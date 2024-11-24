import { PlatformSettingsProvider } from "@/contexts/PlatformSettingsContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <PlatformSettingsProvider>
      <Router>
        <main className="min-h-screen">
          {/* Your routes will be added here later */}
        </main>
        <Toaster />
      </Router>
    </PlatformSettingsProvider>
  );
}

export default App;