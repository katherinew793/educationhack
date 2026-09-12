# FirstTerm

A college transition simulator that works without an LLM or API keys. Built with Next.js App Router, TypeScript, React, Tailwind CSS, and Lucide icons.

## Run locally

Use Node.js 20.9+ (Node 22 recommended).

```sh
npm install
npm run dev
```

Open http://localhost:3000. First launch shows onboarding; choose “Explore as Maya” for the seeded Caltech demo. Maya starts 17 days before move-in. Reset Demo restores her scores and clears attempts. The profile arrow opens onboarding again; completing it creates a fresh baseline and clears previous progress.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## Demo flow

1. Choose Caltech, concerns, move-in date, and baseline confidence.
2. Open The bad midterm from the dashboard. Make four decisions; reviewing the exam changes the subsequent office-hours choice and score.
3. Review score feedback and saved mastery changes.
4. Open Build your first week. Drag task cards into day columns (at the selected start time and duration), or add blocks using the form. Remove blocks individually. “Try a balanced plan” loads an editable example.
5. Evaluate deadlines, early starts, split work, sleep, overload, and overlap.
6. Complete the campus resource hunt and see recommendations adapt.
7. View the readiness report, expand subskills, and inspect attempt history. Refresh to verify persistence.
8. Try the email challenge for deterministic rubric feedback. Emails are never sent.

## Architecture

- `src/lib/universities.ts`: typed university knowledge layer with three schools and nine resources per school, deadlines, terminology, advising and registration fields. **All resource details and calendar guidance are clearly labeled representative demo data, not verified policies.** School website links lead to official homepages, not asserted service locations. A real-world follow-up asks students to find their current add/drop deadline; the app never invents one.
- `src/lib/model.ts`: six mastery categories, subskills, mission metadata, concern weighting, recency/cooldown, prerequisites, rewards, daily streaks and historical attempts. Recommendation priority is `(100 - weighted target mastery) × importance × recency × concern weight`. Target mastery weights the primary category at 75% and secondary categories at 25% (or 100% primary for single-category missions). A 24-hour cooldown reduces priority, while keeping practice accessible.
- `src/lib/scoring.ts`: pure deterministic recovery, schedule and email scoring. Recovery state is the ordered action history, capped at four distinct choices. Reviewing before office hours unlocks a more specific action and bonus. Scheduling deducts for incomplete work before deadlines, late starts, insufficient splitting, overlap, sleep intrusion and daily overload.
- `src/lib/storage.ts`: replaceable `StudentRepository` abstraction using browser localStorage, with schema checks and fallback. Data stays in the current browser. The UI reports blocked storage; there is no account or cross-device sync.
- `src/components/challenges.tsx`: interactive challenge UI, separated from scoring.
- `src/app/page.tsx`: onboarding, overview, mission library, school guide and readiness report.
- `src/lib/ai.ts`: optional `AIProvider` interface with offline implementation. To connect an LLM, add a **server-only API route** and provider adapter, keep secrets in server environment variables, pass the predefined rubric, validate structured output, and return advisory feedback only. Deterministic scoring and mastery writes remain in the existing engine. The secondary Ask FirstTerm panel uses local readiness and university data; it is an offline guide, not live chat.

## Scoring and limitations

Readiness is a practice indicator, not a validated assessment. Baseline sliders use self-reported confidence; concern selection affects recommendations. Successful practice increases the targeted categories and their related subskills together. Rewards depend on improvement over the mission’s previous best, preventing repeat-click XP farming. Maximum XP in mission cards reflects a perfect first completion. Six readiness categories are modeled, but the four MVP missions concentrate on academic independence, time management, campus navigation, and self advocacy; social adjustment has a baseline but no dedicated simulation yet.

The calendar is a five-day planning exercise with half-hour start controls; it is not a full calendar service. Long-term planning, meals, commute time and actual course enrollment are outside this demo. Email checks recognize wording patterns rather than full meaning. No external AI service is configured, and no roommate simulation is included.

Unit tests exercise successful and risky schedules, branching recovery, duplicate actions, recommendation priorities, mastery persistence transformations, cooldowns, replay rewards and email rubric behavior.

## Browser verification

With the app running and Google Chrome installed, run `npm run test:e2e`. The Playwright suite covers onboarding, all four challenges, persistence after reload, adaptive ordering, reset, and mobile navigation. Screenshots are written under `test-results/`. To use Playwright Chromium instead, remove `channel: "chrome"` in `playwright.config.ts` and run `npx playwright install chromium`.

This workspace includes an ignored local Node 22 runtime under `.runtime/` because Node was not initially installed on PATH. Normal setup only requires a system Node installation.
`Start-FirstTerm.ps1` can restart this workspace using its local Node runtime when Node is not on PATH.
