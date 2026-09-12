export const categories = [
  "Academic Independence",
  "Time Management",
  "Self Advocacy",
  "Campus Navigation",
  "Independent Living",
  "Social Adjustment",
] as const;
export type Category = (typeof categories)[number];
export type Scores = Record<Category, number>;
export const subskills: Record<Category, string[]> = {
  "Academic Independence": [
    "Starting assignments early",
    "Recovering from a bad grade",
    "Using office hours",
    "Asking productive questions",
    "Knowing when to seek help",
  ],
  "Time Management": [
    "Estimating task duration",
    "Deadline Management",
    "Protecting sleep",
    "Planning Ahead",
    "Breaking tasks into sessions",
  ],
  "Self Advocacy": [
    "Emailing professors",
    "Communicating problems early",
    "Asking advisors for help",
    "Handling conflicts respectfully",
  ],
  "Campus Navigation": [
    "Academic resources",
    "Health resources",
    "University policies",
    "Registration and add/drop",
    "Tutoring and advising",
  ],
  "Independent Living": [
    "Budgeting",
    "Laundry and chores",
    "Meals",
    "Appointments",
    "Transportation",
    "Packages and mail",
  ],
  "Social Adjustment": [
    "Roommate communication",
    "Boundaries",
    "Joining communities",
    "Balancing social and academic life",
  ],
};
export interface Attempt {
  id: string;
  missionId: string;
  date: string;
  score: number;
  xp: number;
  feedback: string[];
  changes: Partial<Scores>;
}
export interface Student {
  version: 1;
  name: string;
  university: string;
  moveIn: string;
  concerns: Category[];
  mastery: Scores;
  baseline: Scores;
  subskills: Record<string, number>;
  attempts: Attempt[];
  onboarded: boolean;
}
export interface Mission {
  id: string;
  title: string;
  description: string;
  category: Category;
  targets: Category[];
  importance: number;
  difficulty: string;
  minutes: number;
  xp: number;
  cooldown: number;
  prerequisites: string[];
  color: string;
}
export const missions: Mission[] = [
  {
    id: "midterm",
    title: "The bad midterm",
    description: "One tough grade. A chance to find your next move.",
    category: "Academic Independence",
    targets: ["Academic Independence", "Self Advocacy"],
    importance: 1.2,
    difficulty: "Level 1",
    minutes: 5,
    xp: 30,
    cooldown: 24,
    prerequisites: [],
    color: "peach",
  },
  {
    id: "scheduler",
    title: "Build your first week",
    description: "Make room for deadlines, downtime, and a little life.",
    category: "Time Management",
    targets: ["Time Management", "Independent Living"],
    importance: 1,
    difficulty: "Level 2",
    minutes: 8,
    xp: 40,
    cooldown: 24,
    prerequisites: [],
    color: "purple",
  },
  {
    id: "resources",
    title: "Find your support system",
    description: "Get to know the people in your corner on campus.",
    category: "Campus Navigation",
    targets: ["Campus Navigation"],
    importance: 1.1,
    difficulty: "Level 1",
    minutes: 3,
    xp: 25,
    cooldown: 24,
    prerequisites: [],
    color: "green",
  },
  {
    id: "email",
    title: "Press send with confidence",
    description: "Practice asking a professor for the help you need.",
    category: "Self Advocacy",
    targets: ["Self Advocacy", "Academic Independence"],
    importance: 1,
    difficulty: "Level 1",
    minutes: 4,
    xp: 25,
    cooldown: 24,
    prerequisites: [],
    color: "blue",
  },
];
export function demoStudent(onboarded = true): Student {
  const mastery: Scores = {
    "Academic Independence": 52,
    "Time Management": 66,
    "Self Advocacy": 38,
    "Campus Navigation": 31,
    "Independent Living": 61,
    "Social Adjustment": 58,
  };
  const date = new Date();
  date.setDate(date.getDate() + 17);
  return {
    version: 1,
    name: "Maya",
    university: "caltech",
    moveIn: localDate(date),
    concerns: ["Academic Independence", "Self Advocacy", "Campus Navigation"],
    mastery,
    baseline: { ...mastery },
    subskills: Object.fromEntries(
      categories.flatMap((c) => subskills[c].map((s) => [s, mastery[c]])),
    ),
    attempts: [],
    onboarded,
  };
}
export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function daysUntil(date: string) {
  return Math.max(
    0,
    Math.ceil(
      (new Date(`${date}T00:00:00`).getTime() -
        new Date(`${localDate()}T00:00:00`).getTime()) /
        86400000,
    ),
  );
}
export function overall(scores: Scores) {
  return Math.round(
    categories.reduce((n, c) => n + scores[c], 0) / categories.length,
  );
}
export function recommend(s: Student, now = Date.now()) {
  return missions
    .filter((m) =>
      m.prerequisites.every((id) => s.attempts.some((a) => a.missionId === id)),
    )
    .map((m) => {
      const secondary = m.targets.filter((c) => c !== m.category);
      const mastery = secondary.length
        ? s.mastery[m.category] * 0.75 +
          (secondary.reduce((n, c) => n + s.mastery[c], 0) / secondary.length) *
            0.25
        : s.mastery[m.category];
      const last = s.attempts.filter((a) => a.missionId === m.id).at(-1);
      const elapsed = last
        ? (now - new Date(last.date).getTime()) / 3600000
        : Infinity;
      const recency = elapsed < m.cooldown ? 0.12 : 1;
      return {
        ...m,
        priority:
          (100 - mastery) *
          m.importance *
          recency *
          (m.targets.some((c) => s.concerns.includes(c)) ? 1.35 : 1),
      };
    })
    .sort((a, b) => b.priority - a.priority);
}
export function complete(
  s: Student,
  missionId: string,
  score: number,
  feedback: string[],
): Student {
  const m = missions.find((m) => m.id === missionId)!;
  const changes: Partial<Scores> = {};
  const mastery = { ...s.mastery };
  const skills = { ...s.subskills };
  const previousBest = Math.max(
    0,
    ...s.attempts.filter((a) => a.missionId === missionId).map((a) => a.score),
  );
  const earned = Math.max(
    0,
    Math.round(score / 12) - Math.round(previousBest / 12),
  );
  m.targets.forEach((c, i) => {
    const gain = Math.max(0, earned - (i ? 2 : 0));
    changes[c] = Math.min(100, mastery[c] + gain) - mastery[c];
    mastery[c] += changes[c]!;
    subskills[c].forEach(
      (k) => (skills[k] = Math.min(100, skills[k] + changes[c]!)),
    );
  });
  const xp =
    score > previousBest
      ? Math.round((m.xp * (score - previousBest)) / 100)
      : 0;
  return {
    ...s,
    mastery,
    subskills: skills,
    attempts: [
      ...s.attempts,
      {
        id: crypto.randomUUID(),
        missionId,
        date: new Date().toISOString(),
        score,
        xp,
        feedback,
        changes,
      },
    ],
  };
}
export function streak(s: Student) {
  const dates = new Set(s.attempts.map((a) => localDate(new Date(a.date))));
  let n = 0;
  const d = new Date();
  if (!dates.has(localDate(d))) d.setDate(d.getDate() - 1);
  while (dates.has(localDate(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
