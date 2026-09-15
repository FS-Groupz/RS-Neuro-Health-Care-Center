# Client Data Configuration Guide — RS Neuro Health Care Center

**Document Version:** 1.0.0 (Phase 7 Production Release)  
**Project Path:** `C:\Users\almas\OneDrive\Desktop\rs-neuro-care`  

This guide provides a comprehensive audit of all client-specific data placeholders currently within the RS Neuro Health Care Center website codebase. In accordance with the **Strict Zero-Fabrication Policy**, all unverified items remain in standardized bracketed placeholder format (`[...]`).

---

## Placeholder Categorization

### Category A: REQUIRED BEFORE PRODUCTION (Mandatory for Live Launch)

These items must be provided and configured before taking the website live to actual patients:

| Placeholder Marker | Location / Files | Description & Configuration Instructions |
| :--- | :--- | :--- |
| `[Doctor Name]` | `index.html`, `about.html`, `doctors.html`, `appointment.html`, `contact.html` | Full legal name of the Lead Neurologist / Medical Director. Replace all instances. |
| `[Qualification]` | `index.html`, `doctors.html` | Verified medical degrees (e.g., MBBS, MD - General Medicine, DM - Neurology). |
| `[Clinic Address]` | All pages (Header, Footer, Contact card, Schema.org) | Exact physical address of the clinic, including building name, street, area, city, and PIN code. |
| `[Phone Number]` | All pages (Header CTA, Footer, Emergency notes, Appointment guidance) | Primary clinic reception telephone / landline or mobile number for patient appointments. |
| `[Consultation Hours]` | All pages (Footer, Contact card, Appointment guidance, Doctor schedule) | Exact days and timings for Outpatient Department (OPD) consultations (e.g., Mon–Sat: 10:00 AM – 7:00 PM). |
| `[Google Maps Location]` | `contact.html` | Verified Google Maps embed URL (`<iframe>`) or Google Business profile link. |
| `https://[production-domain]/` | `sitemap.xml`, `robots.txt`, HTML canonical tags, OpenGraph tags | The live custom domain name (e.g., `https://www.rsneurocare.com/`). |
| `API_BASE_URL` | `js/main.js`, `backend/server.js`, `.env` | The production backend endpoint URL (e.g., `https://api.rsneurocare.com/api`). |

---

### Category B: OPTIONAL (Enhances Patient Communication; Can be Configured Post-Launch)

These items enhance convenience and digital outreach, but their absence does not block immediate clinical appointment requests via telephone:

| Placeholder Marker | Location / Files | Description & Configuration Instructions |
| :--- | :--- | :--- |
| `[WhatsApp Number]` | `contact.html`, `appointment.html` | Official WhatsApp Business number for patient enquiries. When provided, updates direct WhatsApp link (`https://wa.me/...`). |
| `[Email Address]` | `contact.html`, footer of all pages | Administrative / reception email address (e.g., `info@rsneurocare.com` or `appointments@rsneurocare.com`). |
| `[Facebook]`, `[Instagram]`, `[YouTube]` | Footer across all 8 HTML files | Official social media page URLs. When profiles are launched, replace safe placeholder spans with outbound links. |
| `[Notification Provider]` | `backend/server.js`, `.env` | SMTP or transactional SMS API credentials (e.g. Twilio / SendGrid) if automated appointment alerts are desired. |

---

### Category C: SAFE TO KEEP AS PLACEHOLDER (No Clinical Risk)

These elements use clean, accessible UI placeholders and do not misrepresent the clinic's capabilities:

| Placeholder Marker | Location / Files | Status & Treatment |
| :--- | :--- | :--- |
| Facility Photographs (8 slots) | `gallery.html` | Rendered with high-contrast clinical placeholders, official emblem, and recommended dimensions (`800 × 600px`). Safe to display until high-resolution facility photos are taken. |
| `[Doctor Photo]` | `doctors.html`, `index.html` | Uses official clinic emblem avatar placeholder with "Certified Specialist" pill. Safe until official portrait is supplied. |
| `[Gallery Introduction]` | `gallery.html` | Introductory clinical copy explaining outpatient environments. |
| `[Contact Introduction]` | `contact.html` | Introductory reception guidance copy. |

---

### Category D: REQUIRES CLIENT VERIFICATION (Scope of Practice Confirmation)

These items relate to clinical affiliations, diagnostic capabilities, or specialist designations:

| Item | Location | Verification Required |
| :--- | :--- | :--- |
| Associate Team Designations | `doctors.html`, `appointment.html` | Confirm whether associate roles (`[Consultant Neuro-Physician]`, `[Spine & Neuro-Rehabilitation Specialist]`) should be listed as visiting consultants or removed if solo practice. |
| Clinical Services Scope | `services.html`, `appointment.html` | Verify that the 6 listed service categories match the exact clinical scope offered at the clinic. |
| Acute Emergency Protocol | `appointment.html`, `contact.html` | Confirms explicit advisory directing acute stroke and seizure cases to emergency hospital care rather than the outpatient clinic. |
