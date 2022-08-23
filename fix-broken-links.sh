#!/usr/bin/env bash

for link in $(git grep -Eoh '[("]/docs[^)"#?]+' | grep -v index.md | cut -c2- | sort | uniq); do
    relative=$(echo $link | cut -c2-)
    if [ ! -d $relative ]; then
        redirected=$(http --headers --follow --all "https://docs.snowplowanalytics.com/$relative" | grep Location | tail -n 1 | cut -d ' ' -f 2 | tr -d '\r' | sed 's!https://docs.snowplowanalytics.com!!' | grep -Eo '/docs[^)"#?]+')
        if [ ! -z $redirected ]; then
            echo "from: $relative"
            echo "  to: $redirected"
            for file in $(git grep -rl $link docs); do
                sed -E 's!'$link'([)"#?])!'$redirected'\1!g' $file | sponge $file
            done
        fi
    fi
done
