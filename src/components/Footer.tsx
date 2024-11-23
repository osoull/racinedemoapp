import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <img src="/logo-white.svg" alt="رسين للاستثمار" className="h-8 mb-4" />
            <p className="text-white/80 mb-4">
              منصة تمويل جماعي مرخصة من هيئة السوق المالية
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" className="hover:text-secondary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="hover:text-secondary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" className="hover:text-secondary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="hover:text-secondary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-secondary">من نحن</Link></li>
              <li><Link to="/team" className="hover:text-secondary">فريق العمل</Link></li>
              <li><Link to="/careers" className="hover:text-secondary">الوظائف</Link></li>
              <li><Link to="/blog" className="hover:text-secondary">المدونة</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4 text-lg">خدماتنا</h3>
            <ul className="space-y-2">
              <li><Link to="/investment" className="hover:text-secondary">الاستثمار</Link></li>
              <li><Link to="/funding" className="hover:text-secondary">التمويل</Link></li>
              <li><Link to="/projects" className="hover:text-secondary">المشاريع</Link></li>
              <li><Link to="/faq" className="hover:text-secondary">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-lg">تواصل معنا</h3>
            <ul className="space-y-2 text-white/80">
              <li>الرياض، المملكة العربية السعودية</li>
              <li>صندوق بريد: 12345</li>
              <li>هاتف: 966-11-000-0000</li>
              <li>البريد الإلكتروني: info@racine.sa</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} رسين للاستثمار. جميع الحقوق محفوظة
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="hover:text-secondary">سياسة الخصوصية</Link>
              <Link to="/terms" className="hover:text-secondary">الشروط والأحكام</Link>
              <Link to="/licenses" className="hover:text-secondary">التراخيص</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;