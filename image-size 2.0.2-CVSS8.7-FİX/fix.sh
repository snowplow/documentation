#!/bin/sh
# image-size — MUST FIX — GHSA-5p2g-fcmc-qvqq
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 2.0.2 → 2.0.3
yarn up image-size@2.0.3
