---
title: "Managing user permissions in Console"
sidebar_label: "Permissions"
sidebar_position: 2
---

To set a users permissions, navigate to `Manage users` and then to the user whose account you'd like to manage.

## What permissions can be set?

Snowplow Console sets permissions for each area of Console as summarized below:

| **Console feature** | **Description**                                                                                                               | **Possible permissions**                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| User management     | The management and addition of user access. This permission cannot be configured on a Custom role.                            | No access<br/>Edit<br/>Create                                                |
| Environments        | The management of pipeline and sandbox (Mini) environments. This includes managing which Enrichments run on each environment. | No access<br/>View<br/>Edit                                                  |
| Data products       | The management and creation of Data Products                                                                                  | No access<br/>View<br/>Edit<br/>Create                                       |
| Data structures     | The management and creation of the schemas that define the events and entities you are capturing.                             | No access<br/>View<br/>Edit on development<br/>Edit on production<br/>Create |
| Data models         | The management and creation of your data models.                                                                              | No access<br/>View<br/>Edit<br/>Create                                       |
| API keys            | The management and creation of API keys.                                                                                      | View<br/>Manage<br/>Create                                                   |

## How are permissions set?

To set permissions for a user, navigate to _Manage Users_ and select the user, within the management screen for their user you will be able to set their permissions.

There are three ways of setting user permissions:

- Admin (pre-defined role)
- User (pre-defined role)
- Custom (custom permissions role) - **custom roles are only available to customers with access to the fine grained user permissions feature**

#### User permission set

| **Console feature** | **Permissions**                |
| ------------------- | ------------------------------ |
| User management     | No access (in the UI)          |
| Environments        | View access                    |
| Data products       | Edit<br/>Create                |
| Data structures     | Edit on development<br/>Create |
| Data models         | View access                    |
| API keys            | View access                    |

#### Admin permission set

| **Console feature** | **Permissions** |
| ------------------- | --------------- |
| User management     | Full access     |
| Environments        | Full access     |
| Data products       | Full access     |
| Data structures     | Full access     |
| Data models         | Full access     |
| API keys            | Full access     |

#### Custom permission set

| **Console feature** | **Permissions**             |
| ------------------- | --------------------------- |
| User management     | Customized by you, per user |
| Environments        | Customized by you, per user |
| Data products       | Customized by you, per user |
| Data structures     | Customized by you, per user |
| Data models & jobs  | Customized by you, per user |
| API keys            | Customized by you, per user |

A note on API keys and permissions

Please note:

1) Any API keys you create have full admin permissions

2) Any existing Iglu API keys allow permissions to be side-stepped by connecting directly to Iglu servers

Our recommendation is to remove all existing API keys and Iglu keys, and set the API keys permission respectively so that only trusted users can create new keys.

## What does each permission mean?

### Environments

An environment is the collective name for your Production pipelines, QA pipelines and sandboxes.

An environment has three permissions:

- **No access** - the user will not see the environment management screens.
- **View** - the user can see the environment management screen, but cannot edit anything. This is the default setting for the User role.
- **Edit / Publish** - the user can make and publish edits to the environment. This includes configuration such as enrichment enablement, enrichment configuration and collector configuration. This is the default setting for the Admin role.

### Data Products

Data Products have four permissions:

- **No access** - the user will not see the data product management screens.
- **View** - the user can see the data product management screens, but cannot edit anything. This permission and all data product permissions below require the user to have at least the **view** permission on data structures.
- **Edit** - the user can see the data product management screens, and can make edits to existing data products.
- **Create** - the user can create new data products.

### Data structures

Data structures have five permissions:

- **No access** - the user will not see the data structure management screen.
- **View** - the user can see the data structure management screen, but cannot edit anything.
- **Edit on development** - the user can see the data structure management screen, and can make edits to data structures but only publish them to the development registry. This is the default setting for the User role.
- **Edit on production** - the user can see the data structure management screen, and can make edits to data structures, and can publish changes to the production registry. This is the default setting for the Admin role.
- **Create** - the user can create new data structures. Both the User and Admin roles have this permission.

### Data models

Data models and jobs have four permissions:

- **No access** - the user will not see the data model management screens
- **View** - the user can see the data model management screens, but cannot edit anything. This is the default setting for the User role.
- **Edit** - the user can see the data model management and can make edits to data models in production. This is the default setting for the Admin role.
- **Create** - the user can create new data models. The Admin role has this permission.

### API keys

API keys have three permissions:

- **View** - the user can see the API key descriptions but cannot see the keys themselves or manage them
- **Manage** - the user can see and manage the API keys. This is the default setting for the Admin role.
- **Create** - the user can generate new API keys. The Admin role has this permission.

## Troubleshooting

You shouldn’t be required to logout for new permissions to take effect, but if you do find permissions aren’t applying as requested logging out and back in should force the new permissions to apply.
