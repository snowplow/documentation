/**
 * Snowplow Dark Theme for Prism
 * Following popular theme conventions (One Dark, GitHub, etc.)
 * - Strings: teal/cyan
 * - Numbers: orange/yellow
 * - Keywords: purple/magenta
 * - Functions: blue
 * - Comments: muted gray
 */
import { themes } from 'prism-react-renderer'

const baseTheme = themes.vsDark

export default {
  ...baseTheme,
  plain: {
    color: '#e6e6e6', // --foreground
    backgroundColor: '#050505', // --background
  },
  styles: [
    ...baseTheme.styles,
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#999999', // --muted-foreground - gray for comments
        fontStyle: 'italic',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#e6e6e6', // --foreground - standard punctuation
      },
    },
    {
      types: ['property', 'tag', 'constant', 'symbol', 'deleted'],
      style: {
        color: '#e55887', // --chart-4 - pink for tags/constants
      },
    },
    {
      types: ['number', 'boolean', 'regex', 'important'],
      style: {
        color: '#e9b957', // --chart-3 - orange for numbers/booleans/regex
        fontWeight: '500',
      },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {
        color: '#65bfc5', // --chart-2 - teal for strings
        fontWeight: '500',
      },
    },
    {
      types: ['operator', 'entity', 'url', 'variable'],
      style: {
        color: '#e6e6e6', // --foreground - operators in default color
      },
    },
    {
      types: ['atrule', 'attr-value', 'keyword', 'class-name'],
      style: {
        color: '#916ce7', // --primary - purple for keywords
        fontWeight: '500',
      },
    },
    {
      types: ['function'],
      style: {
        color: '#668fe5', // blue for functions
      },
    },
    {
      types: ['title'],
      style: {
        color: '#916ce7', // --primary - purple for titles
        fontWeight: 'bold',
      },
    },
  ],
}
