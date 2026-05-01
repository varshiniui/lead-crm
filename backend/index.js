require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");
const leadsRouter = require("./routes/leads");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/leads", leadsRouter);
app.get("/", (req, res) => res.json({ status: "Lead CRM API running" }));

initDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("DB init failed:", err.message);
        process.exit(1);
    });