import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTable from "@/components/investment-manager/ProjectsTable";
import InvestmentsTable from "@/components/investment-manager/InvestmentsTable";

type ProjectStatus = "pending" | "approved" | "rejected" | "funding" | "completed";
type InvestmentStatus = "pending" | "confirmed" | "cancelled";

const InvestmentManagerDashboard = () => {
  const [selectedProjectStatus, setSelectedProjectStatus] = useState<ProjectStatus>("pending");
  const [selectedInvestmentStatus, setSelectedInvestmentStatus] = useState<InvestmentStatus>("pending");

  return (
    <div className="container mx-auto px-4 pt-20 pb-6">
      <h1 className="text-2xl font-bold mb-6">لوحة تحكم مدير الاستثمار</h1>
      
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">المشاريع</TabsTrigger>
          <TabsTrigger value="investments">الاستثمارات</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card className="p-4">
            <div className="mb-4">
              <select
                className="border rounded p-2"
                value={selectedProjectStatus}
                onChange={(e) => setSelectedProjectStatus(e.target.value as ProjectStatus)}
              >
                <option value="pending">قيد المراجعة</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوض</option>
                <option value="funding">قيد التمويل</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>
            <ProjectsTable status={selectedProjectStatus} />
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card className="p-4">
            <div className="mb-4">
              <select
                className="border rounded p-2"
                value={selectedInvestmentStatus}
                onChange={(e) => setSelectedInvestmentStatus(e.target.value as InvestmentStatus)}
              >
                <option value="pending">قيد المراجعة</option>
                <option value="confirmed">مؤكد</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
            <InvestmentsTable status={selectedInvestmentStatus} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentManagerDashboard;