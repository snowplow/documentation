/**
 * Fail the build when a Markdown copy has a code block whose lines were split
 * apart by blank lines, the symptom of converting Prism's line markup
 * without flattening it (see rehype-strip-code-labels.js). A blank line after
 * a trailing backslash breaks shell commands; a long block (15 lines or more)
 * where every other line is blank shows the same fault in any language.
 * Shorter blocks are skipped, because some source samples alternate code and
 * blank lines on purpose.
 */

/** Yield each fenced code block's lines */
function* fencedBlocks(markdown) {
  const lines = markdown.split('\n')
  let fence = null
  let body = []
  for (const line of lines) {
    const open = line.match(/^\s*(`{3,}|~{3,})/)
    if (!fence) {
      if (open) {
        fence = open[1]
        body = []
      }
    } else if (line.trim().startsWith(fence) && line.trim().replace(/[`~]/g, '') === '') {
      yield body
      fence = null
    } else {
      body.push(line)
    }
  }
}

/** Return a reason when a block looks split apart, otherwise null */
export function brokenBlockReason(body) {
  for (let i = 0; i < body.length - 1; i++) {
    if (body[i].endsWith('\\') && body[i + 1].trim() === '') {
      return `blank line after a trailing backslash: "${body[i].trim()}"`
    }
  }
  if (body.length >= 15) {
    const alternating = body.every((line, i) => (i % 2 === 1) === (line.trim() === ''))
    if (alternating) return `every other line is blank, starting "${body[0].trim()}"`
  }
  return null
}

/**
 * Check every page's Markdown, and throw listing the broken blocks
 * @param {{routePath: string, markdown: string}[]} pages
 */
export function checkCodeBlocks(pages) {
  const problems = []
  for (const page of pages) {
    for (const body of fencedBlocks(page.markdown)) {
      const reason = brokenBlockReason(body)
      if (reason) problems.push(`${page.routePath}: ${reason}`)
    }
  }
  if (problems.length > 0) {
    throw new Error(
      `[llms-txt] ${problems.length} code blocks in the Markdown copies have split lines:\n` +
        problems.slice(0, 20).join('\n')
    )
  }
}
