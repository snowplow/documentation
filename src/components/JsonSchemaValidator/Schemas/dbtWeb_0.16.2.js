export const Schema = {
  "definitions": {
    passthrough_vars: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      items: {
        title: "Type",
        oneOf: [
          {
            type: 'string',
            title: "Column Name"
          },
          {
            type: 'object',
            title: "SQL & Alias",
            properties: {
              sql: { type: 'string' },
              alias: { type: 'string' } // TODO: add regex here to make valid SQL name?
            },
            required: ['sql', 'alias'],
            additionalProperties: false
          }
        ]
      },
      uniqueItems: true,
    }
  },
  type: 'object',
  properties: {
    snowplow__atomic_schema: {
      type: 'string',
      title: 'Schema',
      description: 'Schema (dataset) that contains your atomic events',
      longDescription: 'The schema (dataset for BigQuery) that contains your atomic events table.',
      packageDefault: 'atomic',
      group: 'Warehouse and Tracker',
    },
    snowplow__database: {
      type: 'string',
      title: 'Database',
      description: 'Database that contains your atomic events',
      longDescription: 'The database that contains your atomic events table.',
      packageDefault: 'target.database',
      group: 'Warehouse and Tracker',
    },
    snowplow__dev_target_name: {
      type: 'string',
      title: 'Dev Target',
      description:
        'Target name of your development environment as defined in your `profiles.yml` file',
      longDescription: 'The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) section for more details.',
      packageDefault: 'dev',
      group: 'Warehouse and Tracker',
    },
    snowplow__events_table: {
      type: 'string',
      title: 'Events Table',
      description: 'The name of the table that contains your atomic events',
      longDescription: 'The name of the table that contains your atomic events.',
      packageDefault: 'events',
      group: 'Warehouse and Tracker',
    },
    snowplow__heartbeat: {
      type: 'number',
      minimum: 0,
      title: 'Heartbeat',
      description:
        'Page ping heartbeat time as defined in your tracker configuration',
      longDescription: 'Page ping heartbeat time as defined in your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#activity-tracking-page-pings).',
      packageDefault: '10',
      group: 'Warehouse and Tracker',
    },
    snowplow__min_visit_length: {
      type: 'number',
      minimum: 0,
      title: 'Min Visit length',
      description:
        'Minimum visit length as defined in your tracker configuration',
      longDescription: 'Minimum visit length as defined in your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#activity-tracking-page-pings).',
      packageDefault: '5',
      group: 'Warehouse and Tracker',
    },
    snowplow__sessions_table: {
      type: 'string',
      title: 'Sessions Table',
      description:
        'The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. {{ ref("snowplow_web_sessions_custom") }}',
      group: 'Warehouse and Tracker',
      longDescription: 'The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. `{{ ref(\'snowplow_web_sessions_custom\') }}`. Please see the [README](https://github.com/snowplow/dbt-snowplow-web/tree/main/custom_example) in the `custom_example` directory for more information on this sort of implementation.',
      packageDefault: '"{{ ref( \'snowplow_web_sessions\' ) }}"',
    },
    snowplow__allow_refresh: {
      type: 'boolean',
      title: 'Allow Refresh',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
    },
    snowplow__backfill_limit_days: {
      type: 'number',
      minimum: 0,
      title: 'Backfill Limit',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
      description:
        'The maximum numbers of days of new data to be processed since the latest event processed',
    },
    snowplow__conversion_events: {
      title: 'Conversion Definition',
      group: 'Operation and Logic',
      description: '> Click the plus sign to add a new entry',
      longDescription: '',
      packageDefault: '',
      type: 'array',
      minItems: 0,
      items: {
        type: 'object',
        required: ['name', 'condition'],
        title: '',
        description: 'Conversion Event',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description: 'Name of your conversion type',
          },
          condition: {
            type: 'string',
            title: 'Condition',
            description: "SQL condition e.g. event_name = 'page_view'",
          },
          value: {
            type: 'string',
            title: 'Value',
            description: 'SQL value e.g. tr_total_base',
          },
          default_value: {
            type: 'number',
            title: 'Default value',
            description: 'Default value e.g. 0',
          },
          list_events: {
            type: 'boolean',
            title: 'List all event ids?',
          },
        },
      },
      uniqueItems: true,
    },
    snowplow__cwv_days_to_measure: {
      type: 'number',
      minimum: 1,
      title: 'CWV Days To Measure',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
      description:
        'The number of days to use for web vital measurements (if enabled)',
    },
    snowplow__cwv_percentile: {
      type: 'number',
      minimum: 0,
      maximum: 100,
      title: 'CWV Percentile',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
      description:
        'The percentile that the web vitals measurements that are produced for all page views (if enabled)',
    },
    snowplow__days_late_allowed: {
      type: 'number',
      minimum: 0,
      title: 'Days Late Allowed',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
      description:
        'The maximum allowed number of days between the event creation and it being sent to the collector',
    },
    snowplow__limit_page_views_to_session: {
      type: 'boolean',
      title: 'Limit Page View to Session',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__list_event_counts: {
      type: 'boolean',
      title: 'List Per-Event Counts',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__lookback_window_hours: {
      type: 'number',
      minimum: 0,
      title: 'Event Lookback Window',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
      description:
        'The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order',
    },
    snowplow__max_session_days: {
      type: 'number',
      minimum: 0,
      title: 'Max Session Length',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
      description:
        'The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed',
    },
    snowplow__session_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Session Lookback Window',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
      description:
        'Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest',
    },
    snowplow__session_stitching: {
      type: 'boolean',
      title: 'Enable Session Stitching',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__start_date: {
      type: 'string',
      format: 'date',
      title: 'Start Date',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
      description:
        'The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`',
    },
    snowplow__total_all_conversions: {
      type: 'boolean',
      title: 'Total All Conversions',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__upsert_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Upsert Lookback Days',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
      description:
        'Number of days to look back over the incremental derived tables during the upsert',
    },
    snowplow__app_id: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'App IDs',
      longDescription: '',
      packageDefault: '',
      group: 'Contexts, Filters, and Logs',
      items: { type: 'string' },
    },
    snowplow__enable_consent: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      title: 'Enable Consent Module',
    },
    snowplow__enable_cwv: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      title: 'Enable Core Web Vitals Module',
    },
    snowplow__enable_iab: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      title: 'Enable IAB',
    },
    snowplow__enable_ua: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      title: 'Enable UA',
    },
    snowplow__enable_yauaa: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      title: 'Enable YAUAA',
    },
    snowplow__has_log_enabled: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      title: 'Enable Run Logs',
    },
    snowplow__ua_bot_filter: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      title: 'Filter Bots',
    },
    snowplow__databricks_catalog: {
      type: 'string',
      title: '(Databricks) Catalog',
      warehouse: 'Databricks',
      group: 'Warehouse Specific',
      longDescription: '',
      packageDefault: '',
      description: 'The catalogue your atomic events table is in',
    },
    snowplow__page_view_context: {
      type: 'string',
      warehouse: 'Redshift',
      title: '(Redshift) Page View Context Table',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__iab_context: {
      type: 'string',
      warehouse: 'Redshift',
      title: '(Redshift) iab Context Table',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__ua_parser_context: {
      type: 'string',
      warehouse: 'Redshift',
      title: '(Redshift) UA Context Table',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__yauaa_context: {
      type: 'string',
      warehouse: 'Redshift',
      title: '(Redshift) YAUAA Context Table',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__consent_cmp_visible: {
      type: 'string',
      warehouse: 'Redshift',
      title: '(Redshift) CMP Visible Context Table',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__consent_preferences: {
      type: 'string',
      warehouse: 'Redshift',
      title: '(Redshift) Consent Preferences Context Table',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__cwv_context: {
      type: 'string',
      warehouse: 'Redshift',
      title: '(Redshift) Core Web Vitals Table',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__enable_load_tstamp: {
      type: 'boolean',
      warehouse: 'Redshift',
      title: '(Redshift) Enable load_tstamp',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__derived_tstamp_partitioned: {
      type: 'boolean',
      warehouse: 'Bigquery',
      title: '(Bigquery) Dervied Timestamp Partition',
      longDescription: '',
      packageDefault: '',
      group: 'Warehouse Specific',
    },
    snowplow__ga4_categories_seed: {
      type: 'string',
      title: 'Seed reference for GA4 Categories',
      longDescription: 'Name of the model for the GA4 category mapping seed table, either a seed or a model (if you want to use a source, create a model to select from it).',
      packageDefault: 'snowplow_web_dim_ga4_source_categories',
      group: 'Warehouse and Tracker',
    },
    snowplow__geo_mapping_seed: {
      type: 'string',
      title: 'Seed reference for geo mapping',
      longDescription: 'Name of the model for the Geo mapping seed table, either a seed or a model (if you want to use a source, create a model to select from it).',
      packageDefault: 'snowplow_web_dim_geo_country_mapping',
      group: 'Warehouse and Tracker',
    },
    snowplow__rfc_5646_seed: {
      type: 'string',
      title: 'Seed reference for rfc 5646 (language mapping)',
      longDescription: 'Name of the model for the RFC 5646 (language) mapping seed table, either a seed or a model (if you want to use a source, create a model to select from it).',
      packageDefault: 'snowplow_web_dim_rfc_5646_language_mapping',
      group: 'Warehouse and Tracker',
    },
    snowplow__session_identifiers: {
      type: 'string',
      title: 'Session Identifiers',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      items: {
        type: 'object',
        title: "Identifier",
        properties: {
          schema: { type: 'string' }, // TODO: add regex here to make valid context/unstruct or atomic?
          field: { type: 'string' } // TODO: add regex here to make valid SQL name?
        },
        required: ['schema', 'field'],
        additionalProperties: false
      },
      uniqueItems: true,
    },
    snowplow__session_sql: {
      type: 'string',
      title: 'SQL for your session identifier',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__session_timestamp: {
      type: 'string',
      title: 'Timestamp used for incremental processing, should be your partition field',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
    },
    snowplow__user_identifiers: {
      type: 'string',
      title: 'User Identifiers',
      group: 'Operation and Logic',
      longDescription: '',
      packageDefault: '',
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      items: {
        type: 'object',
        title: "Identifier",
        properties: {
          schema: { type: 'string' }, // TODO: add regex here to make valid context/unstruct or atomic?
          field: { type: 'string' } // TODO: add regex here to make valid SQL name?
        },
        required: ['schema', 'field'],
        additionalProperties: false
      },
      uniqueItems: true,
    },
    snowplow__user_sql: {
      type: 'string',
      title: 'SQL for your user identifier',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__user_stitching_id: {
      type: 'string',
      title: 'Field used when stitching together users',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__page_view_passthroughs: {
      title: 'Page View Passthroughs',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__session_passthroughs: {
      title: 'Session Passthroughs',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__user_first_passthroughs: {
      title: 'User First Passthroughs',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__user_last_passthroughs: {
      title: 'User Last Passthroughs',
      group: 'Contexts, Filters, and Logs',
      longDescription: '',
      packageDefault: '',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__entities_or_sdes: {
      type: 'string',
      title: '(Redshift) Entities or SDEs',
      longDescription: '',
      packageDefault: '',
      warehouse: 'Redshift',
        group: 'Warehouse Specific',
        type: 'array',
        description: '> Click the plus sign to add a new entry',
        minItems: 0,
        items: {
          type: 'object',
          title: "Entity or SDE",
            properties: {
              name: { type: 'string', description: 'Table name' }, // TODO: add regex here to make valid context/unstruct table name
              prefix: { type: 'string', description: 'Prefix to add to columns' }, // TODO: add regex here to make valid SQL name?
              alias: { type: 'string', description: 'Table alias for the subquery' }, // TODO: add regex here to make valid SQL alias?
              single_entity: { type: 'boolean', title: 'Is single entity?'}
            },
            required: ['name', 'prefix'],
            additionalProperties: false
        },
      uniqueItems: true,
    },
    snowplow__page_view_stitching: {
      type: 'boolean',
      title: 'Enable Page View Stitching',
      longDescription: '',
      packageDefault: '',
      group: 'Operation and Logic', 
    },
  },
}
