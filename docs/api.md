# API Reference Documentation

The CHC Bharno API is structured under `/api/v1/` prefix. Every request expects a bearer JWT token header (`Authorization: Bearer <token>`) except public authentication endpoints.

---

## 1. Authentication Router (`/api/v1/auth`)

### `POST /auth/login`
- **Description**: Authenticate user and return token.
- **Payload**:
  ```json
  {
    "username": "admin@chcbharno.in",
    "password": "Temp@123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "ey...",
    "token_type": "bearer"
  }
  ```

---

## 2. Scheduling Router (`/api/v1/schedules`)

### `GET /schedules/availability`
- **Query Params**: `doctor_id` (UUID), `target_date` (YYYY-MM-DD)
- **Role Requirement**: Doctor, Receptionist, Patient, Admin
- **Response**: Returns availability slots for the doctor on that date.

### `POST /schedules/appointments`
- **Payload**:
  ```json
  {
    "patient_id": "uuid",
    "doctor_id": "uuid",
    "target_date": "2026-07-20",
    "time_slot": "10:30 AM",
    "symptoms": "Fever",
    "priority": "Normal"
  }
  ```
- **Response**: Generates token and books slot.

### `POST /schedules/leaves`
- **Payload**:
  ```json
  {
    "start_date": "2026-07-25",
    "end_date": "2026-07-28",
    "leave_type": "Medical",
    "reason": "Surgical operation"
  }
  ```
- **Role Requirement**: Doctor, Nurse, Staff

---

## 3. Analytics Router (`/api/v1/analytics`)

### `GET /analytics/kpis`
- **Role Requirement**: Hospital Administrator, IT Administrator
- **Response**: Dashboard KPIs (OPD volume, bed occupancy, inventory alerts).
