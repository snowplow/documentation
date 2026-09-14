import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type AssistantContextValue = {
  isOpen: boolean
  hasOpened: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const AssistantContext = createContext<AssistantContextValue | null>(null)

export const AssistantProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  const open = useCallback(() => {
    setHasOpened(true)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => {
    setHasOpened(true)
    setIsOpen((current) => !current)
  }, [])

  const value = useMemo(
    () => ({ isOpen, hasOpened, open, close, toggle }),
    [isOpen, hasOpened, open, close, toggle]
  )

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  )
}

export const useAssistant = (): AssistantContextValue => {
  const value = useContext(AssistantContext)
  if (!value) {
    throw new Error('useAssistant must be used within AssistantProvider')
  }
  return value
}

export const useOptionalAssistant = (): AssistantContextValue | null =>
  useContext(AssistantContext)

export const prefetchAssistantDrawer = () => {
  void import('./AssistantDrawer')
}
