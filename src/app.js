require("dotenv").config();
const express = require("express");
const pool = require("./config/connection");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para interpretar JSON
app.use(express.json());

// Rotas de autenticação
app.use("/api/auth", authRoutes);

// Rota padrão para teste
app.get("/", (req, res) => {
  res.json({ success: true, message: "API SmartOdonto rodando!" });
});

// Função para iniciar servidor e testar conexão com MySQL
async function startServer() {
  try {
    // Testa conexão com o banco
    const connection = await pool.getConnection();
    console.log("✅ Conexão com MySQL estabelecida!");
    connection.release(); // libera a conexão

    // Inicia servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Não foi possível conectar ao MySQL:", error.message);
    process.exit(1); // encerra o processo se falhar a conexão
  }
}

startServer();