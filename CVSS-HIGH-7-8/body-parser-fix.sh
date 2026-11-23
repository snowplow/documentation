#!/bin/sh
# body-parser — HIGH — GHSA-27r3-jxmh-p828
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 1.20.3 → 1.20.9
yarn up body-parser@1.20.9
