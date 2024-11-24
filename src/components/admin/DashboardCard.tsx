import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  path?: string
  value?: string | number
  loading?: boolean
}

const DashboardCard = ({ 
  icon: Icon, 
  title, 
  description, 
  className,
  path,
  value,
  loading = false
}: DashboardCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) {
      navigate(path)
    }
  }

  return (
    <Card 
      className={cn(
        "dashboard-card cursor-pointer group",
        loading && "animate-pulse",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary-50 p-3 group-hover:bg-primary-100 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            {value && (
              <p className="text-xl font-bold text-primary mt-2">{value}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardCard