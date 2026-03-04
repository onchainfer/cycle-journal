// ═══════════════════════════════════════════════════════════════════════════════
// PRUEBA DEL NUEVO SISTEMA DE CICLOS
// ═══════════════════════════════════════════════════════════════════════════════

// Importar las funciones del nuevo sistema
import { calculateCurrentCycleDay, generateCycleId, createCycleSnapshot } from './src/utils/cycleCalculations.js';

// Probar el cálculo de días como en tu ejemplo
console.group('🧪 Prueba: Cálculo de días del ciclo');

// Caso: Último período el 4 de febrero, hoy es 4 de marzo
const lastPeriodDate = '2026-02-04';
const todayDate = '2026-03-04'; // Simular la fecha actual
const cycleLength = 28;

// Simular que "hoy" es 4 de marzo
const originalNow = Date.now;
Date.now = () => new Date(todayDate).getTime();

const calculation = calculateCurrentCycleDay(lastPeriodDate, cycleLength);

console.log('📅 Fechas:');
console.log('  Último período:', new Date(lastPeriodDate).toDateString());
console.log('  Hoy:', new Date(todayDate).toDateString());
console.log('  Días transcurridos:', calculation.daysSinceStart);

console.log('🔢 Cálculo:');
console.log('  Día del ciclo:', calculation.cycleDay);
console.log('  Ciclo número:', calculation.cycleNumber);

// Verificar que NO es Día 1
const isCorrect = calculation.cycleDay === 29;
console.log('✅ Resultado:', isCorrect ? 'CORRECTO - Día 29' : `INCORRECTO - Calculó Día ${calculation.cycleDay}`);

// Probar creación de ciclo snapshot
console.log('\n🗄️ Creación de Snapshot:');
const cycleSnapshot = createCycleSnapshot(lastPeriodDate, cycleLength);
console.log('  Cycle ID:', cycleSnapshot.id);
console.log('  Día calculado:', cycleSnapshot.currentDay);
console.log('  Fase:', cycleSnapshot.phase);

// Restaurar Date.now
Date.now = originalNow;

console.groupEnd();

// Probar función de reset
console.group('🧹 Prueba: Hard Reset');
console.log('Función hardReset() disponible:', typeof hardReset !== 'undefined');
console.log('Claves que se eliminarían:');
const keysToCheck = [
  'healthTeam',
  'chatHistory', 
  'lilith_cycle_history',
  'lilith_journal_entries'
];

keysToCheck.forEach(key => {
  console.log(`  ${key}: ${localStorage.getItem(key) ? 'EXISTS' : 'NOT_FOUND'}`);
});
console.groupEnd();

// Probar generación de IDs únicos
console.group('🆔 Prueba: IDs de Ciclo');
const testId1 = generateCycleId('2026-02-04');
const testId2 = generateCycleId('2026-03-04');
console.log('ID para 4 feb:', testId1);
console.log('ID para 4 mar:', testId2);
console.log('Son únicos:', testId1 !== testId2);
console.groupEnd();

console.log('\n🎉 Pruebas completadas. Revisar resultados arriba.');
