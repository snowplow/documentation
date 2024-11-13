#!/usr/bin/env bash

# Move commands with their full path strings
moves=(
    "docs/collecting-data/code-generation docs/data-product-studio/snowtype",
    "docs/collecting-data docs/sources",
    "docs/contributing docs/resources",
    "docs/enriching-your-data docs/pipeline/enriching-your-data",
    "docs/feature-comparison docs/get-started/feature-comparison",

    # Add more move strings here, one per line
)

# Function to move a file/directory and create destination path if needed
function move_file() {
    local source_path="$1"
    local dest_path="$2"

    # Remove any trailing comma from the destination path
    dest_path="${dest_path%,}"

    # Check if destination path exists, create it if not
    local dest_dir=$(dirname "$dest_path")
    if [ ! -d "$dest_dir" ]; then
        echo "Creating directory: $dest_dir"
        mkdir -p "$dest_dir"
    fi

    # Move the file/directory
    echo "Running: git mv $source_path $dest_path"
    git mv $source_path $dest_path
}

# Run move_file for each path string
for move in "${moves[@]}"; do
    echo "Running move: $move"

    IFS=' ' read -r source_path dest_path <<< "$move"
    move_file "$source_path" "$dest_path"

    # Add a small delay between runs (optional)
    sleep 1
done

echo "All moves completed"
