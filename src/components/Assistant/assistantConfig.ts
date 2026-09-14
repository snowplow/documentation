import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export const DEFAULT_ASSISTANT_API_URL = '/api/assistant/chat'
export const CONVERSATION_STORAGE_KEY = 'snowplow-docs-assistant:v1'
export const MAX_STORED_BYTES = 200 * 1024

export const useAssistantApiUrl = (): string => {
  const { siteConfig } = useDocusaurusContext()
  const configured = siteConfig.customFields?.assistantApiUrl
  return typeof configured === 'string' && configured !== ''
    ? configured
    : DEFAULT_ASSISTANT_API_URL
}
