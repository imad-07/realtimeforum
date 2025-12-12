# Real-Time Forum with Typing Indicators

A modern, real-time forum application built with Go and WebSockets, featuring live chat functionality with typing indicators, post/comment management, and real-time reactions.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login system with session-based authentication
- **Post Management**: Create, view, and categorize posts with rich content
- **Comment System**: Multi-threaded commenting with nested discussions
- **Real-Time Chat**: Private messaging between users using WebSockets
- **Typing Indicators**: Live typing status notifications in chat conversations
- **Reaction System**: Like/dislike functionality for posts and comments
- **Category Filtering**: Organize and filter posts by predefined categories
- **User Presence**: Real-time online/offline status tracking
- **Rate Limiting**: Built-in protection against spam and abuse

### Security Features
- Password hashing with bcrypt
- Session-based authentication with UUID tokens
- Rate limiting on authentication, posts, comments, and reactions
- SQL injection protection via prepared statements
- CORS-ready WebSocket connections

## 📋 Table of Contents

- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [WebSocket Protocol](#websocket-protocol)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Docker Deployment](#docker-deployment)
- [Development](#development)

## 🏗️ Architecture

The application follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (UI)                        │
│              HTML/CSS/JavaScript + WebSockets                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                   HTTP/WebSocket Server                      │
│                   (Go Standard Library)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                   Middleware Layer                           │
│         • Rate Limiting  • Method Validation                 │
│         • Authentication • CORS Handling                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                    Handler Layer                             │
│  • User Handler    • Post Handler    • Comment Handler       │
│  • React Handler   • WebSocket Handler • Message Handler     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                    Service Layer                             │
│        Business Logic & WebSocket Connection Management      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┘
│                     Data Layer                               │
│          Database Access & Query Implementations             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                   SQLite Database                            │
│     User Profiles • Posts • Comments • Reactions • Chats     │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Language**: Go 1.23.0+
- **Database**: SQLite3 (mattn/go-sqlite3)
- **WebSockets**: Gorilla WebSocket
- **Authentication**: golang.org/x/crypto (bcrypt)
- **Session Management**: UUID-based sessions (gofrs/uuid)
- **HTTP Router**: Go standard library `http.ServeMux`

### Frontend
- **Structure**: HTML5
- **Styling**: CSS3
- **Scripting**: Vanilla JavaScript
- **Real-time Communication**: WebSocket API

## 📁 Project Structure

```
real-time-forum-typing-in-progress/
│
├── server/                          # Backend application
│   ├── main.go                      # Application entry point
│   ├── forum.db                     # SQLite database file
│   │
│   ├── data/                        # Data access layer
│   │   ├── db_init.go              # Database initialization
│   │   ├── shema.sql               # Database schema & views
│   │   ├── user_data.go            # User data operations
│   │   ├── postdata.go             # Post data operations
│   │   ├── comment_data.go         # Comment data operations
│   │   ├── react_data.go           # Reaction data operations
│   │   ├── info_data.go            # User info operations
│   │   └── wsdata.go               # WebSocket data operations
│   │
│   ├── service/                     # Business logic layer
│   │   ├── user_service.go         # User business logic
│   │   ├── postapplication.go      # Post business logic
│   │   ├── comment_service.go      # Comment business logic
│   │   ├── react_service.go        # Reaction business logic
│   │   ├── info_service.go         # Info service logic
│   │   └── wservice.go             # WebSocket service & connection management
│   │
│   ├── handlers/                    # HTTP/WebSocket request handlers
│   │   ├── user_handler.go         # Authentication & user management
│   │   ├── postpresentation.go     # Post presentation handlers
│   │   ├── comment_handler.go      # Comment handlers
│   │   ├── react_handler.go        # Reaction handlers
│   │   ├── wschat-handler.go       # WebSocket chat handler
│   │   ├── msghandler.go           # Message history handler
│   │   ├── info_handler.go         # User info handler
│   │   ├── logouthanlder.go        # Logout handler
│   │   ├── home_handler.go         # Home page handler
│   │   ├── features_handler.go     # Features handler
│   │   └── error_handler.go        # Error handling utilities
│   │
│   ├── routes/                      # Route definitions
│   │   ├── routes.go               # Main route configuration
│   │   └── post_mux.go             # Post-specific route multiplexer
│   │
│   ├── middlewares/                 # HTTP middleware
│   │   ├── check_method_middleware.go  # HTTP method validation
│   │   └── rate_limiter/
│   │       └── limiter.go          # Rate limiting implementation
│   │
│   ├── shareddata/                  # Shared data structures
│   │   ├── types.go                # Data structure definitions
│   │   └── global.go               # Global constants & error messages
│   │
│   └── helpers/                     # Utility functions
│       └── helpers.go              # Helper utilities
│
├── ui/                              # Frontend application
│   ├── templates/
│   │   └── index.html              # Main HTML template
│   ├── css/                        # Stylesheets
│   └── js/                         # JavaScript modules
│       ├── script.js               # Main application logic
│       ├── components.js           # UI components
│       ├── post.js                 # Post-related functionality
│       ├── comment.js              # Comment-related functionality
│       ├── ws.js                   # WebSocket client logic
│       └── helpers.js              # Frontend utilities
│
├── dockerfile                       # Docker container configuration
├── go.mod                          # Go module dependencies
└── go.sum                          # Go module checksums
```

## 🗄️ Database Schema

The application uses SQLite with a normalized relational schema:

### Tables

#### `user_profile`
Stores user account information and session data.
```sql
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password (TEXT) -- bcrypt hashed
- uid (TEXT UNIQUE) -- session token
- expired_at (DATETIME) -- session expiration
- created_at (DATETIME)
```

#### `post`
Stores forum posts.
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER FK → user_profile.id)
- title (TEXT)
- content (TEXT)
- created_at (DATETIME)
```

#### `comment`
Stores comments on posts.
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER FK → user_profile.id)
- post_id (INTEGER FK → post.id)
- content (TEXT)
- created_at (DATETIME)
```

#### `postReact`
Stores like/dislike reactions on posts.
```sql
- post_id (INTEGER FK → post.id)
- user_id (INTEGER FK → user_profile.id)
- is_liked (INTEGER) -- 1 = like, 2 = dislike
- PRIMARY KEY (post_id, user_id)
```

#### `commentReact`
Stores like/dislike reactions on comments.
```sql
- comment_id (INTEGER FK → comment.id)
- user_id (INTEGER FK → user_profile.id)
- is_liked (INTEGER) -- 1 = like, 2 = dislike
- PRIMARY KEY (comment_id, user_id)
```

#### `categories`
Stores available post categories.
```sql
- id (INTEGER PRIMARY KEY)
- category_name (TEXT UNIQUE)
```

#### `post_category`
Many-to-many relationship between posts and categories.
```sql
- post_id (INTEGER FK → post.id)
- category_id (INTEGER FK → categories.id)
- UNIQUE (post_id, category_id)
```

#### `user_chats`
Stores private chat messages between users.
```sql
- id (INTEGER PRIMARY KEY)
- sender (TEXT FK → user_profile.id)
- receiver (TEXT FK → user_profile.id)
- message (TEXT)
- time (TIMESTAMP)
```

### Views

#### `single_post`
Aggregated view combining post data with likes, dislikes, and comment counts.

#### `single_comment`
Aggregated view combining comment data with likes and dislikes.

## 🔌 API Endpoints

### Authentication

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/api/signup` | POST | Register new user | 5/minute |
| `/api/login` | POST | Authenticate user | 500/minute |
| `/api/logout` | POST | End user session | - |

**Request Body (Signup)**:
```json
{
  "username": "string (3-15 chars)",
  "email": "string (valid email)",
  "password": "string (6-30 chars)",
  "firstname": "string",
  "lastname": "string",
  "age": "integer",
  "gender": "string"
}
```

**Request Body (Login)**:
```json
{
  "username": "string",
  "password": "string"
}
```

### User Information

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/info` | GET | Get current user info & categories | Yes |
| `/api/getuser` | GET | Get online users list | Yes |

### Posts

| Endpoint | Method | Description | Auth Required | Rate Limit |
|----------|--------|-------------|---------------|------------|
| `/api/post/` | GET | Get all posts (paginated) | No | - |
| `/api/post/` | POST | Create new post | Yes | 100/2s |
| `/api/post/<id>` | GET | Get specific post & comments | No | - |

**Request Body (Create Post)**:
```json
{
  "title": "string",
  "content": "string",
  "categories": ["string"]
}
```

**Query Parameters (Get Posts)**:
- `page` - Page number (default: 1)
- `filter` - Filter type: "created", "liked"
- `category` - Category name filter

### Comments

| Endpoint | Method | Description | Auth Required | Rate Limit |
|----------|--------|-------------|---------------|------------|
| `/api/comment` | POST | Add comment to post | Yes | 100/2s |

**Request Body**:
```json
{
  "postId": "integer",
  "content": "string"
}
```

### Reactions

| Endpoint | Method | Description | Auth Required | Rate Limit |
|----------|--------|-------------|---------------|------------|
| `/api/reaction` | POST | React to post/comment | Yes | 10/500ms |

**Request Body**:
```json
{
  "thread_type": "post|comment",
  "thread_id": "integer",
  "react": "1 (like) | 2 (dislike)"
}
```

### Messages

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/msg` | GET | Get message history with user | Yes |

**Query Parameters**:
- `reciver` - Username of the chat partner

### WebSocket

| Endpoint | Protocol | Description | Auth Required |
|----------|----------|-------------|---------------|
| `/api/ws` | WebSocket | Real-time chat & typing indicators | Yes |

## 🔄 WebSocket Protocol

The WebSocket connection at `/api/ws` supports real-time bidirectional communication.

### Connection Establishment

1. Client connects with valid session cookie
2. Server upgrades HTTP connection to WebSocket
3. Server registers connection in global connection pool
4. Connection remains open for real-time messaging

### Message Types

#### 1. Chat Message
**Client → Server**:
```json
{
  "type": "message",
  "recipient": "username",
  "content": "message content",
  "timestamp": "2024-12-12T15:00:00Z"
}
```

**Server → Client** (to recipient):
```json
{
  "type": "message",
  "sender": "username",
  "recipient": "username",
  "content": "message content",
  "timestamp": "2024-12-12T15:00:00Z",
  "id": "unique-message-id"
}
```

#### 2. Typing Indicator
**Client → Server**:
```json
{
  "type": "signal-typing",
  "recipient": "username",
  "content": "typing..." // or empty when stopped typing
}
```

**Server → Client** (to recipient):
```json
{
  "type": "signal-typing",
  "sender": "username",
  "content": "typing..."
}
```

#### 3. User List Update
**Server → Client** (automatic):
```json
[
  {
    "username": "user1",
    "state": true  // online status
  },
  {
    "username": "user2",
    "state": false
  }
]
```

### Connection Management

- **Connection Pool**: Server maintains a global map of active WebSocket connections per user
- **Multi-Connection Support**: Users can have multiple simultaneous connections (multiple tabs/devices)
- **Auto-Cleanup**: Connections are automatically removed when disconnected
- **Session Validation**: Each message validates the user's session cookie

## 🚀 Installation

### Prerequisites

- Go 1.23.0 or higher
- SQLite3
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-time-forum-typing-in-progress
   ```

2. **Install Go dependencies**
   ```bash
   go mod download
   ```

3. **Initialize the database**
   The database will be automatically created and initialized on first run.

4. **Build the application**
   ```bash
   cd server
   go build
   ```

5. **Run the server**
   ```bash
   ./server
   ```

6. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:8081
   ```

## ⚙️ Configuration

### Server Configuration

The server configuration is located in `server/main.go`:

```go
server := http.Server{
    Addr:    ":8081",  // Change port here
    Handler: routes.Routes(db),
}
```

### Database Location

The SQLite database is stored at `server/forum.db`. To change the location, modify `server/data/db_init.go`:

```go
func OpenDb() (*sql.DB, error) {
    return sql.Open("sqlite3", "./forum.db")  // Change path here
}
```

### Rate Limiting

Rate limits are configured in `server/routes/routes.go`:

```go
// Examples:
loginRateLimiter := ratelimiter.LoginLimiter.RateMiddlewareAuth(
    http.HandlerFunc(userHandler.LoginHandler), 
    500,           // Max requests
    time.Minute    // Time window
)

addCommentHandler := ratelimiter.AddCommentsLimter.RateMiddleware(
    http.HandlerFunc(commentHandler.AddCommentHandler), 
    100,           // Max requests
    2*time.Second, // Time window
    db
)
```

### Session Expiration

Session expiration can be configured in the user authentication logic.

## 📖 Usage

### Creating an Account

1. Navigate to the signup page
2. Fill in all required fields:
   - Username (3-15 characters)
   - Email (valid email format)
   - Password (6-30 characters)
   - First Name, Last Name
   - Age, Gender
3. Submit the form
4. You'll be automatically logged in

### Creating a Post

1. Log in to your account
2. Navigate to the create post section
3. Enter a title and content
4. Select one or more categories
5. Submit the post
6. The post will appear in the main feed

### Commenting

1. Click on a post to view details
2. Scroll to the comment section
3. Type your comment
4. Submit

### Real-Time Chat

1. Log in to your account
2. View the list of online users
3. Click on a user to start a conversation
4. Type your message in the input field
5. The recipient will see your message in real-time
6. Typing indicators show when someone is typing

### Reacting to Posts/Comments

1. Click the like or dislike button on any post or comment
2. Your reaction is instantly recorded
3. The count updates in real-time

## 🐳 Docker Deployment

### Using the Dockerfile

1. **Build the Docker image**
   ```bash
   docker build -t real-time-forum .
   ```

2. **Run the container**
   ```bash
   docker run -p 8081:8081 real-time-forum
   ```

3. **Access the application**
   ```
   http://localhost:8081
   ```

### Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  forum:
    build: .
    ports:
      - "8081:8081"
    volumes:
      - ./server/forum.db:/forum/server/forum.db
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## 🔧 Development

### Project Organization

The project follows a clean architecture pattern:

1. **Data Layer** (`data/`): Direct database access and queries
2. **Service Layer** (`service/`): Business logic and data processing
3. **Handler Layer** (`handlers/`): HTTP request handling and response formatting
4. **Middleware Layer** (`middlewares/`): Request preprocessing (auth, rate limiting)
5. **Routes Layer** (`routes/`): Route definitions and configuration

### Adding a New Feature

1. **Define data structures** in `shareddata/types.go`
2. **Create database queries** in a new file under `data/`
3. **Implement business logic** in a new file under `service/`
4. **Create handlers** in a new file under `handlers/`
5. **Register routes** in `routes/routes.go`
6. **Add frontend logic** in appropriate JS files under `ui/js/`

### Rate Limiter Implementation

The built-in rate limiter tracks requests per user and enforces limits:

```go
type RateLimiter struct {
    Users map[string]*UserData
    Mu    sync.Mutex
}

type UserData struct {
    Counter   int
    Timer     *time.Timer
    Sleepy    time.Time
}
```

Features:
- Per-user tracking
- Configurable limits and time windows
- Automatic cleanup of inactive users (every 120 minutes)
- Different limits for different endpoints

### WebSocket Connection Pool

The WebSocket service maintains a global connection pool:

```go
var Clients = make(map[string][]*websocket.Conn)
var Mutex = sync.Mutex{}
```

Features:
- Multiple connections per user
- Thread-safe operations
- Automatic cleanup on disconnect
- Broadcast and private messaging support

## 🔒 Security Considerations

### Implemented Security Measures

1. **Password Security**
   - Passwords are hashed using bcrypt
   - Never stored in plain text
   - Minimum length requirements enforced

2. **Session Management**
   - UUID-based session tokens
   - HTTP-only cookies (configurable)
   - Session expiration tracking

3. **SQL Injection Protection**
   - All queries use prepared statements
   - User input is properly sanitized

4. **Rate Limiting**
   - Prevents brute force attacks on login
   - Limits spam on posts and comments
   - Protects against DoS attacks

5. **Cross-Origin Protection**
   - WebSocket origin validation
   - CORS headers (configurable)

### Recommended Enhancements

For production deployment, consider:

1. **HTTPS/TLS**: Enable HTTPS for encrypted communication
2. **CSRF Protection**: Add CSRF tokens for state-changing operations
3. **Input Validation**: Enhance client-side and server-side validation
4. **XSS Protection**: Sanitize user-generated content on display
5. **Database Backups**: Implement automated backup strategy
6. **Logging**: Add comprehensive logging for security events
7. **Environment Variables**: Move sensitive configuration to environment variables

## 📝 API Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "posts": [ ... ],
  "metadata": {
    "postsCount": 100,
    "postsPages": 10,
    "standardCount": 10
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

**Team Orca**

## 🙏 Acknowledgments

- Go team for excellent standard library
- Gorilla WebSocket for robust WebSocket implementation
- SQLite for lightweight, embedded database solution

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
