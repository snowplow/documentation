import React from 'react'
import { useDoc } from '@docusaurus/theme-common/internal'
import { usePluginData } from '@docusaurus/useGlobalData'
import Head from '@docusaurus/Head'

type BreadcrumbItem = { name: string; url: string }
type FAQ = { question: string; answer: string }
type BaseFrontMatter = {
  siteUrl: string
  title: string
  description?: string
  keywords?: string[]
  slug?: string
  url?: string
  date?: string
  last_updated?: string
  schema?: 'Article' | 'TechArticle' | 'HowTo' | 'FAQPage' | 'WebPage'
  image?: string
  author?: string
  breadcrumbs?: BreadcrumbItem[]
  faqs?: FAQ[]
}
type HowToStep = {
  name: string
  url?: string
  text: string
  image?: string // ✅ allow optional image
}
type HowToTool = { name: string }
type HowToFrontMatter = BaseFrontMatter & {
  totalTime?: string
  tool?: HowToTool[]
  step?: HowToStep[]
}
const ALWAYS_INCLUDED_KEYWORDS = [
  'Snowplow',
  'Customer Data Infrastructure',
  'Real-time',
  'Terraform',
  'AWS',
  'GCP',
  'Azure',
  'Behavioral Data',
  'Kinesis',
  'Event',
  'Personalization',
  'Agentic',
]
export function generateSchema(
  frontMatter: BaseFrontMatter | HowToFrontMatter,
  pathname: string
) {
  const {
    title,
    description = '',
    keywords = [],
    slug,
    siteUrl,
    url,
    date,
    last_updated,
    schema,
    image,
    author,
    breadcrumbs = [],
    faqs = [],
  } = frontMatter

  const type = schema || (pathname === '/' ? 'TechArticle' : 'WebPage')
  const fullUrl = url || `https://docs.snowplow.io${slug || ''}`

  const allKeywords = Array.from(
    new Set([...keywords, ...ALWAYS_INCLUDED_KEYWORDS])
  )

  const publisher = {
    '@type': 'Organization',
    name: 'Snowplow',
    url: 'https://snowplow.io',
    logo: {
      '@type': 'ImageObject',
      url: 'https://snowplow.io/images/logo.png',
    },
  }
  const toAbsoluteUrl = (path?: string) => {
    if (!path) return undefined
    return path.startsWith('http') ? path : `${siteUrl}${path}`
  }

  const schemaData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description,
    keywords: allKeywords,
    url: fullUrl,
    date,
    last_updated,
    inLanguage: 'en-US',
    publisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
  }

  if (image) schemaData.image = image
  if (author) schemaData.author = { '@type': 'Person', name: author }
  if (type === 'HowTo') {
    const howTo = frontMatter as HowToFrontMatter

    // ✅ Ensure name fallback
    schemaData.name = title || 'How-To Guide'

    // ✅ Ensure image fallback
    schemaData.image = toAbsoluteUrl(image) || `${siteUrl}/images/gcp-setup.png`


    // ✅ Ensure totalTime (fallback if missing)
    schemaData.totalTime = howTo.totalTime || 'PT15M'

    // ✅ Tools
    if (howTo.tool && howTo.tool.length > 0) {
      schemaData.tool = howTo.tool.map((t) => ({
        '@type': 'HowToTool',
        ...t,
      }))
    } else {
      schemaData.tool = [{ '@type': 'HowToTool', name: 'No special tools required' }]
    }

    // ✅ Steps
    // Steps
    if (howTo.step && howTo.step.length > 0) {
      schemaData.step = howTo.step.map((s, i) => ({
        '@type': 'HowToStep',
        name: s.name || `Step ${i + 1}`,
        text: s.text || 'Follow the instructions in this step.',
        url: toAbsoluteUrl(s.url) || `${fullUrl}#step-${i + 1}`,
        image: toAbsoluteUrl(s.image) || `${siteUrl}/images/gcp-setup.png`, // ✅ fallback
      }))
    } else {
      schemaData.step = [
        {
          '@type': 'HowToStep',
          name: 'Step 1',
          text: 'Read the documentation carefully.',
          url: `${fullUrl}#step-1`,
        },
        {
          '@type': 'HowToStep',
          name: 'Step 2',
          text: 'Follow the setup process as described.',
          url: `${fullUrl}#step-2`,
        },
      ]
    }

  }

  if (type === 'FAQPage' && faqs.length) {
    schemaData.mainEntity = faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    }))
  }

  let breadcrumbSchema
  if (breadcrumbs.length > 0) {
    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: toAbsoluteUrl(crumb.url),
      })),
    }
  }

  if (!schema && type === 'WebPage') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        url: fullUrl,
        inLanguage: 'en-US',
        date,
        last_updated,
        isPartOf: {
          '@type': 'Blog',
          name: 'Snowplow Blog',
          url: 'https://snowplow.io/blog',
        },
      },
      ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ]
  }

  return breadcrumbSchema ? [schemaData, breadcrumbSchema] : [schemaData]
}

export default function HeadJSONLD() {
  const { frontMatter, metadata } = useDoc()

  const pluginData = usePluginData('docusaurus-plugin-page-schema') as {
    siteUrl: string
    siteName: string
    allPagesMetadata: Record<string, any>
  }

  const siteUrl = pluginData.siteUrl || 'https://docs.snowplow.io'
  const siteName = pluginData.siteName || 'Snowplow Documentation'
  const allPagesMetadata = pluginData.allPagesMetadata || {}

  const slug =
    frontMatter.slug ||
    metadata.permalink ||
    `/${frontMatter.title?.replace(/\s+/g, '-').toLowerCase()}`

  const pageMeta = allPagesMetadata[slug] || frontMatter || {}

  const schemas = generateSchema(
    {
      ...pageMeta,
      slug,
      siteUrl,
    },
    metadata.permalink || ''
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
