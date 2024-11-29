import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { KYCFormData } from "@/types/kyc"

export function useKycValidation(kycData: KYCFormData, userId: string) {
  const [isValid, setIsValid] = useState(false)
  const [documentsValid, setDocumentsValid] = useState(false)
  const [loading, setLoading] = useState(true)

  // Valider les documents
  useEffect(() => {
    const checkDocuments = async () => {
      try {
        const { data: documents } = await supabase
          .from("kyc_documents")
          .select("document_type")
          .eq("user_id", userId)

        const requiredTypes = [
          "commercial_register",
          "tax_certificate",
          "articles_of_association",
          "national_address",
          "audited_financials"
        ]

        const uploadedTypes = documents?.map(doc => doc.document_type) || []
        const allRequired = requiredTypes.every(type => uploadedTypes.includes(type))
        
        setDocumentsValid(allRequired)
      } catch (error) {
        console.error("Error checking documents:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      checkDocuments()
    }
  }, [userId])

  // Valider les informations KYC
  useEffect(() => {
    const validateKycData = () => {
      // Validation des informations de la société
      const companyValid = !!(
        kycData.company_registration_date &&
        kycData.company_registration_number &&
        kycData.tax_identification_number &&
        kycData.industry_sector &&
        kycData.company_website &&
        kycData.annual_revenue > 0 &&
        kycData.number_of_employees > 0
      )

      // Validation du représentant légal
      const legalRepValid = !!(
        kycData.legal_representative_name &&
        kycData.legal_representative_id
      )

      // Validation des informations bancaires
      const bankValid = !!(
        kycData.bank_account_details?.bank_name &&
        kycData.bank_account_details?.account_holder_name &&
        kycData.bank_account_details?.iban
      )

      setIsValid(companyValid && legalRepValid && bankValid && documentsValid)
    }

    validateKycData()
  }, [kycData, documentsValid])

  return { isValid, loading }
}