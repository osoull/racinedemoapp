import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Index() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16 text-right">
        <div className="flex flex-col items-center justify-center space-y-12">
          {/* Logo and Hero Section */}
          <img 
            src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
            alt="Racine Investment" 
            className="w-64 md:w-72 lg:w-80 object-contain" 
          />
          
          <div className="max-w-3xl text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900">
              منصة رسين للاستثمار
            </h1>
            <p className="text-xl text-gray-600">
              منصة تمويل جماعي متوافقة مع الشريعة الإسلامية
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="min-w-[200px] bg-primary hover:bg-primary/90"
              onClick={() => navigate("/auth")}
            >
              تسجيل الدخول
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="min-w-[200px]"
              onClick={() => navigate("/auth")}
            >
              إنشاء حساب
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">تمويل إسلامي</h3>
              <p className="text-gray-600">تمويل متوافق مع أحكام الشريعة الإسلامية</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">منصة آمنة</h3>
              <p className="text-gray-600">منصة مرخصة من البنك المركزي السعودي</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">سرعة التنفيذ</h3>
              <p className="text-gray-600">إجراءات سريعة وسهلة للتمويل والاستثمار</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}