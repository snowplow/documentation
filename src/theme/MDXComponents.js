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

library.add(fab, fas, far) // Add all icons to the library so you can use them without importing them individually.

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Icon: FontAwesomeIcon, // Make the FontAwesomeIcon component available in MDX as <icon />.
  ThemedImage: ThemedImage, // Make ThemedImage available in MDX
  ReactMarkdown: ReactMarkdown, // Make ReactMarkdown available in MDX
}
