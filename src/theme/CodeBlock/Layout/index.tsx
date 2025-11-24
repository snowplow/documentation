/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from 'react'
import clsx from 'clsx'
import { useCodeBlockContext } from '@docusaurus/theme-common/internal'
import Container from '@theme/CodeBlock/Container'
import Content from '@theme/CodeBlock/Content'
import type { Props } from '@theme/CodeBlock/Layout'
import Buttons from '@theme/CodeBlock/Buttons'

export default function CodeBlockLayout({ className }: Props): ReactNode {
  const { metadata } = useCodeBlockContext()

  // Always show header with language badge
  const showHeader = true

  return (
    <Container as="div" className={clsx(className, metadata.className)}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 min-h-[44px]">
          {/* Left side: Language badge and title */}
          <div className="flex items-center gap-2 flex-1">
            {/* Language badge */}
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 leading-none">
              {metadata.language || 'text'}
            </span>
            {/* Title if provided */}
            {metadata.title && (
              <span className="text-sm font-medium text-foreground leading-none">
                {metadata.title}
              </span>
            )}
          </div>

          {/* Right side: Buttons */}
          <div className="flex items-center shrink-0">
            <Buttons className="!static !opacity-100" />
          </div>
        </div>
      )}

      <div className="relative">
        <Content />
      </div>
    </Container>
  )
}
