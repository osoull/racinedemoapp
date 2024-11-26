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
    <div className="container max-w-[1400px] mx-auto px-4 min-h-screen">
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full">
          <div className="flex flex-col lg:flex-row lg:gap-8 h-full">
            {/* Sidebar with tabs - Fixed width on desktop */}
            <Card className="lg:w-72 mb-6 lg:mb-0 shrink-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <TabsList className="flex flex-row lg:flex-col h-auto p-2 bg-muted/50 w-full">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="w-full text-right py-3 px-4 data-[state=active]:bg-background"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Card>

            {/* Main content area - Scrollable */}
            <Card className="flex-1">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-8">
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
                  <div className="flex justify-between mt-8 pt-6 border-t">
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

                    {currentTab !== "payment" ? (
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
                    ) : (
                      <Button type="submit" disabled={isSubmitting}>
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