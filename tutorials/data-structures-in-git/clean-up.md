---
title: "Clean up the example tracking and API key"
sidebar_label: "Clean up"
position: 5
description: "Remove the API key and the example data structures that you created while following the tutorial on managing tracking from a repository."
keywords: ["snowplow api key", "hide data structure"]
date: "2026-11-13"
---

If you followed this tutorial with the example tracking rather than your own, remove what it created. If you're keeping the configuration for your own tracking, keep the API key and the workflows.

To remove the example:

1. Delete the two workflow files from `.github/workflows` and the repository secrets `SNOWPLOW_CONSOLE_ORG_ID`, `SNOWPLOW_CONSOLE_API_KEY_ID`, and `SNOWPLOW_CONSOLE_API_KEY` in GitHub.
2. In Console, delete the API key from **Settings** > **Manage organization** > **View and manage API keys**. See [Create an API key](/docs/account-management/#create-an-api-key) for the permission it needs.
3. In Console, [hide the data structures](/docs/event-studio/data-structures/hide-and-lock/#hide-a-data-structure) `docs_capture_signup` and `docs_capture_plan`. Hiding removes them from the Console listing but not from the registry.

To learn more about the commands and options this tutorial used, see the [Snowplow CLI tracking plans reference](/docs/api-reference/snowplow-cli/tracking-plans/), the [Snowtype command reference](/docs/event-studio/implement-tracking/command-reference/), and [Keep Snowtype code up to date](/docs/event-studio/implement-tracking/keep-code-up-to-date/).
