import { BorrowerSidebar } from "./BorrowerSidebar"
import { DashboardLayout } from "../dashboard/DashboardLayout"

interface BorrowerDashboardLayoutProps {
  children: React.ReactNode
}

export function BorrowerDashboardLayout({ children }: BorrowerDashboardLayoutProps) {
  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      <div className="min-h-[calc(100vh-3.5rem-2.5rem)]">
        {children}
      </div>
    </DashboardLayout>
  )
}