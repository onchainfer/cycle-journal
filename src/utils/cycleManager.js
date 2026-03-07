// ═══════════════════════════════════════════════════════════════════════════════
// CYCLE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

import {
  calculateCurrentCycleDay,
  calculatePhase,
  generateCycleId,
  createCycleSnapshot,
  calculateCycleStats
} from './cycleCalculations.js';

import {
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage
} from './storageManager.js';

/**
 * MAIN CLASS: CycleManager
 * Cycles as independent snapshots
 */
export class CycleManager {
  constructor() {
    this.currentCycle = null;
    this.cycleHistory = [];
    this.journalEntries = [];
    this.listeners = [];

    this.loadData();
  }


  loadData() {
    this.currentCycle = loadFromStorage(STORAGE_KEYS.CURRENT_CYCLE, null);
    this.cycleHistory = loadFromStorage(STORAGE_KEYS.CYCLE_HISTORY, []);
    this.journalEntries = loadFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, []);
  }

  initializeFromOnboarding(lastPeriodDate, cycleLength = 28) {
    if (!lastPeriodDate) {
      throw new Error('Last period date is required to initialize cycle');
    }

    const calculation = calculateCurrentCycleDay(lastPeriodDate, cycleLength);

    if (!calculation) {
      throw new Error('Unable to calculate cycle day from the provided date');
    }

    const initialCycle = createCycleSnapshot(lastPeriodDate, cycleLength, {
      currentDay: calculation.cycleDay,
      daysSinceStart: calculation.daysSinceStart,
      cycleNumber: calculation.cycleNumber,
      source: 'onboarding',
      note: `Initialized from onboarding. Last period: ${new Date(lastPeriodDate).toDateString()}`
    });

    this.currentCycle = initialCycle;
    this.saveCurrentCycle();
    this.notifyListeners('cycle_initialized', { cycle: initialCycle });

    return initialCycle;
  }
  startNewCycle(startDate = null, additionalData = {}) {
    const newStartDate = startDate || new Date().toISOString();
    if (this.currentCycle) {
      this.completeCycle(newStartDate);
    }

    const newCycle = createCycleSnapshot(newStartDate, this.currentCycle?.cycleLength || 28, {
      currentDay: 1,
      source: 'user_confirmed',
      ...additionalData
    });

    this.currentCycle = newCycle;
    this.saveCurrentCycle();
    this.notifyListeners('new_cycle_started', {
      cycle: newCycle,
      wasUserInitiated: true
    });

    return newCycle;
  }
  completeCycle(endDate = null) {
    if (!this.currentCycle) return null;

    const completionDate = endDate || new Date().toISOString();
    const cycleNotes = this.journalEntries.filter(note => note.cycleId === this.currentCycle.id);
    const completedCycle = {
      ...this.currentCycle,
      endDate: completionDate,
      isActive: false,
      completedAt: new Date().toISOString(),
      stats: calculateCycleStats(this.currentCycle, this.journalEntries),
      notesCount: cycleNotes.length,
      noteIds: cycleNotes.map(n => n.id),
      preservedForPatterns: true
    };

    this.cycleHistory.push(completedCycle);
    this.saveCycleHistory();
    this.notifyListeners('cycle_completed', { cycle: completedCycle });

    return completedCycle;
  }

  updateCurrentDay() {
    if (!this.currentCycle) return null;

    const calculation = calculateCurrentCycleDay(
      this.currentCycle.startDate,
      this.currentCycle.cycleLength
    );

    if (calculation) {
      this.currentCycle.currentDay = calculation.cycleDay;
      this.currentCycle.phase = calculatePhase(calculation.cycleDay);
      this.currentCycle.daysSinceStart = calculation.daysSinceStart;
      this.currentCycle.updatedAt = new Date().toISOString();

      this.saveCurrentCycle();
      if (calculation.cycleDay > this.currentCycle.cycleLength + 7) {
        this.notifyListeners('cycle_extended', {
          cycle: this.currentCycle,
          suggestNewCycle: true
        });
      }
    }

    return this.currentCycle;
  }

  addJournalEntry(entry) {
    if (!this.currentCycle) {
      console.warn('No active cycle to attach journal entry to');
      return null;
    }

    const journalEntry = {
      id: `entry_${Date.now()}`,
      cycleId: this.currentCycle.id,
      cycleDay: this.currentCycle.currentDay,
      cyclePhase: this.currentCycle.phase,
      cycleStartDate: this.currentCycle.startDate,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }),
      createdAt: new Date().toISOString(),
      ...entry
    };

    this.journalEntries.push(journalEntry);
    this.saveJournalEntries();
    this.notifyListeners('journal_entry_added', { entry: journalEntry });

    return journalEntry;
  }

  getJournalEntriesForCycle(cycleId) {
    return this.journalEntries.filter(entry => entry.cycleId === cycleId);
  }

  getCycleById(cycleId) {
    if (this.currentCycle?.id === cycleId) {
      return this.currentCycle;
    }

    return this.cycleHistory.find(cycle => cycle.id === cycleId) || null;
  }

  getAllCycles() {
    const cycles = [...this.cycleHistory];
    if (this.currentCycle) {
      cycles.push(this.currentCycle);
    }
    return cycles.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }

  saveCurrentCycle() {
    saveToStorage(STORAGE_KEYS.CURRENT_CYCLE, this.currentCycle);
  }

  saveCycleHistory() {
    saveToStorage(STORAGE_KEYS.CYCLE_HISTORY, this.cycleHistory);
  }

  saveJournalEntries() {
    saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, this.journalEntries);
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.warn('Error in cycle listener:', error);
      }
    });
  }

  getDebugInfo() {
    return {
      currentCycle: this.currentCycle,
      cycleHistory: this.cycleHistory,
      journalEntries: this.journalEntries.length,
      lastUpdate: new Date().toISOString()
    };
  }
}

export const cycleManager = new CycleManager();
