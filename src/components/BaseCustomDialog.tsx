import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import type {
  BaseDialogProps,
  DialogConfig,
  FormFieldConfig,
} from "../types/BaseCustomDialogTypes";

/**
 * Abstract base class for a modal dialog that renders a form to create or edit
 * items of type {@link T}. Implements field rendering, validation, and submit logic.
 *
 * @template T - The type of the data item managed by the dialog. Must include an optional `id`.
 */
export abstract class BaseCustomDialog<
  T extends { id?: string | number }
> extends React.Component<
  BaseDialogProps<T>,
  {
    /**
     * Current form data, bound to inputs.
     */
    formData: T;

    /**
     * Validation error messages, keyed by field name.
     */
    errors: { [key: string]: string };

    /**
     * Whether the form submission is in progress.
     */
    isSubmitting: boolean;
  }
> {
  /**
   * Subclasses must implement this to supply:
   * - `title(isEdit: boolean) => string`
   * - `fields: FormFieldConfig<T>[]`
   * - `validate(item: T) => { isValid: boolean; errors: Record<string,string> }`
   * - `submitText(isEdit: boolean) => string`
   *
   * @returns A {@link DialogConfig<T>} object describing the form layout and validation.
   */
  abstract getConfig(): DialogConfig<T>;

  state: {
    formData: T;
    errors: { [key: string]: string };
    isSubmitting: boolean;
  } = {
    formData: {} as T,
    errors: {},
    isSubmitting: false,
  };

  /**
   * When `initialData` prop changes, reload it into form state.
   *
   * @param prevProps - The previous props.
   */
  componentDidUpdate(prevProps: BaseDialogProps<T>) {
    if (this.props.initialData !== prevProps.initialData) {
      this.setState({
        formData: this.props.initialData || ({} as T),
        errors: {},
      });
    }
  }

  /**
   * Handles updating form state when an input value changes.
   * Supports both text inputs and checkboxes.
   *
   * @param e - The change event from an HTML input element.
   */
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    this.setState((prev) => ({
      formData: {
        ...prev.formData,
        [name]: val,
      },
      errors: {
        ...prev.errors,
        [name]: "",
      },
    }));
  };

  /**
   * Handles form submission:
   * 1. Prevents default browser submission.
   * 2. Validates via `getConfig().validate`.
   * 3. If valid, calls `props.onSubmit(formData)` and then `props.onClose()`.
   *
   * @param e - The form submission event.
   */
  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { validate } = this.getConfig();
    const validation = validate(this.state.formData);

    if (!validation.isValid) {
      this.setState({ errors: validation.errors });
      return;
    }

    this.setState({ isSubmitting: true });
    try {
      await this.props.onSubmit(this.state.formData);
      this.props.onClose();
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  /**
   * Renders a single form field based on its configuration.
   * Chooses between a checkbox or text field.
   *
   * @param field - The field configuration.
   * @returns A JSX element for the input.
   */
  renderField = (field: FormFieldConfig<T>) => {
    const { formData, errors } = this.state;
    const value = (formData as any)[field.name as string];
    const error = errors[field.name as string] || "";

    if (field.type === "checkbox") {
      return (
        <FormControlLabel
          key={field.name as string}
          control={
            <Checkbox
              name={field.name as string}
              checked={!!value}
              onChange={this.handleChange}
              color="primary"
            />
          }
          label={field.label}
          sx={{ mt: 1, mb: 1 }}
        />
      );
    }

    return (
      <TextField
        key={field.name as string}
        margin="dense"
        name={field.name as string}
        label={field.label}
        type={field.type || "text"}
        fullWidth={field.fullWidth ?? true}
        autoFocus={field.autoFocus || false}
        required={field.required || false}
        value={value || ""}
        onChange={this.handleChange}
        error={!!error}
        helperText={error}
        sx={{ mb: 2 }}
      />
    );
  };

  /**
   * Renders the dialog, including title, dynamic form fields, and action buttons.
   *
   * @returns The dialog JSX.
   */
  render() {
    const { open, onClose } = this.props;
    const { isSubmitting } = this.state;
    const config = this.getConfig();
    const isEdit = !!this.props.initialData?.["id"];

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: this.handleSubmit,
        }}
      >
        <DialogTitle>{config.title(isEdit)}</DialogTitle>
        <DialogContent>{config.fields.map(this.renderField)}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={isSubmitting}
            variant="contained"
          >
            {config.submitText(isEdit)}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default BaseCustomDialog;
