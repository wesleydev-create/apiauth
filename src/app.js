require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/connection");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: " API rodando com sucesso!",
    environment: process.env.NODE_ENV || "development"
  });
});

app.use("/api/auth", authRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada"
  });
});

app.use((err, req, res, next) => {
  console.error(" Erro interno:", err);
  alert("error interno do servidor")

  res.status(500).json({
    success: false,
    message: "Erro interno do servidor"
  });
});


async function startServer() {
  try {
    await pool.getConnection();
    console.log("Conexão com MariaDB estabelecida com sucesso!");

    app.listen(PORT, () => {
      console.log(` Servidor rodando em: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(" Erro ao conectar com o banco:", error.message);
    process.exit(1);
  }
}

startServer();