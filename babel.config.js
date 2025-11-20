module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [],
  // Ignore problematic plugin files during transpilation
  ignore: ['**/node_modules/docusaurus-theme-github-codeblock/**/*.js'],
}
