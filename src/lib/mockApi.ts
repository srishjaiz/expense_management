import { FormConfig } from "./formTypes";
import { expenseCategories } from "./schemas";

export const expenseFormConfig: FormConfig = {
  title: "Expense Details",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "e.g., Business Lunch",
      required: true,
      gridSpan: 2,
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      placeholder: "0.00",
      required: true,
      gridSpan: 1,
    },
    {
      name: "currency",
      label: "Currency",
      type: "text",
      placeholder: "USD",
      required: true,
      defaultValue: "USD",
      gridSpan: 1,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: expenseCategories.map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
      gridSpan: 1,
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
      gridSpan: 1,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Additional details...",
      required: false,
      gridSpan: 2,
    },
  ],
};

export const reportFormConfig: FormConfig = {
  title: "Report Details",
  fields: [
    {
      name: "title",
      label: "Report Title",
      type: "text",
      placeholder: "e.g., Q1 Travel Expenses",
      required: true,
      gridSpan: 2,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Summary of expenses...",
      required: false,
      gridSpan: 2,
    },
    {
      name: "periodStart",
      label: "Period Start",
      type: "date",
      required: true,
      gridSpan: 1,
    },
    {
      name: "periodEnd",
      label: "Period End",
      type: "date",
      required: true,
      gridSpan: 1,
    },
    {
      name: "currency",
      label: "Currency",
      type: "text",
      placeholder: "USD",
      required: true,
      defaultValue: "USD",
      gridSpan: 1,
    },
  ],
};

// Simulates fetching form config from API
export async function getExpenseFormConfig(): Promise<FormConfig> {
  return Promise.resolve(expenseFormConfig);
}

export async function getReportFormConfig(): Promise<FormConfig> {
  return Promise.resolve(reportFormConfig);
}
