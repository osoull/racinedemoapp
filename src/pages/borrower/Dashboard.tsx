import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar"

export default function BorrowerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/auth")
    }
  }, [user, navigate])

  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8 text-foreground">لوحة تحكم المقترض</h1>
        <div className="bg-card rounded-lg shadow-sm">
          <BorrowerKYCForm />
        </div>
      </div>
    </DashboardLayout>
  )
}