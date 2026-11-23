#!/bin/sh
# tmp — HIGH — GHSA-ph9p-34f9-6g65
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 0.2.5 → 0.2.6
yarn up tmp@0.2.6
