export type StarterPrompt = { label: string; prompt: string }

export const STARTER_PROMPTS: StarterPrompt[] = [
  {
    label: 'Track a custom event in the browser',
    prompt:
      'How do I track a custom self-describing event with the JavaScript tracker?',
  },
  {
    label: 'Events vs entities',
    prompt:
      'What is the difference between an event and an entity in Snowplow?',
  },
  {
    label: 'Load data into Snowflake',
    prompt: 'How do I set up the Snowflake loader?',
  },
  {
    label: 'Debug failed events',
    prompt:
      'Why do events fail validation and how can I inspect failed events?',
  },
]
