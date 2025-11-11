#!/bin/bash

# Script to automatically wrap Badges components with BadgeGroup

echo "Finding all .md files with Badges components..."

# Find all .md files that contain Badges
files_with_badges=$(grep -r "Badges badgeType" docs/**/*.md | cut -d: -f1 | sort -u)

updated_count=0

for file in $files_with_badges; do
    echo "Processing: $file"

    # Skip if already has BadgeGroup
    if grep -q "<BadgeGroup>" "$file"; then
        echo "  Skipping - already has BadgeGroup"
        continue
    fi

    # Create backup
    cp "$file" "$file.bak"

    # Add BadgeGroup import if not present
    if ! grep -q "import BadgeGroup" "$file"; then
        # Add after Badges import
        sed -i '' '/import Badges from/a\
import BadgeGroup from '\''@site/src/components/BadgeGroup'\'';
' "$file"
    fi

    # Pattern to match single or multiple badges on consecutive lines
    # This is a simplified approach - wrap each badge line individually for now

    # First, let's see what patterns we have in this file
    badge_lines=$(grep -n "Badges badgeType" "$file")

    if [ -n "$badge_lines" ]; then
        echo "  Found badge lines in $file"

        # For now, let's use a simple approach: wrap all consecutive Badges lines
        # This is complex with sed, so let's use a different approach

        # Create a temp file
        temp_file=$(mktemp)

        # Process the file line by line
        in_badge_group=false
        badge_group_lines=""

        while IFS= read -r line; do
            if [[ $line =~ \<Badges.*badgeType ]]; then
                if [ "$in_badge_group" = false ]; then
                    # Start of badge group
                    in_badge_group=true
                    badge_group_lines="<BadgeGroup>"$'\n'"$line"
                else
                    # Continue badge group
                    badge_group_lines="$badge_group_lines"$'\n'"$line"
                fi
            else
                if [ "$in_badge_group" = true ]; then
                    # End of badge group
                    echo "$badge_group_lines" >> "$temp_file"
                    echo "</BadgeGroup>" >> "$temp_file"
                    in_badge_group=false
                    badge_group_lines=""
                fi
                echo "$line" >> "$temp_file"
            fi
        done < "$file"

        # Handle case where file ends with badges
        if [ "$in_badge_group" = true ]; then
            echo "$badge_group_lines" >> "$temp_file"
            echo "</BadgeGroup>" >> "$temp_file"
        fi

        # Replace original file
        mv "$temp_file" "$file"

        echo "  Updated $file"
        updated_count=$((updated_count + 1))
    else
        # No badges found, restore backup
        mv "$file.bak" "$file"
    fi
done

echo ""
echo "Updated $updated_count files"
echo "Backup files created with .bak extension"