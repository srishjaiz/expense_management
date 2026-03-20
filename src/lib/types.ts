export type ExpenseStatus = "pending" | "submitted" | "approved" | "rejected";
export type ExpenseCategory =
  | "travel"
  | "meals"
  | "accommodation"
  | "transport"
  | "supplies"
  | "equipment"
  | "other";

export type ReportStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  description: string;
  receipt?: string;
  status: ExpenseStatus;
  createdAt: string;
}

export interface ExpenseReport {
  id: string;
  title: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  expenseIds: string[];
  totalAmount: number;
  currency: string;
  status: ReportStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  createdAt: string;
}
