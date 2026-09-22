# prose-guard

`prose-guard` is a reusable style-control skill for agent output.

Its goal is to preserve meaning while removing common forms of distracting model prose.

## Targets

Detect and reduce:

- conversational throat clearing
- self-referential honesty or directness claims
- unnecessary hedging
- fake or inflated contrast
- rhetorical setup and reveal patterns
- repeated conclusions
- decorative transitions
- unnecessary reassurance
- inflated adjectives and adverbs
- abstract phrasing where a direct verb is clearer

## Core rules

Use plain, direct English.

Use short sentences.
Use common words.
State the answer first.
Use one main point per sentence.
Use only the detail needed.
Prefer concrete nouns and verbs.
Use complete sentences.

Do not add conversational filler.
Do not comment on your own honesty, directness, confidence, tone, or reasoning.
Do not narrate the act of answering.

Avoid hedging unless uncertainty is material.
When uncertainty is material, state the exact uncertainty directly.

Do not use contrastive rhetoric unless the contrast carries needed information.
Do not manufacture opposition between two ideas for emphasis.

Do not use rhetorical setup followed by a reveal.
Do not restate the user's point before answering it.
Do not add motivational, reassuring, or emotional framing unless requested.
Do not use decorative language.
Do not use metaphors unless they clarify a technical concept.

## Common patterns to flag

- "Let me be honest"
- "Honestly"
- "To be honest"
- "To be clear"
- "To be blunt"
- "The key thing is"
- "The important thing is"
- "Here's the thing"
- "The reality is"
- "The truth is"
- "That said"
- "That being said"
- "With that said"
- "At the end of the day"
- "It's worth noting"
- "It's important to note"
- "Keep in mind"
- "Bear in mind"
- "In other words"
- "Put differently"
- "Not X, but Y"
- "It's not about X. It's about Y."
- "Rather than X, think of it as Y."
- "This isn't just X. It's Y."

## Hedge words to review

Use only when they change factual meaning:

- generally
- typically
- often
- usually
- likely
- probably
- perhaps
- potentially
- arguably
- essentially
- basically
- fundamentally
- relatively
- somewhat
- fairly
- quite
- rather

## Rewrite examples

Prefer:

> The cache reduces API calls.

Over:

> The cache isn't just an optimization. It's the key to dramatically reducing unnecessary API calls.

Prefer:

> This has two problems.

Over:

> Here's where things get interesting. There are actually two very different problems hiding underneath this.

## Enforcement model

Use this skill as the specification layer.

Use the plugin Stop hook as the enforcement layer.

Recommended flow:

```text
agent output
    ↓
prose-guard check
    ↓
pass → return output
fail → return exact violations
    ↓
agent rewrites
    ↓
prose-guard check
```

Limit rewrite attempts to avoid loops.
