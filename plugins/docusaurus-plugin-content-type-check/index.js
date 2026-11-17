/**
 * Content type check.
 *
 * Every docs page should set `content_type` in its front matter, so that it
 * follows one of the page templates in the style guide. This plugin warns,
 * without failing the build, about pages in the main docs that:
 *
 * - set an unknown `content_type` (each one is listed), or
 * - don't set one at all (counted, with the directories that need the most
 *   work; set CONTENT_TYPE_REPORT=1 to list every page).
 *
 * Pages with `type: link` front matter are sidebar links, not pages, and
 * previous-version pages are frozen, so both are skipped.
 */
const CONTENT_TYPES = ['concept', 'how-to', 'tutorial', 'reference', 'integration', 'sdk', 'landing']

const PREVIOUS_VERSION = /\/(previous-versions?|previous_versions|previous-releases|rdb-loader-previous-versions)\//

module.exports = function contentTypeCheck(_context, options = {}) {
  const { docsPluginId = 'default', topDirectories = 10 } = options

  return {
    name: 'docusaurus-plugin-content-type-check',

    async allContentLoaded({ allContent }) {
      const docsContent = allContent['docusaurus-plugin-content-docs']?.[docsPluginId]
      if (!docsContent) return

      const missing = []
      const invalid = []
      let checked = 0

      for (const version of docsContent.loadedVersions ?? []) {
        for (const doc of version.docs ?? []) {
          const fm = doc.frontMatter ?? {}
          if (fm.type === 'link') continue
          if (PREVIOUS_VERSION.test(doc.permalink)) continue
          checked += 1
          const value = fm.content_type
          if (value === undefined) missing.push(doc.source.replace(/^@site\//, ''))
          else if (!CONTENT_TYPES.includes(value)) invalid.push(`${doc.source.replace(/^@site\//, '')} (${value})`)
        }
      }

      if (invalid.length) {
        console.warn(
          `[content-type] ${invalid.length} page(s) have an unknown content_type. Use one of: ${CONTENT_TYPES.join(', ')}.\n  ` +
            invalid.join('\n  ')
        )
      }

      if (missing.length) {
        const byDir = new Map()
        for (const source of missing) {
          const dir = source.split('/').slice(0, 3).join('/')
          byDir.set(dir, (byDir.get(dir) ?? 0) + 1)
        }
        const top = [...byDir.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, topDirectories)
          .map(([dir, n]) => `${dir} (${n})`)
          .join(', ')
        console.warn(
          `[content-type] ${missing.length} of ${checked} docs pages have no content_type front matter. Most in: ${top}.` +
            (process.env.CONTENT_TYPE_REPORT ? `\n  ${missing.join('\n  ')}` : ' Set CONTENT_TYPE_REPORT=1 to list them.')
        )
      } else {
        console.log(`[content-type] All ${checked} docs pages set content_type.`)
      }
    },
  }
}

module.exports.CONTENT_TYPES = CONTENT_TYPES
