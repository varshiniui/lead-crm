const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = `${BASE_URL}/api/leads`;

export const getLeads = async (search = "", status = "") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    const res = await fetch(`${BASE}?${params}`);
    if (!res.ok) throw new Error("Failed to fetch leads");
    return res.json();
};

export const addLead = async (data) => {
    const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to add lead");
    return json;
};

export const updateStatus = async (id, status) => {
    const res = await fetch(`${BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update");
    return json;
};

export const deleteLead = async (id) => {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
};