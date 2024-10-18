import { useMemo } from 'react'

import { useLocation } from '@docusaurus/router'

export enum TutorialKind {
  TutorialHome = 'tutorial-home',
  Tutorial = 'tutorial',
  Docs = 'docs',
  Unknown = 'unknown',
}

export function useTutorial(): TutorialKind {
  const location = useLocation()

  const isTutorial = useMemo(() => {
    const [root, first, ..._rest] = location.pathname.split('/').filter(Boolean)
    if (root === 'tutorials' && first === undefined) {
      return TutorialKind.TutorialHome
    } else if (root === 'tutorials' && first !== undefined) {
      return TutorialKind.Tutorial
    } else if (root === 'docs') {
      return TutorialKind.Docs
    } else {
      return TutorialKind.Unknown
    }
  }, [location.pathname])

  return isTutorial
}
