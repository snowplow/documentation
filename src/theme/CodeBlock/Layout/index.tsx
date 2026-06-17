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
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-transparent min-h-[40px]">
          {/* Left side: Language badge and title */}
          <div className="flex items-center gap-2 flex-1">
            {/* Language badge - hidden for 'text' language */}
            {metadata.language && metadata.language !== 'text' && (
              <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-muted text-foreground border border-border leading-none">
                {metadata.language}
              </span>
            )}
            {/* Title if provided */}
            {metadata.title && (
              <span className="text-sm font-medium text-muted-foreground leading-none">
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
