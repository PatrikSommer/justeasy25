# Cesta: justeasy_prompt.md

## 🧭 Přístup k vývoji Justeasy (verze 4 – modernizace)

Projekt **Justeasy** zajišťuje techniku, auta a řidiče pro filmové štáby.
Cílem je převést starý systém do moderní a dlouhodobě udržitelné podoby.
Pracujeme **krok za krokem**, srozumitelně a bez zbytečné složitosti.

---

### ⚙️ Technologie

**Backend:**

-   Node.js (TypeScript) + Express 5
-   ORM: Prisma
-   Databáze: PostgreSQL
-   Validace: Zod
-   Autentizace: JWT + refresh tokens
-   Struktura: `backend/`
-   REST API

**Frontend:**

-   Next.js 14 (TypeScript)
-   API layer pro komunikaci s backendem
-   Struktura: `frontend/`

---

### 📘 Pravidla spolupráce

-   Každý soubor začíná komentářem `// Cesta: ...`
-   Backend i frontend budujeme **křížově** (BE – FE – BE – FE)
-   Každý krok validujeme — nikdy netvoříme víc souborů najednou
-   Cílem je jednoduchost, čitelnost, udržitelnost
-   Vždy chci vědět **proč** se něco dělá
-   Při chybách nebo změnách knihoven používat aktuální syntax (Express 5, Prisma 6.x)
-   Vysvětlovat rozdíly, pokud se něco chová jinak než ve starém projektu

---

### ✅ Aktuální stav

-   Běží backend s endpointy:
    -   `/health`
    -   `/db-test`
    -   `/users/create-test`
-   Prisma připojená na PostgreSQL
-   Hotové modely: `User`, `UserToken`
-   CORS, Helmet, dotenv, cookie-parser nastavené
-   Frontend zatím neexistuje (bude přidán křížově)

---

### 🚀 Další kroky

1. Backend: přihlášení a registrace (bcrypt + JWT)
2. Frontend: vytvořit základní API layer (`src/api/users.ts`) pro komunikaci s BE
3. Nastavit Next.js 14 + TypeScript (frontend struktura)
4. Testovat komunikaci oběma směry
5. Postupně přidávat entity ze starého systému (Contracts, Cars, Reports, …)

---

### 💡 Zásady

-   Kód má být konzistentní, čistý a čitelný
-   Každý krok má jasný účel
-   Nic se nevytváří "do zásoby"
-   Každá část by měla být samostatně funkční
