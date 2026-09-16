import { usePluginData } from '@docusaurus/useGlobalData'
import { ReleaseNote, ReleaseNotesData } from './models'

// The listing is built at compile time by plugins/docusaurus-plugin-release-notes, so the
// page never has to pull the article bodies into the client bundle.
export function useReleaseNotes(): ReleaseNote[] {
  const data = usePluginData('docusaurus-plugin-release-notes')
  return ReleaseNotesData.parse(data).entries
}

// Articles are dated to the day, so render them that way rather than guessing at a timezone
function formatDate(date: string, withYear: boolean): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: withYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  })
}

// The date on an article page stands alone, so it always spells out the year
export function formatUpdateDate(date: string): string {
  return formatDate(date, true)
}

// In the listing the year is dropped for the current year, where it carries no information
export function formatUpdateDateShort(date: string): string {
  const [year] = date.split('-').map(Number)
  return formatDate(date, year !== new Date().getUTCFullYear())
}
