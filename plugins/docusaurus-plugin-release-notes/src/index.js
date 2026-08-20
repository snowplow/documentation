const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const PLUGIN_NAME = 'docusaurus-plugin-release-notes'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function toArray(value) {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

// Front matter dates are unquoted often enough that gray-matter hands back a Date
function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return typeof value === 'string' ? value.trim() : ''
}

function readArticle(contentPath, slug) {
  const file = path.join(contentPath, slug, 'index.md')
  if (!fs.existsSync(file)) return null

  const { data } = matter(fs.readFileSync(file, 'utf8'))
  const date = normalizeDate(data.date)
  const category = toArray(data.category)

  if (!data.title) {
    throw new Error(`[${PLUGIN_NAME}] ${slug}/index.md is missing a title`)
  }
  if (!DATE_PATTERN.test(date)) {
    throw new Error(
      `[${PLUGIN_NAME}] ${slug}/index.md needs a date in YYYY-MM-DD format, got "${date}"`
    )
  }
  if (category.length === 0) {
    throw new Error(`[${PLUGIN_NAME}] ${slug}/index.md is missing category`)
  }

  return {
    slug,
    title: data.title,
    description: data.description ?? '',
    date,
    category,
    components: toArray(data.components),
    platforms: toArray(data.platforms),
  }
}

module.exports = function releaseNotesPlugin(context, options = {}) {
  const { path: contentDir = 'release-notes', routeBasePath = 'release-notes' } = options
  const contentPath = path.resolve(context.siteDir, contentDir)

  return {
    name: PLUGIN_NAME,

    getPathsToWatch() {
      return [path.join(contentPath, '*', 'index.md')]
    },

    async loadContent() {
      if (!fs.existsSync(contentPath)) return []

      const slugs = fs
        .readdirSync(contentPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)

      return slugs
        .map((slug) => readArticle(contentPath, slug))
        .filter(Boolean)
        .map((article) => ({
          ...article,
          permalink: `/${routeBasePath}/${article.slug}/`,
        }))
        // newest first, then alphabetically so same-day releases have a stable order
        .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData({ entries: content })
    },
  }
}
