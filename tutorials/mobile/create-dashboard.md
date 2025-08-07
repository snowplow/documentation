---
title: "Create dashboard"
position: 5
---

In this section, you'll create an interactive Streamlit dashboard to visualize your modeled mobile data. Streamlit makes it easy to build data dashboards using Python without requiring front-end development experience.

The dashboard will show key mobile app metrics like user engagement, session patterns, screen popularity, and device insights. This gives you immediate visibility into how users interact with your mobile app.

## Step 1: Download the dashboard code

Clone the repository containing the pre-built mobile analytics dashboard:

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/snowplow-incubator/snowplow-accelerator-resources.git
cd snowplow-accelerator-resources
git sparse-checkout set advanced-analytics-mobile-accelerator/streamlit
```

Navigate to the Streamlit directory:

```bash
cd advanced-analytics-mobile-accelerator/streamlit
```

## Step 2: Install requirements

Install the required Python packages using pipenv:

```bash
pipenv install
pipenv shell
```

This creates a virtual environment with all the necessary dependencies including Streamlit, Pandas, Plotly, and database connectors.

Note: If you encounter package compatibility issues, the dashboard has been tested with these specific versions:
- python = 3.9.13
- streamlit = 1.18.1
- pandas = 1.5.3
- plotly = 5.13.0

## Step 3: Configure database connection

Create a secrets file for your database credentials. This file stores your connection details securely:

```bash
mkdir -p .streamlit
```

Create `.streamlit/secrets.toml` and add your database connection details:

### Snowflake

```toml
[snowflake]
user = "your_username"
password = "your_password"
account = "your_account"
database = "your_database"
schema = "your_custom_schema_derived"
warehouse = "your_warehouse"
role = "your_role"
```

### BigQuery

```toml
[gcp_service_account]
type = "service_account"
project_id = "your_project_id"
private_key_id = "your_private_key_id"
private_key = "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
client_email = "your_service_account_email"
client_id = "your_client_id"
auth_uri = "https://accounts.google.com/o/oauth2/auth"
token_uri = "https://oauth2.googleapis.com/token"
auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs"
client_x509_cert_url = "your_client_cert_url"

[bigquery]
dataset = "your_custom_schema_derived"
```

### Databricks

```toml
[databricks]
databricks_server_hostname = "your_server_hostname"
databricks_http_path = "your_http_path"
databricks_token = "your_access_token"
schema = "your_custom_schema_derived"
catalog = "your_catalog"
```

**Important**: Make sure `.streamlit/secrets.toml` is added to your `.gitignore` file to keep your credentials secure.

## Step 4: Configure warehouse type

Edit the `Dashboard.py` file to specify which warehouse you're using. On line 10, set the warehouse variable to one of: `snowflake`, `bigquery`, or `databricks`.

```python
# Line 10 in Dashboard.py
warehouse = 'snowflake'  # Change to your warehouse type
```

## Step 5: Run the dashboard

Start the Streamlit dashboard:

```bash
streamlit run Dashboard.py
```

The dashboard will open in your web browser (typically at `http://localhost:8501`). You should see several interactive visualizations showing:

- **User metrics**: Total users, sessions, and screen views
- **Engagement patterns**: Session duration and screen engagement time
- **Device insights**: Operating systems, device types, and screen resolutions
- **Screen analytics**: Most popular screens and user navigation patterns
- **Geographic data**: User locations and regional patterns

![Mobile analytics dashboard](images/visualisation-streamlit.png)

## Dashboard features

The Streamlit dashboard provides several interactive features:

- **Date filtering**: Select specific time periods to analyze
- **Drill-down capabilities**: Click on charts to explore detailed data
- **Real-time updates**: Refresh data as new events are processed
- **Export options**: Download charts and data for further analysis

The dashboard automatically queries your modeled data tables and presents the information in an easy-to-understand format. You can use this as a foundation for building more specialized analytics or for demonstrating the value of your mobile tracking implementation.

## Troubleshooting

If you encounter database connection issues:

- **Snowflake**: Ensure your user has the appropriate role and database permissions. Try setting a default role if you see "current database" errors.
- **BigQuery**: Verify your service account has the necessary permissions and the dataset name matches your derived schema.
- **Databricks**: Check that your access token is valid and you have permissions to the specified catalog and schema.

With your dashboard running, you can now explore the insights from your mobile data and see how the complete analytics pipeline works together.
