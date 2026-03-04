import { useState, useCallback, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import HomeScreen from "./components/HomeScreen";
import JournalScreen from "./components/JournalScreen";
import LilithChatWithTriggers from "./components/LilithChatWithTriggers";
import CycleCalendar from "./components/CycleCalendar";
import ProfileSettings from "./components/ProfileSettings";

// ── STORAGE KEYS ──────────────────────────────────────────────────────────────
const KEYS = {
  PROFILE: "lilith_profile",
  CYCLE: "lilith_cycle",
  CYCLE_HISTORY: "lilith_cycle_history",
  NOTES: "lilith_notes",
  CHANGES: "lilith_changes",
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { }
}

function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) { return fallback; }
}

function computeCycleDay(startDate, cycleLength = 28) {
  const now = new Date();
  const diff = Math.floor((now - new Date(startDate)) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 1;
  return (diff % cycleLength) + 1;
}

function computePhase(day) {
  if (day <= 5) return "menstrual";
  if (day <= 13) return "follicular";
  if (day <= 16) return "ovulation";
  return "luteal";
}

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

// ── DEFAULT STATE — empty, no hardcoded data ──────────────────────────────────
const EMPTY_CYCLE = {
  startDate: null,
  cycleLength: 28,
  cycleDay: null,
  phase: null,
  ovulationDate: null,
  periodEndDate: null,
};

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {

  // ── DATA MIGRATION & LOADING ─────────────────────────────────────────────────
  


  // Load everything from localStorage on first render
  const [profile, setProfileState] = useState(() => load(KEYS.PROFILE, null));

  const [cycle, setCycleState] = useState(() => {
    const stored = load(KEYS.CYCLE, null);
    if (stored?.startDate) {
      const day = computeCycleDay(stored.startDate, stored.cycleLength);
      return { ...stored, cycleDay: day, phase: computePhase(day) };
    }
    return EMPTY_CYCLE;
  });

  const [notes, setNotesState] = useState(() => {
    const loadedNotes = load(KEYS.NOTES, []);
    const loadedCycle = load(KEYS.CYCLE, null);
    
    if (!loadedCycle?.startDate) return loadedNotes;
    
    // Inline migration for initial load (can't use useCallback in useState)
    let migrated = false;
    const migratedNotes = loadedNotes.map(note => {
      if (!note.cycleDay && note.date && loadedCycle.startDate) {
        const noteDate = new Date(note.date);
        const cycleStart = new Date(loadedCycle.startDate);
        const diff = Math.floor((noteDate - cycleStart) / (1000 * 60 * 60 * 24));
        
        if (diff >= 0) {
          const cycleDay = (diff % (loadedCycle.cycleLength || 28)) + 1;
          migrated = true;
          
          return {
            ...note,
            cycleDay,
            cyclePhase: computePhase(cycleDay),
            cycleStartDate: loadedCycle.startDate,
            migrated: true
          };
        }
      }
      return note;
    });
    
    if (migrated) {
      console.log('🔄 Migrated existing notes with cycle context');
      save(KEYS.NOTES, migratedNotes);
    }
    
    return migrated ? migratedNotes : loadedNotes;
  });
  
  const [changes, setChangesState] = useState(() => load(KEYS.CHANGES, []));
  const [cycleHistory, setCycleHistoryState] = useState(() => load(KEYS.CYCLE_HISTORY, []));

  // Navigation
  const [activeNav, setActiveNav] = useState("home");
  const [showSettings, setShowSettings] = useState(false);

  // Persist whenever state changes
  useEffect(() => { if (profile) save(KEYS.PROFILE, profile); }, [profile]);
  useEffect(() => { save(KEYS.CYCLE, cycle); }, [cycle]);
  useEffect(() => { save(KEYS.NOTES, notes); }, [notes]);
  useEffect(() => { save(KEYS.CHANGES, changes); }, [changes]);
  useEffect(() => { save(KEYS.CYCLE_HISTORY, cycleHistory); }, [cycleHistory]);

  // ── SETTERS ────────────────────────────────────────────────────────────────
  const setProfile = useCallback((p) => {
    setProfileState(p);
    save(KEYS.PROFILE, p);
  }, []);

  const setCycle = useCallback((updater) => {
    setCycleState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(KEYS.CYCLE, next);
      return next;
    });
  }, []);

  // ── NOTES ──────────────────────────────────────────────────────────────────
  const addNote = useCallback((note) => {
    setNotesState(prev => {
      const newNote = {
        id: Date.now(),
        date: todayKey(),
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        tags: [],
        // PRESERVE CYCLE CONTEXT: Save the current cycle day at note creation
        cycleDay: cycle?.cycleDay || null,
        cyclePhase: cycle?.phase || null,
        cycleStartDate: cycle?.startDate || null, // For reference/validation
        ...note,
      };
      const next = [...prev, newNote];
      save(KEYS.NOTES, next);
      return next;
    });
  }, [cycle?.cycleDay, cycle?.phase, cycle?.startDate]);

  // Bulk import — used by JournalScreen's import feature
  const addNotes = useCallback((newNotes) => {
    setNotesState(prev => {
      const next = [...prev, ...newNotes];
      save(KEYS.NOTES, next);
      return next;
    });
  }, []);

  const deleteNote = useCallback((id) => {
    setNotesState(prev => {
      const next = prev.filter(n => n.id !== id);
      save(KEYS.NOTES, next);
      return next;
    });
  }, []);

  // ── CHANGES LOG ────────────────────────────────────────────────────────────
  const addChange = useCallback((change) => {
    setChangesState(prev => {
      const next = [...prev, {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric"
        }),
        ...change,
      }];
      save(KEYS.CHANGES, next);
      return next;
    });
  }, []);

  // ── GLOBAL CYCLE EVENTS FROM LILITH ────────────────────────────────────────
  const handleCycleEvent = useCallback((action, data) => {
    switch (action) {

      case "RESET_CYCLE": {
        const newStart = data.fields?.startDate
          ? new Date(data.fields.startDate)
          : new Date();
          
        // IMPROVED DATA MIGRATION: Always save current cycle to history
        if (cycle.startDate) {
          const actualLength = cycle.cycleDay && cycle.cycleDay > 1 
            ? cycle.cycleDay - 1 
            : Math.max(1, Math.floor((newStart - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24)));
            
          const cycleToSave = {
            id: `cycle_${Date.now()}`,
            startDate: cycle.startDate,
            endDate: newStart.toISOString(),
            actualLength: actualLength,
            cycleLength: cycle.cycleLength,
            phase: cycle.phase,
            flow: cycle.flow,
            ovulationDate: cycle.ovulationDate,
            periodEndDate: cycle.periodEndDate,
            archived: true,
            completedAt: new Date().toISOString(),
            // Include cycle statistics for better tracking
            notes: notes.filter(note => 
              note.cycleStartDate === cycle.startDate
            ).length
          };
          
          console.log('📚 Migrating cycle to history:', {
            from: new Date(cycle.startDate).toDateString(),
            to: newStart.toDateString(),
            length: actualLength,
            notesCount: cycleToSave.notes
          });
          
          setCycleHistoryState(prev => {
            const newHistory = [...prev, cycleToSave];
            save(KEYS.CYCLE_HISTORY, newHistory);
            return newHistory;
          });
        }
        
        // Start fresh cycle
        const newCycle = {
          id: `cycle_${Date.now()}`,
          startDate: newStart.toISOString(),
          cycleLength: cycle.cycleLength || 28,
          cycleDay: 1,
          phase: "menstrual",
          flow: data.fields?.flow || null,
          ovulationDate: null,
          periodEndDate: null,
        };
        
        console.log('🌱 Starting new cycle:', newCycle);
        setCycle(newCycle);
        
        addChange({
          text: `New cycle started${data.fields?.flow ? `. Flow: ${data.fields.flow}` : ''}`,
          type: "cycle",
          badge: "New cycle",
        });
        break;
      }

      case "LOG_PERIOD_END": {
        setCycle(prev => ({
          ...prev,
          periodEndDate: new Date().toISOString(),
          phase: "follicular",
        }));
        addChange({
          text: `Period ended. Duration: ${data.fields?.duration || "not specified"}`,
          type: "cycle",
          badge: "Period end",
        });
        break;
      }

      case "LOG_OVULATION": {
        setCycle(prev => ({
          ...prev,
          ovulationDate: new Date().toISOString(),
        }));
        addChange({
          text: `Ovulation logged. Side: ${data.fields?.side || "not specified"}`,
          type: "cycle",
          badge: "Ovulation",
        });
        break;
      }

      case "LOG_SPOTTING":
      case "LOG_FLOW": {
        addChange({
          text: action === "LOG_SPOTTING"
            ? `Spotting logged. Color: ${data.fields?.color || "not specified"}`
            : `Flow logged: ${data.fields?.flow || "not specified"}`,
          type: "cycle",
          badge: action === "LOG_SPOTTING" ? "Spotting" : "Flow",
        });
        break;
      }

      default: break;
    }
  }, [cycle.cycleLength, setCycle, addChange]);

  // ── ONBOARDING COMPLETE ────────────────────────────────────────────────────
  const handleOnboardingComplete = useCallback((p) => {
    setProfile(p);

    const cycleLen =
      p.cycleLength === "short" ? 25 :
        p.cycleLength === "long" ? 35 : 28;

    if (p.lastPeriod) {
      const start = new Date(p.lastPeriod);
      const day = computeCycleDay(start.toISOString(), cycleLen);
      setCycle({
        startDate: start.toISOString(),
        cycleLength: cycleLen,
        cycleDay: day,
        phase: computePhase(day),
        ovulationDate: null,
        periodEndDate: null,
      });
    } else {
      setCycle(prev => ({ ...prev, cycleLength: cycleLen }));
    }
  }, [setProfile, setCycle]);

  // ── RESET — clears everything, goes back to onboarding ────────────────────
  const handleReset = useCallback(() => {
    // Clear main app data
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    
    // Clear report caches
    const reportTypes = ['doctor', 'nutritionist', 'trainer'];
    const userId = profile?.name || 'default_user';
    reportTypes.forEach(type => {
      localStorage.removeItem(`lilith_report_${type}_${userId}`);
    });
    
    setProfileState(null);
    setCycleState(EMPTY_CYCLE);
    setCycleHistoryState([]);
    setNotesState([]);
    setChangesState([]);
    setActiveNav("home");
    setShowSettings(false);
  }, [profile?.name]);

  // ── TODAY'S NOTES for Lilith context ──────────────────────────────────────
  const todayNotes = notes.filter(n => n.date === todayKey());

  // ── SHARED PROPS ───────────────────────────────────────────────────────────
  const sharedProps = {
    profile,
    setProfile,
    cycle,
    cycleHistory,
    notes,
    todayNotes,
    changes,
    addNote,
    addNotes,
    deleteNote,
    addChange,
    activeNav,
    setActiveNav,
    onOpenSettings: () => setShowSettings(true),
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (showSettings) {
    return (
      <ProfileSettings
        {...sharedProps}
        onBack={() => setShowSettings(false)}
        onReset={handleReset}
        setActiveNav={(nav) => { setShowSettings(false); setActiveNav(nav); }}
      />
    );
  }

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
