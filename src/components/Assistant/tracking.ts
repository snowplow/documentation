import { trackSelfDescribingEvent } from '@snowplow/browser-tracker'

const ASSISTANT_INTERACTION_SCHEMA =
  'iglu:com.snowplowanalytics.console/assistant_interaction/jsonschema/2-0-1'
const EVENT_SPECIFICATION_SCHEMA =
  'iglu:com.snowplowanalytics.snowplow/event_specification/jsonschema/1-0-4'
const DATA_PRODUCT = {
  data_product_id: '980aa611-2b78-4b76-8a83-f6a6878c22b6',
  data_product_name: 'Snowplow Assistant Engagement',
}

type InteractionType = 'open' | 'close' | 'message_submit' | 'suggestion_click'

type EventSpec = { id: string; version: number; name: string }

const SPECS: Record<InteractionType, EventSpec> = {
  open: {
    id: 'c867af2d-9225-4944-abd7-967cbb48af0d',
    version: 2,
    name: 'Assistant Opened',
  },
  close: {
    id: '9baa6f50-a34f-4bc5-8dbe-8eadba7c43da',
    version: 2,
    name: 'Assistant Closed',
  },
  message_submit: {
    id: '529ea7cc-856d-4565-82e4-62c9466b81a5',
    version: 2,
    name: 'Prompt Submitted',
  },
  suggestion_click: {
    id: '89be7f12-c617-45a8-ab03-d1ebf893380a',
    version: 2,
    name: 'Suggestion Clicked',
  },
}

const track = (
  agentSessionId: string,
  interactionType: InteractionType,
  target?: string
) => {
  try {
    trackSelfDescribingEvent({
      event: {
        schema: ASSISTANT_INTERACTION_SCHEMA,
        data: {
          agent_session_id: agentSessionId,
          interaction_type: interactionType,
          ...(target !== undefined ? { target } : {}),
        },
      },
      context: [
        {
          schema: EVENT_SPECIFICATION_SCHEMA,
          data: { ...SPECS[interactionType], ...DATA_PRODUCT },
        },
      ],
    })
  } catch {
    // Tracking must never break the assistant.
  }
}

export const trackAssistantOpened = (id: string) => track(id, 'open')
export const trackAssistantClosed = (id: string) => track(id, 'close')
export const trackPromptSubmitted = (id: string) => track(id, 'message_submit')
export const trackSuggestionClicked = (id: string, label: string) =>
  track(id, 'suggestion_click', label)
