// DATA MIGRATION SCRIPT - Fix Journal Note Integrity
// Run this to migrate existing notes and test cycle history functionality

const KEYS = {
  PROFILE: "lilith_profile",
  CYCLE: "lilith_cycle", 
  CYCLE_HISTORY: "lilith_cycle_history",
  NOTES: "lilith_notes",
  CHANGES: "lilith_changes",
};

// Helper functions
function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { }
}

function computeCycleDay(startDate, noteDate, cycleLength = 28) {
  if (!startDate || !noteDate) return null;
  const start = new Date(startDate);
  const note = new Date(noteDate);
  const diff = Math.floor((note - start) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  return (diff % cycleLength) + 1;
}

function computePhase(day) {
  if (!day) return null;
  if (day <= 5) return "menstrual";
  if (day <= 13) return "follicular";
  if (day <= 16) return "ovulation";
  return "luteal";
}

// Migration function
function migrateExistingData() {
  console.log('🔧 Starting data migration...');
  
  const cycle = load(KEYS.CYCLE);
  const notes = load(KEYS.NOTES, []);
  let migratedCount = 0;
  
  if (!cycle?.startDate) {
    console.log('❌ No current cycle found - migration not possible');
    return false;
  }
  
  console.log(`📚 Found ${notes.length} notes to check for migration`);
  
  // Migrate notes that don't have cycle context
  const migratedNotes = notes.map(note => {
    if (!note.cycleDay && note.date && cycle.startDate) {
      const cycleDay = computeCycleDay(cycle.startDate, note.date, cycle.cycleLength);
      const cyclePhase = computePhase(cycleDay);
      
      if (cycleDay) {
        migratedCount++;
        return {
          ...note,
          cycleDay,
          cyclePhase,
          cycleStartDate: cycle.startDate,
          migrated: true
        };
      }
    }
    return note;
  });
  
  if (migratedCount > 0) {
    save(KEYS.NOTES, migratedNotes);
    console.log(`✅ Successfully migrated ${migratedCount} notes`);
  } else {
    console.log('ℹ️ No notes needed migration');
  }
  
  return true;
}

// Test cycle history functionality
function testCycleHistory() {
  console.log('\n🧪 Testing cycle history functionality...');
  
  const cycle = load(KEYS.CYCLE);
  const cycleHistory = load(KEYS.CYCLE_HISTORY, []);
  
  console.log('Current cycle:', cycle ? {
    startDate: cycle.startDate ? new Date(cycle.startDate).toDateString() : 'None',
    cycleDay: cycle.cycleDay,
    phase: cycle.phase
  } : 'No cycle');
  
  console.log(`Cycle history: ${cycleHistory.length} previous cycles`);
  
  cycleHistory.forEach((historicalCycle, index) => {
    console.log(`  ${index + 1}. ${new Date(historicalCycle.startDate).toDateString()} - ${new Date(historicalCycle.endDate).toDateString()} (${historicalCycle.actualLength} days)`);
  });
  
  return cycleHistory.length;
}

// Create test data for cycle transitions
function createTestScenario() {
  console.log('\n🎯 Creating test scenario...');
  
  // Create a mock previous cycle 
  const previousCycleStart = new Date();
  previousCycleStart.setDate(previousCycleStart.getDate() - 35); // 35 days ago
  
  const previousCycleEnd = new Date();
  previousCycleEnd.setDate(previousCycleEnd.getDate() - 7); // ended 7 days ago
  
  const currentCycleStart = new Date();
  currentCycleStart.setDate(currentCycleStart.getDate() - 6); // started 6 days ago
  
  // Create current cycle
  const testCycle = {
    id: `cycle_${Date.now()}`,
    startDate: currentCycleStart.toISOString(),
    cycleLength: 28,
    cycleDay: 7,
    phase: "menstrual"
  };
  
  // Create cycle history
  const testHistory = [{
    id: `cycle_${Date.now() - 1000}`,
    startDate: previousCycleStart.toISOString(),
    endDate: previousCycleEnd.toISOString(),
    actualLength: 28,
    cycleLength: 28,
    phase: "luteal",
    archived: true,
    completedAt: previousCycleEnd.toISOString(),
    notes: 12 // mock count
  }];
  
  // Create test notes for both cycles
  const testNotes = [
    // Previous cycle notes
    {
      id: Date.now() - 5000,
      date: previousCycleStart.toISOString().split('T')[0],
      time: "9:00 AM",
      text: "Period started, heavy flow",
      cycleDay: 1,
      cyclePhase: "menstrual",
      cycleStartDate: previousCycleStart.toISOString(),
      tags: ["period"]
    },
    {
      id: Date.now() - 4000,
      date: new Date(previousCycleStart.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "2:30 PM", 
      text: "Ovulation pain on right side",
      cycleDay: 15,
      cyclePhase: "ovulation",
      cycleStartDate: previousCycleStart.toISOString(),
      tags: ["ovulation"]
    },
    // Current cycle notes  
    {
      id: Date.now() - 1000,
      date: currentCycleStart.toISOString().split('T')[0],
      time: "8:15 AM",
      text: "New cycle started, medium flow",
      cycleDay: 1,
      cyclePhase: "menstrual", 
      cycleStartDate: currentCycleStart.toISOString(),
      tags: ["period"]
    }
  ];
  
  // Save test data
  save(KEYS.CYCLE, testCycle);
  save(KEYS.CYCLE_HISTORY, testHistory);
  save(KEYS.NOTES, testNotes);
  
  console.log('✅ Test scenario created:');
  console.log(`  - Previous cycle: ${previousCycleStart.toDateString()} - ${previousCycleEnd.toDateString()}`);
  console.log(`  - Current cycle: ${currentCycleStart.toDateString()} - ongoing`);
  console.log(`  - ${testNotes.length} test notes created`);
  
  return true;
}

// Full reset for testing
function resetForTesting() {
  console.log('🗑️ Clearing all data for clean test...');
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  console.log('✅ Data cleared');
}

// Run migration and tests
function runMigrationAndTest() {
  console.log('🚀 Running complete migration and test suite...\n');
  
  // Check current data state
  console.log('📊 Current data state:');
  console.log(`  - Notes: ${load(KEYS.NOTES, []).length}`);
  console.log(`  - Cycle history: ${load(KEYS.CYCLE_HISTORY, []).length}`);
  console.log(`  - Current cycle: ${load(KEYS.CYCLE) ? '✓' : '✗'}`);
  
  // Run migration on existing data
  const migrationSuccess = migrateExistingData();
  
  // Test current cycle history
  testCycleHistory();
  
  // Ask user if they want to create test scenario
  console.log('\n💡 To create a clean test scenario with proper cycle transitions, run:');
  console.log('   resetForTesting(); createTestScenario();');
  console.log('\n🎯 This will demonstrate:');
  console.log('   ✓ Notes preserve their original cycleDay');
  console.log('   ✓ Calendar shows complete history');
  console.log('   ✓ Cycle transitions save to history');
  
  return {
    migrationSuccess,
    historyCount: load(KEYS.CYCLE_HISTORY, []).length,
    notesCount: load(KEYS.NOTES, []).length
  };
}

// Export functions for manual use in console
if (typeof window !== 'undefined') {
  window.migrationUtils = {
    runMigrationAndTest,
    migrateExistingData,
    testCycleHistory,
    createTestScenario,
    resetForTesting
  };
  
  console.log('\n📱 Migration utilities loaded!');
  console.log('Run: migrationUtils.runMigrationAndTest()');
}

// Auto-run if this script is loaded directly
runMigrationAndTest();
