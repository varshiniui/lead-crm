import React, { useState, useEffect, useCallback } from "react";
import { getLeads } from "./api";
import LeadForm from "./components/LeadForm";
import LeadTable from "./components/LeadTable";

export default function App() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getLeads(search, statusFilter);
            setLeads(data);
        } catch (err) {
            setError("Could not connect to backend.");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        const t = setTimeout(fetchLeads, 300);
        return () => clearTimeout(t);
    }, [fetchLeads]);

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
            <h1 style={{ color: "#e63946", marginBottom: 4 }}>LeadCRM</h1>
            <p style={{ color: "#888", marginBottom: 24 }}>Mini Lead Management System</p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                {[
                    { label: "Total", value: leads.length, color: "#fff" },
                    { label: "Interested", value: leads.filter(l => l.status === "Interested" || l.status === "new").length, color: "#f6c90e" },
                    { label: "Converted", value: leads.filter(l => l.status === "Converted").length, color: "#2ec27e" },
                    { label: "Not Interested", value: leads.filter(l => l.status === "Not Interested").length, color: "#e63946" },
                ].map(s => (
                    <div key={s.label} style={{ background: "#1a1a22", border: "1px solid #2a2a38", borderRadius: 10, padding: "14px 20px", flex: 1 }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
                {/* Form */}
                <LeadForm onAdded={(lead) => setLeads(prev => [lead, ...prev])} />

                {/* Table section */}
                <div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                        <input
                            placeholder="🔍 Search name or phone..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ flex: 1, background: "#1a1a22", border: "1px solid #2a2a38", borderRadius: 8, color: "#fff", padding: "9px 14px", outline: "none" }}
                        />
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{ background: "#1a1a22", border: "1px solid #2a2a38", borderRadius: 8, color: "#fff", padding: "9px 14px", outline: "none" }}
                        >
                            <option value="">All Status</option>
                            <option>Interested</option>
                            <option>Not Interested</option>
                            <option>Converted</option>
                        </select>
                    </div>

                    {error && <p style={{ color: "#e63946", marginBottom: 12 }}>{error}</p>}
                    {loading ? <p style={{ color: "#888" }}>Loading...</p> : (
                        <LeadTable
                            leads={leads}
                            onUpdate={updated => setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))}
                            onDelete={id => setLeads(prev => prev.filter(l => l.id !== id))}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}