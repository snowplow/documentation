---
title: "User management"
description: "Manage user accounts, roles, and access permissions within your Snowplow organization and behavioral data platform."
schema: "TechArticle"
keywords: ["User Management", "Account Users", "User Administration", "Access Control", "User Permissions", "Account Access"]
date: "2020-02-15"
sidebar_position: 1
sidebar_label: "User management"
---

There are two ways to add and remove users in Console: directly managed in Console, or managed through your Single Sign-On (SSO) provider.

SSO is an authentication process that allows users to access multiple applications after signing in to a central Identity Provider. Snowplow supports SSO integration for the majority of identity providers.

For organizations **not using SSO**, users can be added and removed directly in Console by navigating to `Manage users` in the navigation and creating a new user, or removing an existing user from there. Newly added users will receive an email to set their password and will be added with limited permissions, which you can then widen.

For organizations **using SSO**, you will need to configure your account with your Identity Provider before you can add or remove users.

## SSO permissions

Only system administrators can set up SSO for their company. For information on setting permissions for individual users, see [this page](/docs/account-management/managing-permissions/index.md).

## Requirements

- Your identity provider must adhere to the OASIS SAML 2.0 protocol.
- All users of an SSO-enabled instance of Snowplow must authenticate through the identity provider.

## How to enable SSO for your account

Setting up SSO for your account requires some information to be exchanged between you as the Identity Provider and Snowplow as the Service Provider. Depending on your Identity Provider, the information that is required is slightly different.

To enable single sign-on (SSO) for Snowplow, follow these steps inside Console:

1. Go to the [manage organization](https://console.snowplowanalytics.com/settings) page.
2. Select [Single sign-on (SSO)](https://console.snowplowanalytics.com/users/sso) from the Users panel.
3. Follow the steps for your selected identity provider and supply the relevant information.
* For Google Workspace, Azure AD, and Open ID Connect, the process is fully self-serve. This means that you can get connected immediately.
* For other identity providers, you will need to submit your details securely to our support team. We will then work with you to set up the SSO connection.

## Which Identity Providers (IdPs) are supported?

Snowplow’s SSO capability enables connections with many IdPs, including: 

- Active Directory/LDAP
- ADFS
- Azure Active Directory
- Azure Active Directory Native
- Google Workspace
- OpenID Connect
- Okta
- PingFederate
- SAML

Note that because we can support OpenID Connect and SAML, it should be possible to support virtually any external Identity Provider that uses those standards.

## What information will you need from us?

This will differ depending on your Identity Provider, but typically will include information such as:

- **Entity ID -** the URL that identifies the identity provider issuing a SAML request,  this will be specific to your identity provider.
- **Metadata URL** - the URL that allows access to obtain SSO configuration data,  this will be specific to your identity provider.
- **Redirect Login URL** - the URL where users in the company sign in to the identity provider.
- **Security Certificate Fingerprint** - the SHA-1 or SHA-256 fingerprint of the SAML certificate that can be obtained from your identity provider and allows us to create a secure connection.
- **User information mapping** - locations of information required by Snowplow Console such as first name, last name and, optionally, job title.

## What happens when SSO is enabled?

### Adding new users

Snowplow supports just-in-time provisioning with SSO connections. When a user logs in for the first time, a corresponding user account with the same email is created in Snowplow.

A new user created via SSO will have a custom permissions set that allows them to view-only, as outlined below. This can then be edited by anyone with the Admin role on your account. For more details on setting user access, see [Managing user permissions](/docs/account-management/managing-users/index.md).

<table><tbody><tr><td><strong>Console feature</strong></td><td><strong>Permissions</strong></td></tr><tr><td>User management</td><td>No access</td></tr><tr><td>Environments</td><td>View access</td></tr><tr><td>Data structures</td><td>View access</td></tr><tr><td>Data models &amp; jobs</td><td>View access</td></tr><tr><td>API keys</td><td>View access</td></tr></tbody></table>

### Existing users

If a user already has a Snowplow account prior to SSO being enabled, the two accounts will be merged the users current permissions will be applied.

### Logging in 

When SSO is enabled, anybody who signs into Snowplow Console with an email address that uses your specified domain will be authenticated via SSO and your Identity Provider.

Once SSO is enabled, users on your domain can no longer sign in with their old email address and password, or manage their personal details or password as these will all be managed within your Identity Provider.

## Disabling SSO

If your company enables SSO, and later decides to disable it:

- Users who did not set up a password before SSO was enabled must click Reset password on the login page to obtain a password.
- Users who set up a password before SSO was enabled can login with their old username and password.
