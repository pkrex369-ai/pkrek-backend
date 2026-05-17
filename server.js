import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./src/config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.json({
      status: false,
      message: "All fields required",
    });
  }

  const sql =
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, phone, message], (err) => {
    if (err) {
      return res.json({
        status: false,
        message: "DB Insert Failed",
        error: err.message,
      });
    }

    res.json({
      status: true,
      message: "Message saved successfully",
    });
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});