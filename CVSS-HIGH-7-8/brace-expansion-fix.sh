#!/bin/sh
# brace-expansion — HIGH — GHSA-3jxr-9vmj-r5cp
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 1.1.12 → 1.1.21
yarn up brace-expansion@1.1.21
# 2.0.2 → 2.1.7
yarn up brace-expansion@2.1.7
# 5.0.3 → 5.0.12
yarn up brace-expansion@5.0.12
# 5.0.5 → 5.0.12
yarn up brace-expansion@5.0.12
