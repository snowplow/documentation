---
title: "Creating your own plugins"
date: "2021-04-12"
sidebar_position: 750
---

### Example

```
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
