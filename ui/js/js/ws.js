export { Hanldews, socket }
import { chathtml, loader } from "./components.js";
import { loadMessages, Handledisplaymsgs, scrollToBottom, info, popup } from "./helpers.js"
let socket = {}
async function Hanldews(info) {
   socket =  Initws()
   socket.addEventListener("message",async  (event) => {
    let data = Getwsdata(event)
    if (Array.isArray(data)) {
        let chat = Createchat()
        let ul = chat.querySelector("ul");
        initializeChat(data,ul,info,socket)
    } else {
        handleSignal(data)
    }
  })
}
function Initws(){
   let  socket = new WebSocket("ws://localhost:8081/api/ws");
    socket.onopen = () => {
      console.log("WebSocket connection established!");
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return socket
}
function Getwsdata(event){
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error("Invalid JSON received:", event.data);
      return;
    }
    return data || null
}
function Createchat(){
    let chat = document.querySelector(".chat");
    if (!chat) {
      chat = document.createElement("div");
      chat.classList.add("chat");
      chat.style.display = "none";
      chat.innerHTML = chathtml("");
      let ctr = document.querySelector(".container")
      let pst = document.querySelector(".posts-section")
      ctr.insertBefore(chat,pst)
      let chatcard = document.querySelector(".card-container");
      if (chatcard) {
        chatcard.remove();
      }
    }
    let ul = chat.querySelector("ul");
    if (!ul) {
      ul = document.createElement("ul");
      chat.appendChild(ul);
    }
    ul.innerHTML = ""
    return chat
}
function createUserListItem(user) {
    const userElement = document.createElement("li");
    userElement.id = user.username;
    userElement.textContent = user.username;
    userElement.classList.add("chat-user");
    
    if (user.state) {
      userElement.classList.add("online");
    }
    
    return userElement;
  }
  function clearExistingChat() {
    const posts = document.querySelector(".posts-section");
    if (posts) {
      posts.remove();
    }
    
    const chat = document.querySelector(".chat");
    chat.style.width = "100%";
    
    const chatcard = document.querySelector(".card-container");
    if (chatcard) {
      chatcard.remove();
    }
    
    return chat;
  }
  function createChatCard(username) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = chathtml(username);
    return tempDiv.firstElementChild;
  }
  function initializeChatHeader(username) {
    const chatHeader = document.querySelector(".text-chat");
    chatHeader.innerHTML = `Chat With ${username}`;
    chatHeader.id = username;
  }
  async function initializeMessageContainer(username) {
    const msgContainer = document.querySelector(".messages-container");
    msgContainer.innerHTML = "";
    const msgs = await loadMessages(username, 0);
    
    if (msgs != null) {
      Handledisplaymsgs(msgs, msgContainer, username);
      return msgs[msgs.length - 1].id;
    }
    return 0;
  }
  function setupInfiniteScroll(msgContainer, username, initialOffset) {
    let offset = initialOffset;
    let isLoading = false;
    
    msgContainer.addEventListener("scroll", async function() {
      if (msgContainer.scrollTop < 20 && !isLoading) {
        isLoading = true;
        const msgs = await loadMessages(username, offset);
        
        if (msgs != null) {
          Handledisplaymsgs(msgs, msgContainer, username);
          offset = msgs[msgs.length - 1].id;
        }
        isLoading = false;
      }
    });
  }
  function setupChatButton(userElement, ul) {
    const chatBtn = document.querySelector(".button-send");
    if (!chatBtn) {
      console.error("No chat button found!");
      return;
    }
    
    chatBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const recipient = document.querySelector(".text-chat").id;
      if (recipient === "") return;
      
      const messageInput = document.querySelector(".message-send");
      const msg = messageInput.value;
      const now = new Date();
      const formattedDate = now.toISOString()
      if (msg.trim().length === 0) return;
      const message = {
        type: "message",
        sender: info.username,
        timestamp: formattedDate,
        recipient: recipient.toString(),
        content: msg
      };
      socket.send(JSON.stringify(message));
      messageInput.value = "";
      
      const msgContainer = document.querySelector(".messages-container");
      Handledisplaymsgs([message], msgContainer);
      scrollToBottom();
      ul.insertBefore(userElement, ul.firstChild);
    });
  }
  async function handleUserClick(user, userElement, ul, info, socket) {
    const chat = clearExistingChat();
    const newChatCard = createChatCard(user.username);
    chat.appendChild(newChatCard);
    
    initializeChatHeader(user.username);
    const offset = await initializeMessageContainer(user.username);
    
    const msgContainer = document.querySelector(".messages-container");
    setupInfiniteScroll(msgContainer, user.username, offset);
    
    Typing(document.querySelector(".message-send"), document.querySelector(".text-chat").id);
    setupChatButton(userElement, ul, info, socket);
  }
  function initializeChat(data, ul, info, socket) {
    data.forEach((user) => {
      const userElement = createUserListItem(user);
      ul.appendChild(userElement);
      
      userElement.addEventListener("click", () => {
        handleUserClick(user, userElement, ul, info, socket);
      });
    });
    
    const chat = document.querySelector(".chat");
    chat.style.display = "flex";
  }
 async function handleUserOffline(userId) {
    let ul = document.querySelector("ul")
    if (!ul){
      await fetch("/api/getuser")
    }else{
    const user = ul.querySelector(`#${userId}`);
    if (user) {
      user.classList = ["chat-user"];
    }
  }
  }
  async function handleUserOnline(userId) {
    const userList = document.querySelector("ul");
    let user = userList.querySelector(`#${userId}`);
    
    if (!user) {
      user = createNewUser(userId);
      userList.appendChild(user);
    }
    
    user.classList.add("online");
    await fetch("/api/getuser");
  }
  function createNewUser(userId) {
    const user = document.createElement("li");
    user.id = userId;
    user.textContent = userId;
    user.classList.add("chat-user");
    return user;
  }
  function handleMessage(data) {
    popup(`${data.sender} sent a message`, "success");
    
    const chat = findUserChat(data.sender);
    if (chat) {
      Handledisplaymsgs([data], chat, 22);
    }
    let ul = document.querySelector("ul") || null
    if (ul != null){
      let userElement = document.querySelector(`#${data.sender}.chat-user`)
      ul.insertBefore(userElement, ul.firstChild)
    } 
  }
  function findUserChat(senderId) {
    const chatHeader = document.querySelector(`#${senderId}.text-chat`);
    if (!chatHeader) return null;
    
    return chatHeader.parentElement.nextElementSibling.querySelector(".messages-container");
  }
  function handleTyping(sender) {
    let user = document.querySelector(`li#${sender}`)
    let load = user.querySelector(".loader")
    if (!load){
      let loaderelement = loader()
      console.log(loaderelement)
      user.appendChild(loaderelement)
      setTimeout(function() {
        load = user.querySelector(".loader")
        load.remove()
   }, 2000);
  }
  }
  async function handleSignal(data) {
    if (data != null){
    switch (data.type) {
      case "signal-off":
        await handleUserOffline(data.content);
        break;
        
      case "signal-on":
        await handleUserOnline(data.content);
        break;
        
      case "message":
        handleMessage(data);
        break;
        
      case "signal-typing":
        handleTyping(data.sender);
        break;
        
      default:
        console.warn(`Unknown signal type: ${data.type}`);
    }
  }
  }
  function Typing(input, user){
    let isTyping = false
     input.addEventListener("input", function(){
      if (!isTyping){
        isTyping = true
        const message = {
          type: "signal-typing",
          sender: info.username,
          recipient: user,
        };
        socket.send(JSON.stringify(message))
      setTimeout(function() {
           isTyping = false
      }, 2000);
    }
  });
  }