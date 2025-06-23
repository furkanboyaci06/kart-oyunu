const socket = io();

let benimId = null;
let benimRol = null;

socket.on('connect', () => {
  benimId = socket.id;
});

function girisYap() {
  const ad = document.getElementById('ad').value;
  const rol = document.getElementById('rol').value;
  benimRol = rol;

  socket.emit('joinGame', rol, ad);

  document.getElementById('giris').style.display = 'none';
  document.getElementById('oyun').style.display = 'block';

  document.getElementById('rolBilgisi').innerText = `Giriş yapıldı: ${rol.toUpperCase()}`;

  if (rol === 'oyuncu') {
    document.getElementById('kartlar').style.display = 'block';
    document.getElementById('cevapAlani').style.display = 'block';
  } else if (rol === 'moderator') {
    document.getElementById('soruAlani').style.display = 'block';
    document.getElementById('puanAlani').style.display = 'block';
  }
}

function kartlariGonder() {
  const kartInput = document.getElementById('kartListesi').value;
  const kartlar = kartInput.split(',').map(k => k.trim());
  socket.emit('submitCards', kartlar);
  alert("Kartlar gönderildi!");
}

function soruSor() {
  const soru = document.getElementById('soru').value;
  socket.emit('askQuestion', soru);
}

function cevapGonder() {
  const kart = document.getElementById('seciliKart').value;
  socket.emit('submitAnswer', kart);
  document.getElementById('seciliKart').value = '';
}

function puanlariAyarla() {
  const veri = document.getElementById('puanGirdisi').value;
  const obj = {};
  veri.split(',').forEach(parca => {
    const [id, puan] = parca.split(':');
    obj[id.trim()] = parseFloat(puan.trim());
  });
  socket.emit('setScores', obj);
}

socket.on('playerList', (liste) => {
  document.getElementById('oyuncular').innerText = `Oyuncular: ${liste.join(', ')}`;
});

socket.on('newQuestion', (soru) => {
  document.getElementById('soruGoster').innerText = `Soru: ${soru}`;
  document.getElementById('cevaplarListesi').innerHTML = '';
});

socket.on('answerSubmitted', (veri) => {
  const div = document.getElementById('cevaplarListesi');
  const p = document.createElement('p');
  p.innerText = `${veri.player} → ${veri.card}`;
  div.appendChild(p);
});

socket.on('updateScores', (oyuncular) => {
  const skorDiv = document.getElementById('skorlar');
  skorDiv.innerHTML = '<h3>Skorlar</h3>';
  for (let id in oyuncular) {
    const p = document.createElement('p');
    p.innerText = `${oyuncular[id].name}: ${oyuncular[id].score} puan`;
    skorDiv.appendChild(p);
  }
});
