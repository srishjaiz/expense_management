"use client";

import { Control, FieldErrors, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormFieldConfig } from "@/lib/formTypes";
import { cn } from "@/lib/utils";

interface DynamicFormFieldProps {
  config: FormFieldConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
}

export function DynamicFormField({ config, control, errors }: DynamicFormFieldProps) {
  const { field } = useController({
    name: config.name,
    control,
    defaultValue: config.defaultValue,
  });

  const error = errors[config.name];
  const errorMessage = error?.message as string | undefined;

  const renderInput = () => {
    switch (config.type) {
      case "text":
      case "number":
        return (
          <Input
            id={config.name}
            type={config.type}
            step={config.type === "number" ? "0.01" : undefined}
            placeholder={config.placeholder}
            value={field.value as string || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        );

      case "date":
        return (
          <Input
            id={config.name}
            type="date"
            value={field.value as string || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        );

      case "textarea":
        return (
          <textarea
            id={config.name}
            placeholder={config.placeholder}
            value={field.value as string || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref as React.Ref<HTMLTextAreaElement>}
            className="w-full min-h-20 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        );

      case "select":
        return (
          <select
            id={config.name}
            value={field.value as string || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref as React.Ref<HTMLSelectElement>}
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select {config.label.toLowerCase()}</option>
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
            {config.options?.map((opt) => {
              const values = (field.value as string[]) || [];
              const checked = values.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...values, opt.value]);
                      } else {
                        field.onChange(values.filter((v) => v !== opt.value));
                      }
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "space-y-2",
        config.gridSpan === 2 && "col-span-2"
      )}
    >
      <Label htmlFor={config.name}>
        {config.label}
        {config.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
      {config.helpText && (
        <p className="text-xs text-muted-foreground">{config.helpText}</p>
      )}
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
