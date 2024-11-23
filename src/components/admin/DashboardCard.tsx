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
        "hover:shadow-lg transition-all duration-300 cursor-pointer",
        loading && "animate-pulse",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
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