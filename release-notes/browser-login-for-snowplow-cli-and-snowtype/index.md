---
title: "Log in to Snowplow CLI and Snowtype with your browser"
sidebar_label: "Browser login for Snowplow CLI and Snowtype"
description: "Snowplow CLI 0.5.0 and Snowtype 0.21.0 add login and logout commands. Sign in to Console in your browser once and use both tools without an API key."
keywords: ["snowplow cli", "snowtype", "login", "logout", "api key", "release notes"]
date: "2026-11-18"
category:
  - "Release notes"
components:
  - "Developer tools"
  - "Event Studio"
---

Snowplow CLI 0.5.0 and Snowtype 0.21.0 have new `login` and `logout` commands. You no longer need an API key to use either tool on your own machine.

```bash
snowplow-cli login
```

```bash
npx snowtype login
```

The `login` command signs you in to Console in your browser and saves the login to `~/.config/snowplow/login.json`. It doesn't create an API key. The tools use the saved login when no API key is configured, and refresh it when it expires.

Both tools share the login, so you only need to log in with one of them. The `logout` command revokes the saved login and deletes it for both tools.

API keys keep working, and take precedence over a saved login. Use them for CI and other non-interactive environments.

See how to configure [Snowplow CLI](/docs/api-reference/snowplow-cli/#configure) and how to authenticate [Snowtype](/docs/event-studio/implement-tracking/install-snowtype/#authenticate).
