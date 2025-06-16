---
title: Set Up Repository
position: 4
---

We'll not go into the details of creating github repositories and initial commits here, the [github docs](https://docs.github.com/) do an excellent job of that already. The next few steps will assume a working github repository containing the directory and data structure we created in the previous section. It will have two branches named `main` and `develop` which should be in sync.

For our repository we would like to ensure as best we can that any data structure changes are valid and problem free before they get merged into develop. We also want pushes to our `develop` branch to be automatically published to our [development](https://docs.snowplow.io//docs/data-product-studio/data-quality) environment, and pushes to `main` to be published to production.

This means we need three GitHub Actions workflows:
1. **Validate on pull request** - runs validation when PRs are opened
2. **Publish to develop** - publishes to dev environment when code is merged to develop branch  
3. **Publish to production** - publishes to prod environment when code is merged to main branch

Let's create these workflows step by step.
