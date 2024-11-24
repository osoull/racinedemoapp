import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import Footer from "@/components/Footer"
import { Routes, Route, Navigate } from "react-router-dom"
import { Auth } from "@/components/Auth"
import InvestorDashboard from "@/pages/investor/Dashboard"
import ProjectOwnerDashboard from "@/pages/project-owner/Dashboard"
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
  const { user } = useAuth()

  const getDashboardRoute = () => {
    if (!user) return "/"
    
    const userType = user.user_metadata?.user_type
    switch (userType) {
      case "project_owner":
        return "/project-owner"
      case "investor":
        return "/investor"
      default:
        return "/"
    }
  }

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
                    path="/investor/*"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <InvestorDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/project-owner/*"
                    element={
                      <PrivateRoute allowedRoles={["project_owner"]}>
                        <ProjectOwnerDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute allowedRoles={["investor", "project_owner"]}>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute allowedRoles={["investor", "project_owner"]}>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to={getDashboardRoute()} replace />} />
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