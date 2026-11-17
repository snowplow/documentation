#!/bin/bash

package_name="${1}"
version="${2}"

# A first release can already have its configuration schema checked in.
if [ -f "src/components/JsonSchemaValidator/Schemas/dbt${package_name}_${version}.json" ]; then
  echo "Schema for ${package_name} ${version} already exists; keeping it unchanged."
  exit 0
fi

file_to_copy=$(find src/components/JsonSchemaValidator/Schemas -type f -name "dbt${package_name}*" | sort -V | tail -n 1)
new_file_name=$(echo "${file_to_copy}" | sed "s/\(dbt${package_name}\).*\(\..*\)$/\1_${version}\2/")
cp "${file_to_copy}" "${new_file_name}"
