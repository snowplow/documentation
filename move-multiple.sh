#!/usr/bin/env bash

# Move commands
# Starting path, end path, optional new sidebar label
moves=(
    # Example move command:
    # "docs/collecting-data docs/sources Sources",
    # "docs/sources/collecting-data-from-third-parties docs/sources/webhooks"
    # "docs/sources/collecting-from-own-applications docs/sources/trackers"

    # "docs/contributing docs/resources Resources",
    # "docs/understanding-your-pipeline docs/fundamentals Fundamentals",
    # "docs/first-steps docs/get-started Get started",

    # "docs/feature-comparison docs/get-started/feature-comparison Feature comparison",
    # "docs/getting-started-on-bdp docs/get-started/snowplow-bdp Snowplow",
    # "docs/getting-started-on-community-edition docs/get-started/snowplow-community-edition Snowplow Community Edition",
    # "docs/fundamentals/deployment-model docs/get-started/deployment-model",

    # "docs/enriching-your-data docs/pipeline/enrichments",

    # "docs/understanding-tracking-design docs/data-product-studio Data Product Studio",
    # "docs/managing-data-quality docs/data-product-studio/data-quality/failed-events Failed events",
    # "docs/testing-debugging/snowplow-inspector docs/data-product-studio/data-quality/snowplow-inspector",
    # "docs/testing-debugging/snowplow-micro docs/data-product-studio/data-quality/snowplow-micro",

    # "docs/data-product-studio/data-quality/failed-events/testing-and-qa-workflows/set-up-automated-testing-with-snowplow-micro docs/data-product-studio/data-quality/snowplow-micro/automated-testing Automated testing"
    # "docs/data-product-studio/data-quality/failed-events/testing-and-qa-workflows/using-the-data-structures-ci-tool-for-data-quality docs/data-product-studio/data-quality/data-structures-ci-tool Data Structures CI tool"

    # "docs/sources/code-generation docs/data-product-studio/snowtype Snowtype",

    # "docs/data-product-studio/versioning-your-data-structures docs/data-product-studio/data-structures/version-amend Verson and amend"
    # "docs/data-product-studio/managing-your-data-structures docs/data-product-studio/data-structures/manage Manage"

    # "docs/data-product-studio/managing-event-specifications/ui docs/data-product-studio/event-specifications"
    # "docs/data-product-studio/managing-event-specifications/api docs/data-product-studio/event-specifications/api"
    # "docs/data-product-studio/tracking-plans docs/data-product-studio/event-specifications/tracking-plans"

    # "docs/data-product-studio/defining-the-data-to-collect-with-data-products docs/data-product-studio/data-products"
    # "docs/data-product-studio/organize-data-sources-with-source-applications docs/data-product-studio/source-applications"

    # "docs/sources/configuring-collector docs/pipeline/collector Collector"

    # "docs/pipeline-components-and-applications docs/api-reference API reference",
    # "docs/destinations/analytics-sdk docs/api-reference/analytics-sdk",
    # "docs/storing-querying docs/destinations/warehouses-lakes Warehouses and lakes",
    # "docs/recipes docs/resources/recipes-tutorials Recipes and tutorials",

    # "docs/using-the-snowplow-console docs/account-management Account management",



    # Add more move strings here, one per line
)

# Function to move a file/directory using move.sh
function move_file() {
    local source_path="$1"
    local dest_path="$2"
    local sidebar_label="$3"

    # Remove any trailing comma from the destination path
    dest_path="${dest_path%,}"
    sidebar_label="${sidebar_label%,}"

    # Create the destination directory tree if it doesn't exist
    local dest_dir=$(dirname "$dest_path")
    if [ ! -d "$dest_dir" ]; then
        create_directory_structure "$dest_dir"
    fi

    # Update the sidebar_label in the source index.md file using external script
    local source_index_path="$source_path/index.md"
    if [ -f "$source_index_path" ] && [ -n "$sidebar_label" ]; then
        echo "Updating sidebar label to $sidebar_label in $source_index_path"
        ./add-update-sidebar-label.sh "$source_index_path" "$sidebar_label"
    fi

    # Run the move.sh script with the source and destination paths
    echo "Running: ./move.sh \"$source_path\" \"$dest_path\""
    ./move.sh "$source_path" "$dest_path"
}

# Function to create the directory structure recursively
function create_directory_structure() {
    local dir_path="$1"

    # Base case: if the directory exists, return
    if [ -d "$dir_path" ]; then
        return
    fi

    # Recursive case: create the parent directory first
    local parent_dir=$(dirname "$dir_path")
    create_directory_structure "$parent_dir"

    # Create the current directory and index.md file
    create_directory_and_index "$dir_path"
}

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

# Run move_file for each path string
for move in "${moves[@]}"; do
    IFS=' ' read -r source_path dest_path sidebar_label <<< "$move"
    move_file "$source_path" "$dest_path" "$sidebar_label"

    # Add a small delay between runs (optional)
    sleep 0.1
done

echo "All moves completed"
