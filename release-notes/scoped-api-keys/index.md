---
title: "Scoped API keys and a redesigned API keys page in Console"
description: "Snowplow API keys are now scoped to the permissions you select at creation, and Snowplow API keys and Iglu Server keys are managed from a single redesigned page in Console."
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
* Only users can create API keys. A request authenticated with an API key cannot create another key.
* A key's permissions are fixed at creation and do not change when the creator's permissions change.

The API keys page, under **Settings** > **Manage organization** > **View and manage API keys**, has also been redesigned. Snowplow API keys and Iglu Server keys, previously called utility keys, now appear in one table with a **Scope** column that shows at a glance whether a key is read only, can write, or is a legacy global admin key. You can search by name or key ID, filter by key type, sort by any column, view a key's exact permissions, and clone a key to rotate it without re-selecting its permissions. The Iglu Resolver URLs for both environments are available from the page's overflow menu.

Existing API keys keep working unchanged. They appear as **Global admin** in the **Scope** column and cannot be cloned. We recommend replacing them with scoped keys that grant only what each integration needs.

For programmatic key creation, the Console API exposes a new `credentials/v3/api-keys` endpoint that requires permissions to be specified. The `credentials/v2/api-keys` creation endpoint is deprecated and will be removed once clients have migrated.

See [Account management](/docs/account-management/) for how to create and manage keys.
