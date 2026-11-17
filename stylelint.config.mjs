// Stylelint rules for the docs CSS. Run with `yarn lint:css`.
//
// These rules describe the target for the CSS rewrite (Phase 1 of the docs
// redesign blueprint). The current CSS doesn't pass them yet, so the check is
// not part of `yarn build`.
export default {
  plugins: ['./quality/stylelint/important-budget.mjs'],
  ignoreFiles: ['build/**', 'node_modules/**', '.docusaurus/**', 'static/**'],
  rules: {
    // At most 10 !important declarations per file
    'snowplow/important-budget': 10,

    'selector-disallowed-list': [
      [
        // Attribute substring matches on class names, e.g. [class*='sidebar_']
        /\[class[*^$|~]?=/,
        // Docusaurus CSS module hashes, e.g. .sidebar_njMd or .docItemCol_VOVn
        // (BEM classes such as .menu__link are allowed)
        /\.[A-Za-z][\w-]*[A-Za-z0-9]_[A-Za-z0-9-]{4}(?![\w-])/,
        // Emotion/MUI generated classes, e.g. .css-yu4ftp-MuiDataGrid-root
        /\.css-[a-z0-9]+/,
      ],
      {
        message: (selector) =>
          `"${selector}" targets a generated class name that changes between releases. Use a stable class, a data attribute, or a theme CSS variable.`,
      },
    ],

    // Catch real mistakes without imposing a formatting style
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [true, { ignore: ['consecutive-duplicates-with-different-values'] }],
    'no-duplicate-selectors': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'unit-no-unknown': true,
    'at-rule-no-unknown': [true, { ignoreAtRules: ['tailwind', 'apply', 'layer', 'config', 'screen', 'variants', 'responsive'] }],
  },
}
