import { Outlet } from "react-router-dom"
import { BorrowerSidebar } from "./BorrowerSidebar"
import { DashboardLayout } from "../dashboard/DashboardLayout"

export function BorrowerDashboardLayout() {
  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      <Outlet />
    </DashboardLayout>
  )
}