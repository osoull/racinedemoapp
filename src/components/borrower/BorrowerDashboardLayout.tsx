import { BorrowerSidebar } from "./BorrowerSidebar"
import { DashboardLayout } from "../dashboard/DashboardLayout"

interface BorrowerDashboardLayoutProps {
  children: React.ReactNode
}

export function BorrowerDashboardLayout({ children }: BorrowerDashboardLayoutProps) {
  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      {children}
    </DashboardLayout>
  )
}