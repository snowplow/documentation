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
    snowplow__conversions_source: {
      type: 'string',
      title: 'Conversions Source',
      description: 'Source of conversion events',
      longDescription: 'The source (schema and table) of your conversion events, likely your atomic events table.',
      packageDefault: "{{ source('atomic', 'events') }}",
      group: 'Warehouse and Tracker',
    },
    snowplow__conversion_path_source: {
      type: 'string',
      title: 'Conversion Path Source',
      description: 'Source of paths (touchpoints) table',
      longDescription: 'The source (schema and table) of the  paths (touchpoints). By default it is the derived `snowplow_unified_views` table.',
      packageDefault: "{{ source('derived', 'snowplow_unified_views') }}",
      group: 'Warehouse and Tracker',
    },
    snowplow__conversion_window_start_date: {
      type: 'string',
      format: 'date',
      title: 'Conversion Window Start Date',
      group: 'Operation and Logic',
      longDescription: 'The start date in UTC for the window of conversions to include. It is only used for the drop and recompute report tables/views.',
      packageDefault: 'current_date()-31',
    },
    snowplow__conversion_window_end_date: {
      type: 'string',
      format: 'date',
      title: 'Conversion Window End Date',
      group: 'Operation and Logic',
      longDescription: 'The end date in UTC for the window of conversions to include. It is only used for the drop and recompute report tables/views.',
      packageDefault: '',
    },
    snowplow__conversion_window_days: {
      type: 'number',
      minimum: 0,
      title: 'Conversion Window Days',
      group: 'Operation and Logic',
      longDescription: 'The last complete nth number of days (calculated from the last processed pageview within page_views_source) to dynamically update the conversion_window_start_date and end_date with. Will only apply if both variables are left as an empty string.',
      packageDefault: '30',
    },
    snowplow__path_lookback_days: {
      type: 'number',
      minimum: 0,
      title: 'Path Lookback Days',
      group: 'Operation and Logic',
      longDescription: 'Restricts the model to marketing channels within this many days of the conversion (values of 30, 14 or 7 are recommended).',
      packageDefault: '30',
    },
    snowplow__path_lookback_steps: {
      type: 'number',
      minimum: 0,
      title: 'Path Lookback Steps',
      group: 'Operation and Logic',
      longDescription: 'The limit for the number of marketing channels to look at before the conversion.',
      packageDefault: "0 (unlimited)",
    },
    snowplow__path_transforms: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'Path Transforms',
      longDescription: 'Dictionary of path transforms (and their argument, `null` if none) to perform on the full conversion path (see the transform path options in our [docs](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/)).',
      packageDefault: "{'exposure_path': null}",
      group: 'Contexts, Filters, and Logs',
      items: {
        type: 'object',
        title: "Path transform",
        oneOf: [
          {
            title: "exposure",
            required: ["exposure"],
            properties: {
              exposure: { type: "string", "default": "null" }
            },
          },
          {
            title: "first",
            required: ["first"],
            properties: {
              first: { type: "string", "default": "null"}
            },
          },
          {
            title: "unique",
            required: ["unique"],
            properties: {
              unique: { type: "string", "default": "null"}
            },
          },
          {
            title: "remove if last and not all",
            required: ["remove_if_last_and_not_all"],
            properties: {
              remove_if_last_and_not_all: { type: "string" }
            },
          },
          {
            title: "remove if not all",
            required: ["remove_if_not_all"],
            properties: {
              remove_if_not_all: { type: "string" }
            },
          }
        ],
      },
      uniqueItems: true,
    },
    snowplow__channels_to_exclude: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'Channels to Exclude',
      longDescription: 'List of channels to exclude from analysis (empty to keep all channels). For example, users may want to exclude the `Direct` channel from the analysis.',
      packageDefault: '[ ] (no filter applied)',
      group: 'Contexts, Filters, and Logs',
      items: { type: 'string' },
    },
    snowplow__channels_to_include: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'Channels to Include',
      longDescription: 'List of channels to include in the analysis (empty to keep all channels). For example, users may want to include the `Direct` channel only in the analysis.',
      packageDefault: '[ ] (no filter applied)',
      group: 'Contexts, Filters, and Logs',
      items: { type: 'string' },
    },
    snowplow__campaigns_to_exclude: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'Campaignes to Exclude',
      longDescription: 'List of channels to exclude from analysis (empty to keep all campaigns).',
      packageDefault: '[ ] (no filter applied)',
      group: 'Contexts, Filters, and Logs',
      items: { type: 'string' },
    },
    snowplow__campaigns_to_include: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'Campaigns to Include',
      longDescription: 'List of channels to include in the analysis (empty to keep all campaigns).',
      packageDefault: '[ ] (no filter applied)',
      group: 'Contexts, Filters, and Logs',
      items: { type: 'string' },
    },
    snowplow__conversion_hosts: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'URL Hosts',
      longDescription: '`url_hosts` to filter to in the data processing',
      packageDefault: '[] (no filter applied)',
      group: 'Contexts, Filters, and Logs',
      items: { type: 'string' },
    },
    snowplow__consider_intrasession_channels: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'If `false`, only considers the channel at the start of the session (i.e. first page view). If `true`, considers multiple channels in the conversion session as well as historically.',
      packageDefault: 'true',
      title: 'Consider Intrasession Channels',
    },
    snowplow__spend_source: {
      title: 'Conversions Source',
      description: 'Source of marketing spend table',
      longDescription: 'The source (schema and table) of your marketing spend source. Optional, needed for the ROAS calculation of the snowplow_attribution_overview. Should be changed to a table reference with `spend` by `channel` and/or `campaign` by `spend_tstamp` (which denotes a timestamp field) information.',
      type: 'string',
      packageDefault: "{{ source('atomic', 'events') }}",
      group: 'Warehouse and Tracker',
    },
    snowplow__conversion_stitching: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'This should align with the variable of the same name inside the unified package. If allowed it will consider the stitched_user_id field, not the user_identifier in the source data for more accurate results.',
      packageDefault: 'false',
      title: 'Conversion Stitching',
    },
    snowplow__conversion_clause: {
      type: 'string',
      title: 'Conversions Clause',
      group: 'Operation and Logic',
      longDescription: 'A string of sql to filter on certain conversion events.',
      packageDefault: 'cv_value > 0',
    },
    snowplow__attribution_list: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 1,
      title: 'Attribution List',
      longDescription: 'List of attribution types to use for reporting. Can be at least one of: first_touch, last_touch, linear, position_based).',
      packageDefault: "['first_touch', 'last_touch', 'linear', 'position_based']",
      group: 'Contexts, Filters, and Logs',
      items: { type: 'string' },
    },
    snowplow__attribution_start_date: {
      type: 'string',
      format: 'date',
      title: 'Attribution Start Date',
      group: 'Operation and Logic',
      longDescription: 'The date to start processing events from in the package on first run or a full refresh, based on the cv_tstamp (conversion timestamp).',
      packageDefault: '2023-01-01',
      description:
        'The date to start processing events from in the package on first run or a full refresh, based on `cv_tstamp`',
    },
    snowplow__enable_paths_to_non_conversion: {
      type: 'boolean',
      group: 'Contexts, Filters, and Logs',
      longDescription: 'If `true`, enable the paths_to_non_conversion model, which is a drop and recompute table that may be needed for more in-depth attribution analysis (used in the `path_summary` table as well)',
      packageDefault: 'false',
      title: 'Enable Paths To Non Conversion',
    },
    snowplow__dev_target_name: {
      type: 'string',
      title: 'Dev Target',
      description:
        'Target name of your development environment as defined in your `profiles.yml` file',
      longDescription: 'The [target name](https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/) section for more details.',
      packageDefault: 'dev',
      group: 'Warehouse and Tracker',
    },
  },
}
