# Backend – Employee Shift Management System  
Built using **FastAPI**, **PostgreSQL**, and **asyncpg/psycopg** for async DB operations.

Handles:
- User creation & authentication
- Shift creation
- Shift overlap rules
- Dashboard analytics
- Admin utilities (delete user)
- Employee vs admin permissions

---

## 🧱 Project Structure

```
Directory structure:
└── backend/
    ├── README.md
    ├── main.py
    ├── pyproject.toml
    ├── .python-version
    └── app/
        ├── fun.py
        ├── types.py
        ├── db/
        │   ├── connections.py
        │   └── init_db.py
        └── routers/
            ├── auth.py
            ├── shifts.py
            └── users.py

```

---

## 🔧 Tech Stack
- **FastAPI**
- **async / await DB operations**
- **PostgreSQL**
- **Pydantic v2**
- **Docker-ready**

---

## 🗄 Database Schema

### USERS TABLE
- id (UUID PK)
- employee_code
- name
- role (admin/employee)
- created_at
- updated_at


### SHIFTS TABLE
- id (UUID PK)
- employee_id (FK → users.id)
- date
- start_time
- end_time
- created_by (FK → users.id)
- created_at

Rules:
- `ON DELETE CASCADE` for user → shifts

---

## 🚀 API Endpoints

### ✔ Add Shift
```
POST /shifts/v1/add-shift/
```
Prevents overlapping shifts.

### ✔ Get All Shifts (Admin)
```
GET /shifts/v1/get-all-shifts/
```

### ✔ Dashboard Extra Info
```
GET /shifts/v1/get-extra-info/
```

### ✔ Delete User (Admin)
```
DELETE /users/v1/delete-user/
```

... see more in code.

---

## 🛠 Future Add-ons
- JWT Authentication
- Department-wise analytics
- Shift editing feature
- Dockerization
