// Keeps the "Last updated" date on docs pages meaningful through bulk
// metadata changes.
//
// Docusaurus takes each page's date from the newest git commit that touched
// the file. A commit that only adds frontmatter to hundreds of pages would make
// every one of them look updated that day. Add the trailer
//
//   Last-Update: ignore
//
// to such a commit's message (in a squash merge, any commit in the PR is
// enough, because the squash message includes every commit message). For
// pages whose newest commit carries the trailer, this sets the date from the
// newest commit without it, following renames. Pages with no ignored commit
// keep the default Docusaurus behavior.

const { execFileSync } = require('child_process')
const path = require('path')

const TRAILER = /^Last-Update:\s*ignore\s*$/im
const RS = '\x1e'
const US = '\x1f'

let cache = null

function buildIndex(repoRoot) {
  let raw
  try {
    raw = execFileSync(
      'git',
      ['log', '-M', '--name-status', `--format=${RS}%cI${US}%B${US}`],
      { cwd: repoRoot, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 }
    )
  } catch {
    return null // no git history (for example a source tarball): use defaults
  }

  // Walk commits from newest to oldest. `alias` maps a path as it was named in
  // older commits to the path the file has now.
  const newestIsIgnored = new Map() // current path -> boolean
  const keptDate = new Map() // current path -> ISO date of newest kept commit
  const alias = new Map()
  const current = (p) => alias.get(p) ?? p

  for (const chunk of raw.split(RS)) {
    if (!chunk.trim()) continue
    const [date, message, files = ''] = chunk.split(US)
    const ignored = TRAILER.test(message)
    for (const line of files.split('\n')) {
      if (!line.trim()) continue
      const parts = line.split('\t')
      const status = parts[0]
      let file
      if (status.startsWith('R')) {
        const [, from, to] = parts
        file = current(to)
        alias.set(from, file)
      } else {
        file = current(parts[1])
      }
      if (!newestIsIgnored.has(file)) newestIsIgnored.set(file, ignored)
      if (!ignored && !keptDate.has(file)) keptDate.set(file, date)
    }
  }
  return { newestIsIgnored, keptDate }
}

/**
 * Returns a last_update date for the file when its newest commit is marked
 * `Last-Update: ignore`, or null to keep the Docusaurus default.
 */
function lastUpdateOverride(filePath, repoRoot) {
  const rel = path.relative(repoRoot, filePath).split(path.sep).join('/')
  // Partials (_file.md, or anything under a _folder) can't carry front
  // matter: Docusaurus fails the build if they do
  if (rel.split('/').some((segment) => segment.startsWith('_'))) return null
  if (cache === undefined) return null
  if (cache === null) cache = buildIndex(repoRoot) ?? undefined
  if (!cache) return null
  if (!cache.newestIsIgnored.get(rel)) return null
  return cache.keptDate.get(rel) ?? null
}

module.exports = { lastUpdateOverride }
