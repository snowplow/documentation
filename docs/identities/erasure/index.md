---
title: "Erase user identities for GDPR requests"
sidebar_label: "Erasure"
sidebar_position: 4
description: "Erase a user's entries from the Snowplow Identities graph to fulfill a GDPR right-to-erasure request. Explains what the API removes, what it does not, and how to call it."
keywords: ["gdpr", "erasure", "right to be forgotten", "dsar", "identity deletion", "data subject request"]
date: "2026-05-22"
---

{/* TODO: do not merge this page to main until Console > Identities > Overview surfaces the API URL referenced in the Authenticate section. */}

Snowplow Identities provides an API to erase a user's entries from the [identity graph](/docs/identities/concepts/index.md) to fulfill GDPR right-to-erasure requests. Use the [dry-run mode](#preview-a-deletion-dry-run) first to preview what will be deleted.

## What erasure removes

A successful erasure call removes the following from the Identities database:

- The user's [identifiers](/docs/identities/concepts/index.md#identifiers) matching the inputs you supply
- The [Snowplow IDs](/docs/identities/concepts/index.md#snowplow-ids) those identifiers resolve to, plus any others connected through [merges](/docs/identities/concepts/merges/index.md)
- The internal links between those identifiers and Snowplow IDs

## What erasure does not remove

Erasure is limited to the Identities graph database. The user's data in other parts of your pipeline is unaffected.

:::warning[Erasure removes graph data only]
The Erasure API deletes rows from the Identities graph database. It does not delete events from your warehouse, downstream destinations, or any other system that has received the data. To fulfill the request, you must also delete the user's data from your warehouse and any downstream destinations.
:::

## Make an erasure request

Call the API to fulfill a right-to-erasure request for a specific user. The same endpoint handles both the dry-run preview and the actual deletion.

### Authenticate

Follow the instructions in the [Account management](/docs/account-management/index.md) section to obtain an access token, then export it:

```bash
export TOKEN=<your-token>
```

You also need the API URL for your Identities deployment.

| Value | Description | Where to get it | Format |
| --- | --- | --- | --- |
| Identities API URL | The API URL for your Identities deployment | Console > **Identities** > **Overview** | `https://{{123abc}}.identity.snowplowanalytics.com` |

```bash
export IDENTITIES_URL=https://{{123abc}}.identity.snowplowanalytics.com
```

The token carries your organization, so requests do not include an organization ID in the path.

### Preview a deletion (dry run)

Set `"dry_run": true` to resolve inputs and preview what would be deleted, without touching the database.

```bash
curl -s -X POST "$IDENTITIES_URL/erasure" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "identifiers": [
      {"type": "user_id", "value": "alice@example.com"},
      {"type": "user_id", "value": "nobody@example.com"}
    ],
    "snowplow_ids": ["550e8400-e29b-41d4-a716-446655440000"],
    "dry_run": true
  }'
```

Response (`200 OK`):

```json
{
  "operation_id": "019577a3-...",
  "successful": [
    {
      "request": {"type": "user_id", "value": "alice@example.com"},
      "result": {
        "snowplow_ids": ["7c9e6679-...", "a1b2c3d4-..."],
        "identifiers_affected": 5
      }
    },
    {
      "request": {"snowplow_id": "550e8400-e29b-41d4-a716-446655440000"},
      "result": {
        "snowplow_ids": ["550e8400-..."],
        "identifiers_affected": 2
      }
    }
  ],
  "not_found": [
    {"request": {"type": "user_id", "value": "nobody@example.com"}}
  ],
  "failed": [],
  "totals": {
    "snowplow_ids_affected": 3,
    "identifiers_affected": 7
  },
  "dry_run": true
}
```

Each input lands in exactly one of `successful`, `not_found`, or `failed`. A single identifier can resolve to multiple Snowplow IDs through [merges](/docs/identities/concepts/merges/index.md), so `successful[].result.snowplow_ids` lists every one affected. `not_found` means the identifier or `snowplow_id` is not in the graph. `totals` aggregates across all successful items. With `dry_run: true`, nothing is deleted.

### Erase identities

Omit `dry_run` (or set it to `false`) to perform the erasure.

```bash
curl -s -X POST "$IDENTITIES_URL/erasure" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "identifiers": [
      {"type": "user_id", "value": "alice@example.com"},
      {"type": "user_id", "value": "nobody@example.com"}
    ],
    "snowplow_ids": ["550e8400-e29b-41d4-a716-446655440000"]
  }'
```

Response (`200 OK`):

```json
{
  "operation_id": "019577b1-...",
  "successful": [
    {
      "request": {"type": "user_id", "value": "alice@example.com"},
      "result": {
        "snowplow_ids": ["7c9e6679-...", "a1b2c3d4-..."],
        "identifiers_affected": 5
      }
    },
    {
      "request": {"snowplow_id": "550e8400-e29b-41d4-a716-446655440000"},
      "result": {
        "snowplow_ids": ["550e8400-..."],
        "identifiers_affected": 2
      }
    }
  ],
  "not_found": [
    {"request": {"type": "user_id", "value": "nobody@example.com"}}
  ],
  "failed": [],
  "totals": {
    "snowplow_ids_affected": 3,
    "identifiers_affected": 7
  },
  "dry_run": false
}
```

The response shape is the same as the dry run, with `dry_run: false`. Not-found inputs do not fail the request; found inputs are still deleted. The `operation_id` is your audit reference for this erasure. Keep it with your records.

## Limits and errors

Each request is limited to:

- 100 combined inputs (`identifiers` plus `snowplow_ids`)
- 256 KB request body

Errors use a single envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "too many inputs, maximum 100 total identifiers and snowplow IDs",
    "timestamp": "2026-03-24T12:00:00.000Z"
  }
}
```

The HTTP status code tells you which kind of error occurred:

| Status | When |
| --- | --- |
| `200` | Request succeeded. Per-input validation errors appear in `failed[]`. |
| `400` | Request-level validation failed: over the input limit, body too large, or malformed JSON. |
| `401` | Missing, invalid, or unauthorized token. |
| `500` | Server error. |

Input-level validation errors (for example, an empty `type` or `value`) return `200` with the invalid input listed in `failed[]`:

```json
{
  "failed": [
    {
      "request": {"value": "test"},
      "error": {"code": "validation_error", "message": "missing type or value"}
    }
  ]
}
```
