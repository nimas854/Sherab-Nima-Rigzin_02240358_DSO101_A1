const { Pool } = require("pg");
require("dotenv").config();

function resolveDbPort(rawPort, fallback = 5432) {
  const normalized = String(rawPort ?? "").trim();

  if (!/^\d+$/.test(normalized)) {
    return fallback;
  }

  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    return fallback;
  }

  return parsed;
}

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: resolveDbPort(process.env.DB_PORT),
});

module.exports = pool;
