import {
  frontcard,
  backcard,
}
from "/ui/js/js/components.js";
import{
  ls,
  createPost
}
from"/ui/js/js/post.js"
import{
  validinfos,
  getInfoData,
  sendlogininfo,
  info,
  Removecard,
  createSidebar,
  loadPosts,
  sendRegisterinfo
}from"/ui/js/js/helpers.js"
import { socket } from "./js/ws.js";
export{ isSubmitting, socket, createCard }
let isSubmitting  = false;
await getInfoData();

document.querySelectorAll(".comment").forEach((element) => {
  element.addEventListener("click", () => {
    element.classList.toggle("active");
  });
});
function createCard() {
  const card = document.createElement("div");
  card.classList.add("card");
  // Front side (Login Form)
  const frontSide = document.createElement("div");
  frontSide.classList.add("card-side", "front");
  frontSide.innerHTML = frontcard;
  // Back side (Register Form)
  const backSide = document.createElement("div");
  backSide.classList.add("card-side", "back");
  backSide.innerHTML = backcard;
  card.appendChild(frontSide);
  card.appendChild(backSide);
  let container = document.querySelector(".container");
  // Append the card to the page
  let form = document.createElement("div");
  form.classList.add("Form");
  form.appendChild(card);
  container.appendChild(form);

  document
    .querySelector("#switch-to-register")
    .addEventListener("click", () => {
      card.classList.add("flipped");
    });

  document.querySelector("#switch-to-login").addEventListener("click", () => {
    card.classList.remove("flipped");
  });
  frontSide
    .querySelector("form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!isSubmitting) {
        isSubmitting = true;
        try {
          // Handle Login Form
          if (e.target.id === "login-form") {
            const email = e.target.querySelector("#login-id").value;
            const password = e.target.querySelector("#login-password").value;

            if (validinfos({ email, password }, "login")) {
              await sendlogininfo({ email, password });
            }
          }
        } finally {
          isSubmitting = false;
        }
      }
    });
  backSide.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = e.target.querySelector("#nickname").value;
    const age = e.target.querySelector("#age").value;
    const gender = e.target.querySelector("#gender").value;
    const firstname = e.target.querySelector("#first-name").value;
    const lastname = e.target.querySelector("#last-name").value;
    const email = e.target.querySelector("#email").value;
    const password = e.target.querySelector("#password").value;
    if (
      validinfos(
        { username, age, gender, firstname, lastname, email, password },
        "register"
      )
    ) {
      await sendRegisterinfo({
        username,
        age: +age,
        gender,
        firstname,
        lastname,
        email,
        password,
      });
    }
  });
  return card;
}
async function servehome() {
  Removecard();
  if (!document.querySelector(".sidebar")) {
    createSidebar();
  }
  loadPosts(ls.lastpost).then((posts) => {
    if (posts != "no posts") {
      for (let post in posts) {
        createPost(posts[post]);
      }
      ls.lastpost = posts[posts.length - 1].id;
    } else {
      let ps = document.createElement("div");
      ps.classList.add("posts-section");
      ps.appendChild(postin());
      document.querySelector(".container").appendChild(ps);
    }
  });
}
(async function () {
  if (!info.authorize) {
    createCard();
  } else {
    servehome();
  }
})();
