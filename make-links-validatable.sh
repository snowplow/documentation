#!/usr/bin/env bash

for link in $(git grep -Eoh '[("]/docs[^)"#?]+' | grep -v index.md | cut -c2- | sort | uniq); do
    relative=$(echo $link | cut -c2-)
    replacement=$(echo $link | sed 's![^/]$!&/!')
    echo "from: $relative"
    if [ ! -d $relative ]; then
        redirected=$(http --headers --follow --all "https://docs.snowplowanalytics.com/$relative" | grep Location | tail -n 1 | cut -d ' ' -f 2 | tr -d '\r' | sed 's!https://docs.snowplowanalytics.com!!' | grep -Eo '/docs[^)"#?]+')
        if [ ! -z $redirected ]; then
            replacement=$(echo $redirected | sed 's![^/]$!&/!')
        fi
    fi
    echo "  to: $replacement"
    for file in $(git grep -rl $link docs); do
        # Markdown links
        sed -E 's![(]'$link'([)#?])!('$replacement'index.md\1!g' $file | sponge $file
        # HTML links
        sed -E 's!["]'$link'(["#?])!"'$replacement'\1!g' $file | sponge $file
    done
done
