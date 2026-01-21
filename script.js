const USER_DIR = "./users/";
let users = {};
let isPlayingScript = false;

fetch("users.json")
  .then(r => r.json())
  .then(files => {
    files.forEach(f => {
      const name = f.replace(".png", "").replace(/_/g, " ");
      users[name.toLowerCase()] = f;
    });
  });

const chat = document.getElementById("chat");
const input = document.getElementById("commandInput");
const typing = document.getElementById("typingIndicator");
const title = document.getElementById("chatTitle");

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    parseCommand(input.value);
    input.value = "";
  }
});

document.addEventListener("paste", e => {
  for (const item of e.clipboardData.items) {
    if (item.type.startsWith("image")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(item.getAsFile());
      img.style.maxWidth = "200px";
      chat.appendChild(img);
    }
  }
});

function parseCommand(text) {
  const args = text.match(/"[^"]+"|\S+/g);
  if (!args) return;

  switch (args[0]) {
    case "/message":
      addMessage(args[1], args[2]);
      break;

    case "/chat_name":
      title.textContent = strip(args[1]);
      break;

    case "/user_is_typing":
      showTyping(strip(args[1]), Number(args[2]));
      break;

    case "/user_added":
    case "/user_removed":
    case "/user_left":
      systemMessage(`${strip(args[1])} ${args[0].replace("/user_", "").replace("_", " ")}`);
      break;

    case "/clear_chat":
      chat.innerHTML = "";
      break;

    case "/play_script":
      playScript(strip(args[1]), Number(args[2]) || 1);
      break;
  }
}

function addMessage(userArg, msgArg) {
  const userKey = strip(userArg).toLowerCase();
  const msg = strip(msgArg);

  if (!users[userKey]) {
    systemMessage(`Unknown user: ${strip(userArg)}`);
    return;
  }

  const div = document.createElement("div");
  div.className = "message";

  const img = document.createElement("img");
  img.className = "avatar";
  img.src = USER_DIR + users[userKey];

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<div class="name">${strip(userArg)}</div>${msg}`;

  div.append(img, bubble);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function systemMessage(text) {
  const div = document.createElement("div");
  div.className = "system";
  div.textContent = text;
  chat.appendChild(div);
}

function showTyping(name, seconds) {
  typing.textContent = `${name} is typing…`;
  setTimeout(() => typing.textContent = "", seconds * 1000);
}

function strip(s) {
  return s ? s.replace(/"/g, "") : "";
}

/* ============================
   SCRIPT PLAYBACK
   ============================ */

async function playScript(filename, delaySeconds) {
  if (isPlayingScript) return;
  isPlayingScript = true;

  try {
    const res = await fetch(filename);
    const text = await res.text();

    // JSON script
    if (filename.endsWith(".json")) {
      const steps = JSON.parse(text);
      for (const step of steps) {
        if (step.typing) {
          showTyping(step.typing.user, step.typing.seconds);
        }
        if (step.command) {
          parseCommand(step.command);
        }
        await wait(step.delay ?? delaySeconds);
      }
    }

    // TXT script
    else {
      const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l && !l.startsWith("#"));

      for (const line of lines) {
        parseCommand(line);
        await wait(delaySeconds);
      }
    }
  } catch (err) {
    systemMessage(`Failed to play script: ${filename}`);
  }

  isPlayingScript = false;
}

function wait(seconds) {
  return new Promise(res => setTimeout(res, seconds * 1000));
}
