import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { DataTableConfig } from "../types/DataTableTypes";
import { DefaultDialog } from "./DefaultDialog";
import type { Entity } from "../types/abstract-entity";
import type { DialogConfig } from "../types/BaseCustomDialogTypes";

/**
 * Abstract base class that renders a configurable data table with built-in "Add" and "Edit"
 * capabilities via a modal dialog.
 *
 * @template T - The entity type for rows, extending an object with an `id` property.
 */
export abstract class DataTable<
  T extends { id: any }
> extends React.Component<
  {},
  {
    rows: T[];
    formOpen: boolean;
    currentItem: T | null;
    loading: boolean;
    error: string | null;
  }
> {
  /**
   * Returns the configuration for the data table and its associated dialog.
   *
   * @returns A {@link DataTableConfig} describing columns, dialog behavior, and more.
   */
  abstract getConfig(): DataTableConfig<T>;

  abstract buildColumns(): GridColDef[];

  abstract buildDialog(): DialogConfig<T>;


  /**
   * Handles form submission for creating or updating an item.
   *
   * @param item - The entity instance to create or update.
   * @returns A promise that resolves when the operation completes.
   */
  abstract handleSubmit(item: Entity): Promise<void>;

  /** Component state initialization. */
  state = {
    rows: [] as T[],
    formOpen: false,
    currentItem: null as T | null,
    loading: false,
    error: null as string | null,
  };

  /**
   * Lifecycle: initialize table rows from `getConfig().initialRows` after mount.
   */
  componentDidMount() {
    const { initialRows } = this.getConfig();
    this.setState({ rows: initialRows });
  }

  /**
   * Opens the dialog for creating a new item.
   */
  handleAdd = () => this.setState({ formOpen: true, currentItem: null });

  /**
   * Opens the dialog for editing an existing item.
   *
   * @param item - The row item to edit.
   */
  handleEdit = (item: T) =>
    this.setState({ formOpen: true, currentItem: item });

  /**
   * Closes the form dialog without saving.
   */
  handleClose = () => this.setState({ formOpen: false });

  /**
   * Renders the dialog component for add/edit operations.
   *
   * @returns A {@link DefaultDialog} configured via `getConfig().dialogConfig`.
   */
  renderForm() {
    const config = this.getConfig();
    return (
      <DefaultDialog<T>
        open={this.state.formOpen}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        initialData={this.state.currentItem}
        config={config.dialogConfig}
      />
    );
  }

  /**
   * Main render method: displays header, add-button, DataGrid, and the add/edit dialog.
   */
  render() {
    const config = this.getConfig();
    const { rows, loading } = this.state;

    return (
      <Box sx={{ height: "100%", width: "100%" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {config.title}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={this.handleAdd}
            disabled={loading}
          >
            {config.addButtonLabel || "Add New"}
          </Button>
        </Box>

        <Box sx={{ height: 600, width: "100%", mt: 2 }}>
          <DataGrid
            rows={rows}
            columns={config.columns}
            loading={loading}
            pageSizeOptions={config.pageSizeOptions || [5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: config.defaultPageSize || 10,
                },
              },
            }}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgba(0, 91, 150, 0.1)"
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
            },
          }}
          />
        </Box>

        {this.renderForm()}
      </Box>
    );
  }
}

export default DataTable;
