import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function InvestmentsList() {
  const { user } = useAuth()

  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          project:projects(
            title,
            description,
            funding_goal,
            current_funding,
            status
          )
        `)
        .eq("investor_id", user?.id)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  if (isLoading) return <div>جاري التحميل...</div>

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">استثماراتي</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المشروع</TableHead>
            <TableHead>مبلغ الاستثمار</TableHead>
            <TableHead>نسبة التمويل</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments?.map((investment) => (
            <TableRow key={investment.investment_id}>
              <TableCell className="font-medium">
                {investment.project?.title}
              </TableCell>
              <TableCell>{investment.amount.toLocaleString()} ريال</TableCell>
              <TableCell>
                {investment.project ? (
                  `${((investment.project.current_funding / investment.project.funding_goal) * 100).toFixed(1)}%`
                ) : "غير متوفر"}
              </TableCell>
              <TableCell>
                <Badge variant={
                  investment.status === 'confirmed' ? 'default' :
                  investment.status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {investment.status === 'confirmed' ? 'مؤكد' :
                   investment.status === 'pending' ? 'قيد المعالجة' : 'ملغي'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(investment.created_at).toLocaleDateString('ar-SA')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}