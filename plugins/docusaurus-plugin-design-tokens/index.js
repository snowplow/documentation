/**
 * Design tokens plugin.
 *
 * - Writes tokens.css (CSS custom properties) from src/design/tokens.js into
 *   the generated files directory at build start, and loads it on every page.
 * - Loads the self-hosted fonts: Inter Variable (woff2, split into unicode
 *   subsets so browsers only fetch the scripts a page uses) and JetBrains Mono
 *   400 and 600 for code.
 * - Keeps CSS cascade layers native. Docusaurus wraps Infima and its theme CSS
 *   in @layer, but postcss-preset-env would otherwise rewrite the layers into
 *   :not(#\#) specificity hacks for old browsers. Native layers mean the site's
 *   own CSS overrides Infima without !important. Its :is() rewriting is off
 *   too: every browser that supports layers supports :is().
 */
const fs = require('fs')
const path = require('path')
const { tokensToCss } = require('./tokens-css')

const TOKENS_PATH = path.resolve(__dirname, '../../src/design/tokens.js')

function loadTokens() {
  delete require.cache[require.resolve(TOKENS_PATH)]
  return require(TOKENS_PATH)
}

module.exports = function pluginDesignTokens(context) {
  const outDir = path.join(context.generatedFilesDir, 'docusaurus-plugin-design-tokens')
  const outFile = path.join(outDir, 'tokens.css')

  function writeTokens() {
    fs.mkdirSync(outDir, { recursive: true })
    const css = tokensToCss(loadTokens())
    // Only write when the content changes, so the dev server doesn't reload
    const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : null
    if (current !== css) fs.writeFileSync(outFile, css)
  }

  // Write now: client modules must exist before the bundler starts
  writeTokens()

  return {
    name: 'docusaurus-plugin-design-tokens',

    async loadContent() {
      writeTokens()
    },

    getPathsToWatch() {
      return [TOKENS_PATH]
    },

    getClientModules() {
      return [
        require.resolve('@fontsource-variable/inter/wght.css'),
        require.resolve('@fontsource-variable/inter/wght-italic.css'),
        require.resolve('@fontsource/jetbrains-mono/latin-400.css'),
        require.resolve('@fontsource/jetbrains-mono/latin-600.css'),
        outFile,
      ]
    },

    configurePostCss(postcssOptions) {
      postcssOptions.plugins = postcssOptions.plugins.map((plugin) => {
        const name = Array.isArray(plugin) ? plugin[0] : plugin
        if (typeof name === 'string' && name.includes('postcss-preset-env')) {
          const options = Array.isArray(plugin) ? plugin[1] || {} : {}
          return [
            name,
            { ...options, features: { ...options.features, 'cascade-layers': false, 'is-pseudo-class': false } },
          ]
        }
        return plugin
      })
      return postcssOptions
    },
  }
}
