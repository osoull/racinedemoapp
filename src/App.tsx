import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import Footer from "@/components/Footer"
import { Routes, Route, Navigate } from "react-router-dom"
import { Auth } from "@/components/Auth"
import AdminDashboard from "@/pages/admin/Dashboard"
import InvestmentManagerDashboard from "@/pages/InvestmentManagerDashboard"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import { useAuth } from "@/contexts/AuthContext"
import "./App.css"

const queryClient = new QueryClient()

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Auth />} />
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/investment-manager"
                    element={
                      <PrivateRoute allowedRoles={["investment_manager"]}>
                        <InvestmentManagerDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute allowedRoles={["admin", "investment_manager", "investor"]}>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute allowedRoles={["admin", "investment_manager", "investor"]}>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </BrowserRouter>
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App