import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { DataTable } from '../src/components/DataTable'
import { DataTableConfig } from '../src/types/DataTableConfig'
import { User } from './user'
import EditIcon from "@mui/icons-material/Edit";

import { DialogConfig } from '../src/types/BaseCustomDialogTypes'


export default class MyDemoTable extends DataTable<User> {

    buildDialog(): DialogConfig<User> {
        return {
            title: (isEdit) => (isEdit ? "Edit User" : "Add User"),
            submitText: (isEdit) => (isEdit ? "Save Changes" : "Create User"),
            validate: (item) => {
                const errors: Record<string, string> = {};
                if (!item.email) errors.username = "The email is required"
                if (!item.available) errors.available = "The availability is required"
                return { isValid: Object.keys(errors).length === 0, errors };

            },
            fields: [
                {
                    name: "username",
                    label: "Username",
                    required: false,
                    autoFocus: false
                },

                {
                    name: "email",
                    label: "Email",
                    required: true,
                    autoFocus: false
                }

                {
                    name: "available",
                    label: "Is Available",
                    type: "checkbox",
                    required: true,
                    autoFocus: false
                }
            ]
        }
    }


    buildColumns(): GridColDef[] {
        return [
            {
                field: "username",
                headerName: "Username",
                flex: 1
            },

            {
                field: "email",
                headerName: "Email",
                flex: 1
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => this.handleEdit(params.row)}
                    />,
                ],
            },
        ]
    }

    getConfig(): DataTableConfig<User> {
        return {
            title: 'Users',
            columns: this.buildColumns(),
            addButtonLabel: "Add new user",
            pageSizeOptions: [5, 10, 20, 100],
            defaultPageSize: 20,
            initialRows: [mockUser],
            dialogConfig: this.buildDialog()
        }
    }

    handleSubmit(item: User): Promise<void> {
        // Your save logic here - this would typically call an API
        return new Promise((resolver) => {
            setTimeout(() => {
                // ID exists, apply update operations
                if (item.id) {
                    console.log("Updating employee :", item);
                } else {
                    // ID does NOT exist, add new entry
                    console.log("Saving employee:", item);
                }
            })
        })
    }

}

export const mockUser: User = {
    id: 1,
    email: "user@info.com",
    username: "user",
    available: false
}