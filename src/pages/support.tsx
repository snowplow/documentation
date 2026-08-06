import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import { CardGrid, LinkCard } from '@site/src/components/CardGrid'

const supportLinks = [
  {
    title: 'Knowledge Base',
    description: 'Browse Snowplow help articles and documentation for common questions.',
    href: 'https://support.snowplow.io/hc/en-us',
  },
  {
    title: 'Community',
    description: 'Join the Snowplow community forum to discuss ideas and ask questions.',
    href: 'https://support.snowplow.io/hc/en-us/community/topics',
  },
  {
    title: 'Submit a ticket',
    description: 'Open a support ticket for account, product, or implementation help.',
    href: 'https://snplow.atlassian.net/servicedesk/customer/portals',
  },
]

export default function SupportPage() {
  return (
    <Layout
      title="Support"
      description="Get support through the Snowplow Knowledge Base, community forum, or support ticketing portal."
    >
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="margin-bottom--lg">
              <h1 className="margin-bottom--sm">Support</h1>
              <p className="text--lg text--secondary">
                Choose the right Snowplow support channel for your needs.
              </p>
            </div>

            <CardGrid cols={3}>
              {supportLinks.map((link) => (
                <LinkCard
                  key={link.title}
                  title={link.title}
                  description={link.description}
                  href={link.href}
                  centered
                />
              ))}
            </CardGrid>

            <div className="margin-top--lg text--center">
              <Link to="/docs/" className="button button--secondary">
                Browse documentation
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
