export{validinfos,logout, getInfoData, fetchComments, loadComments, loadPosts, loadaddPost, sendRegisterinfo, sendlogininfo, serveHome, addcomment, info, Removecard, createSidebar, loadMessages, Handledisplaymsgs, scrollToBottom, popup }
import { Hanldews} from "./ws.js";
import { sidebarhtml, othermsg, mymsg } from "./components.js"
import { ls, createPost, postin } from "./post.js"
import { createCard } from "../script.js"

var info = {};
function validinfos(user, action) {
    const isValidLength = (str, min, max) => str.length >= min && str.length <= max;
    const validateEmail = (email) => isValidLength(email, 5, 50);
    const validatePassword = (password) => isValidLength(password, 5, 30);
      const { username, age, gender, firstname, lastname, email, password } = user;
    if (action === "login") {
      return validateEmail(email) && validatePassword(password);
    }
    if (action === "register") {
      if (!username || !age || !gender || !firstname || !lastname || !email || !password) {
        return false;
      }
      return (
        validateEmail(email) &&
        validatePassword(password) &&
        isValidLength(username, 3, 15) &&
        isValidLength(firstname, 3, 15) &&
        isValidLength(lastname, 3, 15) &&
        age >= 12 && age <= 100 &&
        (gender === "male" || gender === "female")
      );
    }
    return false;
}
async function logout() {
    await apiCall("logout");
    document.querySelector(".container").innerHTML = ""
    createCard()
  }
async function loadPosts(startId) {
    const { Posts: posts } = await fetchPosts(startId);
    if (!posts) return "no posts";
    if (posts.length === 0) return "baraka elik";
    return posts;
  }
async function getInfoData(socket) {
    const { authorize } = await apiCall("info").then(async res => info = await res.json());
    if (authorize) await Hanldews(socket);
  }
async function fetchComments(postId, commentId) {
    return await apiCall(`post/${postId}/comments/${commentId}`).then(res => res.json());
  }
async function loadComments(postId, commentId) {
    const { Comments: comments } = await fetchComments(postId, commentId);
    return comments && comments.length ? comments : "baraka elik";
  }
async function loadaddPost(title, content, categories) {
    const response = await apiCall("post", "POST", { title, categories, content});
    if (!response.ok) popup("Invalid post format", "warning");
    return response.ok;
  }
  async function sendRegisterinfo(user) {
    try {
      await apiCall("signup", "POST", user);
      document.querySelector(".card").classList.remove("flipped");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }
  async function sendlogininfo(user) {
    let isSubmitting = false
    try {
      isSubmitting = true
      const response = await apiCall("login", "POST", user);
      await getInfoData();
      serveHome();
    } catch (error) {
      popup(error.message, "warning");
    } finally {
      isSubmitting = false;
    }
  }
  async function serveHome() {
    Removecard();
    if (!document.querySelector(".sidebar")) createSidebar();
    let posts = await loadPosts(ls.lastpost);
    if (posts !== "no posts") {
      posts.forEach(createPost);
      ls.lastpost = posts[posts.length - 1].id;
    } else {
      const ps = document.createElement("div");
      ps.classList.add("posts-section");
      ps.appendChild(postin());
      document.querySelector(".container").appendChild(ps);
    }
  }
  async function fetchPosts(startId) {
    const response = await fetch(`/api/post/?start-id=${startId}`);
    return await response.json();
  }
  async function addcomment(content, postId) {
    const response = await apiCall("comment", "POST", { content, postId });
    if (!response.ok) popup("Invalid comment format", "warning");
    return response.ok;
  }
async function apiCall(endpoint, method = "GET", body = null) {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(`/api/${endpoint}`, options);
    if (!response.ok) throw new Error(response.statusText);
    return response;
  }
const FADE_DUR = 500;
const DISPLAY_DUR = 3000;
let popupContain;
function popup(message, extraClasses) {
  if (!popupContain) {
    popupContain = document.createElement("div");
    popupContain.classList.add("popupContain");
    document.body.appendChild(popupContain);
  }

  const EL = document.createElement("div");
  EL.classList.add("popup", extraClasses);
  EL.innerText = message;
  popupContain.prepend(EL);

  setTimeout(() => EL.classList.add("open"), 10);
  setTimeout(() => EL.classList.remove("open"), DISPLAY_DUR);
  setTimeout(() => popupContain.removeChild(EL), DISPLAY_DUR + FADE_DUR);
}
function Removecard() {
  let card = document.querySelector(".Form") || null;
  if (card != null) {
    card.remove();
  }
}
function createSidebar() {
  const sidebar = document.createElement("div");
  sidebar.classList.add("sidebar");
  sidebar.innerHTML = sidebarhtml(info.username);
  document.querySelector(".container").appendChild(sidebar);
  let logoutbtn = document.querySelector(".LO");
  logoutbtn.addEventListener("click", function () {
    logout();
  });
 
  let homebtn = document.querySelector(".Home");
  homebtn.addEventListener("click", function () {
    let chat = document.querySelector(".chat");
    chat.style.width = "";
    let chatcard = document.querySelector(".card-container");
    if (chatcard) {
      chatcard.remove();
    }

    let inp = document.querySelector(".post.beta");
    if (!inp) {
      
      loadPosts(0).then((posts) => {
        let ps = document.createElement("div");
        ps.classList.add("posts-section");
        ps.appendChild(postin());
        document.querySelector(".container").appendChild(ps);
        if (posts != "no posts") {
          for (let post in posts) {
            createPost(posts[post]);
          }
          ls.lastpost = posts[posts.length - 1].id;
        }
      });
    }
  });

  let chat = document.querySelector(".chat");

  if (chat) {
    chat.style.display = "flex";
  }
}
async function loadMessages(userId, offset) {
  const response = await fetch(`/api/msg?user_id=${userId}&offset=${offset}`);
  if (response.status == 204) {
    popup("no messages", "warning");
  } else {
    const msgs = await response.json();
    return msgs.messages;
  }
}
function Handledisplaymsgs(msgs, msgcontainer, rec) {
  if (Array.isArray(msgs)) {
    msgs.forEach((msg) => {
      console.log(msg)
      let msghtml;
      if (msg.sender == rec || rec == 22) {
        msghtml = document
          .createRange()
          .createContextualFragment(othermsg(msg));
      } else {
        msghtml = document.createRange().createContextualFragment(mymsg(msg));
      }
      if (rec == 22  || !rec) {
        msgcontainer.appendChild(msghtml);
      } else {
        msgcontainer.prepend(msghtml);
      }
    });
  }
  scrollToBottom();
}
function scrollToBottom() {
  let msgContainer = document.querySelector(".messages-container");
  msgContainer.scrollTop = msgContainer.scrollHeight;
}
