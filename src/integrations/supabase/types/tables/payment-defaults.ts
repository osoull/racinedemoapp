import { Database } from "../database";

export type PaymentDefaultsTable = Database["public"]["Tables"]["payment_defaults"];
export type PaymentResolutionPlansTable = Database["public"]["Tables"]["payment_resolution_plans"];
export type ResolutionPlanInstallmentsTable = Database["public"]["Tables"]["resolution_plan_installments"];
export type DefaultActionHistoryTable = Database["public"]["Tables"]["default_action_history"];