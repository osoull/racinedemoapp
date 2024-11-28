import {
  LayoutDashboard,
  Users,
  Wallet,
  GraduationCap,
  FileText,
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
    title: "الإدارة المالية",
    icon: Wallet,
    path: "/admin/finance",
    description: "إدارة المعاملات والتقارير المالية"
  },
  {
    title: "المستثمرين",
    icon: Users,
    path: "/admin/investors",
    description: "إدارة المستثمرين",
    subItems: investorManagementItems
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
        icon: FileText
      },
      {
        title: "المراجعة الشرعية",
        path: "/admin/compliance/sharia",
        icon: Building
      }
    ]
  }
];