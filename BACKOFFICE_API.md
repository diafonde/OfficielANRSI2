# Backoffice API Documentation

## Overview
The backoffice API provides endpoints for admin and editor users to manage content, view statistics, and perform administrative tasks.

## Authentication
All backoffice endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer {token}
```

## Dashboard Endpoints

### Get Dashboard Statistics
**GET** `/api/dashboard/stats`

**Access:** ADMIN, EDITOR

**Response:**
```json
{
  "totalArticles": 25,
  "publishedArticles": 20,
  "draftArticles": 5,
  "recentArticles": 8,
  "totalUsers": 10,
  "activeUsers": 8,
  "totalVideos": 15
}
```

**Description:**
- `totalArticles`: Total number of articles in the system
- `publishedArticles`: Number of published articles
- `draftArticles`: Number of draft articles
- `recentArticles`: Number of articles published in the last 7 days
- `totalUsers`: Total number of users
- `activeUsers`: Number of active users
- `totalVideos`: Total number of videos

## Article Management Endpoints

### Get All Articles (Admin)
**GET** `/api/articles`

**Access:** Public (but admin view shows all including drafts)

**Response:** Array of ArticleDTO

### Get Article by ID
**GET** `/api/articles/{id}`

**Access:** Public

**Response:** ArticleDTO

### Create Article
**POST** `/api/articles`

**Access:** ADMIN, EDITOR

**Request Body:**
```json
{
  "title": "Article Title",
  "content": "Article content...",
  "excerpt": "Article excerpt...",
  "author": "Author Name",
  "publishDate": "2025-01-15T10:00:00",
  "imageUrl": "https://example.com/image.jpg",
  "images": ["url1", "url2"],
  "category": "Research",
  "tags": ["tag1", "tag2"],
  "featured": false,
  "published": true
}
```

**Response:** ArticleDTO

### Update Article
**PUT** `/api/articles/{id}`

**Access:** ADMIN, EDITOR

**Request Body:** Same as Create Article

**Response:** ArticleDTO

### Delete Article
**DELETE** `/api/articles/{id}`

**Access:** ADMIN

**Response:** 204 No Content

## User Management Endpoints (Admin Only)

### Get All Users
**GET** `/api/users`

**Access:** ADMIN

**Response:** Array of UserDTO

### Get User by ID
**GET** `/api/users/{id}`

**Access:** ADMIN

**Response:** UserDTO

### Create User
**POST** `/api/users`

**Access:** ADMIN

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "firstName": "First",
  "lastName": "Last",
  "role": "EDITOR",
  "isActive": true
}
```

**Response:** UserDTO

### Update User
**PUT** `/api/users/{id}`

**Access:** ADMIN

**Request Body:** Same as Create User (password optional)

**Response:** UserDTO

### Delete User
**DELETE** `/api/users/{id}`

**Access:** ADMIN

**Response:** 204 No Content

### Toggle User Status
**PUT** `/api/users/{id}/toggle`

**Access:** ADMIN

**Response:** UserDTO (with toggled isActive status)

## Video Management Endpoints

### Get All Videos
**GET** `/api/videos`

**Access:** Public

**Response:** Array of VideoDTO

### Get Video by ID
**GET** `/api/videos/{id}`

**Access:** Public

**Response:** VideoDTO

### Create Video
**POST** `/api/videos`

**Access:** ADMIN, EDITOR

**Request Body:**
```json
{
  "title": "Video Title",
  "url": "https://youtube.com/embed/...",
  "type": "youtube",
  "description": "Video description",
  "thumbnailUrl": "https://example.com/thumb.jpg"
}
```

**Response:** VideoDTO

### Update Video
**PUT** `/api/videos/{id}`

**Access:** ADMIN, EDITOR

**Request Body:** Same as Create Video

**Response:** VideoDTO

### Delete Video
**DELETE** `/api/videos/{id}`

**Access:** ADMIN

**Response:** 204 No Content

## Authentication Endpoints

### Login
**POST** `/api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@anrsi.mr",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00",
    "lastLogin": "2025-01-15T10:00:00"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### Get Current User
**GET** `/api/auth/me`

**Access:** Authenticated

**Response:** UserDTO

## Article Status

Articles now support a `published` field:
- `published: true` - Article is published and visible to public
- `published: false` - Article is a draft, only visible in admin panel

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "status": "ERROR_CODE"
}
```

Common status codes:
- `400 BAD_REQUEST` - Validation errors or invalid input
- `401 UNAUTHORIZED` - Authentication required or invalid credentials
- `403 FORBIDDEN` - Insufficient permissions
- `404 NOT_FOUND` - Resource not found
- `500 INTERNAL_SERVER_ERROR` - Server error

## Example Usage

### 1. Login and Get Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### 2. Get Dashboard Stats
```bash
curl -X GET http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer {token}"
```

### 3. Create Article
```bash
curl -X POST http://localhost:8080/api/articles \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Article",
    "content": "Article content...",
    "excerpt": "Short excerpt",
    "author": "Author Name",
    "publishDate": "2025-01-15T10:00:00",
    "category": "Research",
    "tags": ["tag1"],
    "published": false
  }'
```

### 4. Get All Users (Admin)
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer {admin_token}"
```

## Frontend Integration

Update your frontend services to use these endpoints:

1. **DashboardService** - Call `GET /api/dashboard/stats`
2. **ArticleAdminService** - Replace mock data with:
   - `GET /api/articles` - Get all articles
   - `POST /api/articles` - Create article
   - `PUT /api/articles/{id}` - Update article
   - `DELETE /api/articles/{id}` - Delete article
3. **AuthService** - Replace mock login with `POST /api/auth/login`
4. **UserService** (if exists) - Use `/api/users` endpoints

## Notes

- All dates are in ISO 8601 format (e.g., "2025-01-15T10:00:00")
- JWT tokens expire after 1 hour (3600 seconds)
- Passwords must be at least 6 characters
- Article titles must be between 5-500 characters
- Article content must be at least 50 characters
- Article excerpts must be at least 20 characters




