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
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"
import "./App.css"

const queryClient = new QueryClient()

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth()
  const [userType, setUserType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getUserType() {
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (error) {
        setIsLoading(false)
        return
      }

      setUserType(profile?.user_type)
      setIsLoading(false)
    }

    getUserType()
  }, [user])

  if (loading || isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!userType || !allowedRoles.includes(userType)) {
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
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    async function getUserType() {
      if (!user) return

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (error) {
        return
      }

      setUserType(profile?.user_type)
    }

    getUserType()
  }, [user])

  const getDashboardRoute = () => {
    if (!user || !userType) return "/"
    
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
          {/* Public routes */}
          <Route path="/signin" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Auth />} />

          {/* Protected routes */}
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
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

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

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to={getDashboardRoute()} replace />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default App