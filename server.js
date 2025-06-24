const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Yeni bir kullanıcı bağlandı");

  // Odaya katılma
  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.room = room;
    console.log(`Kullanıcı '${room}' odasına katıldı`);
  });

  // Rol seçimi
  socket.on("selectRole", ({ room, role }) => {
    console.log(`Kullanıcı '${room}' odasında rolünü seçti: ${role}`);
  });

  socket.on("disconnect", () => {
    console.log("Bir kullanıcı ayrıldı");
  });
});

http.listen(PORT, () => {
  console.log(`🎮 Oyun sunucusu çalışıyor: Port ${PORT}`);
});
