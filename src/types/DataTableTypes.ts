import type { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import type { DialogConfig } from "./BaseCustomDialogTypes";

/**
 * Configuration interface for data table components.
 *
 * @remarks
 * This interface defines the complete configuration needed to render a data table with:
 * - Table display properties (title, columns)
 * - Data management (initial rows)
 * - Pagination controls
 * - Integrated form dialog configuration
 *
 * @typeParam T - The entity type/interface being managed by the table
 *
 * @example
 * ```typescript
 * const config: DataTableConfig<User> = {
 *   title: "Users",
 *   columns: [...],
 *   initialRows: users,
 *   dialogConfig: {
 *     fields: [...],
 *     validate: (user) => {...}
 *   }
 * };
 * ```
 */
export interface DataTableConfig<T extends GridValidRowModel> {
  /** The title displayed above the data table */
  title: string;

  /** Column definitions for the data grid */
  columns: TypedGridColDef<T>[];

  /** Initial data rows for the table */
  initialRows: T[];

  /** Available page size options for pagination */
  pageSizeOptions?: number[];

  /** Default page size for the table */
  defaultPageSize?: number;

  /** Custom label for the add button */
  addButtonLabel?: string;

  /**
   * Configuration for the integrated form dialog
   * @see DialogConfig
   */
  dialogConfig: DialogConfig<T>;
}

export type TypedGridColDef<T extends GridValidRowModel> = GridColDef<T, any, any>;
