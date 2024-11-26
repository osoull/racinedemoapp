import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const TransactionTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>رقم المعاملة</TableHead>
        <TableHead>المستخدم</TableHead>
        <TableHead>نوع المعاملة</TableHead>
        <TableHead>المبلغ الأساسي</TableHead>
        <TableHead>تفاصيل الرسوم</TableHead>
        <TableHead>إجمالي المعاملة</TableHead>
        <TableHead>الحالة</TableHead>
        <TableHead>التاريخ</TableHead>
        <TableHead>الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
  )
}