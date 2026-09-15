import { useEffect } from 'react'
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client'
import type { PropSidebar } from '@docusaurus/plugin-content-docs'

export type ActiveSidebar = { name: string; items: PropSidebar }

// The tools are registered once at the app root, but `useDocsSidebar` only
// resolves inside `DocRoot`. These module-level values bridge the two trees.
let activeSidebar: ActiveSidebar | null = null
let lastDocsSidebar: ActiveSidebar | null = null

// The sidebar of the page currently open, or null on pages without one
// (tutorials, release notes, standalone pages).
export function getActiveSidebar(): ActiveSidebar | null {
  return activeSidebar
}

// The most recent docs sidebar seen in this session. The docs tree is the same
// on every `/docs/` page, so this keeps site-structure answers available after
// the reader moves to a page that has no sidebar of its own.
export function getLastDocsSidebar(): ActiveSidebar | null {
  return lastDocsSidebar
}

// Publishes the sidebar rendered by `DocRoot` to the module-level values above.
export function useReportActiveSidebar(): void {
  const sidebar = useDocsSidebar()

  useEffect(() => {
    activeSidebar = sidebar
    if (sidebar) {
      lastDocsSidebar = sidebar
    }
    return () => {
      activeSidebar = null
    }
  }, [sidebar])
}
