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

// Function to prompt user for backup cleanup
async function promptCleanupBackups() {
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    log('blue', '\n🧹 Badge fixes completed successfully!');
    log('yellow', 'Backup files (.bak) were created during the update process.');

    rl.question('\nWould you like to delete the backup files? (y/N): ', (answer) => {
      rl.close();

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        cleanupBackups();
      } else {
        log('blue', '📁 Backup files kept. You can manually delete *.bak files when ready.');
      }

      resolve();
    });
  });
}

// Function to clean up backup files and directories
function cleanupBackups() {
  try {
    const { execSync } = require('child_process');

    // Find backup files (.bak)
    const backupFiles = glob.sync('docs/**/*.md.bak', { absolute: true });

    // Find backup directories (pattern: backups/badge-update-*)
    const backupDirs = glob.sync('backups/badge-update-*', { absolute: true });

    const totalItems = backupFiles.length + backupDirs.length;

    if (totalItems === 0) {
      log('blue', '📁 No backup files or directories found.');
      return;
    }

    let deletedCount = 0;

    if (backupFiles.length > 0) {
      log('blue', `🗑️  Deleting ${backupFiles.length} backup files...`);
      backupFiles.forEach(file => {
        fs.unlinkSync(file);
        deletedCount++;
      });
    }

    if (backupDirs.length > 0) {
      log('blue', `🗑️  Deleting ${backupDirs.length} backup directories...`);
      backupDirs.forEach(dir => {
        fs.rmSync(dir, { recursive: true, force: true });
        deletedCount++;
      });
    }

    log('green', `✅ Successfully deleted ${deletedCount} backup items!`);
    log('blue', '💡 Your documentation is now clean and ready to commit.');

  } catch (error) {
    log('red', `❌ Error cleaning up backups: ${error.message}`);
    log('yellow', 'You may need to manually delete backup files/directories.');
  }
}

// Check if a file needs BadgeGroup wrapper
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip special case files that explain how badges work
  const specialCaseFiles = [
    'docs/sources/trackers/tracker-maintenance-classification/index.md'
  ];

  const relativePath = path.relative(process.cwd(), filePath);
  if (specialCaseFiles.includes(relativePath)) {
    return null; // Skip special case files
  }

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

async function main() {
  const fix = process.argv.includes('--fix');
  const cleanupOnly = process.argv.includes('--cleanup');

  // If cleanup only, just clean and exit
  if (cleanupOnly) {
    log('blue', '🧹 Cleaning up backup files...\n');
    cleanupBackups();
    return;
  }

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
      execSync('node scripts/update-badges.js', { stdio: 'inherit' });
      log('green', '✅ Fixed badge formatting issues!');

      // Ask user about cleanup
      await promptCleanupBackups();

    } catch (error) {
      log('red', '❌ Failed to fix issues automatically');
      log('red', 'Please run the update script manually or fix the files listed above');
    }
  } else {
    log('blue', '\n💡 To automatically fix these issues, run:');
    log('blue', '   node scripts/check-badges.js --fix');
    console.log();
    log('yellow', '⚠️  Badge formatting check failed!');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    log('red', `Error: ${error.message}`);
    process.exit(1);
  });
}