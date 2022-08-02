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
    INDEX(.rss.channel.item[]; .["wp:post_id"]) as $posts |
    .rss.channel.item |= map(
        # discard drafts
        select(.["wp:status"] | . == "publish" or . == "inherit") |
        if .["wp:post_type"] == "docs" then
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
                    gsub("</pre>"; "</code></pre>") |
                    # substitute blocks
                    gsub(
                        "<!-- wp:block \\{\"ref\":(?<ref>[0-9]+)\\} /-->";
                        "<pre><code class=\"language-mdx-code-block\">" +
                        "import Block\(.ref) from \"@site/docs/reusable/\($posts[.ref]["wp:post_name"])/_index.md\"\n\n" +
                        "&lt;Block\(.ref)/&gt;\n" +
                        "</code></pre>"
                    )
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
for file in $(grep -rl '<br>' $tmpoutput); do
    sed 's!<br>!<br/>!g' $file | sponge $file
done

# Make links relative
for file in $(grep -rl 'https://docs.snowplowanalytics.com/docs/' $tmpoutput); do
    sed 's!https://docs.snowplowanalytics.com/docs/!/docs/migrated/!g' $file | sponge $file
done

# Prefix blocks with an underscore and remove front matters
for file in $(ls $tmpoutput/wp_block); do
    tail -n+7 $tmpoutput/wp_block/$file/index.md > $tmpoutput/wp_block/$file/_index.md
    rm $tmpoutput/wp_block/$file/index.md
done

rm -rf docs/migrated docs/reusable
mv $tmpoutput/docs docs/migrated
mv $tmpoutput/wp_block docs/reusable

rm -r $tmpexport
