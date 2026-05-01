const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false  // Required for Supabase
    }
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