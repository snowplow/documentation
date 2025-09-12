---
title: "Using Different Sessionisation"
description: "Implement custom sessionization logic in dbt for specialized behavioral analytics requirements."
schema: "TechArticle"
keywords: ["Custom Sessionization", "Session Logic", "Session Rules", "Custom Sessions", "Session Definition", "Session Models"]
sidebar_position: 50
---

Using a different sessionisation is a rare use case for our packages, but can be done in 2 different ways. The use case for each approach is often different so we treat them differently on this page.

## Tweaking the session identifiers
If you only need to slightly alter the identifiers, such as using an entity value where it exists instead of just the default fields, you can do this by following the details in the [custom identifiers](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/identity-stitching/index.md) page to alter this via the existing variables of our packages.

## Using the incremental logic for all custom models
The more large-scale use case is when you wish to take advantage of our [incremental sessionisation logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md), but have no need for any of the other derived tables in our packages. A common use case for this is when you want to do daily aggregates and reporting, in this case your "session" identifier is actually the day of the event.

For this purpose, rather than disable all the models you don't need, it would be easier to use the `base` macros and tables at the root of your project, or stand up a standalone project. For this purpose we have the [dbt-template](https://github.com/snowplow-incubator/dbt-template) repository which has all the core logic of our packages set up, including all the variables and models.

Once you have forked/copied this project, you will need to replace all instances of `<YOUR_PACKAGE_NAME>` across the package with the name you want for this project. This includes file names, not just a find and replace in the files.

You can then make changes to the variables as required, for example the following changes would give you a daily "sessionisation" to allow you to easily do incremental daily reporting:

```diff title=dbt_project.yml
...
vars:
- <YOUR PACKAGE NAME>:
+ my_package:
    ...
    snowplow__app_id: []
-   # snowplow__session_sql: 'e.domain_sessionid'
+   snowplow__session_sql: "DATE(e.derived_tstamp)"
    # snowplow__user_sql: 'e.domain_userid'
    # snowplow__custom_sql: ''
    ...
...
```
