import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import Footer from '@theme-original/DocItem/Footer'
import { useDoc } from '@docusaurus/theme-common/internal'
import styles from './styles.module.css'
import { trackStructEvent } from '@snowplow/browser-tracker'

function CommentBox({ handleSubmit, feedbackTextRef }) {
  const [textContent, setTextContent] = useState("Why wasn't it helpful?")
  const [textareaFocussed, setTextareaFocussed] = useState(false)

  return (
    <div className="row">
      <form onSubmit={handleSubmit}>
        <textarea
          className={clsx(styles.commentBox, 'col')}
          ref={feedbackTextRef}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          onFocus={() => {
            if (textareaFocussed === false) {
              setTextContent('')
              setTextareaFocussed(true)
            }
          }}
          rows={3}
          cols={30}
        />
        <button
          className={clsx(
            'navbar__item',
            'snwpl-nav-button',
            'col',
            styles.submitButton
          )}
          type="submit"
        >
          Send feedback
        </button>
      </form>
    </div>
  )
}

function Feedback() {
  const { permalink } = useDoc().metadata
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
      label: permalink,
    })
  }

  const handleDislike = () => {
    buttonDislikeRef.current.blur()
    setIsTextboxVisible((current) => !current)
    setIsThanksVisible(false)

    trackStructEvent({
      category: 'feedback',
      action: 'dislike',
      label: permalink,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = feedbackTextRef.current.defaultValue

    trackStructEvent({
      category: 'feedback',
      action: 'comment',
      label: permalink,
      property: text,
    })

    setIsTextboxVisible((current) => !current)
    setIsThanksVisible(true)
    setTimeout(() => {
      setIsThanksVisible(false)
    }, 1000)
  }

  return (
    <div className="col margin-bottom--sm" style={{ paddingLeft: 0 + 'px' }}>
      <div className="row margin-bottom--sm" style={{ marginLeft: 0 + 'px' }}>
        <div className={styles.feedbackQuestion}>Was this page helpful?</div>
        <div>
          <button
            className={clsx('navbar__item', 'snwpl-nav-button')}
            ref={buttonLikeRef}
            onClick={handleLike}
          >
            Yes
          </button>
          <button
            className={clsx('navbar__item', 'snwpl-nav-button')}
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
      </div>
      <div className={clsx('row', styles.feedbackThanksMessage)}>
        {isThanksVisible && <span>Thanks for your feedback!</span>}
      </div>
    </div>
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
