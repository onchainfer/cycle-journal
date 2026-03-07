// ═══════════════════════════════════════════════════════════════════════════════
// CYCLE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculates the current cycle day based on the start date of the last period. 
 * Does NOT automatically assume Day 1—calculates the actual day based on date data.
 */
export function calculateCurrentCycleDay(lastPeriodStart, cycleLength = 28) {
  if (!lastPeriodStart) return null;

  const today = new Date();
  const startDate = new Date(lastPeriodStart);

  if (startDate > today) return null;

  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = diffDays + 1;

  return {
    cycleDay: currentDay,
    daysSinceStart: diffDays,
    cycleNumber: Math.floor(diffDays / cycleLength) + 1
  };
}

/**
 * Cycle phase calculation based on cycle day. This is a simplified model and may not be accurate for everyone, but it provides a general framework for understanding cycle phases.
 */
export function calculatePhase(cycleDay) {
  if (!cycleDay || cycleDay < 1) return "unknown";

  if (cycleDay <= 5) return "menstrual";
  if (cycleDay <= 13) return "follicular";
  if (cycleDay <= 16) return "ovulation";
  return "luteal";
}

/**
 * Unique ID generator for cycles based on start date. This allows us to track cycles even if they are irregular, as the ID is tied to the actual date rather than just a sequential number.
 */
export function generateCycleId(startDate) {
  const date = new Date(startDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `cycle_${year}_${month}_${day}`;
}

/**
 * Creates a new cycle object with a complete structure
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
 * Calculates statistics for a completed cycle
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
 * Determines if a cycle should be marked as completed
 */
export function shouldCompleteCycle(currentCycleDay, cycleLength) {
  // If we are beyond the expected day of the cycle, we likely started a new one
  return currentCycleDay > cycleLength + 7; // 7 days of grace for irregularities
}

/**
 * Function for debugging - displays information about the cycle state
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
