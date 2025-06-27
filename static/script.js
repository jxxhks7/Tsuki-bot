document.addEventListener("DOMContentLoaded", () => {
  // 🧠 UTILITIES
  const saveChatToStorage = () => {
    localStorage.setItem(`chatHistory_${currentCharacter}`, JSON.stringify(chatHistory));
  };

  const loadChatFromStorage = () => {
    const stored = localStorage.getItem(`chatHistory_${currentCharacter}`);
    return stored ? JSON.parse(stored) : [];
  };

  const saveCurrentCharacter = () => {
    localStorage.setItem("selectedCharacter", currentCharacter);
  };

  const loadLastCharacter = () => {
    return localStorage.getItem("selectedCharacter") || "Tsuki";
  };

  // 🎵 Music Controls
  const bgMusic = document.getElementById("bg-music");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const nextTrackBtn = document.getElementById("next-track-btn");
  const backTrackBtn = document.getElementById("back-track-btn");

  const timeMarkers = [0, 74, 148, 222, 295, 385, 458, 533, 606, 681, 755, 868, 983, 1103, 1211, 1335, 1512, 1625, 1700, 1814];
  let currentTrackIndex = 0;
  let isPlaying = false;

  function playCurrentTrack() {
    bgMusic.currentTime = timeMarkers[currentTrackIndex];
    bgMusic.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸ Pause";
  }

  function pauseTrack() {
    bgMusic.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶ Play";
  }

  playPauseBtn.addEventListener("click", () => isPlaying ? pauseTrack() : playCurrentTrack());
  nextTrackBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % timeMarkers.length;
    playCurrentTrack();
  });
  backTrackBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + timeMarkers.length) % timeMarkers.length;
    playCurrentTrack();
  });

  // 🌸 Chat Logic
  const characterGif = document.getElementById("character-gif");
  const dropMsg = document.getElementById("drop-message");
  const foods = document.querySelectorAll(".food");
  const characterSelect = document.getElementById("character-select");
  const chatLog = document.getElementById("chat-log");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "⎙ Save";
  saveBtn.style.marginLeft = "10px";

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "⟲ Clear";

  document.querySelector(".chat-input-area").append(saveBtn, clearBtn);

  let currentCharacter = loadLastCharacter();
  characterSelect.value = currentCharacter;

  const characterNormalGIFs = {
    Tsuki: "/static/assets/gifs/tsuki.gif",
    Moca: "/static/assets/gifs/moca.gif",
    Chi: "/static/assets/gifs/chi.gif",
    Yori: "/static/assets/gifs/yori.gif",
    Rosemary: "/static/assets/gifs/rosemary.gif",
    Momo: "/static/assets/gifs/momo.gif",
    Dawn: "/static/assets/gifs/dawn.gif",
    Mermaid: "/static/assets/gifs/mermaid.gif"
  };

  const characterEatingGIFs = {
    Tsuki: {
      chocolatebun: "/static/assets/gifs/tsuki-chocolatebun.gif",
      chips: "/static/assets/gifs/tsuki-eating.gif",
      tea: "/static/assets/gifs/tsuki-tea.gif",
      noodles: "/static/assets/gifs/tsuki-noodles.gif"
    },
    Moca: {
      chips: "/static/assets/gifs/moca-eating-chips.gif",
      chocolatebun: "/static/assets/gifs/moca-eating-carrot.gif"
    }
  };

  const characterFoodResponses = {
    "Tsuki_chocolatebun": "Tsuki munches softly: Mmm... I love simple things like this.🍩",
    "Tsuki_noodles": "Tsuki slurps: Noodles are the best invention in the world! 🍜",
    "Tsuki_tea": "Tsuki sips: Ahh... this tea is warm and calming, just like moonlight. 🌙",
    "Tsuki_chips": "Tsuki munches: Nothing compares to a new bag of carrot chips! 🍟",
    "Moca_chips": "Moca smirks: Now that’s more like it. Don't touch my chips.",
    "Moca_carrot": "Moca blinks: This isn't chips, but I suppose it'll do.",
    "Chi_onigiri": "Chi beams: This is so nostalgic... thank you! 🍙",
    "Momo_tea": "Momo twirls: Tea time is the best time ☕~",
    "Yori_carrot": "Yori bows: Grateful for the fresh harvest 🥕",
    "Rosemary_carrot": "Rosemary: Useful for herbal remedies too! Thank you, dear.",
    "Dawn_carrot": "Dawn mumbles: Meh. I’ll eat it... later.",
    "Mermaid_carrot": "Mermaid giggles: A land snack? Delightful~ 🌊"
  };

  const characterIntros = {
    Tsuki: "Oh! Hello there... it’s so lovely to see you under this gentle moonlight. 🌸",
    Moca: "Hmph. You're here? Not that I was waiting or anything… baka.",
    Chi: "Greetings, traveler. The winds carry peace to those who listen.",
    Yori: "Ah, a welcome customer! Please, browse freely.",
    Rosemary: "Hello, dear. Let me brew you a calming tea with some chamomile~",
    Momo: "Yaaay! You're here!! Let’s chat chat chat!! 🍵✨",
    Dawn: "...um... hi... I was just... sitting here...",
    Mermaid: "Ahh... a visitor from land? How curious. Welcome to the tides of wonder~"
  };

  let chatHistory = loadChatFromStorage();

  const renderChatHistory = () => {
    chatLog.innerHTML = "";
    chatHistory.forEach(({ role, content }) => {
      const div = document.createElement("div");
      div.className = "message";
      div.innerHTML = `<strong>${role === "user" ? "You" : currentCharacter}:</strong> ${content}`;
      chatLog.appendChild(div);
    });
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  function ensureIntro() {
    if (chatHistory.length === 0 && characterIntros[currentCharacter]) {
      chatHistory.push({ role: "assistant", content: characterIntros[currentCharacter] });
      saveChatToStorage();
    }
  }

  characterGif.src = characterNormalGIFs[currentCharacter];
  ensureIntro();
  renderChatHistory();

  function addMessage(sender, message, animated = false) {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<strong>${sender}:</strong> ${animated ? `<span class="typing">${message}</span>` : message}`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage("You", text);
    chatHistory.push({ role: "user", content: text });
    userInput.value = "";

    fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        character: currentCharacter,
        history: chatHistory
      })
    })
    .then(res => res.json())
    .then(data => {
      const reply = data.reply;
      addMessage(currentCharacter, reply, true);
      chatHistory.push({ role: "assistant", content: reply });
      saveChatToStorage();

      localStorage.setItem(`chatLastMessage_${currentCharacter}`, JSON.stringify({
        content: reply,
        timestamp: Date.now(),
        read: false
      }));
    })
    .catch(err => {
      console.error(err);
      addMessage(currentCharacter, "Oops! Something went wrong 😴");
    });
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  // Character Switching
  characterSelect.addEventListener("change", () => {
    saveChatToStorage();
    currentCharacter = characterSelect.value;
    saveCurrentCharacter();
    chatHistory = loadChatFromStorage();
    characterGif.src = characterNormalGIFs[currentCharacter];
    ensureIntro();
    renderChatHistory();
  });

  // 🍽️ Food Drop
  foods.forEach(food => {
    food.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", food.dataset.food);
    });
  });

  characterGif.addEventListener("dragover", e => e.preventDefault());

  characterGif.addEventListener("drop", e => {
    e.preventDefault();
    const foodType = e.dataTransfer.getData("text/plain");
    const responseKey = `${currentCharacter}_${foodType}`;
    const response = characterFoodResponses[responseKey] || `${currentCharacter} munches on the ${foodType}. Yum!`;

    dropMsg.textContent = response;
    dropMsg.style.display = "block";
    setTimeout(() => dropMsg.style.display = "none", 8000);

    const eatingGif = characterEatingGIFs[currentCharacter]?.[foodType];
    const idleGif = characterNormalGIFs[currentCharacter];

    if (eatingGif) {
      characterGif.src = eatingGif;
      setTimeout(() => characterGif.src = idleGif, 8000);
    }

    addMessage(currentCharacter, response, true);
    chatHistory.push({ role: "assistant", content: response });
    saveChatToStorage();
  });

  // 💾 Save Button
  saveBtn.addEventListener("click", () => {
    chatHistory = [];
    const messages = chatLog.querySelectorAll(".message");
    messages.forEach(msg => {
      const isUser = msg.innerHTML.includes("<strong>You:</strong>");
      const content = msg.innerHTML.split("</strong> ")[1];
      chatHistory.push({ role: isUser ? "user" : "assistant", content });
    });
    saveChatToStorage();
    saveBtn.textContent = "✅ Saved!";
    setTimeout(() => {
      saveBtn.textContent = "💾 Save";
    }, 1500);
  });

  // 🗑️ Clear Button
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(`chatHistory_${currentCharacter}`);
    chatHistory = [];
    if (characterIntros[currentCharacter]) {
      chatHistory.push({ role: "assistant", content: characterIntros[currentCharacter] });
    }
    saveChatToStorage();
    renderChatHistory();
  });

  // ✨ Fireflies
  const container = document.getElementById("floating-particles");
  function createFirefly() {
    const firefly = document.createElement("div");
    firefly.classList.add("firefly");
    firefly.style.left = `${Math.random() * 100}vw`;
    firefly.style.top = `${Math.random() * 100}vh`;
    container.appendChild(firefly);
    setTimeout(() => firefly.remove(), 6000);
  }
  setInterval(createFirefly, 300);
});
