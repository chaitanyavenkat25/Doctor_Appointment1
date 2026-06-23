# DocBook — MERN Stack Doctor Appointment System

A full-stack Doctor Appointment System built with MongoDB, Express.js, React.js, and Node.js.

## Features

### Patient
- Register/Login with JWT
- Browse & search doctors (filter by specialization, experience, fee)
- Book, cancel appointments
- View appointment history with status tracking
- Write doctor reviews with star ratings
- Manage profile & change password

### Doctor
- Register/Login (pending admin approval)
- Manage profile (bio, specialization, fee, hospital)
- Set weekly availability slots
- View, approve, reject, or complete appointments
- Dashboard with appointment stats & chart

### Admin
- Secure login
- Approve/reject doctor registrations
- Activate/deactivate doctors & patients
- View all appointments with status filter
- Dashboard with analytics (revenue, monthly chart, counts)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer |
| Email | Nodemailer |
| Icons | React Icons (Feather) |

---

## Project Structure

```
Doctor_appointment/
├── backend/
│   ├── config/
│   │   └── seedAdmin.js         # Create first admin account
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── adminController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT protect + role authorize
│   │   └── upload.js            # Multer image upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── adminRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── email.js             # Nodemailer helpers
│   ├── uploads/                 # Stored images
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── common/           # Navbar, ProtectedRoute, StatCard, Spinner
│       │   ├── doctor/           # DoctorCard
│       │   └── patient/          # AppointmentCard
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state
│       ├── pages/
│       │   ├── auth/             # Login, Register
│       │   ├── patient/          # DoctorList, DoctorDetail, Appointments, Profile
│       │   ├── doctor/           # Dashboard, Appointments, Availability, Profile
│       │   ├── admin/            # Dashboard, Doctors, Patients, Appointments
│       │   └── Home.jsx
│       ├── utils/
│       │   ├── api.js            # Axios instance with interceptors
│       │   └── helpers.js        # Formatters, constants
│       ├── App.jsx               # Routes
│       └── main.jsx
│
├── DEPLOYMENT.md
└── README.md
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/patient` | Register patient |
| POST | `/api/auth/register/doctor` | Register doctor (with photo) |
| POST | `/api/auth/login` | Login (all roles) |
| GET | `/api/auth/me` | Get current user |

### Doctors (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors` | List doctors (filter/search/paginate) |
| GET | `/api/doctors/specializations` | All specializations |
| GET | `/api/doctors/:id` | Doctor detail |

### Doctors (Protected — doctor role)
| Method | Endpoint | Description |
|---|---|---|
| PUT | `/api/doctors/profile/update` | Update profile |
| PUT | `/api/doctors/availability` | Set availability |
| GET | `/api/doctors/appointments/my` | My appointments |
| PUT | `/api/doctors/appointments/:id/status` | Approve/reject/complete |
| GET | `/api/doctors/dashboard/stats` | Stats |

### Patients (Protected — patient role)
| Method | Endpoint | Description |
|---|---|---|
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/change-password` | Change password |
| GET | `/api/users/appointments` | My appointments |

### Appointments (Protected — patient role)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/appointments/book` | Book appointment |
| PUT | `/api/appointments/:id/cancel` | Cancel |
| PUT | `/api/appointments/:id/reschedule` | Reschedule |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews/doctor/:doctorId` | Doctor reviews |
| POST | `/api/reviews` | Add review (patient) |
| DELETE | `/api/reviews/:id` | Delete review (patient) |

### Admin (Protected — admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Analytics stats |
| GET | `/api/admin/doctors` | All doctors |
| PUT | `/api/admin/doctors/:id/approval` | Approve/reject |
| PUT | `/api/admin/doctors/:id/toggle` | Activate/deactivate |
| DELETE | `/api/admin/doctors/:id` | Delete doctor |
| GET | `/api/admin/patients` | All patients |
| PUT | `/api/admin/patients/:id/toggle` | Activate/deactivate |
| GET | `/api/admin/appointments` | All appointments |

---

## Getting Started

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full setup instructions.

### Quick Start
```bash
# 1. Setup backend
cd backend && npm install
# Edit .env with your MongoDB URI, JWT secret, email creds
node config/seedAdmin.js

# 2. Setup frontend
cd ../frontend && npm install
# Edit .env with VITE_API_URL=http://localhost:5000/api

# 3. Run
cd backend && npm run dev    # :5000
cd frontend && npm run dev   # :5173
```

Login as admin: `admin@docbook.com` / `Admin@123`
