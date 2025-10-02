---
title: "Troubleshooting data quality dashboard"
sidebar_position: 4
sidebar_custom_props:
  offerings:
    - cdi
sidebar_label: "Troubleshooting"
---

This guide helps you troubleshoot common errors when using the data quality dashboard with your warehouse.

## Missing warehouse permissions

When deploying a loader with the data quality add-on (API), you may encounter permission errors that prevent the dashboard from querying your warehouse.

### BigQuery: missing `bigquery.jobs.create` permission {#bigquery-permissions}

#### Error code range
- `21xxx`

#### Error description
`Missing permission 'bigquery.jobs.create' on Bigquery...`

#### Root cause
- The service account lacks the required permission to create BigQuery jobs
- This permission can be granted via the `roles/bigquery.jobUser` role

#### How to diagnose
Check if your service account has the required role:

```bash
gcloud projects get-iam-policy <PROJECT_ID> \
  --flatten="bindings[].members" \
  --filter="bindings.members:<SERVICE_ACCOUNT_EMAIL>" \
  --format="table(bindings.role)"
```

#### Fix
Grant the required role to your service account (recommended):

```bash
gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:<SERVICE_ACCOUNT_EMAIL>" \
  --role="roles/bigquery.jobUser"
```

Alternatively, if you need more granular control, create a custom role with only the `bigquery.jobs.create` permission:

```bash
gcloud iam roles create customBigQueryJobCreator \
  --project=<PROJECT_ID> \
  --title="BigQuery Job Creator" \
  --description="Create BigQuery jobs for Data Quality Dashboard" \
  --permissions="bigquery.jobs.create"

gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:<SERVICE_ACCOUNT_EMAIL>" \
  --role="projects/<PROJECT_ID>/roles/customBigQueryJobCreator"
```

#### Helpful links
- [BigQuery IAM roles documentation](https://cloud.google.com/bigquery/docs/access-control#bigquery)
- [Service account permissions](https://cloud.google.com/iam/docs/service-accounts)

### Snowflake: missing `USAGE` privilege {#snowflake-permissions}

#### Error code range
- `11xxx`

#### Error description
`Missing required privileges on Snowflake: No active warehouse selected in the current session...`

#### Root cause
- The role lacks `USAGE` privilege on the active warehouse
- Without this privilege, queries cannot be executed

#### How to diagnose
Verify current warehouse privileges for your role:

```sql
SHOW GRANTS ON WAREHOUSE <WAREHOUSE_NAME>;
SHOW GRANTS TO ROLE <ROLE_NAME>;
```

#### Fix
Grant the `USAGE` privilege on the warehouse:

```sql
GRANT USAGE ON WAREHOUSE <WAREHOUSE_NAME> TO ROLE <ROLE_NAME>;
```

Ensure the grant is properly applied:

```sql
-- Verify the grant
SHOW GRANTS ON WAREHOUSE <WAREHOUSE_NAME>;
```

#### Helpful links
- [Snowflake warehouse privileges](https://docs.snowflake.com/en/user-guide/security-access-control-privileges#warehouse-privileges)
- [Snowflake access control](https://docs.snowflake.com/en/user-guide/security-access-control-overview)

## Query timeouts

Long-running queries or resource pool exhaustion can cause the data quality dashboard to time out when fetching failed events.

### BigQuery and Snowflake query timeouts {#query-timeouts}

#### Error code range
- `12xxx`
- `22xxx`

#### Error description
`Query exceeded timeout` or `Query execution time limit exceeded`

#### Root cause
- Large volume of failed events requiring extensive scanning
- Warehouse resource pool exhaustion
- Concurrent query limits reached

#### How to diagnose

**BigQuery:**
```sql
-- Check recent query performance
SELECT
  job_id,
  user_email,
  total_slot_ms,
  total_bytes_processed,
  TIMESTAMP_DIFF(end_time, start_time, SECOND) as duration_seconds
FROM `<PROJECT_ID>.region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
  AND state = 'DONE'
  AND statement_type = 'SELECT'
ORDER BY total_slot_ms DESC
LIMIT 10;
```

**Snowflake:**
```sql
-- Check query history
SELECT
  query_id,
  query_text,
  warehouse_name,
  execution_time,
  queued_overload_time,
  bytes_scanned
FROM table(information_schema.query_history())
WHERE start_time >= DATEADD('day', -1, CURRENT_TIMESTAMP())
  AND execution_status = 'SUCCESS'
ORDER BY execution_time DESC
LIMIT 10;
```

#### Fix

**Reduce query scope:**
- If using API use smaller time windows (e.g., "Last hour" or "Last day" instead of "Last 30 days")
- If using Console you can change to legacy failed events based on telemetry data
- Query specific error types or schemas when investigating issues

**Optimize warehouse performance:**
- Review your warehouse configuration and query patterns
- Consider implementing partitioning, clustering, or other optimization strategies
- Monitor resource usage, and adjust warehouse size as needed

For detailed optimization guidance, refer to your warehouse documentation:
- [BigQuery query optimization best practices](https://cloud.google.com/bigquery/docs/best-practices-performance-overview)
- [Snowflake query performance optimization](https://docs.snowflake.com/en/user-guide/performance-query-optimization)

#### Helpful links
- [BigQuery query optimization](https://cloud.google.com/bigquery/docs/best-practices-performance-overview)
- [Snowflake query performance](https://docs.snowflake.com/en/user-guide/performance-query-optimization)
- [BigQuery clustering and partitioning](https://cloud.google.com/bigquery/docs/clustered-tables)
- [Snowflake clustering keys](https://docs.snowflake.com/en/user-guide/tables-clustering-keys)

## Additional considerations

### API behavior

- **Missing permissions**: Returns HTTP 400 with remediation instructions displayed in the UI

### Prevention tips

1. **Regular maintenance**:
   - Monitor table sizes and query performance
   - Review and optimize clustering/partitioning strategies

2. **Proactive monitoring**:
   - Monitor query execution times
   - Track failed events volume trends

3. **Access control**:
   - Document required permissions for all team members
   - Use least-privilege principles
   - Regularly audit access permissions
