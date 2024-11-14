#!/usr/bin/env bash

# Move commands with their full path strings
moves=(
    "docs/collecting-data/code-generation docs/data-product-studio/snowtype",
    "docs/collecting-data docs/sources",
    "docs/contributing docs/resources",
    "docs/enriching-your-data docs/pipeline/enriching-your-data",
    "docs/feature-comparison docs/get-started/feature-comparison",
    "docs/getting-started-on-bdp docs/get-started/snowplow-bdp",
    "docs/getting-started-on-community-edition docs/get-started/snowplow-community-edition",
    "docs/managing-data-quality docs/data-product-studio/data-quality",
    "docs/modeling-your-data docs/data-models",
    "docs/pipeline-components-and-applications docs/api-reference",
    "docs/storing-querying docs/destinations-temp/loaders-warehouses",
    "docs/destinations docs/destinations-temp/event-streaming",
    "docs/destinations-temp docs/destinations",
    "docs/testing-debugging docs/data-product-studio/data-quality/testing-debugging",
    "docs/understanding-tracking-design docs/data-product-studio/data-products",
    "docs/understanding-your-pipeline docs/fundamentals",
    "docs/using-the-snowplow-console docs/account-management"


    # Add more move strings here, one per line
)

# Function to create a directory and an index.md file with content
function create_directory_and_index() {
    local dir_path="$1"
    local dir_name=$(basename "$dir_path")
    local index_path="$dir_path/index.md"
    local today=$(date +"%Y-%m-%d")

    echo "Creating directory: $dir_path"
    mkdir -p "$dir_path"

    echo "Creating $index_path"
    cat << EOF > "$index_path"
---
title: "NEW FOLDER $dir_name"
date: "$today"
sidebar_position: 1
---

EOF
}

# Function to move a file/directory and create destination path if needed
function move_file() {
    local source_path="$1"
    local dest_path="$2"

    # Remove any trailing comma from the destination path
    dest_path="${dest_path%,}"

    # Create the destination directory if it doesn't exist
    local dest_dir=$(dirname "$dest_path")
    if [ ! -d "$dest_dir" ]; then
        create_directory_and_index "$dest_dir"
    fi

    # Move the file/directory
    echo "Running: ./move.sh $source_path $dest_path"
    ./move.sh $source_path $dest_path
}

# Run move_file for each path string
for move in "${moves[@]}"; do
    echo "Running move: $move"

    IFS=' ' read -r source_path dest_path <<< "$move"
    move_file "$source_path" "$dest_path"

    # Add a small delay between runs (optional)
    sleep 0.1
done

echo "All moves completed"
