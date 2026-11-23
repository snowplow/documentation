#!/bin/sh
# postcss — HIGH — GHSA-6g55-p6wh-862q
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 8.4.31 → 8.5.23
yarn up postcss@8.5.23
# 8.5.6 → 8.5.23
yarn up postcss@8.5.23
