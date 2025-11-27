/**
 * Snowplow Dark Theme for Prism
 * Based on Snowplow brand colors
 */

import { themes } from 'prism-react-renderer'

const baseTheme = themes.vsDark

export default {
  ...baseTheme,
  styles: [
    ...baseTheme.styles,
    {
      types: ['title'],
      style: {
        color: '#d1a5ff', // Lighter purple for dark bg
        fontWeight: 'bold',
      },
    },
    {
      types: ['parameter'],
      style: {
        color: '#85d8c5', // Pale teal
      },
    },
    {
      types: ['boolean', 'rule', 'color', 'number', 'constant', 'property'],
      style: {
        color: '#7d7dff', // Lighter blue
      },
    },
    {
      types: ['atrule', 'tag'],
      style: {
        color: '#34caa6', // Mint
      },
    },
    {
      types: ['script'],
      style: {
        color: '#f3f1ec', // Off-white
      },
    },
    {
      types: ['operator', 'unit', 'rule'],
      style: {
        color: '#ff4b1d', // Orange-red
      },
    },
    {
      types: ['font-matter', 'string', 'attr-value'],
      style: {
        color: '#fdc7b9', // Light coral
      },
    },
    {
      types: ['class-name'],
      style: {
        color: '#6ae9f4', // Light cyan
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: '#dec4f8', // Very light purple
      },
    },
    {
      types: ['keyword'],
      style: {
        color: '#aa58ff', // Bright purple
      },
    },
    {
      types: ['function'],
      style: {
        color: '#eddffb', // Pale purple
      },
    },
    {
      types: ['selector'],
      style: {
        color: '#7002fd', // Vibrant purple
      },
    },
    {
      types: ['variable'],
      style: {
        color: '#d1a5ff', // Lighter purple (consistent with light theme purple approach)
      },
    },
    {
      types: ['comment'],
      style: {
        color: '#9276c4', // Muted purple (consistent with light theme)
        fontStyle: 'italic',
      },
    },
  ],
}
