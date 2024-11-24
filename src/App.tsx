import { Routes, Route } from "react-router-dom";
import { useRealtimeSync } from "./hooks/useRealtimeSync";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";

function App() {
  // Enable real-time sync
  useRealtimeSync();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;