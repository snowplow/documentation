const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function normalizePath(p) {
  return p.replace(/\\/g, '/').replace(/^\.\/?/, '')
}

function normalizeSlug(slug) {
  return slug.replace(/\/$/, '')
}

function loadMapping(filePath, isKeywords = false) {
  if (!fs.existsSync(filePath)) return {}

  const lines = fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const map = {}
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].endsWith('.md')) {
      const rawPath = normalizePath(lines[i])
      if (i + 1 < lines.length && !lines[i + 1].endsWith('.md')) {
        if (isKeywords) {
          const keywords = lines[i + 1]
            .split(',')
            .map((k) => k.replace(/"/g, '').trim())
            .filter(Boolean)
          map[rawPath] = keywords
        } else {
          const desc = lines[i + 1]
            .replace(/^description:\s*/, '')
            .replace(/^"|"$/g, '')
          map[rawPath] = desc
        }
      }
    }
  }
  return map
}

module.exports = function snowplowSchemaPlugin(context, options) {
  const siteUrl = (
    context?.siteConfig?.url || 'https://docs.snowplow.io'
  ).replace(/\/$/, '')
  const siteName = context?.siteConfig?.title || 'Snowplow Documentation'

  const descriptionMap = loadMapping(
    path.join(__dirname, 'schemaData/description.md')
  )
  const keywordsMap = loadMapping(
    path.join(__dirname, 'schemaData/keywords.md'),
    true
  )

function loadMDXMetadata(folderPath, basePrefix) {
  if (!fs.existsSync(folderPath)) return {}
  const metadata = {}

  function walk(dir, base = '') {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        walk(fullPath, path.join(base, file))
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const rawContent = fs.readFileSync(fullPath, 'utf8')
        const parsed = matter(rawContent)
        const { data } = parsed

        // 🚫 Never trust frontmatter description → wipe it
        data.description = undefined

        const rawSlug = data.slug
        const filename = file.replace(/\.mdx?$/, '')
        let slug

        if (rawSlug) {
          slug = rawSlug
        } else {
          slug = '/' + path.join(base, filename).replace(/\\/g, '/')
          if (filename === 'index') slug = '/' + base.replace(/\\/g, '/')
          const pathParts = slug.split('/')
          const last = pathParts[pathParts.length - 1]
          const secondLast = pathParts[pathParts.length - 2]
          if (last === secondLast) slug = pathParts.slice(0, -1).join('/')
        }

        slug = '/' + normalizeSlug(path.join(basePrefix, slug).replace(/\\/g, '/'))

        const relPath = normalizePath(path.join(basePrefix, base, file))
        let lookupPath = relPath

        // Special case: homepage
        if (slug === '/' && file === 'introduction.md') {
          lookupPath = 'docs/introduction.md'

          // 🚨 Force override: never use frontmatter, only map or fallback
          data.description = descriptionMap[lookupPath] || 'Snowplow documentation'
        } else {
          // Normal pages → apply mapping overrides
          data.description = descriptionMap[lookupPath] || 'Snowplow documentation'
        }

        if (keywordsMap[lookupPath]) {
          data.keywords = keywordsMap[lookupPath]
        }

        // ---- Fallbacks ----
        if (!data.title) {
          data.title = 'Snowplow documentation'
        }

        if (!data.keywords || !Array.isArray(data.keywords) || data.keywords.length === 0) {
          data.keywords = ['Snowplow', 'Behavioral data', 'Customer data integration']
        }

        metadata[slug] = data
      }
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
      const blogMetadata = loadMDXMetadata(
        path.join(context.siteDir, 'blog'),
        'blog'
      )

      const allPagesMetadata = {
        ...docsMetadata,
        ...tutorialsMetadata,
        ...blogMetadata,
      }

      return { allPagesMetadata, siteUrl, siteName }
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions
      setGlobalData(content)
    },
  }
}
