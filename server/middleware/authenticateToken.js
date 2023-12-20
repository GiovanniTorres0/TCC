// ./middleware/authenticateTokens.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (token == null) {
    return res.sendStatus(401); 
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Erro na verificação do JWT:", err.message);
      return res.sendStatus(403); 
    }

    console.log("Usuário autenticado:", user);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
