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
import AdminDashboard from "@/pages/admin/Dashboard"
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

  const userType = user.user_metadata?.user_type
  if (!allowedRoles.includes(userType)) {
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
            <AppContent />
          </BrowserRouter>
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function AppContent() {
  const { user } = useAuth()

  const getDashboardRoute = () => {
    if (!user) return "/"
    
    const userType = user.user_metadata?.user_type
    switch (userType) {
      case "project_owner":
        return "/project-owner"
      case "investor":
        return "/investor"
      case "admin":
        return "/admin"
      default:
        return "/"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Routes>
          {/* Page d'authentification */}
          <Route path="/" element={<Auth />} />

          {/* Dashboard Investisseur */}
          <Route
            path="/investor/*"
            element={
              <PrivateRoute allowedRoles={["investor"]}>
                <InvestorDashboard />
              </PrivateRoute>
            }
          />

          {/* Dashboard Propriétaire de Projet */}
          <Route
            path="/project-owner/*"
            element={
              <PrivateRoute allowedRoles={["project_owner"]}>
                <ProjectOwnerDashboard />
              </PrivateRoute>
            }
          />

          {/* Dashboard Admin */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Pages communes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["investor", "project_owner", "admin"]}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute allowedRoles={["investor", "project_owner", "admin"]}>
                <Settings />
              </PrivateRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to={getDashboardRoute()} replace />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default App