import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import { ThemeClassNames } from '@docusaurus/theme-common'
import { useDoc } from '@docusaurus/theme-common/internal'
import LastUpdated from '@theme/LastUpdated'
import EditThisPage from '@theme/EditThisPage'
import TagsListInline from '@theme/TagsListInline'
import styles from './styles.module.css'
import { trackStructEvent } from '@snowplow/browser-tracker'

function TagsRow(props) {
  return (
    <div
      className={clsx(
        ThemeClassNames.docs.docFooterTagsRow,
        'row margin-bottom--sm'
      )}
    >
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  )
}

function CommentBox({ handleSubmit, feedbackTextRef }) {
  const [textContent, setTextContent] = useState("Why wasn't it helpful?")
  const [textareaFocussed, setTextareaFocussed] = useState(false)

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.comment_box}
          ref={feedbackTextRef}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          onFocus={() => {
            if (textareaFocussed === false) {
              setTextContent('')
              setTextareaFocussed(true)
            }
          }}
          rows={4}
          cols={40}
        />
        <button className={styles.feedback_button} type="submit">
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
    console.log('submitted')

    const text = feedbackTextRef.current.defaultValue
    console.log(text)

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
    <div className="col margin-bottom--sm">
      <span className={styles.feedback_question}>Was this page helpful?</span>
      <div className="row">
        <button
          className={styles.feedback_button}
          ref={buttonLikeRef}
          onClick={handleLike}
        >
          Yes
        </button>
        <button
          className={styles.feedback_button}
          ref={buttonDislikeRef}
          onClick={handleDislike}
        >
          No
        </button>
        {isThanksVisible && <span>Thanks for your feedback!</span>}
      </div>
      {isTextboxVisible && (
        <CommentBox
          handleSubmit={handleSubmit}
          feedbackTextRef={feedbackTextRef}
        />
      )}
    </div>
  )
}

function EditMetaRow({
  editUrl,
  lastUpdatedAt,
  lastUpdatedBy,
  formattedLastUpdatedAt,
}) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow, 'row')}>
      <div className="col">{editUrl && <EditThisPage editUrl={editUrl} />}</div>

      <div className={clsx('col', styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            formattedLastUpdatedAt={formattedLastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}
      </div>
    </div>
  )
}
export default function DocItemFooter() {
  const { metadata } = useDoc()
  const {
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
    tags,
  } = metadata
  const canDisplayTagsRow = tags.length > 0
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy)
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow
  if (!canDisplayFooter) {
    return null
  }
  return (
    <footer
      className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}
    >
      <Feedback />
      {canDisplayTagsRow && <TagsRow tags={tags} />}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          formattedLastUpdatedAt={formattedLastUpdatedAt}
        />
      )}
    </footer>
  )
}
