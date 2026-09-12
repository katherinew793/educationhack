export interface CampusResource {
  id: string;
  university: string;
  name: string;
  category: string;
  description: string;
  location: string;
  url: string;
  applicableSituations: string[];
}
export interface University {
  id: string;
  name: string;
  shortName: string;
  academicCalendar: string;
  resources: CampusResource[];
  importantDeadlines: { label: string; date: string; category: string }[];
  terminology: Record<string, string>;
  advisingInfo: string;
  registrationInfo: string;
  demoData: boolean;
}
const resourceSeeds = [
  [
    "tutoring",
    "Tutoring & academic support",
    "Work through difficult concepts and build study strategies.",
    "Struggling with coursework",
  ],
  [
    "health",
    "Student health services",
    "Find the appropriate support when you feel unwell.",
    "Illness before an exam",
  ],
  [
    "advising",
    "Academic advising",
    "Talk through course choices and academic plans.",
    "Course planning",
  ],
  [
    "registrar",
    "Registrar",
    "Find registration information and official academic deadlines.",
    "Add or drop a class",
  ],
  [
    "accessibility",
    "Accessibility services",
    "Discuss accommodations and accessible learning support.",
    "Learning accommodations",
  ],
  [
    "career",
    "Career center",
    "Explore career paths, internships, and applications.",
    "Finding an internship",
  ],
  [
    "research",
    "Undergraduate research",
    "Explore undergraduate research opportunities.",
    "Joining a research group",
  ],
  [
    "safety",
    "Campus safety",
    "Locate campus safety information and assistance.",
    "Campus safety concern",
  ],
  [
    "housing",
    "Housing office",
    "Learn about housing support and residence questions.",
    "Roommate or housing concerns",
  ],
];
function school(
  id: string,
  name: string,
  shortName: string,
  url: string,
): University {
  return {
    id,
    name,
    shortName,
    academicCalendar: "Quarter system (sample)",
    demoData: true,
    resources: resourceSeeds.map(
      ([category, label, description, situation]) => ({
        id: `${id}-${category}`,
        university: id,
        name: `${shortName} ${label}`,
        category,
        description,
        location: "Demo directory · confirm location with university",
        url,
        applicableSituations: [situation],
      }),
    ),
    importantDeadlines: [
      {
        label: "Find your add/drop deadline",
        date: "Check the official calendar for your entry year",
        category: "Registration",
      },
    ],
    terminology: {
      "Office hours": "Scheduled time to ask an instructor questions.",
      "Add/drop": "The period when course enrollment can be changed.",
    },
    advisingInfo:
      "Find your assigned advisor in your student portal before selecting courses.",
    registrationInfo:
      "Use the official university website to confirm registration steps and dates.",
  };
}
export const universities: University[] = [
  school(
    "caltech",
    "California Institute of Technology",
    "Caltech",
    "https://www.caltech.edu/",
  ),
  school(
    "stanford",
    "Stanford University",
    "Stanford",
    "https://www.stanford.edu/",
  ),
  school("generic", "Generic University", "Generic University", ""),
];
