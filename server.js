const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const rooms = {}; // { odaAdi: { password: "1234", users: [] } }

io.on("connection", (socket) => {
  console.log("Yeni kullanıcı bağlandı");

  // Oda kurma
  socket.on("createRoom", ({ room, password }) => {
    if (!rooms[room]) {
      rooms[room] = { password, users: [] };
      console.log(`Yeni oda oluşturuldu: ${room}`);
      io.emit("updateRoomList", Object.keys(rooms));
    }
  });

  // Odaya katılma
  socket.on("joinRoom", ({ room, password }) => {
    const oda = rooms[room];
    if (!oda) return;
    if (oda.password !== password) {
      socket.emit("joinDenied");
    } else {
      socket.join(room);
      socket.room = room;
      oda.users.push(socket.id);
      socket.emit("joinApproved", room);
      console.log(`Kullanıcı ${socket.id} '${room}' odasına katıldı`);
    }
  });

  // Rol seçimi
  socket.on("selectRole", ({ room, role }) => {
    console.log(`Rol seçildi: ${role} (oda: ${room})`);
  });

  // İlk bağlantıda oda listesi gönder
  socket.emit("updateRoomList", Object.keys(rooms));

  // Bağlantı kesilince kullanıcıyı sil (geliştirilebilir)
  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı");
  });
});

http.listen(PORT, () => {
  console.log(`🎮 Sunucu ${PORT} portunda çalışıyor`);
});
