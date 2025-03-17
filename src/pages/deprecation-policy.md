# Snowplow Software Deprecation Policy

To ensure that we can innovate and evolve our core product, Snowplow reserves the right to deprecate features, components, or services it provides to its customers. There can be various reasons for doing so, including but not limited to the following:

- A feature is used by a very small minority of the customers (or not used at all), thus not justifying continued support and investment
- A more modern, efficient or cost-effective way to achieve the same goal is available, which would benefit all current customers
- External upstream dependencies of a component (in its current form) are no longer maintained and/or pose a security risk

This document outlines the guarantees we provide and the procedures we follow for deprecation.

## Guarantees

### Notification

Snowplow will notify all customers, as well as the wider community (in case of source-available features or components), of any product or service deprecation six months in advance. From that point onwards, we will not make changes to the feature, component or service in question, aside from critical security fixes. After six months, it will no longer be supported and will be switched off (where applicable).

:::note

For features or components that have a Preview status, the notification period is 1 month.

:::

### Substitutes

Before deprecating a feature, component, or service, Snowplow will make a reasonable effort to ensure that an alternative exists that solves the same customer problem, e.g. through the use of another available feature or features. Note that this might be implemented via a Snowplow partner or another unaffiliated vendor.

Further, Snowplow will provide the necessary documentation and guidance on how to migrate to the recommended substitute. In some cases, the migration procedure will be automated and can be carried out on behalf of each customer. Otherwise, our Support and/or professional services team can be engaged to assist with the migration.

:::note

This section does not apply to features or components that have a Preview status. Snowplow reserves the right to deprecate these without a direct replacement.

:::

## Procedures

### Announcement

Snowplow will announce the deprecation on our community forum (if it involves source-available components).

### Documentation

Immediately after the announcement, Snowplow will update the documentation and any source-available code repositories by marking any relevant features or components as deprecated and providing information on the alternatives and migration steps.

Likewise, any publicly available product description will be amended to reflect the changes.

### Removal

After the deprecation period (six months or one month — see above), the relevant features or components will be removed from the codebase. This will be considered a breaking change, so any affected software assets (e.g. components where features were removed) will be released with a new major version.

### Rollout

Following the previous steps, Snowplow will enact the changes to disable the deprecated features, components, or services for all customers. This rollout cannot be deferred.
