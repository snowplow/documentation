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
      longDescription: 'The [target name](https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/package-elements/manifest-tables/) section for more details.',
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
      longDescription: 'Page ping heartbeat time as defined in your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#activity-tracking-page-pings).',
      packageDefault: '10',
      group: 'Warehouse and Tracker',
    },
    snowplow__min_visit_length: {
      type: 'number',
      minimum: 0,
      title: 'Min Visit length',
      description:
        'Minimum visit length as defined in your tracker configuration',
      longDescription: 'Minimum visit length as defined in your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#activity-tracking-page-pings).',
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
      longDescription: 'Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/package-elements/manifest-tables/) section for more details.',
      packageDefault: 'false',
    },
    snowplow__backfill_limit_days: {
      type: 'number',
      minimum: 0,
      title: 'Backfill Limit',
      group: 'Operation and Logic',
      longDescription: 'The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the [incremental logic](docs/modeling-your-data/modeling-your-data-with-dbt/package-elements/incremental-processing/#package-state) section for more details.',
      packageDefault: '30',
      description:
        'The maximum numbers of days of new data to be processed since the latest event processed',
    },
    snowplow__conversion_events: {
      title: 'Conversion Definition',
      group: 'Operation and Logic',
      description: '> Click the plus sign to add a new entry',
      longDescription: 'A list of dictionaries that define a conversion event for your modeling, to add the relevant columns to the sessions table. The dictionary keys are `name` (required), `condition` (required), `value`, `default_value`, and `list_events`. For more information see the [package documentation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/conversions/).',
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
      longDescription: 'The number of days to use for web vital measurements (if enabled).',
      packageDefault: '28',
      description:
        'The number of days to use for web vital measurements (if enabled)',
    },
    snowplow__cwv_percentile: {
      type: 'number',
      minimum: 0,
      maximum: 100,
      title: 'CWV Percentile',
      group: 'Operation and Logic',
      longDescription: 'The percentile that the web vitals measurements that are produced for all page views (if enabled).',
      packageDefault: '75',
      description:
        'The percentile that the web vitals measurements that are produced for all page views (if enabled)',
    },
    snowplow__days_late_allowed: {
      type: 'number',
      minimum: 0,
      title: 'Days Late Allowed',
      group: 'Operation and Logic',
      longDescription: 'The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.',
      packageDefault: '3',
      description:
        'The maximum allowed number of days between the event creation and it being sent to the collector',
    },
    snowplow__limit_page_views_to_session: {
      type: 'boolean',
      title: 'Limit Page View to Session',
      longDescription: 'A boolean whether to ensure page view aggregations are limited to pings in the same session as the `page_view` event, to ensure deterministic behavior. If false you may get different results for the same `page_view` depending on which sessions are included in a run. See the [stray page ping](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/#stray-page-pings) section for more information.',
      packageDefault: 'true',
      group: 'Operation and Logic',
    },
    snowplow__list_event_counts: {
      type: 'boolean',
      title: 'List Per-Event Counts',
      longDescription: 'A boolean whether to include a json-type (varies by warehouse) column in the sessions table with a count of events for each `event_type` in that session.',
      packageDefault: 'false',
      group: 'Operation and Logic',
    },
    snowplow__lookback_window_hours: {
      type: 'number',
      minimum: 0,
      title: 'Event Lookback Window',
      longDescription: 'The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.',
      packageDefault: '6',
      group: 'Operation and Logic',
      description:
        'The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order',
    },
    snowplow__max_session_days: {
      type: 'number',
      minimum: 0,
      title: 'Max Session Length',
      longDescription: 'The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.',
      packageDefault: '3',
      group: 'Operation and Logic',
      description:
        'The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed',
    },
    snowplow__session_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Session Lookback Window',
      longDescription: 'Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.',
      packageDefault: '730',
      group: 'Operation and Logic',
      description:
        'Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest',
    },
    snowplow__session_stitching: {
      type: 'boolean',
      title: 'Enable Session Stitching',
      longDescription: 'Determines whether to apply the user mapping to the sessions table. Please see the [User Mapping](docs/modeling-your-data/modeling-your-data-with-dbt/package-features/identity-stitching/) section for more details.',
      packageDefault: 'true',
      group: 'Operation and Logic',
    },
    snowplow__start_date: {
      type: 'string',
      format: 'date',
      title: 'Start Date',
      group: 'Operation and Logic',
      longDescription: 'The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`',
      packageDefault: '2020-01-01',
      description:
        'The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`',
    },
    snowplow__total_all_conversions: {
      type: 'boolean',
      title: 'Total All Conversions',
      longDescription: 'A boolean flag whether to calculate and add the `cv__all_volume` and `cv__all_total` columns. For more information see the [package documentation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/conversions/).',
      packageDefault: 'false',
      group: 'Operation and Logic',
    },
    snowplow__upsert_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Upsert Lookback Days',
      group: 'Operation and Logic',
      longDescription: 'Number of days to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the [Snowplow Optimized Materialization](docs/modeling-your-data/modeling-your-data-with-dbt/package-elements/optimized-upserts/) section for more details.',
      packageDefault: '30',
      description:
        'Number of days to look back over the incremental derived tables during the upsert',
    },
    snowplow__app_id: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'App IDs',
      longDescription: 'A list of `app_id`s to filter the events table on for processing within the package.',
      packageDefault: '[ ] (no filter applied)',
      group: 'Contexts, Filters, and Logs',
      items: { type: 'string' },
    },
    snowplow__enable_consent: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Flag to enable the [consent](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/consent-module/) module.',
      packageDefault: 'false',
      title: 'Enable Consent Module',
    },
    snowplow__enable_cwv: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Flag to enable the [Core Web Vitals](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/core-web-vitals-module/) module.',
      packageDefault: 'false',
      title: 'Enable Core Web Vitals Module',
    },
    snowplow__enable_iab: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Flag to include the [IAB enrichment](/docs/enriching-your-data/available-enrichments/iab-enrichment/) data in the models.',
      packageDefault: 'false',
      title: 'Enable IAB',
    },
    snowplow__enable_ua: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Flag to include the [UA Parser enrichment](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/) data in the models.',
      packageDefault: 'false',
      title: 'Enable UA',
    },
    snowplow__enable_yauaa: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Flag to include the [YAUAA enrichment](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/) data in the models.',
      packageDefault: 'false',
      title: 'Enable YAUAA',
    },
    snowplow__has_log_enabled: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'When executed, the package logs information about the current run to the CLI. This can be disabled by setting to `false`.',
      packageDefault: 'true',
      title: 'Enable Run Logs',
    },
    snowplow__ua_bot_filter: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Flag to filter out bots via the `useragent` string pattern match.',
      packageDefault: 'true',
      title: 'Filter Bots',
    },
    snowplow__databricks_catalog: {
      type: 'string',
      title: '(Databricks) Catalog',
      warehouse: 'Databricks',
      group: 'Warehouse Specific',
      longDescription: "The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic').",
      packageDefault: 'hive_metastore',
      description: 'The catalogue your atomic events table is in',
    },
    snowplow__enable_load_tstamp: {
      type: 'boolean',
      warehouse: 'Redshift',
      title: '(Redshift) Enable load_tstamp',
      longDescription: 'Flag to include the `load_tstamp` column in the base events this run model. This should be set to true (the default) unless you are using the Postgres loader or an RDB loader version less than 4.0.0. It must be true to use consent models on Postgres and Redshift.',
      packageDefault: 'true',
      group: 'Warehouse Specific',
    },
    snowplow__derived_tstamp_partitioned: {
      type: 'boolean',
      warehouse: 'Bigquery',
      title: '(Bigquery) Dervied Timestamp Partition',
      longDescription: 'Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp`.',
      packageDefault: 'true',
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
      longDescription: 'A list of key:value dictionaries which contain all of the contexts and fields where your session identifiers are located. For each entry in the list, if your map contains the `schema` value `atomic`, then this refers to a field found directly in the atomic `events` table. If you are trying to introduce a context/entity with an identifier in it, the package will look for the context in your events table with the name specified in the `schema` field. It will use the specified value in the `field` key as the field name to access. For Redshift/Postgres, using the `schema` key the package will try to find a table in your `snowplow__events_schema` schema with the same name as the `schema` value provided, and join that. If multiple fields are specified, the package will try to coalesce all fields in the order specified in the list. For a better understanding of the advanced usage of this variable, please see the [Custom Identifiers](docs/modeling-your-data/modeling-your-data-with-dbt/package-features/customer-identifiers/) section for more details.',
      packageDefault: '[{"schema" : "atomic", "field" : "domain_sessionid"}]',
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      items: {
        type: 'object',
        title: "Identifier",
        properties: {
          schema: { type: 'string', description: 'The schema name of your events table, atomic in most use cases, alternatively for sdes/contexts this should instead be the name of the field itself' }, // TODO: add regex here to make valid context/unstruct or atomic?
          field: { type: 'string', description: 'The name of the field to use as user identifier, alternatively, in case of sdes/contexts it is the name of the element that refers to the field to be extracted' } // TODO: add regex here to make valid SQL name?
        },
        required: ['schema', 'field'],
        additionalProperties: false
      },
      uniqueItems: true,
    },
    snowplow__session_sql: {
      type: 'string',
      title: 'SQL for your session identifier',
      longDescription: 'This allows you to override the `session_identifiers` SQL, to define completely custom SQL in order to build out a session identifier for your events. If you are interested in using this instead of providing identifiers through the `session_identifiers` variable, please see the [Custom Identifiers](docs/modeling-your-data/modeling-your-data-with-dbt/package-features/customer-identifiers/) section for more details on how to do that.',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__session_timestamp: {
      type: 'string',
      title: 'Timestamp used for incremental processing, should be your partition field',
      group: 'Operation and Logic',
      longDescription: "Determines which timestamp is used to build the sessionization logic. It's a good idea to have this timestamp be the same timestamp as the field you partition your events table on.",
      packageDefault: 'collector_tstamp',
    },
    snowplow__user_identifiers: {
      type: 'string',
      title: 'User Identifiers',
      group: 'Operation and Logic',
      longDescription: 'A list of key:value dictionaries which contain all of the contexts and fields where your user identifiers are located. For each entry in the list, if your map contains the `schema` value `atomic`, then this refers to a field found directly in the atomic `events` table. If you are trying to introduce a context/entity with an identifier in it, the package will look for the context in your events table with the name specified in the `schema` field. It will use the specified value in the `field` key as the field name to access. For Redshift/Postgres, using the `schema` key the package will try to find a table in your `snowplow__events_schema` schema with the same name as the `schema` value provided, and join that. If multiple fields are specified, the package will try to coalesce all fields in the order specified in the list. For a better understanding of the advanced usage of this variable, please see the [Custom Identifiers](docs/modeling-your-data/modeling-your-data-with-dbt/package-features/customer-identifiers/) section for more details.',
      packageDefault: '[{"schema" : "atomic", "field" : "domain_userid"}]',
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      items: {
        type: 'object',
        title: "Identifier",
        properties: {
          schema: { type: 'string', description: 'The schema name of your events table, atomic in most use cases, alternatively for sdes/contexts this should instead be the name of the field itself' }, // TODO: add regex here to make valid context/unstruct or atomic?
          field: { type: 'string', description: 'The name of the field to use as user identifier, alternatively, in case of sdes/contexts it is the name of the element that refers to the field to be extracted' } // TODO: add regex here to make valid SQL name?
        },
        required: ['schema', 'field'],
        additionalProperties: false
      },
      uniqueItems: true,
    },
    snowplow__user_sql: {
      type: 'string',
      title: 'SQL for your user identifier',
      longDescription: 'This allows you to override the `user_identifiers` SQL, to define completely custom SQL in order to build out a user identifier for your events. If you are interested in using this instead of providing identifiers through the `user_identifiers` variable, please see the [Custom Identifiers](docs/modeling-your-data/modeling-your-data-with-dbt/package-features/customer-identifiers/) section for more details on how to do that.',
      packageDefault: '',
      group: 'Operation and Logic',
    },
    snowplow__user_stitching_id: {
      type: 'string',
      title: 'Field used when stitching together users',
      longDescription: 'This is the user_id you want to stitch to sessions (and/or page views) with matching domain_userids. It supports raw `sql` expressions.',
      packageDefault: 'user_id',
      group: 'Operation and Logic',
    },
    snowplow__page_view_passthroughs: {
      title: 'Page View Passthroughs',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Field(s) to carry through from the events table to the derived table. The field is from the `page_view` event record. Aggregation is not supported. A list of either flat column names from the events table or a dictionary with the keys `sql` for the SQL code to select the column and `alias` for the alias of the column in the output.',
      packageDefault: '[ ] (no passthroughs)',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__session_passthroughs: {
      title: 'Session Passthroughs',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Field(s) to carry through from the events table to the derived table. The field is based on the first `page_view` or `page_ping` event for that session. Aggregation is not supported. A list of either flat column names from the events table or a dictionary with the keys `sql` for the SQL code to select the column and `alias` for the alias of the column in the output.',
      packageDefault: '[ ] (no passthroughs)',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__user_first_passthroughs: {
      title: 'User First Passthroughs',
      group: 'Contexts, Filters, and Logs',
      longDescription: ' Field(s) to carry through from the events table to the derived table. The field is based on the first session record for that user. Aggregation is not supported. A list of either flat column names from the events table or a dictionary with the keys `sql` for the SQL code to select the column and `alias` for the alias of the column in the output.',
      packageDefault: '[ ] (no passthroughs)',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__user_last_passthroughs: {
      title: 'User Last Passthroughs',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'Field(s) to carry through from the events table to the derived table. The field is based on the last session record for that user. Aggregation is not supported. A list of either flat column names from the events table or a dictionary with the keys `sql` for the SQL code to select the column and `alias` for the alias of the column in the output. Note flat fields will be aliased with a `last_` prefix, dictionary provided aliases will not by default.',
      packageDefault: '[ ] (no passthroughs)',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__entities_or_sdes: {
      type: 'string',
      title: '(Redshift) Entities or SDEs',
      longDescription: 'A list of dictionaries defining the `entity` or `self-describing` event tables to join onto your base events table. Please use the tool below or see the section on [Utilizing custom contexts or SDEs](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/) for details of the structure.',
      packageDefault: '[]',
      warehouse: 'Redshift',
      group: 'Warehouse Specific',
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      items: {
        type: 'object',
        title: "Entity or SDE",
        properties: {
          schema: { type: 'string', description: 'Table name' }, // TODO: add regex here to make valid context/unstruct table name
          prefix: { type: 'string', description: 'Prefix to add to columns' }, // TODO: add regex here to make valid SQL name?
          alias: { type: 'string', description: 'Table alias for the subquery' }, // TODO: add regex here to make valid SQL alias?
          single_entity: { type: 'boolean', title: 'Is single entity?' }
        },
        required: ['schema', 'prefix'],
        additionalProperties: false
      },
      uniqueItems: true,
    },
    snowplow__page_view_stitching: {
      type: 'boolean',
      title: 'Enable Page View Stitching',
      longDescription: 'Determines whether to apply the user mapping to the page views table. Note this can be an expensive operation to do every run. One way to mitigate this is by running this update with less frequency than your usual run by enabling this variable only for that specific run. Please see the [User Mapping](docs/modeling-your-data/modeling-your-data-with-dbt/package-features/identity-stitching/) section for more details.',
      packageDefault: 'false',
      group: 'Operation and Logic',
    },
  },
}
