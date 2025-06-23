const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.static('public'));

let players = {};
let moderator = null;

io.on('connection', (socket) => {
  console.log(`Kullanıcı bağlandı: ${socket.id}`);

  socket.on('joinGame', (role, name) => {
    if (role === 'moderator') {
      moderator = socket.id;
      console.log(`Moderatör: ${name}`);
    } else {
      players[socket.id] = { name: name, cards: [], score: 0 };
      console.log(`Oyuncu: ${name}`);
    }

    io.emit('playerList', Object.values(players).map(p => p.name));
  });

  socket.on('submitCards', (cards) => {
    if (players[socket.id]) {
      players[socket.id].cards = cards;
    }
  });

  socket.on('askQuestion', (question) => {
    io.emit('newQuestion', question);
  });

  socket.on('submitAnswer', (card) => {
    io.emit('answerSubmitted', { player: players[socket.id].name, card: card });
  });

  socket.on('setScores', (scoreData) => {
    for (let playerId in scoreData) {
      if (players[playerId]) {
        players[playerId].score += scoreData[playerId];
      }
    }
    io.emit('updateScores', players);
  });

  socket.on('disconnect', () => {
    console.log(`Bağlantı koptu: ${socket.id}`);
    delete players[socket.id];
    if (moderator === socket.id) {
      moderator = null;
      console.log('Moderatör ayrıldı');
    }
    io.emit('playerList', Object.values(players).map(p => p.name));
  });
});

server.listen(PORT, () => {
  console.log(`🎮 Oyun sunucusu çalışıyor: http://localhost:${PORT}`);
});
