"use client";
import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Compass,
  Flame,
  GraduationCap,
  Home,
  Leaf,
  MapPin,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  X,
  Zap,
  Menu,
  Mail,
  Heart,
  Users,
} from "lucide-react";
import {
  categories,
  Category,
  complete,
  demoStudent,
  daysUntil,
  localDate,
  missions,
  Mission,
  overall,
  recommend,
  Student,
  streak,
  subskills,
} from "@/lib/model";
import { studentRepository } from "@/lib/storage";
import { universities } from "@/lib/universities";
import { Evaluation } from "@/lib/scoring";
import {
  Midterm,
  Scheduler,
  ResourceHunt,
  EmailChallenge,
} from "@/components/challenges";
type Page = "dashboard" | "missions" | "campus" | "report";
const concernOptions: { label: string; c: Category }[] = [
  { label: "Academic workload", c: "Academic Independence" },
  { label: "Managing my time", c: "Time Management" },
  { label: "Asking professors / TAs for help", c: "Self Advocacy" },
  { label: "Making friends", c: "Social Adjustment" },
  { label: "Roommates", c: "Social Adjustment" },
  { label: "Finding campus resources", c: "Campus Navigation" },
  { label: "Managing money", c: "Independent Living" },
  { label: "Getting involved in research / clubs", c: "Campus Navigation" },
  { label: "Living independently", c: "Independent Living" },
];
function containDialog(event: KeyboardEvent<HTMLElement>, close: () => void) {
  if (event.key === "Escape") {
    close();
    return;
  }
  if (event.key !== "Tab") return;
  const nodes = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]',
    ),
  );
  const first = nodes[0],
    last = nodes.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

const icons = [BookOpen, CalendarDays, MessageCircle, Compass, Home, Users];
const colors = [
  "#b692d0",
  "#80a38c",
  "#d6a060",
  "#769eb2",
  "#c69b89",
  "#ac9bbd",
];
function CampusArt() {
  return (
    <svg
      viewBox="0 0 460 265"
      className="campus-art"
      aria-label="Illustration of a sunny college campus"
      role="img"
    >
      <circle cx="326" cy="73" r="48" fill="#f2cd78" />
      <path d="M0 226Q103 174 201 220T460 218V265H0" fill="#ccd8b6" />
      <path d="M211 265L286 204H318L305 265" fill="#faf0d9" />
      <path d="M93 121L209 75L327 122" fill="#a3674e" />
      <rect x="106" y="121" width="208" height="107" rx="3" fill="#e4b99a" />
      <rect x="99" y="118" width="224" height="11" fill="#f1d4b6" />
      <path d="M167 115V63L206 42L244 63V115" fill="#edccb0" />
      <path d="M157 65L206 34L254 65" fill="#936c56" />
      <rect x="190" y="76" width="32" height="33" rx="16" fill="#779085" />
      <path
        d="M206 79V93L216 98"
        fill="none"
        stroke="#f9ebd2"
        strokeWidth="3"
      />
      <path d="M185 226V178Q207 143 229 178V226" fill="#6b8173" />
      {[122, 151, 248, 277].map((x) => (
        <g key={x}>
          <rect x={x} y="143" width="19" height="27" rx="9" fill="#849889" />
          <rect x={x} y="184" width="19" height="25" rx="3" fill="#849889" />
        </g>
      ))}
      <path
        d="M79 242V158M356 243V135M399 242V177"
        stroke="#8b8666"
        strokeWidth="6"
      />
      <ellipse cx="78" cy="148" rx="29" ry="49" fill="#8eaa7c" />
      <ellipse cx="356" cy="135" rx="32" ry="61" fill="#6e9278" />
      <ellipse cx="400" cy="174" rx="25" ry="40" fill="#a4b486" />
      <path d="M34 235Q51 199 70 236M322 242Q344 209 367 241" fill="#7e9e78" />
      <path
        d="M285 43q7-9 14 0q7-9 14 0M363 55q5-7 10 0q5-7 10 0"
        fill="none"
        stroke="#899480"
        strokeWidth="2"
      />
      <rect x="119" y="223" width="180" height="6" fill="#c19c80" />
    </svg>
  );
}
export default function App() {
  const [student, setStudent] = useState<Student | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [active, setActive] = useState<Mission | null>(null);
  const [result, setResult] = useState<Evaluation | null>(null);
  const [coach, setCoach] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [saveError, setSaveError] = useState("");
  useEffect(() => setStudent(studentRepository.load()), []);
  useEffect(() => {
    if (!active && !coach) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        setCoach(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [active, coach]);
  useEffect(() => {
    if (result)
      document.querySelector<HTMLButtonElement>(".result .primary")?.focus();
  }, [result]);
  function save(s: Student) {
    setStudent(s);
    try {
      studentRepository.save(s);
      setSaveError("");
    } catch {
      setSaveError(
        "Browser storage is unavailable. Progress will last for this session only.",
      );
    }
  }
  if (!student)
    return (
      <div className="loading">
        <GraduationCap size={38} />
        <h2>FirstTerm</h2>
        <p>Finding your footing…</p>
      </div>
    );
  if (!student.onboarded) return <Onboarding initial={student} finish={save} />;
  const school = universities.find((u) => u.id === student.university)!;
  const ranked = recommend(student);
  const xp = student.attempts.reduce((n, a) => n + a.xp, 0);
  const score = overall(student.mastery);
  const latest = student.attempts.at(-1);
  function open(m: Mission) {
    setActive(m);
    setResult(null);
  }
  function finish(e: Evaluation) {
    if (!student || !active || result) return;
    save(complete(student, active.id, e.score, e.feedback));
    setResult(e);
  }
  function nav(p: Page) {
    setPage(p);
    setMobile(false);
  }
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobile ? "visible" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            nav("dashboard");
          }}
        >
          <span className="brand-icon">
            <GraduationCap size={24} />
          </span>
          FirstTerm<span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">YOUR NEXT CHAPTER</div>
        <nav>
          {(
            [
              { id: "dashboard", label: "Overview", icon: Home },
              { id: "missions", label: "Your missions", icon: Compass },
              { id: "campus", label: "Campus guide", icon: MapPin },
              { id: "report", label: "Readiness report", icon: TrendingUp },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              className={page === item.id ? "active" : ""}
              onClick={() => nav(item.id)}
            >
              <item.icon size={19} />
              {item.label}
              {page === item.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="small-promise">
            <div className="little-leaf">
              <Leaf size={23} />
            </div>
            <h4>
              You don’t have to
              <br />
              have it all figured out.
            </h4>
            <p>Just take the next small step.</p>
            <span>We’ll help you find your footing.</span>
          </div>
          <button className="coach-button" onClick={() => setCoach(true)}>
            <MessageCircle size={18} /> Ask FirstTerm <ArrowUpRight size={15} />
          </button>
          <button
            className="reset"
            onClick={() => {
              save(demoStudent());
              setPage("dashboard");
            }}
          >
            {" "}
            <RotateCcw size={14} /> Reset Demo
          </button>
          <div className="profile">
            <div className="avatar">{student.name[0]}</div>
            <div>
              <strong>{student.name}</strong>
              <small>{school.shortName} · Incoming student</small>
            </div>
            <button
              title="Edit onboarding"
              aria-label="Edit onboarding"
              onClick={() => save({ ...student, onboarded: false })}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setMobile(!mobile)}
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            Your next chapter <ChevronRight size={13} />
            <strong>
              {page === "dashboard"
                ? "Overview"
                : page === "missions"
                  ? "Your missions"
                  : page === "campus"
                    ? "Campus guide"
                    : "Readiness report"}
            </strong>
          </div>
          <div className="top-stats">
            <span>
              <Flame size={17} color="#ce9263" />
              {streak(student)} day streak
            </span>
            <span>
              <Zap size={16} color="#a5904b" />
              {xp} XP
            </span>
            <div className="avatar small-avatar">{student.name[0]}</div>
          </div>
        </header>
        <main>
          {saveError && (
            <div className="demo-notice" role="alert">
              {saveError}
            </div>
          )}
          {page === "dashboard" && (
            <>
              <div className="heading-row">
                <div>
                  <div className="eyebrow">A LITTLE MORE READY, EVERY DAY</div>
                  <h1>
                    Hey {student.name}, you’ve got this{" "}
                    <span className="wave">✳</span>
                  </h1>
                  <p>
                    Your next chapter is getting closer. Let’s make it feel a
                    little more familiar.
                  </p>
                </div>
                <span className="school-pill">
                  <GraduationCap size={17} />
                  {school.shortName} bound
                </span>
              </div>
              <section className="hero">
                <div className="hero-copy">
                  <span className="eyebrow">
                    <span className="live-dot" /> THE COUNTDOWN IS ON
                  </span>
                  <h2>
                    {daysUntil(student.moveIn)} days to a<br />
                    whole new beginning.
                  </h2>
                  <p>
                    You don’t need to know everything.
                    <br />
                    Just practice what comes next.
                  </p>
                  <button className="primary" onClick={() => open(ranked[0])}>
                    Let’s take the next step <ArrowRight size={17} />
                  </button>
                  <span className="hero-note">
                    Small steps. Real-world confidence.
                  </span>
                </div>
                <CampusArt />
                <span className="art-caption">
                  <MapPin size={13} />
                  {school.shortName} · Your next adventure
                </span>
              </section>
              <div className="dashboard-grid">
                <section className="panel readiness">
                  <div className="section-top">
                    <div>
                      <span className="eyebrow">YOUR READINESS</span>
                      <h2>Finding your footing</h2>
                    </div>
                    <div className="score-badge">
                      {score}
                      <span>/100</span>
                    </div>
                  </div>
                  <p className="muted small">
                    A snapshot of your skills. Plenty of room to grow.
                  </p>
                  <div className="skill-list">
                    {categories.map((c, i) => {
                      const Icon = icons[i];
                      return (
                        <div className="skill-row" key={c}>
                          <div>
                            <span>
                              <Icon size={16} />
                              {c}
                            </span>
                            <strong>
                              {student.mastery[c]}
                              <small>%</small>
                            </strong>
                          </div>
                          <div className="progress-track">
                            <span
                              style={{
                                width: `${student.mastery[c]}%`,
                                background: colors[i],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="panel-link" onClick={() => nav("report")}>
                    Explore your readiness <ArrowUpRight size={16} />
                  </button>
                </section>
                <section className="panel next-step">
                  <div className="section-top">
                    <span className="eyebrow">PICKED FOR YOU</span>
                    <Sparkles size={18} />
                  </div>
                  <div className="recommend-icon">
                    <Compass size={33} />
                  </div>
                  <span className="tag">YOUR NEXT BEST STEP</span>
                  <h2>{ranked[0].title}</h2>
                  <p>{ranked[0].description}</p>
                  <div className="why">
                    <span>
                      <Sparkles size={15} /> Why this mission?
                    </span>
                    <p>
                      {ranked[0].category} is an area you can build on. This
                      practice meets you where you are.
                    </p>
                  </div>
                  <button className="primary" onClick={() => open(ranked[0])}>
                    Start mission <ArrowRight size={17} />
                  </button>
                  <div className="mission-meta">
                    <span>{ranked[0].minutes} min</span>
                    <span>+{ranked[0].xp} XP available</span>
                  </div>
                </section>
              </div>
              <div className="section-heading">
                <div>
                  <h2>A little practice goes a long way</h2>
                  <p>Real college moments. A safe space to figure them out.</p>
                </div>
                <button className="text-button" onClick={() => nav("missions")}>
                  All missions <ArrowRight size={16} />
                </button>
              </div>
              <div className="mission-grid">
                {missions.slice(0, 3).map((m) => (
                  <MissionCard
                    key={m.id}
                    mission={m}
                    done={student.attempts.some((a) => a.missionId === m.id)}
                    open={open}
                  />
                ))}
              </div>
              <div className="bottom-note">
                <Leaf size={16} />
                <span>
                  Readiness isn’t about being perfect. It’s about knowing your
                  next move.
                </span>
                <span>Built for your beginning.</span>
              </div>
            </>
          )}
          {page === "missions" && (
            <>
              <div className="eyebrow">PRACTICE FOR THE REAL THING</div>
              <h1>Your next small wins</h1>
              <p className="page-description">
                Ranked for your readiness, concerns, and recent practice. Pick a
                moment and give it a try.
              </p>
              <div className="mission-grid full">
                {ranked.map((m) => (
                  <MissionCard
                    key={m.id}
                    mission={m}
                    done={student.attempts.some((a) => a.missionId === m.id)}
                    open={open}
                  />
                ))}
              </div>
            </>
          )}
          {page === "campus" && (
            <>
              <div className="eyebrow">GET TO KNOW YOUR CAMPUS</div>
              <h1>Your {school.shortName} field guide</h1>
              <p className="page-description">
                Support is part of college. Here’s where to start looking.
              </p>
              <div className="demo-notice">
                Demo knowledge layer: all directory entries, calendar
                descriptions, and guidance below are representative sample data,
                not verified university policies. Confirm with official
                university sources.
              </div>
              <div className="resource-grid guide">
                {school.resources.map((r) => (
                  <article className="panel" key={r.id}>
                    <MapPin size={21} />
                    <h3>{r.name}</h3>
                    <p>{r.description}</p>
                    <small>{r.location}</small>
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noreferrer">
                        Visit university website <ArrowUpRight size={14} />
                      </a>
                    )}
                  </article>
                ))}
              </div>
              <div className="panel campus-details">
                <h2>Before you arrive</h2>
                <p>{school.advisingInfo}</p>
                <p>{school.registrationInfo}</p>
                <p>
                  <strong>Calendar:</strong> {school.academicCalendar}
                </p>
                {school.importantDeadlines.map((d) => (
                  <p key={d.label}>
                    <strong>{d.label}:</strong> {d.date}
                  </p>
                ))}
                {Object.entries(school.terminology).map(([term, meaning]) => (
                  <p key={term}>
                    <strong>{term}:</strong> {meaning}
                  </p>
                ))}
                <button className="primary" onClick={() => open(missions[2])}>
                  Practice finding support <ArrowRight size={17} />
                </button>
              </div>
            </>
          )}
          {page === "report" && (
            <>
              <div className="eyebrow">YOUR FIRSTTERM READINESS</div>
              <h1>Look how far you’re coming.</h1>
              <p className="page-description">
                {
                  [...categories].sort(
                    (a, b) => student.mastery[b] - student.mastery[a],
                  )[0]
                }{" "}
                is your strongest area. Your next opportunity is{" "}
                {[...categories]
                  .sort((a, b) => student.mastery[a] - student.mastery[b])[0]
                  .toLowerCase()}
                .
              </p>
              <div className="report-stats">
                {[
                  [`${score}%`, "Overall readiness"],
                  [
                    new Set(student.attempts.map((a) => a.missionId)).size,
                    "Missions completed",
                  ],
                  [student.attempts.length, "Practice attempts"],
                  [daysUntil(student.moveIn), "Days until move-in"],
                ].map(([value, label]) => (
                  <div className="panel" key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <div className="panel report-table">
                <div className="section-top">
                  <h2>Small steps, measurable growth</h2>
                  <span className="tag">BASELINE → NOW</span>
                </div>
                {categories.map((c, i) => (
                  <details key={c}>
                    <summary>
                      <span>{c}</span>
                      <span className="baseline">{student.baseline[c]}%</span>
                      <strong>{student.mastery[c]}%</strong>
                      <span className="gain">
                        +{student.mastery[c] - student.baseline[c]}
                      </span>
                    </summary>
                    <div className="subskills">
                      {subskills[c].map((s) => (
                        <div key={s}>
                          <span>{s}</span>
                          <strong>{student.subskills[s]}%</strong>
                        </div>
                      ))}
                      <small>
                        Category practice updates its related subskills together
                        in this MVP.
                      </small>
                    </div>
                  </details>
                ))}
              </div>
              <h2 className="spaced">Your practice journal</h2>
              {latest && (
                <p className="muted">
                  Most recently practiced:{" "}
                  {missions.find((m) => m.id === latest.missionId)?.category}.{" "}
                  {Object.entries(latest.changes)
                    .map(([c, n]) => `${c} +${n}`)
                    .join(" · ")}
                  .
                </p>
              )}
              {student.attempts.length === 0 ? (
                <div className="panel empty">
                  <Leaf />
                  <h3>Your story starts with one mission.</h3>
                  <p>Complete a challenge to see your growth here.</p>
                </div>
              ) : (
                <div className="journal">
                  {[...student.attempts].reverse().map((a) => (
                    <div className="panel" key={a.id}>
                      <div className="section-top">
                        <h3>
                          {missions.find((m) => m.id === a.missionId)?.title}
                        </h3>
                        <strong>{a.score}/100</strong>
                      </div>
                      <small>
                        {new Date(a.date).toLocaleDateString()} · +{a.xp} XP
                      </small>
                      <p>{a.feedback[0]}</p>
                      <span className="gain">
                        {Object.entries(a.changes)
                          .map(([c, n]) => `${c} +${n}`)
                          .join(" · ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <h2 className="spaced">Keep your momentum</h2>
              <div className="mission-grid">
                {ranked.slice(0, 3).map((m) => (
                  <MissionCard
                    key={m.id}
                    mission={m}
                    done={false}
                    open={open}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      {active && (
        <div
          className="modal-backdrop"
          onKeyDown={(e) => containDialog(e, () => setActive(null))}
        >
          <section
            className={`modal ${active.id === "scheduler" ? "wide" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <div className="modal-header">
              <span>
                <Compass size={18} />
                {active.title}
              </span>
              <button
                autoFocus
                aria-label="Close mission"
                onClick={() => setActive(null)}
              >
                <X size={21} />
              </button>
            </div>
            {result ? (
              <div className="result">
                <div className="result-icon">
                  <Trophy size={35} />
                </div>
                <span className="eyebrow">PRACTICE MAKES PROGRESS</span>
                <h2>
                  {result.score >= 70
                    ? "That’s a step forward."
                    : "You showed up. Now build on it."}
                </h2>
                <div className="result-score">
                  {result.score}
                  <span>/100</span>
                </div>
                <div className="reward">+{latest?.xp} XP</div>
                <div className="result-feedback">
                  {result.feedback.map((f, i) => (
                    <p key={i}>
                      <Check size={17} />
                      {f}
                    </p>
                  ))}
                </div>
                <div className="improvements">
                  {Object.entries(latest?.changes || {}).map(([c, n]) => (
                    <span key={c}>
                      {c} <strong>+{n}</strong>
                    </span>
                  ))}
                </div>
                <p className="muted small">
                  Progress is earned from your score and improvements over your
                  previous best. Related subskills grow together.
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    setActive(null);
                    nav("report");
                  }}
                >
                  See my progress <ArrowRight size={17} />
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    setResult(null);
                  }}
                >
                  Practice again
                </button>
              </div>
            ) : (
              <div className="modal-body">
                {active.id === "midterm" ? (
                  <Midterm finish={finish} />
                ) : active.id === "scheduler" ? (
                  <Scheduler finish={finish} />
                ) : active.id === "resources" ? (
                  <ResourceHunt university={school} finish={finish} />
                ) : (
                  <EmailChallenge finish={finish} />
                )}
              </div>
            )}
          </section>
        </div>
      )}
      {coach && (
        <div
          className="modal-backdrop"
          onKeyDown={(e) => containDialog(e, () => setCoach(false))}
        >
          <section
            className="modal coach-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Ask FirstTerm"
          >
            <div className="modal-header">
              <span>
                <Sparkles size={19} />
                Ask FirstTerm
              </span>
              <button
                autoFocus
                aria-label="Close coach"
                onClick={() => setCoach(false)}
              >
                <X />
              </button>
            </div>
            <div className="modal-body">
              <span className="tag">OFFLINE GUIDE</span>
              <h2>One small step is enough.</h2>
              <p>
                Start with {ranked[0].title.toLowerCase()}. It builds{" "}
                {ranked[0].category.toLowerCase()}, based on your current
                readiness and concerns.
              </p>
              <div className="feedback">
                Your scores come from your decisions and transparent rubrics.
                This guide works without AI.
              </div>
              <h3>Where do I find school policies?</h3>
              <p>
                {school.registrationInfo} Our campus guide is sample data;
                verify details with your university.
              </p>
              <button
                className="primary"
                onClick={() => {
                  setCoach(false);
                  open(ranked[0]);
                }}
              >
                Try the recommended mission <ArrowRight size={17} />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
function MissionCard({
  mission: m,
  done,
  open,
}: {
  mission: Mission;
  done: boolean;
  open: (m: Mission) => void;
}) {
  const Icon =
    m.id === "midterm"
      ? BookOpen
      : m.id === "scheduler"
        ? CalendarDays
        : m.id === "resources"
          ? Compass
          : Mail;
  return (
    <button className="mission-card" onClick={() => open(m)}>
      <div className={`mission-art ${m.color}`}>
        <div className="art-orbit" />
        <Icon size={45} strokeWidth={1.4} />
        <span className="art-spark">✦</span>
        <span className="mission-level">
          {done ? (
            <>
              <Check size={12} /> Practiced
            </>
          ) : (
            m.difficulty
          )}
        </span>
      </div>
      <div className="mission-content">
        <span className="eyebrow">{m.category}</span>
        <h3>{m.title}</h3>
        <p>{m.description}</p>
        <div className="mission-footer">
          <span>
            {m.minutes} min <span>·</span> +{m.xp} XP
          </span>
          <ArrowUpRight size={18} />
        </div>
      </div>
    </button>
  );
}
function Onboarding({
  initial,
  finish,
}: {
  initial: Student;
  finish: (s: Student) => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initial.name);
  const [school, setSchool] = useState(initial.university);
  const [date, setDate] = useState(initial.moveIn);
  const [concerns, setConcerns] = useState<string[]>(
    concernOptions
      .filter((o) => initial.concerns.includes(o.c))
      .map((o) => o.label),
  );
  const [baseline, setBaseline] = useState(initial.baseline);
  const questions = [
    "Starting a challenging assignment on my own",
    "Planning work around classes and sleep",
    "Asking an instructor for help",
    "Finding the right campus resource",
    "Managing everyday routines",
    "Building connections and setting boundaries",
  ];
  return (
    <div className="onboarding">
      <div className="onboard-brand">
        <GraduationCap /> FirstTerm<span>.</span>
      </div>
      <div className="onboard-layout">
        <div className="onboard-intro">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>
            College is new.
            <br />
            You don’t have to
            <br />
            feel unprepared.
          </h1>
          <p>
            Practice the moments that matter.
            <br />
            Find your people. Find your footing.
          </p>
          <CampusArt />
          <button className="text-button" onClick={() => finish(demoStudent())}>
            Explore as Maya · skip to demo <ArrowRight size={17} />
          </button>
        </div>
        <section className="onboard-form">
          <div className="onboard-steps">
            {["Your campus", "Your concerns", "Your baseline"].map((s, i) => (
              <span key={s} className={step >= i ? "current" : ""}>
                {i + 1}
                <small>{s}</small>
              </span>
            ))}
          </div>
          <span className="eyebrow">STEP {step + 1} OF 3</span>
          <h2>
            {step === 0
              ? "Where are you going to college?"
              : step === 1
                ? "What’s on your mind?"
                : "Let’s find your starting point."}
          </h2>
          <p className="muted">
            {step === 0
              ? "A new place. A whole new set of possibilities."
              : step === 1
                ? "Pick what feels a little unfamiliar. We’ll help you practice."
                : "How confident do you feel? This isn’t a test."}
          </p>
          {step === 0 ? (
            <>
              <label>
                Your first name
                <input
                  value={name}
                  maxLength={40}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <div className="school-options">
                {universities.map((u) => (
                  <button
                    className={school === u.id ? "selected" : ""}
                    key={u.id}
                    onClick={() => setSchool(u.id)}
                  >
                    <GraduationCap size={21} />
                    <span>
                      {u.shortName}
                      <small>{u.name}</small>
                    </span>
                    {school === u.id && <Check size={18} />}
                  </button>
                ))}
              </div>
              <label>
                When do you move in?
                <input
                  type="date"
                  min={localDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
            </>
          ) : step === 1 ? (
            <div className="concern-options">
              {concernOptions.map(({ label, c }) => (
                <button
                  className={concerns.includes(label) ? "selected" : ""}
                  key={label}
                  onClick={() =>
                    setConcerns(
                      concerns.includes(label)
                        ? concerns.filter((x) => x !== label)
                        : [...concerns, label],
                    )
                  }
                >
                  <span>{label}</span>
                  {concerns.includes(label) ? (
                    <Check size={17} />
                  ) : (
                    <PlusIcon />
                  )}
                </button>
              ))}
              <p className="small muted">
                Clubs and research? Start with campus resources.
              </p>
            </div>
          ) : (
            <div className="baseline-questions">
              {categories.map((c, i) => (
                <label key={c}>
                  {questions[i]}
                  <div>
                    <span>Still learning</span>
                    <input
                      aria-label={c}
                      type="range"
                      min="20"
                      max="80"
                      step="1"
                      value={baseline[c]}
                      onChange={(e) =>
                        setBaseline({ ...baseline, [c]: +e.target.value })
                      }
                    />
                    <strong>{baseline[c]}</strong>
                  </div>
                </label>
              ))}
            </div>
          )}
          <div className="onboard-actions">
            {step > 0 && (
              <button className="text-button" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            <button
              className="primary"
              disabled={!name.trim() || !date || date < localDate()}
              onClick={() => {
                if (step < 2) setStep(step + 1);
                else
                  finish({
                    ...demoStudent(),
                    name: name.trim(),
                    university: school,
                    moveIn: date,
                    concerns: [
                      ...new Set(
                        concernOptions
                          .filter((o) => concerns.includes(o.label))
                          .map((o) => o.c),
                      ),
                    ],
                    baseline: { ...baseline },
                    mastery: { ...baseline },
                    subskills: Object.fromEntries(
                      categories.flatMap((c) =>
                        subskills[c].map((s) => [s, baseline[c]]),
                      ),
                    ),
                  });
              }}
            >
              {step === 2 ? "Welcome to FirstTerm" : "Continue"}
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="onboard-footnote">
            <Leaf size={14} /> Your pace. Your progress. Your beginning.
          </div>
        </section>
      </div>
    </div>
  );
}
function PlusIcon() {
  return (
    <span className="muted" aria-hidden="true">
      +
    </span>
  );
}
