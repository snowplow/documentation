const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = async ({github, context, core}) => {
  const { owner, repo } = context.repo;
  const pull_number = context.payload.pull_request.number;

  // Get the list of changed files in the PR
  const { data: files } = await github.rest.pulls.listFiles({
    owner,
    repo,
    pull_number,
  });

  // Filter for markdown files that were added or modified (not renamed/moved)
  const changedMdFiles = files.filter(file => {
    const isMd = file.filename.endsWith('.md');
    const isAddedOrModified = file.status === 'added' || file.status === 'modified';
    const isNotRenamed = file.status !== 'renamed';
    return isMd && isAddedOrModified && isNotRenamed;
  });

  if (changedMdFiles.length === 0) {
    core.info('No markdown files to check');
    return;
  }

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const issues = [];

  for (const file of changedMdFiles) {
    const filePath = file.filename;

    try {
      // Read the file content
      const content = fs.readFileSync(filePath, 'utf8');

      // Parse frontmatter
      const { data: frontmatter } = matter(content);

      // Check if date field exists
      if (!frontmatter.date) {
        issues.push({
          path: filePath,
          line: 1,
          message: 'Missing `date` field in frontmatter',
          suggestion: getSuggestionForMissingDate(content, today),
        });
        continue;
      }

      // Validate date format and range
      const dateString = frontmatter.date;
      const dateMatch = dateString.match(/^\d{4}-\d{2}-\d{2}$/);

      if (!dateMatch) {
        issues.push({
          path: filePath,
          line: getDateLine(content, dateString),
          message: `Date format should be YYYY-MM-DD, found: ${dateString}`,
          suggestion: null,
        });
        continue;
      }

      const fileDate = new Date(dateString);

      if (fileDate < oneMonthAgo || fileDate > today) {
        const todayFormatted = today.toISOString().split('T')[0];
        issues.push({
          path: filePath,
          line: getDateLine(content, dateString),
          message: `Date should be within the last month (found: ${dateString})`,
          suggestion: dateString,
          newDate: todayFormatted,
        });
      }
    } catch (error) {
      core.warning(`Error processing ${filePath}: ${error.message}`);
    }
  }

  // Post review comments with suggestions
  if (issues.length > 0) {
    if (issues.length > 5) {
      // Too many files to suggest individually, post a single comment
      const fileList = issues.map(issue => `- ${issue.path}`).join('\n');

      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: `⚠️ Found ${issues.length} files with date issues. Please update the \`date\` field in frontmatter to today's date (${today.toISOString().split('T')[0]}) for the following files:\n\n${fileList}`,
      });

      core.warning(`Found ${issues.length} date issue(s) in documentation files - too many to post suggestions`);
    } else {
      // Post individual suggestions
      const comments = issues.map(issue => {
        const comment = {
          path: issue.path,
          line: issue.line,
          body: issue.message,
        };

        // Add suggestion if we have one
        if (issue.suggestion && issue.newDate) {
          comment.body += `\n\n\`\`\`suggestion\ndate: "${issue.newDate}"\n\`\`\``;
        } else if (issue.suggestion) {
          comment.body += `\n\n${issue.suggestion}`;
        }

        return comment;
      });

      // Create a review with comments
      await github.rest.pulls.createReview({
        owner,
        repo,
        pull_number,
        event: 'COMMENT',
        comments,
      });

      core.warning(`Found ${issues.length} date issue(s) in documentation files`);
    }
  } else {
    core.info('All documentation dates are up to date!');
  }
};

function getDateLine(content, dateString) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`date:`) && lines[i].includes(dateString)) {
      return i + 1; // Line numbers are 1-indexed
    }
  }
  return 1; // Default to line 1 if not found
}

function getSuggestionForMissingDate(content, today) {
  const todayFormatted = today.toISOString().split('T')[0];
  const lines = content.split('\n');

  // Find the frontmatter section
  let inFrontmatter = false;
  let frontmatterEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }

  if (frontmatterEnd > 0) {
    return `Add \`date: "${todayFormatted}"\` to the frontmatter`;
  }

  return `Add frontmatter with date field`;
}
