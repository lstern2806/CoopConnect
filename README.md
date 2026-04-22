<div align="center">

# 🐾 NU Co-op Connect

**The all-in-one co-op platform built by Huskies, for Huskies.**

Anonymous reviews · Alumni networking · Application tracking · Curated resources

---

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

[![View Live](https://img.shields.io/badge/View_Live-16A34A?style=for-the-badge&logo=googlechrome&logoColor=white)](#)
[![Report Bug](https://img.shields.io/badge/Report_Bug-C8102E?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lstern2806/CoopConnect/issues/new?labels=bug&template=bug_report.md)
[![Request Feature](https://img.shields.io/badge/Request_Feature-7C3AED?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lstern2806/CoopConnect/issues/new?labels=enhancement&template=feature_request.md)

</div>

---

## About

NU Co-op Connect is a web platform where Northeastern University students sign in with their **@northeastern.edu** or **@husky.neu.edu** email and get a personal hub for their entire co-op journey. Browse anonymous co-op reviews from fellow Huskies, connect with alumni who've opted in, track every application in a Kanban board, and find curated industry resources — all in one place.

---

## Features

| | Feature | Description |
|---|---------|-------------|
| 👤 | **Student Profiles** | Sign up with your NU email. Add your major, year, co-op cycle, and interests. |
| 💬 | **Anonymous Co-op Reviews** | Read and write reviews tagged by skills, tools, and culture. Every reviewer gets a random name like "Brave Husky" — no identities stored. |
| 🤝 | **Networking Directory** | Find and connect with alumni and peers who've opted in. Filter by company, role, or industry. |
| 📋 | **Application Tracker** | Drag-and-drop Kanban board to manage your applications. Track statuses, attach resumes, and see your pipeline at a glance. |
| 📚 | **Curated Resources** | Bookmark page built for co-op students — NU Library, LinkedIn, IBISWorld, interview prep, and more. |
| 📧 | **Email Notifications** | Get notified about networking intros and application status changes. |

---

## Tech Stack

| Tool | Purpose | Cost |
|------|---------|------|
| **React + Vite** | Frontend framework + build tool | Free |
| **Tailwind CSS v4** | Utility-first styling with NU brand tokens | Free |
| **React Router v7** | Client-side routing | Free |
| **Supabase** | Auth, Postgres database, file storage | Free |
| **Express** | REST API backend | Free |
| **Vercel** | Frontend hosting + CDN | Free |
| **Railway** | Backend hosting | ~$5/mo |
| **Resend** | Transactional email | Free |

---

## Project Structure

```
CoopConnect/
├── docs/
│   ├── scope.html          # Project scope document
│   ├── plan.md             # Build roadmap (gitignored)
│   └── stack.md            # Tech stack + service links
└── my-app/
    ├── public/
    │   └── images/          # Logo assets
    ├── src/
    │   ├── components/      # Reusable UI (Navbar, Modal, Cards...)
    │   ├── pages/           # Route pages (Login, Dashboard, Reviews...)
    │   ├── lib/             # Supabase client, profanity filter, utils
    │   ├── context/         # AuthContext (session state)
    │   └── hooks/           # Custom hooks (useAuth)
    └── backend/
        ├── server.js        # Express entry point
        ├── routes/          # API route handlers
        ├── middleware/       # Auth JWT verification
        └── lib/             # Supabase service client, Resend client
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A [Supabase](https://supabase.com/dashboard) project (free tier)

### Installation

```bash
# Clone the repo
git clone https://github.com/lstern2806/CoopConnect.git
cd CoopConnect
```

### Frontend Setup

```bash
cd my-app
npm install
cp .env.example .env        # Add your Supabase credentials
npm run dev                  # → http://localhost:5173
```

### Backend Setup

```bash
cd my-app/backend
npm install
cp .env.example .env        # Add your Supabase + Resend credentials
node server.js               # → http://localhost:3001
```

---

## Environment Variables

### Frontend (`my-app/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

### Backend (`my-app/backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `CLIENT_ORIGIN` | Frontend URL for CORS (default: http://localhost:5173) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret) |
| `RESEND_API_KEY` | Resend API key for sending emails |

---

## Roadmap

- [x] Project scaffolding (React + Vite + Tailwind v4 + Express)
- [x] Security headers (Helmet, CORS, body limits)
- [ ] Auth — email + password & magic link (NU email only)
- [ ] Student profiles with character limits
- [ ] Anonymous co-op reviews with profanity filter
- [ ] Kanban application tracker with drag-and-drop
- [ ] Networking directory (opt-in, consent-based)
- [ ] Curated resources page
- [ ] Email notifications via Resend
- [ ] Dashboard with analytics
- [ ] Production deployment (Vercel + Railway)

See the full [build plan](docs/plan.md) for sprint details.

---

## Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please make sure your code follows the existing style and all Tailwind utility classes use the `nu-` brand tokens where applicable.

---

## License

This is a **proprietary project**. All rights reserved.

**© 2026 Malika Coulibaly & Leah Sternberg.** Unauthorized use, distribution, or reproduction is prohibited.

---

<div align="center">

![Student Project](https://img.shields.io/badge/Student_Project-C8102E?style=for-the-badge&logoColor=white)

</div>
