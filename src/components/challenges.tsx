"use client";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Plus,
  Trash2,
  CalendarDays,
  Send,
  Search,
} from "lucide-react";
import {
  ActionId,
  recoveryActions,
  scoreRecovery,
  scoreSchedule,
  CalendarBlock,
  tasks,
  commitments,
  exampleSchedule,
  scoreEmail,
  Evaluation,
} from "@/lib/scoring";
import { University } from "@/lib/universities";
export function Midterm({ finish }: { finish: (e: Evaluation) => void }) {
  const [actions, setActions] = useState<ActionId[]>([]);
  const last = recoveryActions.find((a) => a.id === actions.at(-1));
  return (
    <>
      <div className="scenario">
        <span className="eyebrow">WEEK 04 · ACADEMIC RECOVERY</span>
        <h2>A grade is a starting point.</h2>
        <p>
          You got a 48% on your first physics midterm. You thought you
          understood the homework. The next midterm is in 10 days.
        </p>
      </div>
      <div className="step-label">
        <span>Your next move</span>
        <span>{actions.length} / 4 decisions</span>
      </div>
      {last && (
        <div className="feedback" role="status">
          {last.feedback}
          {last.id === "review" &&
            " Office hours now unlocks a more focused conversation."}
        </div>
      )}
      <div className="action-grid">
        {recoveryActions
          .filter((a) => !actions.includes(a.id))
          .map((a) => (
            <button
              key={a.id}
              disabled={actions.length === 4}
              className="choice"
              onClick={() => setActions([...actions, a.id])}
            >
              {a.id === "office" && actions.includes("review")
                ? "Bring three conceptual questions to office hours"
                : a.label}
              <ArrowRight size={17} />
            </button>
          ))}
      </div>
      <button
        className="primary"
        disabled={actions.length < 4}
        onClick={() => finish(scoreRecovery(actions))}
      >
        See my recovery plan <ArrowRight size={17} />
      </button>
    </>
  );
}
export function Scheduler({ finish }: { finish: (e: Evaluation) => void }) {
  const [blocks, setBlocks] = useState<CalendarBlock[]>([]);
  const [task, setTask] = useState("cs");
  const [day, setDay] = useState(0);
  const [start, setStart] = useState(15);
  const [duration, setDuration] = useState(1);
  const [message, setMessage] = useState("");
  function add(t = task, d = day, s = start) {
    if (s + duration > 24) {
      setMessage("Choose a block that finishes by midnight.");
      return;
    }
    setBlocks([
      ...blocks,
      { id: crypto.randomUUID(), task: t, day: d, start: s, duration },
    ]);
    setMessage("Block added. You can remove it from the list below.");
  }
  return (
    <>
      <div className="scenario compact">
        <span className="eyebrow">YOUR TIME, WITH INTENTION</span>
        <h2>A little planning. A lot more breathing room.</h2>
        <p>
          Drag a task into a day, or use the controls. Fixed classes and
          commitments are already on your calendar. Keep 11 pm–7 am free for
          sleep.
        </p>
      </div>
      <div className="task-tray">
        {tasks.map((t) => (
          <button
            className={`task-chip ${task === t.id ? "selected" : ""}`}
            key={t.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}
            onClick={() => setTask(t.id)}
          >
            {t.label}
            <small>
              {blocks
                .filter((b) => b.task === t.id)
                .reduce((n, b) => n + b.duration, 0)}{" "}
              / {t.hours}h · due{" "}
              {["Mon", "Tue", "Wed", "Thu", "Fri"][Math.floor(t.deadline / 24)]}{" "}
              {Math.floor(t.deadline % 24)}:{t.deadline % 1 ? "59" : "00"}
            </small>
          </button>
        ))}
      </div>
      <div className="schedule-controls">
        <label>
          Day
          <select value={day} onChange={(e) => setDay(+e.target.value)}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ),
            )}
          </select>
        </label>
        <label>
          Start
          <select value={start} onChange={(e) => setStart(+e.target.value)}>
            {Array.from({ length: 34 }, (_, i) => 7 + i / 2).map((h) => (
              <option key={h} value={h}>
                {String(Math.floor(h)).padStart(2, "0")}:{h % 1 ? "30" : "00"}
              </option>
            ))}
          </select>
        </label>
        <label>
          Duration
          <select
            value={duration}
            onChange={(e) => setDuration(+e.target.value)}
          >
            {[0.5, 1, 1.5, 2, 3, 6].map((h) => (
              <option key={h} value={h}>
                {h} hours
              </option>
            ))}
          </select>
        </label>
        <button className="primary" onClick={() => add()}>
          <Plus size={16} /> Add block
        </button>
        <button
          className="text-button"
          onClick={() =>
            setBlocks(
              exampleSchedule.map((b) => ({ ...b, id: crypto.randomUUID() })),
            )
          }
        >
          Try a balanced plan
        </button>
      </div>
      <p className="muted small" role="status">
        {message || "Drop a task at the selected start time and duration."}
      </p>
      <div className="calendar">
        {["MON", "TUE", "WED", "THU", "FRI"].map((d, i) => (
          <div
            className="calendar-day"
            key={d}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const t = e.dataTransfer.getData("text/plain");
              if (tasks.some((x) => x.id === t)) add(t, i);
            }}
          >
            <h4>{d}</h4>
            {[...commitments, ...blocks]
              .filter((b) => b.day === i)
              .sort((a, b) => a.start - b.start)
              .map((b) => (
                <div
                  className={`calendar-block ${b.fixed ? "fixed" : ""}`}
                  key={b.id}
                >
                  <small>
                    {Math.floor(b.start)}:{b.start % 1 ? "30" : "00"} ·{" "}
                    {b.duration}h
                  </small>
                  <strong>
                    {tasks.find((t) => t.id === b.task)?.label || b.task}
                  </strong>
                  {!b.fixed && (
                    <button
                      aria-label={`Remove ${b.task} block`}
                      onClick={() =>
                        setBlocks(blocks.filter((x) => x.id !== b.id))
                      }
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
      <button className="primary" onClick={() => finish(scoreSchedule(blocks))}>
        <CalendarDays size={17} /> Evaluate my week
      </button>
    </>
  );
}
const huntQuestions = [
  {
    text: "Calculus isn’t clicking, even after reviewing your notes. Where can you find academic help?",
    category: "tutoring",
  },
  {
    text: "You feel unwell on the morning of an exam. Which campus service handles student health concerns?",
    category: "health",
  },
  {
    text: "You need to find the official add/drop deadline. Which office should you check?",
    category: "registrar",
  },
];
export function ResourceHunt({
  university,
  finish,
}: {
  university: University;
  finish: (e: Evaluation) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const q = huntQuestions[index];
  return (
    <>
      <div className="scenario">
        <span className="eyebrow">
          {university.shortName.toUpperCase()} · RESOURCE {index + 1} OF 3
        </span>
        <h2>{q.text}</h2>
      </div>
      <div className="demo-notice">
        Sample directory for practice. Names and locations are representative;
        confirm services and dates with your university.
      </div>
      <label className="search">
        <Search size={18} />
        <input
          placeholder="Search campus resources"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="resource-grid">
        {university.resources
          .filter((r) =>
            (r.name + " " + r.description)
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((r) => (
            <button
              className={`resource-choice ${selected === r.category ? "selected" : ""}`}
              key={r.id}
              disabled={selected !== null}
              onClick={() => {
                setSelected(r.category);
                setAnswers([...answers, r.category === q.category]);
              }}
            >
              <strong>{r.name}</strong>
              <p>{r.description}</p>
              <small>{r.location}</small>
            </button>
          ))}
      </div>
      {selected && (
        <div className="feedback" role="status">
          {selected === q.category
            ? "That’s the right place to start."
            : `The best match is ${university.resources.find((r) => r.category === q.category)?.name}.`}{" "}
          {q.category === "health"
            ? "Also contact your instructor about the missed exam."
            : ""}
        </div>
      )}
      {selected && (
        <button
          className="primary"
          onClick={() => {
            if (index === 2)
              finish({
                score: Math.round((answers.filter(Boolean).length / 3) * 100),
                feedback: [
                  `${answers.filter(Boolean).length} of 3 resources identified correctly.`,
                  "You practiced locating academic support, health services, and registration information.",
                  "Real-world mission: open your university website, locate the registrar’s calendar, and save your actual add/drop deadline.",
                ],
              });
            else {
              setIndex(index + 1);
              setSelected(null);
              setSearch("");
            }
          }}
        >
          {index === 2 ? "Finish resource hunt" : "Next situation"}
          <ArrowRight size={16} />
        </button>
      )}
    </>
  );
}
export function EmailChallenge({
  finish,
}: {
  finish: (e: Evaluation) => void;
}) {
  const [text, setText] = useState("");
  const result = scoreEmail(text);
  return (
    <>
      <div className="scenario">
        <span className="eyebrow">SELF ADVOCACY · EMAIL PRACTICE</span>
        <h2>A good question opens doors.</h2>
        <p>
          Professor Chen’s office hours conflict with your chemistry lab. You
          need help before Friday. Explain the conflict, describe what you’ve
          tried, and ask for an alternative time.
        </p>
      </div>
      <div className="email-compose">
        <div>
          To: Professor Chen <span>Practice draft · never sent</span>
        </div>
        <textarea
          aria-label="Email to Professor Chen"
          placeholder="Dear Professor Chen,…"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="rubric">
        {result.rubric.map((r) => (
          <span key={r.label} className={r.passed ? "passed" : ""}>
            <Check size={14} />
            {r.label}
          </span>
        ))}
      </div>
      <p className="muted small">
        Feedback uses a transparent wording checklist. No API key required.
      </p>
      <button
        className="primary"
        disabled={!text.trim()}
        onClick={() => finish(result)}
      >
        <Send size={16} /> Evaluate draft
      </button>
    </>
  );
}
