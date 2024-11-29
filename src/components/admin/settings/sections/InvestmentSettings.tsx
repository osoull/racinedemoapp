import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function InvestmentSettings() {
  return (
    <Card className="border-2 border-muted">
      <CardHeader>
        <CardTitle className="text-2xl text-right">إعدادات الاستثمار</CardTitle>
        <CardDescription className="text-right">
          تكوين حدود وقواعد الاستثمار
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="min-investment" className="text-right">
              الحد الأدنى للاستثمار
            </Label>
            <Input
              id="min-investment"
              type="number"
              defaultValue="1000"
              className="text-right max-w-sm mr-auto"
              dir="ltr"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="max-investment" className="text-right">
              الحد الأقصى للاستثمار
            </Label>
            <Input
              id="max-investment"
              type="number"
              defaultValue="50000"
              className="text-right max-w-sm mr-auto"
              dir="ltr"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}