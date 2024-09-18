#!/bin/bash

package_name="${1}"
version="${2}"

file_to_copy=$(find src/components/JsonSchemaValidator/Schemas -type f -name "dbt${package_name}*" | sort -V | tail -n 1)
new_file_name=$(echo "${file_to_copy}" | sed "s/\(dbt${package_name}\).*\(\..*\)$/\1_${version}\2/")
cp "${file_to_copy}" "${new_file_name}"
