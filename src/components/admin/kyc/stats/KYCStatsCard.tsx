import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface KYCStatsCardProps {
  title: string
  value: number | undefined
  isLoading: boolean
}

export function KYCStatsCard({ title, value, isLoading }: KYCStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            value || 0
          )}
        </p>
      </CardContent>
    </Card>
  )
}