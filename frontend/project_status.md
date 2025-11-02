# 📋 PROJEKT JUSTEASY - Aktuální stav a pokračování

## 🎯 O projektu

**Justeasy** je systém pro správu techniky, aut a řidičů pro filmové štáby.

-   Pronájem aut a lidí pro filmové projekty
-   Evidence smluv (contracts) s klienty
-   Sledování reportů práce (auta, řidiči, pracovníci)
-   Generování PDF výkazů a faktur

---

## 🏗️ Architektura

### **Backend (Express + Prisma + PostgreSQL)**

-   **Port:** 4000
-   **Framework:** Express 5
-   **ORM:** Prisma 6.x
-   **Database:** PostgreSQL (Docker)
-   **Validace:** Zod
-   **Auth:** JWT (access 15min + refresh 15 dní)

### **Frontend (Next.js 16)**

-   **Port:** 3000
-   **Framework:** Next.js 16 (App Router)
-   **UI:** shadcn/ui + Tailwind CSS
-   **Auth:** Server Actions
-   **Data fetching:** Server Components + Server Actions

---

## ✅ CO JE HOTOVO

### **Backend:**

1. ✅ **Databáze:**

    - Prisma schéma (User, UserToken)
    - PostgreSQL v Docker
    - Migrace

2. ✅ **Autentizace:**

    - Login endpoint (`/auth/login`) - vrací access + refresh token v JSON
    - Refresh endpoint (`/auth/refresh`) - token rotation (vrací oba nové tokeny)
    - Me endpoint (`/auth/me`) - info o přihlášeném uživateli
    - JWT tokeny (access 15min, refresh 15 dní)
    - Bcrypt hashování hesel

3. ✅ **Middleware:**

    - `verifyApiKey` - chrání backend před přímým přístupem (API_SECRET_KEY)
    - `requireAuth` - ověřuje JWT token
    - `validate` - Zod validace request body

4. ✅ **Validace:**

    - Zod schéma pro login (email + heslo)
    - Middleware pro automatickou validaci

5. ✅ **Utils:**

    - JWT (createAccessToken, createRefreshToken)
    - Hash (hashPassword, comparePassword)
    - Konstanty (token expiracje, bcrypt rounds)

6. ✅ **Testovací endpointy:**
    - `/health` - server health check
    - `/db-test` - databáze connection test
    - `/users/create-test` - vytvoření testovacího uživatele

### **Frontend:**

1. ✅ **Struktura:**

    - Next.js 16 projekt
    - Tailwind CSS
    - shadcn/ui komponenty (Button, Input, Card, Label)
    - TypeScript strict mode

2. ✅ **API Layer:**

    - `lib/api.ts` - Server-side API wrapper s automatickým refresh tokenem
    - Bezpečné - API_SECRET_KEY nikdy neopustí server
    - Token rotation - ukládá oba tokeny do cookies

3. ✅ **Auth:**

    - `actions/auth.ts` - Server Actions (loginAction, logoutAction, getCurrentUser)
    - Login stránka (`app/(auth)/login/page.tsx`)
    - Login formulář (`components/auth/LoginForm.tsx`)
    - httpOnly cookies pro oba tokeny

4. ✅ **Security:**
    - Všechna API volání jdou přes Server Actions
    - API_SECRET_KEY jen na serveru
    - httpOnly cookies (XSS protection)
    - Token rotation (refresh token security)

---

## 🔒 **Security Flow**

```
Browser (localhost:3000)
    ↓ Formulář
Next.js Server (Server Action)
    ↓ [s API_SECRET_KEY]
Express Backend (localhost:4000)
    ↓ [verifyApiKey middleware]
    ↓ Response (access + refresh token)
Next.js Server
    ↓ Uloží OBĚ tokeny do httpOnly cookies
Browser
    ✅ Cookies: accessToken (15min), refreshToken (15 dní)
```

**Automatic Token Refresh:**

```
API volání → 401 Unauthorized
    ↓
refreshAccessToken() (automaticky)
    ↓ POST /auth/refresh
    ↓ Nový access + refresh token
    ↓ Uloží do cookies
    ↓ Opakuje původní request
    ✅ Success
```

---

## 📁 **Struktura projektu**

```
justeasy25/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts              ← Zod validace ENV
│   │   │   └── constants.ts        ← Konstanty (token expiry atd.)
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.me.controller.ts
│   │   │   ├── auth.refresh.controller.ts
│   │   │   └── user.createTest.controller.ts
│   │   ├── middleware/
│   │   │   ├── requireAuth.ts      ← JWT auth check
│   │   │   ├── verifyApiKey.ts     ← API key check
│   │   │   └── validate.ts         ← Zod validation
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   └── db-test.routes.ts
│   │   ├── schemas/
│   │   │   └── auth.schema.ts      ← Zod schémata
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── hash.ts
│   │   ├── libs/
│   │   │   └── prisma.ts
│   │   ├── types/
│   │   │   └── express.d.ts        ← Type extensions
│   │   ├── app.ts                  ← Express app
│   │   └── server.ts               ← Server start
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env                        ← ENV variables
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── docker-compose.yaml
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   ├── login/
    │   │   │   │   └── page.tsx    ← Login stránka
    │   │   │   └── layout.tsx      ← Auth layout
    │   │   ├── layout.tsx          ← Root layout
    │   │   ├── page.tsx            ← Homepage
    │   │   └── globals.css
    │   ├── actions/
    │   │   └── auth.ts             ← Server Actions
    │   ├── components/
    │   │   ├── auth/
    │   │   │   └── LoginForm.tsx
    │   │   └── ui/                 ← shadcn komponenty
    │   │       ├── button.tsx
    │   │       ├── input.tsx
    │   │       ├── card.tsx
    │   │       └── label.tsx
    │   ├── lib/
    │   │   ├── api.ts              ← API wrapper (s auto-refresh)
    │   │   └── utils.ts
    │   └── config/
    │       └── const.ts            ← Konstanty (API_VERSION)
    ├── .env.local                  ← ENV variables
    ├── .env.local.example
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── tailwind.config.ts
    └── components.json             ← shadcn config
```

---

## 🔑 **Environment Variables**

### **Backend (.env):**

```bash
# Database
DATABASE_URL="postgresql://justeasy:justeasy@localhost:5432/justeasy"

# Server
NODE_ENV="development"
PORT=4000

# JWT
JWT_SECRET="your-jwt-secret-min-10-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret-min-10-chars"
JWT_REFRESH_EXPIRES_IN="15d"

# API Security
API_SECRET_KEY="justeasy-super-secret-api-key-min-32-chars-12345678"
```

### **Frontend (.env.local):**

```bash
# Backend API
BACKEND_URL=http://localhost:4000
API_SECRET_KEY=justeasy-super-secret-api-key-min-32-chars-12345678

# Next.js public
NEXT_PUBLIC_APP_NAME=Justeasy
```

---

## 🧪 **Testovací účet**

```
Email: patrik@sommer.media
Heslo: patrik11
Role: ADMIN
```

Vytvoření: `POST http://localhost:4000/users/create-test` (s API key)

---

## ❌ **CO ZBÝVÁ UDĚLAT**

### **1. Frontend validace ⚠️ PRIORITA**

-   [ ] Přidat Zod validaci do LoginForm
-   [ ] Error handling ve formulářích
-   [ ] Loading states
-   [ ] Success feedback

### **2. Zapomenuté heslo 🔐**

Backend:

-   [ ] POST `/auth/forgot-password` - pošle email s tokenem
-   [ ] POST `/auth/reset-password` - reset hesla s tokenem
-   [ ] Email service (např. nodemailer)

Frontend:

-   [ ] Stránka "Zapomenuté heslo"
-   [ ] Stránka "Reset hesla"

### **3. Dashboard 📊 PRIORITA**

-   [ ] Dashboard layout s navbar
-   [ ] Sidebar menu
-   [ ] User info v headeru
-   [ ] Statistiky (cards)
-   [ ] Rychlé akce

### **4. Middleware & Routes Protection 🛡️ PRIORITA**

-   [ ] Next.js middleware (`middleware.ts`)
-   [ ] Ochrana `/dashboard` routes
-   [ ] Redirect na `/login` pokud není přihlášen
-   [ ] Role-based access (admin, editor, user)

### **5. Logout 🚪**

Backend:

-   [ ] POST `/auth/logout` - smaže refresh token z DB

Frontend:

-   [ ] Logout button v navbar
-   [ ] Smaže cookies
-   [ ] Redirect na `/login`

### **6. Design & UX 🎨**

-   [ ] Design system (barvy, typography)
-   [ ] Responzivní layout
-   [ ] Loading skeletons
-   [ ] Error boundaries
-   [ ] Toast notifikace
-   [ ] Animace (framer-motion?)

### **7. Další entity (budoucí)**

-   [ ] Clients (CRUD)
-   [ ] Cars (CRUD)
-   [ ] Contracts (CRUD)
-   [ ] Reports (Cars, Drivers, Workers)
-   [ ] PDF generování

---

## 🚀 **Jak spustit projekt**

### **Backend:**

```bash
cd backend

# Instalace
npm install

# Spuštění PostgreSQL
docker-compose up -d

# Migrace databáze
npx prisma migrate dev
npx prisma generate

# Vytvoření testovacího uživatele
# POST http://localhost:4000/users/create-test
# Headers: X-API-Key: justeasy-super-secret-api-key-min-32-chars-12345678

# Spuštění
npm run dev
```

### **Frontend:**

```bash
cd frontend

# Instalace
npm install

# Spuštění
npm run dev
```

### **Test:**

1. Backend: http://localhost:4000/health
2. Frontend: http://localhost:3000/login
3. Login: patrik@sommer.media / patrik11

---

## 📝 **Důležité poznámky**

### **Security:**

-   ✅ API_SECRET_KEY chrání backend před přímým přístupem z browseru
-   ✅ Jen Next.js server může volat backend API
-   ✅ httpOnly cookies zabraňují XSS útokům
-   ✅ Token rotation zabraňuje zneužití ukradeného refresh tokenu
-   ✅ Access token má krátkou platnost (15 min)
-   ✅ Refresh token má dlouhou platnost (15 dní)

### **Architecture:**

-   ✅ Server Actions pro bezpečné API volání
-   ✅ Server Components pro data fetching
-   ✅ Automatic token refresh (transparentní pro uživatele)
-   ✅ Type-safe napříč celým stackem

### **Best Practices:**

-   ✅ Zod validace na backendu
-   ✅ TypeScript strict mode
-   ✅ Error handling
-   ✅ Konzistentní API response format
-   ✅ Separation of concerns (controllers, services, routes)

---

## 🎯 **Priority pro další práci:**

1. **Dashboard + Middleware (routes protection)** - aby uživatel po loginu měl kam jít
2. **Frontend validace** - lepší UX při chybách
3. **Logout** - kompletní auth flow
4. **Design systém** - jednotný look & feel
5. **Zapomenuté heslo** - optional, ale užitečné

---

## 🔧 **Technologie v použití**

**Backend:**

-   Node.js + TypeScript
-   Express 5
-   Prisma 6.x
-   PostgreSQL
-   Zod (validace)
-   JWT (jsonwebtoken)
-   bcryptjs (hashování)

**Frontend:**

-   Next.js 16 (App Router)
-   React 19
-   TypeScript
-   Tailwind CSS
-   shadcn/ui (Radix UI)
-   Server Actions

**DevOps:**

-   Docker (PostgreSQL)
-   npm scripts
-   ESLint
-   Prettier (optional)

---

## 📚 **Užitečné odkazy**

-   [Starý systém dokumentace](/justeasy-old.md)
-   Prisma schema: `backend/prisma/schema.prisma`
-   API dokumentace: (TODO - můžeme přidat Swagger)

---

**Připraveno pro pokračování! 🚀**
