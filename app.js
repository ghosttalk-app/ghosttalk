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

// ----------------------------
// Email/password login form
// ----------------------------
const loginFormHTML = `
  <div id="loginForm">
    <input type="email" id="email" placeholder="Email" />
    <input type="password" id="password" placeholder="Password" />
    <button id="signupBtn">Sign Up</button>
    <button id="loginBtn">Log In</button>
  </div>
`;

document.getElementById("app").insertAdjacentHTML("afterbegin", loginFormHTML);

// Signup
document.getElementById("signupBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Enter email and password");

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      username = email.split("@")[0]; // simple username
      document.getElementById("status").textContent = "Logged in as: " + username;
      document.getElementById("loginForm").remove();
    })
    .catch(err => alert(err.message));
});

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Enter email and password");

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      username = email.split("@")[0];
      document.getElementById("status").textContent = "Logged in as: " + username;
      document.getElementById("loginForm").remove();
    })
    .catch(err => alert(err.message));
});

// ----------------------------
// Send message (after login)
// ----------------------------
document.getElementById("sendBtn").addEventListener("click", () => {
  if (!username) return alert("You must log in first");
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

// ----------------------------
// Listen for messages globally
// ----------------------------
db.ref("messages").on("child_added", snapshot => {
  const data = snapshot.val();
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.textContent = data.user + ": " + data.text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
