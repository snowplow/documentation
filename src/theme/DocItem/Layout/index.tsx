import React from 'react'
import clsx from 'clsx'
import { useWindowSize } from '@docusaurus/theme-common'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import DocItemPaginator from '@theme/DocItem/Paginator'
import DocVersionBanner from '@theme/DocVersionBanner'
import DocVersionBadge from '@theme/DocVersionBadge'
import DocItemFooter from '@theme/DocItem/Footer'
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile'
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop'
import DocItemContent from '@theme/DocItem/Content'
import DocBreadcrumbs from '@theme/DocBreadcrumbs'
import type { Props } from '@theme/DocItem/Layout'

import styles from './styles.module.css'
import { Paper } from '@mui/material'

import { useTutorial, TutorialKind } from '@site/src/components/tutorials/hooks'
import { AlignLeft } from 'lucide-react'
import HeadJSONLD from '../../../components/SchemaPlugin'

import Demo_Ad from '../../../components/ui/Demo_Ad'

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const { frontMatter, toc } = useDoc()
  const windowSize = useWindowSize()

  const hidden = frontMatter.hide_table_of_contents
  const canRender = !hidden && toc.length > 0

  const mobile = canRender ? <DocItemTOCMobile /> : undefined

  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined

  return {
    hidden,
    mobile,
    desktop,
  }
}

export default function DocItemLayout({ children }: Props): JSX.Element {
  const docTOC = useDocTOC()
  const tutorial = useTutorial()

  return (
    <>
      <HeadJSONLD />
      <div className="row">
        <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article className="max-w-full overflow-x-hidden leading-relaxed prose prose-headings:font-bold prose-p:mt-0 prose-table:block prose-table:rounded-lg prose-td:ps-3 prose-td:pe-3 prose-th:ps-3 prose-th:pe-3 prose-ul:mt-0 prose-ol:mt-0 prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-code:text-sm prose-img:mx-auto prose-img:block ">
              <DocBreadcrumbs />
              <DocVersionBadge />
              {docTOC.mobile}
              {tutorial === TutorialKind.Tutorial ? (
                <Paper sx={{ p: 2, pt: 2 }}>
                  <DocItemContent>{children}</DocItemContent>
                </Paper>
              ) : (
                <DocItemContent>{children}</DocItemContent>
              )}
              <DocItemFooter />
            </article>
            <DocItemPaginator />
          </div>
        </div>
        {docTOC.desktop && (
          <div className="col col--3">
            <div className="sticky top-16">
              <div className="flex items-center gap-2 my-1">
                <AlignLeft size={16} className="opacity-70 text-foreground" />
                <p className="text-[0.825rem] font-normal opacity-70 text-foreground m-0 pl-1">
                  On this page
                </p>
              </div>
              {docTOC.desktop}
              <Demo_Ad />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
