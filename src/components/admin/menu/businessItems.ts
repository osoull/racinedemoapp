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
  Building2,
} from "lucide-react";

export const businessMenuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "إدارة المستخدمين",
    icon: Users,
    path: "/admin/users",
    description: "إدارة حسابات المستثمرين وأصحاب المشاريع",
    subItems: [
      {
        title: "المستثمرون",
        path: "/admin/users/investors",
        icon: UserCog
      },
      {
        title: "طالبي التمويل",
        path: "/admin/users/borrowers",
        icon: Building2
      }
    ]
  },
  {
    title: "إدارة المشاريع",
    icon: Briefcase,
    path: "/admin/projects",
    description: "مراجعة وإدارة المشاريع المقدمة",
    subItems: [
      {
        title: "المشاريع الجديدة",
        path: "/admin/projects/new",
        icon: FileText
      },
      {
        title: "المشاريع النشطة",
        path: "/admin/projects/active",
        icon: FileSpreadsheet
      },
      {
        title: "المشاريع المكتملة",
        path: "/admin/projects/completed",
        icon: FileCheck
      }
    ]
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