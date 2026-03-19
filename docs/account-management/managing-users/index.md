---
title: "Manage users in Console directly or with SSO"
sidebar_label: "User management"
date: "2020-02-15"
sidebar_position: 1
description: "Add and remove users in Snowplow Console, configure Single Sign-On with identity providers including Google Workspace, Entra ID, Okta, and OpenID Connect."
keywords: ["user management", "SSO setup", "Single Sign-On", "SAML", "identity provider", "Entra ID", "Google Workspace", "Okta"]
---

There are two ways to add and remove users in Console: directly managed in Console, or managed through your Single Sign-On (SSO) provider.

SSO is an authentication process that allows users to access multiple applications after signing in to a central Identity Provider. Snowplow supports SSO integration for the majority of identity providers.

For organizations **not using SSO**, users can be added and removed directly in Console by navigating to **Settings** > **Users** in the navigation and creating a new user, or removing an existing user from there. Newly added users will receive an email to set their password and will be added with limited permissions, which you can then widen.

For organizations **using SSO**, you will need to configure your account with your Identity Provider before you can add or remove users.

## SSO permissions

Only system administrators can set up SSO for their company. For information on setting permissions for individual users, see [Managing user permissions](/docs/account-management/managing-permissions/index.md).

## How to enable SSO for your account

Setting up SSO for your account requires some information to be exchanged between you as the Identity Provider and Snowplow as the Service Provider. Depending on your Identity Provider, the information that is required is slightly different.

To enable single sign-on (SSO) for Snowplow, follow these steps inside Console:

1. Go to the [manage organization](https://console.snowplowanalytics.com/settings) page.
2. Select [Single sign-on (SSO)](https://console.snowplowanalytics.com/users) from the Users panel. The SSO configuration is only visible to users with Admin role.
3. Click **Continue** and follow the steps for your Identity Provider.

## Which Identity Providers (IdPs) are supported?

Snowplow’s SSO capability enables connections with many IdPs, including: 

- ADFS
- Auth0
- Entra ID (formerly known as Azure AD)
- Google Workspace
- Keycloak
- Okta
- PingFederate

Because Snowplow supports OpenID Connect and SAML, virtually any external Identity Provider that uses those standards should work.

## What information will you need from us?

This will differ depending on your Identity Provider, but typically will include information such as:

- **Entity ID** - the URL that identifies the identity provider issuing a SAML request, this will be specific to your identity provider.
- **Metadata URL** - the URL that allows access to obtain SSO configuration data, this will be specific to your identity provider.
- **Redirect Login URL** - the URL where users in the company sign in to the identity provider.
- **User information mapping** - locations of information required by Snowplow Console such as first name, last name and, optionally, job title.

## What happens when SSO is enabled?

### Adding new users

Snowplow supports just-in-time provisioning with SSO connections. When a user logs in for the first time, a corresponding user account with the same email is created in Snowplow.

A new user created via SSO will have a custom permissions set that allows them to view-only, as outlined below. This can then be edited by anyone with the Global Admin role on your account. For more details on setting user access, see [Managing user permissions](/docs/account-management/managing-permissions/index.md).

### Existing users

If a user already has a Snowplow account prior to SSO being enabled, the two accounts will be merged, and the user's current permissions will be applied.

### Logging in 

When SSO is enabled, anybody who signs into Snowplow Console with an email address that uses your specified domain will be authenticated via SSO and your Identity Provider.

Once SSO is enabled, users on your domain can no longer sign in with their old email address and password, or manage their personal details or password as these will all be managed within your Identity Provider.

## Disabling SSO

If your company enables SSO, and later decides to disable it:

- Users who did not set up a password before SSO was enabled must click Reset password on the login page to obtain a password.
- Users who set up a password before SSO was enabled can log in with their old username and password.
