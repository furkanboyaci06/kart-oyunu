const socket = io();
let currentRoom = "";
let role = "";
let selectedJoinRoom = "";

// Oda kurma
function createRoom() {
  const room = document.getElementById("room-name").value.trim();
  const password = document.getElementById("room-password").value.trim();
  if (!room || !password) return alert("Oda adı ve şifre gerekli");

  socket.emit("createRoom", { room, password });
}

// Mevcut oda listesini güncelle
socket.on("updateRoomList", (rooms) => {
  const list = document.getElementById("room-list");
  list.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.textContent = room;
    li.onclick = () => {
      selectedJoinRoom = room;
      document.getElementById("lobby-screen").style.display = "none";
      document.getElementById("password-prompt").style.display = "block";
      document.getElementById("selected-room-name").textContent = `Oda: ${room}`;
    };
    list.appendChild(li);
  });
});

// Şifre girip odaya katıl
function confirmJoin() {
  const password = document.getElementById("join-password").value;
  socket.emit("joinRoom", { room: selectedJoinRoom, password });
}

// Giriş onaylandıysa
socket.on("joinApproved", (room) => {
  currentRoom = room;
  document.getElementById("password-prompt").style.display = "none";
  document.getElementById("role-screen").style.display = "block";
});

// Hatalı şifre
socket.on("joinDenied", () => {
  alert("Şifre hatalı!");
  document.getElementById("password-prompt").style.display = "none";
  document.getElementById("lobby-screen").style.display = "block";
});

// Rol seçimi
function selectRole(selectedRole) {
  role = selectedRole;
  socket.emit("selectRole", { room: currentRoom, role });

  document.getElementById("role-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  document.getElementById("roleDisplay").textContent = role;
  document.getElementById("roomDisplay").textContent = currentRoom;
}
