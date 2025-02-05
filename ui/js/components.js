export {
  sidebarhtml,
  frontcard,
  backcard,
  commenthtml,
  commentdivhtml,
  postdivhtml,
  convchathtml,
};

let sidebarhtml = (username) => `
    <div class="profile-section">
      <img id="profile-pic" src="/ui/css/default-profile.jpg" alt="Profile Picture">
      <h3 id="user-name">${username}</h3>
    </div>
    <nav class="menu">
      <a href="#" class="menu-item Home">
        <button class="btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#707C97">
              <defs>
                <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#7CB8F7"/>
                  <stop offset="93%" stop-color="#2A8BF2"/>
                </linearGradient>
              </defs>
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
          </svg>
        </button>
        Home
      </a>
      <a href="#" class="menu-item Chat">
        <button class="btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#707C97">
              <defs>
                <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#7CB8F7"/>
                  <stop offset="93%" stop-color="#2A8BF2"/>
                </linearGradient>
              </defs>
            <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
            </svg>
        </button>
        Chat
      </a>
      <a href="#" class="menu-item Log-out LO">
        <button class="btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#707C97">
              <defs>
                <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#7CB8F7"/>
                  <stop offset="93%" stop-color="#2A8BF2"/>
                </linearGradient>
              </defs>
            <path d="M479.88-478.67q-14.21 0-23.71-9.58t-9.5-23.75v-337.33q0-14.17 9.61-23.75 9.62-9.59 23.84-9.59 14.21 0 23.71 9.59 9.5 9.58 9.5 23.75V-512q0 14.17-9.61 23.75-9.62 9.58-23.84 9.58Zm.12 360q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-478.67q0-63 21.67-121.83 21.66-58.83 62.33-106.83 9.67-11.34 24-11.5 14.33-.17 25.17 10.66 9.16 9.17 7.83 22.84-1.33 13.66-10 25-31.67 38-48 85.15-16.33 47.16-16.33 96.51 0 122.57 85.38 207.96 85.38 85.38 207.95 85.38t207.95-85.38q85.38-85.39 85.38-207.96 0-50.66-16.16-97.5-16.17-46.83-48.5-85.5-8.89-11.03-9.78-24.18Q698-699 707-708q10.67-10.67 25.67-10.17 15 .5 24.66 12.17 41 48 61.84 106.33 20.83 58.34 20.83 121 0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-118.67Z"/>
            </svg>
        </button>
        Log-out
      </a>
    </nav>
  `;
let frontcard = `
    <h2>Login</h2>
    <form id="login-form" method="POST">
      <label for="login-id">Nickname or E-mail</label>
      <input type="text" id="login-id" name="login-id" required>
      <label for="login-password">Password</label>
      <input type="password" id="login-password" name="login-password" required>
      <button type="submit" class="btn">Login</button>
      <p class="switch">Don't have an account? <span id="switch-to-register">Register</span></p>
    </form>
  `;
let backcard = `
    <h2>Register</h2>
    <form class="register-form" method="POST">
      <label for="nickname">Nickname</label>
      <input type="text" id="nickname" name="nickname" required>
      <label for="age">Age</label>
      <input type="number" id="age" name="age" required>
      <label for="gender">Gender</label>
      <select id="gender" name="gender" required>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <label for="first-name">First Name</label>
      <input type="text" id="first-name" name="first-name" required>
      <label for="last-name">Last Name</label>
      <input type="text" id="last-name" name="last-name" required>
      <label for="email">E-mail</label>
      <input type="email" id="email" name="email" required>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required>
      <button type="submit" class="btn">Register</button>
      <p class="switch">Already have an account? <span id="switch-to-login">Login</span></p>
    </form>
  `;
let commenthtml = (Comment) => `
    <div class="user-info">
      <img src="/ui/css/default-profile.jpg" alt="User Avatar" class="avatar">
      <div class="user-details">
        <h4 class="username">${Comment.author}</h4>
        <p class="timestamp">${Comment.date}</p>
      </div>
    </div>
    <p class="comment-content">${Comment.content}</p>
    <div class="comment-actions">
      <div class="like">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#707C97">
            <path d="M720-144H264v-480l288-288 32 22q17 12 26 30.5t5 38.5l-1 5-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906-467L786.93-187.8Q778-168 760-156t-40 12Zm-384-72h384l120-279v-57H488l49-243-201 201v378Zm0-378v378-378Zm-72-30v72H120v336h144v72H48v-480h216Z"/>
          </svg>
        </button>
        <span class="notification-icon">${Comment.likes}</span>
      </div>
      <div class="dislike">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#707C97">
            <path d="M240-816h456v480L408-48l-32-22q-17-12-26-30.5t-5-38.5l1-5 38-192H120q-30 0-51-21t-21-51v-57q0-8 1.5-14.5T54-493l119-279q8-20 26.5-32t40.5-12Zm384 72H240L120-465v57h352l-49 243 201-201v-378Zm0 378v-378 378Zm72 30v-72h144v-336H696v-72h216v480H696Z"/>
          </svg>
        </button>
        <span class="notification-icon">${Comment.dislikes}</span>
      </div>
    </div>
  `;
let commentdivhtml = (username) => `
    <div class="user-info">
      <img src="/ui/css/default-profile.jpg" alt="User Avatar" class="avatar">
      <div class="user-details">
        <h4 class="username">${username}</h4>
      </div>
    </div>
    <textarea class="coment-content input" placeholder="Enter your comment here..."></textarea>
    <div class="addcoment">
      <button>Coment</button>
    </div>
  `;
let postdivhtml = (categoryHTML) => `
    <div class="user-info">
      <img src="/ui/css/default-profile.jpg" alt="User Avatar" class="avatar">
      <div class="user-details">
        <h4 class="username">Add Your Own Post!</h4>
      </div>
    </div>
    <textarea class="post-title input" placeholder="Title"></textarea>
    <textarea class="post-content input" placeholder="Enter your text here..."></textarea>
    <div class="categories">${categoryHTML}</div>
    <div class="addpost">
      <button>Post-It!</button>
    </div>
  `;
let convchathtml = `
  <div id="conv_chat">
      <aside>
        <header>
          <h1>USERS</h1>
        </header>
        <ul id="list">
          <li>
            <img />
            <div>
              <h2></h2>
              <h3>
                <span class="status"></span>
              </h3>
            </div>
          </li>
        </ul>
      </aside>
      <div class="main">
        <header>
          <img src="css/01chat.png" style="width: 55px; height: 55px" />
          <div>
            <h2></h2>
            <h3></h3>
          </div>
        </header>
        <ul id="chat">
          <li class="you">
            <div class="entete">
              <span class="status green"></span>
              <h2></h2>
              <h3></h3>
            </div>
            <div class="triangle"></div>
            <div class="message"></div>
          </li>
          <li class="me">
            <div class="entete">
              <h3></h3>
              <h2></h2>
              <span class="status blue"></span>
            </div>
            <div class="triangle"></div>
            <div class="message"></div>
          </li>
        </ul>
        <div class="footer">
          <textarea placeholder="Type your message"></textarea>
          <a href="#">Send</a>
        </div>
      </div>
    </div>
  `;


  