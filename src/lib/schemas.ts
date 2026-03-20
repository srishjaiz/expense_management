import { z } from "zod";

export const expenseCategories = [
  "travel",
  "meals",
  "accommodation",
  "transport",
  "supplies",
  "equipment",
  "other",
] as const;

export const expenseStatuses = ["pending", "submitted", "approved", "rejected"] as const;

export const reportStatuses = ["draft", "submitted", "under_review", "approved", "rejected"] as const;

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  amount: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Amount must be greater than 0")
  ),
  currency: z.string().min(1, "Currency is required"),
  category: z.enum(expenseCategories, { message: "Please select a category" }),
  date: z.string().min(1, "Date is required"),
  description: z.string().max(500, "Description too long").optional(),
  receipt: z.string().optional(),
});

export const expenseReportSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  periodStart: z.string().min(1, "Period start date is required"),
  periodEnd: z.string().min(1, "Period end date is required"),
  expenseIds: z.array(z.string()).min(1, "Select at least one expense"),
  currency: z.string().min(1, "Currency is required"),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type ExpenseReportFormData = z.infer<typeof expenseReportSchema>;
