// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export const STORAGE_KEYS = {
  // User Profile
  PROFILE: 'lilith_profile',
  LANGUAGE: 'lilith_language',

  // Cycle System
  CURRENT_CYCLE: 'lilith_current_cycle',
  CYCLE_HISTORY: 'lilith_cycle_history',

  // Journal & Notes
  JOURNAL_ENTRIES: 'lilith_journal_entries',
  NOTES: 'lilith_notes', // Legacy key

  // Health Team & Chat 
  HEALTH_TEAM: 'lilith_health_team',
  CHAT_HISTORY: 'lilith_chat_history',
  LILITH_MEMORY: 'lilith_memory',

  // App State
  CHANGES_LOG: 'lilith_changes',
  USER_PREFERENCES: 'lilith_preferences',

  // Migration flags
  MIGRATION_V2: 'migration_cycle_snapshots_v2',

  LEGACY_HEALTH_TEAM: 'healthTeam',
  LEGACY_CHAT_HISTORY: 'chatHistory'
};


export function saveToStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn(`Failed to save to localStorage [${key}]:`, error);
    return false;
  }
}

export function loadFromStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.warn(`Failed to load from localStorage [${key}]:`, error);
    return fallback;
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove from localStorage [${key}]:`, error);
    return false;
  }
}

/**
 * HARD RESET ATÓMICO - localStorage.clear() 
 */
export function hardReset() {
  localStorage.clear();
  setTimeout(() => {
    window.location.reload();
  }, 100);
}


export function softReset() {
  const keysToRemove = [
    STORAGE_KEYS.CYCLE_HISTORY,
    STORAGE_KEYS.CURRENT_CYCLE,
    STORAGE_KEYS.JOURNAL_ENTRIES,
    STORAGE_KEYS.NOTES,
    STORAGE_KEYS.CHANGES_LOG
  ];

  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      removeFromStorage(key);
    }
  });
}


export function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupKey = `backup_${timestamp}`;

  const allData = {};
  Object.values(STORAGE_KEYS).forEach(key => {
    const data = loadFromStorage(key);
    if (data !== null) {
      allData[key] = data;
    }
  });

  saveToStorage(backupKey, allData);

  return backupKey;
}


export function listStorageKeys() {
  const appKeys = [];
  const otherKeys = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (Object.values(STORAGE_KEYS).includes(key) || key.startsWith('lilith_') || key.startsWith('backup_')) {
      appKeys.push(key);
    } else {
      otherKeys.push(key);
    }
  }
  return { appKeys, otherKeys };
}

/**
 * Calcula el tamaño aproximado de los datos en localStorage
 */
export function calculateStorageSize() {
  let totalSize = 0;
  const sizes = {};

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const data = localStorage.getItem(key);
    if (data) {
      const size = new Blob([data]).size;
      sizes[name] = size;
      totalSize += size;
    }
  });

  return { sizes, totalSize };
}
