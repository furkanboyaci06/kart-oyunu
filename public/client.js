const socket = io();

let currentRoom = "";
let role = "";

// Odaya katıl
function joinRoom() {
  const roomInput = document.getElementById("room-input");
  const room = roomInput.value.trim();

  if (room === "") {
    alert("Lütfen bir oda adı girin.");
    return;
  }

  currentRoom = room;
  socket.emit("joinRoom", room);

  // Lobi ekranını gizle, rol ekranını göster
  document.getElementById("lobby-screen").style.display = "none";
  document.getElementById("role-screen").style.display = "block";
}

// Rolü seç
function selectRole(selectedRole) {
  role = selectedRole;

  socke
