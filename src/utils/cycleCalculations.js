// ═══════════════════════════════════════════════════════════════════════════════
// CYCLE CALCULATIONS - Lógica robusta de cálculo de ciclos
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcula el día actual del ciclo basado en la fecha de inicio del último período
 * NO asume Día 1 automáticamente - calcula el día real basado en fechas
 */
export function calculateCurrentCycleDay(lastPeriodStart, cycleLength = 28) {
  if (!lastPeriodStart) return null;
  
  const today = new Date();
  const startDate = new Date(lastPeriodStart);
  
  // Si la fecha de inicio es en el futuro, algo está mal
  if (startDate > today) return null;
  
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Calcular el día dentro del ciclo actual
  // Importante: diffDays = 0 es Día 1, diffDays = 1 es Día 2, etc.
  const currentDay = diffDays + 1;
  
  return {
    cycleDay: currentDay,
    daysSinceStart: diffDays,
    cycleNumber: Math.floor(diffDays / cycleLength) + 1
  };
}

/**
 * Determina la fase del ciclo basada en el día
 */
export function calculatePhase(cycleDay) {
  if (!cycleDay || cycleDay < 1) return "unknown";
  
  if (cycleDay <= 5) return "menstrual";
  if (cycleDay <= 13) return "follicular";
  if (cycleDay <= 16) return "ovulation";
  return "luteal";
}

/**
 * Genera un ID único para un ciclo basado en su fecha de inicio
 */
export function generateCycleId(startDate) {
  const date = new Date(startDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `cycle_${year}_${month}_${day}`;
}

/**
 * Crea un nuevo objeto de ciclo con estructura completa
 */
export function createCycleSnapshot(startDate, cycleLength = 28, additionalData = {}) {
  const cycleId = generateCycleId(startDate);
  const calculation = calculateCurrentCycleDay(startDate, cycleLength);
  
  return {
    id: cycleId,
    startDate: new Date(startDate).toISOString(),
    cycleLength,
    currentDay: calculation?.cycleDay || 1,
    phase: calculatePhase(calculation?.cycleDay || 1),
    createdAt: new Date().toISOString(),
    isActive: true,
    ...additionalData
  };
}

/**
 * Calcula estadísticas de un ciclo completado
 */
export function calculateCycleStats(cycle, notes = []) {
  if (!cycle) return {};
  
  const cycleNotes = notes.filter(note => note.cycleId === cycle.id);
  
  return {
    totalNotes: cycleNotes.length,
    symptomsLogged: cycleNotes.filter(note => note.tags?.length > 0).length,
    averageMood: cycleNotes.reduce((acc, note) => {
      const mood = note.tags?.find(tag => ['happy', 'sad', 'anxious', 'calm'].includes(tag));
      return mood ? acc + 1 : acc;
    }, 0),
    duration: cycle.endDate ? 
      Math.floor((new Date(cycle.endDate) - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24)) : 
      null
  };
}

/**
 * Determina si un ciclo debe ser marcado como completado
 */
export function shouldCompleteCycle(currentCycleDay, cycleLength) {
  // Si estamos más allá del día esperado del ciclo, probablemente empezó uno nuevo
  return currentCycleDay > cycleLength + 7; // 7 días de gracia para irregularidades
}

/**
 * Función para debugging - muestra información del estado del ciclo
 */
export function debugCycleState(cycle, notes = []) {
  console.group('🔄 Cycle Debug Info');
  console.log('Cycle ID:', cycle?.id);
  console.log('Start Date:', cycle?.startDate);
  console.log('Current Day:', cycle?.currentDay);
  console.log('Phase:', cycle?.phase);
  console.log('Notes Count:', notes.filter(n => n.cycleId === cycle?.id).length);
  console.log('Is Active:', cycle?.isActive);
  console.groupEnd();
}
