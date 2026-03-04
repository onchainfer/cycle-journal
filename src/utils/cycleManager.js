// ═══════════════════════════════════════════════════════════════════════════════
// CYCLE MANAGER - Sistema de gestión de ciclos por snapshots independientes
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
 * CLASE PRINCIPAL: CycleManager
 * Gestiona todos los ciclos como snapshots independientes
 */
export class CycleManager {
  constructor() {
    this.currentCycle = null;
    this.cycleHistory = [];
    this.journalEntries = [];
    this.listeners = [];
    
    this.loadData();
  }

  /**
   * Carga datos desde localStorage
   */
  loadData() {
    // Cargar ciclo actual
    this.currentCycle = loadFromStorage(STORAGE_KEYS.CURRENT_CYCLE, null);
    
    // Cargar historial de ciclos
    this.cycleHistory = loadFromStorage(STORAGE_KEYS.CYCLE_HISTORY, []);
    
    // Cargar entradas del journal
    this.journalEntries = loadFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, []);
    
    console.log('🔄 CycleManager loaded:', {
      currentCycle: this.currentCycle?.id,
      historyCount: this.cycleHistory.length,
      journalCount: this.journalEntries.length
    });
  }

  /**
   * Inicializa el primer ciclo basado en el onboarding
   * NO asume Día 1 - calcula el día real basado en la fecha
   */
  initializeFromOnboarding(lastPeriodDate, cycleLength = 28) {
    if (!lastPeriodDate) {
      throw new Error('Last period date is required to initialize cycle');
    }

    const calculation = calculateCurrentCycleDay(lastPeriodDate, cycleLength);
    
    if (!calculation) {
      throw new Error('Unable to calculate cycle day from the provided date');
    }

    // Crear el ciclo inicial con el día calculado
    const initialCycle = createCycleSnapshot(lastPeriodDate, cycleLength, {
      currentDay: calculation.cycleDay,
      daysSinceStart: calculation.daysSinceStart,
      cycleNumber: calculation.cycleNumber,
      source: 'onboarding',
      note: `Initialized from onboarding. Last period: ${new Date(lastPeriodDate).toDateString()}`
    });

    this.currentCycle = initialCycle;
    this.saveCurrentCycle();

    console.log('🌱 Cycle initialized from onboarding:', {
      startDate: new Date(lastPeriodDate).toDateString(),
      currentDay: calculation.cycleDay,
      phase: initialCycle.phase,
      daysSince: calculation.daysSinceStart
    });

    this.notifyListeners('cycle_initialized', { cycle: initialCycle });
    
    return initialCycle;
  }

  /**
   * Inicia un nuevo ciclo - SOLO cuando el usuario confirma período
   * Esta es la única manera de marcar Día 1 explícitamente
   */
  startNewCycle(startDate = null, additionalData = {}) {
    const newStartDate = startDate || new Date().toISOString();
    
    // Si hay un ciclo activo, completarlo y moverlo al historial
    if (this.currentCycle) {
      this.completeCycle(newStartDate);
    }

    // Crear el nuevo ciclo
    const newCycle = createCycleSnapshot(newStartDate, this.currentCycle?.cycleLength || 28, {
      currentDay: 1, // AQUÍ SÍ marcamos Día 1 porque es un inicio confirmado
      source: 'user_confirmed',
      ...additionalData
    });

    this.currentCycle = newCycle;
    this.saveCurrentCycle();

    console.log('🔴 NEW CYCLE STARTED by user confirmation:', {
      startDate: new Date(newStartDate).toDateString(),
      previousCycleCompleted: true
    });

    this.notifyListeners('new_cycle_started', { 
      cycle: newCycle, 
      wasUserInitiated: true 
    });

    return newCycle;
  }

  /**
   * Completa un ciclo y lo mueve al historial
   * FIX CRÍTICO: Asegura que las notas mantengan su referencia al ciclo original
   */
  completeCycle(endDate = null) {
    if (!this.currentCycle) return null;

    const completionDate = endDate || new Date().toISOString();
    
    // FIX CRÍTICO: Verificar que todas las notas del ciclo mantengan su cycleId
    const cycleNotes = this.journalEntries.filter(note => note.cycleId === this.currentCycle.id);
    
    const completedCycle = {
      ...this.currentCycle,
      endDate: completionDate,
      isActive: false,
      completedAt: new Date().toISOString(),
      stats: calculateCycleStats(this.currentCycle, this.journalEntries),
      // FIX CRÍTICO: Metadata para preservar referencias
      notesCount: cycleNotes.length,
      noteIds: cycleNotes.map(n => n.id),
      preservedForPatterns: true
    };

    // Agregar al historial
    this.cycleHistory.push(completedCycle);
    this.saveCycleHistory();

    console.log('✅ Cycle completed and archived - PRESERVED FOR PATTERNS:', {
      cycleId: completedCycle.id,
      duration: completedCycle.stats.duration,
      notes: completedCycle.stats.totalNotes,
      cycleNotes: cycleNotes.length,
      noteIds: completedCycle.noteIds,
      preservedForLilith: true
    });

    this.notifyListeners('cycle_completed', { cycle: completedCycle });
    
    return completedCycle;
  }

  /**
   * Actualiza el día actual del ciclo sin cambiar el ciclo
   * Se ejecuta automáticamente para mantener sincronización
   */
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
      
      // Si el ciclo se ha extendido demasiado, notificar
      if (calculation.cycleDay > this.currentCycle.cycleLength + 7) {
        this.notifyListeners('cycle_extended', { 
          cycle: this.currentCycle,
          suggestNewCycle: true 
        });
      }
    }

    return this.currentCycle;
  }

  /**
   * Agrega una entrada al journal vinculada al ciclo actual
   */
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
      cycleStartDate: this.currentCycle.startDate, // Para referencia
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

    console.log('📝 Journal entry added:', {
      cycleId: journalEntry.cycleId,
      cycleDay: journalEntry.cycleDay,
      phase: journalEntry.cyclePhase
    });

    this.notifyListeners('journal_entry_added', { entry: journalEntry });
    
    return journalEntry;
  }

  /**
   * Obtiene entradas del journal para un ciclo específico
   */
  getJournalEntriesForCycle(cycleId) {
    return this.journalEntries.filter(entry => entry.cycleId === cycleId);
  }

  /**
   * Obtiene un ciclo por ID (actual o del historial)
   */
  getCycleById(cycleId) {
    if (this.currentCycle?.id === cycleId) {
      return this.currentCycle;
    }
    
    return this.cycleHistory.find(cycle => cycle.id === cycleId) || null;
  }

  /**
   * Obtiene todos los ciclos (actual + historial)
   */
  getAllCycles() {
    const cycles = [...this.cycleHistory];
    if (this.currentCycle) {
      cycles.push(this.currentCycle);
    }
    return cycles.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }

  /**
   * Persistencia de datos
   */
  saveCurrentCycle() {
    saveToStorage(STORAGE_KEYS.CURRENT_CYCLE, this.currentCycle);
  }

  saveCycleHistory() {
    saveToStorage(STORAGE_KEYS.CYCLE_HISTORY, this.cycleHistory);
  }

  saveJournalEntries() {
    saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, this.journalEntries);
  }

  /**
   * Sistema de eventos para notificar cambios
   */
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

  /**
   * Debug info
   */
  getDebugInfo() {
    return {
      currentCycle: this.currentCycle,
      cycleHistory: this.cycleHistory,
      journalEntries: this.journalEntries.length,
      lastUpdate: new Date().toISOString()
    };
  }
}

/**
 * Instancia singleton del gestor de ciclos
 */
export const cycleManager = new CycleManager();
