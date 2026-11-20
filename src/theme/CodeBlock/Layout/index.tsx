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

  const showBadge = Boolean(metadata.language) && metadata.language !== 'text'
  const showHeader = showBadge || Boolean(metadata.title)

  return (
    <Container as="div" className={clsx(className, metadata.className)}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-transparent min-h-[40px]">
          {/* Left side: Language badge and title */}
          <div className="flex items-center gap-2 flex-1">
            {/* Language badge - hidden for 'text' language */}
            {showBadge && (
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

      <div className="group relative">
        <Content />
        {!showHeader && (
          <Buttons className="absolute right-2 top-2 rounded-lg bg-[var(--sp-color-surface)] opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100" />
        )}
      </div>
    </Container>
  )
}
