// ═══════════════════════════════════════════════════════════════════════════════
// PRUEBA ESPECÍFICA DEL PARSER DE IMPORTACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🧪 TESTING IMPORT PARSER');
console.log('=======================\n');

// Simular las funciones necesarias
function getCycleDay(date, cycleStart, cycleLength = 28) {
  if (!cycleStart) return null;
  const start = new Date(cycleStart);
  const diff = Math.floor((date - start) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  return diff + 1; // Sin módulo
}

function getPhase(day) {
  if (!day) return null;
  if (day <= 5) return "menstrual";
  if (day <= 13) return "follicular";
  if (day <= 16) return "ovulation";
  return "luteal";
}

function dateKey(date) {
  return date.toISOString().split("T")[0];
}

// Parser actualizado (simplificado para testing)
function parseImportText(raw, cycleStart = null, cycleLength = 28) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  const results = [];
  const currentYear = 2026; // Año fijo para testing

  const MONTHS = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, may_: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };

  for (const line of lines) {
    if (!line) continue;

    let date = null;
    let text = line;

    // Pattern: "Feb 7", "February 7", "feb 7:"
    const monthDay = line.match(/^(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?[,\-—:\s]+(.+)/i);
    if (monthDay) {
      const monthName = monthDay[1].toLowerCase();
      const mo = MONTHS[monthName];
      const dy = parseInt(monthDay[2]);
      
      if (mo !== undefined && dy >= 1 && dy <= 31) {
        date = new Date(currentYear, mo, dy);
        text = monthDay[3].trim();
      }
    }

    if (!date || !text) continue;

    // Calcular cycle day
    let cycleDay = null;
    let cyclePhase = null;
    
    if (cycleStart) {
      cycleDay = getCycleDay(date, cycleStart, cycleLength);
      cyclePhase = getPhase(cycleDay);
    }

    results.push({
      date: dateKey(date),
      cycleDay,
      cyclePhase,
      text,
      createdAt: date.toISOString()
    });
  }

  return results;
}

// CASO DE PRUEBA: El escenario de Fernanda
console.group('📅 CASO: Último período 4 Feb, importando entradas de febrero');

const cycleStart = '2026-02-04T00:00:00.000Z'; // 4 de febrero
const testInput = `Feb 7: very tired, headache all day
Feb 14: period ended, feeling better
Feb 21: lots of energy today`;

console.log('Input text:');
console.log(testInput);
console.log('\nCycle start:', new Date(cycleStart).toDateString());

const parsed = parseImportText(testInput, cycleStart, 28);

console.log('\nParsed entries:');
parsed.forEach((entry, i) => {
  console.log(`${i + 1}. ${entry.date} (Day ${entry.cycleDay || '?'} - ${entry.cyclePhase || 'unknown'})`);
  console.log(`   Text: "${entry.text}"`);
  console.log(`   CreatedAt: ${new Date(entry.createdAt).toDateString()}`);
  console.log('');
});

// Verificaciones
const feb7Entry = parsed.find(e => e.date === '2026-02-07');
const feb14Entry = parsed.find(e => e.date === '2026-02-14');

console.log('🧮 VERIFICACIONES:');
console.log(`Feb 7 entry found: ${!!feb7Entry}`);
if (feb7Entry) {
  console.log(`Feb 7 cycle day: ${feb7Entry.cycleDay} (expected: 4)`);
  console.log(`Feb 7 phase: ${feb7Entry.cyclePhase} (expected: menstrual)`);
}

console.log(`Feb 14 entry found: ${!!feb14Entry}`);
if (feb14Entry) {
  console.log(`Feb 14 cycle day: ${feb14Entry.cycleDay} (expected: 11)`);
  console.log(`Feb 14 phase: ${feb14Entry.cyclePhase} (expected: follicular)`);
}

const allDatesCorrect = parsed.every(e => e.createdAt.includes('2026-02'));
console.log(`All dates in February 2026: ${allDatesCorrect}`);

console.groupEnd();

console.log('\n✅ PARSER TESTING COMPLETE');
console.log('El parser ahora debe:');
console.log('• Detectar "Feb 7:" correctamente');
console.log('• Calcular Day 4 para Feb 7 (4 feb + 3 días)');
console.log('• Establecer createdAt como Feb 7, no hoy');
console.log('• Vincular a cycleId del ciclo Feb 4');
