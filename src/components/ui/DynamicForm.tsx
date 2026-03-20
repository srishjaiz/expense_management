"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DynamicFormField } from "./DynamicFormField";
import { FormFieldConfig } from "@/lib/formTypes";

interface DynamicFormProps {
  title: string;
  fields: FormFieldConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: any;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  extraContent?: ReactNode;
}

export function DynamicForm({
  title,
  fields,
  control,
  errors,
  handleSubmit,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  extraContent,
}: DynamicFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <DynamicFormField
                key={field.name}
                config={field}
                control={control}
                errors={errors}
              />
            ))}
          </div>

          {extraContent}

          <div className="flex gap-2 pt-4">
            <Button type="submit">{submitLabel}</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelLabel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
