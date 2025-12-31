#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all component directories
const componentsDir = path.join(__dirname, 'src/components');
const componentDirs = fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log('Checking component usage in the repository...\n');
console.log('=' .repeat(70));

const results = {
  unused: [],
  used: [],
};

for (const component of componentDirs) {
  try {
    // Use ripgrep (rg) if available, otherwise fallback to grep
    let cmd;
    try {
      execSync('which rg', { stdio: 'ignore' });
      cmd = `rg -l "${component}" --type-add 'web:*.{js,jsx,ts,tsx,md,mdx}' -t web`;
    } catch {
      cmd = `grep -r -l "${component}" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.mdx" .`;
    }

    const result = execSync(cmd, {
      encoding: 'utf-8',
      cwd: __dirname,
      stdio: 'pipe'
    }).trim();

    const files = result.split('\n').filter(f =>
      f &&
      !f.includes(`src/components/${component}/`) &&
      !f.includes('check-unused-components.js')
    );

    if (files.length > 0) {
      results.used.push({ component, files });
      console.log(`✓ ${component}`);
      console.log(`  Used in ${files.length} file(s):`);
      files.slice(0, 3).forEach(f => console.log(`    - ${f}`));
      if (files.length > 3) {
        console.log(`    ... and ${files.length - 3} more`);
      }
    } else {
      results.unused.push(component);
      console.log(`✗ ${component}`);
      console.log(`  NOT USED - No imports found outside component directory`);
    }

    console.log('-'.repeat(70));
  } catch (err) {
    if (err.status === 1) {
      // No matches found (grep/rg exit code 1)
      results.unused.push(component);
      console.log(`✗ ${component}`);
      console.log(`  NOT USED - No imports found outside component directory`);
    } else {
      console.log(`? ${component}`);
      console.log(`  Error checking: ${err.message}`);
    }
    console.log('-'.repeat(70));
  }
}

console.log('\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`Total components: ${componentDirs.length}`);
console.log(`Used: ${results.used.length}`);
console.log(`Unused: ${results.unused.length}`);

if (results.unused.length > 0) {
  console.log('\nUnused components (can potentially be deleted):');
  results.unused.forEach(component => {
    const componentPath = `src/components/${component}`;
    console.log(`  - ${component} (${componentPath})`);
  });

  console.log('\nTo delete unused components, run:');
  results.unused.forEach(component => {
    console.log(`  rm -rf src/components/${component}`);
  });
}

console.log('\nNote: This script checks for any mention of the component name.');
console.log('Some components may be dynamically imported or used in ways not detected.');
console.log('Please verify before deleting any components.\n');
