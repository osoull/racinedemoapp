import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { BorrowerProfile } from "./details/BorrowerProfile"
import { BorrowerDocuments } from "./details/BorrowerDocuments"
import { BorrowerFundingHistory } from "./details/BorrowerFundingHistory"
import { BorrowerFinancials } from "./details/BorrowerFinancials"

interface BorrowerDetailsDialogProps {
  borrowerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BorrowerDetailsDialog({ 
  borrowerId, 
  open, 
  onOpenChange 
}: BorrowerDetailsDialogProps) {
  const { data: borrower, isLoading } = useQuery({
    queryKey: ["borrower-details", borrowerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          borrower_kyc (*),
          kyc_documents (*)
        `)
        .eq("id", borrowerId)
        .single()

      if (error) throw error
      return data
    },
    enabled: open,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>تفاصيل المقترض</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : borrower ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
              <TabsTrigger value="documents">المستندات</TabsTrigger>
              <TabsTrigger value="funding">طلبات التمويل</TabsTrigger>
              <TabsTrigger value="financials">المعاملات المالية</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <BorrowerProfile borrower={borrower} />
            </TabsContent>

            <TabsContent value="documents">
              <BorrowerDocuments borrower={borrower} />
            </TabsContent>

            <TabsContent value="funding">
              <BorrowerFundingHistory borrowerId={borrowerId} />
            </TabsContent>

            <TabsContent value="financials">
              <BorrowerFinancials borrowerId={borrowerId} />
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}