const pool = require("../config/connection");
const bcrypt = require("bcrypt");

async function register({ email, password, cpf, role }) {

  if (!email || !password || !cpf) {
    throw new Error("Email, senha e CPF são obrigatórios");
  }


  const [existingEmail] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingEmail.length > 0) {
    throw new Error("Email já cadastrado");
  }


  const [existingCpf] = await pool.query(
    "SELECT id FROM users WHERE cpf = ?",
    [cpf]
  );

  if (existingCpf.length > 0) {
    throw new Error("CPF já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (email, password, cpf, role) VALUES (?, ?, ?, ?)",
    [email, hashedPassword, cpf, role || "user"]
  );

  return {
    id: result.insertId,
    email,
    cpf,
    role: role || "user"
  };
}



async function login(email, password) {

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const user = rows[0];

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Senha inválida");
  }

  if (!user.email_verified) {
    throw new Error("Confirme seu email antes de fazer login");
  }

  delete user.password;

  return user;
}


async function verifyEmail(userId) {
  await pool.query(
    "UPDATE users SET email_verified = true WHERE id = ?",
    [userId]
  );
}

module.exports = {
  register,
  login,
  verifyEmail
};