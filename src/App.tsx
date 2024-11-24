import { useRealtimeSync } from "./hooks/useRealtimeSync";
import { Toaster } from "@/components/ui/toaster";

function App() {
  // Enable real-time sync
  useRealtimeSync();

  return (
    <>
      <div>Your app content goes here...</div>
      <Toaster />
    </>
  );
}

export default App;
