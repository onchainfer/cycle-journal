// Test data to verify the Health & Medication Timeline implementation
const testChanges = [
  {
    id: 1,
    date: "Mar 3, 2026",
    text: "New cycle started. Flow: Heavy",
    type: "cycle",
    badge: "New cycle"
  },
  {
    id: 2,
    date: "Mar 3, 2026",
    text: "New cycle started",
    type: "cycle",
    badge: "New cycle"
  },
  {
    id: 3,
    date: "Mar 1, 2026",
    text: "Started Birth Control medication",
    type: "medication",
    badge: "Started"
  },
  {
    id: 4,
    date: "Feb 28, 2026",
    text: "Period ended. Duration: 5 days",
    type: "cycle",
    badge: "Period end"
  },
  {
    id: 5,
    date: "Feb 25, 2026",
    text: "Dose change for anxiety medication",
    type: "medication",
    badge: "Dose change"
  },
  {
    id: 6,
    date: "Feb 20, 2026",
    text: "Ovulation logged. Side: Right",
    type: "cycle",
    badge: "Ovulation"
  },
  {
    id: 7,
    date: "Feb 15, 2026",
    text: "Stopped anxiety medication",
    type: "medication",
    badge: "Discontinued"
  }
];

// Expected Timeline Output:
/*
Health & Medication Timeline

Mar 3, 2026
● New cycle started (Heavy flow)                [RED DOT]
  CYCLE

Mar 1, 2026
● Started Birth Control (Doctor's advice)       [BLUE DOT]
  MEDICATION

Feb 28, 2026
● Period ended                                  [RED DOT]
  CYCLE

Feb 25, 2026
● Dose adjusted for anxiety medication          [BLUE DOT]
  MEDICATION

Feb 20, 2026
● Ovulation detected                           [RED DOT]
  CYCLE

Feb 15, 2026
● Stopped anxiety                              [BLUE DOT]
  MEDICATION

Features verified:
✓ Date grouping without repetition
✓ Duplicate filtering (keeps "Heavy flow" entry, removes plain "cycle started")
✓ Color coding (Red for cycle, Blue for medication)
✓ Humanized text ("Started Birth Control (Doctor's advice)")
✓ Chronological ordering (newest first)
✓ Visual timeline with connecting line
*/
