import {
  LayoutDashboard,
  Users,
  Wallet,
  GraduationCap,
  FileText,
  FileSpreadsheet,
  FileCheck,
  Banknote,
  FileSearch,
  Building,
  UserCog,
  Receipt,
  PieChart,
  ArrowLeftRight,
} from "lucide-react";

const investorManagementItems = [
  {
    title: "جميع المستثمرين",
    path: "/admin/investors",
    icon: Users,
    description: "عرض وإدارة جميع المستثمرين"
  },
  {
    title: "المستثمرون المؤهلون",
    path: "/admin/investors/qualified",
    icon: UserCog,
    description: "إدارة المستثمرين المؤهلين"
  },
  {
    title: "المستثمرون الأساسيون",
    path: "/admin/investors/basic",
    icon: Users,
    description: "إدارة المستثمرين الأساسيين"
  }
];

const financeManagementItems = [
  {
    title: "نظرة عامة",
    path: "/admin/finance/overview",
    icon: PieChart,
    description: "نظرة عامة على الأداء المالي"
  },
  {
    title: "المعاملات",
    path: "/admin/finance/transactions",
    icon: ArrowLeftRight,
    description: "إدارة جميع المعاملات المالية"
  },
  {
    title: "الرسوم الإدارية",
    path: "/admin/finance/fees",
    icon: Receipt,
    description: "إدارة الرسوم الإدارية"
  },
  {
    title: "التقارير المالية",
    path: "/admin/finance/reports",
    icon: FileSpreadsheet,
    description: "عرض وتصدير التقارير المالية"
  }
];

export const businessMenuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "إدارة المستثمرين",
    icon: Users,
    path: "/admin/investors",
    description: "إدارة حسابات المستثمرين",
    subItems: investorManagementItems
  },
  {
    title: "الإدارة المالية",
    icon: Wallet,
    path: "/admin/finance",
    description: "إدارة المعاملات والتقارير المالية",
    subItems: financeManagementItems
  },
  {
    title: "التحقق والامتثال",
    icon: GraduationCap,
    path: "/admin/compliance",
    description: "إدارة التحقق والامتثال",
    subItems: [
      {
        title: "التحقق من الهوية",
        path: "/admin/compliance/kyc",
        icon: FileSearch
      },
      {
        title: "المراجعة الشرعية",
        path: "/admin/compliance/sharia",
        icon: Building
      }
    ]
  }
];