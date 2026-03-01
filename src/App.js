import { useState, useCallback } from "react";
import Onboarding from "./components/Onboarding";
import HomeScreen from "./components/HomeScreen";
import JournalScreen from "./components/JournalScreen";
import LilithChatWithTriggers from "./components/LilithChatWithTriggers";
import CycleCalendar from "./components/CycleCalendar";
import ProfileSettings from "./components/ProfileSettings";

// ── GLOBAL CYCLE STATE ────────────────────────────────────────────────────────
// This is the single source of truth for cycle data.
// All screens read from here. Lilith writes to here via onCycleEvent.

const DEFAULT_CYCLE = {
  startDate: new Date(2026, 1, 4), // Feb 4 — for demo
  cycleLength: 28,
  cycleDay: 25,
  phase: "luteal",
  ovulationDate: null,
  periodEndDate: null,
  notes: [],              // all daily notes across the app
  changes: [],            // medication / lifestyle change log
};

function computeCycleDay(startDate) {
  const now = new Date();
  const diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, (diff % 28) + 1);
}

function computePhase(day) {
  if (day <= 5) return "menstrual";
  if (day <= 13) return "follicular";
  if (day <= 16) return "ovulation";
  return "luteal";
}

export default function App() {
  // ── AUTH / ONBOARDING ──────────────────────────────────────────────────────
  const [profile, setProfile] = useState(null);

  // ── NAVIGATION ─────────────────────────────────────────────────────────────
  const [activeNav, setActiveNav] = useState("home");
  const [showSettings, setShowSettings] = useState(false);

  // ── CYCLE STATE ─────────────────────────────────────────────────────────────
  const [cycle, setCycle] = useState(DEFAULT_CYCLE);

  // ── NOTES (shared across Home + Journal) ───────────────────────────────────
  const [notes, setNotes] = useState([
    { id: 1, date: "2026-02-28", time: "8:12 AM", text: "Woke up with that heavy hormonal exhaustion. I know how to tell the difference now.", tags: ["physical", "emotional"] },
    { id: 2, date: "2026-02-28", time: "11:45 AM", text: "Headache behind my eyes. Drank water.", tags: ["physical"] },
    { id: 3, date: "2026-02-28", time: "2:30 PM", text: "Intense sugar cravings. Ate fruit but it wasn't enough.", tags: ["physical", "energy"] },
  ]);

  const addNote = useCallback((note) => {
    setNotes(prev => [...prev, {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ...note,
    }]);
  }, []);

  // ── GLOBAL CYCLE EVENTS from Lilith ────────────────────────────────────────
  // Called when Lilith detects and confirms a global cycle trigger.
  const handleCycleEvent = useCallback((action, data) => {
    setCycle(prev => {
      switch (action) {

        case "RESET_CYCLE": {
          // New period started → reset everything
          const newStart = data.fields?.startDate
            ? new Date(data.fields.startDate)
            : new Date();
          const newDay = computeCycleDay(newStart);
          return {
            ...prev,
            startDate: newStart,
            cycleDay: 1,
            phase: "menstrual",
            ovulationDate: null,
            periodEndDate: null,
            changes: [...prev.changes, {
              id: Date.now(),
              date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              text: `New cycle started. Flow: ${data.fields?.flow || "not specified"}`,
              type: "cycle",
              badge: "New cycle",
            }],
          };
        }

        case "LOG_PERIOD_END": {
          return {
            ...prev,
            periodEndDate: new Date(),
            phase: "follicular",
            changes: [...prev.changes, {
              id: Date.now(),
              date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              text: `Period ended. Duration: ${data.fields?.duration || "not specified"}`,
              type: "cycle",
              badge: "Period end",
            }],
          };
        }

        case "LOG_OVULATION": {
          return {
            ...prev,
            ovulationDate: new Date(),
            changes: [...prev.changes, {
              id: Date.now(),
              date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              text: `Ovulation logged. Side: ${data.fields?.side || "not specified"}`,
              type: "cycle",
              badge: "Ovulation",
            }],
          };
        }

        case "LOG_SPOTTING":
        case "LOG_FLOW": {
          return {
            ...prev,
            changes: [...prev.changes, {
              id: Date.now(),
              date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              text: action === "LOG_SPOTTING"
                ? `Spotting logged. Color: ${data.fields?.color || "not specified"}`
                : `Flow logged: ${data.fields?.flow || "not specified"}`,
              type: "cycle",
              badge: action === "LOG_SPOTTING" ? "Spotting" : "Flow",
            }],
          };
        }

        default:
          return prev;
      }
    });
  }, []);

  // ── ONBOARDING ─────────────────────────────────────────────────────────────
  if (!profile) {
    return (
      <Onboarding
        onComplete={(p) => {
          setProfile(p);
          // If user gave cycle info, seed cycle state
          if (p.lastPeriod) {
            const start = new Date(p.lastPeriod);
            const day = computeCycleDay(start);
            setCycle(prev => ({
              ...prev,
              startDate: start,
              cycleDay: day,
              phase: computePhase(day),
              cycleLength: p.cycleLength === "short" ? 25
                : p.cycleLength === "long" ? 35
                  : 28,
            }));
          }
        }}
      />
    );
  }

  // ── SETTINGS ───────────────────────────────────────────────────────────────
  if (showSettings) {
    return (
      <ProfileSettings
        profile={profile}
        cycle={cycle}
        onBack={() => setShowSettings(false)}
        activeNav={activeNav}
        setActiveNav={(nav) => { setShowSettings(false); setActiveNav(nav); }}
      />
    );
  }

  // ── MAIN APP ───────────────────────────────────────────────────────────────
  const sharedProps = {
    profile,
    cycle,
    notes,
    addNote,
    activeNav,
    setActiveNav,
    onOpenSettings: () => setShowSettings(true),
  };

  switch (activeNav) {
    case "home":
      return <HomeScreen {...sharedProps} />;

    case "journal":
      return <JournalScreen {...sharedProps} />;

    case "lilith":
      return (
        <LilithChatWithTriggers
          {...sharedProps}
          onCycleEvent={handleCycleEvent}
        />
      );

    case "calendar":
      return <CycleCalendar {...sharedProps} />;

    default:
      return <HomeScreen {...sharedProps} />;
  }
}