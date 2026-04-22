# NU Co-op Connect — Tech Stack

## Stack

| Tool | Purpose | Cost |
|------|---------|------|
| React + Vite | Frontend framework + build tool | Free |
| Tailwind CSS v4 | Utility-first CSS styling | Free |
| React Router v7 | Client-side routing | Free |
| Supabase | Database, auth, file storage | Free |
| Express (Node.js) | REST API backend | Free |
| Vercel | Frontend hosting | Free |
| Railway | Backend hosting | ~$5/mo |
| Resend | Transactional email | Free |

**Estimated monthly cost: ~$5/month**

---

## Service Logins

| Service | Dashboard |
|---------|-----------|
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com/dashboard |
| Railway | https://railway.com/dashboard |
| Resend | https://resend.com/overview |

---

## Environment Variables

### Frontend (`my-app/.env`)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

### Backend (`my-app/backend/.env`)

```
PORT=3001
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

---

## Brand Reference

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `nu-red` | #C8102E | Primary NU red |
| `nu-red-light` | #E8354E | Accent, hover states |
| `nu-black` | #111 | Headings, primary text |
| `nu-gray-700` | #444 | Body text (dark) |
| `nu-gray-600` | #555 | Body text |
| `nu-gray-500` | #777 | Secondary text |
| `nu-gray-400` | #999 | Muted text |
| `nu-gray-200` | #ddd | Borders |
| `nu-gray-100` | #F3F3F3 | Backgrounds |
| `nu-green` | #16A34A | Success, "Building" tags |
| `nu-orange` | #EA580C | Warning, "Later" tags |
| `nu-purple` | #7C3AED | Info, "Discuss" tags |

### Fonts

| Font | Usage | Tailwind Class |
|------|-------|----------------|
| Outfit | Headings, titles | `font-heading` |
| DM Sans | Body text, UI | `font-body` |
