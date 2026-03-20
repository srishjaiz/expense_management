export type FieldType = "text" | "number" | "date" | "textarea" | "select" | "multiselect";

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  defaultValue?: unknown;
  helpText?: string;
  gridSpan?: 1 | 2; // for 2-column layouts
}

export interface FormConfig {
  title: string;
  fields: FormFieldConfig[];
}
