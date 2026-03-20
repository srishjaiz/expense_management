"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useExpenses } from "@/contexts/ExpenseContext";
import { expenseSchema } from "@/lib/schemas";
import { expenseFormConfig } from "@/lib/mockApi";
import { DynamicForm } from "@/components/ui/DynamicForm";
import { ReceiptOCR, ExtractedReceiptData } from "@/components/ui/ReceiptOCR";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewExpense() {
  const router = useRouter();
  const { addExpense } = useExpenses();
  const [showOCR, setShowOCR] = useState(false);

  // Build zod schema dynamically from config
  const formSchema = useMemo(() => expenseSchema, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "USD",
    },
  });

  const handleOCRExtract = (data: ExtractedReceiptData) => {
    if (data.title) setValue("title", data.title);
    if (data.amount) setValue("amount", data.amount);
    if (data.date) setValue("date", data.date);
  };

  const onSubmit = (data: Record<string, unknown>) => {
    addExpense({
      title: data.title as string,
      amount: data.amount as number,
      currency: data.currency as string,
      category: data.category as
        | "travel"
        | "meals"
        | "accommodation"
        | "transport"
        | "supplies"
        | "equipment"
        | "other",
      date: data.date as string,
      description: (data.description as string) || "",
      receipt: data.receipt as string | undefined,
    });
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Expense</h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowOCR(!showOCR)}
        >
          {showOCR ? "Hide" : "Scan Receipt"}
        </Button>
      </div>

      {showOCR && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceiptOCR onExtract={handleOCRExtract} />
          </CardContent>
        </Card>
      )}

      <DynamicForm
        title={expenseFormConfig.title}
        fields={expenseFormConfig.fields}
        control={control as never}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onCancel={() => router.back()}
        submitLabel="Save Expense"
        cancelLabel="Cancel"
      />
    </div>
  );
}
