import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Building2, Users, FileText, Wallet } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KycStatusLabel } from "../KycStatusLabel"
import { BorrowerDetailsDialog } from "./BorrowerDetailsDialog"
import { StatCard } from "@/components/dashboard/StatCard"

interface Borrower {
  id: string
  created_at: string
  email: string | null
  first_name: string
  last_name: string
  company_name: string | null
  commercial_register: string | null
  business_type: string | null
  kyc_status: string | null
  user_type: string
  total_requests?: number
  total_borrowed?: number
  last_activity?: string
}

const columns: ColumnDef<Borrower>[] = [
  {
    accessorKey: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            عرض التفاصيل
          </Button>
          <BorrowerDetailsDialog 
            borrowerId={row.original.id} 
            open={open} 
            onOpenChange={setOpen}
          />
        </>
      )
    },
  },
  {
    accessorKey: "kyc_status",
    header: "حالة KYC",
    cell: ({ row }) => <KycStatusLabel status={row.original.kyc_status} />,
  },
  {
    accessorKey: "business_type",
    header: "نوع النشاط",
  },
  {
    accessorKey: "commercial_register",
    header: "السجل التجاري",
  },
  {
    accessorKey: "company_name",
    header: "اسم الشركة",
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
  },
  {
    accessorKey: "full_name",
    header: "الممثل القانوني",
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
  },
]

export default function BorrowerManagement() {
  const [activeTab, setActiveTab] = useState("all")

  const { data: stats } = useQuery({
    queryKey: ["borrower-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_borrower_stats')
      if (error) throw error
      return data[0]
    },
  })

  const { data: borrowers, isLoading } = useQuery({
    queryKey: ["borrowers", activeTab],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select(`
          *,
          borrower_kyc (
            verification_status
          ),
          funding_requests (
            count,
            sum(funding_goal)
          )
        `)
        .eq("user_type", "borrower")

      if (activeTab !== "all") {
        query = query.eq("kyc_status", activeTab)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Borrower[]
    },
  })

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6" dir="rtl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة المقترضين</h2>
          <p className="text-muted-foreground">
            إدارة ومراقبة حسابات الشركات المقترضة
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="إجمالي المقترضين"
            value={stats?.total_borrowers || 0}
            icon={Building2}
            trend={stats?.borrower_growth}
          />
          <StatCard
            title="المقترضين النشطين"
            value={stats?.active_borrowers || 0}
            icon={Users}
            trend={stats?.active_growth}
          />
          <StatCard
            title="طلبات التمويل"
            value={stats?.total_requests || 0}
            icon={FileText}
          />
          <StatCard
            title="إجمالي التمويل"
            value={stats?.total_borrowed || 0}
            icon={Wallet}
            showAsCurrency
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>المقترضون</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
              <TabsList className="justify-start">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="approved">معتمد</TabsTrigger>
                <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
                <TabsTrigger value="rejected">مرفوض</TabsTrigger>
              </TabsList>

              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <DataTable 
                  columns={columns} 
                  data={borrowers || []}
                />
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}