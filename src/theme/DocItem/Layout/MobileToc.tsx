import React from 'react'
import clsx from 'clsx'
import { AlignLeft } from 'lucide-react'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import TOCItems from '@theme/TOCItems'
import { useDisclosure } from '@site/src/components/navigation/useDisclosure'

/**
 * "On this page" for narrow screens: a button in the page header row that
 * opens the table of contents over the content, so it takes no height until
 * the reader asks for it. Hidden on desktop, which has the side TOC.
 */
export default function MobileToc() {
  const { toc, frontMatter } = useDoc()
  const panel = useDisclosure()

  return (
    <div className="mobile-toc" ref={panel.rootRef}>
      <button type="button" className="mobile-toc__button" {...panel.buttonProps}>
        <AlignLeft size={16} aria-hidden="true" />
        <span>On this page</span>
      </button>
      <nav
        id={panel.panelId}
        aria-label="On this page"
        className={clsx('mobile-toc__panel', panel.open && 'mobile-toc__panel--open')}
        hidden={!panel.open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) panel.close()
        }}
      >
        <TOCItems
          toc={toc}
          minHeadingLevel={frontMatter.toc_min_heading_level}
          maxHeadingLevel={frontMatter.toc_max_heading_level}
        />
      </nav>
    </div>
  )
}
