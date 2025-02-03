document.addEventListener("DOMContentLoaded", function () {
  const chatHeader = document.querySelector(".main header h2");
  const chatImage = document.querySelector(".main header img:first-child");
  const chatStatus = document.querySelector(".main header h3");
  const chatMessages = document.getElementById("chat");
  const listUsers = document.getElementById("list");
  const footMsg = document.querySelector(".footer")

  // User Data (name, image, status, messages, and read status)
  const userData = {
    "Ayoub Mh": {
      img: "css/messi.jpeg",
      status: { color: "orange", text: "offline" },
      messages: [
        { sender: "Ayoub", time: "10:00AM", text: "Hey! How's it going?", type: "you", read: false },
        { sender: "Me", time: "10:02AM", text: "All good! What about you?", type: "me", read: true }
      ]
    },
    "Imad": {
      img: "css/default-profile.jpg",
      status: { color: "green", text: "online" },
      messages: [
        { sender: "Imad", time: "11:00AM", text: "Are you coming today?", type: "you", read: false },
        { sender: "Me", time: "11:05AM", text: "Yes! I'll be there at noon.", type: "me", read: true }
      ]
    }
  };

  // Function to clear chat interface (before selecting a user)
  function resetChatUI() {
    chatHeader.textContent = "";
    chatImage.src = "css/01chat.png";
    chatStatus.textContent = "";
    chatMessages.innerHTML = "";
    footMsg.innerHTML = "";

  }

  // Populate user list dynamically
  function renderUserList() {
    listUsers.innerHTML = Object.keys(userData)
      .map(
        (name) => `
        <li data-user="${name}">
          <img src="${userData[name].img}" style="width: 55px;height: 55px;">
          <div>
            <h2>${name}</h2>
            <h3>
              <span class="status ${userData[name].status.color}"></span>
              ${userData[name].status.text}
            </h3>
          </div>
        </li>`
      )
      .join("");

    // Attach event listeners after rendering users
    attachUserClickEvents();
  }

  // Function to handle user selection
  function attachUserClickEvents() {
    document.querySelectorAll("#list li").forEach((user) => {
      user.addEventListener("click", function () {
        const userName = this.dataset.user;
        const userInfo = userData[userName];

        if (!userInfo) return; // Skip if user not found

        // Update chat header
        chatHeader.textContent = `Chat with ${userName}`;
        chatImage.src = userInfo.img;

        // Update status dynamically
        chatStatus.innerHTML = `<span class="status ${userInfo.status.color}"></span> ${userInfo.status.text}`;

        footMsg.innerHTML = `<textarea placeholder="Type your message"></textarea>
          <a href="#">Send</a>`;

        // Mark all received messages as read
        userInfo.messages.forEach((msg) => {
          if (msg.type === "you") msg.read = true;
        });

        // Update chat messages
        chatMessages.innerHTML = userInfo.messages
          .map(
            (msg) => `
            <li class="${msg.type}">
              <div class="entete">
                <h3>${msg.time}</h3>
                <h2>${msg.sender}</h2>
                <span class="status ${msg.read ? "blue" : "gray"}"></span>
              </div>
              <div class="triangle"></div>
              <div class="message">${msg.text}</div>
            </li>`
          )
          .join("");
      });
    });
  }

  // Initial setup
  resetChatUI(); // Ensure chat is empty initially
  renderUserList(); // Populate the user list
});
