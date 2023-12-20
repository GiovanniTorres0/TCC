require('dotenv').config();
const express = require("express");
const productRoutes = require('./routes/productRoutes');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const db = require('./config/db'); 
const manageSockets = require('./sockets/socketManager');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(authRoutes);
app.use('/payments', paymentRoutes);
app.use('/api', productRoutes)

manageSockets(socketIO, db);

http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
