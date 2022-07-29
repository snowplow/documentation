#!/usr/bin/env bash

tmpexport=$(mktemp /tmp/wordpress-export.XXXXXX)
echo $tmpexport
trap "rm -f $tmpexport" EXIT INT

tmpoutput=$(mktemp -d /tmp/markdown-import.XXXXXX)
echo $tmpoutput
trap "rm -rf $tmpoutput" EXIT INT

# Some clean-up to make the output of wordpress-export-to-markdown better
sed 's/snowplow-docs.site.strattic.io/docs.snowplowanalytics.com/g' $1 |\
xq -x '
    .rss.channel.item |= map(
        # discard drafts
        select(.["wp:status"] | . == "publish" or . == "inherit") |
        if .["wp:post_type"] == "docs"
        then
            .["wp:post_name"] = (
                # copy the page path to the name so that the pages are organized in a tree
                .link | gsub("https://docs.snowplowanalytics.com/docs/"; "") |
                rtrimstr("/")
            ) |
            if .["wp:menu_order"] then
                .["wp:menu_order"] |= (tonumber * 10)
            else . end |
            if .["content:encoded"] then
                .["content:encoded"] |= (
                    # make sure preformatted code will be fenced with ```
                    gsub("(?<x><pre[^>]+preformatted[^>]+>)"; "\(.x)<code>") |
                    gsub("</pre>"; "</code></pre>")
                )
            else . end
        else . end)' > $tmpexport

wordpress-export-to-markdown/index.js \
    --wizard=false \
    --input=$tmpexport \
    --output=$tmpoutput \
    --post-folders=true \
    --include-other-types=true \
    --save-attached-images=true \
    --save-scraped-images=true

# MDX is really strict!
grep -rl '<br>' $tmpoutput | xargs sed -i'' -e 's!<br>!<br/>!g'

rm -rf docs/migrated
mv $tmpoutput/docs docs/migrated

rm -r $tmpexport
