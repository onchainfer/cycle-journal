import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}
@keyframes grain {
  0%, 100% { transform: translate(0,0); }
  10%       { transform: translate(-2%,-3%); }
  30%       { transform: translate(3%,2%); }
  50%       { transform: translate(-1%,4%); }
  70%       { transform: translate(4%,-1%); }
  90%       { transform: translate(-3%,3%); }
}

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --void:    #0a0810;
  --deep:    #110e1a;
  --surface: #1a1626;
  --raised:  #221d30;
  --border:  rgba(180,150,255,0.12);
  --border-hover: rgba(180,150,255,0.35);
  --lav:     #c4b0e8;
  --lav-dim: #8b75b8;
  --lav-glow:rgba(196,176,232,0.08);
  --blossom: #e8b4c4;
  --blossom-dim: #b87590;
  --gold:    #d4b896;
  --ink:     #f0eaf8;
  --ink-soft:#b8afd0;
  --ink-ghost:#6b6380;
}

.ob-root {
  min-height: 100vh;
  background: var(--void);
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  position: relative;
  overflow-x: hidden;
}

/* Grain overlay */
.ob-root::before {
  content: '';
  position: fixed;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
  z-index: 100;
  animation: grain 8s steps(2) infinite;
}

/* Ambient glow */
.ob-glow {
  position: fixed;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(140,100,220,0.06) 0%, transparent 70%);
  top: -200px; right: -200px;
  pointer-events: none;
  z-index: 0;
}

/* Lang screen */
.lang-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.8s ease both;
}

.lang-symbol {
  font-size: 48px;
  color: var(--lav-dim);
  margin-bottom: 32px;
  display: block;
  opacity: 0.7;
  letter-spacing: -2px;
}

.lang-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(36px, 7vw, 56px);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: 8px;
  line-height: 1.1;
}

.lang-title em {
  font-style: italic;
  color: var(--lav);
}

.lang-sub {
  font-size: 14px;
  color: var(--ink-ghost);
  margin-bottom: 56px;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.lang-btns {
  display: flex;
  gap: 12px;
}

.lang-btn {
  padding: 14px 44px;
  border: 1px solid var(--border);
  border-radius: 1px;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.25s;
}

.lang-btn:hover {
  border-color: var(--lav-dim);
  color: var(--lav);
  background: var(--lav-glow);
}

/* Progress */
.ob-progress {
  height: 1px;
  background: var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.ob-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--lav-dim), var(--blossom));
  transition: width 0.5s ease;
  box-shadow: 0 0 12px rgba(196,176,232,0.4);
}

/* Nav */
.ob-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

.ob-back {
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--ink-ghost);
  cursor: pointer;
  letter-spacing: 0.08em;
  padding: 0;
  transition: color 0.2s;
}
.ob-back:hover { color: var(--lav); }

.ob-step-count {
  font-size: 10px;
  color: var(--ink-ghost);
  letter-spacing: 0.2em;
  font-family: 'DM Sans', sans-serif;
}

.ob-skip {
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--ink-ghost);
  cursor: pointer;
  letter-spacing: 0.08em;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.ob-skip:hover { color: var(--ink-soft); }

/* Screen */
.ob-screen {
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  padding: 8px 40px 48px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.5s ease both;
}

.ob-eyebrow {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--lav-dim);
  margin-bottom: 16px;
}

.ob-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(26px, 4.5vw, 40px);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.02em;
  white-space: pre-line;
  margin-bottom: 12px;
  color: var(--ink);
}

.ob-title em {
  font-style: italic;
  color: var(--lav);
}

.ob-sub {
  font-family: 'Crimson Pro', serif;
  font-size: 17px;
  color: var(--ink-ghost);
  line-height: 1.6;
  margin-bottom: 36px;
  font-weight: 300;
  font-style: italic;
}

/* Input */
.ob-input {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-bottom: 1px solid var(--border);
  font-family: 'Crimson Pro', serif;
  font-size: 22px;
  font-weight: 300;
  color: var(--ink);
  background: transparent;
  outline: none;
  transition: border-color 0.25s;
  caret-color: var(--lav);
}
.ob-input:focus { border-bottom-color: var(--lav-dim); }
.ob-input::placeholder { color: var(--ink-ghost); font-style: italic; }
.ob-input-sm { font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 10px 0; }

.ob-date {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid var(--border);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: var(--ink);
  background: transparent;
  outline: none;
  transition: border-color 0.25s;
  color-scheme: dark;
}
.ob-date:focus { border-bottom-color: var(--lav-dim); }

.field-label {
  display: block;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-ghost);
  margin-bottom: 8px;
  margin-top: 28px;
}

/* Cards */
.ob-cards { display: flex; flex-direction: column; gap: 8px; }

.ob-card {
  padding: 16px 20px;
  border: 1px solid var(--border);
  border-radius: 1px;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.ob-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--lav-glow);
  opacity: 0;
  transition: opacity 0.2s;
}
.ob-card:hover { border-color: var(--border-hover); }
.ob-card:hover::before { opacity: 1; }
.ob-card.sel-lav { background: rgba(196,176,232,0.08); border-color: var(--lav-dim); }
.ob-card.sel-blos { background: rgba(232,180,196,0.08); border-color: var(--blossom-dim); }

.ob-card-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-soft);
  position: relative;
}
.ob-card.sel-lav .ob-card-label { color: var(--lav); }
.ob-card.sel-blos .ob-card-label { color: var(--blossom); }

.ob-card-sub {
  font-size: 12px;
  color: var(--ink-ghost);
  margin-top: 3px;
  font-weight: 300;
  position: relative;
}

/* Chips */
.ob-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }

.ob-chip {
  padding: 8px 16px;
  border-radius: 1px;
  border: 1px solid var(--border);
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--ink-ghost);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}
.ob-chip:hover { border-color: var(--border-hover); color: var(--lav); }
.ob-chip.sel-lav { background: rgba(196,176,232,0.1); border-color: var(--lav-dim); color: var(--lav); }
.ob-chip.sel-blos { background: rgba(232,180,196,0.1); border-color: var(--blossom-dim); color: var(--blossom); }

/* Divider */
.ob-divider { border: none; border-top: 1px solid var(--border); margin: 32px 0; }

.ob-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  line-height: 1.3;
  white-space: pre-line;
  margin-bottom: 18px;
  color: var(--ink-soft);
}

/* Food grid */
.ob-food-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ob-food-card {
  padding: 18px 16px;
  border: 1px solid var(--border);
  border-radius: 1px;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.ob-food-card:hover { border-color: var(--border-hover); background: rgba(232,180,196,0.06); }
.ob-food-card.selected { background: rgba(232,180,196,0.08); border-color: var(--blossom-dim); }

.ob-food-emoji { font-size: 26px; margin-bottom: 10px; display: block; }
.ob-food-label { font-size: 13px; font-weight: 500; color: var(--ink-soft); margin-bottom: 4px; }
.ob-food-card.selected .ob-food-label { color: var(--blossom); }
.ob-food-sub { font-size: 11px; color: var(--ink-ghost); line-height: 1.4; }

/* Textarea */
.ob-textarea {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-bottom: 1px solid var(--border);
  font-family: 'Crimson Pro', serif;
  font-size: 19px;
  font-weight: 300;
  font-style: italic;
  line-height: 1.8;
  color: var(--ink);
  background: transparent;
  resize: none;
  outline: none;
  transition: border-color 0.25s;
  caret-color: var(--lav);
}
.ob-textarea:focus { border-bottom-color: var(--lav-dim); }
.ob-textarea::placeholder { color: var(--ink-ghost); }

.ob-optional {
  font-size: 11px;
  color: var(--ink-ghost);
  margin-top: 14px;
  font-style: italic;
  line-height: 1.6;
  font-family: 'Crimson Pro', serif;
}

/* Medications */
.ob-med-row { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-end; }
.ob-med-row .ob-input-sm:first-child { flex: 2; }
.ob-med-row .ob-input-sm:last-child { flex: 1; }

.ob-add-btn {
  background: none; border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; color: var(--lav-dim);
  cursor: pointer; letter-spacing: 0.05em;
  padding: 8px 0; text-align: left;
  transition: color 0.2s;
}
.ob-add-btn:hover { color: var(--lav); }

.ob-none-btn {
  background: none; border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; color: var(--ink-ghost);
  cursor: pointer; letter-spacing: 0.05em;
  padding: 8px 0; text-decoration: underline;
  text-underline-offset: 3px;
}

/* CTA */
.ob-cta-wrap {
  padding: 0 40px 48px;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

.ob-cta {
  width: 100%;
  padding: 18px;
  border: 1px solid rgba(196,176,232,0.3);
  border-radius: 1px;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--lav);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.ob-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(196,176,232,0.08), rgba(232,180,196,0.08));
  opacity: 0;
  transition: opacity 0.3s;
}
.ob-cta:hover:not(:disabled)::before { opacity: 1; }
.ob-cta:hover:not(:disabled) { border-color: var(--lav-dim); box-shadow: 0 0 24px rgba(196,176,232,0.12); }
.ob-cta:disabled { border-color: var(--border); color: var(--ink-ghost); cursor: not-allowed; }

/* All set */
.allset-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  max-width: 520px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.8s ease both;
}

.allset-symbol {
  font-size: 52px;
  color: var(--lav-dim);
  margin-bottom: 36px;
  display: block;
  opacity: 0.8;
}

.allset-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 6vw, 50px);
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  line-height: 1.15;
  color: var(--ink);
}

.allset-name { font-style: italic; color: var(--lav); }

.allset-sub {
  font-family: 'Crimson Pro', serif;
  font-size: 18px;
  color: var(--ink-ghost);
  line-height: 1.7;
  margin-bottom: 48px;
  font-weight: 300;
  font-style: italic;
}

/* Lilith intro card */
.lilith-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1px;
  padding: 20px 24px;
  margin-bottom: 32px;
  text-align: left;
  position: relative;
  width: 100%;
}
.lilith-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.lilith-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--lav);
  animation: pulse 2.5s ease infinite;
  flex-shrink: 0;
}
.lilith-name {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--lav-dim);
}
.lilith-msg {
  font-family: 'Crimson Pro', serif;
  font-size: 16px;
  font-style: italic;
  color: var(--ink-soft);
  line-height: 1.6;
}

@media (max-width: 520px) {
  .ob-screen, .ob-nav, .ob-cta-wrap { padding-left: 24px; padding-right: 24px; }
  .ob-food-grid { grid-template-columns: 1fr 1fr; }
  .lang-btns { flex-direction: column; }
}
`;

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
    en: {
        langTitle: "Own your \nbiology",
        langSub: "Choose your language",
        langEn: "English", langEs: "Español",
        skip: "Skip", back: "Back", continue: "Continue", allSet: "Begin",
        s1Title: "First — what's\nyour name?", s1Sub: "Just your first name.", s1Placeholder: "Your name...",
        s2Title: "How old are you?", s2Sub: "Your age gives context to your hormonal story.", s2DobLabel: "Date of birth",
        s3Title: "When did your\nlast period start?", s3Sub: "Approximate is fine — we're not building a court case.", s3Label: "First day of last period",
        s4Title: "How long is your\ncycle, usually?", s4Sub: "From the first day of one period to the first day of the next.",
        s4Options: [
            { value: "short", label: "Under 25 days", sub: "Shorter than average" },
            { value: "normal", label: "25–32 days", sub: "The classic range" },
            { value: "long", label: "33–40 days", sub: "On the longer side" },
            { value: "irregular", label: "All over the place", sub: "No two cycles are the same" },
            { value: "unknown", label: "Honestly no idea", sub: "That's what we're here for" },
        ],
        s5Title: "What does your\nperiod look like?", s5Sub: "We know it's personal. It tells us a lot.",
        s5Options: [
            { value: "light", label: "Light & breezy", sub: "Barely there, light flow" },
            { value: "medium", label: "Pretty standard", sub: "Medium flow, manageable" },
            { value: "heavy", label: "Full send", sub: "Heavy flow, goes through products fast" },
            { value: "very_heavy", label: "It's a lot", sub: "Very heavy, sometimes clots" },
            { value: "variable", label: "Depends on the month", sub: "Changes cycle to cycle" },
        ],
        s5ColorLabel: "Color", s5Colors: ["Light pink", "Bright red", "Dark red", "Brown", "Mixed"],
        s5PainLabel: "Pain level",
        s5PainOptions: ["No pain at all", "Mild, barely notice it", "Moderate, affects my day", "Severe, I can't function"],
        s6Title: "Does your body have\nanything extra going on?", s6Sub: "Diagnosed or just suspected — select all that apply.",
        s6Physical: ["PMDD", "Endometriosis", "PCOS", "Fibroids", "Thyroid disorder", "Anemia", "Diabetes", "None", "Other"],
        s6NeuroTitle: "Some of us are wired\na little differently.",
        s6Neuro: ["ADHD", "Autism", "Anxiety disorder", "Depression", "Bipolar disorder", "Other", "Prefer not to say"],
        s7Title: "Any hormonal\ncontraception?", s7Sub: "This changes how your cycle behaves — important context.",
        s7Options: [
            { value: "none", label: "No hormonal contraception" },
            { value: "pill", label: "The pill" },
            { value: "iud_h", label: "Hormonal IUD (Mirena, Kyleena...)" },
            { value: "iud_c", label: "Copper IUD (non-hormonal)" },
            { value: "implant", label: "Implant / Nexplanon" },
            { value: "patch", label: "Patch or ring" },
            { value: "injection", label: "Injection (Depo-Provera)" },
            { value: "other", label: "Something else" },
        ],
        s7BrandLabel: "Brand / name (optional)", s7BrandPlaceholder: "e.g. Yasmin, Mirena...",
        s7DurationLabel: "How long have you been using it?", s7DurationPlaceholder: "e.g. 2 years",
        s8Title: "Any other medications\nor supplements?", s8Sub: "Antidepressants, thyroid meds, vitamins — anything daily.",
        s8Add: "+ Add another", s8NamePlaceholder: "Name", s8DosePlaceholder: "Dose", s8None: "None right now",
        s9Title: "A little more context\nabout your life.", s9Sub: "No judgment. Just context.",
        s9KidsLabel: "Do you have children?", s9KidsOptions: ["Yes", "No", "Pregnant / trying", "Prefer not to say"],
        s9SexLabel: "Are you sexually active?", s9SexOptions: ["Yes, regularly", "Sometimes", "No", "Prefer not to say"],
        s10Title: "How do you\nmove your body?", s10Sub: "All kinds of movement count — there's no right answer.",
        s10FreqLabel: "How often?",
        s10FreqOptions: ["Every day, no exceptions", "4–5 times a week", "2–3 times a week", "Once a week or less", "I'm in my sedentary era"],
        s10TypeLabel: "What kind? (pick all that apply)",
        s10Types: ["Gym / weights", "Running", "Yoga / pilates", "Swimming", "Dance", "Walking", "Team sports", "Cycling", "Home workouts", "Other"],
        s11Title: "How's your sleep?", s11Sub: "Be honest. We've heard it all.",
        s11Options: [
            { value: "great", label: "I wake up ready to take on the world", sub: "Deep, restful, consistent" },
            { value: "good", label: "Pretty good, no complaints", sub: "Usually 7–8 hours, feel rested" },
            { value: "meh", label: "8 hours but could use 10 more", sub: "Sleep a lot but never feel caught up" },
            { value: "broken", label: "I sleep but it barely counts", sub: "Light, interrupted, or anxious sleep" },
            { value: "bad", label: "What is sleep", sub: "Chronically exhausted, can't rest" },
        ],
        s12Title: "What does your diet\nlook like, mostly?", s12Sub: "Pick what feels most like your plate. More than one is fine.",
        s12Options: [
            { value: "mediterranean", label: "Mediterranean", sub: "Veg, olive oil, fish, grains", emoji: "🫒" },
            { value: "plant_based", label: "Plant-based", sub: "Mostly or fully vegetarian/vegan", emoji: "🥦" },
            { value: "high_protein", label: "High protein", sub: "Meat, eggs, protein-focused", emoji: "🥩" },
            { value: "balanced", label: "Balanced & varied", sub: "A bit of everything", emoji: "🍱" },
            { value: "comfort", label: "Comfort-led", sub: "I eat what feels good", emoji: "🍝" },
            { value: "intuitive", label: "Intuitive eating", sub: "No rules, listening to my body", emoji: "🌿" },
            { value: "restricted", label: "Medical / restricted", sub: "Gluten-free, low-FODMAP, etc.", emoji: "⚕️" },
            { value: "irregular", label: "Irregular / chaotic", sub: "Skipping meals, no real pattern", emoji: "🤷‍♀️" },
        ],
        s12Extra: "Anything else about your eating? (optional)", s12ExtraPlaceholder: "e.g. I skip breakfast, food intolerances...",
        s13Title: "Why are you here?", s13Sub: "What do you want to understand about yourself?",
        s13Options: [
            { value: "understand", label: "Understand my cycle", sub: "What's actually happening in my body" },
            { value: "pmdd", label: "Manage PMDD / mood symptoms", sub: "Track the emotional side of my cycle" },
            { value: "planning", label: "Plan around my cycle", sub: "Work, workouts, social life — sync it all" },
            { value: "fertility", label: "Fertility awareness", sub: "Conceiving or avoiding pregnancy" },
            { value: "patterns", label: "Find patterns", sub: "Something feels off and I want to know what" },
            { value: "health", label: "General health tracking", sub: "A holistic picture of how I feel" },
        ],
        s14Title: "Last one — tell us\nabout yourself.", s14Sub: "In your own words. Your lifestyle, how you usually feel, what matters to you. Anything you'd want Lilith to understand about you.", s14Placeholder: "I'm someone who...", s14Optional: "Optional — but the more you share, the more personalized your insights will be.",
        s15Title: "We’re in,", s15Sub: "Your baseline is set and Lilith is officially online. Start logging your days—the more you tell her, the faster she’ll start spotting the patterns you’ve been missing.", s15Cta: "Sync with Lilith",
        s15LilithMsg: "Hey! I’m Lilith, your biological co-pilot. I’m here to decode your cycle with more precision than any clinic ever would. Let's map your unique rhythm together—I've got your back.",
    },
    es: {
        langTitle: "Ella que nunca\nfue domada.",
        langSub: "Elige tu idioma",
        langEn: "English", langEs: "Español",
        skip: "Omitir", back: "Atrás", continue: "Continuar", allSet: "Comenzar",
        s1Title: "Primero — ¿cómo\nte llamas?", s1Sub: "Solo tu nombre.", s1Placeholder: "Tu nombre...",
        s2Title: "¿Cuántos años tienes?", s2Sub: "Tu edad da contexto a tu historia hormonal.", s2DobLabel: "Fecha de nacimiento",
        s3Title: "¿Cuándo comenzó\ntu último período?", s3Sub: "Aproximado está bien — no estamos construyendo un caso legal.", s3Label: "Primer día de tu último período",
        s4Title: "¿Cuánto dura tu\nciclo, normalmente?", s4Sub: "Desde el primer día de un período hasta el primero del siguiente.",
        s4Options: [
            { value: "short", label: "Menos de 25 días", sub: "Más corto que el promedio" },
            { value: "normal", label: "25–32 días", sub: "El rango clásico" },
            { value: "long", label: "33–40 días", sub: "Del lado largo" },
            { value: "irregular", label: "Completamente irregular", sub: "Cada ciclo es distinto" },
            { value: "unknown", label: "Honestamente no sé", sub: "Para eso estamos aquí" },
        ],
        s5Title: "¿Cómo luce\ntu período?", s5Sub: "Sabemos que es personal. Nos dice mucho.",
        s5Options: [
            { value: "light", label: "Ligero y tranquilo", sub: "Flujo leve, casi imperceptible" },
            { value: "medium", label: "Normal", sub: "Flujo moderado, manejable" },
            { value: "heavy", label: "Intenso", sub: "Flujo abundante, cambia productos seguido" },
            { value: "very_heavy", label: "Es bastante", sub: "Muy abundante, a veces con coágulos" },
            { value: "variable", label: "Depende del mes", sub: "Cambia de ciclo en ciclo" },
        ],
        s5ColorLabel: "Color", s5Colors: ["Rosa claro", "Rojo brillante", "Rojo oscuro", "Café", "Mixto"],
        s5PainLabel: "Nivel de dolor",
        s5PainOptions: ["Sin dolor", "Leve, casi no lo noto", "Moderado, afecta mi día", "Severo, no puedo funcionar"],
        s6Title: "¿Tu cuerpo tiene algo\nextra que considerar?", s6Sub: "Diagnosticado o sospechado — selecciona todo lo que aplique.",
        s6Physical: ["PMDD", "Endometriosis", "SOP / PCOS", "Fibromas", "Tiroides", "Anemia", "Diabetes", "Ninguno", "Otro"],
        s6NeuroTitle: "Algunas de nosotras\nestamos cableadas diferente.",
        s6Neuro: ["TDAH", "Autismo", "Trastorno de ansiedad", "Depresión", "Trastorno bipolar", "Otro", "Prefiero no decir"],
        s7Title: "¿Usas algún método\nanticonceptivo hormonal?", s7Sub: "Esto cambia cómo funciona tu ciclo — contexto importante.",
        s7Options: [
            { value: "none", label: "No uso anticonceptivos hormonales" },
            { value: "pill", label: "Pastilla anticonceptiva" },
            { value: "iud_h", label: "DIU hormonal (Mirena, Kyleena...)" },
            { value: "iud_c", label: "DIU de cobre (no hormonal)" },
            { value: "implant", label: "Implante / Nexplanon" },
            { value: "patch", label: "Parche o anillo" },
            { value: "injection", label: "Inyección (Depo-Provera)" },
            { value: "other", label: "Otro" },
        ],
        s7BrandLabel: "Marca / nombre (opcional)", s7BrandPlaceholder: "ej. Yasmin, Mirena...",
        s7DurationLabel: "¿Cuánto tiempo llevas usándolo?", s7DurationPlaceholder: "ej. 2 años",
        s8Title: "¿Tomas otros\nmedicamentos o suplementos?", s8Sub: "Antidepresivos, tiroides, vitaminas — lo que sea parte de tu rutina diaria.",
        s8Add: "+ Agregar otro", s8NamePlaceholder: "Nombre", s8DosePlaceholder: "Dosis", s8None: "Ninguno por ahora",
        s9Title: "Un poco más de contexto\nsobre tu vida.", s9Sub: "Sin juicio. Solo contexto.",
        s9KidsLabel: "¿Tienes hijos?", s9KidsOptions: ["Sí", "No", "Embarazada / intentando", "Prefiero no decir"],
        s9SexLabel: "¿Tienes actividad sexual?", s9SexOptions: ["Sí, regularmente", "A veces", "No", "Prefiero no decir"],
        s10Title: "¿Cómo mueves\ntu cuerpo?", s10Sub: "Todo tipo de movimiento cuenta — no hay respuesta correcta.",
        s10FreqLabel: "¿Con qué frecuencia?",
        s10FreqOptions: ["Todos los días, sin excepción", "4–5 veces a la semana", "2–3 veces a la semana", "Una vez a la semana o menos", "Estoy en mi era sedentaria"],
        s10TypeLabel: "¿Qué tipo? (elige todos los que apliquen)",
        s10Types: ["Gym / pesas", "Correr", "Yoga / pilates", "Natación", "Baile", "Caminar", "Deportes de equipo", "Ciclismo", "Ejercicio en casa", "Otro"],
        s11Title: "¿Cómo está\ntu sueño?", s11Sub: "Sé honesta. Ya lo hemos escuchado todo.",
        s11Options: [
            { value: "great", label: "Despierto lista para comerse el mundo", sub: "Profundo, reparador, consistente" },
            { value: "good", label: "Bastante bien, sin quejas", sub: "Generalmente 7–8 horas, me siento descansada" },
            { value: "meh", label: "Dormí 8 horas pero me faltaron 10", sub: "Duermo mucho pero nunca me recupero del todo" },
            { value: "broken", label: "Duermo pero casi no cuenta", sub: "Sueño ligero, interrumpido o ansioso" },
            { value: "bad", label: "¿Qué es el sueño?", sub: "Crónicamente cansada, me cuesta descansar" },
        ],
        s12Title: "¿Cómo luce tu\nalimentación, mayormente?", s12Sub: "Elige lo que más se parezca a tu plato. Puedes elegir más de uno.",
        s12Options: [
            { value: "mediterranean", label: "Mediterránea", sub: "Verdura, aceite de oliva, pescado, granos", emoji: "🫒" },
            { value: "plant_based", label: "Basada en plantas", sub: "Mayormente vegetariana/vegana", emoji: "🥦" },
            { value: "high_protein", label: "Alta en proteína", sub: "Carne, huevos, proteína primero", emoji: "🥩" },
            { value: "balanced", label: "Balanceada y variada", sub: "Un poco de todo", emoji: "🍱" },
            { value: "comfort", label: "Por placer", sub: "Como lo que me hace sentir bien", emoji: "🍝" },
            { value: "intuitive", label: "Alimentación intuitiva", sub: "Sin reglas, escuchando mi cuerpo", emoji: "🌿" },
            { value: "restricted", label: "Médica / restringida", sub: "Sin gluten, low-FODMAP, etc.", emoji: "⚕️" },
            { value: "irregular", label: "Irregular / caótica", sub: "Me salto comidas, sin patrón", emoji: "🤷‍♀️" },
        ],
        s12Extra: "¿Algo más sobre tu alimentación? (opcional)", s12ExtraPlaceholder: "ej. Me salto el desayuno, intolerancias...",
        s13Title: "¿Por qué estás aquí?", s13Sub: "¿Qué quieres entender sobre ti misma?",
        s13Options: [
            { value: "understand", label: "Entender mi ciclo", sub: "Qué está pasando realmente en mi cuerpo" },
            { value: "pmdd", label: "Manejar el PMDD / síntomas emocionales", sub: "Registrar el lado emocional de mi ciclo" },
            { value: "planning", label: "Planear alrededor de mi ciclo", sub: "Trabajo, ejercicio, vida social — todo sincronizado" },
            { value: "fertility", label: "Conciencia de fertilidad", sub: "Concebir o evitar el embarazo" },
            { value: "patterns", label: "Encontrar patrones", sub: "Algo no se siente bien y quiero saber qué" },
            { value: "health", label: "Seguimiento de salud general", sub: "Una visión holística de cómo me siento" },
        ],
        s14Title: "Última — cuéntanos\nsobre ti.", s14Sub: "Con tus propias palabras. Tu estilo de vida, cómo te sueles sentir, qué te importa. Lo que quieras que Lilith entienda sobre ti.", s14Placeholder: "Soy alguien que...", s14Optional: "Opcional — pero cuanto más compartas, más personalizados serán tus insights.",
        s15Title: "Bienvenida,", s15Sub: "Tu perfil está listo. Lilith está aquí. Empieza a registrar tus días y ella comenzará a encontrar tus patrones.", s15Cta: "Empezar mi primera entrada",
        s15LilithMsg: "Hola. Soy Lilith — y ya sé más sobre tu ciclo de lo que la mayoría de los médicos te han preguntado. Vamos a descubrirte.",
    }
};

const TOTAL = 14;

export default function Onboarding({ onComplete }) {
    const [lang, setLang] = useState(null);
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState({
        name: "", dob: "", lastPeriod: "", cycleLength: "",
        periodFlow: "", periodColor: [], periodPain: "",
        physicalConditions: [], neuroConditions: [],
        contraception: "", contraceptionBrand: "", contraceptionDuration: "",
        medications: [{ name: "", dose: "" }], noMeds: false,
        kids: "", sexualActivity: "",
        exerciseFreq: "", exerciseTypes: [],
        sleep: "",
        nutrition: [], nutritionExtra: "",
        goal: "",
        selfDescription: "",
    });

    const t = lang ? T[lang] : T.en;
    const set = (f, v) => setProfile(p => ({ ...p, [f]: v }));
    const toggleArr = (f, v) => setProfile(p => ({
        ...p, [f]: p[f].includes(v) ? p[f].filter(x => x !== v) : [...p[f], v]
    }));

    const next = () => setStep(s => Math.min(s + 1, TOTAL + 1));
    const back = () => setStep(s => Math.max(s - 1, 1));

    // Start screen - single button
    if (!lang) return (
        <>
            {/* Mantenemos tu CSS original y SOLO añadimos las definiciones de animación */}
            <style>{`
            ${css} 

            /* 1. Definición de Animación para la Black Moon (⚸) */
            @keyframes breatheMoon {
                0%, 100% { opacity: 0.6; transform: scale(1); filter: blur(0px); }
                50% { opacity: 1; transform: scale(1.05); filter: blur(1px); }
            }

            /* 2. Definición de Animación para el Botón (Pulse Glow) */
            @keyframes ctaGlow {
                0%, 100% { 
                    box-shadow: 0 0 5px rgba(232, 180, 196, 0.2); 
                    border-color: rgba(232, 180, 196, 0.4); 
                }
                50% { 
                    box-shadow: 0 0 20px rgba(232, 180, 196, 0.7); 
                    border-color: rgba(232, 180, 196, 0.9); 
                }
            }

            /* Aplicamos la animación a la luna */
            .lang-symbol {
                display: inline-block; /* Necesario para que el transform funcione */
                animation: breatheMoon 4s ease-in-out infinite;
                color: #e8b4c4; /* Aseguramos que tenga el color bonito */
            }

            /* Aplicamos la animación y el color al botón */
            .ob-cta {
                animation: ctaGlow 3s infinite ease-in-out;
                transition: all 0.3s ease !important;
            }
            
            .ob-cta:hover {
                background-color: rgba(232, 180, 196, 0.1) !important;
                transform: translateY(-1px);
            }
        `}</style>

            <div className="ob-root">
                <div className="ob-glow" />
                <div className="lang-screen">
                    <span className="lang-symbol">⚸</span>

                    {/* 3. AÑADIMOS SEPARACIÓN AQUÍ (marginBottom) */}
                    <h1 className="lang-title" style={{
                        whiteSpace: "pre-line",
                        marginBottom: '32px' // <--- ESPACIO ENTRE TITULO Y SUBTITULO
                    }}>
                        {T.en.langTitle}
                    </h1>

                    <p className="lang-sub">
                        Female-centric biohacking protocol.
                    </p>

                    <div style={{ marginTop: '48px' }}>
                        <button
                            className="ob-cta"
                            onClick={() => setLang("en")}
                            style={{
                                maxWidth: '200px',
                                margin: '0 auto',
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '400',
                                letterSpacing: '0.15em',
                                padding: '20px 40px',
                                // 4. ASEGURAMOS EL COLOR BONITO AQUÍ
                                color: '#ffffff', // Letras blancas
                                background: 'transparent', // Fondo transparente
                                border: '1px solid rgba(232, 180, 196, 0.4)', // Borde del color rosa bonito
                                cursor: 'pointer'
                            }}
                        >
                            INITIALIZE SYSTEM
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    // All set screen
    if (step === TOTAL + 1) return (
        <>
            <style>{css}</style>
            <div className="ob-root">
                <div className="ob-glow" />
                <div className="allset-screen">
                    <span className="allset-symbol">⚸</span>
                    <h1 className="allset-title">
                        {t.s15Title} <span className="allset-name">{profile.name || "you"}.</span>
                    </h1>
                    <p className="allset-sub">{t.s15Sub}</p>
                    <div className="lilith-card">
                        <div className="lilith-card-header">
                            <div className="lilith-dot" />
                            <span className="lilith-name">Lilith</span>
                        </div>
                        <p className="lilith-msg">{t.s15LilithMsg}</p>
                    </div>
                    <button className="ob-cta" onClick={() => {
                        console.log('🚨 ONBOARDING BUTTON CLICKED!');
                        console.log('📋 Profile data to send:', profile);
                        console.log('🌍 Language:', lang);
                        console.log('🔧 onComplete function exists?', !!onComplete);

                        if (onComplete) {
                            console.log('✅ Calling onComplete...');
                            onComplete(profile, lang);
                            console.log('✅ onComplete called successfully');
                        } else {
                            console.error('❌ ERROR: onComplete function is missing!');
                        }
                    }}>
                        {t.s15Cta}
                    </button>
                </div>
            </div>
        </>
    );

    const progress = (step / TOTAL) * 100;

    const renderStep = () => {
        switch (step) {
            case 1: return (
                <div>
                    <p className="ob-eyebrow">Welcome</p>
                    <h1 className="ob-title">{t.s1Title}</h1>
                    <p className="ob-sub">{t.s1Sub}</p>
                    <input className="ob-input" placeholder={t.s1Placeholder}
                        value={profile.name} onChange={e => set("name", e.target.value)} autoFocus />
                </div>
            );
            case 2: return (
                <div>
                    <p className="ob-eyebrow">About you</p>
                    <h1 className="ob-title">{t.s2Title}</h1>
                    <p className="ob-sub">{t.s2Sub}</p>
                    <label className="field-label" style={{ marginTop: 0 }}>{t.s2DobLabel}</label>
                    <input type="date" className="ob-date" value={profile.dob} onChange={e => set("dob", e.target.value)} />
                </div>
            );
            case 3: return (
                <div>
                    <p className="ob-eyebrow">Your cycle</p>
                    <h1 className="ob-title">{t.s3Title}</h1>
                    <p className="ob-sub">{t.s3Sub}</p>
                    <label className="field-label" style={{ marginTop: 0 }}>{t.s3Label}</label>
                    <input type="date" className="ob-date" value={profile.lastPeriod} onChange={e => set("lastPeriod", e.target.value)} />
                </div>
            );
            case 4: return (
                <div>
                    <p className="ob-eyebrow">Your cycle</p>
                    <h1 className="ob-title">{t.s4Title}</h1>
                    <p className="ob-sub">{t.s4Sub}</p>
                    <div className="ob-cards">
                        {t.s4Options.map(o => (
                            <button key={o.value} className={`ob-card ${profile.cycleLength === o.value ? "sel-lav" : ""}`}
                                onClick={() => set("cycleLength", o.value)}>
                                <div className="ob-card-label">{o.label}</div>
                                <div className="ob-card-sub">{o.sub}</div>
                            </button>
                        ))}
                    </div>
                </div>
            );
            case 5: return (
                <div>
                    <p className="ob-eyebrow">Your period</p>
                    <h1 className="ob-title">{t.s5Title}</h1>
                    <p className="ob-sub">{t.s5Sub}</p>
                    <div className="ob-cards" style={{ marginBottom: 24 }}>
                        {t.s5Options.map(o => (
                            <button key={o.value} className={`ob-card ${profile.periodFlow === o.value ? "sel-blos" : ""}`}
                                onClick={() => set("periodFlow", o.value)}>
                                <div className="ob-card-label">{o.label}</div>
                                <div className="ob-card-sub">{o.sub}</div>
                            </button>
                        ))}
                    </div>
                    <label className="field-label">{t.s5ColorLabel}</label>
                    <div className="ob-chips">
                        {t.s5Colors.map(c => (
                            <button key={c} className={`ob-chip ${profile.periodColor.includes(c) ? "sel-blos" : ""}`}
                                onClick={() => toggleArr("periodColor", c)}>{c}</button>
                        ))}
                    </div>
                    <label className="field-label">{t.s5PainLabel}</label>
                    <div className="ob-cards">
                        {t.s5PainOptions.map((o, i) => (
                            <button key={i} className={`ob-card ${profile.periodPain === o ? "sel-blos" : ""}`}
                                onClick={() => set("periodPain", o)}>
                                <div className="ob-card-label">{o}</div>
                            </button>
                        ))}
                    </div>
                </div>
            );
            case 6: return (
                <div>
                    <p className="ob-eyebrow">Health</p>
                    <h1 className="ob-title">{t.s6Title}</h1>
                    <p className="ob-sub">{t.s6Sub}</p>
                    <div className="ob-chips">
                        {t.s6Physical.map(c => (
                            <button key={c} className={`ob-chip ${profile.physicalConditions.includes(c) ? "sel-lav" : ""}`}
                                onClick={() => toggleArr("physicalConditions", c)}>{c}</button>
                        ))}
                    </div>
                    <hr className="ob-divider" />
                    <h2 className="ob-section-title">{t.s6NeuroTitle}</h2>
                    <div className="ob-chips">
                        {t.s6Neuro.map(c => (
                            <button key={c} className={`ob-chip ${profile.neuroConditions.includes(c) ? "sel-lav" : ""}`}
                                onClick={() => toggleArr("neuroConditions", c)}>{c}</button>
                        ))}
                    </div>
                </div>
            );
            case 7: return (
                <div>
                    <p className="ob-eyebrow">Contraception</p>
                    <h1 className="ob-title">{t.s7Title}</h1>
                    <p className="ob-sub">{t.s7Sub}</p>
                    <div className="ob-cards" style={{ marginBottom: 20 }}>
                        {t.s7Options.map(o => (
                            <button key={o.value} className={`ob-card ${profile.contraception === o.value ? "sel-lav" : ""}`}
                                onClick={() => set("contraception", o.value)}>
                                <div className="ob-card-label">{o.label}</div>
                            </button>
                        ))}
                    </div>
                    {profile.contraception && profile.contraception !== "none" && (
                        <>
                            <label className="field-label">{t.s7BrandLabel}</label>
                            <input className="ob-input ob-input-sm" placeholder={t.s7BrandPlaceholder}
                                value={profile.contraceptionBrand} onChange={e => set("contraceptionBrand", e.target.value)} />
                            <label className="field-label">{t.s7DurationLabel}</label>
                            <input className="ob-input ob-input-sm" placeholder={t.s7DurationPlaceholder}
                                value={profile.contraceptionDuration} onChange={e => set("contraceptionDuration", e.target.value)} />
                        </>
                    )}
                </div>
            );
            case 8: return (
                <div>
                    <p className="ob-eyebrow">Medications</p>
                    <h1 className="ob-title">{t.s8Title}</h1>
                    <p className="ob-sub">{t.s8Sub}</p>
                    {!profile.noMeds && profile.medications.map((med, i) => (
                        <div key={i} className="ob-med-row">
                            <input className="ob-input ob-input-sm" placeholder={t.s8NamePlaceholder}
                                value={med.name} onChange={e => { const m = [...profile.medications]; m[i].name = e.target.value; set("medications", m); }} />
                            <input className="ob-input ob-input-sm" placeholder={t.s8DosePlaceholder}
                                value={med.dose} onChange={e => { const m = [...profile.medications]; m[i].dose = e.target.value; set("medications", m); }} />
                        </div>
                    ))}
                    {!profile.noMeds && (
                        <button className="ob-add-btn" onClick={() => set("medications", [...profile.medications, { name: "", dose: "" }])}>
                            {t.s8Add}
                        </button>
                    )}
                    <br />
                    <button className="ob-none-btn" onClick={() => set("noMeds", !profile.noMeds)}>
                        {profile.noMeds ? "↩ " : ""}{t.s8None}
                    </button>
                </div>
            );
            case 9: return (
                <div>
                    <p className="ob-eyebrow">Life context</p>
                    <h1 className="ob-title">{t.s9Title}</h1>
                    <p className="ob-sub">{t.s9Sub}</p>
                    <label className="field-label" style={{ marginTop: 0 }}>{t.s9KidsLabel}</label>
                    <div className="ob-cards" style={{ marginBottom: 24 }}>
                        {t.s9KidsOptions.map(o => (
                            <button key={o} className={`ob-card ${profile.kids === o ? "sel-lav" : ""}`} onClick={() => set("kids", o)}>
                                <div className="ob-card-label">{o}</div>
                            </button>
                        ))}
                    </div>
                    <label className="field-label">{t.s9SexLabel}</label>
                    <div className="ob-cards">
                        {t.s9SexOptions.map(o => (
                            <button key={o} className={`ob-card ${profile.sexualActivity === o ? "sel-lav" : ""}`} onClick={() => set("sexualActivity", o)}>
                                <div className="ob-card-label">{o}</div>
                            </button>
                        ))}
                    </div>
                </div>
            );
            case 10: return (
                <div>
                    <p className="ob-eyebrow">Lifestyle</p>
                    <h1 className="ob-title">{t.s10Title}</h1>
                    <p className="ob-sub">{t.s10Sub}</p>
                    <label className="field-label" style={{ marginTop: 0 }}>{t.s10FreqLabel}</label>
                    <div className="ob-cards" style={{ marginBottom: 24 }}>
                        {t.s10FreqOptions.map(o => (
                            <button key={o} className={`ob-card ${profile.exerciseFreq === o ? "sel-lav" : ""}`} onClick={() => set("exerciseFreq", o)}>
                                <div className="ob-card-label">{o}</div>
                            </button>
                        ))}
                    </div>
                    <label className="field-label">{t.s10TypeLabel}</label>
                    <div className="ob-chips">
                        {t.s10Types.map(ty => (
                            <button key={ty} className={`ob-chip ${profile.exerciseTypes.includes(ty) ? "sel-lav" : ""}`}
                                onClick={() => toggleArr("exerciseTypes", ty)}>{ty}</button>
                        ))}
                    </div>
                </div>
            );
            case 11: return (
                <div>
                    <p className="ob-eyebrow">Lifestyle</p>
                    <h1 className="ob-title">{t.s11Title}</h1>
                    <p className="ob-sub">{t.s11Sub}</p>
                    <div className="ob-cards">
                        {t.s11Options.map(o => (
                            <button key={o.value} className={`ob-card ${profile.sleep === o.value ? "sel-lav" : ""}`}
                                onClick={() => set("sleep", o.value)}>
                                <div className="ob-card-label">{o.label}</div>
                                <div className="ob-card-sub">{o.sub}</div>
                            </button>
                        ))}
                    </div>
                </div>
            );
            case 12: return (
                <div>
                    <p className="ob-eyebrow">Lifestyle</p>
                    <h1 className="ob-title">{t.s12Title}</h1>
                    <p className="ob-sub">{t.s12Sub}</p>
                    <div className="ob-food-grid">
                        {t.s12Options.map(o => (
                            <button key={o.value} className={`ob-food-card ${profile.nutrition.includes(o.value) ? "selected" : ""}`}
                                onClick={() => toggleArr("nutrition", o.value)}>
                                <span className="ob-food-emoji">{o.emoji}</span>
                                <div className="ob-food-label">{o.label}</div>
                                <div className="ob-food-sub">{o.sub}</div>
                            </button>
                        ))}
                    </div>
                    <label className="field-label">{t.s12Extra}</label>
                    <input className="ob-input ob-input-sm" placeholder={t.s12ExtraPlaceholder}
                        value={profile.nutritionExtra} onChange={e => set("nutritionExtra", e.target.value)} />
                </div>
            );
            case 13: return (
                <div>
                    <p className="ob-eyebrow">Your intention</p>
                    <h1 className="ob-title">{t.s13Title}</h1>
                    <p className="ob-sub">{t.s13Sub}</p>
                    <div className="ob-cards">
                        {t.s13Options.map(o => (
                            <button key={o.value} className={`ob-card ${profile.goal === o.value ? "sel-lav" : ""}`}
                                onClick={() => set("goal", o.value)}>
                                <div className="ob-card-label">{o.label}</div>
                                <div className="ob-card-sub">{o.sub}</div>
                            </button>
                        ))}
                    </div>
                </div>
            );
            case 14: return (
                <div>
                    <p className="ob-eyebrow">Almost there</p>
                    <h1 className="ob-title">{t.s14Title}</h1>
                    <p className="ob-sub">{t.s14Sub}</p>
                    <textarea className="ob-textarea" rows={6} placeholder={t.s14Placeholder}
                        value={profile.selfDescription} onChange={e => set("selfDescription", e.target.value)} />
                    <p className="ob-optional">{t.s14Optional}</p>
                </div>
            );
            default: return null;
        }
    };

    return (
        <>
            <style>{css}</style>
            <div className="ob-root">
                <div className="ob-glow" />
                <div className="ob-progress">
                    <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="ob-nav">
                    <button className="ob-back" onClick={back}>{step > 1 ? `← ${t.back}` : ""}</button>
                    <span className="ob-step-count">{step} / {TOTAL}</span>
                    <button className="ob-skip" onClick={next}>{t.skip}</button>
                </div>
                <div className="ob-screen" key={step}>
                    {renderStep()}
                </div>
                <div className="ob-cta-wrap">
                    <button className="ob-cta" onClick={next}>
                        {step === TOTAL ? t.allSet : t.continue}
                    </button>
                </div>
            </div>
        </>
    );
}
