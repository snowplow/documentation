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
        // Skip partials: files starting with "_"
        if (file.startsWith('_')) continue

        const rawContent = fs.readFileSync(fullPath, 'utf8')
        const parsed = matter(rawContent)
        const { data } = parsed

        // 🚫 Never trust frontmatter description → wipe it
        data.description = undefined

        const rawSlug = data.slug
        const filename = file.replace(/\.mdx?$/, '')
        let slug

 if (rawSlug) {
  // Always resolve against basePrefix (docs semantics)
  const cleanedRaw = String(rawSlug).replace(/^\/+/, '') // drop leading slash
  slug = '/' + normalizeSlug([basePrefix, cleanedRaw].filter(Boolean).join('/'))
} else {
  // Derive from path, then resolve against basePrefix
  slug = '/' + path.join(base, filename).replace(/\\/g, '/')
  if (filename === 'index') slug = '/' + base.replace(/\\/g, '/')
  const parts = slug.split('/')
  const last = parts[parts.length - 1]
  const secondLast = parts[parts.length - 2]
  if (last === secondLast) slug = parts.slice(0, -1).join('/')

  const cleaned = String(slug || '').replace(/^\/+/, '')
  slug = '/' + normalizeSlug([basePrefix, cleaned].filter(Boolean).join('/'))
}

        const relPath = normalizePath(path.join(basePrefix, base, file))
        const lookupPath = relPath

        data.description = descriptionMap[lookupPath] || 'Snowplow documentation'
        if (keywordsMap[lookupPath]) {
          data.keywords = keywordsMap[lookupPath]
        }

        // ---- Fallbacks ----
        if (!data.title) {
          data.title = 'Snowplow documentation'
        }
        if (!Array.isArray(data.keywords) || data.keywords.length === 0) {
          data.keywords = ['Snowplow', 'Behavioral data', 'Customer data integration']
        }

        metadata[slug] = data

        // Extra safety: if this doc explicitly set slug: '/' store an alias at '/'
        if (rawSlug && rawSlug.trim() === '/') {
          metadata['/'] = data
        }
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
