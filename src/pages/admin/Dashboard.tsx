import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { RevenueDetails } from "@/components/admin/revenue/RevenueDetails";

export default function AdminDashboard() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8">
        <DashboardOverview />
        <RevenueDetails />
      </div>
    </DashboardLayout>
  );
}