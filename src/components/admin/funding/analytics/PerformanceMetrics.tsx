import { Progress } from "@/components/ui/progress"

export function PerformanceMetrics({ stats }: { stats: any }) {
  const approvalRate = (stats.approved_requests / stats.total_requests) * 100
  const successRate = (stats.total_amount_approved / stats.total_amount_requested) * 100

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>معدل الموافقة</span>
          <span>{Math.round(approvalRate)}%</span>
        </div>
        <Progress value={approvalRate} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>معدل نجاح التمويل</span>
          <span>{Math.round(successRate)}%</span>
        </div>
        <Progress value={successRate} />
      </div>
    </div>
  )
}