# RS Neuro Health Care Center

[![GitHub Pages Deployment](https://github.com/FS-Groupz/RS-Neuro-Health-Care-Center/actions/workflows/deploy.yml/badge.svg)](https://github.com/FS-Groupz/RS-Neuro-Health-Care-Center/actions/workflows/deploy.yml)
[![Live Website](https://img.shields.io/badge/Website-Live_on_GitHub_Pages-blue?style=flat&logo=github)](https://fs-groupz.github.io/RS-Neuro-Health-Care-Center/)

A modern, professional, accessible, and responsive website built for **RS Neuro Health Care Center**, delivering specialized neurological and medical care information, doctor profiles, clinical services, multimedia gallery, and appointment request workflows.

---

## 🌐 Live Website

- **Production Static Frontend:** [https://fs-groupz.github.io/RS-Neuro-Health-Care-Center/](https://fs-groupz.github.io/RS-Neuro-Health-Care-Center/)
- **Repository:** [https://github.com/FS-Groupz/RS-Neuro-Health-Care-Center](https://github.com/FS-Groupz/RS-Neuro-Health-Care-Center)

---

## 🏛️ Website Pages & Structure

1. **Home (`index.html`)** — Hero, emergency advisory, core clinical specialties, doctor highlight, patient testimonials, facilities preview, emergency CTA.
2. **About Us (`about.html`)** — Mission, clinical philosophy, standards of care, facility infrastructure, quality benchmarks.
3. **Doctors / Medical Team (`doctors.html`)** — Verified neurologist and clinical specialist profiles, qualifications, areas of expertise, OPD consultation schedules.
4. **Clinical Services (`services.html`)** — Comprehensive neurology services, diagnostic EEG/EMG overview, stroke rehab, headache management, patient FAQs.
5. **Gallery (`gallery.html`)** — Clinical facilities, diagnostic labs, consultation suites, accessibility previews.
6. **Contact (`contact.html`)** — Interactive Google Map, OPD hours, phone directory, WhatsApp integration, general enquiry form.
7. **Appointment Booking (`appointment.html`)** — Dedicated appointment request workflow, multi-step validation, preferred doctor and date/time selection, offline transparency fallback.
8. **404 Error Page (`404.html`)** — Custom branded navigation recovery page.

---

## 🛠️ Architecture & Technologies

- **Frontend:** Semantic HTML5, CSS3 Custom Properties (Design Tokens), Vanilla JavaScript (ES6+).
- **Design System:** `css/tokens.css` (color tokens, typography, spacing, elevations), `css/components.css` (16 modular component sections), `css/style.css` (layout & page utilities).
- **Backend (Optional Service):** Node.js runtime (`backend/server.js`), SQLite database (`appointments.db`), input sanitization, rate limiting, and RESTful API endpoints in `backend/`.
- **Accessibility & Compliance:** WCAG 2.1 AA compliant contrast ratios, full keyboard navigation, screen-reader aria attributes, reduced motion media queries, zero horizontal layout overflow.
- **SEO & Social:** Open Graph, Twitter Cards, JSON-LD Schema (`MedicalBusiness`, `Physician`), `robots.txt`, XML `sitemap.xml`.

---

## 🚀 Getting Started Locally

### Static Frontend
You can run the frontend with any static web server:
```bash
# Using Python
python -m http.server 3000

# Using Node.js http-server or npx serve
npx serve .
```
Visit `http://localhost:3000` in your browser.

### Backend Server (Appointment API)
```bash
cd backend
npm install
npm start
```
By default, the backend server starts on `http://localhost:5000`.

---

## ⚙️ Configuration & Client Handover

Refer to the included handover guides:
- [`client_configuration.md`](./client_configuration.md) — How to update phone numbers, clinic addresses, OPD timings, and doctors.
- [`production_content_checklist.md`](./production_content_checklist.md) — Pre-launch content validation checklist.

---

## 📄 License & Attribution

RS Neuro Health Care Center. All rights reserved.
