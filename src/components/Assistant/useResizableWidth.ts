import { useCallback, useEffect, useRef, useState } from 'react'

export const DEFAULT_DRAWER_WIDTH = 560
const MIN_WIDTH = 380
const MAX_WIDTH = 1100
const VIEWPORT_MARGIN = 240
const KEYBOARD_STEP = 32
const STORAGE_KEY = 'snowplow-docs-assistant:width'

const readStoredWidth = (): number | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const value = raw === null ? NaN : Number(raw)
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

const storeWidth = (width: number) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Math.round(width)))
  } catch {
    // Storage disabled: the width simply resets next time.
  }
}

const maxWidth = () =>
  Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, window.innerWidth - VIEWPORT_MARGIN))

const clamp = (width: number) =>
  Math.min(maxWidth(), Math.max(MIN_WIDTH, Math.round(width)))

export const useResizableWidth = () => {
  const [width, setWidth] = useState(() =>
    typeof window === 'undefined'
      ? DEFAULT_DRAWER_WIDTH
      : clamp(readStoredWidth() ?? DEFAULT_DRAWER_WIDTH)
  )
  const [isResizing, setIsResizing] = useState(false)
  const widthRef = useRef(width)
  widthRef.current = width

  useEffect(() => {
    const onResize = () => setWidth((current) => clamp(current))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const commit = useCallback((next: number) => {
    const clamped = clamp(next)
    setWidth(clamped)
    storeWidth(clamped)
  }, [])

  const startResize = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    event.preventDefault()
    const startX = event.clientX
    const startWidth = widthRef.current
    setIsResizing(true)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    const onMove = (move: PointerEvent) => {
      setWidth(clamp(startWidth + (startX - move.clientX)))
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      setIsResizing(false)
      storeWidth(widthRef.current)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }, [])

  const onHandleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        commit(widthRef.current + KEYBOARD_STEP)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        commit(widthRef.current - KEYBOARD_STEP)
      } else if (event.key === 'Home') {
        event.preventDefault()
        commit(DEFAULT_DRAWER_WIDTH)
      }
    },
    [commit]
  )

  const resetWidth = useCallback(() => commit(DEFAULT_DRAWER_WIDTH), [commit])

  return {
    width,
    isResizing,
    startResize,
    onHandleKeyDown,
    resetWidth,
    minWidth: MIN_WIDTH,
    maxWidth: maxWidth,
  }
}
