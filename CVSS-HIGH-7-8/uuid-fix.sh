#!/bin/sh
# uuid — HIGH — GHSA-w5hq-g745-h8pq
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 8.3.2 → 11.1.1
yarn up uuid@11.1.1
# 10.0.0 → 11.1.1
yarn up uuid@11.1.1
# 11.1.0 → 11.1.1
yarn up uuid@11.1.1
