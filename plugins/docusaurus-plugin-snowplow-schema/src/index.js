const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// Constants
const DEFAULT_TITLE = 'Snowplow documentation'
const DEFAULT_DESCRIPTION = 'Snowplow documentation'
const DEFAULT_KEYWORDS = [
  'composable CDP',
  'composable analytics',
  'real-time personalization',
  'agentic applications',
  'customer data infrastructure',
  'event architecture',
  'behavioral data',
  'event tracking',
  'AI-ready data',
  'data pipeline',
  'first-party data',
  'product analytics',
  'data governance',
  'machine learning data',
]

function normalizeSlug(slug) {
  return slug.replace(/\/$/, '')
}

function buildSlugFromPath(basePrefix, base, filename) {
  let slug = '/' + path.join(base, filename).replace(/\\/g, '/')

  // Handle index files
  if (filename === 'index') {
    slug = '/' + base.replace(/\\/g, '/')
  }

  // Remove duplicate folder names (e.g., /docs/feature/feature -> /docs/feature)
  const parts = slug.split('/')
  const last = parts[parts.length - 1]
  const secondLast = parts[parts.length - 2]
  if (last === secondLast) {
    slug = parts.slice(0, -1).join('/')
  }

  const cleaned = String(slug || '').replace(/^\/+/, '')
  return '/' + normalizeSlug([basePrefix, cleaned].filter(Boolean).join('/'))
}

function resolveSlug(rawSlug, basePrefix, base, filename) {
  if (rawSlug) {
    // User-defined slug: resolve against basePrefix
    const cleanedRaw = String(rawSlug).replace(/^\/+/, '')
    return (
      '/' + normalizeSlug([basePrefix, cleanedRaw].filter(Boolean).join('/'))
    )
  }

  // Auto-generated slug from path
  return buildSlugFromPath(basePrefix, base, filename)
}

module.exports = function snowplowSchemaPlugin(context) {
  const siteUrl = (
    context?.siteConfig?.url || 'https://docs.snowplow.io'
  ).replace(/\/$/, '')
  const siteName = context?.siteConfig?.title || 'Snowplow Documentation'

  function loadMDXMetadata(folderPath, basePrefix) {
    if (!fs.existsSync(folderPath)) return {}
    const metadata = {}

    function processFile(fullPath, base, file) {
      try {
        const rawContent = fs.readFileSync(fullPath, 'utf8')
        const parsed = matter(rawContent)
        const { data } = parsed

        // Skip link-only files (no actual content)
        if (data.type === 'link') {
          return
        }

        const filename = file.replace(/\.mdx?$/, '')
        const slug = resolveSlug(data.slug, basePrefix, base, filename)

        // Apply fallbacks for missing frontmatter
        data.title = data.title || DEFAULT_TITLE
        data.description = data.description || DEFAULT_DESCRIPTION

        if (!Array.isArray(data.keywords) || data.keywords.length === 0) {
          data.keywords = DEFAULT_KEYWORDS
        }

        metadata[slug] = data

        // Store alias for root slug if explicitly set
        if (data.slug && data.slug.trim() === '/') {
          metadata['/'] = data
        }
      } catch (error) {
        console.warn(
          `Warning: Failed to process file ${fullPath}:`,
          error.message
        )
      }
    }

    function walk(dir, base = '') {
      try {
        const files = fs.readdirSync(dir)

        for (const file of files) {
          const fullPath = path.join(dir, file)
          const stat = fs.statSync(fullPath)

          if (stat.isDirectory()) {
            walk(fullPath, path.join(base, file))
          } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
            // Skip partials: files starting with "_"
            if (file.startsWith('_')) continue

            processFile(fullPath, base, file)
          }
        }
      } catch (error) {
        console.warn(`Warning: Failed to read directory ${dir}:`, error.message)
      }
    }

    walk(folderPath)
    return metadata
  }

  return {
    name: 'docusaurus-plugin-page-schema',

    async loadContent() {
      const docsMetadata = loadMDXMetadata(
        path.join(context.siteDir, 'docs'),
        'docs'
      )
      const tutorialsMetadata = loadMDXMetadata(
        path.join(context.siteDir, 'tutorials'),
        'tutorials'
      )

      const allPagesMetadata = {
        ...docsMetadata,
        ...tutorialsMetadata,
      }

      return { allPagesMetadata, siteUrl, siteName }
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions
      setGlobalData(content)
    },
  }
}
