---
title: "Available Console user permissions and roles"
sidebar_label: "Permissions"
sidebar_position: 2
description: "Configure user permissions in Snowplow Console with Admin, User, and Custom roles to control access to environments, data structures, tracking plans, data models, and API keys."
keywords: ["user permissions", "role management", "access control", "Admin role", "Custom permissions", "Console permissions"]
---

To set a user's permissions, navigate to **Settings** > **Users** and then to the user whose account you'd like to manage.

## What permissions can be set?

Snowplow Console sets permissions for each area of Console as summarized below:

| **Console feature** | **Description**                                                                                                               | **Possible permissions**                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| User management     | The management and addition of user access. This permission cannot be configured on a Custom role.                            | No access<br/>Edit<br/>Create                                                |
| Environments        | The management of pipeline and development environments. This includes managing which Enrichments run on each environment.    | No access<br/>View<br/>Edit                                                  |
| Tracking plans      | The management and creation of tracking plans                                                                                 | No access<br/>View<br/>Edit<br/>Create                                       |
| Data structures     | The management and creation of the schemas that define the events and entities you are capturing.                             | No access<br/>View<br/>Edit on development<br/>Edit on production<br/>Create |
| Data models         | The management and creation of your data models.                                                                              | No access<br/>View<br/>Edit<br/>Create                                       |
| API keys            | The management and creation of API keys.                                                                                      | No access<br/>View<br/>Manage                                                |

## How are permissions set?

To set permissions for a user, navigate to **Settings** > **Users** and select the user, within the management screen for their user you will be able to set their permissions.

There are three ways of setting user permissions:

- Global Admin (pre-defined role)
- User (pre-defined role)
- Custom (custom permissions role)

#### User permission set

| **Console feature** | **Permissions** |
| ------------------- | --------------- |
| Environments        | View access     |
| User management     | View access     |
| Tracking plans      | View access     |
| Data structures     | View access     |
| Data models         | View access     |
| API keys            | View access     |

#### Global Admin permission set

| **Console feature** | **Permissions** |
| ------------------- | --------------- |
| User management     | Full access     |
| Environments        | Full access     |
| Tracking plans      | Full access     |
| Data structures     | Full access     |
| Data models         | Full access     |
| API keys            | Full access     |

#### Custom permission set

| **Console feature** | **Permissions**             |
| ------------------- | --------------------------- |
| User management     | Customized by you, per user |
| Environments        | Customized by you, per user |
| Tracking plans      | Customized by you, per user |
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

An environment is the collective name for your Production pipelines, QA pipelines and development environments.

An environment has three permissions:

- **No access** - the user will not see the environment management screens.
- **View** - the user can see the environment management screen, but cannot edit anything. This is the default setting for the User role.
- **Edit** - the user can make edits to the environment. This includes configuration such as enrichment enablement, enrichment configuration and collector configuration.

### Tracking Plans

Tracking Plans have four permissions:

- **No access** - the user will not see the tracking plan management screens.
- **View** - the user can see the tracking plan management screens, but cannot edit anything. This permission and all tracking plan permissions below require the user to have at least the **View** permission on data structures.
- **Edit** - the user can see the tracking plan management screens, and can make edits to existing tracking plans.
- **Create** - the user can create new tracking plans.

### Data structures

Data structures have five permissions:

- **No access** - the user will not see the data structure management screen.
- **View** - the user can see the data structure management screen, but cannot edit anything.
- **Edit on development** - the user can see the data structure management screen, and can make edits to data structures but only publish them to the development registry.
- **Edit on production** - the user can see the data structure management screen, and can make edits to data structures, and can publish changes to the production registry.
- **Create** - the user can create new data structures.

### Data models

Data models and jobs have four permissions:

- **No access** - the user will not see the data model management screens.
- **View** - the user can see the data model management screens, but cannot edit anything. This is the default setting for the User role.
- **Edit** - the user can see the data model management and can make edits to data models in production. This is the default setting for the Admin role.
- **Create** - the user can create new data models. 

### API keys

API keys have four permissions:

- **No access** - the user will not see the API key management screens.
- **View** - the user can see the API key descriptions but cannot see the keys themselves or manage them.
- **Manage** - the user can see and manage the API keys.
- **Create** - the user can generate new API keys.

## Troubleshooting

You shouldn’t be required to logout for new permissions to take effect, but if you do find permissions aren’t applying as requested logging out and back in should force the new permissions to apply.
