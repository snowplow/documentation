#!/bin/bash

package_name="${1}"
version="${2}"

sed -i "s/dbtSnowplow${package_name}:[[:space:]]*'[^']*'/dbtSnowplow${package_name}: '${version}'/" src/componentVersions.js
