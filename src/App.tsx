import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { ThemeProvider } from "@/components/ui/theme"
import { Routes, Route, Navigate } from "react-router-dom"
import { Auth } from "@/components/Auth"
import InvestorDashboard from "@/pages/investor/Dashboard"
import AdminDashboard from "@/pages/admin/Dashboard"
import BorrowerDashboard from "@/pages/borrower/Dashboard"
import InvestorsPage from "@/pages/admin/investors"
import ProjectsListPage from "@/pages/investor/projects"
import Portfolio from "@/pages/investor/Portfolio"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import ProjectsPage from "@/pages/admin/projects"
import BorrowerManagement from "@/components/admin/borrower/BorrowerManagement"
import { TransactionManagement } from "@/components/admin/transaction/TransactionManagement"
import { KYCManagement } from "@/components/admin/compliance/KYCManagement"
import SupportTools from "@/components/admin/SupportTools"
import PlatformSettings from "@/components/admin/PlatformSettings"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

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

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      setUserType(profile?.user_type)
      setIsLoading(false)
    }

    if (user) {
      getUserType()
    } else {
      setIsLoading(false)
    }
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || !userType || !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <BrowserRouter>
          <AuthProvider>
            <NotificationsProvider>
              <div className="min-h-screen bg-background font-messiri" dir="rtl">
                <Routes>
                  <Route path="/" element={<Auth />} />
                  
                  <Route
                    path="/investor/*"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <Routes>
                          <Route index element={<InvestorDashboard />} />
                          <Route path="projects" element={<ProjectsListPage />} />
                          <Route path="portfolio" element={<Portfolio />} />
                          <Route path="reports" element={<div>Reports Page</div>} />
                          <Route path="verification" element={<div>Verification Page</div>} />
                          <Route path="support" element={<div>Support Page</div>} />
                        </Routes>
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
                        <Routes>
                          <Route index element={<AdminDashboard />} />
                          <Route path="investors" element={<InvestorsPage />} />
                          <Route path="projects" element={<ProjectsPage />} />
                          <Route path="borrowers" element={<BorrowerManagement />} />
                          <Route path="transactions" element={<TransactionManagement />} />
                          <Route path="compliance" element={<KYCManagement />} />
                          <Route path="support" element={<SupportTools />} />
                          <Route path="settings/*" element={<PlatformSettings />} />
                        </Routes>
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
            </NotificationsProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App