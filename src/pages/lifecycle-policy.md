# Snowplow Lifecycle Policy

To ensure that we can innovate and evolve our core product, Snowplow reserves the right to sunset features, components, or services it provides to its customers. There can be various reasons for doing so, including but not limited to the following:

- A feature is used by a very small minority of the customers (or not used at all), thus not justifying continued support and investment
- A more modern, efficient or cost-effective way to achieve the same goal is available, which would benefit all current customers
- External upstream dependencies of a component (in its current form) are no longer maintained and/or pose a security risk

This document outlines the lifecycle stages, the guarantees we provide, and the procedures we follow.

## Lifecycle stages

Snowplow features, components, and services are sunset in two stages.

### Maintenance Mode

A feature, component, or service in Maintenance Mode is still running and accessible, but receives only critical bug fixes. No new capabilities are developed, and security patches may lag behind actively supported components. You should plan your migration to the recommended alternative during this period.

### Sunset / End-of-Life (EOL)

A feature, component, or service that has been sunset (reached End-of-Life) is fully retired. It is no longer available, accessible, or supported. You must complete your migration before the published cutoff date.

## Guarantees

### Notification

Snowplow will notify all customers, as well as the wider community (in case of source-available features or components), of any lifecycle stage change three months in advance. Given the two stages outlined above, the minimum notice for a complete sunsetting is six months.

:::note

For features or components that have a Preview status, the notification period is one month.

:::

### Substitutes

Before moving a feature, component, or service into Maintenance Mode, Snowplow will make a reasonable effort to ensure that an alternative exists that solves the same customer problem, e.g. through the use of another available feature or features. Note that this might be implemented via a Snowplow partner or another unaffiliated vendor.

Further, Snowplow will provide the necessary documentation and guidance on how to migrate to the recommended substitute. In some cases, the migration procedure will be automated and can be carried out on behalf of each customer. Otherwise, our Support and/or professional services team can be engaged to assist with the migration.

:::note

This section does not apply to features or components that have a Preview status. Snowplow reserves the right to sunset these without a direct replacement.

:::

## Procedures

### Announcement

Snowplow will announce the lifecycle stage change on our community forum (if it involves source-available components).

### Documentation

Immediately after the announcement, Snowplow will update the documentation and any source-available code repositories by marking any relevant features or components with their new lifecycle stage and providing information on the alternatives and migration steps.

Likewise, any publicly available product description will be amended to reflect the changes.

### Removal

After the Maintenance Mode period (at least three months or one month — see above), the relevant features or components will be sunset and removed from the codebase. This will be considered a breaking change, so any affected software assets (e.g. components where features were removed) will be released with a new major version.

### Rollout

Following the previous steps, Snowplow will enact the changes to disable the sunset features, components, or services for all customers. This rollout cannot be deferred.
