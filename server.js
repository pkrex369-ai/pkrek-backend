import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./src/config/db.js";

dotenv.config();

const app = express();

// PORT
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("🚀 PKREX Backend Running Successfully");
});

// CONTACT API
app.post("/api/contact", (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // VALIDATION
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        status: false,
        message: "All fields required",
      });
    }

    // SQL QUERY
    const sql =
      "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, phone, message], (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);

        return res.status(500).json({
          status: false,
          message: "Database insert failed",
          error: err.message,
        });
      }

      return res.status(200).json({
        status: true,
        message: "✅ Message saved successfully",
        data: result,
      });
    });

  } catch (error) {
    console.log("SERVER ERROR:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// SERVER START
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});