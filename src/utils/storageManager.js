// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE MANAGER - Gestión robusta de localStorage con funciones de reset
// ═══════════════════════════════════════════════════════════════════════════════

// Storage keys UNIFICADOS - TODO centralizado bajo el mismo esquema
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
  
  // Health Team & Chat - UNIFICADOS bajo lilith_*
  HEALTH_TEAM: 'lilith_health_team', // CAMBIADO de 'healthTeam'
  CHAT_HISTORY: 'lilith_chat_history', // CAMBIADO de 'chatHistory'
  LILITH_MEMORY: 'lilith_memory',
  
  // App State
  CHANGES_LOG: 'lilith_changes',
  USER_PREFERENCES: 'lilith_preferences',
  
  // Migration flags
  MIGRATION_V2: 'migration_cycle_snapshots_v2',
  
  // Legacy keys que necesitamos migrar/limpiar
  LEGACY_HEALTH_TEAM: 'healthTeam',
  LEGACY_CHAT_HISTORY: 'chatHistory'
};

/**
 * Segura función para guardar en localStorage
 */
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

/**
 * Segura función para cargar desde localStorage
 */
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

/**
 * Elimina una clave específica del localStorage
 */
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
 * HARD RESET ATÓMICO - localStorage.clear() completo
 * Elimina TODO sin excepción para empezar completamente de cero
 */
export function hardReset() {
  console.group('🧹 HARD RESET ATÓMICO - Clearing ALL localStorage');
  
  // Mostrar qué se va a eliminar antes del clear
  const keysBeforeReset = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    keysBeforeReset.push(key);
  }
  
  console.log('📋 Keys to be deleted:', keysBeforeReset);
  console.log('📊 Total items before reset:', keysBeforeReset.length);
  
  // RESET ATÓMICO: Eliminar TODO
  localStorage.clear();
  
  console.log('💣 localStorage.clear() executed');
  console.log('📊 Items remaining:', localStorage.length);
  console.log('✅ HARD RESET COMPLETE - All data obliterated');
  console.groupEnd();
  
  // Recargar la página para estado completamente limpio
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

/**
 * Reset suave - solo datos de ciclo y journal, preserva perfil
 */
export function softReset() {
  console.group('🔄 SOFT RESET - Cleaning cycle data only');
  
  const keysToRemove = [
    STORAGE_KEYS.CYCLE_HISTORY,
    STORAGE_KEYS.CURRENT_CYCLE,
    STORAGE_KEYS.JOURNAL_ENTRIES,
    STORAGE_KEYS.NOTES,
    STORAGE_KEYS.CHANGES_LOG
  ];
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`Removing: ${key}`);
      removeFromStorage(key);
    }
  });
  
  console.log('✅ Soft reset complete.');
  console.groupEnd();
}

/**
 * Función para backup de datos antes de migraciones
 */
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
  console.log(`💾 Backup created: ${backupKey}`);
  
  return backupKey;
}

/**
 * Lista todas las claves de localStorage relacionadas con la app
 */
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
  
  console.group('📋 LocalStorage Keys');
  console.log('App keys:', appKeys);
  console.log('Other keys:', otherKeys);
  console.groupEnd();
  
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
  
  console.log('📊 Storage sizes:', sizes);
  console.log('📊 Total size:', `${(totalSize / 1024).toFixed(2)} KB`);
  
  return { sizes, totalSize };
}
