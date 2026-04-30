#!/usr/bin/env bash

git mv $1 $2

for file in $(git grep -l $1 -- docs/); do
    sed "s!$1/!$2/!g" $file | sponge $file
    git add $file
done

sed "s|^];$|  ['/$1/*', '/$2/:splat', 301],\n];|" worker/redirects.js > worker/redirects.js.tmp
mv worker/redirects.js.tmp worker/redirects.js
git add worker/redirects.js