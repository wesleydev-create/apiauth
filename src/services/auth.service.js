const pool = require("../config/connection");
const bcrypt = require("bcrypt");

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return false;
  if (/^(.)\1+$/.test(cpf)) return false;
  return true;
}

async function register({ email, password, cpf, role }) {
  if (!email || !password || !cpf) {
    throw new Error("Email, senha e CPF são obrigatórios");
  }

  if (!validarCPF(cpf)) {
    throw new Error("CPF inválido");
  }

  try {

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

  } catch (err) {
    // Repassa erros do DB ou outros
    throw new Error(err.message || "Erro ao cadastrar usuário");
  }
}

async function login(email, password) {
  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios");
  }

  try {
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

    delete user.password;

    return user;

  } catch (err) {
    throw new Error(err.message || "Erro ao realizar login");
  }
}

module.exports = {
  register,
  login
};