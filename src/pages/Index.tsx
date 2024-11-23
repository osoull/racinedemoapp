import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Users, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              راسين للاستثمار
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              منصة تمويل جماعي متوافقة مع الشريعة الإسلامية تربط المشاريع المبتكرة بالمستثمرين الأخلاقيين
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="btn-primary">
                <ArrowRight className="ml-2 h-4 w-4" />
                ابدأ الاستثمار
              </Button>
              <Button className="btn-secondary">
                <ArrowRight className="ml-2 h-4 w-4" />
                قدم مشروعك
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">لماذا تختار راسين للاستثمار؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 card-hover">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">متوافق مع الشريعة</h3>
              <p className="text-gray-600">
                جميع الاستثمارات تخضع للتدقيق للتأكد من توافقها مع مبادئ التمويل الإسلامي
              </p>
            </Card>
            <Card className="p-6 card-hover">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">مجتمع موثوق</h3>
              <p className="text-gray-600">
                انضم إلى مجتمع متنامي من المستثمرين الأخلاقيين ورواد الأعمال المبتكرين
              </p>
            </Card>
            <Card className="p-6 card-hover">
              <DollarSign className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">رسوم شفافة</h3>
              <p className="text-gray-600">
                هيكل عمولات واضح وتنافسي بدون رسوم خفية
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;