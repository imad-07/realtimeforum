export{ createPost, ls, postin }
import { postcore } from "./components.js";
import { Togglecomments, commentin } from "./comment.js";
import { postdivhtml } from "./components.js";
import { loadPosts, loadaddPost, addcomment } from "./helpers.js";

let ls = {lastpost: 0 };
let loading = false;

function createPost(Post) {
    let chatcard = document.querySelector(".card-container");
        if (chatcard) {
          chatcard.remove();
        }
    let post = document.createElement("div")
    post.classList.add("post")
    post.innerHTML= postcore(Post)
    post.id = Post.id;
    let commentbutton = post.querySelector(".comments")
    let commentscontainer = post.querySelector(".comments-section")
    Togglecomments(commentbutton,commentscontainer,Post)
    commentscontainer.appendChild(commentin(Post.author));
    let addCommentButton = post.querySelector(".addcoment");
    addCommentButton.addEventListener("click", async function () {
      let content = post.querySelector(".coment-content.input").value;
      await addcomment(content, Post.id);
    })
    let postsection = document.querySelector(".posts-section");
    if (!postsection) {
      postsection = createPostsSection();
    }
    let container = document.querySelector(".container");
    postsection.appendChild(post);
    container.appendChild(postsection);
    postsection.addEventListener("scroll", async () => {
      if (
        postsection.scrollTop + postsection.clientHeight >=
        postsection.scrollHeight &&
        !loading
      ) {
        loading = true;
        try {
          let posts = await loadPosts(ls.lastpost);
          if (posts != "baraka elik" && posts != "no posts") {
            posts.forEach((post) => createPost(post));
            ls.lastpost = posts[posts.length - 1].id;
            postsection.scrollTo(0, postsection.scrollHeight * 0.8);
            loading = false;
          }
        } catch (error) {
          console.error("Error loading posts:", error);
        }
      }
    });
}
function postin() {
  const categories = ["football", "cars", "ronaldo"];
  const postDiv = document.createElement("div");
  postDiv.classList.add("post", "beta");
  // Generate category checkboxes dynamically
  const categoryHTML = categories
    .map(
      (category) => `
    <label class="categorie">
      <input type="checkbox" name="${category}" value="${category}">
      ${category.charAt(0).toUpperCase() + category.slice(1)}
    </label>
  `
    )
    .join(""); 
  postDiv.innerHTML = postdivhtml(categoryHTML);
  let addpostbutton = postDiv.querySelector(".addpost")
  addpostbutton.addEventListener("click", async function () {
    let content = postDiv.querySelector(".post-content.input").value;
    let title = postDiv.querySelector(".post-title.input").value;
    let cats = postDiv.querySelectorAll(".categorie input:checked");
    let categories = [];
    cats.forEach((cat) => categories.push(cat.value));
    await loadaddPost(title, content, categories);
    ////refresh posts
    let posts = document.querySelector(".posts-section");
    if (posts) {
      posts.remove();
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
  return postDiv;
}
function createPostsSection() {
    const postSection = document.createElement("div");
    postSection.classList.add("posts-section");
    
    if (!postSection.querySelector(".posts-section")) {
      const postInput = postin();
      postSection.appendChild(postInput);
    }
    
    return postSection;
}