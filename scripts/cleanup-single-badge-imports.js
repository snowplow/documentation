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

function cleanupSingleBadgeImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip special case files that explain how badges work
  const specialCaseFiles = [
    'docs/sources/trackers/tracker-maintenance-classification/index.md'
  ];

  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  if (specialCaseFiles.includes(relativePath)) {
    return false; // Skip special case files
  }

  // Skip if no BadgeGroup import
  if (!content.includes('import BadgeGroup from')) {
    return false;
  }

  // Count badges in the file
  const badgeMatches = [...content.matchAll(/<Badges[^>]*badgeType[^>]*><\/Badges>/g)];
  const badgeCount = badgeMatches.length;

  // Check if file uses <BadgeGroup> wrapper
  const usesBadgeGroupWrapper = content.includes('<BadgeGroup>');

  // If file has only 1 badge OR has badges but no BadgeGroup wrapper, remove the import
  if (badgeCount === 1 || (badgeCount > 0 && !usesBadgeGroupWrapper)) {
    // Create backup
    fs.writeFileSync(filePath + '.bak', content);

    try {
      // Remove the BadgeGroup import line
      let updatedContent = content.replace(/import BadgeGroup from '@site\/src\/components\/BadgeGroup';\n/g, '');

      // Handle cases where there might be different quote styles or spacing
      updatedContent = updatedContent.replace(/import BadgeGroup from "@site\/src\/components\/BadgeGroup";\n/g, '');

      if (updatedContent !== content) {
        fs.writeFileSync(filePath, updatedContent);
        log('green', `✅ Removed BadgeGroup import from ${filePath} (${badgeCount} badge${badgeCount === 1 ? '' : 's'}, no wrapper)`);
        return true;
      } else {
        // Remove backup if no changes
        fs.unlinkSync(filePath + '.bak');
        return false;
      }
    } catch (error) {
      log('red', `❌ Error processing ${filePath}: ${error.message}`);
      // Restore from backup
      fs.writeFileSync(filePath, content);
      fs.unlinkSync(filePath + '.bak');
      return false;
    }
  }

  return false;
}

async function main() {
  const fix = process.argv.includes('--fix');

  log('blue', '🔍 Checking for unnecessary BadgeGroup imports...\n');

  // Find all markdown files
  const files = glob.sync('docs/**/*.md', {
    ignore: ['node_modules/**', '**/node_modules/**'],
    absolute: true
  });

  const issues = [];
  let fixedCount = 0;

  for (const file of files) {
    try {
      // Skip special case files that explain how badges work
      const specialCaseFiles = [
        'docs/sources/trackers/tracker-maintenance-classification/index.md'
      ];

      const relativePath = path.relative(process.cwd(), file);
      if (specialCaseFiles.includes(relativePath)) {
        continue; // Skip special case files
      }

      const content = fs.readFileSync(file, 'utf8');

      // Skip if no BadgeGroup import
      if (!content.includes('import BadgeGroup from')) {
        continue;
      }

      // Count badges and check for wrapper usage
      const badgeMatches = [...content.matchAll(/<Badges[^>]*badgeType[^>]*><\/Badges>/g)];
      const badgeCount = badgeMatches.length;
      const usesBadgeGroupWrapper = content.includes('<BadgeGroup>');

      // Identify files with unnecessary imports
      if (badgeCount === 1 || (badgeCount > 0 && !usesBadgeGroupWrapper)) {
        const relativePath = path.relative(process.cwd(), file);
        const issue = {
          file: relativePath,
          badgeCount: badgeCount,
          hasWrapper: usesBadgeGroupWrapper,
          reason: badgeCount === 1 ? 'single badge' : 'no wrapper used'
        };
        issues.push(issue);

        if (fix) {
          if (cleanupSingleBadgeImports(file)) {
            fixedCount++;
          }
        }
      }
    } catch (error) {
      log('red', `Error checking ${file}: ${error.message}`);
    }
  }

  if (issues.length === 0) {
    log('green', '✅ No unnecessary BadgeGroup imports found!');
    return;
  }

  if (!fix) {
    log('yellow', `⚠️  Found ${issues.length} files with unnecessary BadgeGroup imports:\n`);

    issues.forEach(issue => {
      log('yellow', `📄 ${issue.file}`);
      log('yellow', `   ${issue.badgeCount} badge${issue.badgeCount === 1 ? '' : 's'} (${issue.reason})`);
      console.log();
    });

    log('blue', '\n💡 To automatically fix these issues, run:');
    log('blue', '   node scripts/cleanup-single-badge-imports.js --fix');
    console.log();
  } else {
    log('green', `✅ Fixed ${fixedCount} files by removing unnecessary BadgeGroup imports!`);

    if (fixedCount > 0) {
      log('yellow', '\n🗑️ Backup files (.bak) were created during cleanup.');
      log('blue', 'Run this to clean up backup files when ready:');
      log('blue', '   node scripts/check-badges.js --cleanup');
    }
  }
}

if (require.main === module) {
  main().catch(error => {
    log('red', `Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { cleanupSingleBadgeImports };