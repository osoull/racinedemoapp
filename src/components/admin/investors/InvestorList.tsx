import { InvestorCard } from "./InvestorCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type InvestorListProps = {
  investors: any[]
}

export function InvestorList({ investors }: InvestorListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredInvestors = investors?.filter(investor => {
    const fullName = [
      investor.first_name,
      investor.middle_name,
      investor.last_name
    ].filter(Boolean).join(" ").toLowerCase()
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           investor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const basicInvestors = filteredInvestors?.filter(inv => inv.investor_type === "basic") || []
  const qualifiedInvestors = filteredInvestors?.filter(inv => inv.investor_type === "qualified") || []

  return (
    <div className="space-y-4">
      <Input
        placeholder="البحث عن مستثمر..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="all">
            جميع المستثمرين ({filteredInvestors?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="basic">
            المستثمرون الأساسيون ({basicInvestors.length})
          </TabsTrigger>
          <TabsTrigger value="qualified">
            المستثمرون المؤهلون ({qualifiedInvestors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredInvestors?.map((investor) => (
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
    </div>
  )
}