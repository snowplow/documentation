---
id: "Snowbridge 4.x upgrade"
title: "Snowbridge 4.x upgrade guide"
sidebar_label: "Snowbridge 4.x upgrade"
date: "2026-03-11"
sidebar_position: 400
description: "Upgrade Snowbridge to version 4.X.X with configuration changes for transformations, new features, and breaking changes."
keywords: ["snowbridge 4.x upgrade", "upgrade guide", "snowbridge migration", "version 4"]
---

## Version 4.0.0 Breaking Changes

### HTTP target: ordered response rule evaluation

**Breaking change**: response rules are now evaluated in the order they are defined in the configuration, rather than being organized in separate `invalid` and `setup` blocks.

**Migration required**: you must update your HTTP target configuration to specify a `type` attribute for each rule:

**Before:**
```hcl
response_rules {
  invalid {
    http_codes = [400]
    body = "Invalid value for 'purchase' field"
  }
  setup {
    http_codes = [401, 403]
  }
}
```

**After (4.0.0):**
```hcl
response_rules {
  rule {
    type = "invalid"
    http_codes = [400]
    body = "Invalid value for 'purchase' field"
  }
  rule {
    type = "setup"
    http_codes = [401, 403]
  }
}
```

**Important**: rules are now evaluated in the order they appear in your configuration. The first matching rule determines the error type.
