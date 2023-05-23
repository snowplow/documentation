#!/usr/bin/env bash

for link in $(git grep -Eoh '[("]/docs[^)"#?]+' | grep -v '.md$' | cut -c2- | sort | uniq); do
    relative=$(echo $link | cut -c2-)
    replacement=$(echo $link | sed 's![^/]$!&/!')
    for file in $(git grep -rl $link docs); do
        # Markdown links
        sed -E 's![(]'$link'([)#?])!('$replacement'index.md\1!g' $file | sponge $file
        # HTML links
        sed -E 's!["]'$link'(["#?])!"'$replacement'\1!g' $file | sponge $file
    done
done
