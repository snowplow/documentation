---
title: "Snowtype 0.17.0"
description: "This release includes multiple change:."
date: "2026-03-23"
update_type:
  - "Release notes"
components:
  - "Event Studio"
  - "Developer tools"
---
> **\[23-Mar-2026]**

This release includes multiple change:

* Enable locking mechanism for event specifications
* Support for Swift 6, addressing breaking changes in the language

**Snowtype now uses a lock file to pin event specification versions**

Running `snowtype generate` will now create a lock file in the same directory as your config file. Subsequent `generate` calls will use this lock file to ensure your tracking code is always generated against a consistent, known set of event specification versions, rather than automatically pulling the latest.

**To update your event specification versions**, run `snowtype update`. This will bump the versions recorded in the lock file to the latest published versions by default.

A few useful flags for `snowtype update`:

* `--yes` — automatically regenerates tracking code after updating, so you don't need to run `generate` separately
* `--latestDraft` — bumps to the latest draft version rather than the latest published version

You can also scope the update to a subset of your configuration:

```
# Check for updates for specific event specifications only
npx @snowplow/snowtype@latest update --eventSpecs <id1> <id2>

# Check for updates for specific tracking plans only
npx @snowplow/snowtype@latest update --dataProducts <id1> <id2>
```
