# Employee Shift Management System  
Full-stack project built with **Next.js (frontend)** + **FastAPI (backend)** + **PostgreSQL**.

Provides:
- Complete employee shift management workflow
- Role-based access (Admin / Employee)
- Dashboard with analytics
- Ability to add, view, and manage employee shifts
- Fully async backend
- Clean, responsive UI with CSS Modules

---

## 📦 Tech Stack

### **Frontend**
- Next.js 16+
- React 19+
- TypeScript
- CSS Modules
- Context API for auth state

### **Backend**
- FastAPI
- PostgreSQL
- asyncpg/psycopg
- Pydantic v2
- [UV](https://docs.astral.sh/uv/guides/install-python/)

### **Database**
- PostgreSQL with FK + cascade delete

---

## 🚀 Features

### **Admin Capabilities**
- View all employee shifts
- Create shifts
- Delete users
- Prevent overlapping shift creation
- Dashboard analytics

### **Employee Capabilities**
- View personal shifts
- See upcoming shift
- Basic dashboard stats

### **System Features**
- Fully async API
- Clean modular route structure
- Time-safe & conflict-safe shift creation
- Reusable API endpoints consumed by frontend

---

## 🧱 Project Structure

```
/project-root
│── frontend/
│   ├── app/
│   ├── api/
│   ├── styles/
│   └── ...
│
│── backend/
│   ├── app/
│   ├── routes/
│   ├── db/
│   └── types.py
│
├── README.md
└── docker-compose.yml (optional)
```

---

## ⚙ Local Setup Instructions

### 1️⃣ Clone the repository
```
git clone <repo-url>
cd project-root
```

---

## 2️⃣ Setup Backend

```
cd backend
uv run fastapi dev
```

Backend runs at:
```
http://localhost:8000
```

---

## 3️⃣ Setup Frontend

```
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:3000
```

---

## 🔗 Environment Variables

### **frontend/.env.local**
```
EMAIL_USER=user@gmail.com
EMAIL_PASS=...........

REDIS_USERNAME=default
REDIS_PASSWORD=..........
REDIS_HOST=redis...........com
REDIS_PORT=..........

BACKEND_API=http://127.0.0.1:8000/
JWT_SECRET_KEY=b..........3
```

### **backend/.env**
```
DATABASE_URL=postgresql://neondb_owner:.....@........aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## 🚀 Deployment
Both apps can be deployed independently:
- Frontend → Vercel / Netlify
- Backend → Render / Railway / Docker + VPS
- PostgreSQL → NeonDB / Railway / Supabase

---

## 📈 Future Enhancements
- JWT login system
- Employee department-based reports
- Shift editing
- Calendar view
- Notifications for upcoming shifts

