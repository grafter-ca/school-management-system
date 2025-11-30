import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
  ssl:
    process.env.PG_SSL === "true"
      ? { rejectUnauthorized: false } // Neon requires SSL
      : false,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL pool connected");
});

export default pool;
