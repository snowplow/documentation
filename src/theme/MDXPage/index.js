import React from 'react'
import clsx from 'clsx'
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common'
import Layout from '@theme/Layout'
import MDXContent from '@theme/MDXContent'
import TOC from '@theme/TOC'
import styles from './styles.module.css'
export default function MDXPage(props) {
  const { content: MDXPageContent } = props
  const {
    metadata: { title, description, frontMatter },
  } = MDXPageContent
  const { wrapperClassName, hide_table_of_contents: hideTableOfContents } =
    frontMatter
  return (
    <HtmlClassNameProvider
      className={clsx(
        wrapperClassName ?? ThemeClassNames.wrapper.mdxPages,
        ThemeClassNames.page.mdxPage
      )}
    >
      <PageMetadata title={title} description={description} />
      <Layout>
        <main className="container container--fluid margin-vert--lg">
          <div className={clsx('row', styles.mdxPageWrapper)}>
            <div className={clsx('col', !hideTableOfContents && 'col--7')}>
              <article className="overflow-x-auto max-w-none leading-relaxed prose-headings:font-bold prose-p:mt-0 prose-table:rounded-lg prose-td:ps-3 prose-td:pe-3 prose-th:ps-3 prose-th:pe-3 prose-ul:mt-0 prose-ol:mt-0 prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-code:text-sm prose-img:mx-auto prose-img:block">
                <MDXContent>
                  <MDXPageContent />
                </MDXContent>
              </article>
            </div>
            {!hideTableOfContents && MDXPageContent.toc.length > 0 && (
              <div className="col col--3">
                <TOC
                  toc={MDXPageContent.toc}
                  minHeadingLevel={frontMatter.toc_min_heading_level}
                  maxHeadingLevel={frontMatter.toc_max_heading_level}
                />  
              </div>
            )}
          </div>
        </main>
      </Layout>
    </HtmlClassNameProvider>
  )
}
