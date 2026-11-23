#!/bin/sh
# compression — HIGH — GHSA-vc2v-76pw-4v95
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 1.8.1 → 1.8.2
yarn up compression@1.8.2
