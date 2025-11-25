---
title: "Optional: Integrate marketing spend for attribution ROAS"
sidebar_label: "Optional: Integrate marketing spend"
position: 7
---

If you have marketing spend source data in your data warehouse then the Snowplow Attribution model package provides a configuration option that allows you to integrate your spend data with the `attribution_overview` view.

1. Create a view (or regularly updated table) based on your marketing spend data that has the columns below. Your channel and spend data will be summed separately in the `attribution_overview`, so you would not need to pre-aggregate this, it is fine to have channel twice for the same period even, but make sure that the data does not include duplicates as it might lead to unexpected outcomes.

| **Column Name** | **Data Type** | **Required**                   |
| --------------- | ------------- | ------------------------------ |
| spend_tstamp    | TIMESTAMP     | Required                       |
| channel         | STRING        | Optional (Channel or Campaign) |
| campaign        | STRING        | Optional (Channel or Campaign) |
| spend           | NUMERIC       | Required                       |

2. Update your `dbt_project.yml` file to configure the variable to the location of your spend table.

```yaml
vars:
	snowplow_attribution:
		snowplow__spend_source: 'your_schema.marketing_spend_source'
```

3. Run the dbt package

```yaml
dbt run
```

4. Congratulations, your `attribution_overview` view within your `_derived` schema should now reference your marketing spend source to provide a ROAS calculation!

:::info
Please Note: By default in the `attribution_overview` view created by the package spend is allocated associated with a channel/campaign for the 90 days prior to the conversion. You can configure this by overriding the macro within dbt.
:::
