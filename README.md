<div align="center">

# GOLINX

Frontend of **Golinx** — a social network built for informal workers in LATAM to showcase their services, interact, and build their reputation.

**Backend repo → [golinx-backend](https://github.com/PaulTorres1417/golinx-backend)**

</div>

---

## Preview

| Light mode | Dark mode |
|------------|-----------|
| ![Light](https://github.com/user-attachments/assets/d2e85b3b-0eb0-4afa-bb47-852997ce4079) | ![Dark](https://github.com/user-attachments/assets/25fb4e54-de27-43b4-90d3-bfe4c7ff6483) |

---

## Tech Stack

- React
- TypeScript
- Apollo Client
- Zustand
- GraphQL

---

## Core Features

### Content & Interactions
- Posts with image and video upload via Cloudinary
- Reposts and quote-reposts (X/Twitter style)
- Nested comments with threaded replies
- Reactions on posts and comments
- Save posts and comments for later

### Real-time Experience
- Live counters for likes, comments, reposts, views and saves
- Instant UI updates with Apollo Cache and optimistic updates
- No page refresh needed — just like X/Twitter

### Feed & Pagination
- Infinite scroll with cursor-based pagination
- Feed ranked by relevance and recency
- Optimized for large data volumes

### Notifications
- Real-time notifications for every interaction
- Likes, comments, reposts and follows
- Powered by GraphQL Subscriptions — no polling

### Global Search
- Search users and posts from a single input
- Results ranked by relevance
- Profile previews and post snippets

### User Profiles
- Public profile with avatar, bio and stats
- Full post history and saved posts
- Follow / unfollow system

### Auth & Accounts
- Google and GitHub OAuth2 sign-in
- JWT session management
- Email flows via Resend (verification and notifications)

### Performance & Optimization
- DataLoader for batching and deduplication — eliminates N+1 queries in GraphQL resolvers
- Optimized PostgreSQL indexes on high-traffic columns
- Apollo Client cache to reduce network requests and keep the UI responsive

---

## Getting Started

### Prerequisites

- Node.js `v22`
- PostgreSQL `v14+`
- A [Cloudinary](https://cloudinary.com) account (free tier works)
- A [Resend](https://resend.com) account for email (free tier works)
- Google OAuth2 credentials via [Google Cloud Console](https://console.cloud.google.com)

---

### Installation

```bash
# Clone the frontend repo
git clone https://github.com/PaulTorres1417/golink-frontend.git
cd golink-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GraphQL endpoint and OAuth client ID

# Start development server
npm run dev
```

### Environment variables

```env
VITE_API_URL=http://localhost:4000/graphql
VITE_WS_URL=ws://localhost:4000/graphql
```