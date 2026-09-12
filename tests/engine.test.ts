import { test } from "node:test";
import assert from "node:assert/strict";
import { complete, demoStudent, recommend } from "../src/lib/model";
import {
  exampleSchedule,
  scoreSchedule,
  scoreRecovery,
  scoreEmail,
} from "../src/lib/scoring";
test("a complete balanced week earns 100", () =>
  assert.equal(
    scoreSchedule(exampleSchedule.map((b, i) => ({ ...b, id: String(i) })))
      .score,
    100,
  ));
test("an empty week cannot pass", () =>
  assert.equal(scoreSchedule([]).score, 0));
test("overlaps and late work lower the score", () => {
  const blocks = exampleSchedule.map((b, i) => ({ ...b, id: String(i) }));
  const result = scoreSchedule([
    ...blocks,
    { id: "late", task: "cs", day: 0, start: 23, duration: 1 },
    { id: "overlap", task: "laundry", day: 0, start: 9, duration: 1 },
  ]);
  assert.ok(result.score < 100);
  assert.ok(result.feedback.some((f) => f.includes("overlap")));
  assert.ok(result.feedback.some((f) => f.includes("sleep")));
});
test("prepared office hours improve recovery", () => {
  assert.ok(
    scoreRecovery(["review", "office", "reflect", "group"]).score >
      scoreRecovery(["office", "review", "reflect", "group"]).score,
  );
  assert.equal(
    scoreRecovery(["review", "office", "reflect", "group"]).score,
    95,
  );
});
test("duplicate recovery actions cannot farm points", () =>
  assert.equal(
    scoreRecovery(["review", "review", "review", "review"]).score,
    25,
  ));
test("weak self advocacy outranks strong time management", () => {
  const s = demoStudent();
  s.mastery["Self Advocacy"] = 20;
  s.mastery["Time Management"] = 90;
  s.mastery["Campus Navigation"] = 80;
  assert.equal(recommend(s)[0].id, "email");
});
test("completion updates mastery and cooldown; replay cannot farm rewards", () => {
  const s = demoStudent();
  const done = complete(s, "resources", 100, ["Found support"]);
  assert.equal(done.mastery["Campus Navigation"], 39);
  assert.notEqual(recommend(done)[0].id, "resources");
  const replay = complete(done, "resources", 100, []);
  assert.equal(replay.mastery["Campus Navigation"], 39);
  assert.equal(replay.attempts.at(-1)?.xp, 0);
  assert.equal(s.attempts.length, 0);
});
test("email rubric distinguishes a complete request from an empty draft", () => {
  assert.equal(scoreEmail("").score, 0);
  assert.equal(
    scoreEmail(
      "Dear Professor Chen, I have a chemistry lab during your office hours. I reviewed the lecture notes and tried the practice problems, but I am stuck on applying the concept. Could we meet on Thursday before Friday’s deadline? Thank you for your time.",
    ).score,
    100,
  );
});
