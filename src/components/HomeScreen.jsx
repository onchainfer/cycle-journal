import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}
@keyframes grain {
  0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
  30%{transform:translate(3%,2%)} 50%{transform:translate(-1%,4%)}
  70%{transform:translate(4%,-1%)} 90%{transform:translate(-3%,3%)}
}
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --void:#0a0810; --deep:#110e1a; --surface:#1a1626; --raised:#221d30;
  --border:rgba(180,150,255,0.12); --border-hover:rgba(180,150,255,0.35);
  --lav:#c4b0e8; --lav-dim:#8b75b8; --lav-glow:rgba(196,176,232,0.06);
  --blossom:#e8b4c4; --blossom-dim:#b87590;
  --gold:#d4b896; --ink:#f0eaf8; --ink-soft:#b8afd0; --ink-ghost:#6b6380;
}

body { background: var(--void); }

.app {
  min-height: 100vh;
  background: var(--void);
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 80px;
}

/* Grain */
.app::before {
  content:'';position:fixed;inset:-50%;width:200%;height:200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:0.04;pointer-events:none;z-index:100;animation:grain 8s steps(2) infinite;
}

/* Ambient glow */
.glow {
  position:fixed;width:500px;height:500px;border-radius:50%;
  background:radial-gradient(circle,rgba(140,100,220,0.07) 0%,transparent 70%);
  top:-150px;right:-150px;pointer-events:none;z-index:0;
}

/* ── HEADER ── */
.header {
  padding: 52px 24px 20px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.6s ease both;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-greeting {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-ghost);
  margin-bottom: 4px;
}

.header-name {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 400;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.header-symbol {
  font-size: 22px;
  color: var(--lav-dim);
  opacity: 0.6;
}

/* Cycle card */
.cycle-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.cycle-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--lav-dim), transparent);
  opacity: 0.5;
}

.cycle-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.cycle-day-num {
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  font-weight: 400;
  line-height: 1;
  color: var(--lav);
  letter-spacing: -0.03em;
}

.cycle-day-label {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink-ghost);
  margin-top: 6px;
}

.cycle-phase-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.phase-name {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--blossom);
}

.phase-dot-row {
  display: flex;
  gap: 4px;
}

.phase-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--border);
}
.phase-dot.active { background: var(--blossom); }

/* Cycle bar */
.cycle-bar {
  width: 100%;
  height: 2px;
  background: var(--border);
  border-radius: 1px;
  margin-bottom: 8px;
  position: relative;
}

.cycle-bar-fill {
  height: 100%;
  border-radius: 1px;
  background: linear-gradient(90deg, var(--lav-dim), var(--blossom));
  box-shadow: 0 0 8px rgba(196,176,232,0.3);
}

.cycle-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--ink-ghost);
  letter-spacing: 0.08em;
}

/* ── LILITH MESSAGE ── */
.lilith-section {
  padding: 0 24px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.6s 0.1s ease both;
}

.lilith-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 18px 20px;
}

.lilith-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.lilith-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--lav);
  animation: pulse 2.5s ease infinite;
  flex-shrink: 0;
}

.lilith-label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--lav-dim);
}

.lilith-time {
  font-size: 10px;
  color: var(--ink-ghost);
  margin-left: auto;
}

.lilith-text {
  font-family: 'Crimson Pro', serif;
  font-size: 16px;
  font-style: italic;
  color: var(--ink-soft);
  line-height: 1.65;
}

/* ── TODAY'S FEED ── */
.feed-section {
  padding: 0 24px;
  margin-top: 24px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.6s 0.2s ease both;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.feed-title {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-ghost);
}

.feed-date {
  font-size: 11px;
  color: var(--ink-ghost);
  font-family: 'Crimson Pro', serif;
  font-style: italic;
}

/* Note entries */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}

.notes-list::before {
  content: '';
  position: absolute;
  left: 11px; top: 8px; bottom: 8px;
  width: 1px;
  background: var(--border);
}

.note-entry {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 10px 0;
  animation: fadeUp 0.4s ease both;
}

.note-dot-wrap {
  flex-shrink: 0;
  width: 23px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.note-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  border: 1px solid var(--lav-dim);
  background: var(--void);
  flex-shrink: 0;
  z-index: 1;
  position: relative;
}

.note-body { flex: 1; }

.note-time {
  font-size: 10px;
  color: var(--ink-ghost);
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.note-text {
  font-family: 'Crimson Pro', serif;
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.55;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.note-tag {
  font-size: 10px;
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 1px;
  color: var(--ink-ghost);
  letter-spacing: 0.05em;
}

.note-tag.physical { border-color: rgba(232,180,196,0.3); color: var(--blossom-dim); }
.note-tag.emotional { border-color: rgba(196,176,232,0.3); color: var(--lav-dim); }
.note-tag.energy { border-color: rgba(212,184,150,0.3); color: var(--gold); }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 32px 0;
}
.empty-text {
  font-family: 'Crimson Pro', serif;
  font-size: 16px;
  font-style: italic;
  color: var(--ink-ghost);
  line-height: 1.6;
}

/* ── QUICK NOTE INPUT ── */
.quick-note-bar {
  position: fixed;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 432px;
  z-index: 50;
}

.quick-note-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 12px 16px;
  transition: border-color 0.2s;
}

.quick-note-input-row:focus-within {
  border-color: var(--lav-dim);
  box-shadow: 0 0 20px rgba(196,176,232,0.08);
}

.quick-note-input {
  flex: 1;
  background: transparent;
  border: none;
  font-family: 'Crimson Pro', serif;
  font-size: 16px;
  font-style: italic;
  color: var(--ink);
  outline: none;
  caret-color: var(--lav);
}

.quick-note-input::placeholder {
  color: var(--ink-ghost);
}

.quick-note-send {
  width: 32px; height: 32px;
  border-radius: 1px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--lav-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.quick-note-send:hover:not(:disabled) {
  border-color: var(--lav-dim);
  color: var(--lav);
  background: var(--lav-glow);
}
.quick-note-send:disabled { opacity: 0.3; cursor: not-allowed; }

/* ── BOTTOM NAV ── */
.bottom-nav {
  position: fixed;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background: var(--deep);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  padding: 12px 0 20px;
  z-index: 60;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 16px;
  transition: all 0.2s;
}

.nav-icon {
  font-size: 18px;
  line-height: 1;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.nav-label {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-ghost);
  transition: color 0.2s;
}

.nav-item.active .nav-icon { opacity: 1; }
.nav-item.active .nav-label { color: var(--lav); }

/* ── MODAL: Add note expanded ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10,8,16,0.8);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-sheet {
  width: 100%;
  max-width: 480px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-radius: 2px 2px 0 0;
  padding: 24px 24px 40px;
  animation: slideUp 0.3s ease both;
}

.modal-handle {
  width: 32px; height: 3px;
  background: var(--border);
  border-radius: 2px;
  margin: 0 auto 20px;
}

.modal-title {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--lav-dim);
  margin-bottom: 16px;
}

.modal-textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  font-family: 'Crimson Pro', serif;
  font-size: 19px;
  font-style: italic;
  font-weight: 300;
  color: var(--ink);
  line-height: 1.7;
  resize: none;
  outline: none;
  padding: 8px 0;
  caret-color: var(--lav);
  transition: border-color 0.2s;
}
.modal-textarea:focus { border-bottom-color: var(--lav-dim); }
.modal-textarea::placeholder { color: var(--ink-ghost); }

.modal-tags-label {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink-ghost);
  margin: 16px 0 8px;
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 24px;
}

.modal-tag-btn {
  padding: 6px 14px;
  border-radius: 1px;
  border: 1px solid var(--border);
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--ink-ghost);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.04em;
}
.modal-tag-btn:hover { border-color: var(--border-hover); color: var(--ink-soft); }
.modal-tag-btn.sel-phys { border-color: rgba(232,180,196,0.4); color: var(--blossom); background: rgba(232,180,196,0.06); }
.modal-tag-btn.sel-emot { border-color: rgba(196,176,232,0.4); color: var(--lav); background: rgba(196,176,232,0.06); }
.modal-tag-btn.sel-enrg { border-color: rgba(212,184,150,0.4); color: var(--gold); background: rgba(212,184,150,0.06); }

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-cancel {
  background: none; border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; color: var(--ink-ghost);
  cursor: pointer; letter-spacing: 0.08em;
}

.modal-save {
  padding: 12px 32px;
  border: 1px solid rgba(196,176,232,0.3);
  border-radius: 1px;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--lav);
  cursor: pointer;
  transition: all 0.25s;
}
.modal-save:hover:not(:disabled) {
  background: rgba(196,176,232,0.08);
  border-color: var(--lav-dim);
}
.modal-save:disabled { opacity: 0.3; cursor: not-allowed; }

@media (min-width: 480px) {
  .bottom-nav, .quick-note-bar { max-width: 480px; }
}
`;

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const TAG_OPTIONS = [
  { value: "physical", label: "Physical", cls: "sel-phys" },
  { value: "emotional", label: "Emotional", cls: "sel-emot" },
  { value: "energy", label: "Energy", cls: "sel-enrg" },
];

function getTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function HomeScreen({ profile, cycle, notes: allNotes, addNote, todayNotes, activeNav, setActiveNav, onOpenSettings }) {
  const name = profile?.name || "";

  // Real cycle data — empty if not set yet
  const cycleDay = cycle?.cycleDay || null;
  const cycleDays = cycle?.cycleLength || 28;
  const phase = cycle?.phase || null;
  const progress = cycleDay ? (cycleDay / cycleDays) * 100 : 0;

  // Phase dots: how far into the 4-phase cycle are we
  const phaseIndex = phase === "menstrual" ? 0 : phase === "follicular" ? 1 : phase === "ovulation" ? 2 : phase === "luteal" ? 3 : -1;
  const phaseDots = [0, 1, 2, 3].map(i => i <= phaseIndex);

  // Today's notes from App.js global state
  const todayKey = new Date().toISOString().split("T")[0];
  const notes = (todayNotes || allNotes || []).filter(n => n.date === todayKey);
  const [quickText, setQuickText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const toggleTag = (val) => setSelectedTags(t => t.includes(val) ? t.filter(x => x !== val) : [...t, val]);

  const saveNote = (text, tags) => {
    if (!text.trim()) return;
    if (addNote) addNote({ text: text.trim(), tags, date: todayKey });
  };

  const handleQuickSend = () => {
    saveNote(quickText, []);
    setQuickText("");
  };

  const handleQuickFocus = () => {
    setModalText(quickText);
    setQuickText("");
    setModalOpen(true);
  };

  const handleModalSave = () => {
    saveNote(modalText, selectedTags);
    setModalText("");
    setSelectedTags([]);
    setModalOpen(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="glow" />

        {/* ── HEADER ── */}
        <div className="header">
          <div className="header-top">
            <div>
              <p className="header-greeting">{new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}</p>
              <h1 className="header-name">{name || <span style={{ fontStyle: "italic", opacity: 0.4, fontSize: "0.8em" }}>your name</span>}</h1>
            </div>
            <span className="header-symbol" onClick={() => onOpenSettings && onOpenSettings()} style={{ cursor: "pointer" }}>⚸</span>
          </div>

          {/* Cycle card */}
          <div className="cycle-card">
            {cycleDay ? (
              <>
                <div className="cycle-card-top">
                  <div>
                    <div className="cycle-day-num">{cycleDay}</div>
                    <div className="cycle-day-label">Day of cycle</div>
                  </div>
                  <div className="cycle-phase-badge">
                    <span className="phase-name">{phase}</span>
                    <div className="phase-dot-row">
                      {phaseDots.map((a, i) => (
                        <div key={i} className={`phase-dot ${a ? "active" : ""}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="cycle-bar">
                  <div className="cycle-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="cycle-bar-labels">
                  <span>Day 1</span>
                  <span>Day {cycleDays}</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <p style={{ fontFamily: "'Crimson Pro',serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-ghost)", marginBottom: 10 }}>
                  Tell Lilith when your last period started to track your cycle.
                </p>
                <button
                  onClick={() => setActiveNav("lilith")}
                  style={{ padding: "8px 18px", border: "1px solid rgba(196,176,232,0.3)", borderRadius: 1, background: "transparent", fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)", cursor: "pointer" }}>
                  Tell Lilith ✦
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── LILITH MESSAGE ── */}
        <div className="lilith-section">
          <div className="lilith-card" onClick={() => setActiveNav("lilith")} style={{ cursor: "pointer" }}>
            <div className="lilith-header">
              <div className="lilith-dot" />
              <span className="lilith-label">Lilith</span>
              <span className="lilith-time">Today</span>
            </div>
            <p className="lilith-text">
              {phase === "menstrual" && "Your body is shedding and resetting. Rest is productive right now — don't push it. Iron-rich foods and heat for cramps."}
              {phase === "follicular" && "Energy is rising. This is your window for new projects, harder workouts, and social plans. Your brain is sharper right now."}
              {phase === "ovulation" && "You're at your peak — physically and mentally. Your communication skills and confidence are highest today."}
              {phase === "luteal" && cycleDay && cycleDay >= 22 && "Late luteal phase. What you're feeling has a name. Progesterone is dropping, estrogen is low. Rest, complex carbs, and be gentle with yourself."}
              {phase === "luteal" && cycleDay && cycleDay < 22 && "Early luteal phase. A good time to wind down intensity and focus on recovery. Notice what your body needs."}
              {!phase && "Start tracking your cycle and I'll give you daily insights based on where you are. Tap to chat with me."}
            </p>
          </div>
        </div>

        {/* ── FEED ── */}
        <div className="feed-section">
          <div className="feed-header">
            <span className="feed-title">Today's notes</span>
            <span className="feed-date">{today}</span>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">Nothing yet today.<br />How are you feeling?</p>
            </div>
          ) : (
            <div className="notes-list">
              {notes.map((note, idx) => (
                <div key={note.id} className="note-entry" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="note-dot-wrap">
                    <div className="note-dot" />
                  </div>
                  <div className="note-body">
                    <div className="note-time">{note.time}</div>
                    <div className="note-text">{note.text}</div>
                    {note.tags.length > 0 && (
                      <div className="note-tags">
                        {note.tags.map(tag => (
                          <span key={tag} className={`note-tag ${tag}`}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── QUICK NOTE BAR ── */}
        <div className="quick-note-bar">
          <div className="quick-note-input-row">
            <input
              className="quick-note-input"
              placeholder="What are you noticing right now..."
              value={quickText}
              onChange={e => setQuickText(e.target.value)}
              onFocus={handleQuickFocus}
              onKeyDown={e => { if (e.key === "Enter" && quickText.trim()) handleQuickSend(); }}
            />
            <button className="quick-note-send" onClick={handleQuickSend} disabled={!quickText.trim()}>
              ↑
            </button>
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        <div className="bottom-nav">
          {[
            { id: "home", icon: "⚸", label: "Home" },
            { id: "journal", icon: "◎", label: "Journal" },
            { id: "lilith", icon: "✦", label: "Lilith" },
            { id: "calendar", icon: "◫", label: "Cycle" },
          ].map(item => (
            <button key={item.id} className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => setActiveNav(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* ── MODAL ── */}
        {modalOpen && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
            <div className="modal-sheet">
              <div className="modal-handle" />
              <p className="modal-title">Add to today · {getTime()}</p>
              <textarea
                className="modal-textarea"
                rows={4}
                placeholder="What are you noticing? How does your body feel? Any thoughts..."
                value={modalText}
                onChange={e => setModalText(e.target.value)}
                autoFocus
              />
              <p className="modal-tags-label">Tag this note</p>
              <div className="modal-tags">
                {TAG_OPTIONS.map(t => (
                  <button key={t.value}
                    className={`modal-tag-btn ${selectedTags.includes(t.value) ? t.cls : ""}`}
                    onClick={() => toggleTag(t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="modal-footer">
                <button className="modal-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button className="modal-save" onClick={handleModalSave} disabled={!modalText.trim()}>
                  Save note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}