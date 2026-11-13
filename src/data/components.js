/**
 * Display names and links for components in the version manifest
 * (src/componentVersions.js). <VersionBadge> and <AppliesTo> read the
 * version from the manifest and the label from here, so a version is only
 * ever written in one place.
 *
 * CommonJS-compatible ES module: the browser bundle and the llms-txt plugin
 * both read it.
 */
export const componentInfo = {
  // Trackers
  androidTracker: { label: 'Android tracker', href: '/docs/sources/mobile-trackers/' },
  iosTracker: { label: 'iOS tracker', href: '/docs/sources/mobile-trackers/' },
  javaScriptTracker: { label: 'JavaScript tracker', href: '/docs/sources/web-trackers/' },
  dotNetTracker: { label: '.NET tracker', href: '/docs/sources/net-tracker/' },
  cppTracker: { label: 'C++ tracker', href: '/docs/sources/c-tracker/' },
  flutterTracker: { label: 'Flutter tracker', href: '/docs/sources/flutter-tracker/' },
  golangTracker: { label: 'Golang tracker', href: '/docs/sources/golang-tracker/' },
  googleAmpTracker: { label: 'Google AMP tracker', href: '/docs/sources/google-amp-tracker/' },
  javaTracker: { label: 'Java tracker', href: '/docs/sources/java-tracker/' },
  luaTracker: { label: 'Lua tracker', href: '/docs/sources/lua-tracker/' },
  phpTracker: { label: 'PHP tracker', href: '/docs/sources/php-tracker/' },
  pixelTracker: { label: 'Pixel tracker', href: '/docs/sources/pixel-tracker/' },
  pythonTracker: { label: 'Python tracker', href: '/docs/sources/python-tracker/' },
  rokuTracker: { label: 'Roku tracker', href: '/docs/sources/roku-tracker/' },
  rubyTracker: { label: 'Ruby tracker', href: '/docs/sources/ruby-tracker/' },
  rustTracker: { label: 'Rust tracker', href: '/docs/sources/rust-tracker/' },
  scalaTracker: { label: 'Scala tracker', href: '/docs/sources/scala-tracker/' },
  unityTracker: { label: 'Unity tracker', href: '/docs/sources/unity-tracker/' },
  webViewTracker: { label: 'WebView tracker', href: '/docs/sources/webview-tracker/' },

  // Core pipeline
  collector: { label: 'Collector', href: '/docs/api-reference/stream-collector/' },
  enrich: { label: 'Enrich', href: '/docs/api-reference/enrichment-components/' },
  snowbridge: { label: 'Snowbridge', href: '/docs/api-reference/snowbridge/' },

  // Loaders
  bqLoader: { label: 'BigQuery Loader', href: '/docs/api-reference/loaders-storage-targets/bigquery-loader/' },
  rdbLoader: { label: 'RDB Loader', href: '/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/' },
  lakeLoader: { label: 'Lake Loader', href: '/docs/api-reference/loaders-storage-targets/lake-loader/' },
  snowflakeStreamingLoader: {
    label: 'Snowflake Streaming Loader',
    href: '/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/',
  },
  databricksStreamingLoader: {
    label: 'Databricks Streaming Loader',
    href: '/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/',
  },
  s3Loader: { label: 'S3 Loader', href: '/docs/api-reference/loaders-storage-targets/s3-loader/' },

  // dbt packages
  dbtSnowplowUnified: { label: 'Unified Digital package', repo: 'https://github.com/snowplow/dbt-snowplow-unified' },
  dbtSnowplowAttribution: {
    label: 'Attribution package',
    repo: 'https://github.com/snowplow/dbt-snowplow-attribution',
  },
  dbtSnowplowIdentities: { label: 'Identities package', repo: 'https://github.com/snowplow/dbt-snowplow-identities' },
  dbtSnowplowWeb: { label: 'Web package', repo: 'https://github.com/snowplow/dbt-snowplow-web' },
  dbtSnowplowMobile: { label: 'Mobile package', repo: 'https://github.com/snowplow/dbt-snowplow-mobile' },
  dbtSnowplowMediaPlayer: {
    label: 'Media Player package',
    repo: 'https://github.com/snowplow/dbt-snowplow-media-player',
  },
  dbtSnowplowUtils: { label: 'Utils package', repo: 'https://github.com/snowplow/dbt-snowplow-utils' },
  dbtSnowplowNormalize: { label: 'Normalize package', repo: 'https://github.com/snowplow/dbt-snowplow-normalize' },
  dbtSnowplowFractribution: {
    label: 'Fractribution package',
    repo: 'https://github.com/snowplow/dbt-snowplow-fractribution',
  },
  dbtSnowplowEcommerce: { label: 'Ecommerce package', repo: 'https://github.com/snowplow/dbt-snowplow-ecommerce' },

  // Testing
  snowplowMicro: { label: 'Snowplow Micro', href: '/docs/testing/snowplow-micro/' },
  snowplowMini: { label: 'Snowplow Mini', href: '/docs/api-reference/snowplow-mini/' },
  igluServer: { label: 'Iglu Server', href: '/docs/api-reference/iglu/iglu-repositories/iglu-server/' },

  // Developer tools
  snowplowCli: { label: 'Snowplow CLI', href: '/docs/api-reference/snowplow-cli/' },
  snowtype: { label: 'Snowtype', href: '/docs/event-studio/implement-tracking/' },
}
