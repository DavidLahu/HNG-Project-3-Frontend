# Insighta Labs+ — Web Portal

A web portal for the Insighta Labs+ profile intelligence platform.

## Live URL
https://hng-project-3-frontend.vercel.app

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/` | GitHub OAuth login |
| Dashboard | `/dashboard` | Overview and quick links |
| Profiles | `/profiles` | Browse and filter profiles |
| Profile Detail | `/profiles/[id]` | Single profile view |
| Search | `/search` | Natural language search |
| Account | `/account` | User info and logout |

## Authentication

- Login is handled via GitHub OAuth
- Tokens are stored in HTTP-only cookies set by the backend
- JavaScript cannot access the tokens directly
- All API requests send cookies automatically via `credentials: "include"`
- If any request returns 401, user is redirected to login

## Setup

```bash
# Clone the repo
git clone https://github.com/DavidLahu/HNG-Project-3-Frontend.git
cd hng-stage3-frontend

# Install dependencies
npm install

# Create .env.local
NEXT_PUBLIC_API_URL=https://hng-project-3-backend-production.up.railway.app

# Run locally
npm run dev
```

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript