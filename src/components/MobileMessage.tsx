import { Download } from "lucide-react"
import { Button } from "./ui/button"

export function MobileMessage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <img src="/logo.svg" alt="رسين" className="h-12 mx-auto" />
        <h1 className="text-2xl font-bold text-primary">رسين للاستثمار</h1>
        <p className="text-muted-foreground">
          لتجربة أفضل، يرجى تحميل تطبيق رسين للاستثمار على هاتفك المحمول
        </p>
        <div className="space-y-3">
          <Button className="w-full">
            <Download className="ml-2 h-4 w-4" />
            تحميل التطبيق
          </Button>
          <p className="text-sm text-muted-foreground">
            متوفر على متجر آبل ومتجر قوقل بلاي
          </p>
        </div>
      </div>
    </div>
  )
}