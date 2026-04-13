export type ReportSection = {
  id: string;
  title: string;
  state: "done" | "active" | "next";
};

export type ReportBlock = {
  id: string;
  heading: string;
  text: string;
};

export type ReferenceGroup = {
  id: string;
  label: string;
  items: Array<{
    id: string;
    label: string;
    value: string;
  }>;
};

export type FinalReportData = {
  saveState: string;
  wordCount: number;
  intro: string;
  sections: ReportSection[];
  activeSection: string;
  assistantActions: string[];
  sourceCaptures: Array<{
    id: string;
    src: string;
    title: string;
    meta: string;
  }>;
  blocks: ReportBlock[];
  referenceGroups: ReferenceGroup[];
};

export function getFinalReportData(): FinalReportData {
  return {
    saveState: "Saved just now",
    wordCount: 1382,
    intro:
      "Shape weekly logs into a polished internship narrative with a clear structure, stronger transitions, and school-ready tone.",
    sections: [
      { id: "introduction", title: "Introduction", state: "done" },
      { id: "company-profile", title: "Company Profile", state: "done" },
      { id: "narrative", title: "Internship Narrative", state: "active" },
      { id: "conclusion", title: "Conclusion", state: "next" },
    ],
    activeSection: "Internship Narrative",
    assistantActions: [
      "Insert from weekly summaries",
      "Draft section",
      "Rewrite formally",
    ],
    sourceCaptures: [
      {
        id: "weekly-source",
        src: "/mock/weekly-summary-reference.png",
        title: "Weekly recap source",
        meta: "Narrative draft ready to be folded into this section.",
      },
      {
        id: "daily-source",
        src: "/mock/daily-log-reference.png",
        title: "Daily log evidence",
        meta: "Screens and notes backing the work described here.",
      },
    ],
    blocks: [
      {
        id: "context",
        heading: "Context",
        text:
          "During my internship at TechFlow Solutions Inc., I worked on a journal assistant product designed to help students document daily progress, generate weekly summaries, and prepare final internship reports more efficiently.",
      },
      {
        id: "responsibilities",
        heading: "Key responsibilities",
        text:
          "My responsibilities included translating product goals into interface layouts, improving writing flows for daily logs and report drafting, and refining the overall design system so the experience felt calm, readable, and credible for academic use.",
      },
      {
        id: "growth",
        heading: "Growth and reflection",
        text:
          "This work strengthened my understanding of interface hierarchy, writing-oriented product design, and how design systems can support both operational workflows and long-form documentation without becoming visually noisy.",
      },
    ],
    referenceGroups: [
      {
        id: "internship",
        label: "Internship",
        items: [
          { id: "company", label: "Company", value: "TechFlow Solutions Inc." },
          { id: "role", label: "Role", value: "Product Design Intern" },
        ],
      },
      {
        id: "hours",
        label: "Hours",
        items: [
          { id: "total-hours", label: "Total Hours", value: "300 / 300 hrs" },
          { id: "weekly-average", label: "Weekly Average", value: "24.5 hrs" },
        ],
      },
      {
        id: "people",
        label: "People",
        items: [
          { id: "supervisor", label: "Supervisor", value: "Maria Santos, Lead Eng." },
          { id: "student", label: "Student", value: "Alex Dela Cruz" },
        ],
      },
      {
        id: "dates",
        label: "Dates",
        items: [
          { id: "start", label: "Start Date", value: "Mar 9, 2026" },
          { id: "end", label: "End Date", value: "May 29, 2026" },
        ],
      },
    ],
  };
}
