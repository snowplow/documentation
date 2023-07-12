export const dbtSnowplowMediaPlayerConfigSchema = {
  type: 'object',
  properties: {
    snowplow__percent_progress_boundaries: {
      type: 'array',
      description: '> Click the plus sign to add a new entry',
      minItems: 0,
      title: '% Progress Boundaries',
      items: { type: 'integer', minimum: 0, maximum: 100 },
    },
    snowplow__complete_play_rate: {
      type: 'number',
      maximum: 1,
      minimum: 0,
      multipleOf: 0.001,
      title: 'Complete Play Rate',
      description: 'Rate for a play to be considered complete e.g. 0.99 = 99%',
    },
    snowplow__max_media_pv_window: {
      type: 'integer',
      title: 'Media Page View Window (hour)',
      description:
        'Delay between events being processed into your base table and your stats table',
    },
    snowplow__valid_play_sec: {
      type: 'integer',
      title: 'Valid Play (sec)',
      description: 'Minimum play time to be considered a valid play',
    },
    snowplow__surrogate_key_treat_nulls_as_empty_strings: {
      type: 'boolean',
      title: 'Surrogate Key Nulls as Empty Strings',
    },
    snowplow__enable_whatwg_media: {
      type: 'boolean',
      title: 'Enable whatwg Media',
    },
    snowplow__enable_whatwg_video: {
      type: 'boolean',
      title: 'Enable whatwg Video',
    },
    snowplow__enable_youtube: {
      type: 'boolean',
      title: 'Enable Youtube',
    },
    snowplow__media_player_event_context: {
      type: 'string',
      title: '(Redshift) Media Player Event Context Table',
    },
    snowplow__media_player_context: {
      type: 'string',
      title: '(Redshift) Media Player Table',
    },
    snowplow__youtube_context: {
      type: 'string',
      title: '(Redshift) Youtube Context Table',
    },
    snowplow__html5_media_element_context: {
      type: 'string',
      title: '(Redshift) HTML5 Media Element Context Table',
    },
    snowplow__html5_video_element_context: {
      type: 'string',
      title: '(Redshift) HTML5 Video Element  Context Table',
    },
  },
}
