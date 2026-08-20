import { z } from 'zod'

// The kinds of update published to /release-notes/. A note usually has one, but an
// announcement that doubles as a release note can carry both.
export const UpdateType = z.enum(['Product news', 'Release notes'])

export type UpdateType = z.infer<typeof UpdateType>

// Order the type filter reads in: broadest announcement first
export const UpdateTypeOrder: UpdateType[] = ['Product news', 'Release notes']

// Order the component filter reads in: product surfaces first, supporting tools last
export const ComponentOrder: string[] = [
  'Trackers',
  'Pipeline components',
  'Destinations',
  'Data models',
  'Event Studio',
  'Console',
  'Signals',
  'Identities',
  'Monitoring',
  'Testing',
  'Developer tools',
  'AI tools',
  'Security',
]

// The cloud or warehouse a note is scoped to. Kept apart from components because the
// question differs: readers narrow to the deployment they run, not to the part of the
// product that changed.
export const PlatformOrder: string[] = [
  'AWS',
  'GCP',
  'BigQuery',
  'Snowflake',
  'Databricks',
]

// One release note, built from front matter by plugins/docusaurus-plugin-release-notes
export const ReleaseNote = z.object({
  slug: z.string(),
  permalink: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  updateType: z.array(UpdateType),
  components: z.array(z.string()),
  platforms: z.array(z.string()),
})

export type ReleaseNote = z.infer<typeof ReleaseNote>

export const ReleaseNotesData = z.object({
  entries: z.array(ReleaseNote),
})

export type ReleaseNotesData = z.infer<typeof ReleaseNotesData>

// Sort helper for a tag list, so filters and rows agree on order
export const orderBy = (order: string[]) => (a: string, b: string) => {
  const ai = order.indexOf(a)
  const bi = order.indexOf(b)
  // an unrecognized tag sorts to the end rather than to the front
  return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi) || a.localeCompare(b)
}
