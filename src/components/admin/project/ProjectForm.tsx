import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralInfo } from "./sections/GeneralInfo";
import { ProjectDescription } from "./sections/ProjectDescription";
import { FinancialDetails } from "./sections/FinancialDetails";
import { ProjectTimeline } from "./sections/ProjectTimeline";
import { TeamMembers } from "./sections/TeamMembers";
import { ProjectDocuments } from "./sections/ProjectDocuments";
import { AdditionalInfo } from "./sections/AdditionalInfo";
import { PaymentSection } from "./sections/PaymentSection";
import { Button } from "@/components/ui/button";
import { useProjectSubmission } from "@/hooks/useProjectSubmission";

export function ProjectForm() {
  const [currentTab, setCurrentTab] = useState("general");
  const { form, onSubmit, isSubmitting } = useProjectSubmission();

  const tabs = [
    { value: "general", label: "معلومات عامة" },
    { value: "description", label: "وصف المشروع" },
    { value: "financial", label: "التفاصيل المالية" },
    { value: "timeline", label: "الجدول الزمني" },
    { value: "team", label: "فريق العمل" },
    { value: "documents", label: "المستندات" },
    { value: "additional", label: "معلومات إضافية" },
    { value: "payment", label: "الدفع" }
  ];

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general">
            <GeneralInfo control={form.control} />
          </TabsContent>

          <TabsContent value="description">
            <ProjectDescription control={form.control} />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialDetails control={form.control} />
          </TabsContent>

          <TabsContent value="timeline">
            <ProjectTimeline control={form.control} />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembers control={form.control} />
          </TabsContent>

          <TabsContent value="documents">
            <ProjectDocuments control={form.control} />
          </TabsContent>

          <TabsContent value="additional">
            <AdditionalInfo control={form.control} />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentSection />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.value === currentTab);
              if (currentIndex > 0) {
                setCurrentTab(tabs[currentIndex - 1].value);
              }
            }}
            disabled={currentTab === "general"}
          >
            السابق
          </Button>

          {currentTab !== "payment" && (
            <Button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.value === currentTab);
                if (currentIndex < tabs.length - 1) {
                  setCurrentTab(tabs[currentIndex + 1].value);
                }
              }}
            >
              التالي
            </Button>
          )}

          {currentTab === "payment" && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "تأكيد وإرسال"}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}