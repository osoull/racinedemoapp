import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { ThemeProvider } from "@/components/ui/theme"
import { Routes, Route } from "react-router-dom"
import { Auth } from "@/components/Auth"
import InvestorDashboard from "@/pages/investor/Dashboard"
import AdminDashboard from "@/pages/admin/Dashboard"
import BorrowerDashboard from "@/pages/borrower/Dashboard"
import InvestorsPage from "@/pages/admin/investors"
import ProjectsListPage from "@/pages/investor/projects"
import Portfolio from "@/pages/investor/Portfolio"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"

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
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>
  }

  if (!user || !userType || !allowedRoles.includes(userType)) {
    return <Auth />
  }

  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <AuthProvider>
          <NotificationsProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background font-messiri" dir="rtl">
                <Routes>
                  <Route path="/" element={<Auth />} />
                  
                  <Route
                    path="/investor"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <InvestorDashboard />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/investor/projects"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <ProjectsListPage />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/investor/portfolio"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <Portfolio />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/investor/reports"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <div>Reports Page</div>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/investor/verification"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <div>Verification Page</div>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/investor/support"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <div>Support Page</div>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/borrower/*"
                    element={
                      <PrivateRoute allowedRoles={["borrower"]}>
                        <BorrowerDashboard />
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
                    path="/admin/investors"
                    element={
                      <PrivateRoute allowedRoles={["admin"]}>
                        <InvestorsPage />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute allowedRoles={["investor", "admin", "borrower"]}>
                        <Profile />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute allowedRoles={["investor", "admin", "borrower"]}>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                </Routes>
                <Toaster />
              </div>
            </BrowserRouter>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App