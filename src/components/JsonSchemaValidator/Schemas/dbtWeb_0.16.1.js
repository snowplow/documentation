export const Schema = {
  "definitions": {
    passthrough_vars: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      items: {
        title: "Type",
        oneOf: [
          { type: 'string',
            title: "Column Name" },
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
      description: 'Schema (dataset) that contains your atomic events hahahahahah',
      longDescription: 'Random blah blah',
      packageDefault: 'test',
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
    snowplow__heartbeat: {
      type: 'number',
      minimum: 0,
      title: 'Heartbeat',
      description:
        'Page ping heartbeat time as defined in your tracker configuration',
    },
    snowplow__min_visit_length: {
      type: 'number',
      minimum: 0,
      title: 'Min Visit length',
      description:
        'Minimum visit length as defined in your tracker configuration',
    },
    snowplow__sessions_table: {
      type: 'string',
      title: 'Sessions Table',
      description:
        'The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. {{ ref("snowplow_web_sessions_custom") }}',
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
    snowplow__conversion_events: {
      title: 'Conversion Definition',
      description: '> Click the plus sign to add a new entry',
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
      description:
        'The number of days to use for web vital measurements (if enabled)',
    },
    snowplow__cwv_percentile: {
      type: 'number',
      minimum: 0,
      maximum: 100,
      title: 'CWV Percentile',
      description:
        'The percentile that the web vitals measurements that are produced for all page views (if enabled)',
    },
    snowplow__days_late_allowed: {
      type: 'number',
      minimum: 0,
      title: 'Days Late Allowed',
      description:
        'The maximum allowed number of days between the event creation and it being sent to the collector',
    },
    snowplow__limit_page_views_to_session: {
      type: 'boolean',
      title: 'Limit Page View to Session',
    },
    snowplow__list_event_counts: {
      type: 'boolean',
      title: 'List Per-Event Counts',
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
    snowplow__total_all_conversions: {
      type: 'boolean',
      title: 'Total All Conversions',
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
    snowplow__enable_consent: {
      type: 'boolean',
      title: 'Enable Consent Module',
    },
    snowplow__enable_cwv: {
      type: 'boolean',
      title: 'Enable Core Web Vitals Module',
    },
    snowplow__enable_iab: {
      type: 'boolean',
      title: 'Enable IAB',
    },
    snowplow__enable_ua: {
      type: 'boolean',
      title: 'Enable UA',
    },
    snowplow__enable_yauaa: {
      type: 'boolean',
      title: 'Enable YAUAA',
    },
    snowplow__has_log_enabled: {
      type: 'boolean',
      title: 'Enable Run Logs',
    },
    snowplow__ua_bot_filter: {
      type: 'boolean',
      title: 'Filter Bots',
    },
    snowplow__databricks_catalog: {
      type: 'string',
      title: '(Databricks) Catalog',
      description: 'The catalogue your atomic events table is in',
    },
    snowplow__page_view_context: {
      type: 'string',
      title: '(Redshift) Page View Context Table',
    },
    snowplow__iab_context: {
      type: 'string',
      title: '(Redshift) iab Context Table',
    },
    snowplow__ua_parser_context: {
      type: 'string',
      title: '(Redshift) UA Context Table',
    },
    snowplow__yauaa_context: {
      type: 'string',
      title: '(Redshift) YAUAA Context Table',
    },
    snowplow__consent_cmp_visible: {
      type: 'string',
      title: '(Redshift) CMP Visible Context Table',
    },
    snowplow__consent_preferences: {
      type: 'string',
      title: '(Redshift) Consent Preferences Context Table',
    },
    snowplow__cwv_context: {
      type: 'string',
      title: '(Redshift) Core Web Vitals Table',
    },
    snowplow__enable_load_tstamp: {
      type: 'boolean',
      title: '(Redshift) Enable load_tstamp',
    },
    snowplow__derived_tstamp_partitioned: {
      type: 'boolean',
      title: '(Bigquery) Dervied Timestamp Partition',
    },

    snowplow__ga4_categories_seed: {
      type: 'string',
      title: 'Seed reference for GA4 Categories',
    },
    snowplow__geo_mapping_seed: {
      type: 'string',
      title: 'Seed reference for geo mapping',
    },
    snowplow__rfc_5646_seed: {
      type: 'string',
      title: 'Seed reference for rfc 5646 (language mapping)',
    },



    snowplow__session_identifiers: {
      type: 'string',
      title: 'Session Identifiers',
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
    },
    snowplow__session_timestamp: {
      type: 'string',
      title: 'Timestamp used for incremental processing, should be your partition field',
    },
    snowplow__user_identifiers: {
      type: 'string',
      title: 'User Identifiers',
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
    },
    snowplow__user_stitching_id: {
      type: 'string',
      title: 'Field used when stitching together users',
    },



    snowplow__page_view_passthroughs: {
      title: 'Page View Passthroughs',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__session_passthroughs: {
      title: 'Session Passthroughs',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__user_first_passthroughs: {
      title: 'User First Passthroughs',
      $ref: '#/definitions/passthrough_vars'
    },
    snowplow__user_last_passthroughs: {
      title: 'User Last Passthroughs',
      $ref: '#/definitions/passthrough_vars'
    },


    snowplow__entities_or_sdes: {
      type: 'string',
      title: '(Redshift) Entities or SDEs',
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
    },
  },
}
