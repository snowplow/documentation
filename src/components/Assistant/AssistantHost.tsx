import React, { Suspense, lazy } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useAssistant } from './AssistantContext'

const AssistantDrawer = lazy(() => import('./AssistantDrawer'))

export default function AssistantHost() {
  const { hasOpened } = useAssistant()
  if (!hasOpened) return null
  return (
    <BrowserOnly>
      {() => (
        <Suspense fallback={null}>
          <AssistantDrawer />
        </Suspense>
      )}
    </BrowserOnly>
  )
}
