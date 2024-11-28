import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BorrowerDetailsDialog } from "./BorrowerDetailsDialog"
import { useState } from "react"

export function BorrowerManagement() {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(null)

  const { data: borrowers, isLoading } = useQuery({
    queryKey: ["borrowers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          borrower_kyc (*)
        `)
        .eq("user_type", "borrower")

      if (error) throw error
      return data
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إدارة المقترضين</h2>
        <p className="text-muted-foreground">
          إدارة ومراقبة المقترضين في المنصة
        </p>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {borrowers?.map((borrower) => (
              <div 
                key={borrower.id} 
                className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
                onClick={() => setSelectedBorrowerId(borrower.id)}
              >
                <h3 className="font-medium">{borrower.company_name || `${borrower.first_name} ${borrower.last_name}`}</h3>
                <p className="text-sm text-muted-foreground">{borrower.email}</p>
              </div>
            ))}

            {borrowers?.map((borrower) => (
              <BorrowerDetailsDialog 
                key={borrower.id}
                borrowerId={borrower.id}
                open={selectedBorrowerId === borrower.id}
                onOpenChange={(open) => {
                  if (!open) setSelectedBorrowerId(null)
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}