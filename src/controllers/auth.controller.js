const jwt = require("jsonwebtoken");
const { cpf } = require("cpf-cnpj-validator");
const authService = require("../services/auth.service");
const sendEmail = require("../utils/email");


// ============================
// REGISTER
// ============================
async function register(req, res) {
  try {
    const { email, password, confirmPassword, cpf: userCpf } = req.body;

    // 🔎 Validações básicas
    if (!email || !password || !confirmPassword || !userCpf) {
      return res.status(400).json({
        success: false,
        message: "Email, senha, confirmação de senha e CPF são obrigatórios",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "As senhas não coincidem",
      });
    }

    if (!cpf.isValid(userCpf)) {
      return res.status(400).json({
        success: false,
        message: "CPF inválido",
      });
    }

    // 🚀 Criar usuário
    const user = await authService.register({
      email,
      password,
      cpf: userCpf,
      role: "user",
    });


    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bem-vindo ao SmartSystem</title>
</head>

<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0" 
style="background:#ffffff; border-radius:14px; padding:48px; box-shadow:0 10px 30px rgba(0,0,0,0.06);">

<tr>
<td align="center" style="padding-bottom:30px;">
<h2 style="margin:0; font-size:22px; color:#111827;">SmartSystem</h2>
<p style="margin:6px 0 0; font-size:14px; color:#6b7280;">
você se cadastrou no nosso sistema de gestao, Obrigado por automatizar conosco
</p>
</td>
</tr>

<tr>
<td style="color:#374151; font-size:16px; line-height:1.7;">

<h1 style="font-size:24px; margin-bottom:20px; color:#111827;">
Sua conta foi criada com sucesso 
</h1>

<p style="margin:0 0 16px;">
Olá <strong>${email}</strong>,
</p>

<p style="margin:0 0 16px;">
Seja bem-vindo a <strong>SmartSystem</strong>.  
Sua conta já está ativa e pronta para uso.
</p>

<p style="margin:0 0 24px;">
obrigado por se cadastrar no nosso sistema e fazer parte da familia SmartSystem.
</p>

</td>
</tr>

<tr>
<td align="center" style="padding:30px 0;">
<a href="https://smartodonto.com/login"
style="
background:linear-gradient(90deg,#2563eb,#1e40af);
color:#ffffff;
text-decoration:none;
padding:14px 28px;
border-radius:8px;
font-size:15px;
font-weight:600;
display:inline-block;
box-shadow:0 6px 20px rgba(37,99,235,0.35);
">
Acessar minha conta
</a>
</td>
</tr>

<tr>
<td style="border-top:1px solid #e5e7eb; padding-top:30px; font-size:13px; color:#6b7280; text-align:center;">

<p style="margin:0;">
Se você nao criou essa conta pode ignorar o email.
</p>

<p style="margin:16px 0 0;">
© 2026 SmartOdonto • Todos os direitos reservados
</p>

<p style="margin:6px 0 0;">
natal - RN • Brasil
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

    sendEmail({
      to: email,
      subject: "Bem-vindo a SmartSystem 🎉",
      html,
    }).catch((err) =>
      console.error(" Erro ao enviar email:", err.message)
    );

    return res.status(201).json({
      success: true,
      message: "Usuário cadastrado com sucesso!",
      data: user,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    const user = await authService.login(email, password);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login realizado com sucesso!",
      token,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  register,
  login,
};