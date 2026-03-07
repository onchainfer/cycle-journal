// ═══════════════════════════════════════════════════════════════════════════════
// APP CONTEXT -
// ═══════════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cycleManager } from '../utils/cycleManager.js';
import { STORAGE_KEYS, saveToStorage, loadFromStorage, hardReset } from '../utils/storageManager.js';
import { calculateCurrentCycleDay, calculatePhase } from '../utils/cycleCalculations.js';

// ── HELPER FUNCTION TO CALCULATE CYCLE ────────────────────────
function calculateHistoricalCycleDay(entryDate, cycleStart, cycleLength = 28) {
  if (!cycleStart || !entryDate) return null;

  const startDate = new Date(cycleStart);
  const noteDate = new Date(entryDate);
  const diff = Math.floor((noteDate - startDate) / (1000 * 60 * 60 * 24));

  if (diff < 0) return null;
  return diff + 1;
}

// ── INITIAL STATE ─────────────────────────────────────────────────────────────
const initialState = {
  // User & Profile
  profile: null,
  language: 'en',

  // Cycle State - UNIFICADO
  currentCycle: null,
  currentCycleDay: null,
  currentPhase: null,
  cycleHistory: [],

  // Journal & Notes
  journalEntries: [],
  notes: [], // Legacy compatibility

  // Health Team & Chat - UNIFICADO
  healthTeam: [],
  chatHistory: [],

  // App State
  changes: [],
  activeNav: 'home',
  showSettings: false,

  // Loading states
  isLoading: false,
  isInitialized: false
};

// ── ACTIONS ───────────────────────────────────────────────────────────────────
const AppActions = {
  // System
  INITIALIZE_APP: 'INITIALIZE_APP',
  SET_LOADING: 'SET_LOADING',
  HARD_RESET: 'HARD_RESET',

  // Profile & User
  SET_PROFILE: 'SET_PROFILE',
  SET_LANGUAGE: 'SET_LANGUAGE',

  // Cycle Management
  SET_CURRENT_CYCLE: 'SET_CURRENT_CYCLE',
  UPDATE_CYCLE_DAY: 'UPDATE_CYCLE_DAY',
  ADD_TO_CYCLE_HISTORY: 'ADD_TO_CYCLE_HISTORY',

  // Journal
  ADD_JOURNAL_ENTRY: 'ADD_JOURNAL_ENTRY',
  DELETE_JOURNAL_ENTRY: 'DELETE_JOURNAL_ENTRY',

  // Health Team & Chat
  SET_HEALTH_TEAM: 'SET_HEALTH_TEAM',
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  CLEAR_CHAT_HISTORY: 'CLEAR_CHAT_HISTORY',

  // Navigation & UI
  SET_ACTIVE_NAV: 'SET_ACTIVE_NAV',
  TOGGLE_SETTINGS: 'TOGGLE_SETTINGS',

  // Changes log
  ADD_CHANGE: 'ADD_CHANGE',

  // Bulk operations
  ADD_MULTIPLE_JOURNAL_ENTRIES: 'ADD_MULTIPLE_JOURNAL_ENTRIES'
};

// ── REDUCER ───────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case AppActions.INITIALIZE_APP:
      return {
        ...state,
        ...action.payload,
        isInitialized: true,
        isLoading: false
      };

    case AppActions.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AppActions.HARD_RESET:
      hardReset();
      return initialState;

    case AppActions.SET_PROFILE:
      if (!state.profile) {
        saveToStorage(STORAGE_KEYS.PROFILE, action.payload);
        return { ...state, profile: action.payload };
      }

      let mergedMedications;
      if (action.payload.medications !== undefined) {
        if (Array.isArray(action.payload.medications) &&
          action.payload.medications.length === 0 &&
          state.profile.medications &&
          state.profile.medications.length > 0) {
          console.warn('⚠️ BLINDAJE ACTIVADO: Intentaron borrar medications, preservando array existente');
          mergedMedications = state.profile.medications;
        } else {
          mergedMedications = action.payload.medications;
        }
      } else {
        mergedMedications = state.profile.medications || [];
      }

      const mergedProfile = {
        ...state.profile,
        ...action.payload,
        name: action.payload.name || state.profile.name,
        onboardingCompleted: action.payload.onboardingCompleted !== undefined
          ? action.payload.onboardingCompleted
          : state.profile.onboardingCompleted,
        medications: mergedMedications
      };

      saveToStorage(STORAGE_KEYS.PROFILE, mergedProfile);
      return { ...state, profile: mergedProfile };

    case AppActions.SET_LANGUAGE:
      saveToStorage(STORAGE_KEYS.LANGUAGE, action.payload);
      return { ...state, language: action.payload };

    case AppActions.SET_CURRENT_CYCLE:
      const cycle = action.payload;
      let cycleDay = null;
      let phase = null;

      if (cycle?.startDate) {
        const calculation = calculateCurrentCycleDay(cycle.startDate, cycle.cycleLength);
        cycleDay = calculation?.cycleDay || null;
        phase = calculatePhase(cycleDay);
      }

      return {
        ...state,
        currentCycle: cycle,
        currentCycleDay: cycleDay,
        currentPhase: phase
      };

    case AppActions.UPDATE_CYCLE_DAY:
      if (!state.currentCycle?.startDate) return state;

      const calculation = calculateCurrentCycleDay(
        state.currentCycle.startDate,
        state.currentCycle.cycleLength || 28
      );
      const realCycleDay = calculation?.cycleDay || null;

      return {
        ...state,
        currentCycleDay: realCycleDay,
        currentPhase: calculatePhase(realCycleDay)
      };

    case AppActions.ADD_TO_CYCLE_HISTORY:
      const newHistory = [...state.cycleHistory, action.payload];
      saveToStorage(STORAGE_KEYS.CYCLE_HISTORY, newHistory);
      return { ...state, cycleHistory: newHistory };

    case AppActions.ADD_JOURNAL_ENTRY:
      const payload = action.payload;
      const isImportedEntry = payload.imported || payload.date !== new Date().toISOString().split('T')[0];

      let entryDate, createdAt, entryCycleDay, entryCyclePhase, entryCycleId;

      if (isImportedEntry && payload.date && payload.createdAt) {
        entryDate = payload.date;
        createdAt = payload.createdAt;
        if (payload.cycleDay) {
          entryCycleDay = payload.cycleDay;
          entryCyclePhase = payload.cyclePhase;
          entryCycleId = payload.cycleId;
        } else if (state.currentCycle?.startDate) {
          entryCycleDay = calculateHistoricalCycleDay(
            entryDate,
            state.currentCycle.startDate,
            state.currentCycle.cycleLength || 28
          );
          entryCyclePhase = calculatePhase(entryCycleDay);
          entryCycleId = state.currentCycle.id;
        }

      } else {
        entryDate = new Date().toISOString().split('T')[0];
        createdAt = new Date().toISOString();

        if (state.currentCycle?.startDate) {
          const today = new Date();
          const startDate = new Date(state.currentCycle.startDate);
          const diffTime = today - startDate;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          entryCycleDay = diffDays + 1;
          entryCyclePhase = calculatePhase(entryCycleDay);
        } else {
          entryCycleDay = state.currentCycleDay;
          entryCyclePhase = state.currentPhase;
        }

        entryCycleId = state.currentCycle?.id || null;
      }

      const cycleDayText = entryCycleDay ? `Day ${entryCycleDay}` : null;

      const entry = {
        ...payload,
        date: entryDate,
        createdAt: createdAt,
        cycleDay: entryCycleDay,
        cycleDayText: cycleDayText,
        cyclePhase: entryCyclePhase,
        cycleId: entryCycleId,
        cycleDayCalculatedAt: new Date().toISOString(),
        cycleDaySource: isImportedEntry ? 'import' : 'realtime_calculation'
      };



      const newEntries = [...state.journalEntries, entry];
      saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, newEntries);

      return {
        ...state,
        journalEntries: newEntries,
        notes: newEntries // Legacy compatibility
      };

    case AppActions.DELETE_JOURNAL_ENTRY:
      const filteredEntries = state.journalEntries.filter(e => e.id !== action.payload);
      saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, filteredEntries);

      return {
        ...state,
        journalEntries: filteredEntries,
        notes: filteredEntries
      };

    case AppActions.SET_HEALTH_TEAM:
      saveToStorage(STORAGE_KEYS.HEALTH_TEAM, action.payload);
      return { ...state, healthTeam: action.payload };

    case AppActions.ADD_CHAT_MESSAGE:
      const newChatHistory = [...state.chatHistory, action.payload];
      saveToStorage(STORAGE_KEYS.CHAT_HISTORY, newChatHistory);
      return { ...state, chatHistory: newChatHistory };

    case AppActions.CLEAR_CHAT_HISTORY:
      saveToStorage(STORAGE_KEYS.CHAT_HISTORY, []);
      return { ...state, chatHistory: [] };

    case AppActions.SET_ACTIVE_NAV:
      return { ...state, activeNav: action.payload };

    case AppActions.TOGGLE_SETTINGS:
      return { ...state, showSettings: !state.showSettings };

    case AppActions.ADD_CHANGE:
      const change = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric"
        }),
        ...action.payload
      };
      const newChanges = [...state.changes, change];
      saveToStorage(STORAGE_KEYS.CHANGES_LOG, newChanges);
      return { ...state, changes: newChanges };

    case AppActions.ADD_MULTIPLE_JOURNAL_ENTRIES:
      const entriesToAdd = action.payload.map(entryData => {
        const isImportedEntry = entryData.imported || entryData.date !== new Date().toISOString().split('T')[0];

        let entryDate, createdAt, bulkCycleDay, bulkCyclePhase, bulkCycleId;

        if (isImportedEntry && entryData.date && entryData.createdAt) {
          entryDate = entryData.date;
          createdAt = entryData.createdAt;

          if (entryData.cycleDay) {
            bulkCycleDay = entryData.cycleDay;
            bulkCyclePhase = entryData.cyclePhase;
            bulkCycleId = entryData.cycleId;
          } else if (state.currentCycle?.startDate) {
            bulkCycleDay = calculateHistoricalCycleDay(
              entryDate,
              state.currentCycle.startDate,
              state.currentCycle.cycleLength || 28
            );
            bulkCyclePhase = calculatePhase(bulkCycleDay);
            bulkCycleId = state.currentCycle.id;
          }
        } else {
          entryDate = new Date().toISOString().split('T')[0];
          createdAt = new Date().toISOString();
          if (state.currentCycle?.startDate) {
            const today = new Date();
            const startDate = new Date(state.currentCycle.startDate);
            const diffTime = today - startDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            bulkCycleDay = diffDays + 1;
            bulkCyclePhase = calculatePhase(bulkCycleDay);
          } else {
            bulkCycleDay = state.currentCycleDay;
            bulkCyclePhase = state.currentPhase;
          }

          bulkCycleId = state.currentCycle?.id || null;
        }
        const bulkCycleDayText = bulkCycleDay ? `Day ${bulkCycleDay}` : null;

        return {
          ...entryData,
          date: entryDate,
          createdAt: createdAt,
          cycleDay: bulkCycleDay,
          cycleDayText: bulkCycleDayText,
          cyclePhase: bulkCyclePhase,
          cycleId: bulkCycleId,
          cycleDayCalculatedAt: new Date().toISOString(),
          cycleDaySource: entryData.imported ? 'bulk_import' : 'bulk_realtime'
        };
      });

      const bulkNewEntries = [...state.journalEntries, ...entriesToAdd];
      saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, bulkNewEntries);

      return {
        ...state,
        journalEntries: bulkNewEntries,
        notes: bulkNewEntries
      };

    default:
      return state;
  }
}

// ── CONTEXT CREATION ──────────────────────────────────────────────────────────
const AppContext = createContext();

// ── PROVIDER COMPONENT ────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ── INITIALIZATION ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function initializeApp() {
      dispatch({ type: AppActions.SET_LOADING, payload: true });

      try {
        await migrateLegacyData();

        const profile = loadFromStorage(STORAGE_KEYS.PROFILE, null);
        const language = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
        const cycleHistory = loadFromStorage(STORAGE_KEYS.CYCLE_HISTORY, []);
        const journalEntries = loadFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, []);
        const healthTeam = loadFromStorage(STORAGE_KEYS.HEALTH_TEAM, []);
        const chatHistory = loadFromStorage(STORAGE_KEYS.CHAT_HISTORY, []);
        const changes = loadFromStorage(STORAGE_KEYS.CHANGES_LOG, []);

        const currentCycle = cycleManager.currentCycle;


        let currentCycleDay = null;
        let currentPhase = null;

        if (currentCycle?.startDate) {
          const calculation = calculateCurrentCycleDay(
            currentCycle.startDate,
            currentCycle.cycleLength || 28
          );
          currentCycleDay = calculation?.cycleDay || null;
          currentPhase = calculatePhase(currentCycleDay);
        }

        dispatch({
          type: AppActions.INITIALIZE_APP,
          payload: {
            profile,
            language,
            currentCycle,
            currentCycleDay,
            currentPhase,
            cycleHistory,
            journalEntries,
            notes: journalEntries,
            healthTeam,
            chatHistory,
            changes
          }
        });

        const hasValidProfile = profile &&
          profile.onboardingCompleted &&
          profile.name &&
          (profile.lastPeriod || profile.lastPeriodDate);
        const hasValidCycle = currentCycle && currentCycle.startDate;

        // Logging detallado para debugging de persistencia
        if (!hasValidProfile) {
          console.warn('⚠️ PERSISTENCE ISSUE: Invalid profile data', {
            hasProfile: !!profile,
            hasOnboardingFlag: profile?.onboardingCompleted,
            hasName: !!profile?.name,
            hasLastPeriod: !!(profile?.lastPeriod || profile?.lastPeriodDate)
          });
        }
        if (!hasValidCycle) {
          console.warn('⚠️ PERSISTENCE ISSUE: No valid currentCycle found');
        }

      } catch (error) {
        console.error('Failed to initialize app:', error);
        dispatch({ type: AppActions.SET_LOADING, payload: false });
      }
    }

    initializeApp();
  }, []);

  useEffect(() => {
    if (state.isInitialized && state.profile) {
      console.log('🔍 Profile state updated:', {
        name: state.profile.name,
        onboardingCompleted: state.profile.onboardingCompleted,
        medications: state.profile.medications?.length || 0,
        timestamp: new Date().toISOString()
      });
    }
  }, [state.profile, state.isInitialized]);

  // ── LEGACY DATA MIGRATION ─────────────────────────────────────────────────
  async function migrateLegacyData() {
    const legacyHealthTeam = loadFromStorage(STORAGE_KEYS.LEGACY_HEALTH_TEAM, []);
    if (legacyHealthTeam.length > 0) {
      saveToStorage(STORAGE_KEYS.HEALTH_TEAM, legacyHealthTeam);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_HEALTH_TEAM);
    }

    // cHAT HISTORY
    const legacyChatHistory = loadFromStorage(STORAGE_KEYS.LEGACY_CHAT_HISTORY, []);
    if (legacyChatHistory.length > 0) {
      saveToStorage(STORAGE_KEYS.CHAT_HISTORY, legacyChatHistory);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_CHAT_HISTORY);
    }
  }

  // ── CONTEXT VALUE ─────────────────────────────────────────────────────────
  const contextValue = {
    // State
    ...state,

    // Actions
    dispatch,
    AppActions,

    // Computed values
    todayKey: () => new Date().toISOString().split('T')[0],
    todayNotes: state.journalEntries.filter(n =>
      n.date === new Date().toISOString().split('T')[0]
    ),

    // Helper functions
    performHardReset: () => dispatch({ type: AppActions.HARD_RESET }),
    updateCycleDay: () => dispatch({ type: AppActions.UPDATE_CYCLE_DAY }),

    // Journal functions
    addNote: (note) => dispatch({ type: AppActions.ADD_JOURNAL_ENTRY, payload: note }),
    addNotes: (notes) => dispatch({ type: AppActions.ADD_MULTIPLE_JOURNAL_ENTRIES, payload: notes }),
    deleteNote: (id) => dispatch({ type: AppActions.DELETE_JOURNAL_ENTRY, payload: id })
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// ── CUSTOM HOOK ───────────────────────────────────────────────────────────────
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
