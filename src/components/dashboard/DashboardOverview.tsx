import { Card } from "@/components/ui/card"
import { Users, FileText, Activity, Wallet, TrendingUp } from "lucide-react"
import { ActivityFeed } from "./activity/ActivityFeed"
import { StatsGrid } from "./stats/StatsGrid"
import { FundingChart } from "./charts/FundingChart"

export function DashboardOverview() {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">نظرة عامة على المنصة</h2>
        <StatsGrid />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Chart Section - Spans 4 columns */}
        <Card className="p-4 lg:p-6 lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">تحليل التمويل</h3>
            <select className="text-sm border rounded-md px-2 py-1">
              <option value="week">آخر 7 أيام</option>
              <option value="month">آخر 30 يوم</option>
              <option value="year">هذه السنة</option>
            </select>
          </div>
          <div className="h-[280px]">
            <FundingChart />
          </div>
        </Card>

        {/* Activity Feed Section - Spans 3 columns */}
        <Card className="p-4 lg:p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">النشاط الأخير</h3>
            <button className="text-primary text-sm hover:underline">
              عرض الكل
            </button>
          </div>
          <div className="h-[280px] overflow-auto">
            <ActivityFeed />
          </div>
        </Card>
      </div>

      {/* Projects Overview */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active Projects */}
        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">المشاريع النشطة</h3>
            <span className="text-sm text-muted-foreground">12 مشروع</span>
          </div>
          <div className="space-y-3">
            {/* Project Items */}
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <h4 className="font-medium">مشروع تقني مبتكر {index + 1}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>تم جمع: 75,000 ريال</span>
                    <span>•</span>
                    <span>الهدف: 100,000 ريال</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded-full bg-primary-100">
                    <div className="w-3/4 h-full rounded-full bg-primary"></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Investment Opportunities */}
        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">فرص الاستثمار القادمة</h3>
            <span className="text-sm text-muted-foreground">8 فرص جديدة</span>
          </div>
          <div className="space-y-3">
            {/* Opportunity Items */}
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">فرصة استثمارية {index + 1}</h4>
                  <p className="text-sm text-muted-foreground">
                    متوقع الإطلاق خلال {index + 1} أيام
                  </p>
                </div>
                <button className="px-3 py-1 text-sm rounded-md bg-primary-50 text-primary hover:bg-primary-100 transition-colors">
                  تفاصيل
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}