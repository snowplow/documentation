---
title: "Lua Tracker"
date: "2020-02-26"
sidebar_position: 270
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import BadgeGroup from '@site/src/components/BadgeGroup';
import {versions} from '@site/src/componentVersions';

<Badges badgeType="Actively Maintained"></Badges>
```

The Snowplow Lua Tracker allows you to track Snowplow events in your Lua applications.

<p>The current version is {versions.luaTracker}. It is compatible with Lua >= 5.1, along with LuaJIT.</p>

This will help you set up the Lua tracker and get started tracking. For more technical details, you can visit the [API docs](https://snowplow.github.io/snowplow-lua-tracker/).

## Getting Started

### Requirements

Ensure you have the following installed on your system:

- [Lua](https://www.lua.org/) version >= 5.1
- [LuaRocks](https://luarocks.org/) (Lua's dependency manager)
- curl

If using `brew`, simply run:

```bash
brew install lua luarocks curl
```

### Installation

Once these are installed, you can install the tracker using LuaRocks:

```bash
luarocks install snowplowtracker
```

Note: You may find that you need to pass in the CURL_DIR flag if Lua cannot find `curl` by itself. Below is an example if `curl` was installed using `brew` on an Intel Mac.

```bash
luarocks install snowplowtracker CURL_DIR=/usr/local/Cellar/curl/7.82.0/
```

Or, add the Snowplow Tracker to the dependencies section of your rockspec (Note: you may still have to pass `CURL_DIR` when installing):

```gradle
dependencies = {
  ...
  "SnowplowTracker"
}
```

### Tracking Events

To track an event, simply create a tracker instance and call one of the `track_*` methods. For example, simple tracking of a [structured event](/docs/fundamentals/events/index.md#structured-events):

```lua
local snowplow = require("snowplow")
local tracker = snowplow.new_tracker("{{ collector_url }}")

tracker:track_struct_event("category", "action", "label", "property", 10)
```

Visit documentation about [tracking events](/docs/sources/trackers/lua-tracker/tracking-specific-events/index.md) to learn about other supported event types.
