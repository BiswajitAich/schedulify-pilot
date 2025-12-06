# Frontend – Employee Shift Management System  
Built using **Next.js 16+ (App Router)**, **TypeScript**, and **CSS Modules**.

This frontend provides a clean and responsive dashboard for:
- Employees → View their own shifts
- Admins → View all shifts, create shifts, delete users
- Both → See dashboard statistics (total employees, today’s shifts, upcoming shift)

---

## 📁 Project Structure

```
Directory structure:
└── frontend/
    ├── README.md
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── proxy.ts
    ├── tsconfig.json
    └── app/
        ├── globals.css
        ├── layout.tsx
        ├── page.module.css
        ├── page.tsx
        ├── types.ts
        ├── (home)/
        │   ├── home.module.css
        │   ├── layout.tsx
        │   ├── add-employee/
        │   │   ├── addEmployee.module.css
        │   │   └── page.tsx
        │   ├── add-shifts/
        │   │   └── page.tsx
        │   ├── home/
        │   │   ├── HomePage.module.css
        │   │   └── page.tsx
        │   └── profile/
        │       ├── page.tsx
        │       └── Profile.module.css
        ├── _components/
        │   ├── AdminShifts.tsx
        │   ├── Dashboard.tsx
        │   ├── EmployeeShifts.tsx
        │   ├── Footer.tsx
        │   ├── Header.tsx
        │   ├── Profile.tsx
        │   └── Sidebar.tsx
        ├── _utils/
        │   ├── cookie.ts
        │   └── user-contextProvider.tsx
        ├── api/
        │   ├── addEmployee/
        │   │   └── route.ts
        │   ├── addEmployeeShift/
        │   │   └── route.ts
        │   ├── deleteUser/
        │   │   └── route.ts
        │   ├── getAllShifts/
        │   │   └── route.ts
        │   ├── getEmployeeList/
        │   │   └── route.ts
        │   ├── getExtraInfo/
        │   │   └── route.ts
        │   ├── getMyShifts/
        │   │   └── route.ts
        │   └── getUser/
        │       └── route.ts
        ├── auth/
        │   ├── authAction.ts
        │   ├── page.tsx
        │   ├── _authComponents/
        │   │   ├── Login.tsx
        │   │   └── Signup.tsx
        │   └── styles/
        │       ├── auth.module.css
        │       ├── login.module.css
        │       └── signup.module.css
        └── styles/
            ├── DashBoard.module.css
            ├── Footer.module.css
            ├── Header.module.css
            ├── Profile.module.css
            └── Sidebar.module.css

```

---

## 🚀 Tech Stack
- **Next.js 16+**
- **React 19+**
- **TypeScript**
- **CSS Modules**
- **User Context Provider**
- **Postgres data consumed through custom backend**

---

## 🧩 Major Features

### ✔ Dashboard Overview
Displays:
- Total Employees
- Total Shifts Today
- Upcoming Shift
- Role-based shift listing

### ✔ Role-Based Rendering
```
Admin → <AdminShifts />
Employee → <EmployeeShifts />
```

### ✔ Admin Shifts Page
Fetch API:
```
GET /api/getAllShifts
```

Additional admin actions:
- Delete user  
- Check all shift records  

### ✔ Extra Dashboard Info
Fetch API:
```
GET /api/getExtraInfo
```

Returned data includes:
- totalEmployee
- totalShifts
- upcomingShift_date
- upcomingShift_startTime
- upcomingShift_endTime

...see more on code.

---

## 🧹 Code Style
- All components written in TypeScript.
- CSS modules use **camelCase class names**.
- “use client” added only where necessary.
- used server side rendering for private data.

---

## 🛠 Future Improvements
- Pagination for admin shift listing
- Search + filtering
- Charts for employees per department
- Dockerization
