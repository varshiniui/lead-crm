const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.get("/", async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = "SELECT * FROM leads WHERE 1=1";
        const params = [];
        if (search) { params.push(`%${search}%`); query += ` AND (name ILIKE $${params.length} OR phone ILIKE $${params.length})`; }
        if (status) { params.push(status); query += ` AND status = $${params.length}`; }
        query += " ORDER BY created_at DESC";
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
    try {
        const { name, phone, source } = req.body;
        if (!name || !phone || !source) return res.status(400).json({ error: "All fields required" });
        const result = await pool.query(
            "INSERT INTO leads (name, phone, source) VALUES ($1, $2, $3) RETURNING *",
            [name.trim(), phone.trim(), source]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const result = await pool.query(
            "UPDATE leads SET status = $1 WHERE id = $2 RETURNING *",
            [status, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: "Not found" });
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM leads WHERE id = $1 RETURNING *", [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;