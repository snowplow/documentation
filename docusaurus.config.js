// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Snowplow Documentation',
  tagline: 'Build, deploy, and scale your next data creation project using Snowplow.',
  url: 'https://docs.snowplowanalytics.com',
  baseUrl: '/',
  // reset this back to throw, set to warn so that site builds
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
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
    require.resolve('./snowplow.js'),
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
        googleAnalytics: {
          trackingID: 'UA-159566509-1',
          anonymizeIP: true,
        },
        gtag: {
          trackingID: 'GTM-M24XMJD',
          anonymizeIP: true,
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
            class: 'snwpl-nav-link snwpl-nav-link__first',
            label: 'Docs',
          },
          {
            href: 'https://discourse.snowplowanalytics.com',
            label: 'Discourse',
            class: 'snwpl-nav-link',
            position: 'left',
          },
          {
            href: 'https://github.com/snowplow/',
            label: 'GitHub',
            class: 'snwpl-nav-link',
            position: 'left',
          },
          {
            to: 'https://try.snowplowanalytics.com/?utm_content=hero-cta&utm_campaign=snowplow-docs',
            label: 'Try Snowplow',
            class: 'snwpl-nav-button',
            position: 'right',
          },
          {
            to: 'https://go.snowplowanalytics.com/l/571483/2021-02-19/3sn5nml',
            label: 'Book a demo',
            class: 'snwpl-nav-button',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Snowplow Analytics Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/dracula'),
      },
    }),
};

module.exports = config;
