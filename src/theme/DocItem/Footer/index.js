import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import Footer from '@theme-original/DocItem/Footer'
import styles from './styles.module.css'
import { trackStructEvent } from '@snowplow/browser-tracker'
import { useLocation } from '@docusaurus/router'
import { useDoc } from '@docusaurus/theme-common/internal'

function CommentBox({ handleSubmit, feedbackTextRef }) {
  const placeholder = 'How can we improve it?'

  return (
    <form className={styles.feedbackComment} onSubmit={handleSubmit}>
      <textarea
        ref={feedbackTextRef}
        placeholder={placeholder}
        rows={3}
        cols={34}
        maxLength="999"
      />
      <button className="snowplow-button" type="submit">
        Send feedback
      </button>
    </form>
  )
}

export function Feedback() {
  const doc = useDoc()
  const feedbackTextRef = useRef()
  const buttonLikeRef = useRef()
  const buttonDislikeRef = useRef()

  const [isTextboxVisible, setIsTextboxVisible] = useState(false)
  const [isThanksVisible, setIsThanksVisible] = useState(false)

  const handleLike = () => {
    buttonLikeRef.current.blur()
    setIsTextboxVisible(false)

    setIsThanksVisible(true)
    setTimeout(() => {
      setIsThanksVisible(false)
    }, 1000)

    trackStructEvent({
      category: 'feedback',
      action: 'like',
      label: doc.permalink,
    })
  }

  const handleDislike = () => {
    buttonDislikeRef.current.blur()
    setIsTextboxVisible((current) => !current)
    setIsThanksVisible(false)

    trackStructEvent({
      category: 'feedback',
      action: 'dislike',
      label: doc.permalink,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = feedbackTextRef.current.value

    trackStructEvent({
      category: 'feedback',
      action: 'comment',
      label: doc.permalink,
      property: text,
    })

    setIsTextboxVisible((current) => !current)
    setIsThanksVisible(true)
    setTimeout(() => {
      setIsThanksVisible(false)
    }, 1000)
  }

  return (
    <footer>
      <div className={styles.feedbackPrompt}>
        {/* This is a hack/workaround for tutorial pages
          More specifically, we want to show the last updated time below the steps on the sidebar (src/components/tutorials/Steps.tsx) 
          Since they are implemented above where DocProvider wraps the page, `useDoc` is not available 

          Once we move to v3, we can use `lastUpdateUtils` (https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-utils/src/lastUpdateUtils.ts)
          to get the last updated time, as they will be exported
         */}
        <div id="lastUpdated" style={{ display: 'none' }}>
          {doc.metadata.formattedLastUpdatedAt}
        </div>
        {/* This icon ("comment-dots") is part of the
        Font Awesome Free catalogue, covered by the CC BY 4.0 license.
        https://fontawesome.com/license/free
        https://creativecommons.org/licenses/by/4.0/ */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="20"
          height="20"
        >
          <path d="M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
        </svg>
        <span>Was this page helpful?</span>
        <button
          className="snowplow-button"
          ref={buttonLikeRef}
          onClick={handleLike}
        >
          Yes
        </button>
        <button
          className="snowplow-button"
          ref={buttonDislikeRef}
          onClick={handleDislike}
        >
          No
        </button>
      </div>
      {isTextboxVisible && (
        <CommentBox
          handleSubmit={handleSubmit}
          feedbackTextRef={feedbackTextRef}
        />
      )}
      {isThanksVisible && (
        <div className={styles.feedbackThanksMessage}>
          Thanks for your feedback!
        </div>
      )}
    </footer>
  )
}

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <Feedback />
    </>
  )
}
