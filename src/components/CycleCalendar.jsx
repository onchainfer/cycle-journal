import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}
@keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulse   { 0%,100%{opacity:0.4} 50%{opacity:1} }
@keyframes grain   {
  0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
  30%{transform:translate(3%,2%)}   50%{transform:translate(-1%,4%)}
  70%{transform:translate(4%,-1%)}  90%{transform:translate(-3%,3%)}
}
@keyframes slideUp {
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}

*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --void:#0a0810;--deep:#110e1a;--surface:#1a1626;--raised:#221d30;
  --border:rgba(180,150,255,0.12);--border-hover:rgba(180,150,255,0.35);
  --lav:#c4b0e8;--lav-dim:#8b75b8;--lav-glow:rgba(196,176,232,0.06);
  --blossom:#e8b4c4;--blossom-dim:#b87590;
  --gold:#d4b896;--ink:#f0eaf8;--ink-soft:#b8afd0;--ink-ghost:#6b6380;
  --menstrual:#c47a7a;--follicular:#8b75b8;
  --ovulation:#c4b0e8;--luteal:#b87590;
}
body{background:var(--void);}

.cal-root{
  min-height:100vh;background:var(--void);
  font-family:'DM Sans',sans-serif;color:var(--ink);
  max-width:480px;margin:0 auto;padding-bottom:80px;
  position:relative;
}

.cal-root::before{
  content:'';position:fixed;inset:-50%;width:200%;height:200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:0.04;pointer-events:none;z-index:100;animation:grain 8s steps(2) infinite;
}

.glow{
  position:fixed;width:500px;height:500px;border-radius:50%;
  background:radial-gradient(circle,rgba(140,100,220,0.07) 0%,transparent 70%);
  top:-150px;right:-150px;pointer-events:none;z-index:0;
}

/* ── HEADER ── */
.cal-header{
  padding:52px 24px 20px;
  position:relative;z-index:1;
  animation:fadeUp 0.5s ease both;
}

.cal-eyebrow{
  font-size:10px;font-weight:500;letter-spacing:0.25em;
  text-transform:uppercase;color:var(--lav-dim);margin-bottom:10px;
}

.cal-title-row{
  display:flex;align-items:center;justify-content:space-between;
}

.cal-title{
  font-family:'Playfair Display',serif;
  font-size:28px;font-weight:400;letter-spacing:-0.02em;
  color:var(--ink);line-height:1.1;
}
.cal-title em{font-style:italic;color:var(--lav);}

.cal-nav-btns{display:flex;gap:4px;}

.cal-nav-btn{
  width:32px;height:32px;border:1px solid var(--border);border-radius:1px;
  background:transparent;color:var(--ink-ghost);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-size:14px;transition:all 0.2s;
}
.cal-nav-btn:hover{border-color:var(--lav-dim);color:var(--lav);}

/* ── PHASE LEGEND ── */
.phase-legend{
  display:flex;gap:6px;padding:0 24px;margin-bottom:20px;
  flex-wrap:wrap;position:relative;z-index:1;
  animation:fadeUp 0.5s 0.05s ease both;
}

.legend-item{
  display:flex;align-items:center;gap:5px;
  font-size:10px;color:var(--ink-ghost);letter-spacing:0.05em;
}

.legend-dot{
  width:7px;height:7px;border-radius:50%;flex-shrink:0;
}

/* ── CALENDAR GRID ── */
.cal-grid-wrap{
  padding:0 24px;position:relative;z-index:1;
  animation:fadeUp 0.5s 0.1s ease both;
}

.cal-weekdays{
  display:grid;grid-template-columns:repeat(7,1fr);
  margin-bottom:8px;
}

.cal-weekday{
  text-align:center;font-size:9px;font-weight:500;
  letter-spacing:0.15em;text-transform:uppercase;
  color:var(--ink-ghost);padding:4px 0;
}

.cal-days{
  display:grid;grid-template-columns:repeat(7,1fr);
  gap:3px;
}

.cal-day{
  aspect-ratio:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  border-radius:2px;cursor:pointer;position:relative;
  transition:all 0.15s;border:1px solid transparent;
  background:transparent;
}

.cal-day:hover{border-color:var(--border-hover);}
.cal-day.empty{cursor:default;}
.cal-day.empty:hover{border-color:transparent;}

.cal-day.today{
  border-color:var(--lav-dim) !important;
  background:rgba(196,176,232,0.08);
}

.cal-day.selected{
  border-color:var(--lav) !important;
  background:rgba(196,176,232,0.12);
}

/* Phase backgrounds */
.cal-day.phase-menstrual{background:rgba(196,122,122,0.12);}
.cal-day.phase-follicular{background:rgba(139,117,184,0.1);}
.cal-day.phase-ovulation{background:rgba(196,176,232,0.1);}
.cal-day.phase-luteal{background:rgba(184,117,144,0.1);}

.cal-day-num{
  font-size:13px;font-weight:400;color:var(--ink-soft);
  line-height:1;z-index:1;
}

.cal-day.today .cal-day-num{color:var(--lav);font-weight:500;}
.cal-day.other-month .cal-day-num{color:var(--ink-ghost);opacity:0.4;}

/* Indicators */
.cal-day-indicators{
  display:flex;gap:2px;margin-top:3px;
  justify-content:center;min-height:5px;
}

.cal-indicator{
  width:4px;height:4px;border-radius:50%;flex-shrink:0;
}
.ind-note{background:var(--ink-ghost);opacity:0.6;}
.ind-lilith{background:var(--lav);opacity:0.8;}
.ind-period{background:var(--menstrual);}

/* Phase arc */
.phase-bar-wrap{
  width:100%;height:2px;position:absolute;bottom:0;left:0;
  border-radius:0 0 2px 2px;overflow:hidden;
}
.phase-bar{height:100%;width:100%;}
.phase-bar.menstrual{background:var(--menstrual);opacity:0.7;}
.phase-bar.follicular{background:var(--follicular);opacity:0.6;}
.phase-bar.ovulation{background:var(--ovulation);opacity:0.7;}
.phase-bar.luteal{background:var(--luteal);opacity:0.6;}

/* ── CURRENT CYCLE STRIP ── */
.cycle-strip{
  margin:20px 24px 0;
  background:var(--surface);border:1px solid var(--border);
  border-radius:2px;padding:18px;
  position:relative;z-index:1;
  animation:fadeUp 0.5s 0.15s ease both;
}

.cycle-strip-top{
  display:flex;justify-content:space-between;
  align-items:flex-start;margin-bottom:14px;
}

.cycle-strip-label{
  font-size:10px;font-weight:500;letter-spacing:0.2em;
  text-transform:uppercase;color:var(--ink-ghost);
}

.cycle-strip-day{
  font-family:'Playfair Display',serif;
  font-size:13px;font-style:italic;color:var(--blossom);
}

/* Phase segments */
.phase-segments{
  display:flex;gap:2px;height:8px;border-radius:1px;
  overflow:hidden;margin-bottom:10px;
}

.phase-seg{
  border-radius:1px;transition:opacity 0.2s;
  cursor:pointer;
}
.phase-seg:hover{opacity:0.9 !important;}
.phase-seg.menstrual{background:var(--menstrual);opacity:0.7;}
.phase-seg.follicular{background:var(--follicular);opacity:0.6;}
.phase-seg.ovulation{background:var(--ovulation);opacity:0.8;}
.phase-seg.luteal{background:var(--luteal);opacity:0.65;}

/* Progress marker */
.phase-progress-row{
  position:relative;height:12px;margin-bottom:8px;
}

.phase-progress-track{
  width:100%;height:1px;background:var(--border);
  position:absolute;top:50%;transform:translateY(-50%);
}

.phase-progress-marker{
  width:8px;height:8px;border-radius:50%;
  background:var(--lav);border:2px solid var(--void);
  position:absolute;top:50%;transform:translate(-50%,-50%);
  box-shadow:0 0 8px rgba(196,176,232,0.4);
}

.phase-labels{
  display:flex;justify-content:space-between;
  font-size:9px;color:var(--ink-ghost);letter-spacing:0.05em;
}

/* ── INSIGHTS STRIP ── */
.insights-section{
  padding:0 24px;margin-top:20px;
  position:relative;z-index:1;
  animation:fadeUp 0.5s 0.2s ease both;
}

.insights-label{
  font-size:10px;font-weight:500;letter-spacing:0.2em;
  text-transform:uppercase;color:var(--ink-ghost);
  margin-bottom:12px;
}

.insight-cards{display:flex;flex-direction:column;gap:8px;}

.insight-card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:2px;padding:14px 16px;
  display:flex;gap:12px;align-items:flex-start;
}

.insight-icon{
  font-size:16px;flex-shrink:0;margin-top:2px;
}

.insight-body{}

.insight-title{
  font-size:12px;font-weight:500;color:var(--ink-soft);
  margin-bottom:3px;letter-spacing:0.02em;
}

.insight-text{
  font-family:'Crimson Pro',serif;font-size:14px;
  font-style:italic;color:var(--ink-ghost);line-height:1.5;
}

/* ── DAY DETAIL SHEET ── */
.sheet-overlay{
  position:fixed;inset:0;background:rgba(10,8,16,0.8);
  backdrop-filter:blur(4px);z-index:200;
  display:flex;align-items:flex-end;justify-content:center;
}

.day-sheet{
  width:100%;max-width:480px;
  background:var(--surface);
  border-top:1px solid var(--border);
  border-radius:2px 2px 0 0;
  padding:20px 24px 48px;
  animation:slideUp 0.3s ease both;
  max-height:70vh;overflow-y:auto;
}

.sheet-handle{
  width:32px;height:3px;background:var(--border);
  border-radius:2px;margin:0 auto 20px;
}

.sheet-date{
  font-family:'Playfair Display',serif;
  font-size:22px;font-weight:400;letter-spacing:-0.02em;
  color:var(--ink);margin-bottom:6px;
}

.sheet-meta{
  display:flex;gap:8px;align-items:center;margin-bottom:20px;
}

.sheet-phase-badge{
  font-size:10px;font-weight:500;letter-spacing:0.1em;
  text-transform:uppercase;padding:4px 10px;
  border:1px solid rgba(232,180,196,0.25);border-radius:1px;
  color:var(--blossom);
}

.sheet-cycle-day{
  font-family:'Crimson Pro',serif;font-size:13px;
  font-style:italic;color:var(--ink-ghost);
}

.sheet-notes-label{
  font-size:10px;font-weight:500;letter-spacing:0.18em;
  text-transform:uppercase;color:var(--ink-ghost);margin-bottom:12px;
}

.sheet-note{
  padding:10px 0;border-bottom:1px solid var(--border);
}
.sheet-note:last-child{border-bottom:none;}

.sheet-note-time{
  font-size:10px;color:var(--ink-ghost);margin-bottom:4px;
  letter-spacing:0.06em;
}

.sheet-note-text{
  font-family:'Crimson Pro',serif;font-size:16px;
  font-weight:300;color:var(--ink-soft);line-height:1.55;
}

.sheet-empty{
  font-family:'Crimson Pro',serif;font-size:15px;
  font-style:italic;color:var(--ink-ghost);
  text-align:center;padding:20px 0;
}

.sheet-close{
  width:100%;margin-top:20px;padding:13px;
  border:1px solid var(--border);border-radius:1px;
  background:transparent;font-family:'DM Sans',sans-serif;
  font-size:11px;font-weight:500;letter-spacing:0.15em;
  text-transform:uppercase;color:var(--ink-ghost);
  cursor:pointer;transition:all 0.2s;
}
.sheet-close:hover{border-color:var(--lav-dim);color:var(--lav);}

/* Bottom nav */
.bottom-nav{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:480px;background:var(--deep);
  border-top:1px solid var(--border);
  display:flex;justify-content:space-around;
  padding:12px 0 20px;z-index:60;
}
.nav-item{
  display:flex;flex-direction:column;align-items:center;gap:4px;
  background:none;border:none;cursor:pointer;padding:4px 16px;
}
.nav-icon{font-size:18px;line-height:1;opacity:0.4;color:var(--ink-ghost);width:24px;height:24px;display:flex;align-items:center;justify-content:center;}
.nav-label{font-size:9px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-ghost);}
.nav-item.active .nav-icon{opacity:1;color:var(--lav);}
.nav-item.active .nav-label{color:var(--lav);}
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const PHASES = [
  { name: "menstrual", days: [1, 2, 3, 4, 5], label: "Menstrual", color: "#c47a7a" },
  { name: "follicular", days: [6, 7, 8, 9, 10, 11, 12, 13], label: "Follicular", color: "#8b75b8" },
  { name: "ovulation", days: [14, 15, 16], label: "Ovulation", color: "#c4b0e8" },
  // Le damos un array gigante del 17 al 100 para que el .length no falle jamás
  {
    name: "luteal",
    days: Array.from({ length: 84 }, (_, i) => i + 17),
    label: "Luteal",
    color: "#b87590"
  },
];
const TODAY = new Date();

function getAverageCycleLength(history, defaultLength = 28) {
  if (!history || !Array.isArray(history) || history.length === 0) return defaultLength;

  const lengths = history
    .filter(h => h && h.startDate && h.endDate)
    .map(h => {
      const start = new Date(h.startDate);
      const end = new Date(h.endDate);
      return Math.round((end - start) / (1000 * 60 * 60 * 24));
    })
    // 🚀 EL FIX: Solo aceptar ciclos realistas (mayores a 15 días, por ejemplo)
    .filter(length => length > 15);

  if (lengths.length === 0) return defaultLength;

  const sum = lengths.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / lengths.length);

  console.log("📈 Lilith Strategic Sync:", {
    ignoredZeros: history.length - lengths.length,
    newAverage: avg
  });

  return avg;
}

function getCycleDay(date, cycleStart, history = []) {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const safeHistory = Array.isArray(history) ? history : [];
  const avgLength = getAverageCycleLength(safeHistory);

  // 1. PRIORIDAD MÁXIMA: Ciclo Actual (Presente y Futuro)
  // Si tenemos una fecha de inicio activa, esa es la "verdad absoluta"
  if (cycleStart) {
    const start = new Date(cycleStart);
    start.setHours(0, 0, 0, 0);

    if (targetDate >= start) {
      const diffInMs = targetDate.getTime() - start.getTime();
      const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

      // Si la diferencia es menor al promedio, mostramos el día real (ej: 1 al 28)
      // Solo reiniciamos si realmente estamos proyectando el SEGUNDO mes a futuro
      const dayOfCycle = (diffInDays % avgLength) + 1;

      return dayOfCycle;
    }
  }

  // 2. SEGUNDA PRIORIDAD: Revisar el Historial (Pasado)
  // Solo si la fecha es anterior al ciclo actual, buscamos en el historial
  for (const hist of safeHistory) {
    if (hist?.startDate && hist?.endDate) {
      const hStart = new Date(hist.startDate);
      const hEnd = new Date(hist.endDate);
      hStart.setHours(0, 0, 0, 0);
      hEnd.setHours(0, 0, 0, 0);

      if (targetDate >= hStart && targetDate <= hEnd) {
        const diff = Math.round((targetDate.getTime() - hStart.getTime()) / (1000 * 60 * 60 * 24));
        return diff + 1;
      }
    }
  }

  return null;
}
function getPhase(cycleDay) {
  if (!cycleDay) return null;

  // 1. Menstrual: Días 1 a 5
  if (cycleDay >= 1 && cycleDay <= 5) {
    return PHASES.find(p => p.name === "menstrual");
  }
  // 2. Folicular: Días 6 a 13
  if (cycleDay >= 6 && cycleDay <= 13) {
    return PHASES.find(p => p.name === "follicular");
  }
  // 3. Ovulación: Días 14 a 16
  if (cycleDay >= 14 && cycleDay <= 16) {
    return PHASES.find(p => p.name === "ovulation");
  }
  // 4. Lútea: Día 17 en adelante
  // Esto atrapará cualquier día (17, 18... 32) hasta que el ciclo se reinicie
  if (cycleDay >= 17) {
    return PHASES.find(p => p.name === "luteal");
  }

  return null;
}

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CycleCalendar({
  activeNav,
  setActiveNav,
  cycle,
  currentCycle,
  currentCycleDay,
  currentPhase,
  cycleHistory = [],
  notes: allNotes = []
}) {
  const [viewYear, setViewYear] = useState(TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [selected, setSelected] = useState(null);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  // Build calendar cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrev - firstDay + i + 1, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isToday = (d, cur) =>
    cur && d === TODAY.getDate() &&
    viewMonth === TODAY.getMonth() &&
    viewYear === TODAY.getFullYear();

  // Build notesByDate from real notes
  const notesByDate = {};
  allNotes.forEach(n => {
    if (!notesByDate[n.date]) notesByDate[n.date] = [];
    notesByDate[n.date].push(n);
  });

  const selectedEntry = selected
    ? { date: selected, notes: notesByDate[selected] || [] }
    : null;

  const progress = cycle?.cycleDay && cycle?.cycleLength
    ? (cycle.cycleDay / cycle.cycleLength) * 100
    : 0;

  return (
    <>
      <style>{css}</style>
      <div className="cal-root">
        <div className="glow" />

        {/* ── HEADER ── */}
        <div className="cal-header">
          <p className="cal-eyebrow">Your cycle</p>
          <div className="cal-title-row">
            <h1 className="cal-title">
              {MONTHS[viewMonth].slice(0, 3)} <em>{viewYear}</em>
            </h1>
            <div className="cal-nav-btns">
              <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
              <button className="cal-nav-btn" onClick={nextMonth}>›</button>
            </div>
          </div>
        </div>

        {/* ── LEGEND ── */}
        <div className="phase-legend">
          {PHASES.map(p => (
            <div key={p.name} className="legend-item">
              <div className="legend-dot" style={{ background: p.color }} />
              {p.label}
            </div>
          ))}
        </div>

        {/* ── GRID ── */}
        <div className="cal-grid-wrap">
          <div className="cal-weekdays">
            {WEEKDAYS.map(w => <div key={w} className="cal-weekday">{w}</div>)}
          </div>

          <div className="cal-days">
            {cells.map((cell, i) => {
              if (!cell.current) return (
                <div key={i} className="cal-day empty other-month">
                  <span className="cal-day-num">{cell.day}</span>
                </div>
              );

              // 1. Definimos la clave para las notas (asegúrate de que dateKey use viewMonth + 1 si tu backend es 1-indexed)
              const key = dateKey(viewYear, viewMonth, cell.day);

              // 2. Definimos "hoy" a medianoche para comparaciones precisas
              const startOfToday = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
              startOfToday.setHours(0, 0, 0, 0);

              // 3. Creamos la fecha de la celda actual también a medianoche
              const cellDate = new Date(viewYear, viewMonth, cell.day);
              cellDate.setHours(0, 0, 0, 0);

              // 4. Calculamos el día del ciclo usando la fecha limpia y el inicio real de la DB
              const cycleStart = cycle?.startDate || currentCycle?.startDate;
              const cDay = getCycleDay(cellDate, cycleStart, cycleHistory);

              // 5. Obtenemos la fase y el estado del tiempo
              const phase = getPhase(cDay);
              const isFuture = cellDate.getTime() > startOfToday.getTime();
              const today = cellDate.getTime() === startOfToday.getTime();

              // 6. Sincronizamos las notas
              const notes = notesByDate[key];

              return (
                <div
                  key={i}
                  className={[
                    "cal-day",
                    phase ? `phase-${phase.name}` : "",
                    today ? "today" : "",
                    selected === key ? "selected" : "",
                  ].join(" ")}
                  onClick={() => setSelected(selected === key ? null : key)}
                >
                  <span className="cal-day-num">{cell.day}</span>
                  <div className="cal-day-indicators">
                    {notes && <div className="cal-indicator ind-note" />}
                    {today && <div className="cal-indicator ind-lilith" />}
                    {/* FIX CRÍTICO: Solo mostrar indicador de período si hay registro REAL de sangrado */}
                    {notes && notes.some(note =>
                      note.tags?.includes('bleeding') ||
                      note.tags?.includes('flow') ||
                      note.text?.toLowerCase().includes('period') ||
                      note.text?.toLowerCase().includes('bleeding') ||
                      note.text?.toLowerCase().includes('flow')
                    ) && <div className="cal-indicator ind-period" />}
                  </div>
                  {phase && (
                    <div className="phase-bar-wrap">
                      <div className={`phase-bar ${phase.name}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CYCLE STRIP (Alineada con el formato de Insights) ── */}
        <div className="strip-alignment-wrapper" style={{
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          padding: '0 20px',
          boxSizing: 'border-box'
        }}>
          <div className="insight-card" style={{
            width: '100%',
            marginBottom: '32px',
            display: 'block'
          }}>
            {(() => {
              // 1. OBTENER LA VERDAD: Calculamos los valores reales basándonos en la fecha de inicio
              const activeCycle = currentCycle || cycle;
              const avg = getAverageCycleLength(cycleHistory, activeCycle?.cycleLength || 28);

              let displayDay = 0;
              let displayPhase = "";

              if (activeCycle?.startDate) {
                const today = new Date();
                const start = new Date(activeCycle.startDate);

                // Normalización a Medianoche Local para evitar desfases de horas (0-index bug)
                const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                const startMid = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();

                // Cálculo exacto: Si hoy es 6 y empezó el 5, esto DA 2.
                const diffDays = Math.round((todayMid - startMid) / (1000 * 60 * 60 * 24));
                displayDay = diffDays + 1;

                // Obtenemos la fase real usando la lógica de rangos que corregimos
                const phaseObj = getPhase(displayDay);
                displayPhase = phaseObj?.label || "Menstrual";
              } else {
                // Fallback si no hay ciclo activo
                displayDay = currentCycleDay || cycle?.cycleDay || 0;
                displayPhase = currentPhase || cycle?.phase || "";
              }

              // Cálculo del porcentaje para el marcador blanco (basado en el día real vs promedio de 30)
              const progressPercent = Math.min((displayDay / avg) * 100, 100);

              return (
                <div className="insight-body" style={{ width: '100%' }}>
                  {/* Encabezado: Título y Día actual Sincronizado */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                    <div className="insight-title" style={{ opacity: 0.5, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1.5px' }}>
                      Current cycle
                    </div>
                    <div style={{ textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1.5px', color: '#b87590', fontWeight: 'bold' }}>
                      {displayDay > 0 ? (
                        `Day ${displayDay} · ${displayPhase}`
                      ) : (
                        "No cycle active"
                      )}
                    </div>
                  </div>

                  {/* Barra de Progreso Segmentada */}
                  <div className="progress-container-full" style={{
                    width: '100%',
                    height: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '5px',
                    position: 'relative'
                  }}>
                    <div className="phase-segments" style={{ display: 'flex', width: '100%', height: '100%', borderRadius: '5px', overflow: 'hidden' }}>
                      {PHASES.map(p => {
                        // La fase lútea se estira dinámicamente según tu promedio real
                        const flexValue = p.name === 'luteal' ? Math.max(avg - 16, 10) : (p.days?.length || 5);
                        return (
                          <div key={p.name} style={{ flex: `${flexValue} 0 0%`, backgroundColor: p.color, height: '100%' }} />
                        );
                      })}
                    </div>

                    {/* Marcador de progreso (Punto Blanco) Sincronizado */}
                    <div className="phase-progress-marker" style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${progressPercent}%`,
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 15px rgba(255,255,255,1)',
                      zIndex: 10,
                      transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>

                  {/* Etiquetas de las fases (Labels dinámicos) */}
                  <div className="phase-labels" style={{
                    display: 'flex',
                    width: '100%',
                    marginTop: '12px'
                  }}>
                    {PHASES.map(p => {
                      const flexValue = p.name === 'luteal' ? Math.max(avg - 16, 10) : (p.days?.length || 5);
                      return (
                        <div
                          key={p.name}
                          className="legend-item"
                          style={{
                            flex: `${flexValue} 0 0%`,
                            justifyContent: p.name === 'menstrual' ? 'flex-start' : p.name === 'luteal' ? 'flex-end' : 'center',
                            display: 'flex',
                            fontSize: '10px',
                            whiteSpace: 'nowrap',
                            opacity: 0.8
                          }}
                        >
                          {p.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── INSIGHTS ── */}
        <div className="insights-section">
          <p className="insights-label">Patterns Lilith found</p>
          <div className="insight-cards">
            {allNotes.length < 10 ? (
              <div className="insight-card">
                <span className="insight-icon">✦</span>
                <div className="insight-body">
                  <div className="insight-title">Keep logging</div>
                  <div className="insight-text">
                    Lilith needs a few more entries to find patterns.
                    You have {allNotes.length} note{allNotes.length !== 1 ? "s" : ""} so far — patterns appear after ~10.
                  </div>
                </div>
              </div>
            ) : (
              [
                {
                  icon: "📊",
                  title: "Data collected",
                  text: `${allNotes.length} notes logged. Lilith is building your pattern profile.`
                },
                allNotes.filter(n => n.tags?.includes("physical")).length > 3 && {
                  icon: "💜",
                  title: "Physical symptoms tracked",
                  text: `${allNotes.filter(n => n.tags?.includes("physical")).length} physical notes logged across your cycle.`
                },
                allNotes.filter(n => n.tags?.includes("emotional")).length > 3 && {
                  icon: "🌙",
                  title: "Emotional patterns",
                  text: `${allNotes.filter(n => n.tags?.includes("emotional")).length} emotional entries tracked. Lilith can see patterns in your mood cycle.`
                },
              ].filter(Boolean).map((ins, i) => (
                <div key={i} className="insight-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <span className="insight-icon">{ins.icon}</span>
                  <div className="insight-body">
                    <div className="insight-title">{ins.title}</div>
                    <div className="insight-text">{ins.text}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── DAY DETAIL SHEET ── */}
        {selected && selectedEntry && (
          <div className="sheet-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <div className="day-sheet">
              <div className="sheet-handle" />
              {(() => {
                // 1. Limpiamos la fecha seleccionada para evitar desfases de zona horaria
                const d = new Date(selected);
                // Forzamos a que trate la fecha como "Día completo" a medianoche local
                const normalizedDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

                // 2. Usamos la misma prioridad de startDate que el calendario
                const cycleStart = cycle?.startDate || currentCycle?.startDate;

                // 3. Calculamos el día del ciclo con la fecha normalizada
                const cDay = getCycleDay(normalizedDate, cycleStart, cycleHistory);
                const phase = getPhase(cDay);

                return (
                  <>
                    <div className="sheet-date">
                      {normalizedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        timeZone: 'UTC' // Forzamos a que el render también ignore el desfase local
                      })}
                    </div>
                    <div className="sheet-meta">
                      {phase && <span className="sheet-phase-badge">{phase.label}</span>}
                      {cDay && <span className="sheet-cycle-day">Day {cDay} of cycle</span>}
                    </div>
                    {/* ... el resto de tu código de notas sigue igual ... */}
                  </>
                );
              })()}

            </div>
          </div>
        )}

        {/* ── BOTTOM NAV ── */}
        <div className="bottom-nav">
          {[
            { id: "home", icon: "⚸", label: "Home" },
            { id: "journal", icon: "◎", label: "Journal" },
            { id: "lilith", icon: "✦", label: "Lilith" },
            { id: "calendar", icon: "◫", label: "Cycle" },
          ].map(item => (
            <button key={item.id}
              className={`nav-item ${(activeNav || "calendar") === item.id ? "active" : ""}`}
              onClick={() => setActiveNav && setActiveNav(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
