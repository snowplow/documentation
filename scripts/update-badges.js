const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Pattern to match individual Badges components
const singleBadgePattern = /<Badges[^>]*><\/Badges>/g;

// Pattern to match consecutive lines with Badges (for multiline badge groups)
const multilineBadgePattern = /^(<Badges[^>]*><\/Badges>(?:\s*(?:&nbsp;|<br\/?>)?)?)(?:\n(<Badges[^>]*><\/Badges>(?:\s*(?:&nbsp;|<br\/?)?)?)\s*)+/gm;

// Pattern to check if BadgeGroup is already imported
const badgeGroupImportPattern = /import BadgeGroup from '@site\/src\/components\/BadgeGroup';/;

function updateMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip special case files that explain how badges work
  const specialCaseFiles = [
    'docs/sources/trackers/tracker-maintenance-classification/index.md'
  ];

  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  if (specialCaseFiles.includes(relativePath)) {
    console.log(`Skipping special case file ${filePath} - contains badge documentation`);
    return false;
  }

  // Create backup before any changes
  fs.writeFileSync(filePath + '.bak', content);

  // Skip if already wrapped with BadgeGroup
  if (content.includes('<BadgeGroup>')) {
    console.log(`Skipping ${filePath} - already has BadgeGroup`);
    // Remove backup since no changes needed
    fs.unlinkSync(filePath + '.bak');
    return false;
  }

  // Find all badge components
  const allBadgeMatches = [...content.matchAll(singleBadgePattern)];
  if (!allBadgeMatches || allBadgeMatches.length === 0) {
    console.log(`No badges found in ${filePath}`);
    // Remove backup since no changes needed
    fs.unlinkSync(filePath + '.bak');
    return false;
  }

  // If only one badge, don't wrap it
  if (allBadgeMatches.length === 1) {
    console.log(`Only one badge found in ${filePath} - no wrapping needed`);
    // Remove backup since no changes needed
    fs.unlinkSync(filePath + '.bak');
    return false;
  }

  let updatedContent = content;
  let hasChanges = false;

  try {
    // Check if BadgeGroup import already exists
    if (!badgeGroupImportPattern.test(content)) {
      // Add BadgeGroup import after Badges import
      const importMatch = updatedContent.match(/(import Badges from '@site\/src\/components\/Badges';)/);
      if (importMatch) {
        updatedContent = updatedContent.replace(
          /(import Badges from '@site\/src\/components\/Badges';)/,
          '$1\nimport BadgeGroup from \'@site/src/components/BadgeGroup\';'
        );
        hasChanges = true;
      }
    }

    // Process content line by line to find consecutive badge lines
    const lines = updatedContent.split('\n');
    const newLines = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check if this line contains a badge
      if (line.includes('Badges badgeType')) {
        // Look ahead to find consecutive badge lines
        const badgeLines = [];
        let j = i;

        while (j < lines.length && lines[j].includes('Badges badgeType')) {
          badgeLines.push(lines[j]);
          j++;
        }

        // If we found multiple consecutive badge lines, wrap them
        if (badgeLines.length > 1) {
          newLines.push('<BadgeGroup>');
          badgeLines.forEach(badgeLine => {
            // Clean up the badge line
            const cleanedLine = badgeLine
              .replace(/&nbsp;/g, '')
              .replace(/<br\/?>/g, '')
              .trim();
            newLines.push(cleanedLine);
          });
          newLines.push('</BadgeGroup>');
          hasChanges = true;
          i = j; // Skip the processed lines
        } else {
          // Single badge line, keep as is
          newLines.push(line);
          i++;
        }
      } else {
        // Regular line, keep as is
        newLines.push(line);
        i++;
      }
    }

    if (hasChanges) {
      updatedContent = newLines.join('\n');
      fs.writeFileSync(filePath, updatedContent);
      console.log(`✅ Updated ${filePath} - wrapped ${allBadgeMatches.length} badges`);
      return true;
    } else {
      console.log(`No changes needed for ${filePath}`);
      // Remove backup since no changes were made
      fs.unlinkSync(filePath + '.bak');
      return false;
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    // Restore from backup on error
    fs.writeFileSync(filePath, content);
    // Remove backup
    fs.unlinkSync(filePath + '.bak');
    return false;
  }
}

function main() {
  // Find all markdown files with Badges
  const files = glob.sync('docs/**/*.md', {
    cwd: path.join(__dirname, '..'),
    absolute: true
  });

  let updatedCount = 0;

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('Badges badgeType')) {
        if (updateMarkdownFile(file)) {
          updatedCount++;
        }
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });

  console.log(`\nUpdated ${updatedCount} files`);
}

// Check if glob is available, if not provide instructions
try {
  require('glob');
  main();
} catch (error) {
  console.log('Please install glob: npm install glob');
  console.log('Or run manually: node -e "' + main.toString() + '; main()"');
}