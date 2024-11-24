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
    path: "/admin/platform-settings/general",
    description: "الإعدادات العامة للمنصة"
  },
  {
    title: "العمولات",
    icon: Percent,
    path: "/admin/platform-settings/commissions",
    description: "إدارة العمولات والرسوم"
  },
  {
    title: "الحساب البنكي",
    icon: Building2,
    path: "/admin/platform-settings/bank",
    description: "إدارة الحسابات البنكية"
  },
  {
    title: "الامتثال",
    icon: Shield,
    path: "/admin/platform-settings/compliance",
    description: "إدارة الامتثال والتحقق",
    subItems: [
      {
        title: "التحقق من الهوية",
        path: "/admin/platform-settings/compliance/kyc",
        icon: ShieldCheck,
        description: "إدارة عمليات KYC"
      },
      {
        title: "متطلبات هيئة السوق المالية",
        path: "/admin/platform-settings/compliance/cma",
        icon: ScrollText,
        description: "متابعة متطلبات CMA"
      }
    ]
  },
  {
    title: "التقارير",
    icon: FileText,
    path: "/admin/platform-settings/reports",
    description: "التقارير والإحصائيات",
    subItems: [
      {
        title: "تقارير الأداء",
        path: "/admin/platform-settings/reports/performance",
        icon: BarChart,
        description: "تقارير أداء المنصة"
      },
      {
        title: "تقارير مالية",
        path: "/admin/platform-settings/reports/financial",
        icon: PieChart,
        description: "التقارير المالية"
      }
    ]
  }
];