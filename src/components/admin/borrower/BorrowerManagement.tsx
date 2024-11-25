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
  email: string
  full_name: string
  company_name: string
  status: string
  kyc_status: string
}

const columns: ColumnDef<Borrower>[] = [
  {
    accessorKey: "full_name",
    header: "الاسم الكامل",
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
  },
  {
    accessorKey: "company_name",
    header: "اسم الشركة",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status === "active" ? "نشط" : "معلق"}
      </Badge>
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
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        عرض التفاصيل
      </Button>
    ),
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
      <div className="space-y-6">
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
              <TabsList>
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
                    data={borrowers?.filter(b => b.status === "active") || []} 
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
                    data={borrowers?.filter(b => b.status === "pending") || []} 
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
                    data={borrowers?.filter(b => b.status === "blocked") || []} 
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