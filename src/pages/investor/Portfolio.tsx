import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { WalletOverview } from "@/components/investor/wallet/WalletOverview"
import { InvestmentsList } from "@/components/investor/wallet/InvestmentsList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Portfolio = () => {
  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المحفظة والاستثمارات</h2>
          <p className="text-muted-foreground">
            إدارة محفظتك واستثماراتك
          </p>
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