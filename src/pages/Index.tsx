import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Users, DollarSign, ChartBar, Handshake, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              رسين للاستثمار
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              منصة تمويل جماعي متوافقة مع الشريعة الإسلامية تربط المشاريع المبتكرة بالمستثمرين الأخلاقيين
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-600 text-white">
                <ArrowRight className="ml-2 h-5 w-5" />
                ابدأ الاستثمار
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ArrowRight className="ml-2 h-5 w-5" />
                قدم مشروعك
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-white to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
              <h3 className="text-4xl font-bold text-primary mb-2">+500</h3>
              <p className="text-gray-600">مشروع ممول</p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
              <h3 className="text-4xl font-bold text-primary mb-2">10,000+</h3>
              <p className="text-gray-600">مستثمر نشط</p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
              <h3 className="text-4xl font-bold text-primary mb-2">200M+</h3>
              <p className="text-gray-600">ريال سعودي تم استثمارها</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">لماذا تختار راسين للاستثمار؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-primary/5">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">متوافق مع الشريعة</h3>
              <p className="text-gray-600 leading-relaxed">
                جميع الاستثمارات تخضع للتدقيق للتأكد من توافقها مع مبادئ التمويل الإسلامي
              </p>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-primary/5">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">مجتمع موثوق</h3>
              <p className="text-gray-600 leading-relaxed">
                انضم إلى مجتمع متنامي من المستثمرين الأخلاقيين ورواد الأعمال المبتكرين
              </p>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-primary/5">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">رسوم شفافة</h3>
              <p className="text-gray-600 leading-relaxed">
                هيكل عمولات واضح وتنافسي بدون رسوم خفية
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">كيف تبدأ الاستثمار؟</h2>
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { icon: BookOpen, title: "سجل حساب", desc: "أنشئ حسابك في دقائق" },
              { icon: ChartBar, title: "اختر مشروعك", desc: "تصفح المشاريع المتاحة" },
              { icon: DollarSign, title: "استثمر", desc: "اختر مبلغ استثمارك" },
              { icon: Handshake, title: "اجني الأرباح", desc: "استلم عوائدك الدورية" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <item.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            ابدأ رحلة الاستثمار الآن
          </h2>
          <p className="text-xl mb-10 text-white/90">
            انضم إلى آلاف المستثمرين في منصة راسين للاستثمار
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all">
            <ArrowRight className="ml-2 h-5 w-5" />
            سجل الآن
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;