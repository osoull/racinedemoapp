import {
  Scale,
  PieChart,
  MessageSquare,
  Settings,
  FileText,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Settings2,
  ShieldCheck,
  Wallet
} from "lucide-react";

export const platformSettingsItems = [
  {
    title: "إدارة العمولات",
    icon: Scale,
    path: "/admin/platform-settings/commissions",
    description: "تكوين وتتبع العمولات"
  },
  {
    title: "التقارير",
    icon: PieChart,
    path: "/admin/platform-settings/reports",
    description: "تقارير وإحصائيات المنصة",
    subItems: [
      {
        title: "تقارير الأداء",
        path: "/admin/platform-settings/reports/performance",
        icon: FileText
      },
      {
        title: "تقارير المخاطر",
        path: "/admin/platform-settings/reports/risk",
        icon: AlertCircle
      },
      {
        title: "تقارير الامتثال",
        path: "/admin/platform-settings/reports/compliance",
        icon: BookOpen
      }
    ]
  },
  {
    title: "الدعم الفني",
    icon: MessageSquare,
    path: "/admin/platform-settings/support",
    description: "إدارة طلبات الدعم الفني",
    subItems: [
      {
        title: "التذاكر الجديدة",
        path: "/admin/platform-settings/support/new",
        icon: HelpCircle
      },
      {
        title: "التذاكر المفتوحة",
        path: "/admin/platform-settings/support/open",
        icon: MessageSquare
      }
    ]
  },
  {
    title: "إعدادات عامة",
    icon: Settings2,
    path: "/admin/platform-settings/general",
    description: "إدارة إعدادات المنصة",
    subItems: [
      {
        title: "إعدادات الأمان",
        path: "/admin/platform-settings/general/security",
        icon: ShieldCheck
      },
      {
        title: "إعدادات المدفوعات",
        path: "/admin/platform-settings/general/payments",
        icon: Wallet
      }
    ]
  }
];