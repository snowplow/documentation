// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Snowplow Docs',
  tagline: '[Insert Tag line here]',
  url: 'https://andy-hay.github.io',
  baseUrl: '/docsite-poc.github.io/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  organizationName: 'Andy-Hay', // Usually your GitHub org/user name.
  projectName: 'docsite-poc.github.io', // Usually your repo name.
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
          alt: 'SnowPlow Docs Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Tutorial',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          { to: '/page-with-badges.html', label: 'Badges', position: 'left' },
          { to: '/introduction-to-tracking-design.html', label: 'Tracking', position: 'left' },
          { to: '/code-syntax.html', label: 'Code', position: 'left' },
          {
            href: 'https://github.com/Andy-Hay/docsite-poc.github.io',
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
              {
                label: 'GitHub for these docs',
                href: 'https://github.com/Andy-Hay/docsite-poc.github.io',
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
