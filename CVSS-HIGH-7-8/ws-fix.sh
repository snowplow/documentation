#!/bin/sh
# ws — HIGH — GHSA-96hv-2xvq-fx4p
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 7.5.10 → 7.5.11
yarn up ws@7.5.11
# 8.18.3 → 8.21.0
yarn up ws@8.21.0
