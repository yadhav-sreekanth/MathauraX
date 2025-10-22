const body = document.body;
const modeToggle = document.getElementById("modeToggle");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

// --- Toggle Light/Dark Mode ---
modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const icon = modeToggle.querySelector("i");
  icon.classList.toggle("fa-sun");
  icon.classList.toggle("fa-moon");
});

// --- Event Listeners ---
sendBtn.addEventListener("click", () => sendMessage());
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

uploadBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) sendFile(fileInput.files[0]);
});

// --- Append Message ---
function appendMessage(content, sender = "ai", isFile = false) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");

  if (isFile) {
    msgDiv.innerHTML = `<i class="fas fa-file"></i> ${content}`;
  } else {
    msgDiv.innerHTML = content; // Use innerHTML for math formatting
  }

  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- Show Thinking Animation ---
function showThinking() {
  const thinkingEl = document.createElement("div");
  thinkingEl.classList.add("message", "ai-message");
  thinkingEl.innerHTML = `<div class="thinking"><span></span><span></span><span></span></div>`;
  chatWindow.appendChild(thinkingEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return thinkingEl;
}

// --- Send Text Message ---
function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  appendMessage(msg, "user");
  userInput.value = "";

  const thinkingEl = showThinking();

  fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg, user_id: "anonymous" })
  })
    .then(res => res.json())
    .then(data => {
      thinkingEl.remove();
      appendMessage(data.reply, "ai");
    })
    .catch(err => {
      thinkingEl.remove();
      appendMessage("<span style='color:red'>Error: Could not get AI response</span>", "ai");
    });
}

// --- Send File ---
function sendFile(file) {
  appendMessage(file.name, "user", true);
  const thinkingEl = showThinking();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", "anonymous");

  fetch("/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      thinkingEl.remove();
      appendMessage(data.reply, "ai");
    })
    .catch(err => {
      thinkingEl.remove();
      appendMessage("<span style='color:red'>Error: Could not process file</span>", "ai");
    });
}
