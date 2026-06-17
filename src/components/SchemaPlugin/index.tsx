import React from 'react'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
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

export function generateSchema(frontMatter: BaseFrontMatter, pageMeta: any, siteUrl: string) {
  const { title, slug, image, author } = frontMatter

  const safeTitle = title || 'Snowplow Documentation'
  const description = pageMeta?.description || 'Snowplow documentation'
  // Keywords are provided by the plugin with fallbacks already applied
  const keywords = pageMeta?.keywords || []

  const site = (siteUrl || 'https://docs.snowplow.io').replace(/\/$/, '')
  const pathPart = !slug || slug === '' ? '/' : slug
  const fullUrl = `${site}${pathPart}`

  const publisher = {
    '@type': 'Organization',
    name: 'Snowplow',
    url: 'https://snowplow.io',
    logo: {
      '@type': 'ImageObject',
      url: `${site}/img/snowplow-logo.svg`,
    },
  }

  const schemaData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
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
  const siteUrl = pluginData.siteUrl || 'https://docs.snowplow.io'

  // Prefer permalink, then slug, then root
  let slug = normalizeSlug(metadata.permalink || frontMatter.slug || '/')
  if (slug === '') slug = '/' // homepage should resolve to "/"

  // Try exact key, then root as a last resort
  const pageMeta = allPagesMetadata[slug] || allPagesMetadata['/'] || {}

  const schemas = generateSchema(
    {
      title: frontMatter.title,
      slug,
      image: (frontMatter as any).image,
      author: (frontMatter as any).author,
    },
    pageMeta,
    siteUrl
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