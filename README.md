# 📈 NexTrade — Personal Trading Journal & Analytics  
A modern, full-stack **trading journal** built with Next.js 15, PostgreSQL (raw SQL), shadcn/ui, and TanStack Table.  
Track your trades, evaluate performance, analyze strategies, and manage portfolios — all inside a clean, fast, and intuitive dashboard.

---

## 🚀 Tech Stack

- **Next.js 15** (App Router, RSC, Server Actions)
- **TypeScript**
- **PostgreSQL** (raw SQL, no ORM)
- **shadcn/ui**
- **TanStack Table v8** (sorting, filtering)
- **Tailwind CSS**
- **Session-based Authentication**

---

## 📊 Features

### 🧾 Trade Management  
- Add/update/delete trades  
- Track entry, exit, stop loss, target  
- Connect trades with strategy + portfolio  
- Auto-default fields: net PnL, fees, dates  

### 🔍 Data Table (shadcn + TanStack)
- Sorting  
- Filtering  
- Global search  
- Clean shadcn UI  
- Optimized for large datasets  

### 💾 Real Database (PostgreSQL)
- Normalized schema  
- Strong constraints (exit validation, sl/tp, etc.)  
- Raw SQL for performance + full control  
- User-isolated data (session-based)  

---

### 📂 Project Structure

```bash
NEXT-TRADE

├── app
│   ├── (protected)
│   │   ├── dashboard
│   │   │   ├── analytics
│   │   │   └── trades
│   │   └── profile
│   ├── (public)
│   │   ├── sign-in
│   │   └── sign-up
│   ├── api     (if you add later, optional)
│   └── shared  (optional future folder)
│
├── lib
│   ├── actions
│   ├── auth
│   ├── components
│   │   ├── custom
│   │   ├── providers
│   │   └── ui
│   ├── db
│   ├── types
│   └── utils   (file, but keeping as a folder if you want later)
│
├── node_modules
├── public
└── .env.local  (ignored in git)

```
___

## 🧑‍💻 Running Locally

### 1️⃣ Install dependencies
```bash
pnpm install 
```

### 2️⃣ Create .env.local

```bash 
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/nextrade
AUTH_SECRET=your-secret
```

### 3️⃣ Apply the database schema

```bash
psql < schema.sql
```

### 4️⃣ Start the development server

```bash
pnpm run dev
```
---

## 🤝 Contributing

- Contributions, ideas, and feature suggestions are welcome!
Open an issue or submit a PR if you'd like to improve the project.


---

## 🧑‍🏫 Author

- Gokul Venkatraman
- Full-Stack Developer | AI Learner | Trader
- Building tools that are actually useful 📈🔥



