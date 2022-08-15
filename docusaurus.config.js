// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
          editUrl: 'https://github.com/snowplow/snowplow.github.io/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Snowplow Docs',
        logo: {
          alt: 'Snowplow Logo',
          src: 'img/snowplow-icon-light-purple.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'migrated/index',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/snowplow/',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub for Open Source Snowplow',
                href: 'https://github.com/snowplow/snowplow',
              },
              {
                label: 'Discourse',
                href: 'https://discourse.snowplowanalytics.com/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                href: 'https://snowplowanalytics.com/blog/',
              },
              {
                label: 'Meetups',
                href: 'https://www.meetup.com/topics/snowplow/',
              },
              {
                label: 'Events',
                href: 'https://snowplowanalytics.com/events/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Snowplow Analytics Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/dracula'),
      },
    }),
};

module.exports = config;
