const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

module.exports = function snowplowSchemaPlugin(context, options) {
  const siteUrl = (
    context?.siteConfig?.url || 'https://docs.snowplow.io'
  ).replace(/\/$/, '')
  const siteName = context?.siteConfig?.title || 'Snowplow Documentation'
  const debug = options?.debug || false

  function loadMDXMetadata(folderPath) {
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
          const content = fs.readFileSync(fullPath, 'utf8')
          const { data } = matter(content)

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
      const docsMetadata = loadMDXMetadata(path.join(context.siteDir, 'docs'))
      const tutorialsMetadata = loadMDXMetadata(
        path.join(context.siteDir, 'tutorials')
      )
      const blogMetadata = loadMDXMetadata(path.join(context.siteDir, 'blog'))

      const allPagesMetadata = {
        ...docsMetadata,
        ...tutorialsMetadata,
        ...blogMetadata,
      }

      if (debug) console.log('Loaded front-matter metadata:', allPagesMetadata)

      return { allPagesMetadata, siteUrl, siteName }
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions
      setGlobalData(content)
    },
  }
}
