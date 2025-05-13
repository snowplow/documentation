// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const sidebar = require('./sidebars')
const abbreviations = require('./src/remark/abbreviations')
const math = require('remark-math')
const katex = require('rehype-katex')
const path = require('path')

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'Snowplow Documentation',
  tagline:
    'Build, deploy, and scale your next data creation project using Snowplow.',
  url: 'https://docs.snowplow.io',
  baseUrl: '/',
  // reset this back to throw, set to warn so that site builds
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  trailingSlash: true,
  organizationName: 'snowplow',
  projectName: 'documentation',
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

  markdown: {
    mermaid: true,
  },

  themes: ['@saucelabs/theme-github-codeblock', '@docusaurus/theme-mermaid'],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          showLastUpdateTime: true,
          editUrl: 'https://github.com/snowplow/documentation/tree/main/',
          remarkPlugins: [abbreviations, math],
          rehypePlugins: [katex],
          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            return sidebar.swapDocItemsToLinkItems(
              await defaultSidebarItemsGenerator(args),
              args.docs
            )
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'tutorials',
        path: 'tutorials',
        routeBasePath: 'tutorials',
        sidebarPath: false,
        showLastUpdateTime: true,
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      navbar: {
        logo: {
          alt: 'Snowplow Logo',
          src: 'img/snowplow-logo.svg',
        },
        items: [
          {
            type: 'custom-docsTutorialsTabsDesktop',
            position: 'left',
          },
          {
            type: 'custom-docsTutorialsTabsMobile',
            position: 'left',
            className: 'mobile-only',
          },
          {
            href: 'https://support.snowplow.io/',
            label: 'Contact Support',
            position: 'right',
          },
          {
            href: 'https://community.snowplow.io/',
            label: 'Community',
            position: 'right',
          },
          {
            href: 'https://github.com/snowplow/',
            label: 'GitHub',
            position: 'right',
          },
          {
            to: 'https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/',
            label: 'Book a demo',
            className: 'snowplow-button',
            position: 'right',
          },
          {
            type: 'custom-docsTrackerNavbarButton',
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
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Snowplow Analytics Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.shadesOfPurple,
        // Docusaurus comes with a subset of commonly used languages -https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/vendor/prism/includeLangs.js.
        // To add syntax highlighting for additional Prism supported languages, add reference from https://prismjs.com/#supported-languages.
        // NOTE: do a `yarn build` to ensure that it does build properly
        additionalLanguages: [
          'arduino',
          'csharp',
          'dart',
          'docker',
          'gradle',
          'hcl',
          'java',
          'lua',
          'php',
          'properties',
          'r',
          'ruby',
          'scala',
          'swift',
          'brightscript',
          'rust',
          'toml',
          'django',
          'yaml',
          'kotlin',
          'bash',
          'diff',
          'json',
          'hcl',
        ],
      },
      algolia: {
        appId: '9HS3C2MKTH',
        apiKey: 'f22e24c1b333034a75914759b0f045c3',
        indexName: 'snowplow',
        contextualSearch: true,
      },
    }),

  customFields: {
    webpack: {
      configure: (config) => {
        // Add JSX runtime resolution
        config.resolve.alias = {
          ...config.resolve.alias,
          'react/jsx-runtime': require.resolve('react/jsx-runtime'),
          'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
        }

        // Add module rules for CSS processing
        config.module.rules.push({
          test: /\.css$/,
          use: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [
                    require.resolve('tailwindcss'),
                    require.resolve('autoprefixer'),
                  ],
                },
              },
            },
          ],
        })

        // Add resolve extensions
        config.resolve.extensions = [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
          '.mjs',
        ]

        return config
      },
    },
  },
}
