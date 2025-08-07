---
title: Visualize with Streamlit
position: 13
---

Streamlit uses Python to build shareable dashboards without the need for front-end development experience. The ecommerce dashboard provides insights into customer behavior, product performance, and conversion funnels.

## Clone the repository

Run the command below to download the example dashboard:

```bash
git clone --depth 1  --filter=blob:none --sparse https://github.com/snowplow-incubator/snowplow-accelerator-resources.git ;
cd snowplow-accelerator-resources
git sparse-checkout set enhanced-ecommerce-accelerator/streamlit
```

Next, move into the streamlit repository:

```bash
cd enhanced-ecommerce-accelerator/streamlit
```

## Install requirements

Run the command below to install the project requirements and run the virtual environment.

**This implementation has been tested with the following dependencies: python = 3.9.13, streamlit = 1.18.1, pandas = 1.5.3, pandas-gbq = 0.19.1, plotly = 5.13.0, snowflake-connector-python = 3.0.0, pyarrow = 10.0.1. If you run into package compatibility issues or encounter any errors try using them to build your own environment.**

```bash
pipenv install
pipenv shell
```

## Set up database connection

Create a secrets file at `.streamlit/secrets.toml` and add your BigQuery/Databricks/Snowflake connection details. For BigQuery: make sure you specify your custom `derived` dataset which will be the source schema for the dashboard.

:::note
Ensure `secrets.toml` is in `.gitignore` to keep your information safe.
:::

### BigQuery

For BigQuery, we recommend setting up your credentials in a similar way to your dbt `profiles.yml`, as seen [here](https://docs.getdbt.com/reference/warehouse-setups/bigquery-setup#service-account-json):

```toml
# .streamlit/secrets.toml

[gcp_service_account]
type = "service_account"
project_id = "xxx"
private_key_id = "xxx"
private_key = "xxx"
client_email = "xxx"
client_id = "xxx"
auth_uri = "https://accounts.google.com/o/oauth2/auth"
token_uri = "https://oauth2.googleapis.com/token"
auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs"
client_x509_cert_url = "xxx"

[bigquery]
project_id = "xxx"
dataset = "dbt_xxx_derived"
```

### Snowflake

For Snowflake we recommend setting up your credentials in a similar way to your dbt `profile.yml`, as seen [here](https://docs.getdbt.com/reference/warehouse-setups/snowflake-setup#user--password-authentication):

```toml
# .streamlit/secrets.toml

[snowflake]
user = "xxx"
password = "xxx"
account = "xxx"
database = "xxx"
schema = "xxx" # This should point to your derived schema
warehouse = "xxx"
role = "xxx"
```

### Databricks

For Databricks we recommend setting up your credentials in a similar way to your dbt `profile.yml`, as seen [here](https://docs.getdbt.com/reference/warehouse-setups/databricks-setup#set-up-a-databricks-target):

```toml
# .streamlit/secrets.toml

[databricks]
databricks_server_hostname = "xxx"
databricks_http_path = "xxx"
databricks_token = "xxx"
schema = "xxx" # This should point to your derived schema
catalog = "xxx"
```

## Specify warehouse

Edit the warehouse you are using on line 10 of the `Healthcheck_Dashboard.py` file to one of `snowflake`, `bigquery`, or `databricks`.

## Run the Streamlit dashboard

Run the command below to run the streamlit locally:

```bash
streamlit run Dashboard.py
```

The dashboard contains a selection of common ecommerce visualizations including shopping behavior, top abandoned products, product list performance and checkout abandonment. This is a great starting point to build further analysis on top of.

![Streamlit Dashboard Example](images/streamlit_dashboard.png)

## Dashboard features

The ecommerce dashboard includes:

- **Revenue and conversion metrics** - Track key performance indicators
- **Product performance analysis** - Identify top and bottom performing products
- **Shopping behavior insights** - Understand customer journey patterns
- **Cart abandonment analysis** - Identify where customers drop off
- **Checkout funnel visualization** - Optimize checkout completion rates
- **Product list effectiveness** - Measure recommendation and search performance

This dashboard provides immediate value for ecommerce teams looking to understand and optimize customer behavior and business performance.
