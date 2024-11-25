import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Borrower {
  id: string
  created_at: string
  email: string | null
  first_name: string
  last_name: string
  company_name: string | null
  kyc_status: string | null
  user_type: string
  full_name?: string
  status?: string
}

const columns: ColumnDef<Borrower>[] = [
  {
    accessorKey: "actions",
    header: "الإجراءات",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" className="w-full text-right">
        عرض التفاصيل
      </Button>
    ),
  },
  {
    accessorKey: "kyc_status",
    header: "حالة KYC",
    cell: ({ row }) => (
      <Badge variant={row.original.kyc_status === "approved" ? "default" : "secondary"}>
        {row.original.kyc_status === "approved" ? "معتمد" : "قيد المراجعة"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => (
      <Badge variant={row.original.user_type === "active" ? "default" : "secondary"}>
        {row.original.user_type === "active" ? "نشط" : "معلق"}
      </Badge>
    ),
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
    header: "الاسم الكامل",
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
  },
]

export default function BorrowerManagement() {
  const [activeTab, setActiveTab] = useState("all")

  const { data: borrowers, isLoading } = useQuery({
    queryKey: ["borrowers", activeTab],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .eq("user_type", "borrower")

      if (activeTab !== "all") {
        query = query.eq("status", activeTab)
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
            إدارة ومراقبة حسابات المقترضين
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>المقترضون</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
              <TabsList className="justify-start">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="pending">معلق</TabsTrigger>
                <TabsTrigger value="blocked">محظور</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataTable columns={columns} data={borrowers || []} />
                )}
              </TabsContent>

              <TabsContent value="active">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataTable 
                    columns={columns} 
                    data={borrowers?.filter(b => b.user_type === "active") || []} 
                  />
                )}
              </TabsContent>

              <TabsContent value="pending">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataTable 
                    columns={columns} 
                    data={borrowers?.filter(b => b.user_type === "pending") || []} 
                  />
                )}
              </TabsContent>

              <TabsContent value="blocked">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataTable 
                    columns={columns} 
                    data={borrowers?.filter(b => b.user_type === "blocked") || []} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}