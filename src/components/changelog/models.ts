import { z } from 'zod'

// The kinds of update published to /changelog/. An article usually has one, but an
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

// One entry in the product updates list, built from article front matter by
// plugins/docusaurus-plugin-changelog
export const ChangelogEntry = z.object({
  slug: z.string(),
  permalink: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  updateType: z.array(UpdateType),
  components: z.array(z.string()),
})

export type ChangelogEntry = z.infer<typeof ChangelogEntry>

export const ChangelogData = z.object({
  updates: z.array(ChangelogEntry),
})

export type ChangelogData = z.infer<typeof ChangelogData>
