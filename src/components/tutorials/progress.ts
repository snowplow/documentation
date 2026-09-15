// Tutorial progress is per-reader and stays in the browser: one entry per
// tutorial holding the paths of the steps that reader has finished.
//
// The progress tracker in the sidebar writes this as the reader scrolls, and
// the WebMCP `set_tutorial_progress` tool writes it on behalf of an agent, so
// the key format and the update event live here rather than in either caller.

export const TUTORIAL_PROGRESS_EVENT = 'snowplow:tutorial-progress'

export function progressStorageKey(tutorialId: string): string {
  return `tutorial-progress-${tutorialId}`
}

export function readCompletedSteps(tutorialId: string): string[] {
  // Reading `window.localStorage` can itself throw, not just return undefined,
  // when a browser blocks site data or the page is in a sandboxed frame.
  try {
    const stored = window.localStorage.getItem(progressStorageKey(tutorialId))
    if (!stored) {
      return []
    }
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(
      (step): step is string => typeof step === 'string' && step.length > 0
    )
  } catch {
    return []
  }
}

// Returns the full list of completed steps after the update. Notifies the
// progress tracker so its ticks and percentage update without a reload.
export function writeCompletedSteps(
  tutorialId: string,
  steps: string[]
): string[] {
  const unique = [...new Set(steps)]

  try {
    window.localStorage.setItem(
      progressStorageKey(tutorialId),
      JSON.stringify(unique)
    )
  } catch {
    // Progress is a convenience: a full or blocked store shouldn't break a page.
  }

  window.dispatchEvent(new CustomEvent(TUTORIAL_PROGRESS_EVENT))
  return unique
}
