# Stevens

A personal collection of Claude Code plugins, skills, hooks, prompts, and eval helpers.

## Plugin marketplace

Add this repository as a Claude Code marketplace, then install individual plugins from it.

```text
/plugin marketplace add stevenscain/stevens
/plugin install prose-guard@stevens
```

## Plugins

### prose-guard

`prose-guard` reduces distracting model prose while preserving meaning.

It targets hedging, throat clearing, fake contrast, rhetorical framing, repeated conclusions, and similar output patterns.

Current structure:

```text
.claude-plugin/
  marketplace.json
plugins/
  prose-guard/
    .claude-plugin/
      plugin.json
    skills/
      prose-guard/
        SKILL.md
```

The Stop hook and linter implementation will live inside the `prose-guard` plugin.
