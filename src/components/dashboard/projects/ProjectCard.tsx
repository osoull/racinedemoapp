import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Link } from "react-router-dom"
import { formatCurrency } from "@/utils/feeCalculations"

interface ProjectCardProps {
  title: string
  description: string
  progress: number
  status: string
  fundingGoal: number
  currentFunding: number
  projectId: string
}

export function ProjectCard({ 
  title, 
  description, 
  progress, 
  status, 
  fundingGoal,
  currentFunding,
  projectId
}: ProjectCardProps) {
  return (
    <Link to={`/investor/projects/${projectId}`}>
      <Card className="p-6 hover:shadow-md transition-all h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          <Badge variant={
            status === 'approved' ? 'default' :
            status === 'active' ? 'default' :
            status === 'pending' ? 'secondary' :
            'destructive'
          } className="mr-4 whitespace-nowrap">
            {status === 'approved' || status === 'active' ? 'نشط' :
             status === 'pending' ? 'قيد المراجعة' :
             'مغلق'}
          </Badge>
        </div>
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">التمويل الحالي: {formatCurrency(currentFunding)}</span>
            <span className="font-medium">الهدف: {formatCurrency(fundingGoal)}</span>
          </div>
          <div className="text-sm text-right text-muted-foreground">
            نسبة الإنجاز: {Math.round(progress)}%
          </div>
        </div>
      </Card>
    </Link>
  )
}