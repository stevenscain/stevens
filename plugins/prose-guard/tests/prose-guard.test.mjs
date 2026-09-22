import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(here, "../scripts/prose-guard.mjs");

function run(message, extra = {}) {
  const result = spawnSync(process.execPath, [script], {
    input: JSON.stringify({
      hook_event_name: "Stop",
      stop_hook_active: false,
      last_assistant_message: message,
      ...extra,
    }),
    encoding: "utf8",
  });

  assert.equal(result.status, 0);
  return result.stdout ? JSON.parse(result.stdout) : null;
}

assert.equal(run("The cache reduces API calls."), null);

const strong = run("Let me be honest with you. This has two problems.");
assert.equal(strong.decision, "block");
assert.match(strong.reason, /self-reference/);

const hedges = run("This is probably generally somewhat useful.");
assert.equal(hedges.decision, "block");

assert.equal(
  run("This is probably useful."),
  null,
  "one weak hedge should not block"
);

assert.equal(
  run("`Honestly` is a string in this example."),
  null,
  "inline code should be ignored"
);

assert.equal(
  run("Let me be honest.", { stop_hook_active: true }),
  null,
  "a correction pass must not loop"
);

console.log("prose-guard tests passed");
