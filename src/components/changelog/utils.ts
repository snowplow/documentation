import { usePluginData } from '@docusaurus/useGlobalData'
import { ChangelogEntry, ChangelogData } from './models'

// The listing is built at compile time by plugins/docusaurus-plugin-changelog, so the
// page never has to pull the article bodies into the client bundle.
export function useChangelogEntries(): ChangelogEntry[] {
  const data = usePluginData('docusaurus-plugin-changelog')
  return ChangelogData.parse(data).entries
}

// Articles are dated to the day, so render them that way rather than guessing at a timezone
export function formatUpdateDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
