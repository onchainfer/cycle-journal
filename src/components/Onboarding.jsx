import { useState } from "react";

// ─── TRANSLATIONS ───────────────────────────────────────────────────────────
const T = {
    en: {
        // Language select
        langTitle: "Hello, welcome.",
        langSub: "Choose your language to get started",
        langEn: "English",
        langEs: "Español",

        // Progress
        skip: "Skip for now",
        back: "Back",
        continue: "Continue",
        allSet: "Let's go",

        // Step 1 — Name
        s1Title: "First things first —\nwhat's your name?",
        s1Sub: "Just your first name is fine.",
        s1Placeholder: "Your name...",

        // Step 2 — DOB
        s2Title: "How old are you?",
        s2Sub: "Your age helps us understand where you are in your hormonal journey.",
        s2DobLabel: "Date of birth",

        // Step 3 — Last period
        s3Title: "When did your last period start?",
        s3Sub: "Approximate is totally fine — we're not building a court case here.",
        s3Label: "First day of last period",

        // Step 4 — Cycle length
        s4Title: "How long is your cycle, usually?",
        s4Sub: "Count from the first day of one period to the first day of the next.",
        s4Options: [
            { value: "short", label: "Under 25 days", sub: "Shorter than average" },
            { value: "normal", label: "25–32 days", sub: "The classic range" },
            { value: "long", label: "33–40 days", sub: "On the longer side" },
            { value: "irregular", label: "All over the place", sub: "No two cycles are the same" },
            { value: "unknown", label: "Honestly no idea", sub: "That's what we're here for" },
        ],

        // Step 5 — Period appearance
        s5Title: "What does your period look like?",
        s5Sub: "We know it's personal. But this tells us a lot.",
        s5Options: [
            { value: "light", label: "Light & breezy", sub: "Barely there, light flow" },
            { value: "medium", label: "Pretty standard", sub: "Medium flow, manageable" },
            { value: "heavy", label: "Full send", sub: "Heavy flow, goes through pads/tampons fast" },
            { value: "very_heavy", label: "It's a lot", sub: "Very heavy, sometimes clots" },
            { value: "variable", label: "Depends on the month", sub: "Changes cycle to cycle" },
        ],
        s5ColorLabel: "Color",
        s5Colors: ["Light pink", "Bright red", "Dark red", "Brown", "Mixed"],
        s5PainLabel: "Pain level",
        s5PainOptions: [
            "No pain at all",
            "Mild, barely notice it",
            "Moderate, affects my day",
            "Severe, I can't function",
        ],

        // Step 6 — Physical conditions
        s6Title: "Does your body have anything\nextra going on?",
        s6Sub: "Select everything that applies — diagnosed or just suspected.",
        s6Physical: ["PMDD", "Endometriosis", "PCOS", "Fibroids", "Thyroid disorder", "Anemia", "Diabetes", "None of the above", "Other"],
        s6NeuroTitle: "Some of us are wired a little differently —\nand that's worth knowing.",
        s6Neuro: ["ADHD", "Autism / AuDHD", "Anxiety disorder", "Depression", "Bipolar disorder", "Other", "Prefer not to say"],

        // Step 7 — Contraceptives
        s7Title: "Are you using any hormonal\ncontraception?",
        s7Sub: "This changes how your cycle works — so it's important context.",
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
        s7BrandLabel: "Brand / name (optional)",
        s7BrandPlaceholder: "e.g. Yasmin, Mirena...",
        s7DurationLabel: "How long have you been using it?",
        s7DurationPlaceholder: "e.g. 2 years",

        // Step 8 — Medications
        s8Title: "Any other medications\nor supplements?",
        s8Sub: "Antidepressants, thyroid meds, vitamins — anything that's part of your daily routine.",
        s8Add: "+ Add medication",
        s8NamePlaceholder: "Medication or supplement name",
        s8DosePlaceholder: "Dose (e.g. 50mg)",
        s8None: "None right now",

        // Step 9 — Reproductive context
        s9Title: "A little more context\nabout your reproductive life.",
        s9Sub: "No judgment, just context.",
        s9KidsLabel: "Do you have children?",
        s9KidsOptions: ["Yes", "No", "Pregnant / trying", "Prefer not to say"],
        s9SexLabel: "Are you sexually active?",
        s9SexOptions: ["Yes, regularly", "Sometimes", "No", "Prefer not to say"],

        // Step 10 — Exercise
        s10Title: "How do you move your body?",
        s10Sub: "There's no right answer here — all kinds of movement count.",
        s10FreqLabel: "How often?",
        s10FreqOptions: [
            "Every day, no exceptions",
            "4–5 times a week",
            "2–3 times a week",
            "Once a week or less",
            "I'm in my sedentary era",
        ],
        s10TypeLabel: "What kind of movement? (pick all that apply)",
        s10Types: ["Gym / weights", "Running", "Yoga / pilates", "Swimming", "Dance", "Walking", "Team sports", "Cycling", "Home workouts", "Other"],

        // Step 11 — Sleep
        s11Title: "How's your sleep?",
        s11Sub: "Be honest. We've heard it all.",
        s11Options: [
            { value: "great", label: "I wake up ready to take on the world", sub: "Deep, restful, consistent" },
            { value: "good", label: "Pretty good, no complaints", sub: "Usually 7–8 hours, feel rested" },
            { value: "meh", label: "8 hours but could use 10 more", sub: "Sleep a lot but never feel caught up" },
            { value: "broken", label: "I sleep but it barely counts", sub: "Light, interrupted, or anxious" },
            { value: "bad", label: "What is sleep", sub: "Chronically tired, struggling to rest" },
        ],

        // Step 12 — Nutrition (photo-based)
        s12Title: "What does your diet\nlook like, mostly?",
        s12Sub: "Pick the photo that feels most like your plate. You can choose more than one.",
        s12Options: [
            { value: "mediterranean", label: "Mediterranean", sub: "Lots of veg, olive oil, fish, grains", emoji: "🫒" },
            { value: "plant_based", label: "Plant-based", sub: "Mostly or fully vegetarian/vegan", emoji: "🥦" },
            { value: "high_protein", label: "High protein", sub: "Meat, eggs, protein-focused", emoji: "🥩" },
            { value: "balanced", label: "Balanced & varied", sub: "A bit of everything", emoji: "🍱" },
            { value: "comfort", label: "Comfort-led", sub: "I eat what feels good", emoji: "🍝" },
            { value: "intuitive", label: "Intuitive eating", sub: "No rules, listening to my body", emoji: "🌿" },
            { value: "restricted", label: "Restricted / medical diet", sub: "Gluten-free, low-FODMAP, etc.", emoji: "⚕️" },
            { value: "irregular", label: "Irregular / chaotic", sub: "Skipping meals, no real pattern", emoji: "🤷‍♀️" },
        ],
        s12Extra: "Anything else about your eating? (optional)",
        s12ExtraPlaceholder: "e.g. I skip breakfast, I eat late, I have food intolerances...",

        // Step 13 — Goal
        s13Title: "Why are you here?",
        s13Sub: "What do you want to understand about yourself?",
        s13Options: [
            { value: "understand", label: "Understand my cycle", sub: "I want to know what's actually happening in my body" },
            { value: "pmdd", label: "Manage PMDD / mood symptoms", sub: "Track the emotional side of my cycle" },
            { value: "planning", label: "Plan around my cycle", sub: "Work, workouts, social life — sync it all" },
            { value: "fertility", label: "Fertility awareness", sub: "Whether trying to conceive or avoid pregnancy" },
            { value: "patterns", label: "Find patterns", sub: "Something feels off and I want to figure out what" },
            { value: "health", label: "General health tracking", sub: "Holistic picture of how I feel day to day" },
        ],

        // Step 14 — Free description
        s14Title: "Last one — tell us\nabout yourself.",
        s14Sub: "In your own words. Your lifestyle, how you usually feel, what matters to you — anything you'd want your journal to understand about you. No right or wrong answer.",
        s14Placeholder: "I'm someone who...",
        s14Optional: "This is optional but the more you share, the more personalized your insights will be.",

        // Step 15 — All set
        s15Title: "You're all set,",
        s15Sub: "Your profile is ready. From here, you can start logging your days and we'll start finding your patterns.",
        s15Cta: "Start my first entry",
    },

    es: {
        langTitle: "Hola, bienvenida.",
        langSub: "Elige tu idioma para comenzar",
        langEn: "English",
        langEs: "Español",
        skip: "Omitir por ahora",
        back: "Atrás",
        continue: "Continuar",
        allSet: "¡Vamos!",
        s1Title: "Primero lo primero —\n¿cómo te llamas?",
        s1Sub: "Solo tu nombre es suficiente.",
        s1Placeholder: "Tu nombre...",
        s2Title: "¿Cuántos años tienes?",
        s2Sub: "Tu edad nos ayuda a entender en qué etapa hormonal estás.",
        s2DobLabel: "Fecha de nacimiento",
        s3Title: "¿Cuándo comenzó tu último período?",
        s3Sub: "Aproximado está perfecto — no estamos construyendo un caso legal.",
        s3Label: "Primer día de tu último período",
        s4Title: "¿Cuánto dura tu ciclo, normalmente?",
        s4Sub: "Cuenta desde el primer día de un período hasta el primero del siguiente.",
        s4Options: [
            { value: "short", label: "Menos de 25 días", sub: "Más corto que el promedio" },
            { value: "normal", label: "25–32 días", sub: "El rango clásico" },
            { value: "long", label: "33–40 días", sub: "Del lado largo" },
            { value: "irregular", label: "Completamente irregular", sub: "Cada ciclo es distinto" },
            { value: "unknown", label: "Honestamente no sé", sub: "Para eso estamos aquí" },
        ],
        s5Title: "¿Cómo luce tu período?",
        s5Sub: "Sabemos que es personal. Pero esto nos dice mucho.",
        s5Options: [
            { value: "light", label: "Ligero y tranquilo", sub: "Flujo leve, casi imperceptible" },
            { value: "medium", label: "Normal", sub: "Flujo moderado, manejable" },
            { value: "heavy", label: "Intenso", sub: "Flujo abundante, cambia toallas/tampones seguido" },
            { value: "very_heavy", label: "Es bastante", sub: "Muy abundante, a veces con coágulos" },
            { value: "variable", label: "Depende del mes", sub: "Cambia de ciclo en ciclo" },
        ],
        s5ColorLabel: "Color",
        s5Colors: ["Rosa claro", "Rojo brillante", "Rojo oscuro", "Café", "Mixto"],
        s5PainLabel: "Nivel de dolor",
        s5PainOptions: [
            "Sin dolor",
            "Leve, casi no lo noto",
            "Moderado, afecta mi día",
            "Severo, no puedo funcionar",
        ],
        s6Title: "¿Tu cuerpo tiene algo\nextra que considerar?",
        s6Sub: "Selecciona todo lo que aplique — diagnosticado o sospechado.",
        s6Physical: ["PMDD", "Endometriosis", "SOP / PCOS", "Fibromas", "Tiroides", "Anemia", "Diabetes", "Ninguno", "Otro"],
        s6NeuroTitle: "Algunas de nosotras estamos\ncableadas diferente — y eso vale saberlo.",
        s6Neuro: ["TDAH", "Autismo / AuTDAH", "Trastorno de ansiedad", "Depresión", "Trastorno bipolar", "Otro", "Prefiero no decir"],
        s7Title: "¿Usas algún método anticonceptivo hormonal?",
        s7Sub: "Esto cambia cómo funciona tu ciclo — es contexto importante.",
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
        s7BrandLabel: "Marca / nombre (opcional)",
        s7BrandPlaceholder: "ej. Yasmin, Mirena...",
        s7DurationLabel: "¿Cuánto tiempo llevas usándolo?",
        s7DurationPlaceholder: "ej. 2 años",
        s8Title: "¿Tomas otros medicamentos\no suplementos?",
        s8Sub: "Antidepresivos, medicamentos para tiroides, vitaminas — lo que sea parte de tu rutina.",
        s8Add: "+ Agregar medicamento",
        s8NamePlaceholder: "Nombre del medicamento o suplemento",
        s8DosePlaceholder: "Dosis (ej. 50mg)",
        s8None: "Ninguno por ahora",
        s9Title: "Un poco más de contexto\nsobre tu vida reproductiva.",
        s9Sub: "Sin juicio, solo contexto.",
        s9KidsLabel: "¿Tienes hijos?",
        s9KidsOptions: ["Sí", "No", "Embarazada / intentando", "Prefiero no decir"],
        s9SexLabel: "¿Tienes actividad sexual?",
        s9SexOptions: ["Sí, regularmente", "A veces", "No", "Prefiero no decir"],
        s10Title: "¿Cómo mueves tu cuerpo?",
        s10Sub: "No hay respuesta correcta — todo tipo de movimiento cuenta.",
        s10FreqLabel: "¿Con qué frecuencia?",
        s10FreqOptions: [
            "Todos los días, sin excepción",
            "4–5 veces a la semana",
            "2–3 veces a la semana",
            "Una vez a la semana o menos",
            "Estoy en mi era sedentaria",
        ],
        s10TypeLabel: "¿Qué tipo de movimiento? (elige todos los que apliquen)",
        s10Types: ["Gym / pesas", "Correr", "Yoga / pilates", "Natación", "Baile", "Caminar", "Deportes de equipo", "Ciclismo", "Ejercicio en casa", "Otro"],
        s11Title: "¿Cómo está tu sueño?",
        s11Sub: "Sé honesta. Ya lo hemos escuchado todo.",
        s11Options: [
            { value: "great", label: "Despierto lista para comerse el mundo", sub: "Profundo, reparador, consistente" },
            { value: "good", label: "Bastante bien, sin quejas", sub: "Generalmente 7–8 horas, me siento descansada" },
            { value: "meh", label: "Dormí 8 horas pero siento que me faltaron 10", sub: "Duermo mucho pero nunca me recupero del todo" },
            { value: "broken", label: "Duermo pero casi no cuenta", sub: "Sueño ligero, interrumpido o ansioso" },
            { value: "bad", label: "¿Qué es el sueño?", sub: "Crónicamente cansada, me cuesta descansar" },
        ],
        s12Title: "¿Cómo luce tu alimentación,\nmayormente?",
        s12Sub: "Elige la foto que más se parezca a tu plato. Puedes elegir más de una.",
        s12Options: [
            { value: "mediterranean", label: "Mediterránea", sub: "Mucha verdura, aceite de oliva, pescado, granos", emoji: "🫒" },
            { value: "plant_based", label: "Basada en plantas", sub: "Mayormente o totalmente vegetariana/vegana", emoji: "🥦" },
            { value: "high_protein", label: "Alta en proteína", sub: "Carne, huevos, enfocada en proteína", emoji: "🥩" },
            { value: "balanced", label: "Balanceada y variada", sub: "Un poco de todo", emoji: "🍱" },
            { value: "comfort", label: "Por placer", sub: "Como lo que me hace sentir bien", emoji: "🍝" },
            { value: "intuitive", label: "Alimentación intuitiva", sub: "Sin reglas, escuchando mi cuerpo", emoji: "🌿" },
            { value: "restricted", label: "Dieta médica / restringida", sub: "Sin gluten, low-FODMAP, etc.", emoji: "⚕️" },
            { value: "irregular", label: "Irregular / caótica", sub: "Me salto comidas, sin patrón definido", emoji: "🤷‍♀️" },
        ],
        s12Extra: "¿Algo más sobre tu alimentación? (opcional)",
        s12ExtraPlaceholder: "ej. Me salto el desayuno, como tarde, tengo intolerancias...",
        s13Title: "¿Por qué estás aquí?",
        s13Sub: "¿Qué quieres entender sobre ti misma?",
        s13Options: [
            { value: "understand", label: "Entender mi ciclo", sub: "Quiero saber qué está pasando en mi cuerpo" },
            { value: "pmdd", label: "Manejar el PMDD / síntomas emocionales", sub: "Registrar el lado emocional de mi ciclo" },
            { value: "planning", label: "Planear alrededor de mi ciclo", sub: "Trabajo, ejercicio, vida social — sincronizarlo todo" },
            { value: "fertility", label: "Conciencia de fertilidad", sub: "Sea para concebir o para evitar el embarazo" },
            { value: "patterns", label: "Encontrar patrones", sub: "Algo no se siente bien y quiero descubrir qué" },
            { value: "health", label: "Seguimiento de salud general", sub: "Una visión holística de cómo me siento día a día" },
        ],
        s14Title: "Última — cuéntanos\nsobre ti.",
        s14Sub: "Con tus propias palabras. Tu estilo de vida, cómo te sueles sentir, qué te importa — lo que quieras que tu diario entienda sobre ti. No hay respuesta correcta.",
        s14Placeholder: "Soy alguien que...",
        s14Optional: "Es opcional, pero cuanto más compartas, más personalizados serán tus insights.",
        s15Title: "¡Todo listo,",
        s15Sub: "Tu perfil está listo. Desde aquí puedes empezar a registrar tus días y comenzaremos a encontrar tus patrones.",
        s15Cta: "Empezar mi primera entrada",
    }
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#1c1a1f;--ink-soft:#6b6370;--ink-ghost:#b8afc0;
  --paper:#faf8f5;--lavender:#c4b5d4;--lavender-light:#ede8f5;--lavender-deep:#8b75a8;
  --blossom:#e8c4c4;--blossom-light:#fdf0f0;--blossom-deep:#c47a7a;
  --border:#e8e2ee;
}
body{background:var(--paper);}
.ob-root{min-height:100vh;background:var(--paper);font-family:'DM Sans',sans-serif;color:var(--ink);display:flex;flex-direction:column;}

/* Lang screen */
.lang-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center;}
.lang-title{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,6vw,48px);font-weight:300;letter-spacing:-0.02em;margin-bottom:12px;}
.lang-sub{font-size:14px;color:var(--ink-soft);margin-bottom:48px;}
.lang-btns{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;}
.lang-btn{padding:14px 40px;border:1px solid var(--border);border-radius:2px;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:var(--ink-soft);cursor:pointer;transition:all .2s;letter-spacing:0.05em;}
.lang-btn:hover{border-color:var(--lavender-deep);color:var(--lavender-deep);}

/* Progress bar */
.ob-progress{height:2px;background:var(--border);position:sticky;top:0;z-index:10;}
.ob-progress-fill{height:100%;background:linear-gradient(90deg,var(--lavender-deep),var(--blossom-deep));transition:width .4s ease;}

/* Nav */
.ob-nav{display:flex;align-items:center;justify-content:space-between;padding:20px 40px;max-width:680px;margin:0 auto;width:100%;}
.ob-back{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink-ghost);cursor:pointer;letter-spacing:0.05em;padding:0;}
.ob-back:hover{color:var(--ink-soft);}
.ob-step-count{font-size:11px;color:var(--ink-ghost);letter-spacing:0.1em;}
.ob-skip{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--ink-ghost);cursor:pointer;letter-spacing:0.05em;padding:0;text-decoration:underline;}

/* Screen */
.ob-screen{flex:1;max-width:680px;margin:0 auto;width:100%;padding:16px 40px 60px;}
.ob-eyebrow{font-size:10px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:var(--lavender-deep);margin-bottom:14px;}
.ob-title{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,5vw,40px);font-weight:300;line-height:1.2;letter-spacing:-0.02em;white-space:pre-line;margin-bottom:12px;}
.ob-sub{font-size:14px;color:var(--ink-soft);line-height:1.6;margin-bottom:32px;font-weight:300;}

/* Text input */
.ob-input{width:100%;padding:14px 0;border:none;border-bottom:1px solid var(--border);font-family:'DM Sans',sans-serif;font-size:18px;color:var(--ink);background:transparent;outline:none;transition:border-color .2s;}
.ob-input:focus{border-bottom-color:var(--lavender-deep);}
.ob-input::placeholder{color:var(--ink-ghost);}
.ob-input-sm{font-size:14px;padding:10px 0;}

/* Date input */
.ob-date{width:100%;padding:12px 0;border:none;border-bottom:1px solid var(--border);font-family:'DM Sans',sans-serif;font-size:15px;color:var(--ink);background:transparent;outline:none;transition:border-color .2s;}
.ob-date:focus{border-bottom-color:var(--lavender-deep);}
.field-label{display:block;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-ghost);margin-bottom:6px;margin-top:24px;}

/* Card options */
.ob-cards{display:flex;flex-direction:column;gap:10px;}
.ob-card{padding:16px 20px;border:1px solid var(--border);border-radius:2px;background:transparent;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;text-align:left;width:100%;}
.ob-card:hover{border-color:var(--lavender);background:var(--lavender-light);}
.ob-card.sel-lav{background:var(--lavender-light);border-color:var(--lavender-deep);}
.ob-card.sel-blos{background:var(--blossom-light);border-color:var(--blossom-deep);}
.ob-card-label{font-size:14px;font-weight:500;color:var(--ink);}
.ob-card.sel-lav .ob-card-label{color:var(--lavender-deep);}
.ob-card.sel-blos .ob-card-label{color:var(--blossom-deep);}
.ob-card-sub{font-size:12px;color:var(--ink-ghost);margin-top:3px;font-weight:300;}

/* Pill chips */
.ob-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;}
.ob-chip{padding:8px 16px;border-radius:2px;border:1px solid var(--border);background:transparent;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--ink-soft);cursor:pointer;transition:all .2s;}
.ob-chip:hover{border-color:var(--lavender);color:var(--lavender-deep);}
.ob-chip.sel-lav{background:var(--lavender-light);border-color:var(--lavender-deep);color:var(--lavender-deep);font-weight:500;}
.ob-chip.sel-blos{background:var(--blossom-light);border-color:var(--blossom-deep);color:var(--blossom-deep);font-weight:500;}

/* Section divider */
.ob-divider{border:none;border-top:1px solid var(--border);margin:28px 0;}
.ob-section-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;line-height:1.3;white-space:pre-line;margin-bottom:16px;color:var(--ink);}

/* Food cards (emoji-based) */
.ob-food-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.ob-food-card{padding:16px;border:1px solid var(--border);border-radius:2px;background:transparent;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;text-align:left;}
.ob-food-card:hover{border-color:var(--blossom);background:var(--blossom-light);}
.ob-food-card.selected{background:var(--blossom-light);border-color:var(--blossom-deep);}
.ob-food-emoji{font-size:28px;margin-bottom:8px;display:block;}
.ob-food-label{font-size:13px;font-weight:500;color:var(--ink);margin-bottom:3px;}
.ob-food-card.selected .ob-food-label{color:var(--blossom-deep);}
.ob-food-sub{font-size:11px;color:var(--ink-ghost);line-height:1.4;}

/* Textarea */
.ob-textarea{width:100%;padding:14px 0;border:none;border-bottom:1px solid var(--border);font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:300;line-height:1.8;color:var(--ink);background:transparent;resize:none;outline:none;transition:border-color .2s;}
.ob-textarea:focus{border-bottom-color:var(--lavender-deep);}
.ob-textarea::placeholder{color:var(--ink-ghost);font-style:italic;}
.ob-optional{font-size:11px;color:var(--ink-ghost);margin-top:12px;font-style:italic;line-height:1.5;}

/* Medications */
.ob-med-row{display:flex;gap:10px;margin-bottom:10px;align-items:flex-end;}
.ob-med-row .ob-input-sm{flex:2;}
.ob-med-row .ob-input-sm:last-child{flex:1;}
.ob-add-btn{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--lavender-deep);cursor:pointer;letter-spacing:0.05em;padding:8px 0;text-align:left;}
.ob-none-btn{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--ink-ghost);cursor:pointer;letter-spacing:0.05em;padding:8px 0;text-decoration:underline;}

/* Continue button */
.ob-cta-wrap{padding:0 40px 40px;max-width:680px;margin:0 auto;width:100%;}
.ob-cta{width:100%;padding:18px;border:1px solid var(--ink);border-radius:2px;background:transparent;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink);cursor:pointer;transition:all .25s;}
.ob-cta:hover:not(:disabled){background:var(--ink);color:var(--paper);}
.ob-cta:disabled{border-color:var(--border);color:var(--ink-ghost);cursor:not-allowed;}

/* All set */
.allset-screen{min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;max-width:520px;margin:0 auto;}
.allset-mark{width:64px;height:64px;border-radius:50%;border:1px solid var(--lavender-deep);display:flex;align-items:center;justify-content:center;margin:0 auto 32px;font-size:24px;}
.allset-title{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,6vw,48px);font-weight:300;letter-spacing:-0.02em;margin-bottom:16px;line-height:1.1;}
.allset-name{font-style:italic;color:var(--lavender-deep);}
.allset-sub{font-size:14px;color:var(--ink-soft);line-height:1.7;margin-bottom:40px;font-weight:300;}

@media(max-width:520px){
  .ob-screen,.ob-nav,.ob-cta-wrap{padding-left:24px;padding-right:24px;}
  .ob-food-grid{grid-template-columns:1fr 1fr;}
  .lang-btns{flex-direction:column;align-items:center;}
}
`;

// ─── TOTAL STEPS ─────────────────────────────────────────────────────────────
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
    const set = (field, val) => setProfile(p => ({ ...p, [field]: val }));
    const toggleArr = (field, val) => setProfile(p => ({
        ...p,
        [field]: p[field].includes(val) ? p[field].filter(x => x !== val) : [...p[field], val]
    }));

    const next = () => setStep(s => Math.min(s + 1, TOTAL + 1));
    const back = () => setStep(s => Math.max(s - 1, 1));

    if (!lang) {
        return (
            <>
                <style>{css}</style>
                <div className="ob-root">
                    <div className="lang-screen">
                        <h1 className="lang-title">{T.en.langTitle}</h1>
                        <p className="lang-sub">{T.en.langSub}</p>
                        <div className="lang-btns">
                            <button className="lang-btn" onClick={() => setLang("en")}>{T.en.langEn}</button>
                            <button className="lang-btn" onClick={() => setLang("es")}>{T.en.langEs}</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (step === TOTAL + 1) {
        return (
            <>
                <style>{css}</style>
                <div className="ob-root">
                    <div className="allset-screen">
                        <div className="allset-mark">✦</div>
                        <h1 className="allset-title">
                            {t.s15Title} <span className="allset-name">{profile.name || "you"}.</span>
                        </h1>
                        <p className="allset-sub">{t.s15Sub}</p>
                        <button className="ob-cta" style={{ maxWidth: 320 }} onClick={() => onComplete && onComplete(profile)}>
                            {t.s15Cta}
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const progress = (step / TOTAL) * 100;

    const renderStep = () => {
        switch (step) {

            // ── 1. Name ────────────────────────────────────────────────────────────
            case 1: return (
                <div>
                    <p className="ob-eyebrow">Welcome</p>
                    <h1 className="ob-title">{t.s1Title}</h1>
                    <p className="ob-sub">{t.s1Sub}</p>
                    <input className="ob-input" placeholder={t.s1Placeholder} value={profile.name}
                        onChange={e => set("name", e.target.value)} autoFocus />
                </div>
            );

            // ── 2. DOB ─────────────────────────────────────────────────────────────
            case 2: return (
                <div>
                    <p className="ob-eyebrow">About you</p>
                    <h1 className="ob-title">{t.s2Title}</h1>
                    <p className="ob-sub">{t.s2Sub}</p>
                    <label className="field-label" style={{ marginTop: 0 }}>{t.s2DobLabel}</label>
                    <input type="date" className="ob-date" value={profile.dob}
                        onChange={e => set("dob", e.target.value)} />
                </div>
            );

            // ── 3. Last period ─────────────────────────────────────────────────────
            case 3: return (
                <div>
                    <p className="ob-eyebrow">Your cycle</p>
                    <h1 className="ob-title">{t.s3Title}</h1>
                    <p className="ob-sub">{t.s3Sub}</p>
                    <label className="field-label" style={{ marginTop: 0 }}>{t.s3Label}</label>
                    <input type="date" className="ob-date" value={profile.lastPeriod}
                        onChange={e => set("lastPeriod", e.target.value)} />
                </div>
            );

            // ── 4. Cycle length ────────────────────────────────────────────────────
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

            // ── 5. Period appearance ───────────────────────────────────────────────
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

            // ── 6. Conditions ──────────────────────────────────────────────────────
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

            // ── 7. Contraception ───────────────────────────────────────────────────
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

            // ── 8. Medications ─────────────────────────────────────────────────────
            case 8: return (
                <div>
                    <p className="ob-eyebrow">Medications</p>
                    <h1 className="ob-title">{t.s8Title}</h1>
                    <p className="ob-sub">{t.s8Sub}</p>
                    {!profile.noMeds && profile.medications.map((med, i) => (
                        <div key={i} className="ob-med-row">
                            <input className="ob-input ob-input-sm" placeholder={t.s8NamePlaceholder}
                                value={med.name} onChange={e => {
                                    const m = [...profile.medications]; m[i].name = e.target.value;
                                    set("medications", m);
                                }} />
                            <input className="ob-input ob-input-sm" placeholder={t.s8DosePlaceholder}
                                value={med.dose} onChange={e => {
                                    const m = [...profile.medications]; m[i].dose = e.target.value;
                                    set("medications", m);
                                }} />
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

            // ── 9. Reproductive context ────────────────────────────────────────────
            case 9: return (
                <div>
                    <p className="ob-eyebrow">Life context</p>
                    <h1 className="ob-title">{t.s9Title}</h1>
                    <p className="ob-sub">{t.s9Sub}</p>
                    <label className="field-label" style={{ marginTop: 0 }}>{t.s9KidsLabel}</label>
                    <div className="ob-cards" style={{ marginBottom: 24 }}>
                        {t.s9KidsOptions.map(o => (
                            <button key={o} className={`ob-card ${profile.kids === o ? "sel-lav" : ""}`}
                                onClick={() => set("kids", o)}>
                                <div className="ob-card-label">{o}</div>
                            </button>
                        ))}
                    </div>
                    <label className="field-label">{t.s9SexLabel}</label>
                    <div className="ob-cards">
                        {t.s9SexOptions.map(o => (
                            <button key={o} className={`ob-card ${profile.sexualActivity === o ? "sel-lav" : ""}`}
                                onClick={() => set("sexualActivity", o)}>
                                <div className="ob-card-label">{o}</div>
                            </button>
                        ))}
                    </div>
                </div>
            );

            // ── 10. Exercise ───────────────────────────────────────────────────────
            case 10: return (
                <div>
                    <p className="ob-eyebrow">Lifestyle</p>
                    <h1 className="ob-title">{t.s10Title}</h1>
                    <p className="ob-sub">{t.s10Sub}</p>
                    <label className="field-label" style={{ marginTop: 0 }}>{t.s10FreqLabel}</label>
                    <div className="ob-cards" style={{ marginBottom: 24 }}>
                        {t.s10FreqOptions.map(o => (
                            <button key={o} className={`ob-card ${profile.exerciseFreq === o ? "sel-lav" : ""}`}
                                onClick={() => set("exerciseFreq", o)}>
                                <div className="ob-card-label">{o}</div>
                            </button>
                        ))}
                    </div>
                    <label className="field-label">{t.s10TypeLabel}</label>
                    <div className="ob-chips">
                        {t.s10Types.map(t2 => (
                            <button key={t2} className={`ob-chip ${profile.exerciseTypes.includes(t2) ? "sel-lav" : ""}`}
                                onClick={() => toggleArr("exerciseTypes", t2)}>{t2}</button>
                        ))}
                    </div>
                </div>
            );

            // ── 11. Sleep ──────────────────────────────────────────────────────────
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

            // ── 12. Nutrition ──────────────────────────────────────────────────────
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

            // ── 13. Goal ───────────────────────────────────────────────────────────
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

            // ── 14. Self description ───────────────────────────────────────────────
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
                <div className="ob-progress">
                    <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                <div className="ob-nav">
                    <button className="ob-back" onClick={back}>{step > 1 ? `← ${t.back}` : ""}</button>
                    <span className="ob-step-count">{step} / {TOTAL}</span>
                    <button className="ob-skip" onClick={next}>{t.skip}</button>
                </div>

                <div className="ob-screen">
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