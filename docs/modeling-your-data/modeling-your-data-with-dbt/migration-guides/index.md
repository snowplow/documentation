---
title: "Migration guides"
sidebar_position: 80
description: "Version migration guides for dbt packages with behavioral data modeling improvements and features."
schema: "TechArticle"
keywords: ["DBT Migration", "Model Migration", "Version Migration", "Upgrade Guide", "Breaking Changes", "Migration Guide"]
---

With each package release, new features and fixes become available, as well as changes to existing functionalities. In many cases, including some breaking changes, nothing needs to be done by the user of the packages to use these new features beyond simply installing the new version, although the logic within the package may have changed. All such changes are always listed in the package changelog and release posts on [Community](https://community.snowplow.io/).

In some cases certain core dependencies (such as the version of dbt required) or names of variables may change that will require the user to make changes to their models and/or configuration of the package. These are listed in the release post and changelog, and repeated in the following pages.
