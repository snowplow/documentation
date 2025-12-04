import React from 'react'
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Import the FontAwesomeIcon component.
import { library } from '@fortawesome/fontawesome-svg-core' // Import the library component.
import { fab } from '@fortawesome/free-brands-svg-icons' // Import all brands icons.
import { fas } from '@fortawesome/free-solid-svg-icons' // Import all solid icons.
import { far } from '@fortawesome/free-regular-svg-icons' // Import all regular icons.

import ThemedImage from '@theme/ThemedImage'
import ReactMarkdown from 'react-markdown'
import { AnchorHeading } from '@site/src/components/ui/anchor-heading'

library.add(fab, fas, far) // Add all icons to the library so you can use them without importing them individually.

// Create wrapper components for different heading levels
const H1 = (props) => <AnchorHeading as="h1" {...props} />
const H2 = (props) => <AnchorHeading as="h2" {...props} />
const H3 = (props) => <AnchorHeading as="h3" {...props} />

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Icon: FontAwesomeIcon, // Make the FontAwesomeIcon component available in MDX as <icon />.
  ThemedImage: ThemedImage, // Make ThemedImage available in MDX
  ReactMarkdown: ReactMarkdown, // Make ReactMarkdown available in MDX
  h1: H1, // Override h1 with AnchorHeading
  h2: H2, // Override h2 with AnchorHeading
  h3: H3, // Override h3 with AnchorHeading
}
