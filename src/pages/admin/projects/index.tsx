import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import ProjectManagement from "@/components/admin/ProjectManagement"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function ProjectsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">إدارة المشاريع</h1>
          <p className="text-muted-foreground">مراجعة وإدارة طلبات التمويل</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
            <TabsTrigger value="active">نشط</TabsTrigger>
            <TabsTrigger value="completed">مكتمل</TabsTrigger>
            <TabsTrigger value="rejected">مرفوض</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ProjectManagement filter="pending" />
          </TabsContent>

          <TabsContent value="active">
            <ProjectManagement filter="active" />
          </TabsContent>

          <TabsContent value="completed">
            <ProjectManagement filter="completed" />
          </TabsContent>

          <TabsContent value="rejected">
            <ProjectManagement filter="rejected" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}