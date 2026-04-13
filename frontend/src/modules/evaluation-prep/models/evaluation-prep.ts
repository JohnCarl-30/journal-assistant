export type EvaluationTheme = {
  id: string;
  title: string;
  summary: string;
  evidence: string[];
};

export type EvaluationQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type EvaluationPrepData = {
  title: string;
  subtitle: string;
  updatedLabel: string;
  sourceSummary: {
    summariesReviewed: number;
    loggedHours: string;
    evidencePoints: number;
  };
  strengths: EvaluationTheme[];
  growthAreas: EvaluationTheme[];
  likelyQuestions: EvaluationQuestion[];
  coachNote: string;
  sourceCaptures: Array<{
    id: string;
    src: string;
    title: string;
    meta: string;
  }>;
};

export function getEvaluationPrepData(): EvaluationPrepData {
  return {
    title: "Supervisor Evaluation Prep",
    subtitle:
      "Turn your recent work into talking points you can explain clearly during the evaluation conversation.",
    updatedLabel: "Prepared from Week 4 and Week 5 drafts",
    sourceSummary: {
      summariesReviewed: 2,
      loggedHours: "62 hrs",
      evidencePoints: 7,
    },
    strengths: [
      {
        id: "ownership",
        title: "Clear ownership of writing-oriented product flows",
        summary:
          "You consistently moved the product toward a cleaner journaling and reporting workflow instead of treating screens as isolated UI tasks.",
        evidence: [
          "Unified the dashboard, daily log, weekly summary, and report builder under one shell.",
          "Restructured the daily log so notes can flow more naturally into summaries and reports.",
        ],
      },
      {
        id: "hierarchy",
        title: "Strong design judgment on hierarchy and clarity",
        summary:
          "You improved readability through typography, spacing, and layout choices rather than relying on more UI chrome.",
        evidence: [
          "Reduced card clutter across the product.",
          "Strengthened the report builder into a document-first canvas.",
        ],
      },
    ],
    growthAreas: [
      {
        id: "backend-depth",
        title: "Deepen backend implementation ownership",
        summary:
          "The product direction is strong, and the next growth step is carrying more of that work through the API and background-job layer.",
        evidence: [
          "Pair frontend progress with deeper API wiring and more backend test coverage.",
          "Practice turning screen requirements into DTOs, route contracts, and job payloads.",
        ],
      },
      {
        id: "handoff",
        title: "Make implementation decisions easier to hand off",
        summary:
          "The work gets even stronger when design rationale is packaged into clearer technical checkpoints for teammates.",
        evidence: [
          "Capture assumptions, scope limits, and next-step risks more explicitly.",
          "Translate visual polish decisions into reusable shared component patterns.",
        ],
      },
    ],
    likelyQuestions: [
      {
        id: "ownership-question",
        question: "What part of the product did you own most directly during the internship?",
        answer:
          "I owned the experience around daily logging, weekly summaries, and report drafting. My focus was making those workflows feel consistent, readable, and grounded in the actual evidence students capture each day.",
      },
      {
        id: "challenge-question",
        question: "What was the hardest product challenge you worked through?",
        answer:
          "The hardest challenge was deciding how much UI chrome the product actually needed. I found that the interface became clearer when I relied on stronger typography, spacing, and a shared shell instead of adding more cards and panels.",
      },
      {
        id: "growth-question",
        question: "If you had another month on the product, what would you improve next?",
        answer:
          "I would deepen the backend integration so the polished frontend flows are backed by a stronger API contract, more realistic generation jobs, and better validation around report-ready content.",
      },
    ],
    coachNote:
      "Keep your answers concrete. Start with the user problem, explain the decision you made, and then point to one visible outcome from the product.",
    sourceCaptures: [
      {
        id: "dashboard",
        src: "/mock/dashboard-reference.png",
        title: "Progress tracker",
        meta: "Useful when explaining how you made the product easier to scan.",
      },
      {
        id: "weekly",
        src: "/mock/weekly-summary-reference.png",
        title: "Weekly narrative",
        meta: "Good evidence for your work on summarization and report prep.",
      },
      {
        id: "report",
        src: "/mock/final-report-reference.png",
        title: "Report builder",
        meta: "Use this when describing the document-first writing workflow.",
      },
    ],
  };
}
