/**
 * Props for a generic dialog component that handles creating or editing items of type T.
 *
 * @template T - The type of the data item managed by the dialog.
 */
export interface BaseDialogProps<T> {
  /**
   * Controls the visibility of the dialog.
   *
   * @remarks
   * When `true`, the dialog is rendered and visible. When `false`, it is hidden.
   */
  open: boolean;

  /**
   * Callback invoked to request the dialog be closed.
   *
   * @remarks
   * Should be called when the user cancels or after a successful submission.
   */
  onClose: () => void;

  /**
   * Callback invoked when the form within the dialog is submitted.
   *
   * @param item - The data item of type T collected from the dialog form.
   * @returns A promise that resolves when the submission handling is complete.
   */
  onSubmit: (item: T) => Promise<void>;

  /**
   * The initial data to populate the form, for edit scenarios.
   *
   * @remarks
   * If `undefined` or `null`, the dialog should initialize form fields to empty/default values for a create scenario.
   */
  initialData?: T | null;

  /**
   * Configuration for the dialog’s form fields and validation logic.
   */
  config: DialogConfig<T>;
}

/**
 * Configuration for an individual form field.
 *
 * @typeParam T - The entity type/interface containing this field
 */
export interface FormFieldConfig<T> {
  /** Name/key of the field in the data object */
  name: keyof T;

  /** Display label for the field */
  label: string;

  /** Input type (text, email, checkbox, etc.) */
  type?: "text" | "email" | "password" | "number" | "checkbox" | "tel" | "date";

  /** Whether the field is required */
  required?: boolean;

  /** Whether the field should take full width */
  fullWidth?: boolean;

  /** Whether the field should auto-focus */
  autoFocus?: boolean;
}

/**
 * Configuration for the form dialog component.
 *
 * @typeParam T - The entity type/interface being edited in the form
 */
export interface DialogConfig<T> {
  /** Array of form field configurations */
  fields: FormFieldConfig<T>[];

  /** Validation function for form data */
  validate: (item: T) => { isValid: boolean; errors: Record<string, string> };

  /** Function that returns the dialog title based on edit mode */
  title: (isEdit: boolean) => string;

  /** Function that returns the submit button text based on edit mode */
  submitText: (isEdit: boolean) => string;
}
