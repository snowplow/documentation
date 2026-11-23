#!/bin/sh
# @babel/plugin-transform-modules-systemjs — MUST FIX — GHSA-fv7c-fp4j-7gwp
cd "$(dirname "$0")/../../../Downloads/documentation-main"
# 7.27.1 → 7.29.4
yarn up @babel/plugin-transform-modules-systemjs@7.29.4
