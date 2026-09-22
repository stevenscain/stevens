# Stevens

A personal collection of reusable Claude Code plugins, agent skills, hooks, prompts, and eval helpers.

## Marketplace

Add this repository to Claude Code:

```text
/plugin marketplace add stevenscain/stevens
```

Then install a plugin from the collection.

## Plugins

### prose-guard

A deterministic prose linter for Claude Code output.

It detects common low-signal patterns such as throat clearing, self-referential honesty claims, fake contrast, rhetorical reveals, decorative transitions, and clusters of unnecessary hedge words.

Install it with:

```text
/plugin install prose-guard
```

The plugin includes:

```text
plugins/prose-guard/
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

The skill defines the writing rules. The Stop hook checks the final response and requests one rewrite when the violation score reaches the threshold.
