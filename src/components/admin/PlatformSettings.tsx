import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CommissionManagement from "./CommissionManagement"
import ComplianceAudit from "./ComplianceAudit"
import BankDetails from "./BankDetails"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function PlatformSettings() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    const path = location.pathname.split("/").pop()
    if (path && path !== "platform-settings") {
      setActiveTab(path)
    } else {
      // Set default tab to "general" when loading the page
      setActiveTab("general")
      navigate("/admin/settings/general", { replace: true })
    }
  }, [location, navigate])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    navigate(`/admin/settings/${value}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات المنصة</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs dir="rtl" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compliance">متطلبات CMA</TabsTrigger>
            <TabsTrigger value="commissions">العمولات</TabsTrigger>
            <TabsTrigger value="bank">الحساب البنكي</TabsTrigger>
            <TabsTrigger value="general">عام</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <h3 className="text-lg font-semibold mb-4">الإعدادات العامة</h3>
            {/* General settings content */}
          </TabsContent>

          <TabsContent value="bank">
            <BankDetails />
          </TabsContent>

          <TabsContent value="commissions">
            <CommissionManagement />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceAudit tab="cma" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}