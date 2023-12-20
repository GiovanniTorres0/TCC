// ./controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const saltRounds = 10;
const SECRET_KEY = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  console.log(req.body)
  try {
    const [existingUser] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "E-mail já registrado" });
    }

    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    await db.promise().query(
      "INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)",
      [nome, email, hashedPassword, telefone]
    );

    res.status(201).json({ message: "Cadastrado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: "Erro ao inserir usuário no banco de dados" });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [user] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const usuario = user[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (senhaCorreta) {
      const token = jwt.sign({ id: usuario.idusuarios, email: usuario.email }, SECRET_KEY);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, 
      });

      res.status(200).json({
        usuario: { nome: usuario.nome, email: usuario.email }
      });
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout realizado com sucesso" });
};

