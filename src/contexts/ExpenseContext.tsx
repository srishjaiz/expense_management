"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Expense, ExpenseReport } from "@/lib/types";

interface ExpenseContextType {
  expenses: Expense[];
  reports: ExpenseReport[];
  addExpense: (expense: Omit<Expense, "id" | "createdAt" | "status">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addReport: (
    report: Omit<ExpenseReport, "id" | "createdAt" | "status" | "totalAmount">,
  ) => void;
  updateReport: (id: string, report: Partial<ExpenseReport>) => void;
  deleteReport: (id: string) => void;
  submitReport: (id: string) => void;
  getExpensesByIds: (ids: string[]) => Expense[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reports, setReports] = useState<ExpenseReport[]>([]);

  const addExpense = useCallback(
    (expense: Omit<Expense, "id" | "createdAt" | "status">) => {
      const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [...prev, newExpense]);
    },
    [],
  );

  const updateExpense = useCallback((id: string, expense: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...expense } : e)),
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addReport = useCallback(
    (
      report: Omit<
        ExpenseReport,
        "id" | "createdAt" | "status" | "totalAmount"
      >,
    ) => {
      const reportExpenses = expenses.filter((e) =>
        report.expenseIds.includes(e.id),
      );
      const totalAmount = reportExpenses.reduce((sum, e) => sum + e.amount, 0);
      const newReport: ExpenseReport = {
        ...report,
        id: crypto.randomUUID(),
        totalAmount,
        status: "draft",
        createdAt: new Date().toISOString(),
      };
      setReports((prev) => [...prev, newReport]);
    },
    [expenses],
  );

  const updateReport = useCallback(
    (id: string, report: Partial<ExpenseReport>) => {
      setReports((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const updated = { ...r, ...report };
            if (report.expenseIds) {
              const reportExpenses = expenses.filter((e) =>
                report.expenseIds!.includes(e.id),
              );
              updated.totalAmount = reportExpenses.reduce(
                (sum, e) => sum + e.amount,
                0,
              );
            }
            return updated;
          }
          return r;
        }),
      );
    },
    [expenses],
  );

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const submitReport = useCallback((id: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "submitted" as const,
              submittedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
  }, []);

  const getExpensesByIds = useCallback(
    (ids: string[]) => {
      return expenses.filter((e) => ids.includes(e.id));
    },
    [expenses],
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        reports,
        addExpense,
        updateExpense,
        deleteExpense,
        addReport,
        updateReport,
        deleteReport,
        submitReport,
        getExpensesByIds,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
