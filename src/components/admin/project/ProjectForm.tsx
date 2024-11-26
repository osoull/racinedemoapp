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
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="w-full h-screen bg-background">
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Sidebar with tabs - Fixed width on desktop */}
            <Card className="lg:w-96 mb-6 lg:mb-0 shrink-0 lg:h-screen lg:rounded-none">
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <TabsList className="flex flex-row lg:flex-col h-auto p-6 bg-muted/50 w-full space-y-3">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="w-full text-right py-4 px-8 data-[state=active]:bg-background text-lg"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Card>

            {/* Main content area - Scrollable */}
            <Card className="flex-1 lg:h-screen lg:rounded-none">
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="p-8 lg:p-16">
                  <TabsContent value="general" className="m-0">
                    <GeneralInfo control={form.control} />
                  </TabsContent>

                  <TabsContent value="description" className="m-0">
                    <ProjectDescription control={form.control} />
                  </TabsContent>

                  <TabsContent value="financial" className="m-0">
                    <FinancialDetails control={form.control} />
                  </TabsContent>

                  <TabsContent value="timeline" className="m-0">
                    <ProjectTimeline control={form.control} />
                  </TabsContent>

                  <TabsContent value="team" className="m-0">
                    <TeamMembers control={form.control} />
                  </TabsContent>

                  <TabsContent value="documents" className="m-0">
                    <ProjectDocuments control={form.control} />
                  </TabsContent>

                  <TabsContent value="additional" className="m-0">
                    <AdditionalInfo control={form.control} />
                  </TabsContent>

                  <TabsContent value="payment" className="m-0">
                    <PaymentSection control={form.control} />
                  </TabsContent>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-12 pt-8 border-t">
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
                      className="w-40 text-lg"
                    >
                      السابق
                    </Button>

                    {currentTab !== "payment" ? (
                      <Button
                        type="button"
                        onClick={() => {
                          const currentIndex = tabs.findIndex(t => t.value === currentTab);
                          if (currentIndex < tabs.length - 1) {
                            setCurrentTab(tabs[currentIndex + 1].value);
                          }
                        }}
                        className="w-40 text-lg"
                      >
                        التالي
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting} className="w-40 text-lg">
                        {isSubmitting ? "جاري الحفظ..." : "تأكيد وإرسال"}
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </Tabs>
      </form>
    </div>
  );
}