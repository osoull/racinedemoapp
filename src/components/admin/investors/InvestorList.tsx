import { InvestorCard } from "./InvestorCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type InvestorListProps = {
  investors: any[]
}

export function InvestorList({ investors }: InvestorListProps) {
  const basicInvestors = investors?.filter(inv => inv.user_type === "basic_investor") || []
  const qualifiedInvestors = investors?.filter(inv => inv.user_type === "qualified_investor") || []

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="all">جميع المستثمرين</TabsTrigger>
        <TabsTrigger value="basic">المستثمرون الأساسيون</TabsTrigger>
        <TabsTrigger value="qualified">المستثمرون المؤهلون</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {investors?.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="basic">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {basicInvestors.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="qualified">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {qualifiedInvestors.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}