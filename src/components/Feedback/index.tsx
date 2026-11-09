import React, { useState } from 'react'
import { useLocation } from '@docusaurus/router'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { trackStructEvent } from '@snowplow/browser-tracker'
import { hasAnalyticsConsent, showCookiePreferences } from '@site/src/helpers/consent'

type Answer = 'yes' | 'no'

const REASONS: Record<Answer, string[]> = {
  yes: ['Easy to follow', 'Solved my problem', 'Good examples'],
  no: ['Hard to follow', 'Missing information', 'Code or steps didn’t work', 'Out of date'],
}

/**
 * Send one structured event to the site's own Snowplow tracker. Only called
 * when the reader has granted analytics consent. The tracker is set up in
 * snowplow.js; if it isn't (blocked, local build), nothing is sent.
 */
function send(action: string, path: string, property: string) {
  try {
    trackStructEvent({ category: 'docs', action, label: path, property })
  } catch (err) {
    console.warn('Failed to send page feedback:', err)
  }
}

/**
 * "Was this page helpful?" at the end of every doc page. The answer, and an
 * optional reason, are sent as Snowplow structured events (category docs,
 * action page_feedback and page_feedback_reason, label = page path, property
 * = answer). Nothing is sent without analytics consent: the reader sees a
 * thank-you and a link to their cookie preferences instead.
 *
 * Replaces the Product Fruits feedback side tab on doc pages. See
 * research/blueprint-notes/usage-baselines.md for how the events are queried.
 */
export default function Feedback(): JSX.Element {
  const { pathname } = useLocation()
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const [consented, setConsented] = useState(true)

  const choose = (value: Answer) => {
    const ok = hasAnalyticsConsent()
    setConsented(ok)
    setAnswer(value)
    if (ok) send('page_feedback', pathname, value)
  }

  const chooseReason = (value: string) => {
    setReason(value)
    if (consented && answer) send('page_feedback_reason', pathname, `${answer}: ${value}`)
  }

  return (
    <section className="sp-feedback" aria-labelledby="sp-feedback-title">
      {!answer ? (
        <div className="sp-feedback__row">
          <h2 id="sp-feedback-title" className="sp-feedback__title">
            Was this page helpful?
          </h2>
          <div className="sp-feedback__buttons">
            <button type="button" className="sp-button sp-button--secondary sp-button--sm" onClick={() => choose('yes')}>
              <ThumbsUp size={16} aria-hidden="true" />
              Yes
            </button>
            <button type="button" className="sp-button sp-button--secondary sp-button--sm" onClick={() => choose('no')}>
              <ThumbsDown size={16} aria-hidden="true" />
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="sp-feedback__thanks" aria-live="polite">
          <h2 id="sp-feedback-title" className="sp-feedback__title">
            Thanks for your feedback
          </h2>
          {consented ? (
            !reason ? (
              <>
                <p className="sp-feedback__prompt">
                  {answer === 'yes' ? 'What worked well?' : 'What went wrong?'} (optional)
                </p>
                <div className="sp-feedback__reasons">
                  {REASONS[answer].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className="sp-button sp-button--ghost sp-button--sm"
                      onClick={() => chooseReason(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {answer === 'no' && (
                  <p className="sp-feedback__prompt">
                    For anything else, <a href="https://github.com/snowplow/documentation/issues/new">open an issue on GitHub</a>.
                  </p>
                )}
              </>
            ) : null
          ) : (
            <p className="sp-feedback__prompt">
              Your answer wasn’t sent because analytics cookies are off.{' '}
              <button type="button" className="sp-button sp-button--link" onClick={showCookiePreferences}>
                Change cookie preferences
              </button>
            </p>
          )}
        </div>
      )}
    </section>
  )
}
