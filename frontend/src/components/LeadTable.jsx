import React from "react";
import { updateStatus, deleteLead } from "../api";

const SRC = { Call: "📞", WhatsApp: "💬", Field: "🏃" };
const CLR = { Interested: "#f6c90e", "Not Interested": "#e63946", Converted: "#2ec27e", new: "#f6c90e" };
export default function LeadTable({ leads, onUpdate, onDelete }) {
    if (!leads.length) return (
        <div style={{ border: "1px dashed #2a2a38", borderRadius: 10, padding: 48, textAlign: "center", color: "#888" }}>
            No leads yet. Add one using the form.
        </div>
    );

    const handleStatus = async (id, status) => {
        try { onUpdate(await updateStatus(id, status)); } catch (e) { alert(e.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this lead?")) return;
        try { await deleteLead(id); onDelete(id); } catch (e) { alert(e.message); }
    };

    const th = { background: "#1a1a22", color: "#888", fontSize: 11, fontWeight: 600, textAlign: "left", padding: "12px 16px", textTransform: "uppercase", borderBottom: "1px solid #2a2a38" };
    const td = { padding: "13px 16px", borderBottom: "1px solid #2a2a38", verticalAlign: "middle" };

    return (
        <div style={{ border: "1px solid #2a2a38", borderRadius: 10, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>{["#", "Name", "Phone", "Source", "Status", "Added", ""].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                    {leads.map((lead, i) => (
                        <tr key={lead.id}>
                            <td style={{ ...td, color: "#888", width: 36 }}>{i + 1}</td>
                            <td style={{ ...td, fontWeight: 500 }}>{lead.name}</td>
                            <td style={{ ...td, color: "#888" }}>{lead.phone}</td>
                            <td style={td}>
                                <span style={{ background: "rgba(255,255,255,0.06)", borderRadius: 5, fontSize: 12, padding: "3px 8px" }}>
                                    {SRC[lead.source]} {lead.source}
                                </span>
                            </td>
                            <td style={td}>
                                <select value={lead.status} onChange={e => handleStatus(lead.id, e.target.value)}
                                    style={{ border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "4px 8px", background: `${CLR[lead.status]}22`, color: CLR[lead.status], outline: "none" }}>
                                    <option>Interested</option>
                                    <option>Not Interested</option>
                                    <option>Converted</option>
                                </select>
                            </td>
                            <td style={{ ...td, color: "#888", fontSize: 12 }}>
                                {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td style={td}>
                                <button onClick={() => handleDelete(lead.id)}
                                    style={{ background: "transparent", border: "1px solid #2a2a38", borderRadius: 6, color: "#888", padding: "4px 8px", fontSize: 11 }}>
                                    ✕
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}