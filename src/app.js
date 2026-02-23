require("dotenv").config();
const express = require("express");
const pool = require("../config/connection");
const authRoutes = require("../routes/auth.routes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();

    return res.json({
      success: true,
      message: "API AUTH rodando na Vercel 🚀",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Erro ao conectar com o banco",
      details: error.message,
    });
  }
});

module.exports = app;