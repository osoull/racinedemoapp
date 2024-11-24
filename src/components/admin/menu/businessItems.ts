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

const projectManagementItems = [
  {
    title: "المشاريع الجديدة",
    path: "/admin/projects/new",
    icon: FileText,
    description: "إدارة المشاريع الجديدة"
  },
  {
    title: "المشاريع النشطة",
    path: "/admin/projects/active",
    icon: FileSpreadsheet,
    description: "متابعة المشاريع النشطة"
  },
  {
    title: "المشاريع المكتملة",
    path: "/admin/projects/completed",
    icon: FileCheck,
    description: "عرض المشاريع المكتملة"
  }
];

const transactionItems = [
  {
    title: "الإيداعات",
    path: "/admin/transactions/deposits",
    icon: Banknote,
    description: "إدارة الإيداعات"
  },
  {
    title: "السحوبات",
    path: "/admin/transactions/withdrawals",
    icon: Wallet,
    description: "إدارة السحوبات"
  }
];

const complianceItems = [
  {
    title: "التحقق من الهوية",
    path: "/admin/compliance/kyc",
    icon: FileSearch,
    description: "إدارة عمليات KYC"
  },
  {
    title: "المراجعة الشرعية",
    path: "/admin/compliance/sharia",
    icon: Building,
    description: "إدارة المراجعة الشرعية"
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
    description: "مراجعة وإدارة المشاريع المقدمة",
    subItems: projectManagementItems
  },
  {
    title: "المعاملات المالية",
    icon: Wallet,
    path: "/admin/transactions",
    description: "متابعة وإدارة المعاملات المالية",
    subItems: transactionItems
  },
  {
    title: "التحقق والامتثال",
    icon: GraduationCap,
    path: "/admin/compliance",
    description: "إدارة التحقق والامتثال",
    subItems: complianceItems
  }
];