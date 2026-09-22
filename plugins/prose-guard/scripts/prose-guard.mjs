#!/usr/bin/env node

const input = await readStdin();
let payload;

try {
  payload = JSON.parse(input || "{}");
} catch {
  process.exit(0);
}

// Only allow one correction pass. Claude Code sets this after a Stop hook
// causes the conversation to continue.
if (payload.stop_hook_active) process.exit(0);

const original = String(payload.last_assistant_message || "").trim();
if (!original) process.exit(0);

const text = stripIgnoredContent(original);
const violations = lint(text);
const score = violations.reduce((sum, v) => sum + v.weight, 0);
const threshold = numberFromEnv("PROSE_GUARD_THRESHOLD", 3);

if (score < threshold) process.exit(0);

const maxShown = numberFromEnv("PROSE_GUARD_MAX_VIOLATIONS", 8);
const shown = violations.slice(0, maxShown);
const details = shown
  .map((v) => `- ${v.rule}: ${JSON.stringify(v.match)} (+${v.weight})`)
  .join("\n");

const reason = [
  "PROSE-GUARD: Rewrite the final response before stopping.",
  "Preserve all factual content and useful detail.",
  "Remove the flagged prose patterns. Do not explain the rewrite.",
  "Return only the corrected answer.",
  "",
  `Score: ${score}. Threshold: ${threshold}.`,
  "Violations:",
  details,
].join("\n");

process.stdout.write(JSON.stringify({ decision: "block", reason }));

function lint(text) {
  const rules = [
    // Strong rhetorical and self-referential patterns.
    rule("self-reference", 3, /\b(?:let me be honest(?: with you)?|to be honest|honestly|to be clear|to be blunt|if i(?:'m| am) being honest|if i(?:'m| am) being direct)\b/gi),
    rule("throat-clearing", 3, /\b(?:here(?:'|’)s the thing|the key thing is|the important thing is|the reality is|the truth is|what(?:'|’)s really happening is)\b/gi),
    rule("decorative-transition", 2, /\b(?:that said|that being said|with that said|at the end of the day|it(?:'|’)s worth noting|it(?:'|’)s important to note|keep in mind|bear in mind|put differently)\b/gi),
    rule("fake-contrast", 3, /\b(?:it(?:'|’)s not about\b[^.!?]{1,120}\bit(?:'|’)s about|this isn(?:'|’)t just\b[^.!?]{1,120}\bit(?:'|’)s|not\b[^.!?]{1,100}\bbut\b)/gi),
    rule("rhetorical-reveal", 2, /\b(?:here(?:'|’)s where (?:it|things) get(?:s)? interesting|what matters is|the real issue is|the bigger point is)\b/gi),

    // Weaker signals. These need several hits before the response is blocked.
    rule("hedge", 1, /\b(?:generally|typically|usually|likely|probably|perhaps|potentially|arguably|essentially|basically|fundamentally|relatively|somewhat|fairly|quite|rather)\b/gi),
  ];

  const found = [];
  for (const r of rules) {
    for (const match of text.matchAll(r.pattern)) {
      found.push({
        rule: r.name,
        weight: r.weight,
        match: compact(match[0]),
        index: match.index ?? 0,
      });
    }
  }

  // Preserve document order so feedback is easy to act on.
  return found.sort((a, b) => a.index - b.index);
}

function rule(name, weight, pattern) {
  return { name, weight, pattern };
}

function stripIgnoredContent(text) {
  // Code, inline code, and URLs often contain words that should not be treated
  // as authored prose. Replace them with spaces so indexes remain roughly stable.
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]+`/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/^>.*$/gm, " ");
}

function compact(value) {
  return value.replace(/\s+/g, " ").trim().slice(0, 180);
}

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.resume();
  });
}
