---
title: "Snowtype v0.12.0 released"
description: "We’ve just released a new version of Snowtype with a minified code option for Google Tag Manager (GTM)."
date: "2025-02-12"
update_type:
  - "Release notes"
components:
  - "Trackers"
  - "Developer tools"
---
We’ve just released a new version of Snowtype with a minified code option for Google Tag Manager (GTM). This helps users overcome GTM’s 20,000-character variable limit and simplifies GTM implementation.

If the generated code is too large for the GTM tag, you will receive a warning from Snowtype. You can choose to use the .minified.js version created by Snowtype to reduce the file size. Alternatively, you can split the code into multiple variables and include them in the order they are generated, or place them directly into a Custom HTML tag.

https://www.npmjs.com/package/@snowplow/snowtype
