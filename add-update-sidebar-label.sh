#!/usr/bin/env bash

# Check if both arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <file_path> <label>"
    exit 1
fi

file_path="$1"
new_label="$2"

# Check if label is empty or just quotes
if [ -z "$new_label" ] || [ "$new_label" = "\"\"" ] || [ "$new_label" = "''" ]; then
    echo "Error: Label cannot be empty"
    exit 1
fi

# Strip existing quotes if present, store in variable
cleaned_label=$(echo "$new_label" | sed "s/^[\"']//;s/[\"']$//")

if [ -z "$cleaned_label" ]; then
    echo "Error: Label cannot be empty"
    exit 1
fi

# Check if file exists
if [ ! -f "$file_path" ]; then
    echo "Error: File does not exist"
    exit 1
fi

# Check if filename is index.md
filename=$(basename "$file_path")
if [ "$filename" != "index.md" ]; then
    echo "Error: File must be named index.md"
    exit 1
fi

# Create a temporary file
temp_file=$(mktemp)

# Initialize variables
in_frontmatter=false
frontmatter_end_found=false
first_line_checked=false
sidebar_label_found=false
line_count=0

# Process the file line by line
while IFS= read -r line || [ -n "$line" ]; do
    ((line_count++))

    # Check first line
    if [ $line_count -eq 1 ]; then
        if [ "$line" != "---" ]; then
            echo "Error: First line must be '---'"
            rm "$temp_file"
            exit 1
        fi
        first_line_checked=true
        in_frontmatter=true
        echo "$line" >> "$temp_file"
        continue
    fi

    # Process frontmatter
    if $in_frontmatter; then
        if [ "$line" = "---" ]; then
            # If no sidebar_label was found, add it before closing delimiter
            if ! $sidebar_label_found; then
                printf 'sidebar_label: "%s"\n' "$cleaned_label" >> "$temp_file"
            fi
            echo "$line" >> "$temp_file"
            in_frontmatter=false
            frontmatter_end_found=true
        else
            # Check if line contains sidebar_label
            if [[ "$line" =~ ^[[:space:]]*sidebar_label:[[:space:]]* ]]; then
                # Replace existing sidebar_label with new one
                printf 'sidebar_label: "%s"\n' "$cleaned_label" >> "$temp_file"
                sidebar_label_found=true
            else
                echo "$line" >> "$temp_file"
            fi
        fi
    else
        echo "$line" >> "$temp_file"
    fi
done < "$file_path"

# Check if we found the closing frontmatter delimiter
if ! $frontmatter_end_found; then
    echo "Error: No closing '---' found for frontmatter"
    rm "$temp_file"
    exit 1
fi

# Replace original file with modified content
mv "$temp_file" "$file_path"

if $sidebar_label_found; then
    echo "Successfully updated existing sidebar_label in frontmatter"
else
    echo "Successfully added new sidebar_label to frontmatter"
fi
