export{Togglecomments,commentin}
import { commentdivhtml, commenthtml} from "./components.js";
import { loadComments } from "./helpers.js";
function Togglecomments(comment, commentscontainer, Post) {
    let cmtnum = 0
    let cmtloading = false;
    comment.addEventListener("click", async function () {
        if (commentscontainer.style.display == "none") {
          commentscontainer.style.display = "block";
          let cmnts = await loadComments(Post.id, cmtnum);
          if (cmnts !== "baraka elik") {
            cmnts.forEach((cmt) => createcomment(cmt, commentscontainer));
            cmtnum = cmnts[cmnts.length - 1].id;
            commentscontainer.addEventListener("scroll", async () => {
              if (
                commentscontainer.scrollTop + commentscontainer.clientHeight >=
                commentscontainer.scrollHeight * 0.95 &&
                !cmtloading
              ) {
                try {
                  let cmnts = await loadComments(Post.id, cmtnum);
                  if (cmnts !== "baraka elik") {
                    cmnts.forEach((cmt) => createcomment(cmt, commentscontainer));
                    commentscontainer.scrollTo(
                      0,
                      commentscontainer.scrollHeight * 0.8
                    );
                    cmtnum = cmnts[cmnts.length - 1].id;
                    cmtloading = false;
                  }
                } catch (error) {
                  console.log("Error loading comments:", error);
                }
              }
            });
          }
        } else {
          commentscontainer.style.display = "none";
        }
      });
}
function commentin(username) {
    let commentDiv = document.createElement("div");
    commentDiv.classList.add("coment", "input");
    commentDiv.innerHTML = commentdivhtml(username);
    return commentDiv;
  }
function createcomment(Comment, container) {
    const comment = document.createElement("div");
    comment.classList.add("comment");
    comment.id = Comment.id;
    comment.innerHTML = commenthtml(Comment);
    container.appendChild(comment);
  }