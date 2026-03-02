import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}
@keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn  { from{opacity:0} to{opacity:1} }
@keyframes pulse   { 0%,100%{opacity:0.3} 50%{opacity:1} }
@keyframes grain   {
  0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
  30%{transform:translate(3%,2%)}   50%{transform:translate(-1%,4%)}
  70%{transform:translate(4%,-1%)}  90%{transform:translate(-3%,3%)}
}
@keyframes msgIn {
  from{opacity:0;transform:translateY(8px) scale(0.98)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
@keyframes triggerIn {
  from{opacity:0;transform:translateY(12px) scale(0.97)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-4px)}
  40%{transform:translateX(4px)}
  60%{transform:translateX(-3px)}
  80%{transform:translateX(3px)}
}

*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --void:#0a0810;--deep:#110e1a;--surface:#1a1626;--raised:#221d30;
  --border:rgba(180,150,255,0.12);--border-hover:rgba(180,150,255,0.35);
  --lav:#c4b0e8;--lav-dim:#8b75b8;--lav-glow:rgba(196,176,232,0.06);
  --blossom:#e8b4c4;--blossom-dim:#b87590;
  --gold:#d4b896;--ink:#f0eaf8;--ink-soft:#b8afd0;--ink-ghost:#6b6380;
  --warn:#e8c87a;--warn-dim:#a08840;--warn-glow:rgba(232,200,122,0.06);
  --alert:#e87a7a;--alert-dim:#a04040;
}
body{background:var(--void);}

.chat-root{
  min-height:100vh;background:var(--void);
  font-family:'DM Sans',sans-serif;color:var(--ink);
  max-width:480px;margin:0 auto;
  display:flex;flex-direction:column;position:relative;
}

.chat-root::before{
  content:'';position:fixed;inset:-50%;width:200%;height:200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:0.04;pointer-events:none;z-index:100;animation:grain 8s steps(2) infinite;
}
.glow{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(140,100,220,0.07) 0%,transparent 70%);top:-150px;right:-150px;pointer-events:none;z-index:0;}

/* HEADER */
.chat-header{
  position:sticky;top:0;z-index:50;background:var(--void);
  border-bottom:1px solid var(--border);padding:48px 24px 16px;
}
.chat-header-inner{display:flex;align-items:center;gap:12px;}
.lilith-avatar{
  width:40px;height:40px;border-radius:50%;border:1px solid var(--lav-dim);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;color:var(--lav-dim);background:var(--surface);
  flex-shrink:0;position:relative;
}
.lilith-status{
  position:absolute;bottom:1px;right:1px;width:8px;height:8px;
  border-radius:50%;background:var(--lav);border:2px solid var(--void);
  animation:pulse 2.5s ease infinite;
}
.chat-header-info{flex:1;}
.chat-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:400;letter-spacing:-0.01em;color:var(--ink);}
.chat-status-text{font-size:11px;color:var(--lav-dim);margin-top:1px;letter-spacing:0.05em;}
.chat-context-pill{padding:5px 12px;border:1px solid var(--border);border-radius:1px;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--blossom-dim);}

/* MESSAGES */
.chat-messages{
  flex:1;overflow-y:auto;padding:20px 24px 140px;
  position:relative;z-index:1;scroll-behavior:smooth;
}
.chat-messages::-webkit-scrollbar{width:0;}

.date-sep{text-align:center;margin:16px 0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-ghost);}

.context-card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:2px;padding:16px;margin-bottom:24px;
  animation:fadeUp 0.5s ease both;
}
.context-card-label{font-size:9px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-ghost);margin-bottom:10px;}
.context-pills{display:flex;flex-wrap:wrap;gap:6px;}
.context-pill{padding:4px 10px;border:1px solid var(--border);border-radius:1px;font-size:11px;color:var(--ink-ghost);letter-spacing:0.04em;}
.context-pill.phase{border-color:rgba(232,180,196,0.25);color:var(--blossom-dim);}
.context-pill.day{border-color:rgba(196,176,232,0.2);color:var(--lav-dim);}

/* Messages */
.msg{display:flex;margin-bottom:16px;animation:msgIn 0.3s ease both;}
.msg.user{justify-content:flex-end;}
.msg.lilith{justify-content:flex-start;}

.msg-bubble{max-width:80%;padding:12px 16px;border-radius:2px;line-height:1.6;position:relative;}

.msg.user .msg-bubble{
  background:var(--raised);border:1px solid rgba(196,176,232,0.15);
  font-family:'Crimson Pro',serif;font-size:17px;font-weight:300;
  color:var(--ink-soft);border-radius:2px 2px 0 2px;
}

.msg.lilith .msg-bubble{
  background:var(--surface);border:1px solid var(--border);
  border-radius:2px 2px 2px 0;position:relative;overflow:hidden;
}
.msg.lilith .msg-bubble::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,var(--lav-dim),transparent);opacity:0.4;
}
.lilith-msg-header{display:flex;align-items:center;gap:6px;margin-bottom:8px;}
.lilith-msg-dot{width:5px;height:5px;border-radius:50%;background:var(--lav);animation:pulse 2.5s ease infinite;}
.lilith-msg-name{font-size:9px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--lav-dim);}
.lilith-msg-text{font-family:'Crimson Pro',serif;font-size:17px;font-weight:300;font-style:italic;color:var(--ink-soft);line-height:1.7;}
.msg-time{font-size:9px;color:var(--ink-ghost);margin-top:5px;letter-spacing:0.05em;}
.msg.lilith .msg-time{text-align:left;}
.msg.user .msg-time{text-align:right;}

/* Typing */
.typing-indicator{
  display:flex;align-items:center;gap:8px;padding:12px 16px;
  background:var(--surface);border:1px solid var(--border);
  border-radius:2px 2px 2px 0;width:fit-content;margin-bottom:16px;
  animation:fadeIn 0.3s ease both;
}
.typing-dots{display:flex;gap:4px;align-items:center;}
.typing-dot{width:5px;height:5px;border-radius:50%;background:var(--lav-dim);animation:pulse 1.2s ease infinite;}
.typing-dot:nth-child(2){animation-delay:0.2s;}
.typing-dot:nth-child(3){animation-delay:0.4s;}
.typing-label{font-size:10px;color:var(--ink-ghost);letter-spacing:0.08em;font-style:italic;font-family:'Crimson Pro',serif;}

/* ── TRIGGER CARD ── */
.trigger-card{
  margin-bottom:16px;border-radius:2px;
  border:1px solid var(--border);
  overflow:hidden;
  animation:triggerIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
}

/* Colors by type */
.trigger-card.meds{border-color:rgba(232,200,122,0.35);}
.trigger-card.lifestyle{border-color:rgba(196,176,232,0.35);}
.trigger-card.stop-meds{border-color:rgba(232,122,122,0.35);}
.trigger-card.pregnancy{border-color:rgba(232,180,196,0.5);}
.trigger-card.cycle-start{border-color:rgba(196,122,122,0.45);}
.trigger-card.cycle-end{border-color:rgba(139,117,184,0.35);}
.trigger-card.cycle-ovulation{border-color:rgba(196,176,232,0.4);}
.trigger-card.cycle-spotting{border-color:rgba(184,117,144,0.35);}
.trigger-card.cycle-flow{border-color:rgba(196,122,122,0.35);}

.trigger-card.cycle-start .trigger-eyebrow{color:#c47a7a;}
.trigger-card.cycle-end   .trigger-eyebrow{color:var(--lav-dim);}
.trigger-card.cycle-ovulation .trigger-eyebrow{color:var(--lav-dim);}
.trigger-card.cycle-spotting  .trigger-eyebrow{color:var(--blossom-dim);}
.trigger-card.cycle-flow      .trigger-eyebrow{color:#c47a7a;}

.trigger-card.cycle-start    .trigger-btn.confirm{color:#e87a7a;border-color:rgba(196,122,122,0.3);}
.trigger-card.cycle-end      .trigger-btn.confirm{color:var(--lav);border-color:rgba(196,176,232,0.3);}
.trigger-card.cycle-ovulation .trigger-btn.confirm{color:var(--lav);border-color:rgba(196,176,232,0.3);}
.trigger-card.cycle-spotting  .trigger-btn.confirm{color:var(--blossom);border-color:rgba(232,180,196,0.3);}
.trigger-card.cycle-flow      .trigger-btn.confirm{color:#e87a7a;border-color:rgba(196,122,122,0.3);}

.trigger-header{
  display:flex;align-items:center;gap:10px;
  padding:14px 16px 10px;
}
.trigger-icon{font-size:18px;flex-shrink:0;}
.trigger-header-text{flex:1;}
.trigger-eyebrow{
  font-size:9px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;
  margin-bottom:3px;
}
.trigger-card.meds      .trigger-eyebrow{color:var(--warn-dim);}
.trigger-card.lifestyle .trigger-eyebrow{color:var(--lav-dim);}
.trigger-card.stop-meds .trigger-eyebrow{color:var(--alert-dim);}
.trigger-card.pregnancy .trigger-eyebrow{color:var(--blossom-dim);}

.trigger-title{font-size:14px;font-weight:500;color:var(--ink-soft);}

.trigger-body{padding:0 16px 12px;}
.trigger-detected{
  font-family:'Crimson Pro',serif;font-size:14px;font-style:italic;
  color:var(--ink-ghost);line-height:1.5;margin-bottom:12px;
  padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:1px;
}
.trigger-detected strong{color:var(--ink-soft);font-style:normal;}

.trigger-fields{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.trigger-field-label{font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-ghost);margin-bottom:4px;}
.trigger-input{
  width:100%;padding:9px 12px;
  border:1px solid var(--border);border-radius:1px;
  background:rgba(255,255,255,0.03);
  font-family:'DM Sans',sans-serif;font-size:13px;
  color:var(--ink);outline:none;transition:border-color 0.2s;
  caret-color:var(--lav);
}
.trigger-input:focus{border-color:var(--lav-dim);}
.trigger-input::placeholder{color:var(--ink-ghost);}

.trigger-actions{display:flex;gap:6px;}
.trigger-btn{
  flex:1;padding:10px;border-radius:1px;
  font-family:'DM Sans',sans-serif;font-size:11px;
  font-weight:500;letter-spacing:0.12em;text-transform:uppercase;
  cursor:pointer;transition:all 0.2s;border:1px solid var(--border);
  background:transparent;color:var(--ink-ghost);
}
.trigger-btn:hover{border-color:var(--border-hover);color:var(--ink-soft);}
.trigger-btn.confirm{
  background:transparent;color:var(--lav);
  border-color:rgba(196,176,232,0.3);
}
.trigger-card.meds .trigger-btn.confirm{color:var(--warn);border-color:rgba(232,200,122,0.3);}
.trigger-card.stop-meds .trigger-btn.confirm{color:var(--alert);border-color:rgba(232,122,122,0.3);}
.trigger-card.pregnancy .trigger-btn.confirm{color:var(--blossom);border-color:rgba(232,180,196,0.4);}
.trigger-btn.confirm:hover{background:var(--lav-glow);}

/* Confirmed state */
.trigger-confirmed{
  padding:12px 16px;
  display:flex;align-items:center;gap:10px;
}
.trigger-confirmed-icon{font-size:16px;}
.trigger-confirmed-text{
  font-family:'Crimson Pro',serif;font-size:14px;
  font-style:italic;color:var(--ink-ghost);
}

/* Quick prompts */
.quick-prompts{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;animation:fadeUp 0.5s 0.2s ease both;}
.quick-prompt{
  padding:7px 14px;border:1px solid var(--border);border-radius:1px;
  background:transparent;font-family:'DM Sans',sans-serif;
  font-size:11px;color:var(--ink-ghost);cursor:pointer;
  transition:all 0.2s;letter-spacing:0.03em;white-space:nowrap;
}
.quick-prompt:hover{border-color:var(--lav-dim);color:var(--lav);}

/* INPUT */
.chat-input-area{
  position:fixed;bottom:64px;left:50%;transform:translateX(-50%);
  width:100%;max-width:480px;
  background:linear-gradient(to top,var(--void) 60%,transparent);
  padding:16px 24px 12px;z-index:50;
}
.quick-tags{display:flex;gap:8px;margin-bottom:10px;overflow-x:auto;padding-bottom:2px;}
.quick-tags::-webkit-scrollbar{height:0;}
.quick-tag{
  flex-shrink:0;width:36px;height:36px;border:1px solid var(--border);
  border-radius:1px;background:transparent;font-size:16px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all 0.2s;
}
.quick-tag:hover{border-color:var(--border-hover);background:var(--lav-glow);}
.quick-tag.active{border-color:var(--lav-dim);background:rgba(196,176,232,0.1);}
.quick-tag-lilith{font-size:12px;color:var(--lav-dim);font-weight:500;letter-spacing:0.05em;border-color:rgba(196,176,232,0.2);}
.quick-tag-lilith.active{border-color:var(--lav);color:var(--lav);background:rgba(196,176,232,0.1);}

.input-row{
  display:flex;gap:8px;align-items:flex-end;
  background:var(--raised);border:1px solid var(--border);
  border-radius:2px;padding:10px 14px;transition:border-color 0.2s;
}
.input-row:focus-within{border-color:var(--lav-dim);box-shadow:0 0 20px rgba(196,176,232,0.07);}
.chat-textarea{
  flex:1;background:transparent;border:none;
  font-family:'Crimson Pro',serif;font-size:17px;font-style:italic;
  font-weight:300;color:var(--ink);outline:none;resize:none;
  caret-color:var(--lav);line-height:1.5;max-height:100px;overflow-y:auto;padding:2px 0;
}
.chat-textarea::placeholder{color:var(--ink-ghost);}
.chat-textarea::-webkit-scrollbar{width:0;}
.send-btn{
  width:34px;height:34px;flex-shrink:0;border:1px solid var(--border);
  border-radius:1px;background:transparent;color:var(--lav-dim);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  font-size:15px;transition:all 0.2s;
}
.send-btn:hover:not(:disabled){border-color:var(--lav-dim);color:var(--lav);background:var(--lav-glow);}
.send-btn:disabled{opacity:0.25;cursor:not-allowed;}

/* BOTTOM NAV */
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

// ── TRIGGER DETECTION ─────────────────────────────────────────────────────────

// isGlobalEvent: true → App.js propagates the change to ALL screens
// isGlobalEvent: false → only affects chat context

const TRIGGERS = [
    // ── CYCLE EVENTS (global) ────────────────────────────────────────────────
    {
        id: "new-cycle",
        type: "cycle-start",
        isGlobalEvent: true,
        action: "RESET_CYCLE",
        icon: "🔴",
        eyebrow: "Cycle event detected",
        title: "Did your period start?",
        patterns: [
            /me baj[oó]/i,
            /empez[oó] mi (período|periodo|regla|menstruación)/i,
            /llegó mi (período|periodo|regla)/i,
            /me vino (la regla|el período|el periodo)/i,
            /day ?1/i,
            /primer día (de mi período|de mi ciclo|de la regla)/i,
            /my period (started|came|is here)/i,
            /got my period/i,
            /period started/i,
        ],
        fields: [
            { key: "startDate", label: "When did it start?", placeholder: "Today, or e.g. yesterday..." },
            { key: "flow", label: "Flow intensity", placeholder: "Light / Medium / Heavy" },
        ],
        lilithResponse: () => `New cycle logged. Day 1. 🔴 The counter resets from today across the whole app — calendar, patterns, everything. Rest if you can. If you have cramps, ibuprofen 400mg with food works better than acetaminophen. Tell me how the day goes.`,
    },
    {
        id: "period-ended",
        type: "cycle-end",
        isGlobalEvent: true,
        action: "LOG_PERIOD_END",
        icon: "⚪",
        eyebrow: "Cycle event detected",
        title: "Did your period end?",
        patterns: [
            /se me fue (la regla|el período|el periodo)/i,
            /ya termin[oó] (mi período|mi periodo|la regla|mi menstruación)/i,
            /ya no (tengo|me bajó|sangro)/i,
            /period (ended|is over|stopped|finished)/i,
            /my period ended/i,
        ],
        fields: [
            { key: "endDate", label: "When did it end?", placeholder: "Today, or e.g. yesterday..." },
            { key: "duration", label: "How many days did it last?", placeholder: "e.g. 5 days" },
        ],
        lilithResponse: () => `Period end logged. You're entering the follicular phase now — in the next few days you should feel your energy rising. It's the best phase of the cycle for projects, intense training, and social plans. Tell me how you feel.`,
    },
    {
        id: "ovulation",
        type: "cycle-ovulation",
        isGlobalEvent: true,
        action: "LOG_OVULATION",
        icon: "🌡",
        eyebrow: "Cycle event detected",
        title: "Are you ovulating?",
        patterns: [
            /creo que (estoy ovulando|ovulé)/i,
            /dolor de ovulación/i,
            /mittelschmerz/i,
            /siento que (ovulé|estoy ovulando)/i,
            /ese dolor (de ovulación|de en medio|del ovario)/i,
            /i think i('m| am) ovulating/i,
            /ovulation pain/i,
            /ovulating today/i,
        ],
        fields: [
            { key: "side", label: "Which side?", placeholder: "Left / Right / Both / Not sure" },
            { key: "intensity", label: "Pain level (optional)", placeholder: "Mild / Moderate / Strong" },
        ],
        lilithResponse: () => `Ovulation logged. I'm marking it on your calendar — this helps us fine-tune your cycle dates over time. Mittelschmerz pain is completely normal, it lasts 24-48 hours. After this the luteal phase begins, which is when the symptoms you know well start to appear. How are you feeling?`,
    },
    {
        id: "spotting",
        type: "cycle-spotting",
        isGlobalEvent: true,
        action: "LOG_SPOTTING",
        icon: "🩸",
        eyebrow: "Cycle note detected",
        title: "Are you spotting?",
        patterns: [
            /manchado/i,
            /spotting/i,
            /un poco de sangrado/i,
            /sangrado leve/i,
            /manchas (de sangre|de sangrado)/i,
            /light spotting/i,
            /light bleeding/i,
        ],
        fields: [
            { key: "cycleContext", label: "Where in your cycle?", placeholder: "e.g. day 14, mid-cycle, before period..." },
            { key: "color", label: "Color (optional)", placeholder: "Pink / Brown / Red" },
        ],
        lilithResponse: () => `Spotting logged. Context matters a lot here — mid-cycle it could be ovulation bleeding, which is normal. Before your period it could be implantation or just progesterone dropping. If it persists more than 2-3 days outside your period, worth mentioning to your doctor. Any other symptoms?`,
    },
    {
        id: "heavy-flow",
        type: "cycle-flow",
        isGlobalEvent: true,
        action: "LOG_FLOW",
        icon: "🔴",
        eyebrow: "Flow update detected",
        title: "Logging today's flow?",
        patterns: [
            /flujo (muy )?(abundante|pesado|intenso|fuerte)/i,
            /sangrado (muy )?(abundante|pesado|intenso|fuerte)/i,
            /casi nada (de flujo|de sangrado)/i,
            /flujo (muy )?(ligero|leve|poco)/i,
            /heavy (flow|bleeding|period)/i,
            /light (flow|bleeding|period)/i,
            /empap[eé] (la toalla|el tampón|el cup)/i,
        ],
        fields: [
            { key: "flow", label: "Flow today", placeholder: "Light / Medium / Heavy / Very heavy" },
            { key: "symptoms", label: "Any other symptoms?", placeholder: "Cramps, clots, pain..." },
        ],
        lilithResponse: (fields) => `Logged. The flow ${fields.flow ? `(${fields.flow})` : ""} is logged for today. This helps me see if there are changes in intensity cycle to cycle — an important pattern for detecting if something shifts. How are you feeling overall today?`,
    },
    // ── MEDICATION & LIFESTYLE EVENTS (local) ───────────────────────────────
    {
        id: "start-contraception",
        type: "meds",
        isGlobalEvent: false,
        icon: "💊",
        eyebrow: "Medication change detected",
        title: "Starting hormonal contraception?",
        patterns: [
            /voy a (empezar|iniciar|tomar) (la )?p[ií]ldora/i,
            /start(ing)? (the )?pill/i,
            /voy a (empezar|iniciar) (anticonceptivo|yasmin|diane|loette)/i,
            /empiezo (la )?p[ií]ldora/i,
            /starting birth control/i,
            /voy a empezar anticonceptivos/i,
        ],
        fields: [
            { key: "name", label: "Name / brand", placeholder: "e.g. Yasmin, Diane 35..." },
            { key: "dose", label: "Dose (optional)", placeholder: "e.g. 30mcg" },
            { key: "startDate", label: "Start date", placeholder: "e.g. March 1" },
        ],
        lilithResponse: (fields) => `Saved. Starting the pill will change how your cycle looks — the first thing you'll probably notice is that luteal phase symptoms ease up, though the first few weeks can be a bit erratic while your body adjusts. I'll factor this into all my analysis from now on. Any questions about what to expect?`,
    },
    {
        id: "stop-contraception",
        type: "stop-meds",
        isGlobalEvent: false,
        icon: "⚠️",
        eyebrow: "Important change detected",
        title: "Stopping hormonal contraception?",
        patterns: [
            /dej[eé] (de tomar|la) p[ií]ldora/i,
            /stopping (the )?pill/i,
            /quit(ting)? birth control/i,
            /ya no (voy a tomar|tomo) (la )?p[ií]ldora/i,
            /me quit[eé] (los |la )?anticonceptivos/i,
        ],
        fields: [
            { key: "lastDate", label: "Last dose taken", placeholder: "e.g. Feb 28" },
            { key: "reason", label: "Reason (optional)", placeholder: "e.g. trying to conceive, side effects..." },
        ],
        lilithResponse: () => `Got it, logging it. Stopping the pill can make the first 2-3 cycles quite irregular — your body is recovering its own hormonal rhythm. It's normal for symptoms the pill was suppressing to reappear with more intensity at first. I'll be paying close attention to changes in your patterns during this time.`,
    },
    {
        id: "start-medication",
        type: "meds",
        isGlobalEvent: false,
        icon: "💊",
        eyebrow: "Medication change detected",
        title: "Starting a new medication?",
        patterns: [
            /voy a (empezar|iniciar|tomar) (la |el )?(sertralina|prozac|lexapro|fluoxetina|escitalopram|venlafaxina)/i,
            /me (recetaron|dieron) (una nueva|nueva) (medicina|medicamento|pastilla)/i,
            /starting (sertraline|prozac|lexapro|fluoxetine|escitalopram)/i,
            /nueva (medicación|medicina|pastilla)/i,
            /me cambiaron (el |la )?medicamento/i,
        ],
        fields: [
            { key: "name", label: "Medication name", placeholder: "e.g. Sertraline, Lexapro..." },
            { key: "dose", label: "Dose", placeholder: "e.g. 50mg" },
            { key: "reason", label: "What it's for (optional)", placeholder: "e.g. PMDD, anxiety..." },
        ],
        lilithResponse: (fields) => `Noted. Psychiatric medications interact with the cycle — especially because hormones affect how the body metabolizes them. You might notice that in certain cycle phases ${fields.name || "el medicamento"} feels more or less effective. Let me know if you notice that. I'll monitor it in your history.`,
    },
    {
        id: "dose-change",
        type: "meds",
        isGlobalEvent: false,
        icon: "💊",
        eyebrow: "Dose change detected",
        title: "Changing your medication dose?",
        patterns: [
            /me (subieron|bajaron|cambiaron) (la dosis|la pastilla|el medicamento)/i,
            /aumentaron (la dosis|mi medicamento)/i,
            /dose (increased|decreased|changed)/i,
            /ahora tomo (más|menos|el doble)/i,
            /de (\d+)mg (a|al) (\d+)mg/i,
        ],
        fields: [
            { key: "medication", label: "Medication", placeholder: "e.g. Sertraline..." },
            { key: "oldDose", label: "Previous dose", placeholder: "e.g. 50mg" },
            { key: "newDose", label: "New dose", placeholder: "e.g. 75mg" },
        ],
        lilithResponse: () => `Dose change logged. The first few days after an adjustment can feel different — sometimes more symptoms, sometimes fewer. Give me at least two weeks of notes so I can tell you if the change is affecting your cycle patterns. Tell me how you're doing.`,
    },
    {
        id: "stop-medication",
        type: "stop-meds",
        isGlobalEvent: false,
        icon: "⚠️",
        eyebrow: "Important change detected",
        title: "Stopping a medication?",
        patterns: [
            /dej[eé] de tomar (la |el )?(sertralina|prozac|lexapro|pastilla|medicamento)/i,
            /stopped (taking|my) (sertraline|medication|meds)/i,
            /ya no (voy a tomar|tomo) (la |el )?(sertralina|medicamento|pastilla)/i,
            /me quit[eé] (el|la) (medicamento|pastilla|sertralina)/i,
        ],
        fields: [
            { key: "medication", label: "Which medication?", placeholder: "e.g. Sertraline..." },
            { key: "reason", label: "Reason (optional)", placeholder: "e.g. doctor's advice, side effects..." },
        ],
        lilithResponse: () => `Logged. Stopping a medication abruptly can amplify cycle symptoms temporarily — especially in the luteal phase. Please let me know if you feel anything out of the ordinary. And if it was without medical guidance, consider talking to your doctor before making it permanent.`,
    },
    {
        id: "new-exercise",
        type: "lifestyle",
        isGlobalEvent: false,
        icon: "🏃",
        eyebrow: "Lifestyle change detected",
        title: "Starting a new exercise routine?",
        patterns: [
            /voy a (empezar|iniciar) (el gym|pilates|yoga|correr|entrenar)/i,
            /starting (the gym|pilates|yoga|running|working out)/i,
            /me inscrib[ií] (al gym|en pilates|en yoga)/i,
            /empec[eé] (a entrenar|el gym|a correr|pilates|yoga)/i,
        ],
        fields: [
            { key: "activity", label: "What activity?", placeholder: "e.g. gym, yoga, running..." },
            { key: "frequency", label: "How often?", placeholder: "e.g. 3x per week" },
        ],
        lilithResponse: (fields) => `Great, I'll factor this in. Exercise interacts a lot with the cycle — in the follicular and ovulation phases you'll notice you perform better, in the late luteal phase your strength drops and that's normal. I'll include ${fields.activity || "tu entrenamiento"} in my analysis to give you more precise suggestions.`,
    },
    {
        id: "diet-change",
        type: "lifestyle",
        isGlobalEvent: false,
        icon: "🍽",
        eyebrow: "Lifestyle change detected",
        title: "Changing your diet?",
        patterns: [
            /voy a (empezar|hacer) (dieta|keto|ayuno|vegana|vegetariana)/i,
            /starting (keto|intermittent fasting|vegan|vegetarian)/i,
            /dej[eé] de comer (carne|gluten|lácteos|azúcar)/i,
            /me (puse a|estoy en) (dieta|keto|ayuno)/i,
        ],
        fields: [
            { key: "diet", label: "What change?", placeholder: "e.g. keto, no sugar, intermittent fasting..." },
            { key: "goal", label: "Goal (optional)", placeholder: "e.g. weight loss, energy, health..." },
        ],
        lilithResponse: () => `Noted. Dietary changes can significantly affect cycle symptoms — especially caloric or carb restrictions, which can worsen PMDD in the luteal phase. Tell me how you feel over the next few weeks and I'll correlate it with your cycle.`,
    },
    {
        id: "pregnancy",
        type: "pregnancy",
        isGlobalEvent: false,
        icon: "🌸",
        eyebrow: "Big news detected",
        title: "Are you pregnant?",
        patterns: [
            /estoy embarazada/i,
            /salí embarazada/i,
            /i('m| am) pregnant/i,
            /prueba (de embarazo )?(salió |dio )?(positiv|positiv)/i,
            /pregnancy test (came back )?(positive)/i,
        ],
        fields: [],
        lilithResponse: () => `Congratulations. This is huge. I'm switching to pregnancy mode — no more standard cycle analysis, instead I'll track pregnancy symptoms. Take good care of yourself, and tell me how you feel.`,
    },
];

function detectTrigger(text) {
    for (const trigger of TRIGGERS) {
        for (const pattern of trigger.patterns) {
            if (pattern.test(text)) return trigger;
        }
    }
    return null;
}

// ── MOCK INITIAL MESSAGES ─────────────────────────────────────────────────────
// Initial messages are generated dynamically in the component
// based on real profile data — see INITIAL_MESSAGES below component definition

const QUICK_TAGS = [
    { id: "food", emoji: "🍽" },
    { id: "meds", emoji: "💊" },
    { id: "movement", emoji: "🏃" },
    { id: "sick", emoji: "😷" },
];

const QUICK_PROMPTS = [
    "Why do I feel like this today?",
    "What should I eat?",
    "Is what I'm feeling normal?",
    "When does this get better?",
];

function getTime() {
    return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function autoResize(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
}

// ── TRIGGER CARD COMPONENT ────────────────────────────────────────────────────
function TriggerCard({ trigger, onConfirm, onDismiss }) {
    const [fields, setFields] = useState({});
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = () => {
        setConfirmed(true);
        setTimeout(() => onConfirm(fields), 400);
    };

    if (confirmed) {
        return (
            <div className={`trigger-card ${trigger.type}`}>
                <div className="trigger-confirmed">
                    <span className="trigger-confirmed-icon">✓</span>
                    <span className="trigger-confirmed-text">Saved to your profile and change log.</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`trigger-card ${trigger.type}`}>
            <div className="trigger-header">
                <span className="trigger-icon">{trigger.icon}</span>
                <div className="trigger-header-text">
                    <div className="trigger-eyebrow">{trigger.eyebrow}</div>
                    <div className="trigger-title">{trigger.title}</div>
                </div>
            </div>
            <div className="trigger-body">
                <div className="trigger-detected">
                    Lilith detected: <strong>"{trigger.detectedText}"</strong>
                    <br />Do you want to save this change to your profile?
                </div>
                {trigger.fields.length > 0 && (
                    <div className="trigger-fields">
                        {trigger.fields.map(f => (
                            <div key={f.key}>
                                <div className="trigger-field-label">{f.label}</div>
                                <input
                                    className="trigger-input"
                                    placeholder={f.placeholder}
                                    value={fields[f.key] || ""}
                                    onChange={e => setFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div className="trigger-actions">
                    <button className="trigger-btn" onClick={onDismiss}>Not now</button>
                    <button className="trigger-btn confirm" onClick={handleConfirm}>
                        Yes, save this
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function LilithChatWithTriggers({
    activeNav, setActiveNav, onCycleEvent,
    profile = {}, cycle = {}, todayNotes = [],
}) {
    const getInitialMessage = () => {
        const name = profile.name ? `, ${profile.name}` : "";
        const dayCtx = cycle.cycleDay
            ? `You're on day ${cycle.cycleDay}${cycle.phase ? `, ${cycle.phase} phase` : ""}.`
            : "";
        const notesCtx = todayNotes.length > 0
            ? ` I can see you've already logged ${todayNotes.length} note${todayNotes.length !== 1 ? "s" : ""} today.`
            : "";
        return {
            id: 1, role: "lilith",
            text: `Hey${name}. ${dayCtx}${notesCtx} What's going on?`.trim(),
            time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        };
    };

    const [messages, setMessages] = useState(() => [getInitialMessage()]);
    const [input, setInput] = useState("");
    const [activeTags, setActiveTags] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [pendingTrigger, setPendingTrigger] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, pendingTrigger]);

    const toggleTag = (id) =>
        setActiveTags(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);

    const addMessage = (msg) => setMessages(m => [...m, msg]);

    // ── CLAUDE API ────────────────────────────────────────────────────────────
    const callLilith = async (userText, tags, history) => {
        const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
        if (!apiKey) {
            return "I can't connect right now — API key is missing. Add REACT_APP_ANTHROPIC_API_KEY to your .env file.";
        }

        // Safely serialize profile fields — onboarding may store objects
        const safeStr = (val) => {
            if (!val) return null;
            if (typeof val === "string") return val;
            if (Array.isArray(val)) return val.map(v => typeof v === "string" ? v : v.name || v.label || JSON.stringify(v)).join(", ");
            if (typeof val === "object") return val.name || val.label || Object.values(val).join(", ");
            return String(val);
        };

        const { name, age, contraception, goals } = profile;
        const conditions = safeStr(profile.conditions);
        const medications = safeStr(profile.medications);
        const { cycleDay, cycleLength, phase } = cycle;

        const notesContext = todayNotes.length > 0
            ? todayNotes.map(n => `- ${n.time || "earlier"}: ${n.text}${n.tags?.length ? ` [${n.tags.join(", ")}]` : ""}`).join("\n")
            : "No notes logged yet today.";

        const systemPrompt = `You are Lilith, a cycle coach and trusted confidante.

Your personality: warm, direct, real — like a best friend who happens to be a gynecologist. Never preachy. Never adds unnecessary disclaimers. Validates first, informs second. Speaks like a person, not a medical pamphlet.

${name ? `User's name: ${name}.` : ""}
${age ? `Age: ${age}.` : ""}
${conditions?.length ? `Reported conditions: ${Array.isArray(conditions) ? conditions.join(", ") : conditions}.` : ""}
${medications ? `Current medications: ${medications}.` : ""}
${contraception ? `Contraception: ${contraception}.` : ""}
${cycleLength ? `Typical cycle length: ${cycleLength} days.` : ""}
${goals ? `Their tracking goal: ${goals}.` : ""}

CURRENT CYCLE:
${cycleDay ? `- Day ${cycleDay} of ${cycleLength || 28}` : "- Cycle day unknown"}
${phase ? `- Phase: ${phase}` : ""}

TODAY'S NOTES:
${notesContext}

${tags.length > 0 ? `This message is tagged: ${tags.join(", ")}.` : ""}

RESPONSE RULES:
- Detect the user's language from their message and respond in the same language
- Keep responses to 3-4 sentences max unless genuinely needed
- Reference cycle day and phase when relevant — this is your superpower
- If something sounds medically serious, suggest a doctor once, gently
- Never say "I'm just an AI"`;

        // Build conversation history for Claude
        const apiMessages = history
            .filter(m => m.role === "user" || m.role === "lilith")
            .slice(-10) // last 10 messages for context
            .map(m => ({
                role: m.role === "lilith" ? "assistant" : "user",
                content: m.text,
            }));

        // Add current message
        apiMessages.push({ role: "user", content: userText });

        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-6",
                    max_tokens: 1024,
                    system: systemPrompt,
                    messages: apiMessages,
                }),
            });

            const data = await res.json();

            if (data.content?.[0]?.text) {
                return data.content[0].text;
            }
            if (data.error) {
                console.error("Lilith API error:", data.error);
                return "Something went wrong on my end. Try again in a second.";
            }
            return "I didn't catch that. Can you say it again?";

        } catch (err) {
            console.error("Lilith fetch error:", err);
            return "I'm having trouble connecting right now. Check your internet and try again.";
        }
    };

    const sendMessage = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(), role: "user",
            text: text.trim(),
            time: getTime(),
            tags: [...activeTags],
        };
        addMessage(userMsg);
        setInput("");
        setActiveTags([]);
        if (textareaRef.current) textareaRef.current.style.height = "auto";

        // Check for triggers FIRST
        const trigger = detectTrigger(text);
        if (trigger) {
            trigger.detectedText = text.trim();
            setTimeout(() => setPendingTrigger(trigger), 600);
            return;
        }

        // Call real Claude API
        setIsTyping(true);
        const currentMessages = [...messages, userMsg];
        const response = await callLilith(text.trim(), activeTags, currentMessages);
        setIsTyping(false);
        addMessage({
            id: Date.now() + 1, role: "lilith",
            text: response,
            time: getTime(),
        });
    };

    const handleTriggerConfirm = (fields) => {
        const trigger = pendingTrigger;
        setPendingTrigger(null);

        // 🌍 Global event → propagate to App.js so ALL screens update
        if (trigger.isGlobalEvent && onCycleEvent) {
            onCycleEvent(trigger.action, {
                triggerId: trigger.id,
                fields,
                date: new Date().toISOString(),
            });
        }

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            addMessage({
                id: Date.now(), role: "lilith",
                text: trigger.lilithResponse(fields),
                time: getTime(),
            });
        }, 1400);
    };

    const handleTriggerDismiss = () => {
        setPendingTrigger(null);
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            addMessage({
                id: Date.now(), role: "lilith",
                text: "Okay, I won't save it for now. If you change your mind, you can update it in your profile or just tell me again.",
                time: getTime(),
            });
        }, 1000);
    };

    return (
        <>
            <style>{css}</style>
            <div className="chat-root">
                <div className="glow" />

                {/* HEADER */}
                <div className="chat-header">
                    <div className="chat-header-inner">
                        <div className="lilith-avatar">
                            ⚸
                            <div className="lilith-status" />
                        </div>
                        <div className="chat-header-info">
                            <div className="chat-name">Lilith</div>
                            <div className="chat-status-text">cycle coach · always here</div>
                        </div>
                        <div className="chat-context-pill">
                            {cycle.cycleDay ? `Day ${cycle.cycleDay} · ${cycle.phase || ""}` : "Cycle not set"}
                        </div>
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="chat-messages">
                    <div className="context-card">
                        <div className="context-card-label">Lilith knows</div>
                        <div className="context-pills">
                            {cycle.phase && <span className="context-pill phase">{cycle.phase} phase</span>}
                            {cycle.cycleDay && <span className="context-pill day">Day {cycle.cycleDay} of {cycle.cycleLength || 28}</span>}
                            {profile.conditions && (
                                Array.isArray(profile.conditions)
                                    ? profile.conditions.map(c => (
                                        <span key={typeof c === "string" ? c : JSON.stringify(c)} className="context-pill">
                                            {typeof c === "string" ? c : c.name || c.label || JSON.stringify(c)}
                                        </span>
                                    ))
                                    : <span className="context-pill">
                                        {typeof profile.conditions === "string" ? profile.conditions : JSON.stringify(profile.conditions)}
                                    </span>
                            )}
                            {profile.medications && (
                                <span className="context-pill">
                                    {typeof profile.medications === "string"
                                        ? profile.medications
                                        : Array.isArray(profile.medications)
                                            ? profile.medications.map(m => typeof m === "string" ? m : m.name || m.label || "").join(", ")
                                            : profile.medications.name || JSON.stringify(profile.medications)}
                                </span>
                            )}
                            {todayNotes.length > 0 && (
                                <span className="context-pill">{todayNotes.length} note{todayNotes.length !== 1 ? "s" : ""} today</span>
                            )}
                        </div>
                    </div>

                    <div className="date-sep">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </div>

                    {messages.map((msg, i) => (
                        <div key={msg.id} className={`msg ${msg.role}`}>
                            <div className="msg-bubble">
                                {msg.role === "lilith" && (
                                    <div className="lilith-msg-header">
                                        <div className="lilith-msg-dot" />
                                        <span className="lilith-msg-name">Lilith</span>
                                    </div>
                                )}
                                {msg.role === "lilith"
                                    ? <p className="lilith-msg-text">{msg.text}</p>
                                    : <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 17, fontWeight: 300, lineHeight: 1.6 }}>{msg.text}</p>
                                }
                                {msg.tags && msg.tags.length > 0 && (
                                    <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                                        {msg.tags.map(t => {
                                            const tag = QUICK_TAGS.find(q => q.id === t);
                                            return tag ? (
                                                <span key={t} style={{ fontSize: 11, padding: "2px 8px", border: "1px solid rgba(180,150,255,0.15)", borderRadius: 1, color: "var(--ink-ghost)" }}>
                                                    {tag.emoji} {t}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                                <div className="msg-time">{msg.time}</div>
                            </div>
                        </div>
                    ))}

                    {/* TRIGGER CARD */}
                    {pendingTrigger && (
                        <TriggerCard
                            trigger={pendingTrigger}
                            onConfirm={handleTriggerConfirm}
                            onDismiss={handleTriggerDismiss}
                        />
                    )}

                    {isTyping && (
                        <div className="typing-indicator">
                            <div className="typing-dots">
                                <div className="typing-dot" />
                                <div className="typing-dot" />
                                <div className="typing-dot" />
                            </div>
                            <span className="typing-label">Lilith is thinking...</span>
                        </div>
                    )}

                    {messages.length < 6 && !pendingTrigger && (
                        <div className="quick-prompts">
                            {QUICK_PROMPTS.map(p => (
                                <button key={p} className="quick-prompt" onClick={() => sendMessage(p)}>{p}</button>
                            ))}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="chat-input-area">
                    <div className="quick-tags">
                        {QUICK_TAGS.map(tag => (
                            <button key={tag.id}
                                className={`quick-tag ${activeTags.includes(tag.id) ? "active" : ""}`}
                                onClick={() => toggleTag(tag.id)}>
                                {tag.emoji}
                            </button>
                        ))}
                        <button
                            className={`quick-tag quick-tag-lilith ${activeTags.includes("lilith") ? "active" : ""}`}
                            onClick={() => toggleTag("lilith")}>
                            ✦
                        </button>
                    </div>
                    <div className="input-row">
                        <textarea
                            ref={textareaRef}
                            className="chat-textarea"
                            placeholder="Tell me what's going on..."
                            value={input}
                            rows={1}
                            onChange={e => { setInput(e.target.value); autoResize(e.target); }}
                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                        />
                        <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim()}>↑</button>
                    </div>
                </div>

                {/* BOTTOM NAV */}
                <div className="bottom-nav">
                    {[
                        { id: "home", icon: "⚸", label: "Home" },
                        { id: "journal", icon: "◎", label: "Journal" },
                        { id: "lilith", icon: "✦", label: "Lilith" },
                        { id: "calendar", icon: "◫", label: "Cycle" },
                    ].map(item => (
                        <button key={item.id}
                            className={`nav-item ${(activeNav || "lilith") === item.id ? "active" : ""}`}
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