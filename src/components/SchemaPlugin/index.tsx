import React from 'react'
import { useDoc } from '@docusaurus/theme-common/internal'
import { usePluginData } from '@docusaurus/useGlobalData'
import Head from '@docusaurus/Head'

type BaseFrontMatter = {
  title?: string
  slug?: string
  image?: string
  author?: string
}

function normalizeSlug(slug: string): string {
  return slug.replace(/\/$/, '')
}

export function generateSchema(frontMatter: BaseFrontMatter, pageMeta: any) {
  const { title, slug, image, author } = frontMatter

  const safeTitle = title || 'Snowplow Documentation'
  const description = pageMeta.description || 'Snowplow documentation'
  const keywords = pageMeta.keywords || []
  const fullUrl = `https://snowplow.io${slug || ''}`

  const publisher = {
    '@type': 'Organization',
    name: 'Snowplow',
    url: 'https://snowplow.io',
    logo: {
      '@type': 'ImageObject',
      url: 'https://snowplow.io/images/logo.png',
    },
  }

  const schemaData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle', // always TechArticle
    headline: safeTitle,
    description,
    keywords,
    url: fullUrl,
    inLanguage: 'en-US',
    publisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
  }

  if (image) schemaData.image = image
  if (author) schemaData.author = { '@type': 'Person', name: author }

  return [schemaData]
}

export default function HeadJSONLD() {
  const { frontMatter, metadata } = useDoc()

  const pluginData = usePluginData('docusaurus-plugin-page-schema') as {
    siteUrl: string
    siteName: string
    allPagesMetadata: Record<string, any>
  }

  const allPagesMetadata = pluginData.allPagesMetadata || {}

  const rawSlug =
    frontMatter.slug ||
    metadata.permalink ||
    `/${frontMatter.title?.replace(/\s+/g, '-').toLowerCase()}`
  const slug = normalizeSlug(rawSlug)

  const pageMeta = allPagesMetadata[slug] || {}

  const schemas = generateSchema(
    {
      title: frontMatter.title,
      slug,
      image: (frontMatter as any).image, // safe cast, optional
      author: (frontMatter as any).author, // safe cast, optional
    },
    pageMeta
  )

  return (
    <Head>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Head>
  )
}
