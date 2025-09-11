---
title: "Creating your own plugins"
description: "Create custom plugins for browser tracker v3 to extend behavioral event collection capabilities."
keywords: ["Browser V3 Plugins", "Custom Plugins", "Legacy Plugins", "Plugin Development", "Web Extensions", "JavaScript Plugins"]
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
schema: "TechArticle"
        data: {
          property: 'value',
        },
      },
    ];
  },
};

newTracker('sp1', '{{COLLECTOR_URL}}', { plugins: [myPlugin] });
```
