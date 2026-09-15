import { DEMO_BOOKING_URL, FREE_TRIAL_URL } from '@site/src/constants/config'

import { readBoolean, readString, type WebMcpTool } from './types'

type Offer = 'demo' | 'trial'

const OFFERS: Record<Offer, { label: string; url: string; summary: string }> = {
  demo: {
    label: 'Book a demo',
    url: DEMO_BOOKING_URL,
    summary:
      'A walkthrough of Snowplow with the team, at a time the reader picks.',
  },
  trial: {
    label: 'Try for free',
    url: FREE_TRIAL_URL,
    summary:
      'A self-serve free trial, for a reader who would rather start without talking to anyone.',
  },
}

const OFFER_VALUES = Object.keys(OFFERS) as Offer[]

// Both pages live on snowplow.io, a different origin from the docs, and each
// asks the reader for their own name, email, and company. So this tool goes as
// far as putting the page in front of them and stops: it fills in nothing,
// submits nothing, and takes no personal details as arguments. Booking stays the
// reader's own action.
//
// Opening happens in a new tab so the reader keeps the docs page they were on,
// and with `noopener` so the marketing page gets no handle on it. A tool call
// carries no user activation, so a popup blocker may well refuse; that is why
// the url comes back either way and the result says which happened.
function openInNewTab(url: string): boolean {
  return window.open(url, '_blank', 'noopener,noreferrer') !== null
}

export function createDemoTools(): WebMcpTool[] {
  return [
    {
      name: 'book_demo',
      description:
        'Opens the page where the reader can book a demo of Snowplow with the team, or start a free trial instead, and returns its URL. Show the reader the url from the result: they fill in and submit the booking form themselves, and this tool sends no personal information.',
      // Not read-only: it opens a page, and it is the step where a reader
      // starts talking to sales, so an agent should check before calling it.
      annotations: { consequentialHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          offer: {
            type: 'string',
            enum: OFFER_VALUES,
            description:
              '"demo" books time with the Snowplow team, and is the default. "trial" opens the self-serve free trial instead, for a reader who would rather not talk to anyone yet.',
          },
          open: {
            type: 'boolean',
            description:
              'Whether to open the page in a new tab. Defaults to true. Pass false to get the url back without opening anything, to offer the reader a link instead.',
          },
        },
      },
      async execute(input) {
        const requested = readString(input, 'offer') ?? 'demo'
        if (requested !== 'demo' && requested !== 'trial') {
          throw new Error(
            `\`offer\` must be one of: ${OFFER_VALUES.join(', ')}.`
          )
        }

        const offer = OFFERS[requested]
        const shouldOpen = readBoolean(input, 'open') ?? true
        const opened = shouldOpen && openInNewTab(offer.url)

        return {
          offer: requested,
          label: offer.label,
          url: offer.url,
          opened,
          alternative: requested === 'demo' ? OFFERS.trial : OFFERS.demo,
          note: opened
            ? 'The page is open in a new tab. The reader completes the form there; nothing has been submitted for them.'
            : shouldOpen
            ? 'The browser blocked the new tab, which it does for a tab a reader did not ask for by clicking. Give the reader the url to open themselves.'
            : 'Nothing was opened. Give the reader the url to open themselves.',
        }
      },
    },
  ]
}
