#  Notes Frontend (Next.js + Redux + Tailwind)

A modern, responsive **frontend for the FastAPI Notes App**, built using **Next.js (App Router)**, **Redux Toolkit**, and **Tailwind CSS**.  
This app allows users to sign up, log in, and manage notes securely using JWT-based authentication.

---

##  Features

-  Built with **Next.js 14+** (App Router + Turbopack)
-  **Tailwind CSS** for responsive UI and dark mode
-  **Redux Toolkit** for global state management
-  **JWT Authentication** with FastAPI backend
-  CRUD operations for Notes
-  Fully responsive design

---

## Tech Stack

| Component | Technology |
|------------|-------------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit |
| API | FastAPI |
| Auth | JWT (Stored in localStorage) |
| Language | TypeScript |


---

##  Setup Instructions

###  Clone the Repository

```bash
git clone https://github.com/<your-username>/nextjs-notes-frontend.git
cd nextjs-notes-frontend

```
### Install Dependencies
```bash
npm install
# or
yarn install
```

### Configure Environment Variables
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Run the Development Server
```bash
npm run dev
```

# Authentication Flow
    User signs up → /signup
    User logs in → /
    On successful login:
        JWT token is saved in localStorage
        Axios automatically attaches it to all authorized requests
    Protected pages like /dashboard and /profile require a valid token

# Notes Module
The notes page allows users to:

View all their notes
Create a new note (title + content)
Edit or delete existing notes
All operations are handled through Redux async thunks calling FastAPI endpoints.    


# API Integration (FastAPI)
Axios instance (src/lib/api.ts) automatically attaches JWT tokens:
```bash
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
## Example Endpoints
    | Action      | Method   | Endpoint       |
    | ----------- | -------- | -------------- |
    | Signup      | `POST`   | `/auth/signup` |
    | Login       | `POST`   | `/auth/login`  |
    | Get Notes   | `GET`    | `/notes/`      |
    | Create Note | `POST`   | `/notes/`      |
    | Update Note | `PUT`    | `/notes/{id}`  |
    | Delete Note | `DELETE` | `/notes/{id}`  |

# Redux Flow
    | Slice        | Purpose                                   |
    | ------------ | ----------------------------------------- |
    | `authSlice`  | Handles login, signup, token storage      |
    | `notesSlice` | CRUD operations for notes                 |
    | `store.ts`   | Combines slices and provides store to app |

# High-Level Architecture
App Router (/app) organizes pages with layouts and routes.

Redux manages auth and notes states globally.

Axios handles backend communication.

Tailwind ensures modern responsive UI and theming.

Next.js optimizes for performance, routing, and server-side rendering.

# Docker Setup

```bash
docker build -t nextjs-notes-frontend .
docker run -p 3000:3000 nextjs-notes-frontend
```

# Connect with Backend
```bash
http://localhost:8000
```
CORS must be enabled in FastAPI:

```bash
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

# Future Enhancements

Add user avatar & editable profile

Rich text notes with markdown support

Offline-first with local storage cache

Notifications for CRUD actions

Improved accessibility and animations

# Author
Sudhakar P

Software Developer | Cloud & Security Enthusiast

 CEH | CND | AZ-305 | AZ-500 | SC-100

 [p.sudhakar963@gmail.com]