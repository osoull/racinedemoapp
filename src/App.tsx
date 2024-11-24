import { PlatformSettingsProvider } from "@/contexts/PlatformSettingsContext";
import { BrowserRouter as Router } from "react-router-dom";
import { YourOtherProviders } from "@/your-other-providers";
import YourRoutes from "@/YourRoutes";

function App() {
  return (
    <PlatformSettingsProvider>
      <Router>
        <YourOtherProviders>
          <YourRoutes />
        </YourOtherProviders>
      </Router>
    </PlatformSettingsProvider>
  );
}

export default App;
