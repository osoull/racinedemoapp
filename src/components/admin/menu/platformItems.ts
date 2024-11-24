import {
  Settings2,
  Wallet,
  FileText,
  Shield,
  PieChart,
  Building2,
  Percent,
  ScrollText,
  ShieldCheck,
  BarChart
} from "lucide-react";

export const platformSettingsItems = [
  {
    title: "عام",
    icon: Settings2,
    path: "/admin/settings/general",
    description: "الإعدادات العامة للمنصة"
  },
  {
    title: "العمولات",
    icon: Percent,
    path: "/admin/settings/commissions",
    description: "إدارة العمولات والرسوم"
  },
  {
    title: "الحساب البنكي",
    icon: Building2,
    path: "/admin/settings/bank",
    description: "إدارة الحسابات البنكية"
  },
  {
    title: "التحقق من الهوية",
    icon: ShieldCheck,
    path: "/admin/settings/kyc",
    description: "إدارة عمليات KYC"
  },
  {
    title: "متطلبات هيئة السوق المالية",
    icon: ScrollText,
    path: "/admin/settings/cma",
    description: "متابعة متطلبات CMA"
  },
  {
    title: "تقارير الأداء",
    icon: BarChart,
    path: "/admin/settings/performance",
    description: "تقارير أداء المنصة"
  },
  {
    title: "تقارير مالية",
    icon: PieChart,
    path: "/admin/settings/financial",
    description: "التقارير المالية"
  }
];