import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { InvestorList } from "../InvestorList"
import { useState } from "react"

interface InvestorSectionProps {
  investors: any[]
  isLoading: boolean
}

export function InvestorSection({ investors, isLoading }: InvestorSectionProps) {
  const [search, setSearch] = useState("")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>المستثمرون</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            placeholder="بحث..."
            className="w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <InvestorList investors={investors} />
        )}
      </CardContent>
    </Card>
  )
}