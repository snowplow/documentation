/**
 * Build a Prism theme from the design tokens. The light and dark themes are a
 * matched pair: the same token types get the same role colors in both modes.
 */
import tokens from '../../design/tokens'

export default function makePrismTheme(mode) {
  const s = tokens.syntax[mode]
  return {
    plain: {
      color: s.plain,
      backgroundColor: tokens.color[mode].surface,
    },
    styles: [
      { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: s.comment, fontStyle: 'italic' } },
      { types: ['punctuation'], style: { color: s.punctuation } },
      { types: ['namespace'], style: { opacity: 0.8 } },
      { types: ['keyword', 'atrule', 'selector', 'important', 'class-name', 'title'], style: { color: s.keyword } },
      { types: ['string', 'char', 'attr-value', 'regex', 'inserted', 'url'], style: { color: s.string } },
      { types: ['number', 'boolean', 'constant', 'symbol'], style: { color: s.number } },
      { types: ['function', 'builtin', 'method'], style: { color: s.function } },
      { types: ['tag', 'deleted'], style: { color: s.tag } },
      { types: ['property', 'attr-name', 'key'], style: { color: s.attr } },
      { types: ['operator', 'entity', 'variable', 'parameter'], style: { color: s.variable } },
      { types: ['bold'], style: { fontWeight: 600 } },
      { types: ['italic'], style: { fontStyle: 'italic' } },
    ],
  }
}
