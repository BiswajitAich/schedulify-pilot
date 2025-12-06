# Frontend – Employee Shift Management System  
Built using **Next.js 16+ (App Router)**, **TypeScript**, and **CSS Modules**.

This frontend provides a clean and responsive dashboard for:
- Employees → View their own shifts
- Admins → View all shifts, create shifts, delete users
- Both → See dashboard statistics (total employees, today’s shifts, upcoming shift)

---

## 📁 Project Structure

```
frontend/
│── app/
│   ├── api/
│   │   ├── getAllShifts/
│   │   ├── getMyShifts/
│   │   ├── addShift/
│   │   ├── deleteUser/
│   │   └── getExtraInfo/
│   ├── dashboard/
│   │   ...
│   ├── styles/
│   │   └── DashBoard.module.css
│   │   ...
│   └── _utils/
│       └── user-contextProvider.tsx
│       ...
│
├── public/
├── package.json
└── tsconfig.json
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
