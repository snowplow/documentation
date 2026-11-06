import type { Config } from '@docusaurus/types'

const { sidebarItemsGenerator } = require('./utils/sidebar-items-generator')
const abbreviations = require('./src/remark/abbreviations')
const math = require('remark-math')
const katex = require('rehype-katex')

const config: Config = {
  title: 'Snowplow Documentation',
  tagline:
    'Build, deploy, and scale your next data creation project using Snowplow.',
  url: 'https://docs.snowplow.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  favicon: 'img/favicon.ico',
  trailingSlash: true,
  organizationName: 'snowplow',
  projectName: 'documentation',
  deploymentBranch: 'main',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  future: {
    v4: true,
    faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      mdxCrossCompilerCache: true,
    },
  },

  customFields: {
    // Shown as "Copy MCP URL" in the page actions menu once the docs MCP
    // server is deployed (research/blueprint-notes/spike-docs-mcp-hosting.md)
    docsMcpUrl: process.env.DOCS_MCP_URL || null,
  },

  clientModules: [
    require.resolve('./snowplow.js'),
    require.resolve('./reoTracking.js'),
    require.resolve('./google.js'),
    require.resolve('./src/js/mermaidEnlarge.js'),
    require.resolve('./src/qualified.js'),
  ],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-github-codeblock'],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          showLastUpdateTime: true,
          editUrl: 'https://github.com/snowplow/documentation/tree/main/',
          remarkPlugins: [abbreviations, math],
          rehypePlugins: [
            [
              require('rehype-raw').default,
              {
                passThrough: [
                  'mdxjsEsm',
                  'mdxJsxFlowElement',
                  'mdxJsxTextElement',
                  'mdxFlowExpression',
                  'mdxTextExpression',
                ],
              },
            ],
            katex,
          ],
          // Four sidebars (cdi, signals, reference, platform) built from docs/
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarItemsGenerator,
        },
        theme: {
          customCss: [
            require.resolve('./src/css/base.css'),
            require.resolve('./src/css/infima.css'),
            require.resolve('./src/css/prose.css'),
            require.resolve('./src/css/chrome.css'),
            require.resolve('./src/css/components.css'),
            require.resolve('./src/css/kit.css'),
            require.resolve('./src/css/home.css'),
          ],
        },
      },
    ],
  ],

  plugins: [
    // Design tokens (src/design/tokens.js) to CSS variables, plus the fonts
    './plugins/docusaurus-plugin-design-tokens',
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
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'release-notes',
        path: 'release-notes',
        routeBasePath: 'release-notes',
        sidebarPath: false,
        showLastUpdateTime: false,
      },
    ],
    './plugins/docusaurus-plugin-release-notes',
    './plugins/docusaurus-plugin-snowplow-schema',
    // Warns about docs pages without a valid content_type (see CLAUDE.md)
    './plugins/docusaurus-plugin-content-type-check',
    [
      './plugins/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'Snowplow Documentation',
        siteDescription:
          'Authoritative Snowplow documentation for implementing event tracking, validation, enrichment, governance, and delivery of clean event-level behavioral data. Focus areas include composable analytics, composable CDP, in-product personalization, AI agentic applications, and feeding AI-ready real-time data into warehouses, lakes, streams, and real-time tools.',
        excludeRoutes: [
          '/',
          '/tutorials/',
          '/release-notes/',
          '/docs/signals/',
        ],
        contentDirs: ['docs', 'tutorials', 'release-notes'],
        contentSelectors: ['.theme-doc-markdown', 'article', 'main'],
        enableMarkdownFiles: true,
        enableLlmsFullTxt: true,
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
    {
      // Light, dark, and system modes. System follows the reader's OS setting
      // and is the default for first-time visitors.
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      codeblock: {
        showGithubLink: true,
        githubLinkLabel: 'View on GitHub',
      },
      navbar: {
        hideOnScroll: false,
        logo: {
          alt: 'Snowplow Logo',
          src: 'img/snowplow-logo.svg',
        },
        items: [
          // Snowplow CDI | Signals: selects the cdi or signals sidebar
          {
            type: 'custom-productSwitcher',
            position: 'left',
          },
          // Plain link tabs. A docSidebar tab is active on any page in its sidebar.
          {
            type: 'docSidebar',
            sidebarId: 'reference',
            label: 'Reference',
            position: 'left',
          },
          {
            to: '/tutorials/',
            label: 'Tutorials',
            position: 'left',
            activeBaseRegex: '^/tutorials/',
          },
          {
            type: 'docSidebar',
            sidebarId: 'platform',
            label: 'Platform & AI',
            position: 'left',
          },
          {
            to: '/release-notes/',
            label: 'Release notes',
            position: 'left',
            activeBaseRegex: '^/release-notes/',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://support.snowplow.io/',
            label: 'Support',
            position: 'right',
            className: 'navbar-support-link',
          },
          // Links to the Signals free tier on Signals pages, and to the
          // CDI Cloud free trial everywhere else
          {
            type: 'custom-tryForFree',
            label: 'Try for free',
            position: 'right',
            className: 'navbar-cta',
          },
        ],
      },
      footer: {
        style: 'light',
        logo: {
          alt: 'Snowplow',
          src: '/img/Snowplow_icoOnly.svg',
          width: 32,
          height: 28.5,
        },
        links: [
          {
            title: 'Resources',
            items: [
              {
                href: 'https://github.com/snowplow/',
                label: 'GitHub',
              },
              {
                href: 'https://snowplow.io/',
                label: 'Snowplow.io',
              },
              {
                href: '/docs/glossary/',
                label: 'Glossary',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                href: 'https://community.snowplow.io/',
                label: 'Snowplow community',
              },
              {
                href: 'https://support.snowplow.io/',
                label: 'Support',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Cookie preferences',
                href: '/cookie-preferences',
              },
              {
                label: 'Terms and conditions',
                href: '/terms-and-conditions',
              },
              {
                label: 'Licensing overview',
                href: '/docs/licensing/',
              },
            ],
          },
        ],

        copyright: `Copyright © ${new Date().getFullYear()} Snowplow Analytics Ltd.`,
      },
      prism: {
        theme: require('./src/theme/PrismThemes/snowplow-light.js').default,
        darkTheme: require('./src/theme/PrismThemes/snowplow-dark.js').default,
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
        ],
      },
      algolia: {
        appId: '9HS3C2MKTH',
        apiKey: 'f22e24c1b333034a75914759b0f045c3',
        indexName: 'snowplow',
        contextualSearch: true,
        insights: true,
        // Ask AI in the search modal (DocSearch v4). Off until an Algolia
        // assistant exists: an askAi block without a valid assistant ID breaks
        // the modal. See research/blueprint-notes/spike-algolia-askai.md.
        ...(process.env.ALGOLIA_ASKAI_ASSISTANT_ID
          ? {
              askAi: {
                assistantId: process.env.ALGOLIA_ASKAI_ASSISTANT_ID,
                suggestedQuestions: true,
              },
            }
          : {}),
      },
    },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image',
        content:
          'https://cdn.prod.website-files.com/661fd4aa0185c5022e931990/66714f936876397066d5fba7_thumbnail-post-category.avif',
      },
    },
    {
      tagName: 'script',
      attributes: {},
      innerHTML:
        '!function(){window.semaphore=window.semaphore||[],window.ketch=function(){window.semaphore.push(arguments)};var e=document.createElement("script");e.type="text/javascript",e.src="https://global.ketchcdn.com/web/v3/config/snowplow_analytics/website_smart_tag/boot.js",e.defer=e.async=!0,document.getElementsByTagName("head")[0].appendChild(e)}();',
    },
  ],
}

export default config
