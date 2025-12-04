/**
 * Snowplow Light Theme for Prism
 * Following popular theme conventions (One Dark, GitHub, etc.)
 * - Strings: teal/cyan
 * - Numbers: orange/yellow
 * - Keywords: purple/magenta
 * - Functions: blue
 * - Comments: muted gray
 */
import { themes } from 'prism-react-renderer'

const baseTheme = themes.github

export default {
  ...baseTheme,
  plain: {
    color: '#111827', // --foreground
    backgroundColor: '#f9fafb', // --background
  },
  styles: [
    ...baseTheme.styles,
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#4b5563', // --muted-foreground - gray for comments
        fontStyle: 'italic',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#111827', // --foreground - standard punctuation
      },
    },
    {
      types: ['property', 'tag', 'boolean', 'constant', 'symbol', 'deleted'],
      style: {
        color: '#dd3327', // --destructive - red for tags/booleans
      },
    },
    {
      types: ['number'],
      style: {
        color: '#e8ab30', // --chart-3 - orange for numbers
        fontWeight: '500',
      },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {
        color: '#0e9ba4', // --chart-2 - teal for strings
        fontWeight: '500',
      },
    },
    {
      types: ['operator', 'entity', 'url', 'variable'],
      style: {
        color: '#111827', // --foreground - operators in default color
      },
    },
    {
      types: ['atrule', 'attr-value', 'keyword', 'class-name'],
      style: {
        color: '#6638b8', // --primary - purple for keywords
        fontWeight: '500',
      },
    },
    {
      types: ['function'],
      style: {
        color: '#2761d9', // --chart-5 - blue for functions
      },
    },
    {
      types: ['regex', 'important'],
      style: {
        color: '#e23670', // --chart-4 - pink for regex/important
        fontWeight: '500',
      },
    },
    {
      types: ['title'],
      style: {
        color: '#6638b8', // --primary - purple for titles
        fontWeight: 'bold',
      },
    },
  ],
}
