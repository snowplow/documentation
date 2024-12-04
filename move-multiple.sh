#!/usr/bin/env bash

# Move commands
# Starting path, end path, optional new sidebar label
moves=(
    # OLD
    # "docs/collecting-data docs/sources Sources",

    # "docs/contributing docs/resources Resources",

    # "docs/understanding-your-pipeline docs/fundamentals Fundamentals",

    # "docs/first-steps docs/get-started Get Started",
    # "docs/feature-comparison docs/get-started/feature-comparison Feature Comparison",
    # "docs/getting-started-on-bdp docs/get-started/snowplow-bdp Snowplow BDP",
    # "docs/getting-started-on-community-edition docs/get-started/snowplow-community-edition Snowplow Community Edition",
    # "docs/fundamentals/deployment-model docs/get-started/deployment-model",

    # "docs/enriching-your-data docs/pipeline/enriching-your-data",

    # "docs/managing-data-quality docs/data-product-studio/data-quality/failed-events Failed Events",
    # "docs/data-product-studio/data-quality/failed-events/testing-and-qa-workflows docs/data-product-studio/data-quality/testing-and-qa-workflows",
    # "docs/testing-debugging docs/data-product-studio/data-quality/testing-debugging",
    # "docs/understanding-tracking-design docs/data-product-studio/data-products Data Products",
    # "docs/collecting-data/code-generation docs/data-product-studio/data-products/snowtype Snowtype",

    # "docs/modeling-your-data docs/data-models Data Models",
    # "docs/pipeline-components-and-applications docs/api-reference API Reference",

    # "docs/storing-querying docs/destinations-temp/loaders-warehouses Loaders and Warehouses",
    # "docs/destinations docs/destinations-temp/event-streaming Event Streaming",
    # "docs/destinations-temp docs/destinations Destinations",

    # "docs/using-the-snowplow-console docs/account-management Account Management",

    # "docs/discovering-data docs/discovering-data-to-delete Delete me!",
    # "docs/recipes docs/recipes-tutorials Recipes and Tutorials (move to new tab)",

    # "docs/data-product-studio/data-products/defining-the-data-to-collect-with-data-poducts docs/data-product-studio/data-products/defining-the-data-to-collect-with-data-products"
    # "docs/sources/code-generation docs/data-product-studio/data-products/snowtype Snowtype"
    # "docs/sources/configuring-collector docs/pipeline/configuring-collector Collector"

    # "docs/pipeline/enriching-your-data docs/pipeline/enrichments"

    # "docs/sources/collecting-data-from-third-parties docs/sources/webhooks"
    # "docs/sources/collecting-from-own-applications docs/sources/trackers"

    # "docs/account-management/managing-users docs/account-management/user-management User Management"
    # "docs/account-management/user-management/managing-permissions docs/account-management/user-management/permissions Permissions"
    # "docs/account-management/managing-console-api-authentication docs/account-management/api-credentials"

    # "docs/data-models/running-data-models-via-snowplow-bdp docs/data-models/running-data-models"
    # "docs/data-models/modeling-your-data-with-dbt docs/data-models/models-dbt"
    # "docs/data-models/modeling-your-data-with-sql-runner docs/data-models/models-sql-runner"
    # "docs/data-models/running-data-models/retrieving-job-execution-data-via-the-api docs/data-models/running-data-models/retrieving-job-execution-data"

    # "docs/data-product-studio/data-quality/failed-events/exploring-failed-events docs/data-product-studio/data-quality/failed-events/explore Explore"
    # "docs/data-product-studio/data-quality/failed-events/monitoring-failed-events docs/data-product-studio/data-quality/failed-events/monitor Monitor"
    # "docs/data-product-studio/data-quality/failed-events/recovering-failed-events docs/data-product-studio/data-quality/failed-events/recover Recover"
    # "docs/data-product-studio/data-quality/testing-and-qa-workflows/set-up-automated-testing-with-snowplow-micro docs/data-product-studio/data-quality/testing-debugging/snowplow-micro/automated-testing Automated testing"
    # "docs/data-product-studio/data-quality/testing-and-qa-workflows/using-the-data-structures-ci-tool-for-data-quality docs/data-product-studio/data-quality/testing-debugging/data-structures-ci-tool Data Structures CI tool"

    # "docs/data-product-studio/data-products/introduction-to-tracking-design docs/data-product-studio/data-products/tracking-design"
    # "docs/data-product-studio/data-products/organize-data-sources-with-source-applications docs/data-product-studio/data-products/source-applications"

    # "docs/data-product-studio/data-products/versioning-your-data-structures docs/data-product-studio/data-products/data-structures/version-amend Verson and amend"
    # "docs/data-product-studio/data-products/managing-your-data-structures docs/data-product-studio/data-products/data-structures/manage Manage"

    # "docs/data-product-studio/data-products/managing-event-specifications/ui docs/data-product-studio/data-products/event-specifications"
    # "docs/data-product-studio/data-products/managing-event-specifications/api docs/data-product-studio/data-products/event-specifications/api"
    # "docs/data-product-studio/data-products/tracking-plans docs/data-product-studio/data-products/event-specifications/tracking-plans"

    # "docs/data-product-studio/data-products/defining-the-data-to-collect-with-data-products docs/data-product-studio/data-products/data-products"



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
