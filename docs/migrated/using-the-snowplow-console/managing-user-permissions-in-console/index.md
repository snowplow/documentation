---
title: "Managing user permissions in Console"
date: "2022-03-17"
sidebar_position: 30
---

To set a users permissions, navigate to `Manage users` and then to the user who's account you'd like to manage.

## What permissions can be set?

Snowplow console sets permissions for each area of console as summarized below:

<table><tbody><tr><td><strong>Console feature</strong></td><td><strong>Description</strong></td><td><strong>Possible permissions</strong></td></tr><tr><td>User management</td><td>The management and addition of user access. This permission cannot be configured on a Custom role.</td><td><ul><li>No access</li><li>Edit</li><li>Create</li></ul></td></tr><tr><td>Environments</td><td>The management of pipeline and sandbox (Mini) environments. This includes managing which Enrichments run on each environment.</td><td><div></div><ul><li>No access</li><li>View</li><li>Edit</li></ul></td></tr><tr><td>Data structures</td><td>The management and creation of the schemas that define the events and entities you are capturing.</td><td><ul><li>No access</li><li>View</li><li>Edit on development</li><li>Edit on production</li><li>Create</li></ul></td></tr><tr><td>Data models</td><td>The management and creation of your data models.</td><td><ul><li>No access</li><li>View</li><li>Edit</li><li>Create</li></ul></td></tr><tr><td>API keys</td><td>The management and creation of API keys.</td><td><ul><li>View</li><li>Manage</li><li>Create</li></ul></td></tr></tbody></table>

## How are permissions set?

To set permissions for a user, navigate to _Manage Users_ and select the user, within the management screen for their user you will be able to set their permissions.

There are three ways of setting user permissions:

- Admin (pre-defined role)
- User (pre-defined role)
- Custom (custom permissions role) - **custom roles are only available on our Summit tier**

#### User permission set

<table><tbody><tr><td><strong>Console feature</strong></td><td><strong>Permissions</strong></td></tr><tr><td>User management</td><td>No access (in the UI)</td></tr><tr><td>Environments</td><td>View access</td></tr><tr><td>Data structures</td><td>Edit on developmentCreate</td></tr><tr><td>Data models</td><td>View access</td></tr><tr><td>API keys</td><td>View access</td></tr></tbody></table>

#### Admin permission set

<table><tbody><tr><td><strong>Console feature</strong></td><td><strong>Permissions</strong></td></tr><tr><td>User management</td><td>Full access</td></tr><tr><td>Environments</td><td>Full access</td></tr><tr><td>Data structures</td><td>Full access</td></tr><tr><td>Data models</td><td>Full access</td></tr><tr><td>API keys</td><td>Full access</td></tr></tbody></table>

#### Custom permission set

<table><tbody><tr><td><strong>Console feature</strong></td><td><strong>Permissions</strong></td></tr><tr><td>User management</td><td><em>Customized by you, per user</em></td></tr><tr><td>Environments</td><td><em>Customized by you, per user</em></td></tr><tr><td>Data structures</td><td><em>Customized by you, per user</em></td></tr><tr><td>Data models &amp; jobs</td><td><em>Customized by you, per user</em></td></tr><tr><td>API keys</td><td><em>Customized by you, per user</em></td></tr></tbody></table>

A note on API keys and permissions

Please note:

1) Any API keys you create have full admin permissions

2) Any existing Iglu API keys allow permissions to be side-stepped by connecting directly to Iglu servers

Our recommendation is to remove all existing API keys and Iglu keys, and set the API keys permission respectively so that only trusted users can create new keys.

## What does each permission mean?

### Environments

An environment is the collective name for your Production pipelines, QA pipelines and sandboxes.

An environment has three permissions:

- **No access** \- the user will not see the environment management screens.
- **View** - the user can see the environment management screen, but cannot edit anything. This is the default setting for the User role.
- **Edit / Publish** - the user can make and publish edits to the environment. This includes configuration such as enrichment enablement, enrichment configuration and collector configuration. This is the default setting for the Admin role.

### Data structures

Data structures have five permissions:

- **No access** \- the user will not see the data structure management screen
- **View** - the user can see the data structure management screen, but cannot edit anything.
- **Edit on development** \- the user can see the data structure management screen, and can make edits to data structures but only publish them to the development registry. This is the default setting for the User role.
- **Edit on production** \- the user can see the data structure management screen, and can make edits to data structures, and can publish changes to the production registry. This is the default setting for the Admin role.
- **Create** \- the user can create new data structures. Both the User and Admin roles have this permission.

### Data models

Data models and jobs have four permissions:

- **No access** \- the user will not see the data model management screens
- **View** - the user can see the data model management screens, but cannot edit anything. This is the default setting for the User role.
- **Edit** \- the user can see the data model management and can make edits to data models in production. This is the default setting for the Admin role.
- **Create** \- the user can create new data models. The Admin role has this permission.

### API keys

API keys have three permissions:

- **View** - the user can see the API key descriptions but cannot see the keys themselves or manage them
- **Manage** \- the user can see and manage the API keys. This is the default setting for the Admin role.
- **Create** \- the user can generate new API keys. The Admin role has this permission.

## Troubleshooting

You shouldn’t be required to logout for new permissions to take effect, but if you do find permissions aren’t applying as requested logging out and back in should force the new permissions to apply.
