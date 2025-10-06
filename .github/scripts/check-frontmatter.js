const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

module.exports = async ({ github, context, core }) => {
  const { owner, repo } = context.repo
  const pull_number = context.payload.pull_request.number

  // Get the list of changed files in the PR
  const { data: files } = await github.rest.pulls.listFiles({
    owner,
    repo,
    pull_number,
  })

  // Filter for markdown files that were added or modified (not renamed/moved)
  const changedMdFiles = files.filter((file) => {
    const isMd = file.filename.endsWith('.md')
    const isAddedOrModified =
      file.status === 'added' || file.status === 'modified'
    const isNotRenamed = file.status !== 'renamed'
    return isMd && isAddedOrModified && isNotRenamed
  })

  if (changedMdFiles.length === 0) {
    core.info('No markdown files to check')
    return
  }

  const today = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const fileResults = []

  for (const file of changedMdFiles) {
    const filePath = file.filename

    try {
      // Read the file content
      const content = fs.readFileSync(filePath, 'utf8')

      // Parse frontmatter
      const { data: frontmatter } = matter(content)

      const checks = {
        path: filePath,
        dateOk: false,
        descriptionOk: false,
        dateIssue: null,
        descriptionIssue: null,
      }

      // Check date field
      if (!frontmatter.date) {
        checks.dateIssue = 'Missing'
      } else {
        const dateString = frontmatter.date
        const dateMatch = dateString.match(/^\d{4}-\d{2}-\d{2}$/)

        if (!dateMatch) {
          checks.dateIssue = 'Invalid format'
        } else {
          const fileDate = new Date(dateString)
          if (fileDate < oneMonthAgo || fileDate > today) {
            checks.dateIssue = 'Out of date'
          } else {
            checks.dateOk = true
          }
        }
      }

      // Check description field
      if (!frontmatter.description) {
        checks.descriptionIssue = 'Missing'
      } else if (
        typeof frontmatter.description === 'string' &&
        frontmatter.description.trim() === ''
      ) {
        checks.descriptionIssue = 'Empty'
      } else {
        checks.descriptionOk = true
      }

      fileResults.push(checks)
    } catch (error) {
      core.warning(`Error processing ${filePath}: ${error.message}`)
    }
  }

  // Build comment
  const filesWithIssues = fileResults.filter(
    (r) => !r.dateOk || !r.descriptionOk
  )

  if (filesWithIssues.length > 0) {
    let commentBody = `## Metadata problems\n\nPage descriptions and accurate modified dates are important for SEO. Found issues in the following ${filesWithIssues.length} files:\n\n`

    if (filesWithIssues.length > 5) {
      for (const result of filesWithIssues) {
        commentBody += `${result.path}\n`
      }
      commentBody += `\nPlease update the frontmatter of these files.\n\n`
    } else {
      for (const result of filesWithIssues) {
        const dateStatus = result.dateOk ? '✅' : '❌'
        const descStatus = result.descriptionOk ? '✅' : '❌'

        commentBody += `**${result.path}**\n`
        commentBody += `date ${dateStatus} description ${descStatus} _`

        // Build helpful message
        const fixes = []
        if (
          result.dateIssue === 'Out of date' ||
          result.dateIssue === 'Missing'
        ) {
          fixes.push('specify a date within the last month')
        } else if (result.dateIssue === 'Invalid format') {
          fixes.push('use YYYY-MM-DD format for date')
        }

        if (
          result.descriptionIssue === 'Missing' ||
          result.descriptionIssue === 'Empty'
        ) {
          fixes.push('add a page description')
        }

        if (fixes.length > 0) {
          commentBody += fixes[0].charAt(0).toUpperCase() + fixes[0].slice(1)
          if (fixes.length > 1) {
            commentBody += '; ' + fixes.slice(1).join('; ')
          }
          commentBody += '._\n'
        }
        commentBody += '\n'
      }
      commentBody += `\nPlease update the frontmatter of these files.\n\n`
    }

    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: commentBody,
    })

    core.warning(
      `Found frontmatter issues in ${filesWithIssues.length} file(s)`
    )
  } else {
    core.info('All documentation frontmatter is up to date!')
  }
}
