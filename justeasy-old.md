# 📋 PROJEKT JUSTEASY - Kompletní přehled starého systému

## 🎯 Účel projektu
**Justeasy** je systém pro správu techniky, aut a řidičů pro filmové štáby.
- Zajišťuje pronájem aut a lidí (řidiči, pracovníci) pro filmové projekty
- Eviduje smlouvy (contracts) s klienty
- Sleduje reporty práce (auta, řidiči, pracovníci)
- Generuje PDF výkazy a faktury

vzdy sleduj soubor kde vse je shrnuto justeasy-old.md

## 🎯 Účel projektu
**Justeasy** je systém pro správu techniky, aut a řidičů pro filmové štáby.
- Zajišťuje pronájem aut a lidí (řidiči, pracovníci) pro filmové projekty
- Eviduje smlouvy (contracts) s klienty
- Sleduje reporty práce (auta, řidiči, pracovníci)
- Generuje PDF výkazy a faktury

---

## 🗄️ Původní databázová struktura (TypeORM entity)

### **1. USERS (Uživatelé)**
```typescript
- id
- firstName, lastName
- email (unique)
- password
- phone, street, city, zipCode
- imageUrl (profilový obrázek)
- isActive (boolean)
- roles (enum: admin, editor, user)
- role (string)
- passwordChangedAt, passwordResetToken, passwordResetExpires
- createdAt, updatedAt
```

**Vztahy:**
- Má mnoho tokenů (UserToken)
- Má mnoho smluv přes ContractToUser
- Má mnoho reportů (reportUsers, reportCarDrivers, reportDrivers, reportWorkers)

---

### **2. USER_TOKEN (Refresh tokeny)**
```typescript
- id
- token (refresh token)
- user (vztah k User)
- createdAt
```

---

### **3. CAR_CATEGORY (Kategorie aut)**
```typescript
- id
- name
- createdAt, updatedAt
```

---

### **4. CAR (Auta)**
```typescript
- id
- name (název auta)
- spz (SPZ)
- isActive (boolean)
- carCategory (vztah k CarCategory)
- createdAt, updatedAt
```

**Vztahy:**
- Patří do kategorie (CarCategory)
- Má mnoho smluv přes ContractToCar
- Má mnoho reportů (reportCars, reportCarsDetail)

---

### **5. CLIENT (Klienti - filmové štáby)**
```typescript
- id
- companyName (název firmy)
- idNum (IČO)
- VAT (DIČ)
- companyEmail, companyPhone
- street, city, zipCode, country
- firstName, lastName (kontaktní osoba)
- email, phone (kontaktní osoba)
- note
- imageUrl (logo firmy)
- createdAt, updatedAt
```

---

### **6. CONTRACT (Smlouvy/Projekty)**
```typescript
- id
- name (název projektu)
- dateFrom, dateTo
- description
- status (varchar: 'active', 'closed', atd.)
- client (vztah k Client)
- createdAt, updatedAt
```

**Vztahy:**
- Patří klientovi (Client)
- Má přiřazená auta přes ContractToCar
- Má přiřazené uživatele přes ContractToUser
- Má mnoho reportů všech typů

---

### **7. CONTRACT_TO_CAR (Propojení smlouvy s auty)**
```typescript
- id
- contractId
- carId
- createdAt, updatedAt
```

---

### **8. CONTRACT_TO_USER (Propojení smlouvy s uživateli)**
```typescript
- id
- contractId
- userId
- createdAt, updatedAt
```

---

### **9. REPORT_CAR (Denní report auta)**
```typescript
- id
- contractId
- carId
- date
- driveKm (najeto km)
- status (active/closed)
- reportNumber (číslo reportu)
- dailyRate (denní sazba)
- includedKm (km v ceně)
- ratePerKm (sazba za km)
- costs (náklady)
- createdAt, updatedAt
```

**Popis:** Hlavní záznam o práci auta v daný den na projektu.

---

### **10. REPORT_CAR_DRIVER (Řidič přiřazený k autu)**
```typescript
- id
- contractId
- reportCarId
- userId (řidič)
- carId
- date
- workedHours (odpracované hodiny)
- costs (náklady řidiče)
- createdAt, updatedAt
```

**Popis:** Přiřazení řidiče k autu v konkrétní den.

---

### **11. REPORT_CAR_DETAIL (Detaily jízd auta)**
```typescript
- id
- reportCarId
- reportCarDriverId
- reportDriverId
- contractId
- carId
- userId
- status
- date
- timeFrom, timeTo
- workedHours (hodiny)
- driveKm (km)
- description
- costs, descriptionCosts
- costsDriver, descriptionCostsDriver
- createdAt, updatedAt
```

**Popis:** Detailní záznamy jednotlivých jízd/směn.

---

### **12. REPORT_DRIVER (Denní report řidiče)**
```typescript
- id
- contractId
- userId (řidič)
- date
- workedHours
- costs
- status
- reportNumber
- dailyWorkingHours (standardní pracovní doba)
- buyDriver (nákupní cena normál)
- saleDriver (prodejní cena normál)
- buyOverDriver (nákupní cena přesčas)
- saleOverDriver (prodejní cena přesčas)
- createdAt, updatedAt
```

**Popis:** Shrnutí práce řidiče za den (pro fakturaci).

---

### **13. REPORT_WORKER (Denní report pracovníka)**
```typescript
- id
- contractId
- userId (pracovník)
- date
- workedHours
- status
- reportNumber
- dailyWorkingHours
- buyWorker, saleWorker
- buyOverWorker, saleOverWorker
- costs
- createdAt, updatedAt
```

**Popis:** Shrnutí práce pracovníka za den.

---

### **14. REPORT_WORKER_DETAIL (Detaily směn pracovníka)**
```typescript
- id
- reportWorkerId
- contractId
- userId
- date
- timeFrom, timeTo
- workedHours
- description
- costs, descriptionCosts
- createdAt, updatedAt
```

---

### **15. REPORT_DOCUMENT (Generované dokumenty)**
```typescript
- id
- documentNumber (číslo faktury/dokladu)
- contractId
- date
- type ('worker' | 'car')
- createdAt, updatedAt
```

**Popis:** Evidence vygenerovaných PDF dokumentů pro fakturaci.

---

## 🔐 Původní autentizace a autorizace

### **Systém rolí**
```typescript
enum UserRole {
  ADMIN = 'admin',    // plná správa
  EDITOR = 'editor',  // správa dat (cars, clients, contracts)
  USER = 'user'       // základní práce s reporty
}
```

### **JWT autentizace**
- **Access token** (krátká platnost) - v cookie
- **Refresh token** (dlouhá platnost) - v databázi (UserToken)
- Reset hesla přes email s tokenem

### **Middleware**
- `authProtect` - ověření platného JWT
- `restrictTo(role)` - kontrola oprávnění

---

## 📁 Původní struktura backendu

```
api/
├── src/
│   ├── controllers/        # Logika endpointů
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── car.controller.ts
│   │   ├── client.controller.ts
│   │   ├── contract.controller.ts
│   │   └── report.controller.ts
│   │
│   ├── routes/            # Definice routů
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── dials.routes.ts (cars, car-category)
│   │   ├── clients.routes.ts
│   │   ├── contracts.routes.ts
│   │   └── myContracts.routes.ts
│   │
│   ├── entity/            # TypeORM entity
│   ├── validator/         # Joi validační schémata
│   ├── middleware/        # Auth, error handling
│   ├── errors/            # Custom error třídy
│   ├── utils/             # Pomocné funkce (JWT, email)
│   └── db/                # TypeORM connect
```

---

## 🖥️ Původní struktura frontendu

```
client/
├── src/
│   ├── pages/             # Stránky aplikace
│   │   ├── login/
│   │   ├── contracts/
│   │   ├── clients/
│   │   ├── cars/
│   │   ├── users/
│   │   └── reports/
│   │
│   ├── components/        # Znovupoužitelné komponenty
│   │   ├── Layout/
│   │   ├── modal/
│   │   ├── pdf/
│   │   └── uiComponents/
│   │
│   ├── context/           # React Context (state management)
│   │   ├── appContext/
│   │   ├── clientsContext/
│   │   ├── carsContext/
│   │   └── contractsContext/
│   │
│   ├── utils/             # Fetch, hooks
│   └── translate/         # Překladové klíče
```

---

## 🚀 Hlavní funkce systému

### **1. Správa smluv (Contracts)**
- Vytvoření projektu pro klienta
- Přiřazení aut a lidí k projektu
- Nastavení období platnosti

### **2. Evidence práce - Reporty**

#### **A) Report auta (Cars)**
- Denní záznam práce auta
- Km ujeté, náklady
- Přiřazení řidiče
- Detaily jízd (timeFrom-timeTo)

#### **B) Report řidiče (Drivers)**
- Odpracované hodiny
- Rozdělení na normální/přesčasové hodiny
- Nákupní a prodejní ceny (pro výpočet marže)

#### **C) Report pracovníka (Workers)**
- Podobné jako řidiči
- Evidence směn s časovými údaji

### **3. Generování PDF**
- Výkazy práce pro klienty
- Faktury
- Export do PDF přes `@react-pdf/renderer`

### **4. Uživatelské role**
- **Admin**: vše
- **Editor**: správa číselníků, smluv
- **User**: práce se svými reporty

---

## 🔧 Původní technologie

### **Backend**
- Node.js + TypeScript
- Express 4.x
- TypeORM
- MariaDB (MySQL)
- Joi (validace)
- JWT (autentizace)
- bcryptjs (hashování hesel)
- Multer (upload obrázků)

### **Frontend**
- React 18
- TypeScript
- Material-UI (MUI)
- React Router v6
- React Hook Form
- Joi (validace formulářů)
- Axios (HTTP requesty)
- @react-pdf/renderer (PDF generování)
- Context API (state management)

---

## 📊 Hlavní workflow

### **Typický scénář použití:**

1. **Editor vytvoří smlouvu** (Contract)
   - Přiřadí klienta
   - Přiřadí auta z číselníku
   - Přiřadí řidiče/pracovníky

2. **User (řidič/pracovník) vyplňuje reporty**
   - Každý den zadá odpracované hodiny
   - U aut zadá km
   - Přidá náklady (PHM, atd.)

3. **Editor schvaluje a uzavírá reporty**
   - Zkontroluje data
   - Změní status na "closed"

4. **Generování dokumentů**
   - Editor vytvoří PDF výkaz
   - Systém přiřadí číslo dokumentu
   - PDF se stáhne

---

## ⚠️ Problémy starého systému (důvody refactoru)

1. **Zastarálé závislosti**
   - Express 4 (nyní 5)
   - TypeORM (nyní preferujeme Prisma)
   - Staré verze knihoven

2. **Složitá databázová struktura**
   - Mnoho propojovacích tabulek
   - Komplikovaná logika reportů
   - Těžko rozšiřitelné

3. **Chybějící moderní přístup**
   - Žádné testy
   - Chybí dokumentace API
   - Nekonzistentní error handling

4. **Frontend**
   - Context API je pro větší app složitý
   - Chybí TypeScript všude
   - Velké komponenty

---

## 🎯 Cíl nového systému

Přepsat vše do **moderní, udržitelné a škálovatelné** podoby:

✅ **Backend:**
- Express 5
- Prisma 6.x (místo TypeORM)
- PostgreSQL
- Zod (místo Joi)
- Lepší struktura kódu (malé funkce)

✅ **Frontend:**
- Next.js 16 (místo React)
- Server Components kde má smysl
- Fetch v Action
- Lepší state management
- Modulární komponenty

✅ **Obecně:**
- Best practices
- Čistý kód
- Srozumitelnost
- Dokumentace
- Postupná migrace dat

---

## 📝 Poznámky k migraci

### **Zachovat:**
- Logiku reportování (cars, drivers, workers)
- Systém rolí (admin, editor, user)
- PDF generování
- Upload obrázků

### **Zlepšit:**
- Zjednodušit databázový model
- Přejmenovat tabulky do angličtiny kde má smysl
- Lépe strukturovat reporty
- Přidat validace na DB úrovni

### **Přidat:**
- Logy změn
- Audit trail
- Lepší error handling
- API dokumentace

---

## 📅 Data k migraci

Bude potřeba převést data z původní MariaDB:
- Users (+ role)
- Clients
- Cars + CarCategory
- Contracts + propojení
- Všechny reporty (důležitá data!)
- Documents (čísla faktur)

---

**Tento dokument slouží jako referenční bod pro celý refaktoring projektu Justeasy.**


---

## 🗄️ Původní databázová struktura (TypeORM entity)

### **1. USERS (Uživatelé)**
```typescript
- id
- firstName, lastName
- email (unique)
- password
- phone, street, city, zipCode
- imageUrl (profilový obrázek)
- isActive (boolean)
- roles (enum: admin, editor, user)
- role (string)
- passwordChangedAt, passwordResetToken, passwordResetExpires
- createdAt, updatedAt
```

**Vztahy:**
- Má mnoho tokenů (UserToken)
- Má mnoho smluv přes ContractToUser
- Má mnoho reportů (reportUsers, reportCarDrivers, reportDrivers, reportWorkers)

---

### **2. USER_TOKEN (Refresh tokeny)**
```typescript
- id
- token (refresh token)
- user (vztah k User)
- createdAt
```

---

### **3. CAR_CATEGORY (Kategorie aut)**
```typescript
- id
- name
- createdAt, updatedAt
```

---

### **4. CAR (Auta)**
```typescript
- id
- name (název auta)
- spz (SPZ)
- isActive (boolean)
- carCategory (vztah k CarCategory)
- createdAt, updatedAt
```

**Vztahy:**
- Patří do kategorie (CarCategory)
- Má mnoho smluv přes ContractToCar
- Má mnoho reportů (reportCars, reportCarsDetail)

---

### **5. CLIENT (Klienti - filmové štáby)**
```typescript
- id
- companyName (název firmy)
- idNum (IČO)
- VAT (DIČ)
- companyEmail, companyPhone
- street, city, zipCode, country
- firstName, lastName (kontaktní osoba)
- email, phone (kontaktní osoba)
- note
- imageUrl (logo firmy)
- createdAt, updatedAt
```

---

### **6. CONTRACT (Smlouvy/Projekty)**
```typescript
- id
- name (název projektu)
- dateFrom, dateTo
- description
- status (varchar: 'active', 'closed', atd.)
- client (vztah k Client)
- createdAt, updatedAt
```

**Vztahy:**
- Patří klientovi (Client)
- Má přiřazená auta přes ContractToCar
- Má přiřazené uživatele přes ContractToUser
- Má mnoho reportů všech typů

---

### **7. CONTRACT_TO_CAR (Propojení smlouvy s auty)**
```typescript
- id
- contractId
- carId
- createdAt, updatedAt
```

---

### **8. CONTRACT_TO_USER (Propojení smlouvy s uživateli)**
```typescript
- id
- contractId
- userId
- createdAt, updatedAt
```

---

### **9. REPORT_CAR (Denní report auta)**
```typescript
- id
- contractId
- carId
- date
- driveKm (najeto km)
- status (active/closed)
- reportNumber (číslo reportu)
- dailyRate (denní sazba)
- includedKm (km v ceně)
- ratePerKm (sazba za km)
- costs (náklady)
- createdAt, updatedAt
```

**Popis:** Hlavní záznam o práci auta v daný den na projektu.

---

### **10. REPORT_CAR_DRIVER (Řidič přiřazený k autu)**
```typescript
- id
- contractId
- reportCarId
- userId (řidič)
- carId
- date
- workedHours (odpracované hodiny)
- costs (náklady řidiče)
- createdAt, updatedAt
```

**Popis:** Přiřazení řidiče k autu v konkrétní den.

---

### **11. REPORT_CAR_DETAIL (Detaily jízd auta)**
```typescript
- id
- reportCarId
- reportCarDriverId
- reportDriverId
- contractId
- carId
- userId
- status
- date
- timeFrom, timeTo
- workedHours (hodiny)
- driveKm (km)
- description
- costs, descriptionCosts
- costsDriver, descriptionCostsDriver
- createdAt, updatedAt
```

**Popis:** Detailní záznamy jednotlivých jízd/směn.

---

### **12. REPORT_DRIVER (Denní report řidiče)**
```typescript
- id
- contractId
- userId (řidič)
- date
- workedHours
- costs
- status
- reportNumber
- dailyWorkingHours (standardní pracovní doba)
- buyDriver (nákupní cena normál)
- saleDriver (prodejní cena normál)
- buyOverDriver (nákupní cena přesčas)
- saleOverDriver (prodejní cena přesčas)
- createdAt, updatedAt
```

**Popis:** Shrnutí práce řidiče za den (pro fakturaci).

---

### **13. REPORT_WORKER (Denní report pracovníka)**
```typescript
- id
- contractId
- userId (pracovník)
- date
- workedHours
- status
- reportNumber
- dailyWorkingHours
- buyWorker, saleWorker
- buyOverWorker, saleOverWorker
- costs
- createdAt, updatedAt
```

**Popis:** Shrnutí práce pracovníka za den.

---

### **14. REPORT_WORKER_DETAIL (Detaily směn pracovníka)**
```typescript
- id
- reportWorkerId
- contractId
- userId
- date
- timeFrom, timeTo
- workedHours
- description
- costs, descriptionCosts
- createdAt, updatedAt
```

---

### **15. REPORT_DOCUMENT (Generované dokumenty)**
```typescript
- id
- documentNumber (číslo faktury/dokladu)
- contractId
- date
- type ('worker' | 'car')
- createdAt, updatedAt
```

**Popis:** Evidence vygenerovaných PDF dokumentů pro fakturaci.

---

## 🔐 Původní autentizace a autorizace

### **Systém rolí**
```typescript
enum UserRole {
  ADMIN = 'admin',    // plná správa
  EDITOR = 'editor',  // správa dat (cars, clients, contracts)
  USER = 'user'       // základní práce s reporty
}
```

### **JWT autentizace**
- **Access token** (krátká platnost) - v cookie
- **Refresh token** (dlouhá platnost) - v databázi (UserToken)
- Reset hesla přes email s tokenem

### **Middleware**
- `authProtect` - ověření platného JWT
- `restrictTo(role)` - kontrola oprávnění

---

## 📁 Původní struktura backendu

```
api/
├── src/
│   ├── controllers/        # Logika endpointů
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── car.controller.ts
│   │   ├── client.controller.ts
│   │   ├── contract.controller.ts
│   │   └── report.controller.ts
│   │
│   ├── routes/            # Definice routů
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── dials.routes.ts (cars, car-category)
│   │   ├── clients.routes.ts
│   │   ├── contracts.routes.ts
│   │   └── myContracts.routes.ts
│   │
│   ├── entity/            # TypeORM entity
│   ├── validator/         # Joi validační schémata
│   ├── middleware/        # Auth, error handling
│   ├── errors/            # Custom error třídy
│   ├── utils/             # Pomocné funkce (JWT, email)
│   └── db/                # TypeORM connect
```

---

## 🖥️ Původní struktura frontendu

```
client/
├── src/
│   ├── pages/             # Stránky aplikace
│   │   ├── login/
│   │   ├── contracts/
│   │   ├── clients/
│   │   ├── cars/
│   │   ├── users/
│   │   └── reports/
│   │
│   ├── components/        # Znovupoužitelné komponenty
│   │   ├── Layout/
│   │   ├── modal/
│   │   ├── pdf/
│   │   └── uiComponents/
│   │
│   ├── context/           # React Context (state management)
│   │   ├── appContext/
│   │   ├── clientsContext/
│   │   ├── carsContext/
│   │   └── contractsContext/
│   │
│   ├── utils/             # Fetch, hooks
│   └── translate/         # Překladové klíče
```

---

## 🚀 Hlavní funkce systému

### **1. Správa smluv (Contracts)**
- Vytvoření projektu pro klienta
- Přiřazení aut a lidí k projektu
- Nastavení období platnosti

### **2. Evidence práce - Reporty**

#### **A) Report auta (Cars)**
- Denní záznam práce auta
- Km ujeté, náklady
- Přiřazení řidiče
- Detaily jízd (timeFrom-timeTo)

#### **B) Report řidiče (Drivers)**
- Odpracované hodiny
- Rozdělení na normální/přesčasové hodiny
- Nákupní a prodejní ceny (pro výpočet marže)

#### **C) Report pracovníka (Workers)**
- Podobné jako řidiči
- Evidence směn s časovými údaji

### **3. Generování PDF**
- Výkazy práce pro klienty
- Faktury
- Export do PDF přes `@react-pdf/renderer`

### **4. Uživatelské role**
- **Admin**: vše
- **Editor**: správa číselníků, smluv
- **User**: práce se svými reporty

---

## 🔧 Původní technologie

### **Backend**
- Node.js + TypeScript
- Express 4.x
- TypeORM
- MariaDB (MySQL)
- Joi (validace)
- JWT (autentizace)
- bcryptjs (hashování hesel)
- Multer (upload obrázků)

### **Frontend**
- React 18
- TypeScript
- Material-UI (MUI)
- React Router v6
- React Hook Form
- Joi (validace formulářů)
- Axios (HTTP requesty)
- @react-pdf/renderer (PDF generování)
- Context API (state management)

---

## 📊 Hlavní workflow

### **Typický scénář použití:**

1. **Editor vytvoří smlouvu** (Contract)
   - Přiřadí klienta
   - Přiřadí auta z číselníku
   - Přiřadí řidiče/pracovníky

2. **User (řidič/pracovník) vyplňuje reporty**
   - Každý den zadá odpracované hodiny
   - U aut zadá km
   - Přidá náklady (PHM, atd.)

3. **Editor schvaluje a uzavírá reporty**
   - Zkontroluje data
   - Změní status na "closed"

4. **Generování dokumentů**
   - Editor vytvoří PDF výkaz
   - Systém přiřadí číslo dokumentu
   - PDF se stáhne

---

## ⚠️ Problémy starého systému (důvody refactoru)

1. **Zastarálé závislosti**
   - Express 4 (nyní 5)
   - TypeORM (nyní preferujeme Prisma)
   - Staré verze knihoven

2. **Složitá databázová struktura**
   - Mnoho propojovacích tabulek
   - Komplikovaná logika reportů
   - Těžko rozšiřitelné

3. **Chybějící moderní přístup**
   - Žádné testy
   - Chybí dokumentace API
   - Nekonzistentní error handling

4. **Frontend**
   - Context API je pro větší app složitý
   - Chybí TypeScript všude
   - Velké komponenty

---

## 🎯 Cíl nového systému

Přepsat vše do **moderní, udržitelné a škálovatelné** podoby:

✅ **Backend:**
- Express 5
- Prisma 6.x (místo TypeORM)
- PostgreSQL
- Zod (místo Joi)
- Lepší struktura kódu (malé funkce)

✅ **Frontend:**
- Next.js 16 (místo React)
- Server Components kde má smysl
- Fetch v Action
- Lepší state management
- Modulární komponenty

✅ **Obecně:**
- Best practices
- Čistý kód
- Srozumitelnost
- Dokumentace
- Postupná migrace dat

---

## 📝 Poznámky k migraci

### **Zachovat:**
- Logiku reportování (cars, drivers, workers)
- Systém rolí (admin, editor, user)
- PDF generování
- Upload obrázků

### **Zlepšit:**
- Zjednodušit databázový model
- Přejmenovat tabulky do angličtiny kde má smysl
- Lépe strukturovat reporty
- Přidat validace na DB úrovni

### **Přidat:**
- Logy změn
- Audit trail
- Lepší error handling
- API dokumentace

---

## 📅 Data k migraci

Bude potřeba převést data z původní MariaDB:
- Users (+ role)
- Clients
- Cars + CarCategory
- Contracts + propojení
- Všechny reporty (důležitá data!)
- Documents (čísla faktur)

---

**Tento dokument slouží jako referenční bod pro celý refaktoring projektu Justeasy.**
