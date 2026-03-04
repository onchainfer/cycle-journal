import { useState, useEffect } from "react";
import { generateMedicalReport } from "../services/anthropic.js";

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
  position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:center;
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
  cursor:pointer;transition:all 0.2s ease;
}
.report-card:hover{border-color:var(--border-hover);}
.report-card.has-cache{
  border-color:rgba(196,176,232,0.2);
  background:rgba(196,176,232,0.02);
}
.report-card.has-cache:hover{
  border-color:rgba(196,176,232,0.4);
}
.report-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
.report-body{flex:1;}
.report-title{font-size:13px;font-weight:500;color:var(--ink-soft);margin-bottom:3px;}
.report-desc{font-family:'Crimson Pro',serif;font-size:13px;font-style:italic;color:var(--ink-ghost);line-height:1.5;}
.report-meta{
  font-size:10px;color:var(--lav-dim);margin-top:6px;
  letter-spacing:0.05em;
}

.cache-status{
  color:rgba(196,176,232,0.8);
  font-weight:500;
}

.report-actions{
  display:flex;
  align-items:center;
  gap:8px;
}

.cache-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:var(--lav-dim);
  opacity:0.7;
  animation:pulse-cache 2s infinite;
}

@keyframes pulse-cache{
  0%, 100% { opacity:0.7; }
  50% { opacity:1; }
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
.change-badge.medication{border:1px solid rgba(232,180,196,0.25);color:var(--blossom-dim);}
.change-badge.lifecycle{border:1px solid rgba(212,184,150,0.25);color:var(--gold);}
.change-dot.medication{border-color:var(--blossom-dim);}

/* ── HEALTH & MEDICATION TIMELINE ── */
.health-timeline{
  position:relative;
  padding:12px 0;
}

.timeline-line{
  position:absolute;
  left:11px;
  top:0;
  bottom:0;
  width:1px;
  background:linear-gradient(to bottom, 
    transparent 0%, 
    rgba(196,176,232,0.2) 20%, 
    rgba(196,176,232,0.3) 50%, 
    rgba(196,176,232,0.2) 80%, 
    transparent 100%);
  z-index:0;
}

.timeline-day-group{
  margin-bottom:20px;
  position:relative;
}

.timeline-date-header{
  font-size:10px;
  font-weight:600;
  letter-spacing:0.12em;
  text-transform:uppercase;
  color:var(--lav-dim);
  margin-bottom:8px;
  margin-left:32px;
  opacity:0.8;
}

.timeline-item{
  display:flex;
  align-items:flex-start;
  margin-bottom:12px;
  position:relative;
}

.timeline-dot-container{
  width:24px;
  height:24px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-right:12px;
  flex-shrink:0;
}

.timeline-dot{
  width:8px;
  height:8px;
  border-radius:50%;
  border:2px solid;
  background:var(--void);
  position:relative;
  z-index:1;
  transition:all 0.2s ease;
}

.timeline-dot-red{
  border-color:#e87a7a;
  background:rgba(232,122,122,0.1);
}

.timeline-dot-blue{
  border-color:#7aa8e8;
  background:rgba(122,168,232,0.1);
}

.timeline-dot-grey{
  border-color:var(--ink-ghost);
  background:rgba(150,150,150,0.1);
}

.timeline-content{
  flex:1;
  padding-top:1px;
}

.timeline-text{
  font-family:'Crimson Pro',serif;
  font-size:15px;
  font-weight:300;
  color:var(--ink-soft);
  line-height:1.4;
  margin-bottom:4px;
}

.timeline-badge{
  display:inline-block;
  font-size:9px;
  padding:2px 8px;
  border-radius:10px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  font-weight:500;
  border:1px solid;
}

.timeline-badge.medication{
  border-color:rgba(122,168,232,0.3);
  color:#7aa8e8;
  background:rgba(122,168,232,0.05);
}

.timeline-badge.cycle{
  border-color:rgba(232,122,122,0.3);
  color:#e87a7a;
  background:rgba(232,122,122,0.05);
}

.timeline-badge.general{
  border-color:rgba(150,150,150,0.3);
  color:var(--ink-ghost);
  background:rgba(150,150,150,0.05);
}

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

.report-header-top{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:16px;
}

.report-header-left{
  flex:1;
}

.report-header-actions{
  flex-shrink:0;
  padding-top:4px;
}

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

.cache-indicator{
  color:var(--lav-dim);
  font-weight:400;
}

.refresh-btn{
  display:flex;
  align-items:center;
  gap:6px;
  padding:6px 12px;
  background:transparent;
  border:1px solid rgba(196,176,232,0.3);
  border-radius:1px;
  font-family:'DM Sans',sans-serif;
  font-size:11px;
  font-weight:500;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:var(--lav-dim);
  cursor:pointer;
  transition:all 0.2s ease;
}

.refresh-btn:hover{
  background:rgba(196,176,232,0.05);
  border-color:rgba(196,176,232,0.5);
}

.refresh-btn:disabled{
  opacity:0.5;
  cursor:not-allowed;
}

.refresh-icon{
  font-size:12px;
  transition:transform 0.2s ease;
}

.refresh-btn:hover .refresh-icon{
  transform:rotate(180deg);
}

.refresh-text{
  font-size:10px;
}

/* ── DATA HEALTH PANEL ── */
.data-health-panel{
  background:rgba(196,176,232,0.03);
  border:1px solid rgba(196,176,232,0.1);
  border-radius:2px;
  padding:16px;
}

.data-stat-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:8px;
}

.data-stat-row:last-child{
  margin-bottom:0;
}

.data-stat-label{
  font-family:'Crimson Pro',serif;
  font-size:13px;
  color:var(--ink-soft);
}

.data-stat-value{
  font-family:'DM Sans',sans-serif;
  font-size:11px;
  font-weight:500;
  color:var(--lav-dim);
  letter-spacing:0.05em;
}

.data-integrity-warning{
  display:flex;
  align-items:flex-start;
  gap:8px;
  margin-top:12px;
  padding-top:12px;
  border-top:1px solid rgba(232,122,122,0.1);
}

.warning-icon{
  font-size:12px;
  flex-shrink:0;
  margin-top:1px;
}

.warning-text{
  font-family:'Crimson Pro',serif;
  font-size:12px;
  font-style:italic;
  color:rgba(232,122,122,0.8);
  line-height:1.4;
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
.report-custom-content{
  padding:12px 0;border-top:1px solid var(--border);margin-top:8px;
}
.report-custom-content pre{
  font-family:'Crimson Pro',serif;font-size:14px;line-height:1.6;
  color:var(--ink-soft);white-space:pre-wrap;margin:0;
}
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

/* ── AI REPORT STYLES ── */
.report-loading{
  text-align:center;padding:40px 20px;
}
.loading-icon{font-size:48px;margin-bottom:16px;animation:pulse 2s infinite;}
.lilith-triangle{
  color:var(--lav);font-weight:300;transform:rotate(0deg);
  animation:lilithPulse 3s ease-in-out infinite;
}
.loading-title{
  font-size:16px;font-weight:500;color:var(--ink);margin-bottom:8px;
  font-family:'Crimson Pro',serif;
}
.loading-subtitle{
  font-size:13px;color:var(--ink-ghost);margin-bottom:20px;
  font-style:italic;
}
.loading-dots{display:flex;justify-content:center;gap:4px;}
.loading-dots span{
  display:inline-block;width:6px;height:6px;border-radius:50%;
  background:var(--lav-dim);animation:loadingBounce 1.4s infinite ease-in-out both;
}
.loading-dots span:nth-child(1){animation-delay:-0.32s;}
.loading-dots span:nth-child(2){animation-delay:-0.16s;}
@keyframes pulse{
  0%,100%{opacity:1;}
  50%{opacity:0.5;}
}
@keyframes lilithPulse{
  0%,100%{opacity:0.4;transform:scale(1);}
  50%{opacity:1;transform:scale(1.1);}
}
@keyframes loadingBounce{
  0%,80%,100%{transform:scale(0);}
  40%{transform:scale(1);}
}

.ai-badge{
  display:flex;align-items:center;gap:6px;
  background:rgba(196,176,232,0.06);border:1px solid rgba(196,176,232,0.2);
  padding:8px 12px;border-radius:1px;margin-bottom:16px;
  font-size:11px;font-weight:500;color:var(--lav-dim);
}
.ai-icon{font-size:14px;}

.report-error{
  background:rgba(232,180,196,0.06);border:1px solid rgba(232,180,196,0.2);
  padding:12px;border-radius:1px;margin-bottom:16px;
  display:flex;align-items:center;gap:8px;
}
.error-icon{font-size:16px;}
.error-text{font-size:12px;color:var(--blossom-dim);line-height:1.4;}

.ai-report-content{margin-bottom:20px;}

/* ── MARKDOWN CONTENT ── */
.markdown-content{
  font-family:'Crimson Pro',serif;font-size:13px;line-height:1.6;
  color:var(--ink-soft);
}
.markdown-content h1{
  font-size:18px;font-weight:500;color:var(--ink);margin:20px 0 12px;
  font-family:'DM Sans',sans-serif;
}
.markdown-content h2{
  font-size:15px;font-weight:500;color:var(--ink);margin:18px 0 10px;
  font-family:'DM Sans',sans-serif;
}
.markdown-content h3{
  font-size:14px;font-weight:500;color:var(--lav-dim);margin:16px 0 8px;
  font-family:'DM Sans',sans-serif;
}
.markdown-content p{margin-bottom:12px;}
.markdown-content ul{margin:8px 0 12px 16px;}
.markdown-content li{
  margin-bottom:4px;list-style:none;position:relative;
}
.markdown-content li::before{
  content:'•';color:var(--lav-dim);font-weight:bold;
  position:absolute;left:-12px;
}
.markdown-content strong{
  font-weight:500;color:var(--ink);
}
.markdown-content em{
  font-style:italic;color:var(--ink-ghost);
}

/* ── TEAM FORM MODAL ── */
.team-form-sheet{
  background:var(--surface);border:1px solid var(--border);border-radius:1px;
  margin:auto;width:90%;max-width:420px;max-height:80vh;overflow-y:auto;
  animation:slideUp 0.3s ease both;position:relative;
}
.team-form-header{
  padding:24px 24px 16px;text-align:center;
  border-bottom:1px solid var(--border);
}
.team-form-title{
  font-size:16px;font-weight:500;color:var(--ink);margin-bottom:4px;
  font-family:'DM Sans',sans-serif;
}
.team-form-subtitle{
  font-size:13px;color:var(--ink-ghost);
  font-family:'Crimson Pro',serif;font-style:italic;
}
.team-form{padding:24px;}
.form-group{margin-bottom:20px;}
.form-label{
  display:block;font-size:12px;font-weight:500;color:var(--ink-soft);
  margin-bottom:6px;letter-spacing:0.05em;text-transform:uppercase;
  font-family:'DM Sans',sans-serif;
}
.form-input{
  width:100%;padding:12px 16px;background:var(--deep);
  border:1px solid var(--border);border-radius:1px;
  font-family:'Crimson Pro',serif;font-size:14px;color:var(--ink);
  transition:border-color 0.2s;
}
.form-input:focus{
  outline:none;border-color:var(--lav-dim);
}
.form-input::placeholder{color:var(--ink-ghost);font-style:italic;}
.form-actions{
  display:flex;gap:12px;margin-top:24px;
}
.form-actions .sheet-btn{flex:1;}

/* ── TEAM CARD IMPROVEMENTS ── */
.team-member-info{flex:1;}
.team-member-name{
  font-size:14px;font-weight:500;color:var(--ink);margin-bottom:2px;
  font-family:'DM Sans',sans-serif;
}
.team-member-specialty{
  font-size:11px;color:var(--lav-dim);margin-bottom:4px;
  font-weight:500;letter-spacing:0.05em;text-transform:uppercase;
  font-family:'DM Sans',sans-serif;
}
.team-member-contact{
  font-size:12px;color:var(--ink-ghost);
  font-family:'Crimson Pro',serif;font-style:italic;
}
.team-card-actions{
  display:flex;align-items:center;gap:8px;
}
.team-share-btn{
  background:var(--lav-glow);border:1px solid var(--lav-dim);border-radius:1px;
  padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:11px;
  color:var(--lav);cursor:pointer;transition:all 0.2s;
  font-weight:500;letter-spacing:0.05em;text-transform:uppercase;
}
.team-share-btn:hover{background:var(--lav-dim);color:var(--ink);}
.team-remove-btn{
  width:32px;height:32px;border-radius:1px;
  border:1px solid var(--border);background:transparent;
  color:var(--ink-ghost);cursor:pointer;
  font-size:18px;font-weight:bold;
  display:flex;align-items:center;justify-content:center;
  transition:all 0.2s;line-height:1;
}
.team-remove-btn:hover{
  border-color:var(--alert-dim);color:var(--alert);
  background:rgba(232,122,122,0.06);
}

/* ── BUTTON IMPROVEMENTS ── */
.sheet-btn:disabled{
  opacity:0.5;cursor:not-allowed;
}
.sheet-btn:disabled:hover{
  border-color:var(--border);color:var(--ink-ghost);background:transparent;
}

/* bottom nav */
.bottom-nav{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:480px;background:var(--deep);
  border-top:1px solid var(--border);
  display:flex;justify-content:space-around;padding:12px 0 20px;z-index:60;
}
.nav-item{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:4px 16px;}
.nav-icon{font-size:18px;line-height:1;opacity:0.4;color:var(--ink-ghost);width:24px;height:24px;display:flex;align-items:center;justify-content:center;}
.nav-label{font-size:9px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-ghost);}
.nav-item.active .nav-icon{opacity:1;color:var(--lav);}
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
    icon: "🔍",
    title: "Personal Health Insights",
    desc: "Intelligent pattern recognition reveals timing correlations, symptom clusters, and cycle-specific trends from your data.",
    meta: "Auto-generated patterns · Real insights",
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



// eslint-disable-next-line no-unused-vars
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

// Team Form Modal Component
function TeamFormModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Doctor',
    contact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate new team member with unique ID
    const newTeamMember = {
      id: Date.now(),
      ...formData
    };
    onSave(newTeamMember);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="sheet-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="team-form-sheet">
        <div className="sheet-handle" />
        <div className="team-form-header">
          <div className="team-form-title">Add Team Member</div>
          <div className="team-form-subtitle">Connect with your healthcare providers</div>
        </div>
        
        <form onSubmit={handleSubmit} className="team-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              name="name"
              className="form-input"
              placeholder="Dr. Smith, Maria Lopez..."
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Specialty</label>
            <select 
              name="specialty"
              className="form-input"
              value={formData.specialty}
              onChange={handleChange}
            >
              <option value="Doctor">Doctor</option>
              <option value="Nutritionist">Nutritionist</option>
              <option value="Therapist">Therapist</option>
              <option value="Trainer">Trainer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Contact</label>
            <input 
              type="text" 
              name="contact"
              className="form-input"
              placeholder="email@example.com or WhatsApp number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="sheet-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="sheet-btn primary">Add to Team</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfileSettings({ onBack, onReset, activeNav, setActiveNav, profile = {}, cycle = {}, notes = [], changes = [], todayNotes = [], cycleHistory = [] }) {
  // Force re-render when profile or changes update to reflect medication changes from chat
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [profile, changes]);
  const [reportPreview, setReportPreview] = useState(null);
  const [downloaded, setDownloaded] = useState({});
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReportContent, setGeneratedReportContent] = useState(null);
  const [reportError, setReportError] = useState(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [healthTeam, setHealthTeam] = useState(() => {
    try {
      const stored = localStorage.getItem('lilith_health_team');
      return stored ? JSON.parse(stored) : [
        // Demo data only if no stored data
        { id: 1, name: "Dr. Sarah Martinez", specialty: "Doctor", contact: "sarah.martinez@healthcenter.com" },
        { id: 2, name: "Alex Chen", specialty: "Therapist", contact: "alex.chen@mindwell.com" }
      ];
    } catch (e) {
      return []; // Empty if localStorage fails
    }
  });

  // Persist healthTeam to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('lilith_health_team', JSON.stringify(healthTeam));
    } catch (e) {
      console.warn('Failed to save health team to localStorage:', e);
    }
  }, [healthTeam]);

  const handleDownload = (id) => {
    setDownloaded(d => ({ ...d, [id]: true }));
    setTimeout(() => setDownloaded(d => ({ ...d, [id]: false })), 2000);
  };

  // Add function to remove health team member
  const removeDoctor = (id) => {
    setHealthTeam(prev => prev.filter(member => member.id !== id));
  };

  // ── INTELLIGENT PATTERN RECOGNITION ENGINE ──────────────────────────────────
  
  const analyzeSymptomPatterns = () => {
    if (notes.length === 0) {
      return [
        "No symptom data available yet",
        "Start tracking daily to discover patterns",
        "Insights will appear after logging consistently"
      ];
    }

    // Get last 10 notes with cycle context for pattern analysis
    const analysisNotes = notes
      .filter(note => note.cycleDay && note.text) // Only notes with cycle context
      .slice(-10);

    if (analysisNotes.length < 3) {
      return [
        `${notes.length} journal entries recorded`,
        "Continue tracking to unlock pattern insights", 
        "Patterns emerge with consistent daily logging"
      ];
    }

    const insights = [];

    // Pattern 1: Symptom timing analysis
    const symptomKeywords = {
      digestive: ['bloat', 'stomach', 'nausea', 'digest', 'gut', 'constipat', 'diarrhea'],
      pain: ['pain', 'cramp', 'headache', 'migraine', 'ache', 'hurt', 'sore'],
      mood: ['anxious', 'anxiety', 'sad', 'depressed', 'irritated', 'mood', 'emotional', 'cry'],
      energy: ['tired', 'fatigue', 'exhausted', 'energy', 'sleepy', 'alert', 'awake'],
      sleep: ['sleep', 'insomnia', 'restless', 'dream', 'nighttime', 'bedtime']
    };

    // Analyze timing patterns for each symptom type
    Object.entries(symptomKeywords).forEach(([symptomType, keywords]) => {
      const symptomNotes = analysisNotes.filter(note => 
        keywords.some(keyword => note.text.toLowerCase().includes(keyword))
      );

      if (symptomNotes.length >= 2) {
        // Find common timing patterns
        const cycleDays = symptomNotes.map(note => note.cycleDay);
        
        // Check for late luteal concentration (days 22-28)
        const lateLutealSymptoms = cycleDays.filter(day => day >= 22).length;
        if (lateLutealSymptoms >= 2) {
          const capitalizedType = symptomType.charAt(0).toUpperCase() + symptomType.slice(1);
          insights.push(`${capitalizedType} issues peak during late luteal phase (Day 22-28)`);
        }
        
        // Check for pre-menstrual pattern (days 26-28 or day 1-2)
        const preMenstrualSymptoms = cycleDays.filter(day => day >= 26 || day <= 2).length;
        if (preMenstrualSymptoms >= 2 && insights.length < 3) {
          const capitalizedType = symptomType.charAt(0).toUpperCase() + symptomType.slice(1);
          insights.push(`${capitalizedType} symptoms often appear 2-3 days before/after bleeding`);
        }
        
        // Check for mid-cycle patterns (ovulation, days 12-16)
        const midCycleSymptoms = cycleDays.filter(day => day >= 12 && day <= 16).length;
        if (midCycleSymptoms >= 2 && insights.length < 3) {
          const capitalizedType = symptomType.charAt(0).toUpperCase() + symptomType.slice(1);
          insights.push(`${capitalizedType} changes noted around ovulation (Day 12-16)`);
        }
      }
    });

    // Pattern 2: Phase-based energy analysis
    if (insights.length < 3) {
      const energyWords = ['energy', 'tired', 'exhausted', 'alert', 'awake', 'motivated'];
      const energyNotes = analysisNotes.filter(note => 
        energyWords.some(word => note.text.toLowerCase().includes(word))
      );

      if (energyNotes.length >= 2) {
        const follicularEnergy = energyNotes.filter(note => note.cyclePhase === 'follicular').length;
        const lutealEnergy = energyNotes.filter(note => note.cyclePhase === 'luteal').length;

        if (follicularEnergy > 0 && lutealEnergy > 0) {
          insights.push("Energy levels fluctuate significantly between follicular and luteal phases");
        } else if (follicularEnergy >= 2) {
          insights.push("Energy consistently peaks during follicular phase (Day 6-13)");
        } else if (lutealEnergy >= 2) {
          insights.push("Fatigue patterns most common during luteal phase");
        }
      }
    }

    // Pattern 3: Cycle regularity and general health correlations
    if (insights.length < 3) {
      const totalCycles = 1 + (cycleHistory?.length || 0);
      const symptomFrequency = analysisNotes.filter(note => 
        ['pain', 'cramp', 'headache', 'bloat', 'anxious', 'tired'].some(symptom => 
          note.text.toLowerCase().includes(symptom)
        )
      ).length;

      if (symptomFrequency >= 4) {
        insights.push(`Symptoms documented in ${Math.round((symptomFrequency / analysisNotes.length) * 100)}% of recent entries`);
      } else if (totalCycles > 1) {
        insights.push(`Tracking ${totalCycles} cycles reveals consistent monthly patterns`);
      } else {
        insights.push("Building baseline data for future pattern recognition");
      }
    }

    // Ensure we always have exactly 3 insights
    while (insights.length < 3) {
      const fallbackInsights = [
        `${analysisNotes.length} entries with cycle context analyzed for patterns`,
        "Continue daily tracking to strengthen pattern detection",
        "Personal insights improve with consistent data collection"
      ];
      
      for (let fallback of fallbackInsights) {
        if (!insights.includes(fallback) && insights.length < 3) {
          insights.push(fallback);
        }
      }
    }

    return insights.slice(0, 3);
  };

  // Create dynamic medication history from changes and notes
  const getMedicationHistory = () => {
    if (!changes || changes.length === 0) {
      return "No medication changes logged yet. Tell Lilith about any medication starts, stops, or dose changes to see them here.";
    }
    
    // Filter for medication-related changes
    const medicationChanges = changes
      .filter(change => {
        const text = change.text?.toLowerCase() || '';
        return change.type === 'medication' || 
               text.includes('medication') || 
               text.includes('pill') ||
               text.includes('dose') ||
               text.includes('prescription') ||
               text.includes('mg') ||
               text.includes('started') ||
               text.includes('stopped') ||
               text.includes('sertraline') ||
               text.includes('zoloft') ||
               text.includes('birth control');
      })
      .slice(0, 10) // Most recent 10
      .reverse(); // Show newest first
    
    if (medicationChanges.length === 0) {
      const totalChanges = changes.length;
      return `No specific medication changes detected in ${totalChanges} logged change${totalChanges !== 1 ? 's' : ''}. Your general health changes are tracked below.`;
    }

    return medicationChanges.map(change => 
      `📅 ${change.date}: ${change.text}${change.badge ? ` (${change.badge})` : ''}`
    ).join('\n\n');
  };

  // Generate enhanced medication report with proper structure
  const generateMedicationReport = () => {
    // Get current medications from profile
    const currentMeds = profile?.medications || [];
    
    // Get medication changes from the changes log
    const medicationChanges = changes?.filter(change => 
      change.type === 'medication'
    ) || [];

    // Active medications from profile
    const activeMedications = currentMeds
      .filter(med => !med.status || med.status === 'active')
      .map(med => {
        if (typeof med === 'string') return med;
        const startInfo = med.startDate ? ` (Started: ${med.startDate})` : '';
        return `${med.name || 'Unknown'}${med.dose ? ` (${med.dose})` : ''}${startInfo}`;
      });

    // Recent movements (medication changes) - show only movements, not duplicates
    const recentMovements = medicationChanges
      .slice(-8) // Last 8 changes
      .reverse()
      .map(change => {
        // Clean format for movements
        if (change.badge === 'Started') return `${change.text} - ${change.date}`;
        if (change.badge === 'Dose change') return `${change.text} - ${change.date}`;  
        if (change.badge === 'Discontinued') return `${change.text} - ${change.date}`;
        return `${change.text} - ${change.date}`;
      });

    // Discontinued medications with proper end dates
    const discontinuedMedications = currentMeds
      .filter(med => med.status === 'inactive')
      .map(med => {
        const duration = med.startDate && med.endDate ? 
          calculateMedicationDuration(med.startDate, med.endDate) : '';
        return `${med.name}${med.dose ? ` (${med.dose})` : ''} - Stopped: ${med.endDate || 'Unknown date'}${duration ? ` (Duration: ${duration})` : ''}`;
      });
    
    return {
      title: "Medication Management",
      activeMedications: activeMedications,
      recentMovements: recentMovements,
      discontinuedMedications: discontinuedMedications,
      totalChanges: medicationChanges.length,
      trackingPeriod: `${medicationChanges.length} medication changes logged`
    };
  };

  // Calculate medication duration for medical records
  const calculateMedicationDuration = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) return `${diffDays} days`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
      return `${Math.floor(diffDays / 365)} years, ${Math.floor((diffDays % 365) / 30)} months`;
    } catch (e) {
      return '';
    }
  };

  // ── REPORT CACHING SYSTEM ──────────────────────────────────────────────────
  
  // Cache keys for different report types
  const getCacheKey = (reportType) => {
    const userId = profile?.name || 'default_user';
    return `lilith_report_${reportType}_${userId}`;
  };

  // Check if cached report is still valid (less than 24 hours old)
  const isCacheValid = (cachedReport) => {
    if (!cachedReport || !cachedReport.timestamp) return false;
    
    const now = Date.now();
    const cacheAge = now - cachedReport.timestamp;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return cacheAge < TWENTY_FOUR_HOURS;
  };

  // Save report to cache
  const saveReportToCache = (reportType, reportContent) => {
    const cacheKey = getCacheKey(reportType);
    const cacheData = {
      content: reportContent,
      timestamp: Date.now(),
      version: '1.0',
      dataHash: generateDataHash() // Hash of current data for invalidation
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('💾 Report cached successfully:', reportType);
    } catch (error) {
      console.warn('⚠️ Failed to cache report:', error);
    }
  };

  // Load report from cache
  const loadReportFromCache = (reportType) => {
    const cacheKey = getCacheKey(reportType);
    
    try {
      const cachedData = localStorage.getItem(cacheKey);
      if (!cachedData) return null;
      
      const parsed = JSON.parse(cachedData);
      
      // Check if cache is still valid
      if (!isCacheValid(parsed)) {
        // Remove expired cache
        localStorage.removeItem(cacheKey);
        console.log('🗑️ Removed expired cache for:', reportType);
        return null;
      }
      
      console.log('✨ Loaded report from cache:', reportType);
      return parsed;
    } catch (error) {
      console.warn('⚠️ Failed to load cached report:', error);
      return null;
    }
  };

  // Generate a simple hash of current data for cache invalidation
  const generateDataHash = () => {
    const dataToHash = {
      notesCount: notes.length,
      changesCount: changes.length,
      lastNoteDate: notes.length > 0 ? notes[notes.length - 1]?.date : null,
      cyclePhase: cycle?.phase
    };
    
    // Simple hash function (for demonstration - in production, use a proper hash)
    return JSON.stringify(dataToHash).split('').reduce((hash, char) => {
      hash = ((hash << 5) - hash) + char.charCodeAt(0);
      return hash & hash; // Convert to 32-bit integer
    }, 0).toString();
  };

  // Clear all cached reports (useful for testing or data reset)
  const clearReportCache = () => {
    const userId = profile?.name || 'default_user';
    const cacheKeys = ['doctor', 'nutritionist', 'trainer'].map(type => 
      `lilith_report_${type}_${userId}`
    );
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🧹 All report caches cleared');
  };

  // Mapeo de tipos de reportes del componente a tipos de IA
  const mapReportTypeToAI = (reportType) => {
    const mapping = {
      'doctor': 'medical',
      'nutritionist': 'nutritional', 
      'trainer': 'fitness'
    };
    return mapping[reportType] || 'medical';
  };

  // Enhanced report generation with caching system
  const generateAIReport = async (reportType, forceRefresh = false) => {
    console.log('🎯 Generating enhanced report for type:', reportType, forceRefresh ? '(FORCED REFRESH)' : '');

    // Handle special report types with real data (no caching needed for these)
    if (reportType === 'changes') {
      const medicationReport = generateMedicationReport();
      setReportPreview({
        ...medicationReport,
        type: 'medication',
        content: medicationReport.recentChanges
      });
      return;
    }

    if (reportType === 'symptoms') {
      // No loading state needed - pattern analysis is instant
      try {
        const patternInsights = analyzeSymptomPatterns();
        setReportPreview({
          title: "Personal Health Insights",
          type: 'symptoms',
          points: patternInsights,
          totalNotes: notes.length,
          cycleContext: cycle?.phase ? `Currently in ${cycle.phase} phase (Day ${cycle.cycleDay || '?'})` : 'Cycle tracking in progress'
        });
      } catch (error) {
        setReportError('Failed to analyze symptom patterns: ' + error.message);
      }
      return;
    }

    // ── CACHE CHECK FOR AI REPORTS ──
    if (!forceRefresh) {
      const cachedReport = loadReportFromCache(reportType);
      if (cachedReport) {
        console.log('⚡ Using cached report for:', reportType);
        
        // Show cached content immediately
        setGeneratedReportContent({
          type: reportType,
          aiType: mapReportTypeToAI(reportType),
          content: cachedReport.content.content,
          generatedAt: cachedReport.content.generatedAt,
          fromCache: true,
          cacheTimestamp: cachedReport.timestamp
        });
        
        setReportPreview(reportType);
        return;
      }
    }

    // ── GENERATE NEW REPORT ──
    setIsGeneratingReport(true);
    setReportError(null);
    setGeneratedReportContent(null);

    try {
      console.log('🤖 Generating AI medical report for type:', reportType);
      
      // Map report type and prepare data
      const aiReportType = mapReportTypeToAI(reportType);
      
      // Use notes as journal data (contains daily logs)
      const journalData = notes || [];
      
      // Prepare user profile with cycle data
      const userProfileForAI = {
        ...profile,
        cycleLength: cycle?.cycleLength,
        currentPhase: cycle?.phase,
        lastPeriodDate: cycle?.lastPeriodDate,
        notesCount: journalData.length
      };

      console.log('📊 Enviando datos a IA:', {
        journalEntries: journalData.length,
        reportType: aiReportType,
        userProfile: userProfileForAI.name || 'Sin nombre'
      });

      // Load chat history for comprehensive context
      const chatHistory = JSON.parse(localStorage.getItem('lilith_chat_history') || '[]');
      
      // Call AI function with chat context
      const aiResponse = await generateMedicalReport(journalData, userProfileForAI, aiReportType, chatHistory);
      
      console.log('✅ Respuesta de IA recibida');

      // Prepare report content
      const reportContent = {
        type: reportType,
        aiType: aiReportType,
        content: aiResponse,
        generatedAt: new Date().toLocaleDateString("en-US", { 
          month: "long", 
          day: "numeric", 
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }),
        fromCache: false
      };

      // Save to cache
      saveReportToCache(reportType, reportContent);

      // Set generated content and show preview
      setGeneratedReportContent(reportContent);
      setReportPreview(reportType);

    } catch (error) {
      console.error('❌ Error generando reporte de IA:', error);
      setReportError(`Error al generar el reporte: ${error.message || 'Problema de conexión'}`);
      
      // Fallback to static content on error
      setReportPreview(reportType);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const safeStr = (val) => {
    if (!val) return "—";
    if (typeof val === "string") return val;
    if (Array.isArray(val)) {
      return val.map(v => {
        if (typeof v === "string") return v;
        if (v.name && v.dose) return `${v.name} (${v.dose})`;
        if (v.name) return v.name;
        return v.label || "";
      }).filter(Boolean).join(", ");
    }
    if (typeof val === "object") {
      if (val.name && val.dose) return `${val.name} (${val.dose})`;
      if (val.name) return val.name;
      return val.label || Object.values(val).filter(v => typeof v === "string").join(", ");
    }
    return String(val);
  };

  // Convierte Markdown simple a HTML para mostrar en la UI
  const formatMarkdownToHTML = (markdown) => {
    if (!markdown) return '';

    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Unordered lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n/g, '<br />');

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Clean up nested ul tags
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    return html;
  };

  // Generate PDF report
  const generatePDF = () => {
    if (!content || !generatedReportContent) return;
    
    // Create a clean print version
    const printWindow = window.open('', '_blank');
    const reportContent = content.content || '';
    const userName = profile?.name || 'User';
    const currentPhase = cycle?.phase || 'Unknown Phase';
    const reportDate = generatedReportContent.generatedAt || new Date().toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true
    });

    const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lilith Health Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        
        @page { 
          margin: 0; 
          size: A4;
        }
        
        body { 
          font-family: 'Crimson Pro', serif; 
          line-height: 1.6; 
          color: #2d3748; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 40px 20px; 
        }
        
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 2px solid #e2e8f0; 
          padding-bottom: 30px; 
        }
        
        .logo-container { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin-bottom: 15px; 
        }
        
        .logo-svg { 
          width: 40px; 
          height: 40px; 
          margin-right: 10px; 
        }
        
        .app-name { 
          font-family: 'Playfair Display', serif; 
          font-size: 24px; 
          font-weight: 400; 
          color: #2d3748; 
          margin-bottom: 5px; 
        }
        
        .user-info { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 14px; 
          color: #718096; 
          margin-bottom: 10px; 
        }
        
        .report-meta { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 12px; 
          color: #a0aec0; 
        }
        
        h1 { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 22px; 
          font-weight: 500; 
          color: #2d3748; 
          margin: 30px 0 15px; 
        }
        
        h2 { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 18px; 
          font-weight: 500; 
          color: #4a5568; 
          margin: 25px 0 12px; 
        }
        
        h3 { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 16px; 
          font-weight: 500; 
          color: #c4b0e8; 
          margin: 20px 0 10px; 
        }
        
        p { 
          margin-bottom: 12px; 
          font-size: 14px; 
        }
        
        ul { 
          margin: 10px 0 15px 20px; 
        }
        
        li { 
          margin-bottom: 6px; 
          font-size: 14px; 
          list-style: none; 
          position: relative; 
        }
        
        li::before { 
          content: '•'; 
          color: #c4b0e8; 
          font-weight: bold; 
          position: absolute; 
          left: -15px; 
        }
        
        strong { 
          font-weight: 500; 
          color: #2d3748; 
        }
        
        @media print {
          body { 
            padding: 20px; 
          }
          .header { 
            page-break-inside: avoid; 
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-container">
          <svg class="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7L12 12L21 7L12 2Z" fill="#c4b0e8"/>
            <path d="M3 17L12 22L21 17" stroke="#c4b0e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 12L12 17L21 12" stroke="#c4b0e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="app-name">Lilith</div>
        </div>
        <div class="user-info">${userName} • Current Phase: ${currentPhase}</div>
        <div class="report-meta">Generated ${reportDate}</div>
      </div>
      
      <div class="content">
        ${formatMarkdownToHTML(reportContent)}
      </div>
    </body>
    </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Generate specialized PDF for specific healthcare provider
  const generateSpecializedPDF = async (specialty, teamMember) => {
    console.log('🏥 Generating specialized report for:', specialty, teamMember.name);
    
    // Map specialty to AI report type, including therapist
    const specialtyToReportType = {
      'doctor': 'medical',
      'nutritionist': 'nutritional',
      'therapist': 'mental-health', // New type for therapists
      'trainer': 'fitness'
    };
    
    const reportType = specialtyToReportType[specialty] || 'medical';
    
    try {
      // Generate AI report specifically for this provider
      setIsGeneratingReport(true);
      
      // Use existing journal data
      const journalData = notes || [];
      const userProfileForAI = {
        ...profile,
        cycleLength: cycle?.cycleLength,
        currentPhase: cycle?.phase,
        lastPeriodDate: cycle?.lastPeriodDate,
        notesCount: journalData.length
      };

      console.log('📊 Generating specialized report:', {
        for: teamMember.name,
        specialty: specialty,
        reportType: reportType,
        journalEntries: journalData.length
      });

      // Load chat history for comprehensive context
      const chatHistory = JSON.parse(localStorage.getItem('lilith_chat_history') || '[]');
      
      // Call AI function with chat context
      const aiResponse = await generateMedicalReport(journalData, userProfileForAI, reportType, chatHistory);
      
      // Generate PDF directly
      generatePDFForProvider(aiResponse, teamMember, reportType);
      
    } catch (error) {
      console.error('❌ Error generating specialized report:', error);
      alert('Error generating report for ' + teamMember.name + '. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Generate PDF specifically formatted for healthcare provider
  const generatePDFForProvider = (reportContent, teamMember, reportType) => {
    const printWindow = window.open('', '_blank');
    const userName = profile?.name || 'User';
    const currentPhase = cycle?.phase || 'Unknown Phase';
    const reportDate = new Date().toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true
    });

    const reportTitles = {
      'medical': 'Medical Cycle Report',
      'nutritional': 'Nutritional Assessment',
      'mental-health': 'Mental Health & Cycle Report',
      'fitness': 'Performance & Training Report'
    };

    const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${reportTitles[reportType]} - ${teamMember.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        
        @page { 
          margin: 0; 
          size: A4;
        }
        
        body { 
          font-family: 'Crimson Pro', serif; 
          line-height: 1.6; 
          color: #2d3748; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 40px 20px; 
        }
        
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 2px solid #e2e8f0; 
          padding-bottom: 30px; 
        }
        
        .logo-container { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin-bottom: 15px; 
        }
        
        .logo-svg { 
          width: 40px; 
          height: 40px; 
          margin-right: 10px; 
        }
        
        .app-name { 
          font-family: 'Playfair Display', serif; 
          font-size: 24px; 
          font-weight: 400; 
          color: #2d3748; 
          margin-bottom: 5px; 
        }
        
        .report-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: #c4b0e8;
          margin-bottom: 10px;
        }
        
        .provider-info {
          background: #f7fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #c4b0e8;
        }
        
        .provider-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #2d3748;
          margin-bottom: 5px;
        }
        
        .provider-specialty {
          font-size: 14px;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
        
        .user-info { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 14px; 
          color: #718096; 
          margin-bottom: 10px; 
        }
        
        .report-meta { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 12px; 
          color: #a0aec0; 
        }
        
        h1 { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 22px; 
          font-weight: 500; 
          color: #2d3748; 
          margin: 30px 0 15px; 
        }
        
        h2 { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 18px; 
          font-weight: 500; 
          color: #4a5568; 
          margin: 25px 0 12px; 
        }
        
        h3 { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 16px; 
          font-weight: 500; 
          color: #c4b0e8; 
          margin: 20px 0 10px; 
        }
        
        p { 
          margin-bottom: 12px; 
          font-size: 14px; 
        }
        
        ul { 
          margin: 10px 0 15px 20px; 
        }
        
        li { 
          margin-bottom: 6px; 
          font-size: 14px; 
          list-style: none; 
          position: relative; 
        }
        
        li::before { 
          content: '•'; 
          color: #c4b0e8; 
          font-weight: bold; 
          position: absolute; 
          left: -15px; 
        }
        
        strong { 
          font-weight: 500; 
          color: #2d3748; 
        }
        
        @media print {
          body { 
            padding: 20px; 
          }
          .header { 
            page-break-inside: avoid; 
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-container">
          <svg class="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7L12 12L21 7L12 2Z" fill="#c4b0e8"/>
            <path d="M3 17L12 22L21 17" stroke="#c4b0e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 12L12 17L21 12" stroke="#c4b0e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="app-name">Lilith</div>
        </div>
        <div class="report-title">${reportTitles[reportType]}</div>
        <div class="provider-info">
          <div class="provider-name">For: ${teamMember.name}</div>
          <div class="provider-specialty">${teamMember.specialty} • ${teamMember.contact}</div>
        </div>
        <div class="user-info">${userName} • Current Phase: ${currentPhase}</div>
        <div class="report-meta">Generated ${reportDate}</div>
      </div>
      
      <div class="content">
        ${formatMarkdownToHTML(reportContent)}
      </div>
    </body>
    </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Copy shareable link
  const copyShareableLink = async () => {
    const shareableUrl = `https://lilith.app/report/temp-${Date.now()}`;
    
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const buildReportContent = (type) => {
    // Handle new dynamic report types
    if (type && typeof type === 'object') {
      // This is a dynamic report object, not just a type string
      if (type.type === 'symptoms') {
        return {
          eyebrow: "Pattern Recognition",
          title: type.title || "Personal Health Insights",
          sub: `Based on ${type.totalNotes || 0} journal entries · Analyzed ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}`,
          aiGenerated: true,
          content: `## 🔍 Personal Insights\n\n${(type.points || []).map(point => `△ ${point}`).join('\n')}\n\n## 📊 Current Status\n${type.cycleContext || 'No cycle context available'}\n\n*Insights are automatically generated from your personal data patterns*`,
          error: reportError
        };
      }
      
      if (type.type === 'medication') {
        return {
          eyebrow: "Real-Time Data",
          title: type.title || "Medication Management",
          sub: `${type.trackingPeriod || 'All time'} · Updated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}`,
          sections: [
            {
              title: "Current Medications (Active)",
              customContent: type.activeMedications && type.activeMedications.length > 0 ? 
                type.activeMedications.map(med => `• ${med}`).join('\n') :
                "No active medications currently logged.\nUse the 💊 quick action in chat to add medications."
            },
            {
              title: "Recent Changes",
              customContent: type.recentMovements && type.recentMovements.length > 0 ?
                type.recentMovements.map(change => `• ${change}`).join('\n') :
                "No recent medication changes.\nTell Lilith about dose changes, new medications, or discontinued ones."
            },
            ...(type.discontinuedMedications && type.discontinuedMedications.length > 0 ? [{
              title: "Previous Medications (Inactive/Discontinued)",
              customContent: type.discontinuedMedications.map(med => `• ${med}`).join('\n')
            }] : [])
          ]
        };
      }
    }

    // Si tenemos contenido generado por IA para este tipo de reporte, usarlo
    if (generatedReportContent && generatedReportContent.type === type) {
      const aiContent = generatedReportContent;
      const reportTitles = {
        'doctor': 'Medical Cycle Report',
        'nutritionist': 'Nutrition & Cycle Report', 
        'trainer': 'Training & Cycle Report'
      };
      
      return {
        eyebrow: `AI-Generated ${aiContent.aiType.charAt(0).toUpperCase() + aiContent.aiType.slice(1)} Report`,
        title: reportTitles[type] || 'Cycle Report',
        sub: `Generated by Lilith AI · ${aiContent.generatedAt}`,
        aiGenerated: true,
        content: aiContent.content,
        error: reportError
      };
    }

    // Fallback to original static content
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
            {healthTeam.length > 0 ? (
              healthTeam.map(member => (
                <div key={member.id} className="team-card">
                  <div className="team-member-info">
                    <div className="team-member-name">{member.name}</div>
                    <div className="team-member-specialty">{member.specialty}</div>
                    <div className="team-member-contact">{member.contact}</div>
                  </div>
                  <div className="team-card-actions">
                    <button 
                      className="team-share-btn"
                      onClick={() => generateSpecializedPDF(member.specialty.toLowerCase(), member)}
                    >
                      Share Report
                    </button>
                    <button 
                      className="team-remove-btn"
                      onClick={() => removeDoctor(member.id)}
                      title="Remove from team"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "20px", textAlign: "center", fontFamily: "'Crimson Pro',serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-ghost)" }}>
                Add your doctor, nutritionist, or trainer to share reports with them.
              </div>
            )}
            <button className="team-add" onClick={() => setShowTeamForm(true)}>+ Add someone to your team</button>
          </div>
        </div>

        {/* ── REPORTS ── */}
        <div className="ps-section">
          <div className="ps-section-label">Download reports</div>
          <div className="report-cards">
            {REPORTS.map(r => {
              const cachedReport = loadReportFromCache(r.type);
              const hasCachedVersion = cachedReport && isCacheValid(cachedReport);
              
              return (
                <div key={r.id} className={`report-card ${hasCachedVersion ? 'has-cache' : ''}`}
                  onClick={() => generateAIReport(r.type)}>
                  <span className="report-icon">{r.icon}</span>
                  <div className="report-body">
                    <div className="report-title">{r.title}</div>
                    <div className="report-desc">{r.desc}</div>
                    <div className="report-meta">
                      {r.meta}
                      {hasCachedVersion && (
                        <span className="cache-status"> • Recent version available</span>
                      )}
                    </div>
                  </div>
                  <div className="report-actions">
                    {hasCachedVersion && (
                      <div className="cache-dot" title="Cached version available" />
                    )}
                    <button className={`report-dl ${downloaded[r.id] ? "done" : ""}`}
                      onClick={e => { e.stopPropagation(); handleDownload(r.id); }}>
                      {downloaded[r.id] ? "✓" : "↓"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── HEALTH & MEDICATION TIMELINE ── */}
        <div className="ps-section">
          <div className="ps-section-label">Health & Medication Timeline</div>
          
          {(() => {
            // Get all changes and sort them chronologically
            const allChanges = [...changes].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Remove duplicates: keep most recent entry per day for same event type
            const deduplicatedChanges = allChanges.reduce((acc, change) => {
              const existingIndex = acc.findIndex(existing => 
                existing.date === change.date && 
                existing.type === change.type &&
                existing.text?.toLowerCase().includes('cycle') === change.text?.toLowerCase().includes('cycle')
              );
              
              if (existingIndex === -1) {
                acc.push(change);
              } else {
                // Keep the one with more information (longer text or specific flow info)
                const existing = acc[existingIndex];
                if ((change.text?.length || 0) > (existing.text?.length || 0) ||
                    (change.text?.toLowerCase().includes('flow:') && !existing.text?.toLowerCase().includes('flow:'))) {
                  acc[existingIndex] = change;
                }
              }
              return acc;
            }, []);

            // Humanize text descriptions
            const humanizeText = (text, type, badge) => {
              if (!text) return text;
              
              const lowerText = text.toLowerCase();
              
              // Medication changes
              if (type === 'medication' || lowerText.includes('medication') || lowerText.includes('pill')) {
                if (lowerText.includes('started') || badge === 'Started') {
                  return text.replace(/started/i, 'Started').replace(/medication/i, '').trim() + ' (Doctor\'s advice)';
                }
                if (lowerText.includes('discontinued') || badge === 'Discontinued') {
                  return text.replace(/discontinued/i, 'Stopped').replace(/medication/i, '').trim();
                }
                if (lowerText.includes('dose')) {
                  return text.replace(/dose change/i, 'Dose adjusted');
                }
              }
              
              // Cycle changes  
              if (lowerText.includes('new cycle') || lowerText.includes('cycle started')) {
                const flowMatch = text.match(/flow:\s*(\w+)/i);
                const flowText = flowMatch ? ` (${flowMatch[1]} flow)` : '';
                return `New cycle started${flowText}`;
              }
              
              if (lowerText.includes('period ended')) {
                return text.replace(/period ended/i, 'Period ended');
              }
              
              if (lowerText.includes('ovulation')) {
                return text.replace(/ovulation logged/i, 'Ovulation detected');
              }
              
              return text;
            };

            // Get color class based on type and content
            const getEventColor = (change) => {
              if (change.type === 'medication' || 
                  change.text?.toLowerCase().includes('medication') ||
                  change.text?.toLowerCase().includes('pill') ||
                  change.text?.toLowerCase().includes('dose')) {
                return 'timeline-dot-blue';
              }
              if (change.type === 'cycle' || 
                  change.text?.toLowerCase().includes('cycle') ||
                  change.text?.toLowerCase().includes('period') ||
                  change.text?.toLowerCase().includes('ovulation')) {
                return 'timeline-dot-red';
              }
              return 'timeline-dot-grey';
            };

            // Group by date to avoid repetition
            const groupedByDate = deduplicatedChanges.reduce((acc, change) => {
              const date = change.date;
              if (!acc[date]) acc[date] = [];
              acc[date].push(change);
              return acc;
            }, {});

            return Object.keys(groupedByDate).length === 0 ? (
              <div style={{ 
                padding: "32px 20px", 
                textAlign: "center", 
                fontFamily: "'Crimson Pro',serif", 
                fontStyle: "italic", 
                fontSize: 14, 
                color: "var(--ink-ghost)" 
              }}>
                Your health and medication changes will appear here as you share them with Lilith.
              </div>
            ) : (
              <div className="health-timeline">
                <div className="timeline-line" />
                {Object.entries(groupedByDate).slice(0, 10).map(([date, dayChanges]) => (
                  <div key={date} className="timeline-day-group">
                    <div className="timeline-date-header">{date}</div>
                    {dayChanges.map((change, i) => (
                      <div key={change.id || i} className="timeline-item">
                        <div className="timeline-dot-container">
                          <div className={`timeline-dot ${getEventColor(change)}`} />
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-text">
                            {humanizeText(change.text, change.type, change.badge)}
                          </div>
                          <div className={`timeline-badge ${change.type || "general"}`}>
                            {change.badge || (change.type === 'medication' ? 'Medication' : 
                                             change.type === 'cycle' ? 'Cycle' : 'Update')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* ── DATA INTEGRITY CHECK ── */}
        <div className="ps-section">
          <div className="ps-section-label">Data Health</div>
          {(() => {
            const notesWithCycleContext = notes.filter(note => note.cycleDay && note.cyclePhase);
            const notesWithoutContext = notes.filter(note => !note.cycleDay);
            const totalCycles = 1 + (cycleHistory?.length || 0);
            
            return (
              <div className="data-health-panel">
                <div className="data-stat-row">
                  <span className="data-stat-label">Journal notes with cycle context</span>
                  <span className="data-stat-value">
                    {notesWithCycleContext.length}/{notes.length}
                    {notesWithCycleContext.length === notes.length ? " ✓" : " ⚠️"}
                  </span>
                </div>
                <div className="data-stat-row">
                  <span className="data-stat-label">Total tracked cycles</span>
                  <span className="data-stat-value">{totalCycles}</span>
                </div>
                <div className="data-stat-row">
                  <span className="data-stat-label">Cycle history preserved</span>
                  <span className="data-stat-value">{cycleHistory?.length || 0} cycles ✓</span>
                </div>
                
                {notesWithoutContext.length > 0 && (
                  <div className="data-integrity-warning">
                    <div className="warning-icon">⚠️</div>
                    <div className="warning-text">
                      {notesWithoutContext.length} notes missing cycle context. 
                      This can happen with imported notes or old data.
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
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

        {/* ── TEAM FORM MODAL ── */}
        {showTeamForm && (
          <TeamFormModal 
            onClose={() => setShowTeamForm(false)} 
            onSave={(newMember) => setHealthTeam(prev => [...prev, newMember])}
          />
        )}

        {/* ── LOADING STATE ── */}
        {isGeneratingReport && (
          <div className="sheet-overlay">
            <div className="report-sheet">
              <div className="sheet-handle" />
              <div className="report-loading">
                <div className="loading-icon lilith-triangle">△</div>
                <div className="loading-title">Analyzing your hormonal patterns...</div>
                <div className="loading-subtitle">Lilith is processing your cycle data</div>
                <div className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── REPORT PREVIEW SHEET ── */}
        {reportPreview && content && !isGeneratingReport && (
          <div className="sheet-overlay"
            onClick={e => { if (e.target === e.currentTarget) setReportPreview(null); }}>
            <div className="report-sheet">
              <div className="sheet-handle" />
              <div className="report-preview-header">
                <div className="report-header-top">
                  <div className="report-header-left">
                    <div className="report-preview-eyebrow">{content.eyebrow}</div>
                    <div className="report-preview-title">{content.title}</div>
                    <div className="report-preview-sub">
                      {content.sub}
                      {generatedReportContent?.fromCache && (
                        <span className="cache-indicator"> • Cached report</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Refresh button for AI reports */}
                  {generatedReportContent && ['doctor', 'nutritionist', 'trainer'].includes(reportPreview) && (
                    <div className="report-header-actions">
                      <button 
                        className="refresh-btn"
                        onClick={() => generateAIReport(reportPreview, true)}
                        disabled={isGeneratingReport}
                        title={generatedReportContent.fromCache ? 
                          "Generate fresh report with latest data" : 
                          "Regenerate report"
                        }
                      >
                        <span className="refresh-icon">↻</span>
                        <span className="refresh-text">
                          {generatedReportContent.fromCache ? 'Update' : 'Refresh'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── CONTENIDO GENERADO POR IA ── */}
              {content.aiGenerated ? (
                <div className="ai-report-content">
                  {reportError && (
                    <div className="report-error">
                      <div className="error-icon">⚠️</div>
                      <div className="error-text">{reportError}</div>
                    </div>
                  )}

                  <div className="markdown-content" 
                       dangerouslySetInnerHTML={{ __html: formatMarkdownToHTML(content.content) }}>
                  </div>
                </div>
              ) : (
                <>
                  {/* ── CONTENIDO ESTÁTICO ORIGINAL ── */}
                  {content.sections?.map((sec, i) => (
                    <div key={i} className="report-section">
                      <div className="report-section-title">{sec.title}</div>
                      {sec.lines && sec.lines.map((l, j) => (
                        <div key={j} className="report-line">
                          <span className="report-line-key">{l.key}</span>
                          <span className="report-line-val">{l.val}</span>
                        </div>
                      ))}
                      {sec.customContent && (
                        <div className="report-custom-content">
                          <pre style={{ 
                            fontFamily: "'Crimson Pro', serif", 
                            fontSize: "14px", 
                            lineHeight: "1.6", 
                            color: "var(--ink-soft)", 
                            whiteSpace: "pre-wrap",
                            margin: "8px 0"
                          }}>
                            {sec.customContent}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}

                  {content.lilith && (
                    <div className="report-section">
                      <div className="report-section-title">Lilith's observations</div>
                      <div className="report-lilith-block">
                        <div className="report-lilith-label">✦ Lilith</div>
                        <div className="report-lilith-text">{content.lilith}</div>
                      </div>
                    </div>
                  )}

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
                </>
              )}

              <div className="sheet-actions">
                <button className="sheet-btn" onClick={() => {
                  setReportPreview(null);
                  setGeneratedReportContent(null);
                  setReportError(null);
                }}>Close</button>
                
                <button className="sheet-btn primary" onClick={copyShareableLink}>
                  {linkCopied ? '✓ Link copied!' : 'Copy shareable link'}
                </button>
                
                <button 
                  className="sheet-btn primary" 
                  onClick={generatePDF}
                  disabled={!content || !generatedReportContent}
                >
                  Export PDF
                </button>
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
