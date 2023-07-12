export const dbtSnowplowMobileConfigSchema = {
  type: 'object',
  properties: {
    snowplow__atomic_schema: {
      type: 'string',
      title: 'Schema',
      description: 'Schema (dataset) that contains your atomic events',
    },
    snowplow__database: {
      type: 'string',
      title: 'Database',
      description: 'Database that contains your atomic events',
    },
    snowplow__dev_target_name: {
      type: 'string',
      title: 'Dev Target',
      description:
        'Target name of your development environment as defined in your `profiles.yml` file',
    },
    snowplow__events_table: {
      type: 'string',
      title: 'Events Table',
      description: 'The name of the table that contains your atomic events',
    },
    snowplow__sessions_table: {
      type: 'string',
      title: 'Sessions Table',
      description:
        "The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. {{ ref('snowplow_web_sessions_custom') }}",
    },
    snowplow__allow_refresh: {
      type: 'boolean',
      title: 'Allow Refresh',
    },
    snowplow__backfill_limit_days: {
      type: 'number',
      minimum: 0,
      title: 'Backfill Limit',
      description:
        'The maximum numbers of days of new data to be processed since the latest event processed',
    },
    snowplow__days_late_allowed: {
      type: 'number',
      minimum: 0,
      title: 'Days Late Allowed',
      description:
        'The maximum allowed number of days between the event creation and it being sent to the collector',
    },
    snowplow__lookback_window_hours: {
      type: 'number',
      minimum: 0,
      title: 'Event Lookback Window',
      description:
        'The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order',
    },
    snowplow__max_session_days: {
      type: 'number',
      minimum: 0,
      title: 'Max Session Length',
      description:
        'The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed',
    },
    snowplow__session_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Session Lookback Window',
      description:
        'Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest',
    },
    snowplow__session_stitching: {
      type: 'boolean',
      title: 'Enable Session Stitching',
    },
    snowplow__start_date: {
      type: 'string',
      format: 'date',
      title: 'Start Date',
      description:
        'The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`',
    },
    snowplow__upsert_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Upsert Lookback Days',
      description:
        'Number of days to look back over the incremental derived tables during the upsert',
    },
    snowplow__app_id: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'App IDs',
      items: { type: 'string' },
    },
    snowplow__enable_app_errors_module: {
      type: 'boolean',
      title: 'Enable App Errors module',
    },
    snowplow__enable_application_context: {
      type: 'boolean',
      title: 'Enable Application context',
    },
    snowplow__enable_geolocation_context: {
      type: 'boolean',
      title: 'Enable Geolocation context',
    },
    snowplow__enable_mobile_context: {
      type: 'boolean',
      title: 'Enable Mobile context',
    },
    snowplow__enable_screen_context: {
      type: 'boolean',
      title: 'Enable Screen context',
    },
    snowplow__has_log_enabled: {
      type: 'boolean',
      title: 'Enable Run Logs',
    },
    snowplow__platform: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'Platforms',
      items: { type: 'string' },
    },
    snowplow__databricks_catalog: {
      type: 'string',
      title: '(Databricks) Catalog',
      description: 'The catalogue your atomic events table is in',
    },
    snowplow__session_context: {
      type: 'string',
      title: '(Redshift) Session Context Table',
    },
    snowplow__mobile_context: {
      type: 'string',
      title: '(Redshift) Mobile Context Table',
    },
    snowplow__geolocation_context: {
      type: 'string',
      title: '(Redshift) Geolocation Context Table',
    },
    snowplow__application_context: {
      type: 'string',
      title: '(Redshift) Application Context Table',
    },
    snowplow__screen_context: {
      type: 'string',
      title: '(Redshift) Screen Context Table',
    },
    snowplow__app_errors_table: {
      type: 'string',
      title: '(Redshift) App Errors Context Table',
    },
    snowplow__screen_view_events: {
      type: 'string',
      title: '(Redshift) Screen View Events Table',
    },
    snowplow__derived_tstamp_partitioned: {
      type: 'boolean',
      title: '(Bigquery) Dervied Timestamp Partition',
    },
  },
}
