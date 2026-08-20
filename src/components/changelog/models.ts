import { z } from 'zod'

// The kinds of update published to /changelog/. An entry usually has one, but an
// announcement that doubles as a release note can carry both.
export const UpdateType = z.enum([
  'Product news',
  'Release notes',
  'Maintenance notification',
])

export type UpdateType = z.infer<typeof UpdateType>

// Order the type filter reads in: broadest announcement first, operational notice last
export const UpdateTypeOrder: UpdateType[] = [
  'Product news',
  'Release notes',
  'Maintenance notification',
]

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

// The cloud or warehouse an entry is scoped to. Kept apart from components because the
// audience differs: someone reading maintenance notifications filters by the deployment they
// run, not by the part of the product that changed.
export const PlatformOrder: string[] = [
  'AWS',
  'GCP',
  'BigQuery',
  'Snowflake',
  'Databricks',
]

// One entry in the changelog, built from front matter by plugins/docusaurus-plugin-changelog
export const ChangelogEntry = z.object({
  slug: z.string(),
  permalink: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  updateType: z.array(UpdateType),
  components: z.array(z.string()),
  platforms: z.array(z.string()),
})

export type ChangelogEntry = z.infer<typeof ChangelogEntry>

export const ChangelogData = z.object({
  entries: z.array(ChangelogEntry),
})

export type ChangelogData = z.infer<typeof ChangelogData>

// Sort helper for a tag list, so filters and rows agree on order
export const orderBy = (order: string[]) => (a: string, b: string) => {
  const ai = order.indexOf(a)
  const bi = order.indexOf(b)
  // an unrecognized tag sorts to the end rather than to the front
  return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi) || a.localeCompare(b)
}
