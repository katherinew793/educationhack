export interface Evaluation {
  score: number;
  feedback: string[];
}
export type ActionId =
  | "ignore"
  | "review"
  | "credit"
  | "office"
  | "solutions"
  | "reflect"
  | "cram"
  | "group"
  | "support";
export const recoveryActions: {
  id: ActionId;
  label: string;
  points: number;
  feedback: string;
}[] = [
  {
    id: "ignore",
    label: "Put it away. Study harder next time.",
    points: 0,
    feedback:
      "Without diagnosing the problem, more hours may repeat the same mistakes.",
  },
  {
    id: "review",
    label: "Review the exam and categorize mistakes",
    points: 25,
    feedback:
      "You discover most errors were conceptual, not calculation mistakes.",
  },
  {
    id: "credit",
    label: "Ask the professor for extra credit",
    points: 3,
    feedback:
      "Focus the conversation on understanding the material and making a recovery plan.",
  },
  {
    id: "office",
    label: "Attend office hours",
    points: 15,
    feedback: "Asking for help early gives you time to apply what you learn.",
  },
  {
    id: "solutions",
    label: "Copy another student’s old solutions",
    points: -15,
    feedback:
      "Copying bypasses learning and risks academic integrity. Work through ideas together instead.",
  },
  {
    id: "reflect",
    label: "Reflect on how you studied",
    points: 20,
    feedback:
      "Rereading felt familiar. Next time, try solving problems without notes.",
  },
  {
    id: "cram",
    label: "Wait until the night before to study",
    points: 0,
    feedback:
      "A single late session leaves little time to identify gaps or get help.",
  },
  {
    id: "group",
    label: "Form a study group and explain concepts",
    points: 20,
    feedback:
      "Explaining your reasoning helps uncover gaps and build understanding.",
  },
  {
    id: "support",
    label: "Find tutoring and plan a visit",
    points: 20,
    feedback: "You have added another source of support before the next exam.",
  },
];
export function scoreRecovery(actions: ActionId[]): Evaluation {
  const unique = [...new Set(actions)].slice(0, 4);
  let score = unique.reduce(
    (s, id) => s + (recoveryActions.find((a) => a.id === id)?.points || 0),
    0,
  );
  if (
    unique.includes("review") &&
    unique.includes("office") &&
    unique.indexOf("review") < unique.indexOf("office")
  )
    score += 15;
  if (unique.indexOf("office") >= 3) score -= 5;
  return {
    score: Math.max(0, Math.min(100, score)),
    feedback: [
      unique.includes("review")
        ? "You diagnosed the problem before changing your strategy."
        : "Start by categorizing the mistakes on your exam.",
      unique.includes("office") || unique.includes("support")
        ? "You made support part of your recovery plan."
        : "Seek help early, while there is time to change course.",
      unique.includes("reflect") || unique.includes("group")
        ? "You chose an active learning strategy."
        : "Try practice problems and explaining concepts, rather than rereading.",
      ...(unique.includes("solutions")
        ? [
            "Copying solutions does not demonstrate learning; this reduced your integrity score.",
          ]
        : []),
    ],
  };
}
export interface CalendarBlock {
  id: string;
  task: string;
  day: number;
  start: number;
  duration: number;
  fixed?: boolean;
}
export const tasks = [
  { id: "cs", label: "CS problem set", hours: 6, deadline: 3 * 24 + 23.99 },
  {
    id: "calculus",
    label: "Calculus homework",
    hours: 3,
    deadline: 4 * 24 + 17,
  },
  {
    id: "chemistry",
    label: "Chemistry reading",
    hours: 1.5,
    deadline: 2 * 24 + 9,
  },
  { id: "laundry", label: "Laundry", hours: 1, deadline: 4 * 24 + 23 },
];
export const commitments: CalendarBlock[] = [
  ...Array.from({ length: 5 }, (_, day) => [
    {
      id: `calc-${day}`,
      task: "Calculus",
      day,
      start: 9,
      duration: 1,
      fixed: true,
    },
    {
      id: `class-${day}`,
      task: day % 2 ? "Chemistry" : "CS lecture",
      day,
      start: day % 2 ? 10 : 11,
      duration: 1,
      fixed: true,
    },
    {
      id: `lab-${day}`,
      task: day % 2 ? "CS lecture" : "Chemistry",
      day,
      start: day % 2 ? 13 : 14,
      duration: 1,
      fixed: true,
    },
  ]).flat(),
  {
    id: "orchestra",
    task: "Orchestra",
    day: 1,
    start: 19.5,
    duration: 2.5,
    fixed: true,
  },
  {
    id: "club",
    task: "Club meeting",
    day: 2,
    start: 19,
    duration: 1,
    fixed: true,
  },
];
export function scoreSchedule(blocks: CalendarBlock[]): Evaluation {
  let score = 100;
  const feedback: string[] = [];
  const all = [...commitments, ...blocks];
  for (const t of tasks) {
    const relevant = blocks.filter((b) => b.task === t.id);
    const timely = relevant.filter(
      (b) => b.day * 24 + b.start + b.duration <= t.deadline,
    );
    const hours = timely.reduce((n, b) => n + b.duration, 0);
    if (hours < t.hours) {
      score -= Math.round((25 * (t.hours - hours)) / t.hours);
      feedback.push(
        `${t.label}: ${Math.max(0, t.hours - hours)} more hours needed before the deadline.`,
      );
    }
    if (t.hours >= 5 && relevant.length) {
      if (
        Math.min(...relevant.map((b) => b.day * 24 + b.start)) >
        t.deadline - 24
      ) {
        score -= 10;
        feedback.push(
          "Start the CS problem set at least 24 hours before its deadline.",
        );
      }
      if (
        relevant.length < 2 ||
        Math.max(...relevant.map((b) => b.duration)) >= 5
      ) {
        score -= 10;
        feedback.push("Break the CS problem set into shorter study sessions.");
      }
    }
  }
  let overlap = false;
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i],
        b = all[j];
      if (
        a.day === b.day &&
        a.start < b.start + b.duration &&
        b.start < a.start + a.duration &&
        (!a.fixed || !b.fixed)
      )
        overlap = true;
    }
  if (overlap) {
    score -= 20;
    feedback.push("Some blocks overlap. Give each commitment its own time.");
  }
  const late = blocks.reduce(
    (n, b) =>
      n + Math.max(0, b.start + b.duration - 23) + Math.max(0, 7 - b.start),
    0,
  );
  if (late) {
    score -= Math.min(20, late * 5);
    feedback.push(
      "Protect 11 pm–7 am for sleep; move late-night work earlier.",
    );
  }
  if (
    Array.from({ length: 5 }, (_, d) =>
      all.filter((b) => b.day === d).reduce((n, b) => n + b.duration, 0),
    ).some((n) => n > 9)
  ) {
    score -= 10;
    feedback.push(
      "A day has more than 9 hours of commitments. Spread the load.",
    );
  }
  if (!feedback.length)
    feedback.push(
      "Strong plan: tasks finish on time, long work is split, and sleep is protected.",
    );
  return { score: Math.max(0, Math.min(100, Math.round(score))), feedback };
}
export const exampleSchedule: Omit<CalendarBlock, "id">[] = [
  { task: "cs", day: 0, start: 15, duration: 2 },
  { task: "cs", day: 1, start: 15, duration: 2 },
  { task: "cs", day: 2, start: 15, duration: 2 },
  { task: "calculus", day: 3, start: 15, duration: 2 },
  { task: "calculus", day: 4, start: 15, duration: 1 },
  { task: "chemistry", day: 0, start: 17, duration: 1.5 },
  { task: "laundry", day: 4, start: 16, duration: 1 },
];
export function scoreEmail(
  email: string,
): Evaluation & { rubric: { label: string; passed: boolean }[] } {
  const words = email.trim().split(/\s+/).filter(Boolean).length;
  const rubric = [
    {
      label: "Greeting",
      passed: /\b(dear|hello|hi)\s+(professor|dr\.?|chen)/i.test(email),
    },
    {
      label: "Concise explanation",
      passed: /\b(lab|conflict|chemistry)\b/i.test(email),
    },
    {
      label: "Shows what you tried",
      passed:
        /\b(tried|attempted|reviewed|worked through|stuck|confused)\b/i.test(
          email,
        ),
    },
    {
      label: "Specific request",
      passed:
        /\b(could|can|would|available|meet)\b/i.test(email) &&
        /\b(friday|thursday|wednesday|tuesday|monday|before|after|\d{1,2})\b/i.test(
          email,
        ),
    },
    {
      label: "Respectful tone",
      passed:
        /\b(thank|thanks|please|appreciate)\b/i.test(email) &&
        !/\b(stupid|idiot|demand)\b/i.test(email),
    },
    {
      label: "Reasonable length (35–180 words)",
      passed: words >= 35 && words <= 180,
    },
  ];
  return {
    score: Math.round((rubric.filter((r) => r.passed).length / 6) * 100),
    rubric,
    feedback: rubric
      .filter((r) => !r.passed)
      .map((r) => `Try adding: ${r.label.toLowerCase()}.`)
      .concat([
        "Rule-based practice feedback checks wording, not the full meaning of your email.",
      ]),
  };
}
