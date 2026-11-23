#!/bin/sh
# Run all HIGH 7.x package upgrade scripts
cd "$(dirname "$0")" || exit 1
for f in *-fix.sh; do
  sh "$f" || exit 1
done
