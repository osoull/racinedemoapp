import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false)

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          owner: profiles(first_name, last_name),
          risk_ratings(*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      return data
    }
  })

  const handleInvest = async () => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول للاستثمار",
        variant: "destructive"
      })
      return
    }

    const amount = parseFloat(investmentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive"
      })
      return
    }

    const { data, error } = await supabase
      .from("investments")
      .insert({
        project_id: id,
        investor_id: user.id,
        amount: amount,
        status: "pending"
      })

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الاستثمار",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "تم بنجاح",
      description: "تم إنشاء طلب الاستثمار بنجاح"
    })
    setIsInvestDialogOpen(false)
  }

  if (isLoading) {
    return (
      <DashboardLayout sidebar={<InvestorSidebar />}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!project) {
    return (
      <DashboardLayout sidebar={<InvestorSidebar />}>
        <div className="text-center">
          <h2 className="text-2xl font-bold">المشروع غير موجود</h2>
        </div>
      </DashboardLayout>
    )
  }

  const progress = (project.current_funding / project.funding_goal) * 100

  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
            <p className="text-muted-foreground">
              {project.owner.first_name} {project.owner.last_name}
            </p>
          </div>
          <Button onClick={() => setIsInvestDialogOpen(true)}>
            استثمر الآن
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-xl font-semibold mb-4">تفاصيل المشروع</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">معلومات التمويل</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">الهدف</p>
                <p className="text-lg font-medium">{project.funding_goal} ريال</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">التمويل الحالي</p>
                <p className="text-lg font-medium">{project.current_funding} ريال</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نسبة التمويل</p>
                <p className="text-lg font-medium">{progress.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>استثمر في المشروع</DialogTitle>
            <DialogDescription>
              أدخل المبلغ الذي تريد استثماره في هذا المشروع
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="text-sm font-medium">
                مبلغ الاستثمار (ريال)
              </label>
              <Input
                id="amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="أدخل المبلغ"
              />
            </div>
            <Button onClick={handleInvest} className="w-full">
              تأكيد الاستثمار
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}