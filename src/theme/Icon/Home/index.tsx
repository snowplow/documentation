import React, { type ReactNode } from 'react'
import { Home } from 'lucide-react'
import type { Props } from '@theme/Icon/Home'

export default function IconHome(props: Props): ReactNode {
  return <Home size={18} {...props} />
}