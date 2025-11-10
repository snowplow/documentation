#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if a file needs BadgeGroup wrapper
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip if no badges
  if (!content.includes('Badges badgeType')) {
    return null;
  }

  // Skip if already has BadgeGroup
  if (content.includes('<BadgeGroup>')) {
    return null;
  }

  // Check for multiple badges that need wrapping
  const badgeMatches = content.match(/<Badges[^>]*><\/Badges>/g);
  if (!badgeMatches || badgeMatches.length < 2) {
    return null; // Single badges don't need wrapping
  }

  // Check if badges are on same line (good) or separate lines (needs fixing)
  const lines = content.split('\n');
  let badgeLines = [];

  lines.forEach((line, index) => {
    if (line.includes('Badges badgeType')) {
      badgeLines.push(index + 1);
    }
  });

  // If multiple badges on different lines, they need BadgeGroup
  if (badgeLines.length > 1) {
    return {
      file: filePath,
      badgeLines: badgeLines,
      badgeCount: badgeMatches.length
    };
  }

  return null;
}

function main() {
  const fix = process.argv.includes('--fix');

  log('blue', '🔍 Checking badge formatting...\n');

  // Find all markdown files
  const files = glob.sync('docs/**/*.md', {
    ignore: ['node_modules/**', '**/node_modules/**'],
    absolute: true
  });

  const issues = [];

  for (const file of files) {
    try {
      const issue = checkFile(file);
      if (issue) {
        issues.push(issue);
      }
    } catch (error) {
      log('red', `Error checking ${file}: ${error.message}`);
    }
  }

  if (issues.length === 0) {
    log('green', '✅ All badge formatting looks good!');
    return;
  }

  log('yellow', `⚠️  Found ${issues.length} files with badge formatting issues:\n`);

  issues.forEach(issue => {
    const relativePath = path.relative(process.cwd(), issue.file);
    log('yellow', `📄 ${relativePath}`);
    log('yellow', `   Lines: ${issue.badgeLines.join(', ')} (${issue.badgeCount} badges)`);
    console.log();
  });

  if (fix) {
    log('blue', '🔧 Attempting to fix issues...');

    // Import the update logic from the previous script
    const { execSync } = require('child_process');

    try {
      // Run the badge update script
      execSync('python3 scripts/update-badge-groups.py', { stdio: 'inherit' });
      log('green', '✅ Fixed badge formatting issues!');
    } catch (error) {
      log('red', '❌ Failed to fix issues automatically');
      log('red', 'Please run the update script manually or fix the files listed above');
    }
  } else {
    log('blue', '\n💡 To automatically fix these issues, run:');
    log('blue', '   yarn check-badges --fix');
    console.log();
    log('yellow', '⚠️  Badge formatting check failed!');
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    log('red', `Error: ${error.message}`);
    process.exit(1);
  }
}