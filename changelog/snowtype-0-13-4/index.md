---
title: "Snowtype 0.13.4"
description: "This release adds a namespace option to the configuration for Swift, allowing users to wrap generated Snowtype classes in a Swift namespace to avoid naming conflicts."
date: "2025-11-10"
update_type:
  - "Release notes"
components:
  - "Snowtype"
---
> **\[10-Nov-2025]**

This release adds a `namespace` option to the configuration for Swift, allowing users to wrap generated Snowtype classes in a Swift namespace to avoid naming conflicts. For example, the following configuration:

```
{
    "language": "swift",
    "tracker": "snowplow-ios-tracker",
    "outpath": "./generated",
    "namespace": "Snowtype",
    ...
}
```

Will result in classes being accessed through the `Snowtype` namespace

```
let data = Snowtype.AccountConfirmed(companyCountry: "", companyName: "", ...)
```

Release: https://www.npmjs.com/package/@snowplow/snowtype/v/0.13.4
