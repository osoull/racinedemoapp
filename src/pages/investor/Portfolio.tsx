import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { WalletOverview } from "@/components/investor/wallet/WalletOverview"
import { InvestmentsList } from "@/components/investor/wallet/InvestmentsList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Portfolio = () => {
  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">المحفظة والاستثمارات</h1>
        </div>

        <Tabs defaultValue="wallet" className="space-y-4">
          <TabsList>
            <TabsTrigger value="wallet">المحفظة</TabsTrigger>
            <TabsTrigger value="investments">الاستثمارات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="space-y-4">
            <WalletOverview />
          </TabsContent>
          
          <TabsContent value="investments" className="space-y-4">
            <InvestmentsList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default Portfolio