[jq](https://github.com/jqlang/jq) is a lightweight and flexible command-line JSON processor akin to sed,awk,grep, and friends for JSON data. Snowbridge's jq features utilise the [gojq](https://github.com/itchyny/gojq) package, which is a pure go implementation of jq. jq is Turing complete, so these features allow you to configure arbitrary logic upon json data structures. 

jq supports formatting values, mathematical operations, boolean comparisons, regex matches, and many more useful features. To get started with jq command, see the [tutorial](https://jqlang.github.io/jq/tutorial/), and [full reference manual](https://jqlang.github.io/jq/manual/). [This open-source jq playground tool](https://jqplay.org/) may also be helpful.

For most use cases, you are unlikely to meaningfully encounter them, but note that there are [some small differences](https://github.com/itchyny/gojq?tab=readme-ov-file#difference-to-jq) between jq and gojq.
