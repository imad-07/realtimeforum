import {sidebarhtml, frontcard, backcard, commenthtml, commentdivhtml, postdivhtml, chathtml, mymsg, othermsg} from "/ui/js/components.js";
var info = {}
let socket
await getInfoData().then(i =>{
  info = i
})
let num = 0
let loading = false; 
let isSubmitting = false;
function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.classList.add('sidebar');
  sidebar.innerHTML = sidebarhtml(info.username)
    document.querySelector(".container").appendChild(sidebar);
    let logoutbtn = document.querySelector(".LO")
    logoutbtn.addEventListener('click',function(){
  logout()
})
let homebtn = document.querySelector(".Home")
homebtn.addEventListener('click',function(){
  let c = document.querySelector(".chat"); c ? c.style.display = "none": null
  let inp = document.querySelector(".post.beta")
  if (!inp){
  loadPosts(0).then(posts => {
    num = 1
    let ps = document.createElement("div")
    ps.classList.add("posts-section")
    ps.appendChild(postin())
    document.querySelector(".container").appendChild(ps)
    if (posts != "no posts"){
   for (let post in posts){
     createPost(posts[post])
    }
  }
  })
}
})
let chatbtn = document.querySelector(".Chat")
chatbtn.addEventListener('click',function(){
  let p = document.querySelector(".posts-section"); p ? p.remove(): null
  let chat = document.querySelector(".chat")
  if (chat){
  chat.style.display = "flex"
  }
})
  };
  document.querySelectorAll('.like, .dislike, .comment').forEach((element) => {
    element.addEventListener('click', () => {
      element.classList.toggle('active');
    });
  });
function Removecard(){
  let card = document.querySelector(".Form") || null
  if (card != null){
    card.remove()
  }
}
function createCard() {
  const card = document.createElement('div');
  card.classList.add('card');
  // Front side (Login Form)
  const frontSide = document.createElement('div');
  frontSide.classList.add('card-side', 'front');
  frontSide.innerHTML = frontcard;
  // Back side (Register Form)
  const backSide = document.createElement('div');
  backSide.classList.add('card-side', 'back');
  backSide.innerHTML = backcard;
  card.appendChild(frontSide);
  card.appendChild(backSide);
  let container = document.querySelector(".container")
  // Append the card to the page
  let form = document.createElement("div")
  form.classList.add("Form")
  form.appendChild(card)
  container.appendChild(form);
  
  document.querySelector("#switch-to-register").addEventListener('click', () => {
  card.classList.add('flipped');
  });

  document.querySelector("#switch-to-login").addEventListener('click', () => {
  card.classList.remove('flipped');
  });
  frontSide.querySelector('form').addEventListener("submit",async function(e){
     e.preventDefault()
    if (!isSubmitting){
     isSubmitting = true;
     try {
       // Handle Login Form
       if (e.target.id === 'login-form') {
         const email = e.target.querySelector('#login-id').value;
         const password = e.target.querySelector('#login-password').value;

         if (validinfos({ email, password }, "login")) {
           await sendlogininfo({ email, password });
         }
       }
     } finally {
       isSubmitting = false;
     }
   }
  })
  backSide.querySelector('form').addEventListener("submit", async function(e){
      e.preventDefault()
      const username = e.target.querySelector('#nickname').value;
      const age = e.target.querySelector('#age').value;
      const gender = e.target.querySelector('#gender').value;
      const firstname = e.target.querySelector('#first-name').value;
      const lastname = e.target.querySelector('#last-name').value;
      const email = e.target.querySelector('#email').value;
      const password = e.target.querySelector('#password').value;
      if (validinfos({ username, age, gender, firstname, lastname, email, password }, "register")) {
      await sendRegisterinfo({ username, age: +age, gender, firstname, lastname, email, password });
      }
  })
  return card;
}
function createcomment(Comment, container) {
  // Create the main comment container
  const comment = document.createElement('div');
  comment.classList.add('comment');
  comment.id = Comment.id;
  // Set innerHTML to reduce DOM operations
  comment.innerHTML = commenthtml(Comment);
  // Append the comment to the container
  container.appendChild(comment);
}
function commentin(username) {
  // Create the main comment div
  let commentDiv = document.createElement("div");
  commentDiv.classList.add("coment", "input");
  // Set innerHTML to reduce DOM operations
  commentDiv.innerHTML = commentdivhtml(username);
  return commentDiv;
}
function postin() {
  const categories = ['football', 'cars', 'ronaldo'];
  const postDiv = document.createElement('div');
  postDiv.classList.add('post', 'beta');
  // Generate category checkboxes dynamically
  const categoryHTML = categories.map(category => `
    <label class="categorie">
      <input type="checkbox" name="${category}" value="${category}">
      ${category.charAt(0).toUpperCase() + category.slice(1)}
    </label>
  `).join('');

  postDiv.innerHTML = postdivhtml(categoryHTML);
  return postDiv;
}
function createPost(Post) {
  // Create the main post container
  const post = document.createElement('div');
  post.classList.add('post');

  // Create the user info section
  const userInfo = document.createElement('div');
  userInfo.classList.add('user-info');

  const avatar = document.createElement('img');
  avatar.src = '/ui/css/default-profile.jpg';
  avatar.alt = 'User Avatar';
  avatar.classList.add('avatar');

  const userDetails = document.createElement('div');
  userDetails.classList.add('user-details');

  const username = document.createElement('h4');
  username.classList.add('username');
  username.textContent = Post.author;

  const timestamp = document.createElement('p');
  timestamp.classList.add('timestamp');
  timestamp.textContent = Post.date;

  userDetails.appendChild(username);
  userDetails.appendChild(timestamp);
  userInfo.appendChild(avatar);
  userInfo.appendChild(userDetails);

  const posttitle = document.createElement('p');
  posttitle.classList.add('post-title');
  posttitle.textContent = Post.title;

  // Create the post content
  const postContent = document.createElement('p');
  postContent.classList.add('post-content');
  postContent.textContent = Post.content;

  // Create the post actions section
  const postActions = document.createElement('div');
  postActions.classList.add('post-actions');

  // Like button and notification
  const like = document.createElement('div');
  like.classList.add('like');

  const likeButton = document.createElement('button');
  const likeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  likeSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  likeSvg.setAttribute('height', '20px');
  likeSvg.setAttribute('viewBox', '0 -960 960 960');
  likeSvg.setAttribute('width', '20px');
  likeSvg.setAttribute('fill', '#707C97');
  const likePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  likePath.setAttribute('d', 'M720-144H264v-480l288-288 32 22q17 12 26 30.5t5 38.5l-1 5-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906-467L786.93-187.8Q778-168 760-156t-40 12Zm-384-72h384l120-279v-57H488l49-243-201 201v378Zm0-378v378-378Zm-72-30v72H120v336h144v72H48v-480h216Z');
  likeSvg.appendChild(likePath);
  likeButton.appendChild(likeSvg);

  const likeNotification = document.createElement('span');
  likeNotification.classList.add('notification-icon');
  likeNotification.textContent = Post.likes;

  like.appendChild(likeButton);
  like.appendChild(likeNotification);

  // Dislike button and notification
  const dislike = document.createElement('div');
  dislike.classList.add('dislike');

  const dislikeButton = document.createElement('button');
  const dislikeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  dislikeSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  dislikeSvg.setAttribute('height', '20px');
  dislikeSvg.setAttribute('viewBox', '0 -960 960 960');
  dislikeSvg.setAttribute('width', '20px');
  dislikeSvg.setAttribute('fill', '#707C97');
  const dislikePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  dislikePath.setAttribute('d', 'M240-816h456v480L408-48l-32-22q-17-12-26-30.5t-5-38.5l1-5 38-192H120q-30 0-51-21t-21-51v-57q0-8 1.5-14.5T54-493l119-279q8-20 26.5-32t40.5-12Zm384 72H240L120-465v57h352l-49 243 201-201v-378Zm0 378v-378 378Zm72 30v-72h144v-336H696v-72h216v480H696Z');
  dislikeSvg.appendChild(dislikePath);
  dislikeButton.appendChild(dislikeSvg);

  const dislikeNotification = document.createElement('span');
  dislikeNotification.classList.add('notification-icon');
  dislikeNotification.textContent = Post.dislikes;

  dislike.appendChild(dislikeButton);
  dislike.appendChild(dislikeNotification);

  // Comment button and notification
  const comment = document.createElement('div');
  comment.classList.add('comments');

  const commentButton = document.createElement('button');
  const commentSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  commentSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  commentSvg.setAttribute('height', '20px');
  commentSvg.setAttribute('viewBox', '0 -960 960 960');
  commentSvg.setAttribute('width', '20px');
  commentSvg.setAttribute('fill', '#707C97');
  const commentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  commentPath.setAttribute('d', 'M864-96 720-240H360q-29.7 0-50.85-21.15Q288-282.3 288-312v-48h384q29.7 0 50.85-21.15Q744-402.3 744-432v-240h48q29.7 0 50.85 21.15Q864-629.7 864-600v504ZM168-462l42-42h390v-288H168v330ZM96-288v-504q0-29.7 21.15-50.85Q138.3-864 168-864h432q29.7 0 50.85 21.15Q672-821.7 672-792v288q0 29.7-21.15 50.85Q629.7-432 600-432H240L96-288Zm72-216v-288 288Z');
  commentSvg.appendChild(commentPath);
  commentButton.appendChild(commentSvg);

  const commentNotification = document.createElement('span');
  commentNotification.classList.add('notification-icon');
  commentNotification.textContent = Post.commentsCount;

  comment.appendChild(commentButton);
  comment.appendChild(commentNotification);
  // Append all post actions to the post-actions container
  postActions.appendChild(like);
  postActions.appendChild(dislike);
  postActions.appendChild(comment);
  let commentscontainer = document.createElement("div")
  commentscontainer.style.display = "none"
  commentscontainer.classList.add("comments-section")
  let commentinput = commentin(Post.author)
  commentscontainer.appendChild(commentinput)
  let addCommentButton = commentinput.querySelector(".addcoment")
  addCommentButton.addEventListener("click",async function() {
    let content = commentinput.querySelector(".coment-content.input").value
    let r = await loadcomment(content,Post.id)
  })
  let cmtnum = 1
  comment.addEventListener("click", async function(){
    if (commentscontainer.style.display == "none"){
    let cmtloading = false
    commentscontainer.style.display = "block"
    let cmnts = await loadComments(Post.id,cmtnum);
    if (cmnts !== "baraka elik"){
      cmnts.forEach(cmt => createcomment(cmt,commentscontainer));
      cmtnum++
    commentscontainer.addEventListener("scroll", async () => {
      if (commentscontainer.scrollTop + commentscontainer.clientHeight >= commentscontainer.scrollHeight * 0.95 && !cmtloading || cmtnum == 1){
    try {
      let cmnts = await loadComments(Post.id,cmtnum);
      if (cmnts !== "baraka elik"){
      cmnts.forEach(cmt => createcomment(cmt,commentscontainer));
      commentscontainer.scrollTo(0, commentscontainer.scrollHeight*0.80)
      cmtnum = cmtnum+1
      cmtloading = false;
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }
  })}
}else{
  commentscontainer.style.display = "none"
}
})   

  // Append all sections to the post
  post.appendChild(userInfo);
  post.appendChild(posttitle);
  post.appendChild(postContent);
  post.appendChild(postActions);
  post.appendChild(commentscontainer);
  post.id = Post.id
  let postsection = document.querySelector(".posts-section")
  if (postsection == null){    
    postsection = document.createElement("div")
    postsection.classList.add("posts-section")
    let postinput = postsection.querySelector(".posts-section")
    if (!postinput){
      postinput = postin()
    postsection.appendChild(postinput)
    }
    let addpostbutton = postinput.querySelector(".addpost")

    addpostbutton.addEventListener("click",async function() {
      let content = postinput.querySelector(".post-content.input").value
      let title = postinput.querySelector(".post-title.input").value
      let cats = postinput.querySelectorAll(".categorie input:checked")
      let categories = []
      cats.forEach(cat=> categories.push(cat.value))
      let r = await loadaddPost(content,categories, title)
    })
  }
  let container = document.querySelector(".container")
  // Append the post to the body
  postsection.appendChild(post);
  container.appendChild(postsection)
  postsection.addEventListener("scroll", async () => {
    if (postsection.scrollTop + postsection.clientHeight >= postsection.scrollHeight&& !loading) {
      loading = true;
      console.log("Loading more posts...");
      try {
        let posts = await loadPosts(num);
        if(posts!= "baraka elik"&& posts != "no posts"){
          posts.forEach(post => createPost(post));
          postsection.scrollTo(0, postsection.scrollHeight*0.80)
          num += 1
          loading = false;
        }
        
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    }
  })
}
 function validinfos(user,action){
  function validbs(fields){
    for (const field of fields) {
      if (!user[field]) {
        return false;
      }
    }
    return true;
   }
  if (action == "login"){
    if (!validateEmail(email)) return false;
    if (!validatePassword(password)) return false;
  }else if (action == "register"){
    const {username, age, gender, firstname, lastname, email, password} = user

    if (!validbs(["username", "age", "gender", "firstname", "lastname", "email", "password"]))return false;
    if (!validateEmail(email))return false;
    if (!validatePassword(password))return false;
    if (!validlen(username,3,15) || !validlen(firstname,3,15) || !validlen(lastname,3,15) || (age > 100 || age < 12) || (gender != "male" && gender != "female")) { console.log(user);return false};
  }
  return true
 }
 function validlen(str,x,y){
  if (str.length < x || str.length > y){
    return false
  }
  return true
 }
 function validateEmail(email){
  if (email.length < 5 || email.length > 50) {
    return false;
  }
  return true;
 }
 function validatePassword(email){
  if (email.length < 5 || email.length > 30) {
    return false;
  }
  return true;
 }
 async function sendRegisterinfo(user){
  try {
    const data = await fetch("/api/signup",{
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    if (data.ok){
      let card = document.querySelector(".card")
      card.classList.remove('flipped')
    }
  } catch (error) {
  }
 }
async function sendlogininfo(user){
  try {
    const data = await fetch("/api/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (data.ok) {
      getInfoData()
      servehome()
    } else {
      console.log( await data.text());
    }
  } catch (error) {
    console.log(error)
  } finally {
    isSubmitting = false;
  }
}
async function servehome(){
  Removecard()
  if (!document.querySelector(".sidebar")){
  createSidebar()
  }
 loadPosts(num).then(posts => {
  if (posts != "no posts"){
   num++
  for (let post in posts){
    createPost(posts[post])
   }
  }else{
    let ps = document.createElement("div")
    ps.classList.add("posts-section")
    ps.appendChild(postin())
    document.querySelector(".container").appendChild(ps)
  }
 })
}
async function logout(){
  await fetch("/api/logout")
  socket.close()
  location.reload()
}
async function fetchPosts(num){
  const res = await fetch(`/api/post/?page-number=${num}`);
  const data = await res.json();
  return data;
}
async function loadPosts(num) {
  console.log(num)
  let response = await fetchPosts(num);
  let posts = response.Posts;
  if (posts == null){
     return "no posts"
  }
  if (posts.length == 0){
    return "baraka elik"
  }
  return posts;
}
async function getInfoData() {
  const res = await fetch("/api/info");
  const data = await res.json();

  if (data.authorize) {
    info = data;
    if (!socket){
    Hanldews();
    }
  }
  return data;
}
async function fetchComments(postId, cnum){
  const res = await fetch(`/api/post/${postId}/comments/${cnum}`);
  return await res.json();
}
async function loadComments(postId,cnum){
  let response = await fetchComments(postId,cnum);
  let comments = response.Comments;
  if(comments.length == 0){
     return "baraka elik"
  }
  return comments;
}
async function loadaddPost(contentInput, categories, title){
  let response = await addpost(contentInput,categories, title)
  return response.ok
}
async function addpost(contentInput, categories, Title){
  const res = await fetch("/api/post/", {
    method: "post",
    body: JSON.stringify({
      title: Title,
      content: contentInput,
      categories: categories,
    }),
  });
  return res
}
async function addcomment(contentInput,postId){
  const res = await fetch("/api/comment", {
    method: "post",
    body: JSON.stringify({
      content: contentInput,
      postId: postId,
    }),
  });
  return res
}
async function loadcomment(contentInput,postId){
  let response = await addcomment(contentInput,postId)
  console.log(response)
  return response.ok
}
(async function(){
  if (!info.authorize){
    createCard()
  }else{
    servehome(info)
  }
  await getInfoData().then(i =>{
    info = i 
  })
}()); 
async function Hanldews() {
  console.log("Attempting WebSocket connection...");
  
   socket = new WebSocket('ws://localhost:8081/api/ws');

  socket.onopen = () => {
    console.log("WebSocket connection established!");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed.");
  };

  socket.addEventListener("message", (event) => {
    console.log("Data arrived");
    let data;
    try {
      data = JSON.parse(event.data);
      console.log(data)
    } catch (e) {
      console.error("Invalid JSON received:", event.data);
      return;
    }

    if (Array.isArray(data)) {
      let chat = document.querySelector(".chat");
      if (!chat) {
        chat = document.createElement("div");
        chat.classList.add("chat");
        chat.style.display = "none"; 
        chat.innerHTML = chathtml("");
        document.querySelector(".container").appendChild(chat);
        let chatbtn = document.querySelector(".button-send")
        chatbtn.addEventListener("click",e =>{
          e.preventDefault()
          let rec = document.querySelector(".text-chat").id
          if (rec == "") return
          let msg = document.querySelector(".message-send").value
          const message = {
            type: "message",
            sender: info.username,
            recipient: rec.toString(),
            content: msg
          }
          socket.send(JSON.stringify(message))
          let msgcontainer = document.querySelector(".messages-container")
          Handledisplaymsgs([message],msgcontainer)

        })
      }

      let ul = chat.querySelector("ul");
      if (!ul) {
        ul = document.createElement("ul");
        chat.appendChild(ul);
      }

      data.forEach((us) => {
        let existingUser = document.querySelector(`#${us.username}`);
        if (!existingUser) {
          let userElement = document.createElement("li");
          userElement.id = us.username;
          userElement.textContent = us.username;
          userElement.classList.add("chat-user")
          if (us.State) {
            userElement.classList.add("online");
        } 
        let offset = 0
          ul.appendChild(userElement);
          userElement.addEventListener("click",async function(){
            let chath = document.querySelector(".text-chat")
            chath.innerHTML = `Chat With ${us.username}`
            chath.id = `${us.username}`
            let isloading = false
            let msgcontainer = document.querySelector(".messages-container")
            msgcontainer.innerHTML = ""
            let msgs = await loadMessages(us.username,offset)
            Handledisplaymsgs(msgs,msgcontainer,us.username)
            msgcontainer.addEventListener("scroll",async function (){
              if ((msgcontainer.scrollTop ==0 )&& !isloading) {
                console.log("getting hadouk lmsgat")
                isloading == true
                 msgs = await loadMessages(us.username,offset)
                Handledisplaymsgs(msgs,msgcontainer,us.username)
                offset++
                isloading = false
              }
            })
          })
        }
      });
      chat.style.display = "none"; 
    } else {
      if (data.type === "signal-off") {
        let user = document.querySelector(`#${data.content}`)
        user.classList = ["chat-user"]
      }else if (data.type === "signal-on") {
        let user = document.querySelector(`#${data.content}`)
        if (!user){
           user = document.createElement("li");
          user.id = data.content
          user.textContent = data.content
          user.classList.add("chat-user")
          document.querySelector(".users").appendChild(user)
        }
        user.classList.add("online")
      }else if (data.type === "message"){
        console.log("rfws")
        let chat = document.querySelector(`#${data.sender}`)
        if (!chat){

        }else{
          console.log(data)
          Handledisplaymsgs([data],document.querySelector(".messages-container"),22)
        }
      }
    }
  });
}
async function loadMessages(userId, offset) {
  console.log(`/api/msg?user_id=${userId}&offset=${offset}`)
  const response = await fetch(`/api/msg?user_id=${userId}&offset=${offset}`);
  const msgs = await response.json();
  console.log(msgs.messages)
  return msgs.messages
}
function Handledisplaymsgs(msgs,msgcontainer,rec){
  msgs.forEach(msg =>{
    let msghtml 
    if(msg.sender == rec || rec == 22){
      msghtml = document.createRange().createContextualFragment(othermsg(msg.content))
    }else{
      msghtml = document.createRange().createContextualFragment(mymsg(msg.content))
    }
    if (rec == 22 || !rec){
      msgcontainer.appendChild(msghtml)
    }else{
      msgcontainer.prepend(msghtml)
    }
  })
  
}