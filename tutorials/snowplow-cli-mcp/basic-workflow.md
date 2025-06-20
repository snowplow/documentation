---
position: 3
title: Basic Workflow
---

# Basic Workflow

Here's a typical interaction pattern for creating a data structure.

## 1. Get Context (Always First)

> Please call get_context to retrieve the Snowplow schemas before we start working.

The assistant will retrieve the built-in validation schemas and rules needed for creating valid Snowplow components. This provides the structural templates and requirements - no data is downloaded from Console.

## 2. Create a Data Structure

> Create a data structure for tracking when users view a product page. Include properties for product ID, product name, category, and price.

The assistant will:
- Generate a proper UUID for the data structure
- Create a valid event schema following Snowplow conventions
- Save the file locally to the appropriate location

**Note**: Files are created locally only. Use `snowplow-cli ds publish` to sync
to Console when ready.

## 3. Validate (Automatic)

The assistant will automatically call `validate_data_structures` on the created
file and report any validation issues.

## 4. Iterate if Needed

> The price should be optional, not required. Also add a description field.

The assistant will modify the structure and re-validate.
