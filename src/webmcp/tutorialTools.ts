import { getMetaData, getSteps } from '@site/src/components/tutorials/utils'
import type { Meta, Step } from '@site/src/components/tutorials/models'
import {
  readCompletedSteps,
  writeCompletedSteps,
} from '@site/src/components/tutorials/progress'

import { readNumber, readString, requireString, type WebMcpTool } from './types'

type TutorialToolsOptions = {
  navigate: (path: string) => void
}

type StatusValue = 'current' | 'completed'

const STATUS_VALUES: StatusValue[] = ['current', 'completed']

function normalizePath(path: string): string {
  const withoutTrailingSlash = path.replace(/\/+$/, '')
  return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash
}

function matches(value: string, filter: string): boolean {
  return value.toLowerCase() === filter.toLowerCase()
}

function summarize(meta: Meta, steps: Step[]) {
  return {
    slug: meta.id,
    title: meta.title,
    description: meta.description,
    topic: meta.label,
    useCase: meta.useCase,
    technologies: meta.technologies,
    snowplowTech: meta.snowplowTech,
    url: steps[0]?.path ?? `/tutorials/${meta.id}/`,
    stepCount: steps.length,
  }
}

function findTutorial(slug: string): Meta {
  const meta = getMetaData().find((candidate) => matches(candidate.id, slug))
  if (!meta) {
    throw new Error(
      `No tutorial with slug "${slug}". Call list_tutorials to see the available slugs.`
    )
  }
  return meta
}

// One tutorial with an unreadable step file shouldn't empty the whole listing.
function stepsFor(id: string): Step[] {
  try {
    return getSteps(id)
  } catch {
    return []
  }
}

function findStep(steps: Step[], position: number): Step {
  const step = steps.find((candidate) => candidate.position === position)
  if (!step) {
    const available = steps.map((candidate) => candidate.position).join(', ')
    throw new Error(
      `This tutorial has no step at position ${position}. Available positions: ${available}.`
    )
  }
  return step
}

function progressFor(meta: Meta, steps: Step[]) {
  const completed = new Set(readCompletedSteps(meta.id))
  const currentPath = normalizePath(window.location.pathname)

  return {
    ...summarize(meta, steps),
    completedCount: steps.filter((step) => completed.has(step.path)).length,
    steps: steps.map((step) => ({
      position: step.position,
      title: step.sidebar_label ?? step.title,
      url: step.path,
      completed: completed.has(step.path),
      current: normalizePath(step.path) === currentPath,
    })),
  }
}

export function createTutorialTools({
  navigate,
}: TutorialToolsOptions): WebMcpTool[] {
  return [
    {
      name: 'list_tutorials',
      description:
        'Lists available tutorials, optionally filtered by use case, topic, or technology. List tutorials and guides from the tutorials index, with facet filters.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          useCase: {
            type: 'string',
            description:
              'Use case to filter by, for example "Composable CDP" or "Real-time personalization". Omit to list every use case.',
          },
          topic: {
            type: 'string',
            description:
              'Topic to filter by, for example "Data modeling" or "Tracking implementation". Omit to list every topic.',
          },
          technology: {
            type: 'string',
            description:
              'Technology to filter by, matched against both third-party technologies such as "Databricks" and Snowplow products such as "Signals". Omit to list every technology.',
          },
        },
      },
      async execute(input) {
        const useCase = readString(input, 'useCase')
        const topic = readString(input, 'topic')
        const technology = readString(input, 'technology')

        const all = getMetaData().map((meta) => ({
          meta,
          steps: stepsFor(meta.id),
        }))

        const tutorials = all
          .filter(({ meta }) => !useCase || matches(meta.useCase, useCase))
          .filter(({ meta }) => !topic || matches(meta.label, topic))
          .filter(
            ({ meta }) =>
              !technology ||
              [...meta.technologies, ...meta.snowplowTech].some((value) =>
                matches(value, technology)
              )
          )
          .map(({ meta, steps }) => summarize(meta, steps))

        return {
          filters: { useCase, topic, technology },
          count: tutorials.length,
          tutorials,
          facets: {
            useCases: [...new Set(all.map(({ meta }) => meta.useCase))],
            topics: [...new Set(all.map(({ meta }) => meta.label))],
            technologies: [
              ...new Set(
                all.flatMap(({ meta }) => [
                  ...meta.snowplowTech,
                  ...meta.technologies,
                ])
              ),
            ],
          },
        }
      },
    },

    {
      name: 'get_tutorial',
      description:
        "Returns the steps of a tutorial and the reader's current progress through it. Retrieve the step list and progress state for a tutorial by slug.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description:
              'The tutorial slug, as returned by list_tutorials, for example "signals-quickstart".',
          },
        },
        required: ['slug'],
      },
      async execute(input) {
        const meta = findTutorial(requireString(input, 'slug'))
        return progressFor(meta, getSteps(meta.id))
      },
    },

    {
      name: 'set_tutorial_progress',
      description:
        'Marks a tutorial step as the current or completed step. Update the reader\'s progress position within a tutorial. Use status "current" to open the step, and status "completed" to tick it off in the progress tracker.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description:
              'The tutorial slug, as returned by list_tutorials, for example "signals-quickstart".',
          },
          step: {
            type: 'number',
            description: 'The step position, as returned by get_tutorial.',
          },
          status: {
            type: 'string',
            enum: STATUS_VALUES,
            description:
              '"current" navigates the reader to the step. "completed" marks it finished in the progress tracker.',
          },
        },
        required: ['slug', 'step', 'status'],
      },
      async execute(input) {
        const meta = findTutorial(requireString(input, 'slug'))
        const steps = getSteps(meta.id)

        const position = readNumber(input, 'step')
        if (position === undefined) {
          throw new Error('`step` is required and must be a step position.')
        }
        const step = findStep(steps, position)

        const status = requireString(input, 'status')
        if (status !== 'current' && status !== 'completed') {
          throw new Error(
            `\`status\` must be one of: ${STATUS_VALUES.join(', ')}.`
          )
        }

        if (status === 'current') {
          navigate(step.path)
        } else {
          writeCompletedSteps(meta.id, [
            ...readCompletedSteps(meta.id),
            step.path,
          ])
          // Storage can be blocked or full, and the write is deliberately
          // silent there. Read it back so the agent isn't told it stuck.
          if (!readCompletedSteps(meta.id).includes(step.path)) {
            throw new Error(
              'Could not save progress: this browser is blocking local storage for the documentation site.'
            )
          }
        }

        return {
          updated: { slug: meta.id, step: step.position, status },
          ...progressFor(meta, steps),
        }
      },
    },
  ]
}
