// ./sockets/socketManager.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; 
let users = [];

module.exports = function (io, db) {
  io.use((socket, next) => {
    const cookieString = socket.handshake.headers.cookie;
    const token = parseCookie(cookieString, 'token');

    if (!token) {
      console.log("Token não fornecido.");
      return next(new Error("Token não fornecido."));
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("Erro na verificação do JWT:", err.message);
        return next(new Error("Token inválido"));
      }
      console.log("Usuário autenticado via Socket.io:", decoded);
      socket.user = decoded;
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("message", (data) => {
      io.emit("messageResponse", data);
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("typingResponse", data);
    });

    socket.on("fetchUserName", async (data) => {
      const email = data.email;
      try {
        const [result] = await db.promise().query("SELECT nome FROM usuarios WHERE email = ?", [email]);
        if (result.length > 0) {
          const nome = result[0].nome;
          socket.emit("userNameResponse", { userName: nome });
        } else {
          socket.emit("userNameResponse", { error: "User not found" });
        }
      } catch (error) {
        console.error("Erro ao buscar nome do usuário:", error);
        socket.emit("userNameResponse", { error: "Error fetching user name" });
      }
    });

    socket.on("newUser", (data) => {
      const nome = data.userNameReal;
      users.push({ socketID: socket.id, userName: nome });
      io.emit("newUserResponse", users);
    });

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
      users = users.filter((user) => user.socketID !== socket.id);
      io.emit("newUserResponse", users);
    });
  });
    
    function parseCookie(cookieString, cookieName) {
      if (!cookieString) return null;
      const cookieValue = cookieString.split('; ')
        .find(row => row.startsWith(`${cookieName}=`))
        ?.split('=')[1];
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }

};
