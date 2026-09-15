# Phase 6 Implementation Document — Appointment Booking System & Workflow

**Project:** RS Neuro Health Care Center  
**Repository Directory:** `C:\Users\almas\OneDrive\Desktop\rs-neuro-care`  
**Phase Completed:** Phase 6 — Appointment Booking System + Appointment Page + Frontend/Backend Booking Workflow  
**Date:** September 2026  

---

## 1. Architecture Overview

Phase 6 transforms the static appointment shell into an end-to-end, production-ready appointment request system. The architecture separates concerns cleanly into presentation, client-side validation, HTTP communication, security controls, server-side validation, cryptographic ID generation, duplicate detection, and SQLite persistence.

```
┌─────────────────────────────────────────────────────────────┐
│                       PATIENT BROWSER                       │
│  - appointment.html (2-column accessible layout)             │
│  - Client-side validation & dynamic date minimums           │
│  - Accessible loading states & confirmation card             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON Fetch
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                       │
│  - server.js: HTTP routing, CORS origin check, rate limiting │
│  - security.js: Payload limits (64KB), security headers     │
│  - appointmentValidation.js: Full server-side sanitization  │
│  - appointmentService.js: SHA256 duplicate fingerprinting   │
│  - Cryptographic Reference ID (RSNC-2026-XXXXXX)            │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prepared Statements
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     SQLITE PERSISTENCE                      │
│  - node:sqlite DatabaseSync (Node 24 native)                │
│  - appointments table with indexed lookups                  │
│  - Default status: 'pending' (Never auto-confirmed)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Files Created and Modified

### Created Files
- [`backend/server.js`](backend/server.js): Native Node.js HTTP server handling routing, CORS, payload limits, and rate limiting.
- [`backend/database/db.js`](backend/database/db.js): SQLite database layer using Node 24 native `node:sqlite` (`DatabaseSync`), automated schema migrations, indexed query prepared statements.
- [`backend/validation/appointmentValidation.js`](backend/validation/appointmentValidation.js): Server-side validation and sanitization for patient appointment requests.
- [`backend/services/appointmentService.js`](backend/services/appointmentService.js): Cryptographic ID generation (`RSNC-2026-XXXXXX`), duplicate detection, and persistence.
- [`backend/controllers/appointmentController.js`](backend/controllers/appointmentController.js): HTTP controller handling request parsing, error formatting, and status codes.
- [`backend/middleware/security.js`](backend/middleware/security.js): In-memory IP rate limiter, security headers, and payload size limiter.
- [`.env.example`](.env.example): Template environment configuration file.
- [`phase6_implementation.md`](phase6_implementation.md): Comprehensive implementation documentation.

### Modified Files
- [`appointment.html`](appointment.html): Fully implemented accessible appointment page with Section 1 (Hero & Breadcrumbs), Section 2 (Two-column layout: guidance on left, booking form on right), and Section 3 (Post-submission Confirmation Card).
- [`css/components.css`](css/components.css): Appended Section 16 containing styles for `.appointment-layout`, `.appointment-info-card`, `.appointment-form-card`, `.form-row`, `.radio-group`, `.confirmation-card`, `.reference-id-box`, and `.btn-submit`. Updated `.btn-sm` to guarantee minimum 44px touch target height.
- [`js/main.js`](js/main.js): Added `initAppointmentBooking()` handling dynamic `min` date restrictions, inline validation, loading states, API communication, confirmation rendering, and graceful fallback when server is unconfigured.
- [`.gitignore`](.gitignore): Updated to ignore `*.db`, `*.sqlite`, `*.sqlite3`, `backend/database/*.db`, and `.env` files.

---

## 3. Frontend Workflow

1. **Accessing the Booking Page**:
   - The patient navigates to `appointment.html` from the global navigation or hero CTAs.
   - The page displays an accessible breadcrumb, heading hierarchy with exactly one `<h1>`, and scheduling guidelines.
2. **Clinical Guidance & Preparation Checklist**:
   - The left column provides consultation preparation checklists (imaging disks, prescriptions, referral notes), consultation hours placeholder, and an acute emergency advisory.
3. **Form Input & Client Validation**:
   - Full Name: Minimum 2 characters.
   - Mobile Number: Validates 10-digit Indian mobile format (`^[6-9]\d{9}$`).
   - Email: RFC 5322 regex validation.
   - Consultation Service: Selects from the 6 clinical categories.
   - Preferred Doctor: Selects from lead neurologist or associate placeholders.
   - Preferred Date: Automatically sets `min` attribute to current date; rejects past dates.
   - Preferred Time: Morning, Afternoon, or Evening preference windows.
   - Contact Method: Radio buttons for Phone Call, WhatsApp, or Email.
   - Symptoms Summary: Textarea with live character counter (max 500 chars).
   - Consent Checkbox: Explicit agreement to appointment request guidelines and health privacy.
4. **Submission & Loading State**:
   - On submit, submit button is disabled, spinner activates, and label changes to *"Submitting Request…"*.
5. **Confirmation UI**:
   - On HTTP 201 response, the form is cleanly hidden.
   - The confirmation card is displayed and focused for screen readers.
   - Shows cryptographic Reference ID (`RSNC-2026-XXXXXX`), submitted date, requested time, selected service, preferred doctor, and status badge (*"Pending Clinic Confirmation"*).
   - Provides options to *"Request Another Appointment"* (resets and restores form) or *"Return to Home"*.
6. **Error & Fallback Handling**:
   - **Validation Error (HTTP 400)**: Displays field-level errors linked via `aria-describedby` and `aria-invalid`.
   - **Duplicate Error (HTTP 409)**: Displays alert banner explaining that an identical request was already recorded recently.
   - **Rate Limit (HTTP 429)**: Alerts patient to wait before retrying.
   - **Unconfigured / Network Offline**: Displays clear, polite message advising the user to contact reception at `[Phone Number]`. **Zero fake success states are ever presented.**

---

## 4. Backend Workflow

1. **Request Intake**:
   - Incoming request to `POST /api/appointments` is parsed with a 64KB body size limit.
   - Rate limiter verifies client IP has not exceeded 15 requests in 5 minutes.
2. **Server-Side Validation**:
   - `validateAppointmentInput` validates and strips HTML tags from all inputs.
   - If invalid, responds immediately with HTTP 400 and structured `fieldErrors`.
3. **Duplicate Submission Protection**:
   - Generates an idempotency hash from `phone + preferred_date + service.toLowerCase()`.
   - Queries database for any matching request created within the previous 5 minutes.
   - If duplicate found, rejects with HTTP 409 Conflict and provides the existing reference ID.
4. **Cryptographic ID Generation**:
   - Generates a reference ID using Node.js `crypto.randomBytes(3).toString('hex').toUpperCase()` formatted as `RSNC-2026-XXXXXX`.
5. **Persistence**:
   - Saves record into SQLite with authoritative server timestamp and default status `pending`.
6. **Response**:
   - Responds with HTTP 201 Created and sanitized confirmation payload.

---

## 5. Database Schema

Native SQLite schema configured in `backend/database/db.js`:

```sql
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  appointment_id TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  preferred_doctor TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  contact_method TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  idempotency_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_appointments_id ON appointments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_duplicate ON appointments(phone, preferred_date, service);
```

**Allowed Status Values**:
- `pending` (Default for all new requests)
- `confirmed` (Requires manual clinic review in future phase)
- `cancelled` (Future phase)
- `completed` (Future phase)

---

## 6. Security Controls

- **Zero Client Secrets in Source**: No API keys, passwords, or service-role tokens exist in client JavaScript or HTML.
- **SQL Injection Prevention**: All database operations use SQLite parameterized prepared statements (`stmt.run({ ... })`).
- **Input Sanitization**: All user strings are stripped of HTML tags and normalized.
- **Rate Limiting**: In-memory sliding window allows max 15 requests per IP per 5-minute interval.
- **Payload Size Capping**: Requests larger than 64KB are immediately rejected with HTTP 413.
- **CORS Protection**: Restricted to allowed origins specified in `.env`.
- **Security Headers**: Transmits `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Stack Trace Masking**: Generic 500 error messages returned to clients; zero internal stack traces or database schema details exposed.
- **Git & Privacy Protection**: Sensitive `.db`, `.sqlite`, and `.env` files are strictly excluded via `.gitignore`.

---

## 7. Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Local or production HTTP port | `3000` |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` |
| `ALLOWED_ORIGIN` | Comma-separated CORS allowed domains | `http://localhost:3000,http://127.0.0.1:3000` |
| `DATABASE_PATH` | Path to SQLite database file | `backend/database/appointments.db` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting rolling window in milliseconds | `300000` (5 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests allowed per IP per window | `15` |

---

## 8. Local Development Setup

To run the full-stack appointment system locally:

1. **Start the Backend Server**:
   ```powershell
   node backend/server.js
   ```
   Server will start at `http://localhost:3000`.

2. **Serve the Frontend Pages**:
   You can serve the static files using any local HTTP server (or open directly in browser):
   ```powershell
   # Example using Python built-in server:
   python -m http.server 8080
   ```

3. **Verify System Health**:
   Open `http://localhost:3000/api/health` in your browser. Expected response:
   ```json
   {
     "status": "ok",
     "service": "RS Neuro Health Care Center API",
     "version": "1.0.0"
   }
   ```

4. **Run Automated Test Suites**:
   - Backend unit & validation tests: `node scratch/test_backend.js`
   - Responsive overflow across all 9 viewports: `node scratch/test_phase6_responsive.js`
   - Functional, accessibility & duplicate tests: `node scratch/test_phase6_functional.js`

---

## 9. Testing Results Summary

- **Backend API Suite**: 13/13 tests PASSED (Health check, valid booking, 409 duplicate rejection, phone regex, past date rejection, missing consent rejection, malformed JSON handling).
- **Responsive Suite**: 72/72 tests PASSED across all 9 target viewports (320px, 375px, 390px, 430px, 768px, 820px, 1024px, 1280px, 1440px) on `appointment.html` and regression checks across `index.html`, `about.html`, `doctors.html`, `services.html`, `gallery.html`, `contact.html`, `404.html`. **0px horizontal overflow**.
- **Functional & Accessibility Suite**: 10/10 tests PASSED (Single H1, explicit `<label>` elements, 44px+ touch targets, client validation, loading state, confirmation card, reset form workflow, server duplicate handling).
- **Unconfigured Backend Fallback**: PASSED (displays transparent offline notification, 0 fake confirmations).

---

## 10. Status Distinction & Boundaries

### IMPLEMENTED
- Complete responsive, accessible `appointment.html` page.
- Section 16 design system styling and 44px touch targets in `css/components.css`.
- Client-side validation with dynamic date boundaries in `js/main.js`.
- Lightweight native Node.js HTTP backend server (`backend/server.js`).
- Server-side validation, sanitization, and duplicate protection.
- SQLite database persistence using native `node:sqlite`.
- Cryptographic reference ID generator (`RSNC-2026-XXXXXX`).
- Pending status enforcement on all incoming requests.
- No-fake-success offline fallback alerts.
- Protection against git leakage of database and secrets.

### REQUIRES CLIENT CONFIGURATION
- **Production API URL**: Point `window.API_BASE_URL` to the client's production API host if hosting static frontend on GitHub Pages and backend on Render/Fly.io/VPS.
- **Doctor Consultation Schedule**: Real OPD hours and doctor availability intervals.
- **Clinic Phone & WhatsApp**: Verified telephone numbers to replace `[Phone Number]`.
- **Notification Provider**: SMTP credentials or SMS gateway (e.g. Twilio / SendGrid) to dispatch confirmation emails or SMS when configured.

### FUTURE PHASE (Not in Scope for Phase 6)
- Phase 7: Administrative dashboard for reviewing, confirming, or rescheduling appointments.
- Patient authentication or medical history portals.
- Payment gateway integrations.
- Prescription and electronic medical records (EMR) integration.
