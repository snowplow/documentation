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
      minimum: 0,
      title: 'Media Page View Window (hour)',
      description:
        'Delay between events being processed into your base table and your stats table',
    },
    snowplow__valid_play_sec: {
      type: 'integer',
      minimum: 0,
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
    snowplow__enable_media_player_v1: {
      type: 'boolean',
      title: 'Enable version 1 of the media player context',
    },
    snowplow__enable_media_player_v2: {
      type: 'boolean',
      title: 'Enable version 2 of the media player context',
    },
    snowplow__enable_media_session: {
      type: 'boolean',
      title: 'Enable media session context',
    },
    snowplow__enable_media_ad: {
      type: 'boolean',
      title: 'Enable media ad context with information about the played ad',
    },
    snowplow__enable_media_ad_break: {
      type: 'boolean',
      title: 'Enable media ad break context with information about the current ad break',
    },
    snowplow__enable_web_events: {
      type: 'boolean',
      title: 'Enable processing of web events from the JavaScript tracker',
    },
    snowplow__enable_mobile_events: {
      type: 'boolean',
      title: 'Enable processing of mobile events from the mobile trackers',
    },
    snowplow__enable_ad_quartile_event: {
      type: 'boolean',
      title: 'Enable ad quartile event tracked during media ad playback',
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
    snowplow__media_player_v2_context: {
      type: 'string',
      title: '(Redshift) Media Player Version 2 Context Table',
    },
    snowplow__media_session_context: {
      type: 'string',
      title: '(Redshift) Media Session Context Table',
    },
    snowplow__media_ad_context: {
      type: 'string',
      title: '(Redshift) Media Ad Context Table',
    },
    snowplow__media_ad_break_context: {
      type: 'string',
      title: '(Redshift) Media Ad Break Context Table',
    },
    snowplow__media_ad_quartile_event: {
      type: 'string',
      title: '(Redshift) Media Ad Quartile Event Table',
    },
    snowplow__context_web_page: {
      type: 'string',
      title: '(Redshift) Web Page Context Table',
    },
    snowplow__context_screen: {
      type: 'string',
      title: '(Redshift) Mobile Screen Context Table',
    },
    snowplow__context_mobile_session: {
      type: 'string',
      title: '(Redshift) Mobile Session Context Table',
    },
  },
}
