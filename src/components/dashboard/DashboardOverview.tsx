import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { ActivityFeed } from "./activity/ActivityFeed"
import { StatsGrid } from "./stats/StatsGrid"
import { FundingChart } from "./charts/FundingChart"

export function DashboardOverview() {
  return (
    <div className="space-y-12">
      {/* Stats Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-6">نظرة عامة على المنصة</h2>
        <StatsGrid />
      </section>

      {/* Main Content Grid */}
      <section>
        <div className="grid gap-12">
          {/* Chart Section */}
          <Card className="p-6">
            <FundingChart />
          </Card>

          {/* Projects and Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Projects */}
            <Card className="lg:col-span-2 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-semibold">المشاريع النشطة</h3>
                <span className="text-sm text-muted-foreground">12 مشروع</span>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((_, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-6 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium">مشروع تقني مبتكر {index + 1}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>تم جمع: 75,000 ريال</span>
                        <span>•</span>
                        <span>الهدف: 100,000 ريال</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 rounded-full bg-primary-100">
                        <div className="w-3/4 h-full rounded-full bg-primary"></div>
                      </div>
                      <span className="text-sm font-medium min-w-[3rem] text-left">75%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity Feed */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-semibold">النشاط الأخير</h3>
                <button className="text-primary text-sm hover:underline">
                  عرض الكل
                </button>
              </div>
              <div className="h-[400px] overflow-auto">
                <ActivityFeed />
              </div>
            </Card>
          </div>

          {/* Investment Opportunities */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-semibold">فرص الاستثمار القادمة</h3>
              <span className="text-sm text-muted-foreground">8 فرص جديدة</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, index) => (
                <div 
                  key={index} 
                  className="flex flex-col gap-4 p-6 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">فرصة استثمارية {index + 1}</h4>
                    <p className="text-sm text-muted-foreground">
                      متوقع الإطلاق خلال {index + 1} أيام
                    </p>
                  </div>
                  <button className="mt-auto px-4 py-2 text-sm rounded-md bg-primary-50 text-primary hover:bg-primary-100 transition-colors">
                    تفاصيل
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}