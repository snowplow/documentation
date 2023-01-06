#!/usr/bin/env bash

git mv $1 $2

for file in $(git grep -l $1 -- docs/); do
    sed "s!$1!$2!g" $file | sponge $file
    git add $file
done

echo "/$1/* /$2/:splat 301" >> static/_redirects
git add static/_redirects