require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");
const leadsRouter = require("./routes/leads");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/leads", leadsRouter);
app.get("/", (req, res) => res.json({ status: "Lead CRM API running" }));

// Only listen when running locally, not on Vercel
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    initDB()
        .then(() => {
            app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
        })
        .catch((err) => {
            console.error("DB init failed:", err.message);
            process.exit(1);
        });
} else {
    // On Vercel, just init DB without listening
    initDB().catch((err) => console.error("DB init failed:", err.message));
}

module.exports = app;