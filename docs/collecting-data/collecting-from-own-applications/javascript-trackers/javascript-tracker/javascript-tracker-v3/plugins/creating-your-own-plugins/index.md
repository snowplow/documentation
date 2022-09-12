---
title: "Creating your own plugins"
date: "2021-04-12"
sidebar_position: 500
---

```mdx-code-block
import Block7289 from "@site/docs/reusable/creating-your-own-plugins/_index.md"

<Block7289/>
```

### Example

```javascript
const myPlugin = {
  SimpleContextPlugin: function () {
    return {
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
  },
  trackMyEvent: function (event) {
    // Extend the API and track something here (see advanced-template above)
    console.log(event);
  }
};

window.snowplow('addPlugin:sp1', myPlugin, 'SimpleContextPlugin');
window.snowplow('trackMyEvent', { eventProp: 'value' }); );
```
