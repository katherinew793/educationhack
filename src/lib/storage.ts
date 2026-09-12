import { categories, demoStudent, Student } from "./model";
export interface StudentRepository {
  load(): Student;
  save(s: Student): void;
  reset(): Student;
}
export const studentRepository: StudentRepository = {
  load() {
    try {
      const raw = localStorage.getItem("firstterm.v1");
      if (raw) {
        const s = JSON.parse(raw);
        if (
          s.version === 1 &&
          typeof s.name === "string" &&
          ["caltech", "stanford", "generic"].includes(s.university) &&
          typeof s.moveIn === "string" &&
          Number.isFinite(Date.parse(s.moveIn)) &&
          Array.isArray(s.attempts) &&
          Array.isArray(s.concerns) &&
          s.subskills &&
          categories.every(
            (c) =>
              Number.isFinite(s.mastery?.[c]) &&
              s.mastery[c] >= 0 &&
              s.mastery[c] <= 100 &&
              Number.isFinite(s.baseline?.[c]),
          )
        )
          return s;
      }
    } catch {}
    return demoStudent(false);
  },
  save(s) {
    localStorage.setItem("firstterm.v1", JSON.stringify(s));
  },
  reset() {
    const s = demoStudent();
    this.save(s);
    return s;
  },
};
