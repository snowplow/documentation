---
title: "Lua Tracker"
date: "2020-02-26"
sidebar_position: 270
---

The Snowplow Lua Tracker allows you to track Snowplow events in your Lua applications.

It is compatible with Lua >= 5.1, along with LuaJIT.

This will help you set up the Lua tracker and get started tracking. For more technical details, you can visit the [API docs](https://snowplow.github.io/snowplow-lua-tracker/).

## Getting Started

### Requirements

Ensure you have the following installed on your system:

- [Lua](https://www.lua.org/) version >= 5.1
- [LuaRocks](https://luarocks.org/) (Lua's dependency manager)
- curl

If using `brew`, simply run:

```
brew install lua luarocks curl
```

### Installation

Once these are installed, you can install the tracker using LuaRocks:

```
luarocks install snowplowtracker
```

Note: You may find that you need to pass in the CURL\_DIR flag if Lua cannot find `curl` by itself. Below is an example if `curl` was installed using `brew` on an Intel Mac.

```
luarocks install snowplowtracker CURL_DIR=/usr/local/Cellar/curl/7.82.0/
```

Or, add the Snowplow Tracker to the dependencies section of your rockspec (Note: you may still have to pass `CURL_DIR` when installing):

```
dependencies = {
  ...
  "SnowplowTracker"
}
```

### Tracking Events

To track an event, simply create a tracker instance and call one of the `track_*` methods. For example, simple tracking of a [structured event](/docs/migrated/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/#structured-events):

```
local snowplow = require("snowplow")
local tracker = snowplow.new_tracker("{{ collector_url }}")

tracker:track_struct_event("category", "action", "label", "property", 10)
```

Visit documentation about [tracking events](/docs/migrated/collecting-data/collecting-from-own-applications/lua-tracker/tracking-specific-events/) to learn about other supported event types.
