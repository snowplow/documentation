import React from 'react'
import clsx from 'clsx'
import {useCodeBlockContext} from '@docusaurus/theme-common/internal'
import Container from '@theme/CodeBlock/Container'
import Title from '@theme/CodeBlock/Title'
import Content from '@theme/CodeBlock/Content'
import Buttons from '@theme/CodeBlock/Buttons'
import Box from '@mui/material/Box'
import RunButton from '@site/src/components/RunnableSnippets/RunButton'
import { parseRunnable } from '@site/src/components/RunnableSnippets/docsTrackerUtils'
import styles from './styles.module.css'

export default function CodeBlockLayout({className}) {
  const {metadata} = useCodeBlockContext()

  // Check if this code block should have a run button
  const isRunnable = parseRunnable(metadata.metastring) || metadata.runnable

  return (
    <Container as="div" className={clsx(className, metadata.className)}>
      {metadata.title && (
        <div className={styles.codeBlockTitle}>
          <Title>{metadata.title}</Title>
        </div>
      )}
      <div className={styles.codeBlockContent}>
        <Content />
        <div className={styles.buttonGroup}>
          <Box>
            {isRunnable && (
              <RunButton className={styles.codeButton} code={metadata.code} />
            )}
          </Box>
          <Box className={styles.rightCodeButtons}>
            <Buttons />
          </Box>
        </div>
      </div>
    </Container>
  )
}