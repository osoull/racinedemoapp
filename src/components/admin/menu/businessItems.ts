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
    title: "المعاملات المالية",
    icon: Wallet,
    path: "/admin/transactions",
    description: "متابعة وإدارة المعاملات المالية",
    subItems: [
      {
        title: "الإيداعات",
        path: "/admin/transactions/deposits",
        icon: Banknote
      },
      {
        title: "السحوبات",
        path: "/admin/transactions/withdrawals",
        icon: Wallet
      }
    ]
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