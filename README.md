# react-mvc-datatable

# React MVC Datatable

[![npm version](https://img.shields.io/npm/v/react-mvc-datatable.svg)](https://www.npmjs.com/package/react-mvc-datatable)
[![license](https://img.shields.io/npm/l/react-mvc-datatable.svg)](./LICENSE)
[![Jenkins Build](https://img.shields.io/jenkins/build?jobUrl=https://jenkins.eorghe.com/view/NPM/job/react-mvc-datatable/)](https://jenkins.eorghe.com/view/NPM/job)
[![issues](https://img.shields.io/github/issues/nirodg/react-mvc-datatable)](https://github.com/nirodg/react-mvc-datatable/issues)
[![stars](https://img.shields.io/github/stars/nirodg/react-mvc-datatable)](https://github.com/nirodg/react-mvc-datatable/stargazers)
[![minified + gzip](https://img.shields.io/bundlephobia/minzip/react-mvc-datatable)](https://bundlephobia.com/package/react-mvc-datatable)


Intead of repetitve copy-paste I made myself a library that helps up to build pages that contains DataTable elements.

## Install
```sh
npm i react-mvc-datatable
```

## How-To
Create the needed entity that extends **Entity**

Example:
```js

export interface User extends Entity {

    username?: string;
    email?: string;
    available?: boolean;

}

```


2. Create the page that extends **DataTable**


Example: 
```js

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

```

# Next steps ?

✅ Start using it, give feedback!
✅ Contributions are welcome

## 📄 License
react-mvc-datatable is licensed under the MIT license. See the LICENSE file for details.
