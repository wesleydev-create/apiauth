const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");
const sendEmail = require("../utils/email");

async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    const result = await authService.register(email, password);

const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bem-vindo ao SmartOdonto</title>
</head>

<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0" 
style="background:#ffffff; border-radius:14px; padding:48px; box-shadow:0 10px 30px rgba(0,0,0,0.06);">

<tr>
<td align="center" style="padding-bottom:30px;">
<h2 style="margin:0; font-size:22px; color:#111827;">SmartOdonto</h2>
<p style="margin:6px 0 0; font-size:14px; color:#6b7280;">
Plataforma profissional de gestão odontológica
</p>
</td>
</tr>

<tr>
<td style="color:#374151; font-size:16px; line-height:1.7;">

<h1 style="font-size:24px; margin-bottom:20px; color:#111827;">
Sua conta foi criada com sucesso 🎉
</h1>

<p style="margin:0 0 16px;">
Olá <strong>${email}</strong>,
</p>

<p style="margin:0 0 16px;">
Seja bem-vindo ao <strong>SmartOdonto</strong>.  
Sua conta já está ativa e pronta para uso.
</p>

<p style="margin:0 0 24px;">
Agora você pode gerenciar pacientes, consultas e finanças de forma moderna, segura e eficiente.
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
Se você não criou essa conta, pode ignorar este email.
</p>

<p style="margin:16px 0 0;">
© 2026 SmartOdonto • Todos os direitos reservados
</p>

<p style="margin:6px 0 0;">
Mossoró - RN • Brasil
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

    try {
      await sendEmail({
        to: email,
        subject: "Bem-vindo ao SmartOdonto!",
        html: html,
      });

      console.log(`✅ Email enviado para ${email}`);
    } catch (err) {
      console.error("❌ Erro ao enviar email:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso! Email enviado.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login realizado com sucesso!",
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { register, login };