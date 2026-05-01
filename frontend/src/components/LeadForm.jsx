import React, { useState } from "react";
import { addLead } from "../api";

const EMPTY = { name: "", phone: "", source: "" };
const inp = { background: "#0f0f13", border: "1px solid #2a2a38", borderRadius: 7, color: "#fff", padding: "10px 12px", width: "100%", outline: "none" };

export default function LeadForm({ onAdded }) {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.phone.trim()) e.phone = "Phone is required";
        if (!form.source) e.source = "Select a source";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) return setErrors(errs);
        setLoading(true);
        try {
            const lead = await addLead(form);
            onAdded(lead);
            setForm(EMPTY);
            setErrors({});
        } catch (err) { alert(err.message); }
        finally { setLoading(false); }
    };

    const set = f => e => { setForm(p => ({ ...p, [f]: e.target.value })); setErrors(p => ({ ...p, [f]: "" })); };

    return (
        <div style={{ background: "#1a1a22", border: "1px solid #2a2a38", borderRadius: 10, padding: 24 }}>
            <h2 style={{ marginBottom: 20, fontSize: 16 }}>Add New Lead</h2>
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                    { label: "Name", field: "name", type: "text", placeholder: "John Doe" },
                    { label: "Phone", field: "phone", type: "tel", placeholder: "+91 9876543210" },
                ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 5, textTransform: "uppercase" }}>{label}</label>
                        <input type={type} placeholder={placeholder} value={form[field]} onChange={set(field)}
                            style={{ ...inp, borderColor: errors[field] ? "#e63946" : "#2a2a38" }} />
                        {errors[field] && <span style={{ color: "#e63946", fontSize: 11 }}>{errors[field]}</span>}
                    </div>
                ))}

                <div>
                    <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Source</label>
                    <select value={form.source} onChange={set("source")}
                        style={{ ...inp, borderColor: errors.source ? "#e63946" : "#2a2a38", cursor: "pointer" }}>
                        <option value="">Select source...</option>
                        <option value="Call">Call</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Field">Field</option>
                    </select>
                    {errors.source && <span style={{ color: "#e63946", fontSize: 11 }}>{errors.source}</span>}
                </div>

                <button type="submit" disabled={loading}
                    style={{ background: "#e63946", border: "none", borderRadius: 7, color: "#fff", fontWeight: 600, padding: 11, marginTop: 4, opacity: loading ? 0.6 : 1 }}>
                    {loading ? "Adding..." : "+ Add Lead"}
                </button>
            </form>
        </div>
    );
}