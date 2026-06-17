/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from 'react'
import clsx from 'clsx'
import BrowserOnly from '@docusaurus/BrowserOnly'
import CopyButton from '@theme/CodeBlock/Buttons/CopyButton'
import WordWrapButton from '@theme/CodeBlock/Buttons/WordWrapButton'
import type { Props } from '@theme/CodeBlock/Buttons'

// Code block buttons are not server-rendered on purpose
// Adding them to the initial HTML is useless and expensive (due to JSX SVG)
// They are hidden by default and require React to become interactive
export default function CodeBlockButtons({ className }: Props): ReactNode {
  const buttonClasses =
    'opacity-100 bg-transparent border border-border text-foreground rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-muted hover:border-primary flex items-center justify-center min-w-8 min-h-8 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:block'

  return (
    <BrowserOnly>
      {() => (
        <div className={clsx(className, 'flex items-center gap-1')}>
          {/* WordWrapButton handles its own visibility based on scroll */}
          <WordWrapButton className={buttonClasses} />
          <CopyButton className={buttonClasses} />
        </div>
      )}
    </BrowserOnly>
  )
}
