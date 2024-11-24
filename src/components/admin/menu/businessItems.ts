import {
  LayoutDashboard,
  Users,
  Briefcase,
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
    path: "/admin/investors?type=qualified",
    icon: UserCog,
    description: "إدارة المستثمرين المؤهلين"
  },
  {
    title: "المستثمرون الأساسيون",
    path: "/admin/investors?type=basic",
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
    title: "إدارة المشاريع",
    icon: Briefcase,
    path: "/admin/projects",
    description: "مراجعة وإدارة المشاريع المقدمة"
  },
  {
    title: "المعاملات المالية",
    icon: Wallet,
    path: "/admin/transactions",
    description: "متابعة وإدارة المعاملات المالية"
  },
  {
    title: "التحقق والامتثال",
    icon: GraduationCap,
    path: "/admin/compliance",
    description: "إدارة التحقق والامتثال"
  }
];