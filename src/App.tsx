import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/utils/queryClient"
import { AuthProvider } from "@/contexts/AuthContext"
import { Auth } from "@/components/Auth"
import { RoleRoutes } from "@/components/auth/RoleRoutes"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={<RoleRoutes />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App