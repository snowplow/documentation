/**
 * Snowplow Light Theme for Prism
 * Based on Snowplow brand colors
 */

import { themes } from 'prism-react-renderer'

const baseTheme = themes.github

export default {
  ...baseTheme,
  styles: [
    ...baseTheme.styles,
    {
      types: ['title'],
      style: {
        color: '#673bb8', // Primary purple
        fontWeight: 'bold',
      },
    },
    {
      types: ['parameter'],
      style: {
        color: '#269278', // Secondary teal
      },
    },
    {
      types: ['boolean', 'rule', 'color', 'number', 'constant', 'property'],
      style: {
        color: '#4040bf', // Primary blue
      },
    },
    {
      types: ['atrule', 'tag'],
      style: {
        color: '#1d747b', // Secondary darker teal
      },
    },
    {
      types: ['script'],
      style: {
        color: '#191919', // Primary black
      },
    },
    {
      types: ['operator', 'unit', 'rule'],
      style: {
        color: '#ff4b1d', // Secondary orange-red
      },
    },
    {
      types: ['font-matter', 'string', 'attr-value'],
      style: {
        color: '#fc5e36', // Secondary coral
      },
    },
    {
      types: ['class-name'],
      style: {
        color: '#34caa6', // Secondary mint
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: '#673bb8', // Primary purple
      },
    },
    {
      types: ['keyword'],
      style: {
        color: '#9e62dd', // Primary lighter purple
      },
    },
    {
      types: ['function'],
      style: {
        color: '#7002fd', // Secondary vibrant purple
      },
    },
    {
      types: ['selector'],
      style: {
        color: '#4d01af', // Secondary deep purple
      },
    },
    {
      types: ['variable'],
      style: {
        color: '#673bb8', // Primary purple (consistent with dark theme purple approach)
      },
    },
    {
      types: ['comment'],
      style: {
        color: '#9276c4', // Muted purple (better contrast, consistent with dark theme)
        fontStyle: 'italic',
      },
    },
  ],
}
