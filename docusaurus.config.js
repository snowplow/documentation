// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Snowplow Documentation',
  tagline: 'Build, deploy, and scale your next data creation project using Snowplow.',
  url: 'https://docs.snowplow.io',
  baseUrl: '/',
  // reset this back to throw, set to warn so that site builds
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  organizationName: 'snowplow',
  projectName: 'snowplow.github.io',
  deploymentBranch: 'main',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  clientModules: [
    require.resolve('./cookieConsent.js'),
    require.resolve('./snowplow.js'),
    require.resolve('./google.js'),
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
          editUrl: 'https://github.com/snowplow/snowplow.github.io/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        logo: {
          alt: 'Snowplow Logo',
          src: 'img/snowplow-logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            className: 'nav-link__first',
            label: 'Docs',
          },
          {
            href: 'https://discourse.snowplowanalytics.com',
            label: 'Discourse',
            position: 'left',
          },
          {
            href: 'https://github.com/snowplow/',
            label: 'GitHub',
            position: 'left',
          },
          {
            to: 'https://try.snowplowanalytics.com/?utm_content=hero-cta&utm_campaign=snowplow-docs',
            label: 'Try Snowplow',
            className: 'snwpl-nav-button',
            position: 'right',
          },
          {
            to: 'https://go.snowplowanalytics.com/l/571483/2021-02-19/3sn5nml',
            label: 'Book a demo',
            className: 'snwpl-nav-button',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {             
            label: 'Change cookie preferences',
            href: '/cookie-preferences',
          },
          {
            label: 'Terms and conditions',
            href: '/terms-and-conditions', 
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Snowplow Analytics Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/dracula'),
      },
      algolia: {
        appId: '9HS3C2MKTH',
        apiKey: 'f22e24c1b333034a75914759b0f045c3',
        indexName: 'snowplow',
        contextualSearch: true,
      },
    }),

    plugins: [
      [
        '@docusaurus/plugin-client-redirects',
        {
          redirects: [
            // Mobile tracker v3 redirects
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers'
            },
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/introduction',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up'
            },
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/quick-start-guide',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up'
            },
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/remote-configuration',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/remote-configuration'
            },
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/tracking-events',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events'
            },
            // Mobile tracker migration redirects
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide'
            },
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-for-snowplow-android-tracker-sdk-from-version-1-x-to-2-0',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide'
            },
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-for-snowplow-android-tracker-sdk-from-version-2-x-to-3-0',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide'
            },
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-for-snowplow-ios-tracker-sdk-from-version-1-x-to-2-0',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide'
            },
            {
              from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-for-snowplow-ios-tracker-sdk-from-version-2-x-to-3-0',
              to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guide'
            }
          ],
        },
      ],
    ]
};

module.exports = config;
