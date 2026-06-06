import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import nodemailer from "nodemailer";

dotenv.config();

const { Pool } = pkg;

const app = express();

/* ===========================
   Middleware
=========================== */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===========================
   PostgreSQL Connection
=========================== */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => {
    console.log("✅ Neon PostgreSQL Connected");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Failed");
    console.error(err);
  });

/* ===========================
   Nodemailer
=========================== */

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

/* ===========================
   Home Route
=========================== */

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "PKREX Backend Running",
  });
});

/* ===========================
   Health Check
=========================== */

app.get("/health", (req, res) => {
  res.json({
    status: true,
    message: "Server Healthy",
  });
});

/* ===========================
   Test DB
=========================== */

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contacts ORDER BY id DESC"
    );

    res.json({
      status: true,
      totalRecords: result.rows.length,
      data: result.rows,
    });

  } catch (err) {

    res.status(500).json({
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
    console.log("📩 Request Received");
    console.log(req.body);

    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Save to PostgreSQL
      const result = await pool.query(
        `INSERT INTO contacts(name,email,phone,message)
        VALUES($1,$2,$3,$4)
        RETURNING id`,
        [name, email, phone, message]
      );

      console.log("AAAAAAAAAAAAAAAAAAAA");

    console.log("✅ Data Saved:", result.rows[0].id);

    // Verify SMTP
    await transporter.verify();
    console.log("✅ SMTP Ready");

    console.log("📧 Sending Email...");

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: "pkrex369@gmail.com",
      subject: "New Contact Form Submission - PKREX",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    console.log("✅ Email Sent");
    console.log(info);

    return res.status(201).json({
      status: true,
      message: "Message submitted successfully",
      contactId: result.rows[0].id,
    });

  } catch (err) {
    console.error("❌ FULL ERROR:");
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
  console.log(`🚀 Server running on port ${PORT}`);
});