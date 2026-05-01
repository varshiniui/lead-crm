const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "lead_crm",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "yourpassword",
});

const initDB = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      phone      VARCHAR(20)  NOT NULL,
      source     VARCHAR(20)  NOT NULL CHECK (source IN ('Call', 'WhatsApp', 'Field')),
      status     VARCHAR(20)  NOT NULL DEFAULT 'Interested'
                              CHECK (status IN ('Interested', 'Not Interested', 'Converted')),
      created_at TIMESTAMP    DEFAULT NOW()
    );
  `);
    console.log("Database ready");
};

module.exports = { pool, initDB };