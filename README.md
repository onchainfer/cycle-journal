# Lilith — Cycle Intelligence That Knows You

> **#75HER Hackathon Submission · CreateHerFest 2026**  
> Live demo: [cycle-journal.vercel.app](https://cycle-journal.vercel.app)  
> Demo video: [\[YouTube — add link before submission\]](https://youtu.be/dm-l2zwaalw)  
> License: MIT

---

## The 4-Line Problem Frame

1. **Who:** Neurodivergent women and women with PMDD, endometriosis, and irregular cycles
2. **What:** No existing period tracker understands how hormones interact with ADHD, medication, or mental health — they just count days
3. **Why it matters:** When your brain and your cycle are both atypical, generic advice makes things worse, not better
4. **What we built:** An AI coach that learns your personal pattern across cycle, mood, medication, and lifestyle — and speaks to you like a knowledgeable friend, not a clinical form

---

## 3-Line Pitch

Lilith is an AI-powered menstrual health companion that turns daily journaling into personalized cycle intelligence. Unlike generic trackers, she connects your hormonal patterns to your neurodivergent brain, your medications, and your real life. **Start tracking today at [cycle-journal.vercel.app](https://cycle-journal.vercel.app) — your first insight is one conversation away.**

---

## Features

**Smart Home Dashboard** shows your current cycle day, phase, and a personalized insight based on where you are hormonally. No generic tips — Lilith reads your profile.

**AI Coach (Lilith)** is powered by Gemini 2.0 Flash Lite via OpenRouter. She detects cycle events and medication changes from natural language, confirms them via trigger cards, and updates your profile in real time. Chat history persists across sessions.

**Journal & Logging** supports free-text daily entries with auto-tagging for symptoms, mood, food, and movement. An import parser accepts multiple date formats so existing notes can be brought in.

**Cycle Calendar** shows a visual month view with phase coloring, bleeding indicators from logged data, and multi-cycle history support.

**Intelligence Briefs** (Profile > Your Personalized Guides) generate AI reports for doctors, nutritionists, and therapists — exportable as PDF. Reports cache for 24 hours to save API calls.

**Medication & Health Timeline** (Profile > Activity & Logs) shows all logged changes with context: cycle day, phase, and event type.

---

## Quick Start (1 command)

```bash
git clone https://github.com/onchainfer/cycle-journal.git && cd cycle-journal && cp .env.example .env && npm install && npm start
```

Then open [http://localhost:3000](http://localhost:3000).

**Before you start:** add your OpenRouter API key to `.env`:

```
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Get a free key at [openrouter.ai](https://openrouter.ai). The app works without a key but AI features will be disabled.

---

## Environment Variables

```bash
# .env.example — copy this to .env and fill in your key
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

No other secrets required. All user data is stored in `localStorage` — nothing is sent to external servers except the OpenRouter API call.

---

## Architecture

```
src/
├── App.js                          # Global state, localStorage persistence, cycle event handler
├── components/
│   ├── Onboarding.jsx              # 14-step profile builder (bilingual EN/ES)
│   ├── HomeScreen.jsx              # Dashboard: cycle day, phase, daily insight
│   ├── JournalScreen.jsx           # Daily logging, note import, tag filtering
│   ├── CycleCalendar.jsx           # Visual calendar with phase coloring
│   ├── LilithChatWithTriggers.jsx  # AI chat + trigger detection engine
│   ├── ProfileSettings.jsx         # Health team, reports, timeline, data export
│   └── lilithPrompt.js             # Dynamic system prompt builder
└── services/
    └── anthropic.js                # OpenRouter API integration
```

**State management:** All state lives in `App.js` and is passed down as props. Persisted to `localStorage` under five keys: `lilith_profile`, `lilith_cycle`, `lilith_notes`, `lilith_changes`, `lilith_chat_history`.

**No backend.** This is a fully client-side React app. Suitable for hackathon deployment; production would require a backend to protect API keys.

---

## AI Architecture

Lilith uses a two-layer AI system:

**Layer 1 — Trigger Detection** (`LilithChatWithTriggers.jsx`): 14 regex-based trigger patterns scan every user message for cycle events (period start/end, spotting, ovulation) and lifestyle changes (medication start/stop, dose change). Detected triggers surface as confirmation cards before any data is written.

**Layer 2 — Conversational AI** (`src/services/anthropic.js`): Each message sends the full `lilithSystemPrompt` — which includes the user's profile, active medications, current cycle day/phase, and today's journal entries — plus the conversation history, to Gemini 2.0 Flash Lite via OpenRouter. The model returns markdown that is stripped of JSON blocks before display.

**Report Generation** (`ProfileSettings.jsx → generateMedicalReport`): AI reports use the same context plus the full journal and chat history. Reports are cached in `localStorage` with a 24-hour TTL keyed by `lilith_report_{type}_{user}_{date}`.

---

## Decision Log

| # | Decision | Why |
|---|----------|-----|
| 1 | OpenRouter + Gemini 2.0 Flash Lite instead of Claude | No Anthropic API credits available at build time; OpenRouter gave instant access with a free tier |
| 2 | No backend | Hackathon scope; faster to ship; all personal health data stays on the user's device |
| 3 | localStorage for persistence | No auth, no database — keeps the app self-contained and private by default |
| 4 | Trigger cards for cycle events | Prevents accidental data writes from casual mentions; user must confirm before state changes |
| 5 | `T00:00:00` date parsing | Mexico/UTC offset was shifting dates by one day; appending local midnight string fixed timezone bugs across all components |
| 6 | Report caching (24h TTL) | AI report generation costs tokens; caching prevents redundant calls on same-day re-opens |
| 7 | Goose by Block as dev agent | Used for rapid component generation and bug fixing; all AI-generated code was reviewed and edited manually |

---

## Risk Log

| # | Risk | Status | How we handled it |
|---|------|--------|-------------------|
| 1 | **Timezone date shift** — cycle day showed as "Day 0" or "-1" for users in UTC-6 (Mexico City) | ✅ Fixed | All date parsing now uses `` new Date(`${dateStr}T00:00:00`) `` to force local midnight |
| 2 | **API key in source** | ✅ Fixed | Key moved to `REACT_APP_OPENROUTER_API_KEY` env var; `.env` in `.gitignore`; `.env.example` committed |
| 3 | **Stale profile in AI context** — medication changes from chat not reflected in next report | ✅ Fixed | `ProfileSettings` subscribes to `profile` and `changes` via `useEffect` with `refreshTrigger` |
| 4 | **Raw JSON leaking into chat UI** — `parseAIIntents()` JSON blocks showing in messages | ✅ Fixed | Aggressive regex strips all `{...}` blocks from AI response before `simulateTyping()` renders it |
| 5 | **Duplicate events in timeline** — period start logged twice when flow confirmation ran | ✅ Fixed | Deduplication in timeline render: same-date, same-type entries reduced to most-informative |
| 6 | **getCycleDay returning negative on multi-cycle** — modulo math broke when `diff > cycleLength` | ✅ Fixed | `CycleCalendar` uses `(diff % cycleLength) + 1`; `JournalScreen` uses `diff + 1` (actual day) |

---

## Evidence Log

| Resource | Use | License |
|----------|-----|---------|
| [OpenRouter](https://openrouter.ai) | AI API routing | Commercial API — pay-per-use |
| [Google Gemini 2.0 Flash Lite](https://deepmind.google/technologies/gemini/) | Language model powering Lilith | Commercial API via OpenRouter |
| [Goose by Block](https://block.github.io/goose/) | AI dev agent used during build | Apache 2.0 |
| [React 19](https://react.dev) | UI framework | MIT |
| [Create React App](https://create-react-app.dev) | Build tooling | MIT |
| [Google Fonts](https://fonts.google.com) — Playfair Display, Crimson Pro, DM Sans | Typography | SIL Open Font License |
| [Vercel](https://vercel.com) | Hosting | Free tier |
| [ACOG — PMDD resources](https://www.acog.org/womens-health/faqs/premenstrual-syndrome) | Informed phase-symptom logic in `lilithPrompt.js` | Public health resource |
| [IAPMD](https://iapmd.org) | PMDD symptom timing reference | Public health resource |
| Cycle phase clinical definitions (follicular/luteal/ovulation windows) | Standard reference ranges used in cycle calculations | Public domain medical knowledge |

No proprietary datasets were used. All user data is generated by the user and stored locally on their device.

---

## Accessibility

- All interactive elements use `<button>` with keyboard focus support
- State is never communicated by color alone — selected cards also change border and text color
- Font sizes use `clamp()` for responsive scaling (minimum 10px labels, 14px body)
- Chat input has visible focus state
- UI copy targets Grade 8 reading level — no unexplained medical jargon
- Background #0a0810 / text #f0eaf8 — contrast passes WCAG AA for body text

**Known gap:** formal ARIA roles and screen reader testing not completed in hackathon scope. Planned for v1.1.

---

## SDG Alignment

**SDG 3 — Good Health and Well-Being:** Lilith improves access to personalized menstrual health information, helping users recognize patterns that may indicate PMDD, endometriosis, or hormonal imbalances earlier — without requiring a clinical visit.

**SDG 5 — Gender Equality:** By building health tools specifically for the female hormonal experience — including neurodivergent women who are historically underserved in health tech — Lilith addresses a real gap in digital health equity.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Create React App |
| Styling | CSS-in-JS (inline `<style>` per component, no external CSS framework) |
| AI | Gemini 2.0 Flash Lite via OpenRouter |
| Storage | `localStorage` (client-side only, no external database) |
| Deployment | Vercel |
| Dev agent | Goose by Block |
| Typography | Google Fonts (Playfair Display, Crimson Pro, DM Sans) |

---

## Known Issues

- API key is bundled client-side (readable in browser). Production would proxy through a serverless function.
- No offline mode — AI features require network access.
- Test/debug files (`cache-test.js`, `cycle-bug-test.js`, etc.) remain in repo root from Goose dev sessions — cleanup pending.

---

## Local Development

```bash
npm start       # Dev server at localhost:3000
npm run build   # Production build
npm test        # Run test suite
```

Node.js 16+ required.

---

## License

MIT License. See [LICENSE](LICENSE).

---

*Built during the CreateHerFest #75HER Hackathon · March 2026*  
*By [@onchainfer](https://github.com/onchainfer)*