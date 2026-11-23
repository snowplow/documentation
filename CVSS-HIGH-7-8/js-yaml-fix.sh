#!/bin/sh
# js-yaml — HIGH — GHSA-2883-xcg3-v3hh
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 3.14.1 → 3.15.2
yarn up js-yaml@3.15.2
# 4.1.0 → 4.3.2
yarn up js-yaml@4.3.2
