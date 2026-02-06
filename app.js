// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpMu5t_Bihw_WCBFXRtYE1vLnlNqkCxn0",
  authDomain: "ghosttalk-486ac.firebaseapp.com",
  databaseURL: "https://ghosttalk-486ac-default-rtdb.firebaseio.com",
  projectId: "ghosttalk-486ac",
  storageBucket: "ghosttalk-486ac.firebasestorage.app",
  messagingSenderId: "4397493609",
  appId: "1:4397493609:web:11dd8763205f7f2cbe61f8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let username = "";

// Anonymous login
auth.signInAnonymously()
  .then(() => {
    // Generate random username
    username = "Guest" + Math.floor(Math.random() * 10000);
    document.getElementById("status").textContent = "You are: " + username;
  })
  .catch(error => {
    console.error(error);
    document.getElementById("status").textContent = "Failed to login";
  });

// Send message
document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();
  if (!msg) return;

  db.ref("messages").push({
    user: username,
    text: msg,
    timestamp: Date.now()
  });

  input.value = "";
});

// Listen for messages globally
db.ref("messages").on("child_added", snapshot => {
  const data = snapshot.val();
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.textContent = data.user + ": " + data.text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
