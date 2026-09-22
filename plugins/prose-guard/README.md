# prose-guard

A Claude Code plugin that detects distracting prose patterns in the final assistant response and requests one rewrite before the turn ends.

It targets patterns such as:

- "let me be honest"
- throat clearing
- fake contrast
- rhetorical reveals
- decorative transitions
- clusters of weak hedge words

The checker is deterministic. It does not call another model.

## Install

Add this repository as a Claude Code marketplace, then install the plugin:

```text
/plugin marketplace add stevenscain/stevens
/plugin install prose-guard
```

For local development:

```bash
claude --plugin-dir ./plugins/prose-guard
```

## How it works

`prose-guard` registers a `Stop` hook. Claude Code passes the final assistant message to the hook as `last_assistant_message`.

The script assigns weights to prose violations. If the score reaches the threshold, it returns a blocking Stop decision with the exact violations. Claude then rewrites the answer.

The hook allows only one correction pass. If `stop_hook_active` is already true, it does not block again.

## Defaults

The default blocking threshold is `3`.

Examples:

- one strong violation such as `let me be honest` blocks the response
- three weak hedge matches block the response
- one weak hedge match does not block the response

Code fences, inline code, quoted lines, and URLs are excluded from checking.

## Configuration

The hook supports two optional environment variables:

```text
PROSE_GUARD_THRESHOLD=3
PROSE_GUARD_MAX_VIOLATIONS=8
```

`PROSE_GUARD_THRESHOLD` sets the minimum score that triggers a rewrite.

`PROSE_GUARD_MAX_VIOLATIONS` limits how many violations are returned to Claude in one correction request.

## Files

```text
prose-guard/
  .claude-plugin/
    plugin.json
  hooks/
    hooks.json
  scripts/
    prose-guard.mjs
  skills/
    prose-guard/
      SKILL.md
```

## Design

The skill describes the desired prose style.

The Stop hook enforces a measurable subset of that style. It does not try to judge every writing choice. Rules should be added only when they can be detected with low false-positive risk.
