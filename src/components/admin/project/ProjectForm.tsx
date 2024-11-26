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
    <div className="fixed inset-0 w-full h-full bg-background/95 backdrop-blur-sm">
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full">
          <div className="flex h-full">
            {/* Sidebar with tabs */}
            <Card className="w-[300px] shrink-0 h-full rounded-none border-l bg-card/50 backdrop-blur-sm">
              <ScrollArea className="h-full">
                <TabsList className="flex flex-col h-auto p-8 w-full space-y-2">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="w-full justify-start text-right py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-lg"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Card>

            {/* Main content area */}
            <div className="flex-1 h-full">
              <ScrollArea className="h-full">
                <div className="max-w-4xl mx-auto p-8 lg:p-12">
                  <Card className="border-none shadow-none bg-transparent">
                    <TabsContent value="general" className="mt-0 space-y-6">
                      <GeneralInfo control={form.control} />
                    </TabsContent>

                    <TabsContent value="description" className="mt-0 space-y-6">
                      <ProjectDescription control={form.control} />
                    </TabsContent>

                    <TabsContent value="financial" className="mt-0 space-y-6">
                      <FinancialDetails control={form.control} />
                    </TabsContent>

                    <TabsContent value="timeline" className="mt-0 space-y-6">
                      <ProjectTimeline control={form.control} />
                    </TabsContent>

                    <TabsContent value="team" className="mt-0 space-y-6">
                      <TeamMembers control={form.control} />
                    </TabsContent>

                    <TabsContent value="documents" className="mt-0 space-y-6">
                      <ProjectDocuments control={form.control} />
                    </TabsContent>

                    <TabsContent value="additional" className="mt-0 space-y-6">
                      <AdditionalInfo control={form.control} />
                    </TabsContent>

                    <TabsContent value="payment" className="mt-0 space-y-6">
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
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </div>
        </Tabs>
      </form>
    </div>
  );
}