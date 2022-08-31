// Redirection rules for the `@docusaurus/plugin-client-redirects` plugin.
const redirects = [
  // Mobile tracker v3 redirects
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers",
  },
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/introduction",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up",
  },
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/quick-start-guide",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up",
  },
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/remote-configuration",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/remote-configuration",
  },
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/tracking-events",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events",
  },

  // Mobile tracker migration redirects
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide",
  },
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-for-snowplow-android-tracker-sdk-from-version-1-x-to-2-0",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide",
  },
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-for-snowplow-android-tracker-sdk-from-version-2-x-to-3-0",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide",
  },
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-for-snowplow-ios-tracker-sdk-from-version-1-x-to-2-0",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide",
  },
  {
    from: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-for-snowplow-ios-tracker-sdk-from-version-2-x-to-3-0",
    to: "/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide",
  },
];

module.exports = {
  redirects,
};
