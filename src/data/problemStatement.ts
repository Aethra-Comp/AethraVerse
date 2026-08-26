export interface ProblemStatementData {
  title: string;
  theme: string;
  description: string;
  detailedRequirements: string[];
  submissionInstructions: string[];
}

export const problemStatementData: ProblemStatementData = {
  title: "AI-Powered Vibe-Coding Challenge",
  theme: "Autonomous Agent Orchestration & Interactive Grids",
  description: "Your team is tasked with building an interactive web application that integrates agentic models (such as GPT-4, Claude 3.5, or Gemini 1.5) directly into client layouts. The solution must feature real-time data calculations, low-latency UI responsiveness, and immersive visual styling (such as canvas particles or 3D geometry states).",
  detailedRequirements: [
    "Design a responsive frontend utilizing React + TypeScript + Framer Motion.",
    "Implement an agentic interaction layer where users can query an AI backend or prompt pipeline.",
    "Optimize client loading times and guarantee type safety across data layers.",
    "Build a robust layout conforming to dark mode neon highlight aesthetics."
  ],
  submissionInstructions: [
    "Deploy the live product (e.g. on Vercel, Netlify, or GitHub Pages).",
    "Commit all source files to a public GitHub repository.",
    "Submit the deployment URL and GitHub repository link via the official submission forms.",
    "Prepare a 3-minute pitch demonstrating product architecture and real-time outputs."
  ]
};
