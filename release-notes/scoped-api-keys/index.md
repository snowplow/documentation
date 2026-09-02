---
title: "Scoped API keys and a redesigned API keys page in Console"
sidebar_label: "Scoped API keys"
description: "Snowplow API keys are now scoped to the permissions you select at creation, and Snowplow API keys and Iglu Server keys are managed from a single redesigned page in Console."
keywords: ["scoped API keys", "API keys", "Console API", "permissions", "Iglu Server keys", "key rotation"]
date: "2026-09-02"
category:
  - "Release notes"
components:
  - "Console"
  - "Security"
---

Snowplow Console API keys are now scoped. When you create a key, you choose the permission level it receives for each Console feature, such as environments, tracking plans, or data structures. Previously, every API key had admin privileges across the whole organization.

Key creation follows these rules:

* A key can only be granted permissions that its creator holds. Requesting more returns HTTP 403.
* A key can never manage API keys or access Visualizations.
* A key's permissions are fixed at creation and do not change when the creator's permissions change.

The API keys page, under **Settings** > **Manage organization** > **View and manage API keys**, has also been redesigned. Snowplow API keys and Iglu Server keys, previously called utility keys, now appear in one table with a **Scope** column that shows whether a key has read-only access, write access, or legacy global admin access. From the same page you can:

* Search keys by name or key ID
* Filter by key type and sort by any column
* View the exact permissions a key holds
* Clone a key to rotate it without re-selecting its permissions
* Copy the Iglu resolver URLs for both environments from the overflow menu

Existing API keys keep working unchanged. They appear as **Global admin** in the **Scope** column and cannot be cloned. Replace them with scoped keys that grant only what each integration needs.

See [Account management](/docs/account-management/) for how to create and manage keys.
