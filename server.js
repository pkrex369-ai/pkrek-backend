import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const app = express();

// ✅ Middleware (FIXED CORS)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// ✅ DB Connect
db.connect((err) => {
  if (err) {
    console.log("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ✅ Health Check (IMPORTANT for Render stability)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Home Route
app.get("/", (req, res) => {
  res.send("PKREX Backend Running ✅");
});

// ✅ Contact API
app.post("/api/contact", (req, res) => {

  const { name, email, phone, message } = req.body;

  // Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      status: false,
      message: "All fields required"
    });
  }

  const sql = `
    INSERT INTO contacts (name, email, phone, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, message], (err, result) => {

    if (err) {
      console.log("❌ DB ERROR:", err);

      return res.status(500).json({
        status: false,
        message: "Database Error"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Message saved successfully"
    });

  });
});

// ✅ Port (Render safe)
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});