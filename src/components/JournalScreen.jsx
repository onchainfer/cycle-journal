import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulse  { 0%,100%{opacity:0.4} 50%{opacity:1} }
@keyframes grain  {
  0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
  30%{transform:translate(3%,2%)}   50%{transform:translate(-1%,4%)}
  70%{transform:translate(4%,-1%)}  90%{transform:translate(-3%,3%)}
}
@keyframes slideIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --void:#0a0810;--deep:#110e1a;--surface:#1a1626;--raised:#221d30;
  --border:rgba(180,150,255,0.12);--border-hover:rgba(180,150,255,0.35);
  --lav:#c4b0e8;--lav-dim:#8b75b8;--lav-glow:rgba(196,176,232,0.06);
  --blossom:#e8b4c4;--blossom-dim:#b87590;
  --gold:#d4b896;--ink:#f0eaf8;--ink-soft:#b8afd0;--ink-ghost:#6b6380;
}
body{background:var(--void);}

.journal-root{
  min-height:100vh;background:var(--void);
  font-family:'DM Sans',sans-serif;color:var(--ink);
  max-width:480px;margin:0 auto;padding-bottom:80px;
  position:relative;
}

.journal-root::before{
  content:'';position:fixed;inset:-50%;width:200%;height:200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:0.04;pointer-events:none;z-index:100;animation:grain 8s steps(2) infinite;
}

.glow{
  position:fixed;width:500px;height:500px;border-radius:50%;
  background:radial-gradient(circle,rgba(140,100,220,0.07) 0%,transparent 70%);
  top:-150px;right:-150px;pointer-events:none;z-index:0;
}

/* ── LIST VIEW ── */
.list-header{
  padding:52px 24px 24px;
  position:relative;z-index:1;
  animation:fadeUp 0.6s ease both;
}

.list-eyebrow{
  font-size:10px;font-weight:500;letter-spacing:0.25em;
  text-transform:uppercase;color:var(--lav-dim);margin-bottom:10px;
}

.list-title{
  font-family:'Playfair Display',serif;
  font-size:32px;font-weight:400;letter-spacing:-0.02em;
  color:var(--ink);line-height:1.15;
}

.list-title em{font-style:italic;color:var(--lav);}

.list-subtitle{
  font-family:'Crimson Pro',serif;font-style:italic;
  font-size:15px;color:var(--ink-ghost);margin-top:8px;
}

/* Stats row */
.stats-row{
  display:flex;gap:8px;padding:0 24px;margin-bottom:24px;
  position:relative;z-index:1;
  animation:fadeUp 0.6s 0.1s ease both;
}

.stat-card{
  flex:1;padding:14px 16px;
  background:var(--surface);border:1px solid var(--border);border-radius:2px;
}

.stat-num{
  font-family:'Playfair Display',serif;
  font-size:26px;font-weight:400;color:var(--lav);
  letter-spacing:-0.02em;line-height:1;margin-bottom:4px;
}

.stat-label{
  font-size:9px;font-weight:500;letter-spacing:0.15em;
  text-transform:uppercase;color:var(--ink-ghost);
}

/* Week group */
.week-group{
  padding:0 24px;margin-bottom:8px;
  position:relative;z-index:1;
  animation:fadeUp 0.5s ease both;
}

.week-label{
  font-size:10px;font-weight:500;letter-spacing:0.2em;
  text-transform:uppercase;color:var(--ink-ghost);
  padding:12px 0 8px;
  border-top:1px solid var(--border);
}

/* Day card */
.day-card{
  display:flex;gap:14px;align-items:flex-start;
  padding:16px 0;border-bottom:1px solid var(--border);
  cursor:pointer;transition:all 0.2s;
  background:transparent;border-left:none;border-right:none;border-top:none;
  width:100%;text-align:left;font-family:inherit;
}

.day-card:hover .day-preview{color:var(--ink-soft);}
.day-card:hover .day-num{color:var(--lav);}
.day-card:last-child{border-bottom:none;}

.day-left{
  flex-shrink:0;width:40px;text-align:center;
}

.day-num{
  font-family:'Playfair Display',serif;
  font-size:22px;font-weight:400;color:var(--ink-soft);
  line-height:1;transition:color 0.2s;
}

.day-weekday{
  font-size:9px;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--ink-ghost);margin-top:2px;
}

.day-body{flex:1;}

.day-meta{
  display:flex;align-items:center;gap:8px;margin-bottom:6px;
}

.day-phase-dot{
  width:6px;height:6px;border-radius:50%;flex-shrink:0;
}
.phase-menstrual{background:#c47a7a;}
.phase-follicular{background:#8b75b8;}
.phase-ovulation{background:#c4b0e8;}
.phase-luteal{background:#b87590;}

.day-phase-label{
  font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-ghost);
}

.day-cycle-num{
  font-size:10px;color:var(--ink-ghost);margin-left:auto;
}

.day-preview{
  font-family:'Crimson Pro',serif;font-size:15px;font-style:italic;
  font-weight:300;color:var(--ink-ghost);line-height:1.5;
  transition:color 0.2s;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}

.day-tags{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;}

.day-tag{
  font-size:9px;padding:2px 7px;border:1px solid var(--border);
  border-radius:1px;color:var(--ink-ghost);letter-spacing:0.04em;
}
.day-tag.physical{border-color:rgba(232,180,196,0.25);color:var(--blossom-dim);}
.day-tag.emotional{border-color:rgba(196,176,232,0.25);color:var(--lav-dim);}
.day-tag.energy{border-color:rgba(212,184,150,0.25);color:var(--gold);}

.day-right{
  flex-shrink:0;display:flex;flex-direction:column;
  align-items:center;gap:4px;padding-top:4px;
}

.day-note-count{
  font-size:10px;color:var(--ink-ghost);
}

.day-has-lilith{
  width:6px;height:6px;border-radius:50%;
  background:var(--lav);opacity:0.6;
}

/* ── DAY VIEW ── */
.day-view{
  position:relative;z-index:1;
  animation:slideIn 0.4s ease both;
}

.day-view-header{
  padding:48px 24px 20px;
  border-bottom:1px solid var(--border);
}

.back-btn{
  display:flex;align-items:center;gap:6px;
  background:none;border:none;
  font-family:'DM Sans',sans-serif;font-size:12px;
  color:var(--ink-ghost);cursor:pointer;
  letter-spacing:0.08em;padding:0;margin-bottom:20px;
  transition:color 0.2s;
}
.back-btn:hover{color:var(--lav);}

.dv-date{
  font-family:'Playfair Display',serif;
  font-size:28px;font-weight:400;letter-spacing:-0.02em;
  color:var(--ink);line-height:1.1;margin-bottom:8px;
}

.dv-meta{
  display:flex;align-items:center;gap:10px;
}

.dv-phase-badge{
  font-size:10px;font-weight:500;letter-spacing:0.12em;
  text-transform:uppercase;padding:4px 10px;
  border:1px solid var(--border);border-radius:1px;
  color:var(--blossom);border-color:rgba(232,180,196,0.25);
}

.dv-cycle-day{
  font-size:11px;color:var(--ink-ghost);
  font-family:'Crimson Pro',serif;font-style:italic;
}

/* Notes timeline */
.dv-timeline{padding:24px 24px 0;}

.dv-section-label{
  font-size:10px;font-weight:500;letter-spacing:0.2em;
  text-transform:uppercase;color:var(--ink-ghost);
  margin-bottom:20px;
}

.dv-notes{position:relative;}

.dv-notes::before{
  content:'';position:absolute;
  left:11px;top:8px;bottom:8px;
  width:1px;background:var(--border);
}

.dv-note{
  display:flex;gap:16px;padding:10px 0;
  animation:fadeUp 0.4s ease both;
}

.dv-dot-wrap{
  flex-shrink:0;width:23px;
  display:flex;justify-content:center;padding-top:6px;
}

.dv-dot{
  width:7px;height:7px;border-radius:50%;
  border:1px solid var(--lav-dim);background:var(--void);
  z-index:1;position:relative;flex-shrink:0;
}

.dv-note-body{flex:1;}

.dv-note-time{
  font-size:10px;color:var(--ink-ghost);
  letter-spacing:0.08em;margin-bottom:5px;
}

.dv-note-text{
  font-family:'Crimson Pro',serif;font-size:18px;
  font-weight:300;color:var(--ink-soft);line-height:1.6;
}

.dv-note-tags{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;}
.dv-tag{
  font-size:10px;padding:2px 8px;border:1px solid var(--border);
  border-radius:1px;color:var(--ink-ghost);
}
.dv-tag.physical{border-color:rgba(232,180,196,0.3);color:var(--blossom-dim);}
.dv-tag.emotional{border-color:rgba(196,176,232,0.3);color:var(--lav-dim);}
.dv-tag.energy{border-color:rgba(212,184,150,0.3);color:var(--gold);}

/* Lilith summary */
.dv-lilith{
  margin:28px 24px 0;
  background:var(--surface);border:1px solid var(--border);
  border-radius:2px;padding:20px;
  position:relative;overflow:hidden;
}

.dv-lilith::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--lav-dim),transparent);
  opacity:0.4;
}

.dv-lilith-header{
  display:flex;align-items:center;gap:8px;margin-bottom:12px;
}

.dv-lilith-dot{
  width:7px;height:7px;border-radius:50%;
  background:var(--lav);animation:pulse 2.5s ease infinite;
}

.dv-lilith-label{
  font-size:10px;font-weight:500;letter-spacing:0.2em;
  text-transform:uppercase;color:var(--lav-dim);
}

.dv-lilith-text{
  font-family:'Crimson Pro',serif;font-size:16px;
  font-style:italic;color:var(--ink-soft);line-height:1.7;
}

.dv-lilith-actions{
  display:flex;gap:8px;margin-top:14px;
}

.dv-action-btn{
  padding:7px 14px;border:1px solid var(--border);border-radius:1px;
  background:transparent;font-family:'DM Sans',sans-serif;
  font-size:11px;color:var(--ink-ghost);cursor:pointer;
  transition:all 0.2s;letter-spacing:0.05em;
}
.dv-action-btn:hover{border-color:var(--lav-dim);color:var(--lav);}

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
  background:none;border:none;cursor:pointer;padding:4px 16px;transition:all 0.2s;
}
.nav-icon{font-size:18px;line-height:1;opacity:0.4;transition:opacity 0.2s;}
.nav-label{font-size:9px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-ghost);}
.nav-item.active .nav-icon{opacity:1;}
.nav-item.active .nav-label{color:var(--lav);}
`;

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const MOCK_ENTRIES = [
    {
        id: 1, date: "2026-02-28", weekday: "Sat", dayNum: 28,
        month: "February", cycleDay: 25, phase: "luteal",
        preview: "Woke up with that heavy exhaustion I know is hormonal. Headache since 11am.",
        notes: [
            { time: "8:12 AM", text: "Woke up with that heavy exhaustion. Not from bad sleep — it's hormonal, I know how to tell now.", tags: ["physical", "emotional"] },
            { time: "11:45 AM", text: "Headache behind my eyes. Drank water.", tags: ["physical"] },
            { time: "2:30 PM", text: "Intense sugar cravings. Ate fruit but it wasn't enough.", tags: ["physical", "energy"] },
            { time: "6:00 PM", text: "Gym was rough today. Less strength than usual, got a little frustrated.", tags: ["energy", "emotional"] },
        ],
        tags: ["physical", "emotional", "energy"],
        hasLilith: true,
        lilithSummary: "Día 25 en fase lútea tardía. La progesterona está en caída libre y el estrógeno en su punto más bajo — lo que sientes es completamente coherente con eso. El cansancio, el dolor de cabeza y el antojo de azúcar son tu cuerpo pidiendo glucosa y serotonina. La frustración en el gym también es hormonal: tu fuerza muscular baja un 10-15% en esta fase. No es falta de disciplina, es biología."
    },
    {
        id: 2, date: "2026-02-27", weekday: "Fri", dayNum: 27,
        month: "February", cycleDay: 24, phase: "luteal",
        preview: "Productive morning, then I crashed. Difficult work meeting that affected me more than it should have.",
        notes: [
            { time: "9:00 AM", text: "Surprisingly productive morning. Finished the report early.", tags: ["energy"] },
            { time: "3:15 PM", text: "Difficult meeting. Felt like it affected me more than it should have — I couldn't stop thinking about it.", tags: ["emotional"] },
            { time: "8:00 PM", text: "No motivation for anything. Had dinner and went to bed early.", tags: ["energy", "emotional"] },
        ],
        tags: ["emotional", "energy"],
        hasLilith: true,
        lilithSummary: "Today's pattern is very typical of day 24: energy in the morning (the last before the drop) and emotional collapse in the afternoon. The increased sensitivity in meetings and social situations is progesterone dropping — your nervous system is literally more reactive on these days."
    },
    {
        id: 3, date: "2026-02-26", weekday: "Thu", dayNum: 26,
        month: "February", cycleDay: 23, phase: "luteal",
        preview: "Good overall. A bit irritable in the evening but nothing serious.",
        notes: [
            { time: "10:30 AM", text: "Good, normal energy. Trained well.", tags: ["energy"] },
            { time: "9:00 PM", text: "Irritable in the evening, no apparent reason. My partner noticed.", tags: ["emotional"] },
        ],
        tags: ["energy", "emotional"],
        hasLilith: false,
        lilithSummary: ""
    },
    {
        id: 4, date: "2026-02-23", weekday: "Mon", dayNum: 23,
        month: "February", cycleDay: 20, phase: "luteal",
        preview: "Starting to notice the first luteal symptoms. Breast tenderness, some bloating.",
        notes: [
            { time: "7:45 AM", text: "Breast tenderness this morning. Signal that it's starting.", tags: ["physical"] },
            { time: "12:00 PM", text: "Bloating after lunch even though I ate normally.", tags: ["physical"] },
        ],
        tags: ["physical"],
        hasLilith: true,
        lilithSummary: "The symptoms you describe — breast tenderness and bloating — are the first signs of the luteal phase. Progesterone is rising and causing fluid retention. It's too early for PMDD still, but this is the time to start reducing salt and caffeine if you can."
    },
];

const PHASE_COLORS = {
    menstrual: "phase-menstrual",
    follicular: "phase-follicular",
    ovulation: "phase-ovulation",
    luteal: "phase-luteal",
};

export default function JournalScreen({ activeNav, setActiveNav }) {
    const [selectedDay, setSelectedDay] = useState(null);

    // Group entries by week
    const thisWeek = MOCK_ENTRIES.filter((_, i) => i < 3);
    const lastWeek = MOCK_ENTRIES.filter((_, i) => i >= 3);

    const totalNotes = MOCK_ENTRIES.reduce((acc, e) => acc + e.notes.length, 0);

    if (selectedDay) {
        const entry = MOCK_ENTRIES.find(e => e.id === selectedDay);
        return (
            <>
                <style>{css}</style>
                <div className="journal-root">
                    <div className="glow" />
                    <div className="day-view">
                        <div className="day-view-header">
                            <button className="back-btn" onClick={() => setSelectedDay(null)}>
                                ← Journal
                            </button>
                            <h2 className="dv-date">
                                {entry.weekday}, {entry.month} {entry.dayNum}
                            </h2>
                            <div className="dv-meta">
                                <span className="dv-phase-badge">{entry.phase}</span>
                                <span className="dv-cycle-day">Day {entry.cycleDay} of cycle</span>
                            </div>
                        </div>

                        <div className="dv-timeline">
                            <p className="dv-section-label">Notes · {entry.notes.length} entries</p>
                            <div className="dv-notes">
                                {entry.notes.map((note, i) => (
                                    <div key={i} className="dv-note" style={{ animationDelay: `${i * 0.06}s` }}>
                                        <div className="dv-dot-wrap"><div className="dv-dot" /></div>
                                        <div className="dv-note-body">
                                            <div className="dv-note-time">{note.time}</div>
                                            <div className="dv-note-text">{note.text}</div>
                                            {note.tags.length > 0 && (
                                                <div className="dv-note-tags">
                                                    {note.tags.map(t => <span key={t} className={`dv-tag ${t}`}>{t}</span>)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {entry.hasLilith && (
                            <div className="dv-lilith">
                                <div className="dv-lilith-header">
                                    <div className="dv-lilith-dot" />
                                    <span className="dv-lilith-label">Lilith · End of day</span>
                                </div>
                                <p className="dv-lilith-text">{entry.lilithSummary}</p>
                                <div className="dv-lilith-actions">
                                    <button className="dv-action-btn">Ask Lilith</button>
                                    <button className="dv-action-btn">See patterns</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bottom-nav">
                        {[
                            { id: "home", icon: "⚸", label: "Home" },
                            { id: "journal", icon: "◎", label: "Journal" },
                            { id: "lilith", icon: "✦", label: "Lilith" },
                            { id: "calendar", icon: "◫", label: "Cycle" },
                        ].map(item => (
                            <button key={item.id}
                                className={`nav-item ${(activeNav || "journal") === item.id ? "active" : ""}`}
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

    return (
        <>
            <style>{css}</style>
            <div className="journal-root">
                <div className="glow" />

                <div className="list-header">
                    <p className="list-eyebrow">Your story</p>
                    <h1 className="list-title">Journal <em>entries</em></h1>
                    <p className="list-subtitle">Every note you've written, in order.</p>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-num">{MOCK_ENTRIES.length}</div>
                        <div className="stat-label">Days logged</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-num">{totalNotes}</div>
                        <div className="stat-label">Total notes</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-num">25</div>
                        <div className="stat-label">Cycle day</div>
                    </div>
                </div>

                <div className="week-group">
                    <div className="week-label">This week</div>
                    {thisWeek.map((entry, i) => (
                        <button key={entry.id} className="day-card"
                            style={{ animationDelay: `${i * 0.06}s` }}
                            onClick={() => setSelectedDay(entry.id)}>
                            <div className="day-left">
                                <div className="day-num">{entry.dayNum}</div>
                                <div className="day-weekday">{entry.weekday}</div>
                            </div>
                            <div className="day-body">
                                <div className="day-meta">
                                    <div className={`day-phase-dot ${PHASE_COLORS[entry.phase]}`} />
                                    <span className="day-phase-label">{entry.phase}</span>
                                    <span className="day-cycle-num">day {entry.cycleDay}</span>
                                </div>
                                <div className="day-preview">{entry.preview}</div>
                                <div className="day-tags">
                                    {[...new Set(entry.tags)].map(t => (
                                        <span key={t} className={`day-tag ${t}`}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="day-right">
                                <span className="day-note-count">{entry.notes.length}</span>
                                {entry.hasLilith && <div className="day-has-lilith" />}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="week-group">
                    <div className="week-label">Last week</div>
                    {lastWeek.map((entry, i) => (
                        <button key={entry.id} className="day-card"
                            style={{ animationDelay: `${i * 0.06}s` }}
                            onClick={() => setSelectedDay(entry.id)}>
                            <div className="day-left">
                                <div className="day-num">{entry.dayNum}</div>
                                <div className="day-weekday">{entry.weekday}</div>
                            </div>
                            <div className="day-body">
                                <div className="day-meta">
                                    <div className={`day-phase-dot ${PHASE_COLORS[entry.phase]}`} />
                                    <span className="day-phase-label">{entry.phase}</span>
                                    <span className="day-cycle-num">day {entry.cycleDay}</span>
                                </div>
                                <div className="day-preview">{entry.preview}</div>
                                <div className="day-tags">
                                    {[...new Set(entry.tags)].map(t => (
                                        <span key={t} className={`day-tag ${t}`}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="day-right">
                                <span className="day-note-count">{entry.notes.length}</span>
                                {entry.hasLilith && <div className="day-has-lilith" />}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bottom-nav">
                    {[
                        { id: "home", icon: "⚸", label: "Home" },
                        { id: "journal", icon: "◎", label: "Journal" },
                        { id: "lilith", icon: "✦", label: "Lilith" },
                        { id: "calendar", icon: "◫", label: "Cycle" },
                    ].map(item => (
                        <button key={item.id}
                            className={`nav-item ${(activeNav || "journal") === item.id ? "active" : ""}`}
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