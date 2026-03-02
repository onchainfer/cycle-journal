import { useState, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}
@keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulse   { 0%,100%{opacity:0.4} 50%{opacity:1} }
@keyframes grain   {
  0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
  30%{transform:translate(3%,2%)}   50%{transform:translate(-1%,4%)}
  70%{transform:translate(4%,-1%)}  90%{transform:translate(-3%,3%)}
}
@keyframes slideIn  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
@keyframes slideUp  { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
@keyframes spin     { to{transform:rotate(360deg)} }

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
.glow{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(140,100,220,0.07) 0%,transparent 70%);top:-150px;right:-150px;pointer-events:none;z-index:0;}

/* ── LIST VIEW ── */
.list-header{padding:52px 24px 20px;position:relative;z-index:1;animation:fadeUp 0.6s ease both;}
.list-eyebrow{font-size:10px;font-weight:500;letter-spacing:0.25em;text-transform:uppercase;color:var(--lav-dim);margin-bottom:10px;}
.list-title{font-family:'Playfair Display',serif;font-size:32px;font-weight:400;letter-spacing:-0.02em;color:var(--ink);line-height:1.15;}
.list-title em{font-style:italic;color:var(--lav);}
.list-subtitle{font-family:'Crimson Pro',serif;font-style:italic;font-size:15px;color:var(--ink-ghost);margin-top:8px;}

/* Import banner */
.import-banner{
  margin:0 24px 20px;padding:14px 16px;
  background:var(--surface);border:1px solid rgba(196,176,232,0.2);
  border-radius:2px;display:flex;align-items:center;gap:12px;
  cursor:pointer;transition:border-color 0.2s;position:relative;z-index:1;
}
.import-banner:hover{border-color:var(--lav-dim);}
.import-banner-icon{font-size:20px;flex-shrink:0;}
.import-banner-body{flex:1;}
.import-banner-title{font-size:13px;font-weight:500;color:var(--ink-soft);margin-bottom:2px;}
.import-banner-sub{font-family:'Crimson Pro',serif;font-size:13px;font-style:italic;color:var(--ink-ghost);}
.import-banner-arrow{color:var(--ink-ghost);font-size:14px;}

/* Stats */
.stats-row{display:flex;gap:8px;padding:0 24px;margin-bottom:20px;position:relative;z-index:1;animation:fadeUp 0.6s 0.1s ease both;}
.stat-card{flex:1;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:2px;}
.stat-num{font-family:'Playfair Display',serif;font-size:26px;font-weight:400;color:var(--lav);letter-spacing:-0.02em;line-height:1;margin-bottom:4px;}
.stat-label{font-size:9px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-ghost);}

/* Week group */
.week-group{padding:0 24px;margin-bottom:8px;position:relative;z-index:1;animation:fadeUp 0.5s ease both;}
.week-label{font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-ghost);padding:12px 0 8px;border-top:1px solid var(--border);}

/* Day card */
.day-card{display:flex;gap:14px;align-items:flex-start;padding:16px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:all 0.2s;background:transparent;border-left:none;border-right:none;border-top:none;width:100%;text-align:left;font-family:inherit;}
.day-card:hover .day-preview{color:var(--ink-soft);}
.day-card:hover .day-num{color:var(--lav);}
.day-card:last-child{border-bottom:none;}
.day-left{flex-shrink:0;width:40px;text-align:center;}
.day-num{font-family:'Playfair Display',serif;font-size:22px;font-weight:400;color:var(--ink-soft);line-height:1;transition:color 0.2s;}
.day-weekday{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-ghost);margin-top:2px;}
.day-body{flex:1;}
.day-meta{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.day-phase-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.phase-menstrual{background:#c47a7a;}.phase-follicular{background:#8b75b8;}.phase-ovulation{background:#c4b0e8;}.phase-luteal{background:#b87590;}
.day-phase-label{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-ghost);}
.day-cycle-num{font-size:10px;color:var(--ink-ghost);margin-left:auto;}
.day-preview{font-family:'Crimson Pro',serif;font-size:15px;font-style:italic;font-weight:300;color:var(--ink-ghost);line-height:1.5;transition:color 0.2s;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.day-tags{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;}
.day-tag{font-size:9px;padding:2px 7px;border:1px solid var(--border);border-radius:1px;color:var(--ink-ghost);letter-spacing:0.04em;}
.day-tag.physical{border-color:rgba(232,180,196,0.25);color:var(--blossom-dim);}
.day-tag.emotional{border-color:rgba(196,176,232,0.25);color:var(--lav-dim);}
.day-tag.energy{border-color:rgba(212,184,150,0.25);color:var(--gold);}
.day-right{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:4px;padding-top:4px;}
.day-note-count{font-size:10px;color:var(--ink-ghost);}
.day-has-lilith{width:6px;height:6px;border-radius:50%;background:var(--lav);opacity:0.6;}

/* Empty state */
.empty-day{
  padding:16px 0;border-bottom:1px solid var(--border);
  display:flex;gap:14px;align-items:center;
}
.empty-day-left{flex-shrink:0;width:40px;text-align:center;}
.empty-day-num{font-family:'Playfair Display',serif;font-size:22px;font-weight:400;color:var(--ink-ghost);opacity:0.4;line-height:1;}
.empty-day-weekday{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-ghost);opacity:0.3;margin-top:2px;}
.empty-day-add{
  font-family:'Crimson Pro',serif;font-size:14px;font-style:italic;
  color:var(--ink-ghost);opacity:0.4;flex:1;
}
.add-past-btn{
  font-size:11px;padding:4px 10px;border:1px dashed var(--border);
  border-radius:1px;background:transparent;color:var(--ink-ghost);
  cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;
  letter-spacing:0.05em;flex-shrink:0;
}
.add-past-btn:hover{border-color:var(--lav-dim);color:var(--lav);}

/* ── DAY VIEW ── */
.day-view{position:relative;z-index:1;animation:slideIn 0.4s ease both;}
.day-view-header{padding:48px 24px 20px;border-bottom:1px solid var(--border);}
.back-btn{display:flex;align-items:center;gap:6px;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--ink-ghost);cursor:pointer;letter-spacing:0.08em;padding:0;margin-bottom:20px;transition:color 0.2s;}
.back-btn:hover{color:var(--lav);}
.dv-date{font-family:'Playfair Display',serif;font-size:28px;font-weight:400;letter-spacing:-0.02em;color:var(--ink);line-height:1.1;margin-bottom:8px;}
.dv-meta{display:flex;align-items:center;gap:10px;}
.dv-phase-badge{font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;padding:4px 10px;border:1px solid rgba(232,180,196,0.25);border-radius:1px;color:var(--blossom);}
.dv-cycle-day{font-size:11px;color:var(--ink-ghost);font-family:'Crimson Pro',serif;font-style:italic;}

/* Add note to past day */
.dv-add-note-btn{
  display:flex;align-items:center;gap:8px;
  margin:20px 24px 0;padding:12px 16px;
  border:1px dashed var(--border);border-radius:2px;
  background:transparent;width:calc(100% - 48px);
  font-family:'DM Sans',sans-serif;font-size:12px;
  color:var(--ink-ghost);cursor:pointer;transition:all 0.2s;
  letter-spacing:0.05em;
}
.dv-add-note-btn:hover{border-color:var(--lav-dim);color:var(--lav);}

/* Timeline */
.dv-timeline{padding:24px 24px 0;}
.dv-section-label{font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-ghost);margin-bottom:20px;}
.dv-notes{position:relative;}
.dv-notes::before{content:'';position:absolute;left:11px;top:8px;bottom:8px;width:1px;background:var(--border);}
.dv-note{display:flex;gap:16px;padding:10px 0;animation:fadeUp 0.4s ease both;}
.dv-dot-wrap{flex-shrink:0;width:23px;display:flex;justify-content:center;padding-top:6px;}
.dv-dot{width:7px;height:7px;border-radius:50%;border:1px solid var(--lav-dim);background:var(--void);z-index:1;position:relative;flex-shrink:0;}
.dv-note-body{flex:1;}
.dv-note-time{font-size:10px;color:var(--ink-ghost);letter-spacing:0.08em;margin-bottom:5px;}
.dv-note-text{font-family:'Crimson Pro',serif;font-size:18px;font-weight:300;color:var(--ink-soft);line-height:1.6;}
.dv-note-tags{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;}
.dv-tag{font-size:10px;padding:2px 8px;border:1px solid var(--border);border-radius:1px;color:var(--ink-ghost);}
.dv-tag.physical{border-color:rgba(232,180,196,0.3);color:var(--blossom-dim);}
.dv-tag.emotional{border-color:rgba(196,176,232,0.3);color:var(--lav-dim);}
.dv-tag.energy{border-color:rgba(212,184,150,0.3);color:var(--gold);}
.dv-note-delete{background:none;border:none;color:var(--ink-ghost);cursor:pointer;font-size:12px;padding:2px 4px;opacity:0;transition:opacity 0.2s;margin-left:auto;}
.dv-note:hover .dv-note-delete{opacity:1;}

/* Lilith summary */
.dv-lilith{margin:28px 24px 0;background:var(--surface);border:1px solid var(--border);border-radius:2px;padding:20px;position:relative;overflow:hidden;}
.dv-lilith::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--lav-dim),transparent);opacity:0.4;}
.dv-lilith-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.dv-lilith-dot{width:7px;height:7px;border-radius:50%;background:var(--lav);animation:pulse 2.5s ease infinite;}
.dv-lilith-label{font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--lav-dim);}
.dv-lilith-text{font-family:'Crimson Pro',serif;font-size:16px;font-style:italic;color:var(--ink-soft);line-height:1.7;}
.dv-lilith-actions{display:flex;gap:8px;margin-top:14px;}
.dv-action-btn{padding:7px 14px;border:1px solid var(--border);border-radius:1px;background:transparent;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--ink-ghost);cursor:pointer;transition:all 0.2s;letter-spacing:0.05em;}
.dv-action-btn:hover{border-color:var(--lav-dim);color:var(--lav);}

/* ── MODALS ── */
.modal-overlay{position:fixed;inset:0;background:rgba(10,8,16,0.85);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal-sheet{width:100%;max-width:480px;background:var(--surface);border-top:1px solid var(--border);border-radius:2px 2px 0 0;padding:20px 24px 48px;animation:slideUp 0.3s ease both;max-height:85vh;overflow-y:auto;}
.modal-handle{width:32px;height:3px;background:var(--border);border-radius:2px;margin:0 auto 20px;}
.modal-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:400;color:var(--ink);margin-bottom:4px;}
.modal-sub{font-family:'Crimson Pro',serif;font-size:14px;font-style:italic;color:var(--ink-ghost);margin-bottom:20px;}
.modal-label{font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-ghost);margin-bottom:6px;}
.modal-input{width:100%;padding:10px 14px;background:var(--raised);border:1px solid var(--border);border-radius:1px;font-family:'Crimson Pro',serif;font-size:16px;font-style:italic;color:var(--ink);outline:none;caret-color:var(--lav);transition:border-color 0.2s;margin-bottom:14px;}
.modal-input:focus{border-color:var(--lav-dim);}
.modal-input::placeholder{color:var(--ink-ghost);}
.modal-textarea{width:100%;padding:10px 14px;background:var(--raised);border:1px solid var(--border);border-radius:1px;font-family:'Crimson Pro',serif;font-size:16px;font-style:italic;color:var(--ink);outline:none;caret-color:var(--lav);resize:none;min-height:100px;transition:border-color 0.2s;margin-bottom:14px;}
.modal-textarea:focus{border-color:var(--lav-dim);}
.modal-textarea::placeholder{color:var(--ink-ghost);}
.modal-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.modal-tag{padding:6px 12px;border:1px solid var(--border);border-radius:1px;background:transparent;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--ink-ghost);cursor:pointer;transition:all 0.2s;letter-spacing:0.04em;}
.modal-tag.active.physical{border-color:rgba(232,180,196,0.4);color:var(--blossom);background:rgba(232,180,196,0.06);}
.modal-tag.active.emotional{border-color:rgba(196,176,232,0.4);color:var(--lav);background:rgba(196,176,232,0.06);}
.modal-tag.active.energy{border-color:rgba(212,184,150,0.4);color:var(--gold);background:rgba(212,184,150,0.06);}
.modal-actions{display:flex;gap:8px;margin-top:4px;}
.modal-btn{flex:1;padding:13px;border:1px solid var(--border);border-radius:1px;background:transparent;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-ghost);cursor:pointer;transition:all 0.2s;}
.modal-btn:hover{border-color:var(--border-hover);}
.modal-btn.primary{border-color:rgba(196,176,232,0.3);color:var(--lav);}
.modal-btn.primary:hover{background:var(--lav-glow);}
.modal-btn:disabled{opacity:0.3;cursor:not-allowed;}

/* Import mode */
.import-steps{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
.import-step{display:flex;gap:10px;align-items:flex-start;font-size:12px;color:var(--ink-ghost);line-height:1.5;}
.import-step-num{width:18px;height:18px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;margin-top:1px;}
.import-result{background:var(--raised);border:1px solid var(--border);border-radius:1px;padding:12px;margin-bottom:14px;max-height:200px;overflow-y:auto;}
.import-result-item{padding:8px 0;border-bottom:1px solid var(--border);}
.import-result-item:last-child{border-bottom:none;}
.import-result-date{font-size:10px;color:var(--lav-dim);letter-spacing:0.08em;margin-bottom:3px;}
.import-result-text{font-family:'Crimson Pro',serif;font-size:14px;color:var(--ink-soft);font-style:italic;}
.import-result-tags{display:flex;gap:4px;margin-top:4px;}
.import-result-tag{font-size:9px;padding:1px 6px;border:1px solid var(--border);border-radius:1px;color:var(--ink-ghost);}
.import-spinner{display:flex;align-items:center;gap:8px;color:var(--ink-ghost);font-size:12px;padding:8px 0;}
.spinner{width:14px;height:14px;border:2px solid var(--border);border-top-color:var(--lav);border-radius:50%;animation:spin 0.8s linear infinite;}

/* Bottom nav */
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--deep);border-top:1px solid var(--border);display:flex;justify-content:space-around;padding:12px 0 20px;z-index:60;}
.nav-item{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:4px 16px;}
.nav-icon{font-size:18px;line-height:1;opacity:0.4;}
.nav-label{font-size:9px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-ghost);}
.nav-item.active .nav-icon{opacity:1;}
.nav-item.active .nav-label{color:var(--lav);}
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
// getCycleDay is called with the cycle prop startDate at runtime
function getCycleDay(date, cycleStart, cycleLength = 28) {
  if (!cycleStart) return null;
  const start = new Date(cycleStart);
  const diff = Math.floor((date - start) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  return (diff % cycleLength) + 1;
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

function getDaysInRange(start, end) {
  const days = [];
  const cur = new Date(end);
  while (cur >= start) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() - 1);
  }
  return days;
}

const TAG_OPTIONS = ["physical", "emotional", "energy", "food", "movement", "meds"];

// ── SMART IMPORT PARSER ───────────────────────────────────────────────────────
// Parses free-text like:
// "Feb 3 — very tired, headache all day"
// "January 15: started my period, bad cramps"
// "3/10 gym was great, lots of energy"

function parseImportText(raw) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  const results = [];
  const currentYear = new Date().getFullYear();

  const MONTHS = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, may_: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };

  for (const line of lines) {
    if (!line) continue;

    let date = null;
    let text = line;

    // Pattern: "Feb 3", "February 3", "feb 3rd"
    const monthDay = line.match(/^(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?[,\-—:\s]+(.+)/i);
    if (monthDay) {
      const mo = MONTHS[monthDay[1].toLowerCase().replace('_', '')];
      const dy = parseInt(monthDay[2]);
      if (mo !== undefined && dy >= 1 && dy <= 31) {
        date = new Date(currentYear, mo, dy);
        text = monthDay[3].trim();
      }
    }

    // Pattern: "3/10", "10/3", "2026-02-10"
    if (!date) {
      const numDate = line.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-]\d{2,4})?[,\-—:\s]+(.+)/);
      if (numDate) {
        const a = parseInt(numDate[1]), b = parseInt(numDate[2]);
        // assume M/D
        if (a >= 1 && a <= 12 && b >= 1 && b <= 31) {
          date = new Date(currentYear, a - 1, b);
          text = numDate[3].trim();
        }
      }
    }

    // Pattern: ISO "2026-02-10"
    if (!date) {
      const iso = line.match(/^(\d{4}-\d{2}-\d{2})[,\-—:\s]+(.+)/);
      if (iso) {
        date = new Date(iso[1]);
        text = iso[2].trim();
      }
    }

    if (!date || !text) continue;

    // Auto-detect tags from text
    const tags = [];
    const t = text.toLowerCase();
    if (/tired|fatigue|exhausted|cansad|agotad/.test(t)) tags.push("physical");
    if (/headache|dolor|cramps|cólicos|pain|nausea|bloat|senos|breast/.test(t)) tags.push("physical");
    if (/sad|cry|anxious|irritable|triste|llorando|ansiosa|desesperada|mood/.test(t)) tags.push("emotional");
    if (/energy|energía|productive|tired|gym|workout|exercise|gym|entrené/.test(t)) tags.push("energy");
    if (/ate|eat|food|comi|cené|lunch|dinner|breakfast|hungry|craving/.test(t)) tags.push("food");
    if (/gym|yoga|run|walk|exercise|workout|pilates|entrené/.test(t)) tags.push("movement");
    if (/pill|medication|medicamento|pastilla|took|tomé/.test(t)) tags.push("meds");

    results.push({
      id: Date.now() + Math.random(),
      date: dateKey(date),
      displayDate: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      time: "imported",
      text,
      tags: [...new Set(tags)],
    });
  }

  return results.sort((a, b) => a.date.localeCompare(b.date));
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function JournalScreen({ activeNav, setActiveNav, notes: allNotes = [], addNote, addNotes, deleteNote: deleteNoteGlobal, cycle }) {
  const today = new Date();
  // Show 90 days of history
  const rangeStart = new Date(today);
  rangeStart.setDate(today.getDate() - 90);

  // All days in range, newest first
  const allDays = getDaysInRange(rangeStart, today);

  // Group by date
  const notesByDate = {};
  (allNotes || []).forEach(n => {
    if (!notesByDate[n.date]) notesByDate[n.date] = [];
    notesByDate[n.date].push(n);
  });

  // Views
  const [selectedDay, setSelectedDay] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showAddNote, setShowAddNote] = useState(null); // date string

  // Add note modal state
  const [noteText, setNoteText] = useState("");
  const [noteTime, setNoteTime] = useState("");
  const [noteTags, setNoteTags] = useState([]);

  // Import state
  const [importText, setImportText] = useState("");
  const [importParsed, setImportParsed] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  const totalNotes = allNotes.length;
  const daysWithNotes = Object.keys(notesByDate).length;

  const toggleNoteTag = (t) =>
    setNoteTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const saveNote = () => {
    if (!noteText.trim() || !showAddNote) return;
    const newNote = {
      id: Date.now(),
      date: showAddNote,
      time: noteTime || new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      text: noteText.trim(),
      tags: noteTags,
    };
    if (addNote) addNote(newNote);
    setShowAddNote(null);
    setNoteText(""); setNoteTime(""); setNoteTags([]);
  };

  const deleteNote = (id) => {
    if (deleteNoteGlobal) deleteNoteGlobal(id);
  };

  const parseImport = () => {
    if (!importText.trim()) return;
    setImportLoading(true);
    setTimeout(() => {
      const parsed = parseImportText(importText);
      setImportParsed(parsed);
      setImportLoading(false);
    }, 800);
  };

  const confirmImport = () => {
    if (!importParsed) return;
    if (addNotes) addNotes(importParsed);
    else if (addNote) importParsed.forEach(n => addNote(n));
    setShowImport(false);
    setImportText(""); setImportParsed(null);
  };

  // ── DAY DETAIL VIEW ────────────────────────────────────────────────────────
  if (selectedDay) {
    const dayNotes = (notesByDate[selectedDay] || []).sort((a, b) => a.time.localeCompare(b.time));
    const d = new Date(selectedDay + "T12:00:00");
    const cDay = getCycleDay(d, cycle?.startDate, cycle?.cycleLength);
    const phase = getPhase(cDay);
    const isToday = selectedDay === dateKey(today);
    const isFuture = d > today;

    return (
      <>
        <style>{css}</style>
        <div className="journal-root">
          <div className="glow" />
          <div className="day-view">
            <div className="day-view-header">
              <button className="back-btn" onClick={() => setSelectedDay(null)}>← Journal</button>
              <h2 className="dv-date">
                {d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h2>
              <div className="dv-meta">
                {phase && <span className="dv-phase-badge">{phase}</span>}
                {cDay && <span className="dv-cycle-day">Day {cDay} of cycle</span>}
              </div>
            </div>

            {/* Add note to this day */}
            {!isFuture && (
              <button className="dv-add-note-btn" onClick={() => setShowAddNote(selectedDay)}>
                + Add note to {isToday ? "today" : "this day"}
              </button>
            )}

            <div className="dv-timeline">
              <p className="dv-section-label">
                Notes · {dayNotes.length} {dayNotes.length === 1 ? "entry" : "entries"}
              </p>
              {dayNotes.length === 0
                ? <p style={{ fontFamily: "'Crimson Pro',serif", fontStyle: "italic", color: "var(--ink-ghost)", fontSize: 15 }}>
                  No notes for this day yet.
                </p>
                : (
                  <div className="dv-notes">
                    {dayNotes.map((note, i) => (
                      <div key={note.id} className="dv-note" style={{ animationDelay: `${i * 0.06}s` }}>
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
                        <button className="dv-note-delete" onClick={() => deleteNote(note.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          </div>

          {/* Add note modal */}
          {showAddNote && (
            <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddNote(null) }}>
              <div className="modal-sheet">
                <div className="modal-handle" />
                <div className="modal-title">Add note</div>
                <div className="modal-sub">
                  {new Date(showAddNote + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </div>
                <div className="modal-label">Time (optional)</div>
                <input className="modal-input" placeholder="e.g. 9:30 AM, afternoon..." value={noteTime} onChange={e => setNoteTime(e.target.value)} />
                <div className="modal-label">Note</div>
                <textarea className="modal-textarea" placeholder="What did you notice? How did your body feel?" value={noteText} onChange={e => setNoteText(e.target.value)} />
                <div className="modal-label">Tags</div>
                <div className="modal-tags">
                  {TAG_OPTIONS.map(t => (
                    <button key={t} className={`modal-tag ${noteTags.includes(t) ? `active ${t}` : ""}`} onClick={() => toggleNoteTag(t)}>{t}</button>
                  ))}
                </div>
                <div className="modal-actions">
                  <button className="modal-btn" onClick={() => setShowAddNote(null)}>Cancel</button>
                  <button className="modal-btn primary" onClick={saveNote} disabled={!noteText.trim()}>Save note</button>
                </div>
              </div>
            </div>
          )}

          <div className="bottom-nav">
            {[{ id: "home", icon: "⚸", label: "Home" }, { id: "journal", icon: "◎", label: "Journal" }, { id: "lilith", icon: "✦", label: "Lilith" }, { id: "calendar", icon: "◫", label: "Cycle" }].map(item => (
              <button key={item.id} className={`nav-item ${(activeNav || "journal") === item.id ? "active" : ""}`} onClick={() => setActiveNav && setActiveNav(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  // Group days by week
  const thisWeekStart = new Date(today); thisWeekStart.setDate(today.getDate() - today.getDay());
  const lastWeekStart = new Date(thisWeekStart); lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const groupedDays = { "This week": [], "Last week": [], "Earlier": [] };
  allDays.forEach(d => {
    if (d >= thisWeekStart) groupedDays["This week"].push(d);
    else if (d >= lastWeekStart) groupedDays["Last week"].push(d);
    else groupedDays["Earlier"].push(d);
  });

  return (
    <>
      <style>{css}</style>
      <div className="journal-root">
        <div className="glow" />

        <div className="list-header">
          <p className="list-eyebrow">Your story</p>
          <h1 className="list-title">Journal <em>entries</em></h1>
          <p className="list-subtitle">Every note, every day — tap any day to add or edit.</p>
        </div>

        {/* Import banner */}
        <div className="import-banner" onClick={() => setShowImport(true)}>
          <span className="import-banner-icon">📥</span>
          <div className="import-banner-body">
            <div className="import-banner-title">Import past entries</div>
            <div className="import-banner-sub">Paste notes from Google Keep, journal, or any text</div>
          </div>
          <span className="import-banner-arrow">›</span>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{daysWithNotes}</div>
            <div className="stat-label">Days logged</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{totalNotes}</div>
            <div className="stat-label">Total notes</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{cycle?.cycleDay || "—"}</div>
            <div className="stat-label">Cycle day</div>
          </div>
        </div>

        {/* Day list grouped by week */}
        {Object.entries(groupedDays).map(([weekLabel, days]) => {
          if (!days.length) return null;
          return (
            <div key={weekLabel} className="week-group">
              <div className="week-label">{weekLabel}</div>
              {days.map(d => {
                const key = dateKey(d);
                const dayNotes = notesByDate[key] || [];
                const cDay = getCycleDay(d, cycle?.startDate, cycle?.cycleLength);
                const phase = getPhase(cDay);
                const hasNotes = dayNotes.length > 0;
                const preview = hasNotes ? dayNotes[0].text : null;

                if (hasNotes) {
                  return (
                    <button key={key} className="day-card" onClick={() => setSelectedDay(key)}>
                      <div className="day-left">
                        <div className="day-num">{d.getDate()}</div>
                        <div className="day-weekday">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      </div>
                      <div className="day-body">
                        <div className="day-meta">
                          {phase && <div className={`day-phase-dot phase-${phase}`} />}
                          {phase && <span className="day-phase-label">{phase}</span>}
                          {cDay && <span className="day-cycle-num">day {cDay}</span>}
                        </div>
                        <div className="day-preview">{preview}</div>
                        <div className="day-tags">
                          {[...new Set(dayNotes.flatMap(n => n.tags))].map(t => (
                            <span key={t} className={`day-tag ${t}`}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="day-right">
                        <span className="day-note-count">{dayNotes.length}</span>
                      </div>
                    </button>
                  );
                } else {
                  return (
                    <div key={key} className="empty-day">
                      <div className="empty-day-left">
                        <div className="empty-day-num">{d.getDate()}</div>
                        <div className="empty-day-weekday">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      </div>
                      <div className="empty-day-add">No notes</div>
                      <button className="add-past-btn" onClick={() => { setSelectedDay(key); setTimeout(() => setShowAddNote(key), 100); }}>
                        + Add
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}

        {/* ── IMPORT MODAL ── */}
        {showImport && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowImport(false); setImportParsed(null); } }}>
            <div className="modal-sheet">
              <div className="modal-handle" />
              <div className="modal-title">Import past entries</div>
              <div className="modal-sub">Paste your notes and Lilith will parse the dates automatically.</div>

              <div className="import-steps">
                {[
                  "Each line = one entry",
                  "Start with the date: \"Feb 3\", \"2/3\", or \"2026-02-03\"",
                  "Then a separator: dash, colon, or space",
                  "Then your note text"
                ].map((s, i) => (
                  <div key={i} className="import-step">
                    <span className="import-step-num">{i + 1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <div className="modal-label">Your notes</div>
              <textarea
                className="modal-textarea"
                style={{ minHeight: 130 }}
                placeholder={"Feb 3 — very tired, headache all day, didn't go to gym\nFeb 4 — period started, bad cramps in the morning\nFeb 10: energy rising, trained well, felt great\n2/14 — ovulation pain on the left side\nJan 28 — feeling hopeless, I know it's hormonal but it's hard"}
                value={importText}
                onChange={e => { setImportText(e.target.value); setImportParsed(null); }}
              />

              {importLoading && (
                <div className="import-spinner">
                  <div className="spinner" />
                  Parsing your entries...
                </div>
              )}

              {importParsed && importParsed.length > 0 && (
                <>
                  <div className="modal-label">{importParsed.length} entries found — review before saving</div>
                  <div className="import-result">
                    {importParsed.map((item, i) => (
                      <div key={i} className="import-result-item">
                        <div className="import-result-date">{item.displayDate}</div>
                        <div className="import-result-text">{item.text}</div>
                        {item.tags.length > 0 && (
                          <div className="import-result-tags">
                            {item.tags.map(t => <span key={t} className="import-result-tag">{t}</span>)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {importParsed && importParsed.length === 0 && (
                <p style={{ fontFamily: "'Crimson Pro',serif", fontStyle: "italic", color: "var(--ink-ghost)", fontSize: 14, marginBottom: 14 }}>
                  Couldn't parse any entries. Make sure each line starts with a date.
                </p>
              )}

              <div className="modal-actions">
                <button className="modal-btn" onClick={() => { setShowImport(false); setImportParsed(null); }}>Cancel</button>
                {!importParsed
                  ? <button className="modal-btn primary" onClick={parseImport} disabled={!importText.trim()}>Parse entries</button>
                  : <button className="modal-btn primary" onClick={confirmImport} disabled={!importParsed.length}>Save {importParsed.length} entries</button>
                }
              </div>
            </div>
          </div>
        )}

        {/* Add note modal from list view */}
        {showAddNote && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddNote(null) }}>
            <div className="modal-sheet">
              <div className="modal-handle" />
              <div className="modal-title">Add note</div>
              <div className="modal-sub">
                {new Date(showAddNote + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div className="modal-label">Time (optional)</div>
              <input className="modal-input" placeholder="e.g. 9:30 AM, afternoon..." value={noteTime} onChange={e => setNoteTime(e.target.value)} />
              <div className="modal-label">Note</div>
              <textarea className="modal-textarea" placeholder="What did you notice? How did your body feel?" value={noteText} onChange={e => setNoteText(e.target.value)} />
              <div className="modal-label">Tags</div>
              <div className="modal-tags">
                {TAG_OPTIONS.map(t => (
                  <button key={t} className={`modal-tag ${noteTags.includes(t) ? `active ${t}` : ""}`} onClick={() => toggleNoteTag(t)}>{t}</button>
                ))}
              </div>
              <div className="modal-actions">
                <button className="modal-btn" onClick={() => setShowAddNote(null)}>Cancel</button>
                <button className="modal-btn primary" onClick={saveNote} disabled={!noteText.trim()}>Save note</button>
              </div>
            </div>
          </div>
        )}

        <div className="bottom-nav">
          {[{ id: "home", icon: "⚸", label: "Home" }, { id: "journal", icon: "◎", label: "Journal" }, { id: "lilith", icon: "✦", label: "Lilith" }, { id: "calendar", icon: "◫", label: "Cycle" }].map(item => (
            <button key={item.id} className={`nav-item ${(activeNav || "journal") === item.id ? "active" : ""}`} onClick={() => setActiveNav && setActiveNav(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}