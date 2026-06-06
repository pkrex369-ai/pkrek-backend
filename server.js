import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const app = express();

/* ===========================
   Middleware
=========================== */

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ===========================
   PostgreSQL Connection
=========================== */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => {
    console.log("✅ Neon PostgreSQL Connected");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Failed");
    console.error(err);
  });

/* ===========================
   Home Route
=========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "PKREX Backend Running",
  });
});

/* ===========================
   Health Check
=========================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server Healthy",
  });
});

/* ===========================
   Test Database
=========================== */

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contacts ORDER BY id DESC"
    );

    return res.status(200).json({
      status: true,
      totalRecords: result.rows.length,
      data: result.rows,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

/* ===========================
   Contact API
=========================== */

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO contacts
      (
        name,
        email,
        phone,
        message
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [name, email, phone, message]
    );

    console.log(
      "Contact Saved:",
      result.rows[0].id
    );

    return res.status(201).json({
      status: true,
      message: "Message submitted successfully",
      contactId: result.rows[0].id,
    });

  } catch (err) {
    console.error("Database Error:");
    console.error(err);

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

/* ===========================
   404 Route
=========================== */

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route Not Found",
  });
});

/* ===========================
   Start Server
=========================== */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});