import { Json } from './json'
import {
  BankAccountsTable,
  BankTransactionsTable,
  BorrowerKYCTable,
  CommissionsTable,
  FeeTrackingTable,
  FundingRequestCommentsTable,
  FundingRequestDocumentsTable,
  FundingRequestStatusHistoryTable,
  FundingRequestsTable,
  InvestmentOpportunitiesTable,
  InvestorKYCTable,
  KYCDocumentsTable,
  KYCStatusHistoryTable,
  NotificationsTable,
  PlatformLicensesTable,
  PlatformSettingsTable,
  PlatformStatisticsTable,
  ProfilesTable,
  RegulatoryReportsTable,
  StripePaymentsTable,
  TransactionsTable
} from './tables'
import { DatabaseFunctions } from './functions'
import { DatabaseEnums } from './enums'

export interface Database {
  public: {
    Tables: {
      bank_accounts: BankAccountsTable
      bank_transactions: BankTransactionsTable
      borrower_kyc: BorrowerKYCTable
      commissions: CommissionsTable
      fee_tracking: FeeTrackingTable
      funding_request_comments: FundingRequestCommentsTable
      funding_request_documents: FundingRequestDocumentsTable
      funding_request_status_history: FundingRequestStatusHistoryTable
      funding_requests: FundingRequestsTable
      investment_opportunities: InvestmentOpportunitiesTable
      investor_kyc: InvestorKYCTable
      kyc_documents: KYCDocumentsTable
      kyc_status_history: KYCStatusHistoryTable
      notifications: NotificationsTable
      platform_licenses: PlatformLicensesTable
      platform_settings: PlatformSettingsTable
      platform_statistics: PlatformStatisticsTable
      profiles: ProfilesTable
      regulatory_reports: RegulatoryReportsTable
      stripe_payments: StripePaymentsTable
      transactions: TransactionsTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: DatabaseFunctions
    Enums: DatabaseEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export * from './tables'
export * from './functions'
export * from './enums'