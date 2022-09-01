---
title: "Creating your own plugins"
date: "2021-04-12"
sidebar_position: 750
---

```mdx-code-block
import Block7289 from "@site/docs/reusable/creating-your-own-plugins/_index.md"

<Block7289/>
```

### Example

```javascript
import { newTracker } from "@snowplow/browser-tracker"

const myPlugin = {
  contexts: () => {
    return [
      {
        schema: "iglu:com.acme/my_context/jsonschema/1-0-0",
        data: {
          property: "value",
        },
      },
    ]
  },
}

newTracker("sp1", "{{COLLECTOR_URL}}", { plugins: [myPlugin] })
```
