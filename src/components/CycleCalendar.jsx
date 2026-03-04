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
  { name: "luteal", days: Array.from({ length: 12 }, (_, i) => i + 17), label: "Luteal", color: "#b87590" },
];

const TODAY = new Date();

function getCycleDay(date, cycleStart, cycleLength = 28, cycleHistory = []) {
  // Check historical cycles first
  for (const historicalCycle of cycleHistory) {
    if (historicalCycle.startDate && historicalCycle.endDate) {
      const histStart = new Date(historicalCycle.startDate);
      const histEnd = new Date(historicalCycle.endDate);
      
      // If date falls within a historical cycle
      if (date >= histStart && date < histEnd) {
        const diff = Math.floor((date - histStart) / (1000 * 60 * 60 * 24));
        return diff + 1; // Historical cycles use actual days
      }
    }
  }
  
  // Use current cycle if no historical match
  if (!cycleStart) return null;
  const start = new Date(cycleStart);
  const diff = Math.floor((date - start) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  
  // FIX CRÍTICO: NO usar módulo - mostrar el día REAL del ciclo (29, 30, 31...)
  // Solo reset automático si hay un nuevo registro de período
  return diff + 1;
}

function getPhase(cycleDay) {
  if (!cycleDay) return null;
  return PHASES.find(p => p.days.includes(cycleDay));
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

              const key = dateKey(viewYear, viewMonth, cell.day);
              const cDay = getCycleDay(new Date(viewYear, viewMonth, cell.day), cycle?.startDate, cycle?.cycleLength, cycleHistory);
              const phase = getPhase(cDay);
              const notes = notesByDate[key];
              const today = isToday(cell.day, cell.current);

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

        {/* ── CYCLE STRIP ── */}
        <div className="cycle-strip">
          <div className="cycle-strip-top">
            <span className="cycle-strip-label">Current cycle</span>
            <span className="cycle-strip-day">
              {(currentCycleDay || cycle?.cycleDay) ? (
                `Day ${currentCycleDay || cycle.cycleDay}${(currentCycleDay || cycle.cycleDay) > (cycle?.cycleLength || 28) ? ` (extended)` : ''} · ${currentPhase || cycle.phase || ""}`
              ) : (
                "Tell Lilith when your period started"
              )}
            </span>
          </div>

          <div className="phase-segments">
            {PHASES.map(p => (
              <div
                key={p.name}
                className={`phase-seg ${p.name}`}
                style={{ flex: p.days.length }}
              />
            ))}
          </div>

          <div className="phase-progress-row">
            <div className="phase-progress-track" />
            <div className="phase-progress-marker" style={{ left: `${progress}%` }} />
          </div>

          <div className="phase-labels">
            <span>Menstrual</span>
            <span>Follicular</span>
            <span>Ovulation</span>
            <span>Luteal</span>
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
                const d = new Date(selected);
                const cDay = getCycleDay(d, cycle?.startDate, cycle?.cycleLength, cycleHistory);
                const phase = getPhase(cDay);
                return (
                  <>
                    <div className="sheet-date">
                      {d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </div>
                    <div className="sheet-meta">
                      {phase && <span className="sheet-phase-badge">{phase.label}</span>}
                      {cDay && <span className="sheet-cycle-day">Day {cDay} of cycle</span>}
                    </div>
                    <p className="sheet-notes-label">
                      Notes · {selectedEntry.notes.length} {selectedEntry.notes.length === 1 ? "entry" : "entries"}
                    </p>
                    {selectedEntry.notes.length === 0
                      ? <p className="sheet-empty">No notes for this day.</p>
                      : selectedEntry.notes.map((n, i) => (
                        <div key={i} className="sheet-note">
                          <div className="sheet-note-time">{n.time}</div>
                          <div className="sheet-note-text">{n.text}</div>
                        </div>
                      ))
                    }
                    <button className="sheet-close" onClick={() => setSelected(null)}>Close</button>
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
