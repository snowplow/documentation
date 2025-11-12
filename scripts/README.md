# Documentation Scripts

## Badge Formatting Checker

### Purpose
Ensures all Badges components are properly wrapped with `<BadgeGroup>` for consistent horizontal layout and responsive wrapping.

### Usage

**Check for badge formatting issues:**
```bash
yarn check-badges
```

**Automatically fix badge formatting issues:**
```bash
yarn fix-badges
```

**Clean up backup files only:**
```bash
yarn cleanup-backups
```

### What it does
- Scans all `.md` files in the `docs/` directory
- Identifies files with multiple `<Badges>` components that aren't wrapped in `<BadgeGroup>`
- In fix mode: automatically adds `BadgeGroup` imports and wraps badges properly

### When to use
- After adding new badge components to documentation
- When you see badges stacking vertically instead of horizontally
- As a quality check before committing changes to badge-heavy pages

### Example fixes

**Before:**
```markdown
import Badges from '@site/src/components/Badges';

<Badges badgeType="Early Release"></Badges>&nbsp;<Badges badgeType="SPAL"></Badges>
```

**After:**
```markdown
import Badges from '@site/src/components/Badges';
import BadgeGroup from '@site/src/components/BadgeGroup';

<BadgeGroup>
<Badges badgeType="Early Release"></Badges>
<Badges badgeType="SPAL"></Badges>
</BadgeGroup>
```

### Backup Management
When using `yarn fix-badges`, the script:
1. Creates backup files (`.bak` extension) before making changes
2. After successful completion, asks if you want to delete backup files
3. You can choose to keep backups or clean them up automatically

### Notes
- Single badges don't need `<BadgeGroup>` wrapping
- The script creates backups before making changes for safety
- Run `yarn check-badges` first to see what will be changed before using `--fix`
- After confirming everything works correctly, you can clean up backup files when prompted