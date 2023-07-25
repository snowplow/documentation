export const dbtSnowplowFractributionConfigSchema = {
  type: 'object',
  properties: {
    snowplow__page_views_source: {
      type: 'string',
      title: 'Page Views Source',
      description: 'Source of the snowplow_web_page_views table',
    },
    snowplow__web_user_mapping_table: {
      type: 'string',
      title: 'User Mapping Table',
      description: 'Schema and table of the User Mapping table',
    },
    snowplow__conversions_source: {
      type: 'string',
      title: 'Conversions Source',
      description: 'Source of your conversions table',
    },
    snowplow__conversion_window_start_date: {
      type: 'string',
      format: 'date',
      title: 'Conversions Window Start Date',
      description: 'Start date (UTC) of your conversion window',
    },
    snowplow__conversion_window_end_date: {
      type: 'string',
      format: 'date',
      title: 'Conversions Window End Date',
      description: 'End date (UTC) of your conversion window',
    },
    snowplow__path_lookback_days: {
      type: 'integer',
      title: 'Path Lookback (days)',
      description:
        'Days to lookback from the conversion to include in the path',
      minimum: 1,
    },
    snowplow__path_lookback_steps: {
      type: 'integer',
      title: 'Path Lookback Steps',
      description:
        'Maximum number of steps before the conversion (0 is unlimited)',
      minimum: 0,
    },
    snowplow__path_transforms: {
      type: 'object',
      description: 'Please select the path transformations, in the order to apply them. Some transformations have arguments that need specifying, others have no arguments but need a value of `null` if you wish to use this transformation.',
      properties: {
        exposure_path: {
          type: ['string', 'null'],
          title: 'Exposure path',
          description: 'Consecutive same channels are reduced to one',
          enum: [null],
        },
        first_path: {
          type: ['string', 'null'],
          title: 'First Path',
          description: 'First occurrence of path is kept',
          enum: [null],
        },
        frequency_path: {
          type: ['string', 'null'],
          title: 'Frequency Path',
          description: 'Keeps count of channel frequency',
          enum: [null],
        },
        remove_if_last_and_not_all: {
          type: 'string',
          title: 'Remove If Last And Not All',
          description:
            'Remove the channel if it is the last, but not all, channel',
        },
        remove_if_not_all: {
          type: 'string',
          title: 'Remove If Not All',
          description:
            "Remove all occurrences of the channel, if it isn't the only channel",
        },
        unique_path: {
          type: ['string', 'null'],
          title: 'Unique Path',
          description: 'No change',
          enum: [null],
        },
      },
    },
    snowplow__use_snowplow_web_user_mapping_table: {
      type: 'boolean',
      description: 'Use Snowplow Web User Mapping Table?',
    },
    snowplow__conversions_source_filter: {
      type: 'string',
      description: 'A timestamp field the conversion source field is partitioned on for optimized filtering',
    },
    snowplow__conversions_source_filter_buffer_days: {
      type: 'integer',
      title: 'The number of days to extend the filter',
    },
    snowplow__channels_to_exclude: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'Channels to Exclude',
      items: { type: 'string' },
    },
    snowplow__conversion_hosts: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: 'Conversion Hosts',
      items: { type: 'string' },
    },
    snowplow__consider_intrasession_channels: {
      type: 'boolean',
      title: 'Consider Intra-sessions Channels',
    },
    snowplow__run_python_script_in_snowpark: {
      type: 'boolean',
      title: '(Snowflake) Run the python script via Snowpark',
    },
    snowplow__attribution_model_for_snowpark: {
      type: 'string',
      title: '(Snowflake) Attribution Model type',
      enum: ['shapley', 'first_touch', 'last_touch', 'position_based', 'linear']
    },
  },
}
