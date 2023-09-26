---
title: "Creating your own plugins"
sidebar_position: 750
---

```mdx-code-block
import CreatingYourOwnPlugins from "@site/docs/reusable/creating-your-own-plugins/_index.md"

<CreatingYourOwnPlugins/>
```

### Example

```javascript
import { newTracker } from '@snowplow/browser-tracker'; 

const myPlugin = {
  contexts: () => {
    return [
      {
        schema: 'iglu:com.acme/my_context/jsonschema/1-0-0',
        data: {
          property: 'value',
        },
      },
    ];
  },
};

newTracker('sp1', '{{COLLECTOR_URL}}', { plugins: [myPlugin] });
```
