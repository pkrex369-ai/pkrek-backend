import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

/* ===========================
   Middleware
=========================== */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
   Home Route
=========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "PKREX Backend Running Successfully",
  });
});

/* ===========================
   API Routes
=========================== */

app.use("/api/contact", contactRoutes);

/* ===========================
   404 Handler
=========================== */

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route Not Found",
  });
});

export default app;