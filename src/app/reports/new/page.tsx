"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useExpenses } from "@/contexts/ExpenseContext";
import { expenseReportSchema } from "@/lib/schemas";
import { reportFormConfig } from "@/lib/mockApi";
import { DynamicForm } from "@/components/ui/DynamicForm";

export default function NewReport() {
  const router = useRouter();
  const { expenses, addReport } = useExpenses();

  const availableExpenses = expenses.filter((e) => e.status === "pending");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseReportSchema),
    defaultValues: {
      currency: "USD",
      expenseIds: [],
    },
  });

  const selectedExpenseIds = watch("expenseIds") || [];
  const selectedExpenses = expenses.filter((e) =>
    selectedExpenseIds.includes(e.id),
  );
  const totalAmount = selectedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const onSubmit = (data: Record<string, unknown>) => {
    addReport({
      title: data.title as string,
      description: (data.description as string) || "",
      periodStart: data.periodStart as string,
      periodEnd: data.periodEnd as string,
      expenseIds: data.expenseIds as string[],
      currency: data.currency as string,
    });
    router.push("/");
  };

  const expenseSelector = (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Expenses</label>
      {availableExpenses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No pending expenses available. Create expenses first.
        </p>
      ) : (
        <Controller
          control={control}
          name="expenseIds"
          render={({ field }) => (
            <div className="border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
              {availableExpenses.map((expense) => (
                <label
                  key={expense.id}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    checked={field.value?.includes(expense.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), expense.id]);
                      } else {
                        field.onChange(
                          (field.value || []).filter((id) => id !== expense.id),
                        );
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category} •{" "}
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-medium">
                    ${expense.amount.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          )}
        />
      )}
      {errors.expenseIds && (
        <p className="text-sm text-destructive">
          {errors.expenseIds.message as string}
        </p>
      )}
      {selectedExpenses.length > 0 && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="font-medium">
            Total: ${totalAmount.toFixed(2)} {watch("currency")}
          </p>
          <p className="text-sm text-muted-foreground">
            {selectedExpenses.length} expense
            {selectedExpenses.length !== 1 ? "s" : ""} selected
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Expense Report</h1>
      </div>

      <DynamicForm
        title={reportFormConfig.title}
        fields={reportFormConfig.fields}
        control={control as never}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onCancel={() => router.back()}
        submitLabel="Create Report"
        cancelLabel="Cancel"
        extraContent={expenseSelector}
      />
    </div>
  );
}
