import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"

export default function BorrowerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/auth")
    }
  }, [user, navigate])

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8">لوحة تحكم المقترض</h1>
        <BorrowerKYCForm />
      </div>
    </DashboardLayout>
  )
}