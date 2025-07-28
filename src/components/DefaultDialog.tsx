import type { BaseDialogProps, DialogConfig } from "../types/BaseCustomDialogTypes";
import BaseCustomDialog from "./BaseCustomDialog";

/**
 * A concrete implementation of BaseCustomDialog that renders a configurable form dialog.
 *
 * @remarks
 * This component serves as the default dialog implementation for data table forms, providing:
 * - Automatic form rendering based on field configurations
 * - Built-in validation and error display
 * - Standardized layout and behavior
 * - Support for various input types (text, email, checkbox, etc.)
 *
 * @example
 * ```tsx
 * <DefaultDialog
 *   open={true}
 *   onClose={handleClose}
 *   onSubmit={handleSubmit}
 *   initialData={selectedItem}
 *   config={dialogConfig}
 * />
 * ```
 *
 * @typeParam T - The type/interface of the form data being handled
 *
 * @extends BaseCustomDialog<T>
 *
 * @public
 */
export class DefaultDialog<
  T extends { id?: string | number | undefined }
> extends BaseCustomDialog<T> {
  getConfig() {
    return (this.props as DefaultDialogProps<T>).config;
  }
}

/**
 * Props for the DefaultDialog component.
 *
 * @typeParam T - The type/interface of the form data being handled
 */
interface DefaultDialogProps<T> extends BaseDialogProps<T> {
  config: DialogConfig<T>;
}
