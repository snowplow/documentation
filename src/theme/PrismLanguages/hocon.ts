/**
 * HOCON grammar for Prism
 * https://github.com/lightbend/config/blob/main/HOCON.md
 *
 * Token types follow the JSON grammar, so HOCON blocks match the colors of JSON blocks.
 * Comments, keys, and strings are greedy: a `#` or `//` inside a quoted string is not a comment,
 * and anything after a `#` or `//` outside a quoted string is.
 */
import type * as PrismNamespace from 'prismjs'

export default function registerHocon(Prism: typeof PrismNamespace): void {
  Prism.languages.hocon = {
    property: [
      {
        // Quoted key, e.g. "foo.bar": 1
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*(?:[:={]|\+=))/,
        lookbehind: true,
        greedy: true,
      },
      {
        // Unquoted key or path expression, e.g. foo.bar = 1, foo { ... }, foo += 1
        pattern: /(^|[\s{,])[^\s"'$`{}[\]:=,+#^?!@*&\\]+(?=\s*(?:[:={]|\+=))/m,
        lookbehind: true,
        greedy: true,
      },
    ],
    string: [
      {
        pattern: /"""[\s\S]*?"""/,
        greedy: true,
      },
      {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"/,
        lookbehind: true,
        greedy: true,
      },
    ],
    comment: {
      pattern: /(?:#|\/\/).*/,
      greedy: true,
    },
    // Substitutions, e.g. ${foo.bar} and ${?ENV_VAR}
    variable: {
      pattern: /\$\{\??[^}\r\n]*\}/,
      alias: 'keyword',
    },
    keyword: {
      pattern: /(^\s*)include\b/m,
      lookbehind: true,
    },
    function: /\b(?:classpath|file|required|url)(?=\()/,
    // Numbers, including durations and sizes, e.g. 10 seconds, 5s, 512 MiB
    // Must stand alone, so digits inside unquoted strings like UUIDs or eu-west-1 are not highlighted
    number: {
      pattern: /(^|[\s:=[,{(])-?\d+(?:\.\d+)?(?:e[+-]?\d+)?(?:[ \t]*[a-z]+)?(?![\w.-])/im,
      lookbehind: true,
    },
    boolean: /\b(?:false|true)\b/,
    null: {
      pattern: /\bnull\b/,
      alias: 'keyword',
    },
    operator: /\+=|[:=]/,
    punctuation: /[{}[\](),]/,
  }
}
