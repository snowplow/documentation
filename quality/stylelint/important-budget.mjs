// Stylelint plugin: allow at most `max` `!important` declarations per file.
// Phase 1 of the docs redesign targets 10 or fewer across the site; this rule
// enforces the same number per file so the budget can't creep back in.
import stylelint from 'stylelint'

const ruleName = 'snowplow/important-budget'
const messages = stylelint.utils.ruleMessages(ruleName, {
  over: (count, max) =>
    `${count} !important declarations in this file, budget is ${max}. Fix specificity with cascade layers or tokens instead.`,
})

const rule = (max) => (root, result) => {
  const valid = stylelint.utils.validateOptions(result, ruleName, {
    actual: max,
    possible: [(n) => Number.isInteger(n) && n >= 0],
  })
  if (!valid) return

  const decls = []
  root.walkDecls((decl) => {
    if (decl.important) decls.push(decl)
  })
  if (decls.length <= max) return

  // Report every declaration past the budget so the editor highlights them
  for (const decl of decls.slice(max)) {
    stylelint.utils.report({
      ruleName,
      result,
      node: decl,
      word: '!important',
      message: messages.over(decls.length, max),
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
export default stylelint.createPlugin(ruleName, rule)
