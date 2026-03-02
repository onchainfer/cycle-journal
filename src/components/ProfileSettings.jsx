import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}
@keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
@keyframes slideUp { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
@keyframes grain   {
  0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
  30%{transform:translate(3%,2%)}   50%{transform:translate(-1%,4%)}
  70%{transform:translate(4%,-1%)}  90%{transform:translate(-3%,3%)}
}
@keyframes checkIn { from{transform:scale(0)} to{transform:scale(1)} }

*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --void:#0a0810;--deep:#110e1a;--surface:#1a1626;--raised:#221d30;
  --border:rgba(180,150,255,0.12);--border-hover:rgba(180,150,255,0.35);
  --lav:#c4b0e8;--lav-dim:#8b75b8;--lav-glow:rgba(196,176,232,0.06);
  --blossom:#e8b4c4;--blossom-dim:#b87590;
  --gold:#d4b896;--ink:#f0eaf8;--ink-soft:#b8afd0;--ink-ghost:#6b6380;
}
body{background:var(--void);}

.ps-root{
  min-height:100vh;background:var(--void);
  font-family:'DM Sans',sans-serif;color:var(--ink);
  max-width:480px;margin:0 auto;padding-bottom:80px;
  position:relative;
}

.ps-root::before{
  content:'';position:fixed;inset:-50%;width:200%;height:200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:0.04;pointer-events:none;z-index:100;animation:grain 8s steps(2) infinite;
}
.glow{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(140,100,220,0.07) 0%,transparent 70%);top:-150px;right:-150px;pointer-events:none;z-index:0;}

/* ── HEADER ── */
.ps-header{
  padding:52px 24px 24px;position:relative;z-index:1;
  animation:fadeUp 0.5s ease both;
}
.ps-back{
  display:flex;align-items:center;gap:6px;background:none;border:none;
  font-family:'DM Sans',sans-serif;font-size:12px;color:var(--ink-ghost);
  cursor:pointer;letter-spacing:0.08em;padding:0;margin-bottom:20px;transition:color 0.2s;
}
.ps-back:hover{color:var(--lav);}

.ps-profile-row{
  display:flex;align-items:center;gap:16px;margin-bottom:8px;
}
.ps-avatar{
  width:52px;height:52px;border-radius:50%;
  border:1px solid var(--lav-dim);background:var(--surface);
  display:flex;align-items:center;justify-content:center;
  font-size:22px;color:var(--lav-dim);flex-shrink:0;
}
.ps-name{
  font-family:'Playfair Display',serif;
  font-size:26px;font-weight:400;letter-spacing:-0.02em;color:var(--ink);
}
.ps-meta{
  font-family:'Crimson Pro',serif;font-size:14px;
  font-style:italic;color:var(--ink-ghost);margin-top:2px;
}

/* ── SECTION ── */
.ps-section{
  padding:0 24px;margin-bottom:8px;
  position:relative;z-index:1;
  animation:fadeUp 0.5s ease both;
}
.ps-section-label{
  font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;
  color:var(--ink-ghost);padding:16px 0 8px;
  border-top:1px solid var(--border);
}

/* ── ROW ITEMS ── */
.ps-row{
  display:flex;align-items:center;gap:12px;
  padding:14px 0;border-bottom:1px solid var(--border);
  cursor:pointer;background:none;border-left:none;border-right:none;border-top:none;
  width:100%;text-align:left;font-family:inherit;transition:opacity 0.15s;
}
.ps-row:last-child{border-bottom:none;}
.ps-row:hover{opacity:0.8;}
.ps-row-icon{
  width:36px;height:36px;border-radius:1px;
  border:1px solid var(--border);background:var(--surface);
  display:flex;align-items:center;justify-content:center;
  font-size:16px;flex-shrink:0;
}
.ps-row-body{flex:1;}
.ps-row-title{font-size:14px;font-weight:500;color:var(--ink-soft);}
.ps-row-sub{font-size:11px;color:var(--ink-ghost);margin-top:2px;font-family:'Crimson Pro',serif;font-style:italic;}
.ps-row-arrow{font-size:14px;color:var(--ink-ghost);}
.ps-row-badge{
  font-size:10px;padding:3px 8px;border-radius:1px;
  border:1px solid rgba(196,176,232,0.2);color:var(--lav-dim);
  letter-spacing:0.05em;
}

/* ── MY TEAM ── */
.team-cards{display:flex;flex-direction:column;gap:8px;}
.team-card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:2px;padding:16px;
  position:relative;overflow:hidden;
}
.team-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--lav-dim),transparent);
  opacity:0.3;
}
.team-card-header{
  display:flex;align-items:center;gap:10px;margin-bottom:10px;
}
.team-role-icon{font-size:20px;}
.team-role-label{
  font-size:10px;font-weight:500;letter-spacing:0.18em;
  text-transform:uppercase;color:var(--lav-dim);
}
.team-card-name{
  font-family:'Playfair Display',serif;
  font-size:16px;font-weight:400;color:var(--ink);margin-bottom:4px;
}
.team-card-sub{
  font-size:11px;color:var(--ink-ghost);
  font-family:'Crimson Pro',serif;font-style:italic;
}
.team-card-actions{
  display:flex;gap:6px;margin-top:12px;
}
.team-action{
  padding:7px 14px;border:1px solid var(--border);border-radius:1px;
  background:transparent;font-family:'DM Sans',sans-serif;
  font-size:11px;color:var(--ink-ghost);cursor:pointer;
  transition:all 0.2s;letter-spacing:0.04em;
}
.team-action:hover{border-color:var(--lav-dim);color:var(--lav);}
.team-action.primary{
  border-color:rgba(196,176,232,0.3);color:var(--lav);
}
.team-action.primary:hover{background:var(--lav-glow);}

.team-add{
  display:flex;align-items:center;justify-content:center;gap:8px;
  padding:16px;border:1px dashed var(--border);border-radius:2px;
  background:transparent;font-family:'DM Sans',sans-serif;
  font-size:12px;color:var(--ink-ghost);cursor:pointer;
  transition:all 0.2s;letter-spacing:0.05em;width:100%;
}
.team-add:hover{border-color:var(--lav-dim);color:var(--lav);}

/* ── REPORTS ── */
.report-cards{display:flex;flex-direction:column;gap:8px;}
.report-card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:2px;padding:16px 18px;
  display:flex;align-items:flex-start;gap:12px;
  cursor:pointer;transition:border-color 0.2s;
}
.report-card:hover{border-color:var(--border-hover);}
.report-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
.report-body{flex:1;}
.report-title{font-size:13px;font-weight:500;color:var(--ink-soft);margin-bottom:3px;}
.report-desc{font-family:'Crimson Pro',serif;font-size:13px;font-style:italic;color:var(--ink-ghost);line-height:1.5;}
.report-meta{
  font-size:10px;color:var(--lav-dim);margin-top:6px;
  letter-spacing:0.05em;
}
.report-dl{
  width:28px;height:28px;border:1px solid var(--border);border-radius:1px;
  background:transparent;color:var(--ink-ghost);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-size:14px;transition:all 0.2s;flex-shrink:0;
}
.report-dl:hover{border-color:var(--lav-dim);color:var(--lav);}
.report-dl.done{border-color:var(--lav-dim);color:var(--lav);animation:checkIn 0.3s ease;}

/* ── CHANGES LOG ── */
.changes-list{display:flex;flex-direction:column;position:relative;}
.changes-list::before{
  content:'';position:absolute;left:11px;top:8px;bottom:8px;
  width:1px;background:var(--border);
}
.change-item{
  display:flex;gap:14px;padding:10px 0;
}
.change-dot-wrap{
  flex-shrink:0;width:23px;
  display:flex;justify-content:center;padding-top:5px;
}
.change-dot{
  width:7px;height:7px;border-radius:50%;
  background:var(--void);border:1px solid var(--lav-dim);
  z-index:1;position:relative;
}
.change-dot.meds{border-color:var(--blossom-dim);}
.change-dot.lifestyle{border-color:var(--gold);}
.change-body{flex:1;}
.change-date{font-size:10px;color:var(--ink-ghost);letter-spacing:0.06em;margin-bottom:3px;}
.change-text{font-family:'Crimson Pro',serif;font-size:15px;font-weight:300;color:var(--ink-soft);line-height:1.5;}
.change-badge{
  display:inline-block;font-size:9px;padding:2px 7px;
  border-radius:1px;margin-top:4px;letter-spacing:0.06em;
}
.change-badge.meds{border:1px solid rgba(232,180,196,0.25);color:var(--blossom-dim);}
.change-badge.lifestyle{border:1px solid rgba(212,184,150,0.25);color:var(--gold);}

/* ── REPORT PREVIEW SHEET ── */
.sheet-overlay{
  position:fixed;inset:0;background:rgba(10,8,16,0.85);
  backdrop-filter:blur(6px);z-index:200;
  display:flex;align-items:flex-end;justify-content:center;
}
.report-sheet{
  width:100%;max-width:480px;background:var(--surface);
  border-top:1px solid var(--border);border-radius:2px 2px 0 0;
  padding:20px 24px 48px;animation:slideUp 0.3s ease both;
  max-height:85vh;overflow-y:auto;
}
.sheet-handle{width:32px;height:3px;background:var(--border);border-radius:2px;margin:0 auto 20px;}
.report-preview-header{margin-bottom:20px;}
.report-preview-eyebrow{
  font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;
  color:var(--lav-dim);margin-bottom:8px;
}
.report-preview-title{
  font-family:'Playfair Display',serif;font-size:22px;font-weight:400;
  letter-spacing:-0.01em;color:var(--ink);margin-bottom:4px;
}
.report-preview-sub{
  font-family:'Crimson Pro',serif;font-size:14px;font-style:italic;
  color:var(--ink-ghost);
}
.report-section{margin-bottom:20px;}
.report-section-title{
  font-size:10px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;
  color:var(--ink-ghost);margin-bottom:10px;padding-bottom:6px;
  border-bottom:1px solid var(--border);
}
.report-line{
  display:flex;justify-content:space-between;align-items:flex-start;
  padding:5px 0;border-bottom:1px solid rgba(180,150,255,0.06);
}
.report-line:last-child{border-bottom:none;}
.report-line-key{font-size:12px;color:var(--ink-ghost);flex-shrink:0;width:45%;}
.report-line-val{font-size:12px;color:var(--ink-soft);text-align:right;flex:1;}
.report-lilith-block{
  background:var(--raised);border:1px solid var(--border);
  border-radius:1px;padding:14px;margin-top:8px;
}
.report-lilith-label{
  font-size:9px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;
  color:var(--lav-dim);margin-bottom:8px;
}
.report-lilith-text{
  font-family:'Crimson Pro',serif;font-size:14px;font-style:italic;
  color:var(--ink-soft);line-height:1.7;
}
.report-quote{
  padding:10px 14px;border-left:2px solid var(--lav-dim);
  margin:6px 0;
}
.report-quote-text{
  font-family:'Crimson Pro',serif;font-size:13px;font-style:italic;
  color:var(--ink-ghost);line-height:1.6;
}
.report-quote-date{font-size:10px;color:var(--ink-ghost);margin-top:3px;letter-spacing:0.05em;}
.sheet-actions{display:flex;gap:8px;margin-top:20px;}
.sheet-btn{
  flex:1;padding:14px;border:1px solid var(--border);border-radius:1px;
  background:transparent;font-family:'DM Sans',sans-serif;
  font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--ink-ghost);cursor:pointer;transition:all 0.2s;
}
.sheet-btn:hover{border-color:var(--lav-dim);color:var(--lav);}
.sheet-btn.primary{border-color:rgba(196,176,232,0.3);color:var(--lav);}
.sheet-btn.primary:hover{background:var(--lav-glow);}

/* bottom nav */
.bottom-nav{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:480px;background:var(--deep);
  border-top:1px solid var(--border);
  display:flex;justify-content:space-around;padding:12px 0 20px;z-index:60;
}
.nav-item{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:4px 16px;}
.nav-icon{font-size:18px;line-height:1;opacity:0.4;}
.nav-label{font-size:9px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-ghost);}
.nav-item.active .nav-icon{opacity:1;}
.nav-item.active .nav-label{color:var(--lav);}
`;

const REPORTS = [
  {
    id: "doctor",
    icon: "👩‍⚕️",
    title: "Medical Report",
    desc: "Clinical overview for your doctor: symptom patterns, emotional state, cycle consistency, and Lilith's observations.",
    meta: "Includes emotional & physical symptoms · 3 cycles",
    type: "doctor",
  },
  {
    id: "nutritionist",
    icon: "🥗",
    title: "Nutrition Report",
    desc: "Food patterns by phase, cravings, energy after meals, bloating, and nutritional needs per cycle phase.",
    meta: "Nutrition + cycle correlation · 3 cycles",
    type: "nutritionist",
  },
  {
    id: "trainer",
    icon: "🏋️",
    title: "Training Report",
    desc: "Performance by phase, gym days with low energy or dizziness, recovery patterns, and optimal training windows.",
    meta: "Performance + cycle correlation · 3 cycles",
    type: "trainer",
  },
  {
    id: "symptoms",
    icon: "📊",
    title: "Symptom Summary",
    desc: "Full breakdown of all symptoms logged, frequency, intensity by phase, and patterns across cycles.",
    meta: "All symptoms · 84 days tracked",
    type: "symptoms",
  },
  {
    id: "changes",
    icon: "📋",
    title: "Medication History",
    desc: "Timeline of all medication and lifestyle changes logged, with cycle context for each change.",
    meta: "Changes log · All time",
    type: "changes",
  },
];



const REPORT_CONTENT = {
  doctor: {
    eyebrow: "Clinical Report",
    title: "Medical Cycle Report",
    sub: "For your doctor · Generated Feb 28, 2026",
    sections: [
      {
        title: "Patient Overview",
        lines: [
          { key: "Name", val: "Fernanda" },
          { key: "Age", val: "28" },
          { key: "Conditions", val: "PMDD" },
          { key: "Medications", val: "Sertraline 75mg" },
          { key: "Contraception", val: "None (stopped Jan 2026)" },
          { key: "Cycles tracked", val: "3 cycles (84 days)" },
          { key: "Avg cycle length", val: "27 days" },
        ]
      },
      {
        title: "Physical Symptom Patterns",
        lines: [
          { key: "Severe fatigue", val: "Days 23–28 (consistent)" },
          { key: "Headaches", val: "Days 1–3 and 25–27" },
          { key: "Bloating", val: "Days 20–27" },
          { key: "Breast tenderness", val: "Days 19–26" },
          { key: "Dizziness", val: "Days 24–26, occasionally" },
        ]
      },
      {
        title: "Emotional & Psychological Patterns",
        lines: [
          { key: "Hopelessness / despair", val: "Days 24–27 · 3 cycles consistent" },
          { key: "Anxiety spikes", val: "Days 22–26" },
          { key: "Irritability", val: "Days 21–27" },
          { key: "Low mood", val: "Days 23–28" },
          { key: "Symptom remission", val: "Within 24–48h of menstruation" },
        ]
      },
    ],
    lilith: "The patient consistently reports feelings of hopelessness and despair on days 24–27 of her cycle, coinciding with the late luteal phase. This pattern has repeated across 3 consecutive cycles with high consistency. Emotional symptoms resolve within 24–48 hours of menstruation onset — a hallmark presentation of PMDD. Notably, since starting sertraline in December 2025, the patient reports reduced intensity of symptoms but persistent timing. Consider evaluating current dosage and PMDD-specific protocols.",
    quotes: [
      { text: "I don't want to do anything, nothing feels meaningful", date: "Feb 25, 2026 · Day 25" },
      { text: "I'm crying for no reason, I know it's hormonal but it still hurts", date: "Feb 24, 2026 · Day 24" },
      { text: "I feel hopeless but I know in 3 days it'll pass", date: "Jan 27, 2026 · Day 26" },
    ]
  },
  nutritionist: {
    eyebrow: "Nutrition Report",
    title: "Nutrition & Cycle Report",
    sub: "For your nutritionist · Generated Feb 28, 2026",
    sections: [
      {
        title: "Eating Patterns by Phase",
        lines: [
          { key: "Menstrual (days 1–5)", val: "Reduced appetite, craves warm foods" },
          { key: "Follicular (days 6–13)", val: "Normal appetite, eats varied" },
          { key: "Ovulation (days 14–16)", val: "High energy, light meals" },
          { key: "Luteal (days 17–28)", val: "Strong cravings for sugar & carbs" },
        ]
      },
      {
        title: "Notable Patterns",
        lines: [
          { key: "Sugar cravings", val: "Days 22–27, daily reports" },
          { key: "Bloating post-meal", val: "Days 20–27, even with light meals" },
          { key: "Energy crashes", val: "After lunch on days 24–27" },
          { key: "Skips breakfast", val: "Frequently on days 1–3" },
        ]
      },
    ],
    lilith: "Nutritionally, this patient shows a clear pattern of carbohydrate and sugar cravings in the late luteal phase (days 22–27), which is consistent with falling serotonin levels. The post-meal bloating in this window suggests possible progesterone-driven gut sensitivity. Follicular and ovulation phases show the best nutritional variety and energy. Targeted nutritional support in the luteal phase — particularly tryptophan-rich foods, complex carbs, and reduced caffeine — may help reduce symptom severity.",
    quotes: [
      { text: "Intense sugar cravings, ate fruit but it wasn't enough", date: "Feb 25, 2026" },
      { text: "Had a normal dinner but got very bloated", date: "Feb 23, 2026" },
    ]
  },
  trainer: {
    eyebrow: "Training Report",
    title: "Performance & Cycle Report",
    sub: "For your trainer · Generated Feb 28, 2026",
    sections: [
      {
        title: "Performance by Phase",
        lines: [
          { key: "Menstrual (days 1–5)", val: "Low energy, reduced training" },
          { key: "Follicular (days 6–13)", val: "Peak performance, high motivation" },
          { key: "Ovulation (days 14–16)", val: "Best strength & endurance" },
          { key: "Luteal (days 17–22)", val: "Moderate, slight decline" },
          { key: "Late luteal (days 23–28)", val: "Significant strength drop (10–15%)" },
        ]
      },
      {
        title: "Reported Incidents",
        lines: [
          { key: "Dizziness at gym", val: "Days 24–26, 3 occurrences" },
          { key: "Early fatigue", val: "Days 23–27, consistent" },
          { key: "Strength drop", val: "Days 23–28, self-reported" },
          { key: "Frustration / low motivation", val: "Days 22–27" },
        ]
      },
    ],
    lilith: "This patient's training performance follows a clear cycle-synced pattern. Peak strength and motivation occur in the follicular and ovulation phases (days 6–16). A consistent and significant performance drop occurs in the late luteal phase (days 23–28), accompanied by dizziness on gym days — likely related to low estrogen affecting vascular tone and blood sugar regulation. Training intensity should be reduced in this window. Strength training, HIIT, and high-intensity cardio are best scheduled for days 6–16.",
    quotes: [
      { text: "Went to the gym but it was rough, less strength than normal, got frustrated", date: "Feb 25, 2026" },
      { text: "Got dizzy at the gym, had to stop", date: "Feb 24, 2026" },
    ]
  },
};

export default function ProfileSettings({ onBack, onReset, activeNav, setActiveNav, profile = {}, cycle = {}, notes = [], changes = [] }) {
  const [reportPreview, setReportPreview] = useState(null);
  const [downloaded, setDownloaded] = useState({});

  const handleDownload = (id) => {
    setDownloaded(d => ({ ...d, [id]: true }));
    setTimeout(() => setDownloaded(d => ({ ...d, [id]: false })), 2000);
  };

  const safeStr = (val) => {
    if (!val) return "—";
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.map(v => typeof v === "string" ? v : v.name || v.label || "").filter(Boolean).join(", ");
    if (typeof val === "object") return val.name || val.label || Object.values(val).filter(v => typeof v === "string").join(", ");
    return String(val);
  };

  const buildReportContent = (type) => {
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const noteCount = notes.length;
    const base = {
      doctor: {
        eyebrow: "Clinical Report", title: "Medical Cycle Report",
        sub: `For your doctor · Generated ${today}`,
        sections: [{
          title: "Patient Overview",
          lines: [
            { key: "Name", val: safeStr(profile.name) },
            { key: "Age", val: safeStr(profile.age) },
            { key: "Conditions", val: safeStr(profile.conditions) },
            { key: "Medications", val: safeStr(profile.medications) },
            { key: "Contraception", val: safeStr(profile.contraception) },
            { key: "Cycle length", val: cycle.cycleLength ? `${cycle.cycleLength} days` : "—" },
            { key: "Notes logged", val: noteCount > 0 ? `${noteCount} notes` : "None yet" },
          ]
        }],
        lilith: noteCount > 5
          ? `Based on ${noteCount} logged entries, patterns are beginning to emerge. Continue tracking for more detailed insights.`
          : "Not enough data yet to generate clinical observations. Keep logging daily notes for Lilith to find patterns.",
        quotes: notes.filter(n => n.tags?.includes("emotional")).slice(-3).map(n => ({
          text: n.text, date: n.date
        }))
      },
      nutritionist: {
        eyebrow: "Nutrition Report", title: "Nutrition & Cycle Report",
        sub: `For your nutritionist · Generated ${today}`,
        sections: [{
          title: "Overview",
          lines: [
            { key: "Notes with food tag", val: `${notes.filter(n => n.tags?.includes("food")).length}` },
            { key: "Cycle phase now", val: safeStr(cycle.phase) },
          ]
        }],
        lilith: "Nutrition patterns will appear here as you log more food-tagged notes.",
        quotes: notes.filter(n => n.tags?.includes("food")).slice(-3).map(n => ({ text: n.text, date: n.date }))
      },
      trainer: {
        eyebrow: "Training Report", title: "Training & Cycle Report",
        sub: `For your trainer · Generated ${today}`,
        sections: [{
          title: "Overview",
          lines: [
            { key: "Notes with movement tag", val: `${notes.filter(n => n.tags?.includes("movement")).length}` },
            { key: "Current phase", val: safeStr(cycle.phase) },
          ]
        }],
        lilith: "Training performance patterns will appear here as you log more movement-tagged notes.",
        quotes: notes.filter(n => n.tags?.includes("movement")).slice(-3).map(n => ({ text: n.text, date: n.date }))
      },
    };
    return base[type] || null;
  };

  const content = reportPreview ? buildReportContent(reportPreview) : null;

  return (
    <>
      <style>{css}</style>
      <div className="ps-root">
        <div className="glow" />

        {/* ── HEADER ── */}
        <div className="ps-header">
          <button className="ps-back" onClick={onBack}>← Back</button>
          <div className="ps-profile-row">
            <div className="ps-avatar">⚸</div>
            <div>
              <div className="ps-name">{profile.name || "Your profile"}</div>
              <div className="ps-meta">
                {[
                  cycle.cycleDay ? `Day ${cycle.cycleDay}` : null,
                  cycle.phase,
                  profile.conditions && (Array.isArray(profile.conditions) ? profile.conditions[0] : typeof profile.conditions === "string" ? profile.conditions : null)
                ].filter(Boolean).join(" · ") || "Complete your profile in onboarding"}
              </div>
            </div>
          </div>
        </div>

        {/* ── MY TEAM ── */}
        <div className="ps-section">
          <div className="ps-section-label">My team</div>
          <div className="team-cards">
            <div style={{ padding: "20px", textAlign: "center", fontFamily: "'Crimson Pro',serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-ghost)" }}>
              Add your doctor, nutritionist, or trainer to share reports with them.
            </div>
            <button className="team-add">+ Add someone to your team</button>
          </div>
        </div>

        {/* ── REPORTS ── */}
        <div className="ps-section">
          <div className="ps-section-label">Download reports</div>
          <div className="report-cards">
            {REPORTS.map(r => (
              <div key={r.id} className="report-card"
                onClick={() => r.type !== "changes" && setReportPreview(r.type)}>
                <span className="report-icon">{r.icon}</span>
                <div className="report-body">
                  <div className="report-title">{r.title}</div>
                  <div className="report-desc">{r.desc}</div>
                  <div className="report-meta">{r.meta}</div>
                </div>
                <button className={`report-dl ${downloaded[r.id] ? "done" : ""}`}
                  onClick={e => { e.stopPropagation(); handleDownload(r.id); }}>
                  {downloaded[r.id] ? "✓" : "↓"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── CHANGES LOG ── */}
        <div className="ps-section">
          <div className="ps-section-label">Medication & lifestyle changes</div>
          <div className="changes-list">
            {changes.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", fontFamily: "'Crimson Pro',serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-ghost)" }}>
                Changes you tell Lilith — new medications, lifestyle changes, cycle events — will appear here automatically.
              </div>
            ) : (
              [...changes].reverse().map((ch, i) => (
                <div key={ch.id || i} className="change-item">
                  <div className="change-dot-wrap">
                    <div className={`change-dot ${ch.type || "cycle"}`} />
                  </div>
                  <div className="change-body">
                    <div className="change-date">{ch.date}</div>
                    <div className="change-text">{ch.text}</div>
                    <span className={`change-badge ${ch.type || "cycle"}`}>{ch.badge || "Update"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── RESET ── */}
        <div className="ps-section">
          <div className="ps-section-label">Account</div>
          <button
            onClick={() => { if (window.confirm("Reset all data? This will clear your profile, notes, and cycle history.")) onReset && onReset(); }}
            style={{ width: "100%", padding: "12px", border: "1px solid rgba(232,122,122,0.3)", borderRadius: 1, background: "transparent", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(232,122,122,0.7)", cursor: "pointer", transition: "all 0.2s" }}>
            Reset all data
          </button>
        </div>

        {/* ── SETTINGS ── */}
        <div className="ps-section">
          <div className="ps-section-label">Settings</div>
          {[
            { icon: "✦", title: "Lilith's language", sub: "English", arrow: true },
            { icon: "◎", title: "Notification preferences", sub: "Daily reminder at 9pm", arrow: true },
            { icon: "⚸", title: "Cycle settings", sub: "28-day cycle · Started Feb 4", arrow: true },
            { icon: "🔒", title: "Privacy & data", sub: "Your data stays yours", arrow: true },
          ].map((item, i) => (
            <button key={i} className="ps-row">
              <div className="ps-row-icon">{item.icon}</div>
              <div className="ps-row-body">
                <div className="ps-row-title">{item.title}</div>
                <div className="ps-row-sub">{item.sub}</div>
              </div>
              {item.arrow && <span className="ps-row-arrow">›</span>}
            </button>
          ))}
        </div>

        {/* ── REPORT PREVIEW SHEET ── */}
        {reportPreview && content && (
          <div className="sheet-overlay"
            onClick={e => { if (e.target === e.currentTarget) setReportPreview(null); }}>
            <div className="report-sheet">
              <div className="sheet-handle" />
              <div className="report-preview-header">
                <div className="report-preview-eyebrow">{content.eyebrow}</div>
                <div className="report-preview-title">{content.title}</div>
                <div className="report-preview-sub">{content.sub}</div>
              </div>

              {content.sections.map((sec, i) => (
                <div key={i} className="report-section">
                  <div className="report-section-title">{sec.title}</div>
                  {sec.lines.map((l, j) => (
                    <div key={j} className="report-line">
                      <span className="report-line-key">{l.key}</span>
                      <span className="report-line-val">{l.val}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="report-section">
                <div className="report-section-title">Lilith's observations</div>
                <div className="report-lilith-block">
                  <div className="report-lilith-label">✦ Lilith</div>
                  <div className="report-lilith-text">{content.lilith}</div>
                </div>
              </div>

              {content.quotes && (
                <div className="report-section">
                  <div className="report-section-title">Notable entries</div>
                  {content.quotes.map((q, i) => (
                    <div key={i} className="report-quote">
                      <div className="report-quote-text">"{q.text}"</div>
                      <div className="report-quote-date">{q.date}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="sheet-actions">
                <button className="sheet-btn" onClick={() => setReportPreview(null)}>Close</button>
                <button className="sheet-btn primary">Share with doctor</button>
                <button className="sheet-btn primary">Download PDF</button>
              </div>
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
              className={`nav-item ${(activeNav || "") === item.id ? "active" : ""}`}
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