const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Pattern to match Badges components (single or multiple on same line)
const badgePattern = /(<Badges[^>]*><\/Badges>(?:\s*(?:&nbsp;|<br\/>)?\s*<Badges[^>]*><\/Badges>)*(?:\s*(?:&nbsp;|<br\/>)?)*)/gm;

// Pattern to check if BadgeGroup is already imported
const badgeGroupImportPattern = /import BadgeGroup from '@site\/src\/components\/BadgeGroup';/;

function updateMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip if already wrapped with BadgeGroup
  if (content.includes('<BadgeGroup>')) {
    console.log(`Skipping ${filePath} - already has BadgeGroup`);
    return false;
  }

  // Check if file has Badges components
  const badgeMatches = content.match(badgePattern);
  if (!badgeMatches) {
    return false;
  }

  let updatedContent = content;
  let needsImport = false;

  // Check if BadgeGroup import already exists
  if (!badgeGroupImportPattern.test(content)) {
    // Add BadgeGroup import after Badges import
    updatedContent = updatedContent.replace(
      /(import Badges from '@site\/src\/components\/Badges';)/,
      '$1\nimport BadgeGroup from \'@site/src/components/BadgeGroup\';'
    );
    needsImport = true;
  }

  // Wrap badge patterns with BadgeGroup
  updatedContent = updatedContent.replace(badgePattern, (match) => {
    // Clean up the badges: remove &nbsp; and <br/> elements, normalize spacing
    const cleanedBadges = match
      .replace(/&nbsp;/g, '')
      .replace(/<br\/?>/g, '')
      .replace(/>\s*</g, '>\n<')
      .trim();

    return `<BadgeGroup>\n${cleanedBadges}\n</BadgeGroup>`;
  });

  // Only write if content changed
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${filePath}`);
    return true;
  }

  return false;
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