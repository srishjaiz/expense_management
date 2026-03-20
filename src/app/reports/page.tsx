"use client";

import Link from "next/link";
import { useExpenses } from "@/contexts/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function ReportsList() {
  const { reports, submitReport } = useExpenses();

  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expense Reports</h1>
        <Link href="/reports/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedReports.length === 0 ? (
            <p className="text-muted-foreground">
              No reports yet. Create your first report!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.title}
                    </TableCell>
                    <TableCell>
                      {new Date(report.periodStart).toLocaleDateString()} -{" "}
                      {new Date(report.periodEnd).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{report.expenseIds.length}</TableCell>
                    <TableCell>
                      ${report.totalAmount.toFixed(2)} {report.currency}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{report.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {report.status === "draft" && (
                        <Button
                          size="sm"
                          onClick={() => submitReport(report.id)}
                        >
                          Submit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
