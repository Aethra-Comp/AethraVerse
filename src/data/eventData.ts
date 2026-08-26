export interface EventData {
  title: string;
  date: string;
  startTime: string;
  teamSize: string;
  registrationLimit: string;
  prizePool: string;
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  certificates: {
    special: string[];
    all: string;
  };
  problemStatementReveal: {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM:SS
    timezone: string;
  };
}

export const eventData: EventData = {
  title: "AethraVerse Hackathon — AI-powered / Vibe-Coding Hackathon",
  date: "4th September 2026",
  startTime: "1:30 PM IST",
  teamSize: "2 members",
  registrationLimit: "First 30 teams",
  prizePool: "₹4,000",
  prizes: {
    first: "₹2,000",
    second: "₹1,000",
    third: "₹1,000",
  },
  certificates: {
    special: ["Best AI Integration", "Best UI/UX"],
    all: "All participants",
  },
  problemStatementReveal: {
    date: "2026-09-04",
    time: "13:30:00",
    timezone: "Asia/Kolkata",
  },
};
