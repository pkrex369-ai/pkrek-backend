import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect Database
db.connect((err) => {

  if (err) {

    console.log("❌ DB Connection Failed:", err);

  } else {

    console.log("✅ Railway MySQL Connected");

  }

});

// Home Route
app.get("/", (req, res) => {

  res.send("PKREX Backend Running ✅");

});

// Contact API
app.post("/api/contact", (req, res) => {

  const { name, email, phone, message } = req.body;

  // Validation
  if (!name || !email || !phone || !message) {

    return res.status(400).json({
      status: false,
      message: "All fields required"
    });

  }

  // Insert Query
  const sql = `
    INSERT INTO contacts (name, email, phone, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, phone, message],
    (err, result) => {

      if (err) {

        console.log("❌ DB INSERT ERROR:", err);

        return res.status(500).json({
          status: false,
          message: "Database Error"
        });

      }

      return res.status(200).json({
        status: true,
        message: "Message saved successfully"
      });

    }
  );

});

// Railway Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {

  console.log(`🚀 Server running on port ${PORT}`);

});