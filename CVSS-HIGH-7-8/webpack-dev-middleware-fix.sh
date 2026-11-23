#!/bin/sh
# webpack-dev-middleware — HIGH — GHSA-g84c-rxfj-3j2c
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 7.4.5 → 7.4.6
yarn up webpack-dev-middleware@7.4.6
