#!/bin/sh
# ip-address — HIGH — GHSA-mwp4-54f8-5fhr
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 10.1.0 → 10.7.4
yarn up ip-address@10.7.4
