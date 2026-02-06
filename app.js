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

// DOM Elements
const loginContainer = document.getElementById("loginContainer");
const chatContainer = document.getElementById("chatContainer");
const status = document.getElementById("status");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");

// ----------------------------
// Sign up
// ----------------------------
document.getElementById("signupBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Enter email and password");

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      username = email.split("@")[0];
      showChat();
    })
    .catch(err => alert(err.message));
});

// ----------------------------
// Login
// ----------------------------
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Enter email and password");

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      username = email.split("@")[0];
      showChat();
    })
    .catch(err => alert(err.message));
});

// ----------------------------
// Show chat after login
// ----------------------------
function showChat() {
  loginContainer.style.display = "none";
  chatContainer.style.display = "block";
  status.textContent = "Logged in as: " + username;
}

// ----------------------------
// Send message
// ----------------------------
document.getElementById("sendBtn").addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (!msg) return;

  db.ref("messages").push({
    user: username,
    text: msg,
    timestamp: Date.now()
  });

  messageInput.value = "";
});

// ----------------------------
// Listen for messages globally
// ----------------------------
db.ref("messages").on("child_added", snapshot => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.textContent = data.user + ": " + data.text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
