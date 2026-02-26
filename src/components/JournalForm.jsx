import { useState } from "react";

const moods = ["😭", "😔", "😐", "🙂", "😊", "🌟"];
const energyLevels = ["💀", "😴", "😑", "⚡", "🔥"];
const symptoms = [
    "Cólicos", "Hinchazón", "Dolor de cabeza", "Sensibilidad en senos",
    "Ansiedad", "Irritabilidad", "Fatiga", "Insomnio",
    "Antojos", "Acné", "Náuseas", "Fuerza extra"
];
const cyclePhases = ["Menstruación", "Folicular", "Ovulación", "Lútea", "No sé"];

export default function JournalForm({ onSave }) {
    const today = new Date().toLocaleDateString("es-MX", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        phase: "",
        cycleDay: "",
        mood: "",
        energy: "",
        symptoms: [],
        notes: "",
        gratitude: "",
        intention: "",
    });
    const [saved, setSaved] = useState(false);

    const toggle = (field, val) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(val)
                ? f[field].filter(x => x !== val)
                : [...f[field], val]
        }));
    };

    const handleSave = () => {
        const entry = { ...form, savedAt: new Date().toISOString() };
        const existing = JSON.parse(localStorage.getItem("cycleJournal") || "[]");
        localStorage.setItem("cycleJournal", JSON.stringify([...existing, entry]));
        if (onSave) onSave(entry);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const isComplete = form.mood && form.energy && form.phase;

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0a1e 0%, #1a0f2e 50%, #0f0a1e 100%)",
            fontFamily: "'Georgia', serif",
            padding: "0 16px 40px",
            color: "#f0e6ff"
        }}>

            {/* Header */}
            <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🌙</div>
                <h1 style={{
                    fontSize: "clamp(24px, 5vw, 36px)",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #c9a0ff, #ff8fab, #ffd6e7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0,
                    letterSpacing: "-0.02em"
                }}>
                    Mi Diario de Ciclo
                </h1>
                <p style={{ color: "#9b8aaa", marginTop: 8, fontSize: 15, textTransform: "capitalize" }}>
                    {today}
                </p>
            </div>

            <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Fase del ciclo */}
                <Section title="¿En qué fase estás?" emoji="🔄">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {cyclePhases.map(p => (
                            <Chip
                                key={p}
                                label={p}
                                selected={form.phase === p}
                                onClick={() => setForm(f => ({ ...f, phase: p }))}
                                accent="#c9a0ff"
                            />
                        ))}
                    </div>
                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                        <label style={{ fontSize: 13, color: "#9b8aaa", whiteSpace: "nowrap" }}>Día del ciclo:</label>
                        <input
                            type="number"
                            min={1} max={45}
                            placeholder="ej. 14"
                            value={form.cycleDay}
                            onChange={e => setForm(f => ({ ...f, cycleDay: e.target.value }))}
                            style={inputStyle}
                        />
                    </div>
                </Section>

                {/* Estado de ánimo */}
                <Section title="¿Cómo te sientes?" emoji="💜">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {moods.map((m, i) => (
                            <button
                                key={i}
                                onClick={() => setForm(f => ({ ...f, mood: m }))}
                                style={{
                                    fontSize: "clamp(24px, 6vw, 32px)",
                                    background: form.mood === m ? "rgba(201,160,255,0.2)" : "transparent",
                                    border: form.mood === m ? "2px solid #c9a0ff" : "2px solid transparent",
                                    borderRadius: 12,
                                    padding: "8px 10px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    transform: form.mood === m ? "scale(1.2)" : "scale(1)"
                                }}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </Section>

                {/* Energía */}
                <Section title="¿Cuánta energía tienes?" emoji="⚡">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {energyLevels.map((e, i) => (
                            <button
                                key={i}
                                onClick={() => setForm(f => ({ ...f, energy: e }))}
                                style={{
                                    fontSize: "clamp(24px, 6vw, 32px)",
                                    background: form.energy === e ? "rgba(255,143,171,0.2)" : "transparent",
                                    border: form.energy === e ? "2px solid #ff8fab" : "2px solid transparent",
                                    borderRadius: 12,
                                    padding: "8px 14px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    transform: form.energy === e ? "scale(1.2)" : "scale(1)"
                                }}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </Section>

                {/* Síntomas */}
                <Section title="Síntomas de hoy" emoji="📋">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {symptoms.map(s => (
                            <Chip
                                key={s}
                                label={s}
                                selected={form.symptoms.includes(s)}
                                onClick={() => toggle("symptoms", s)}
                                accent="#ff8fab"
                            />
                        ))}
                    </div>
                </Section>

                {/* Notas libres */}
                <Section title="¿Cómo fue tu día?" emoji="✍️">
                    <textarea
                        placeholder="Escribe libremente... ¿qué pasó hoy? ¿cómo te sentiste? ¿algo notable?"
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        rows={4}
                        style={{ ...inputStyle, width: "100%", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }}
                    />
                </Section>

                {/* Gratitud + Intención */}
                <Section title="Reflexión del día" emoji="🌸">
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div>
                            <label style={{ fontSize: 12, color: "#9b8aaa", display: "block", marginBottom: 6 }}>
                                Una cosa por la que estoy agradecida hoy
                            </label>
                            <input
                                type="text"
                                placeholder="ej. Tuve tiempo para descansar"
                                value={form.gratitude}
                                onChange={e => setForm(f => ({ ...f, gratitude: e.target.value }))}
                                style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: "#9b8aaa", display: "block", marginBottom: 6 }}>
                                Mi intención para mañana
                            </label>
                            <input
                                type="text"
                                placeholder="ej. Ser amable conmigo misma"
                                value={form.intention}
                                onChange={e => setForm(f => ({ ...f, intention: e.target.value }))}
                                style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                            />
                        </div>
                    </div>
                </Section>

                {/* Submit */}
                <button
                    onClick={handleSave}
                    disabled={!isComplete}
                    style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: 16,
                        border: "none",
                        background: isComplete
                            ? "linear-gradient(135deg, #c9a0ff, #ff8fab)"
                            : "rgba(255,255,255,0.1)",
                        color: isComplete ? "#0f0a1e" : "#555",
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: isComplete ? "pointer" : "not-allowed",
                        transition: "all 0.3s",
                        letterSpacing: "0.02em"
                    }}
                >
                    {saved ? "✅ Guardado" : "Guardar entrada del día"}
                </button>

                {!isComplete && (
                    <p style={{ textAlign: "center", fontSize: 12, color: "#666", marginTop: -8 }}>
                        Selecciona fase, estado de ánimo y energía para guardar
                    </p>
                )}
            </div>
        </div>
    );
}

function Section({ title, emoji, children }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(201,160,255,0.15)",
            borderRadius: 16,
            padding: "20px 18px"
        }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "#c9a0ff", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {emoji} {title}
            </h3>
            {children}
        </div>
    );
}

function Chip({ label, selected, onClick, accent }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1px solid ${selected ? accent : "rgba(255,255,255,0.15)"}`,
                background: selected ? `${accent}22` : "transparent",
                color: selected ? accent : "#9b8aaa",
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit"
            }}
        >
            {label}
        </button>
    );
}

const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#f0e6ff",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    width: 80,
};