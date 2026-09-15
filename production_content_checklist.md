# Production Content Checklist — RS Neuro Health Care Center

Client sign-off checklist for taking the RS Neuro Health Care Center website live. Complete each item before launching the production website.

---

## 1. Clinic Identity & Branding
- [ ] **Clinic Name**: Confirmed as "RS Neuro Health Care Center".
- [ ] **Clinic Emblem / Logo**: [`rs-logo.png`](rs-logo.png) approved for high-resolution web use.
- [ ] **Production Domain**: Domain purchased and configured (e.g., `https://www.rsneurocare.com/`).

---

## 2. Medical Staff & Qualifications
- [ ] **Lead Neurologist Name**: Replaces `[Doctor Name]`.
- [ ] **Medical Degrees & Council Registration**: Replaces `[Qualification]`.
- [ ] **Specialization & Experience**: Confirmed years of clinical experience.
- [ ] **Professional Portrait**: Supplied high-resolution photograph for doctor profile.
- [ ] **Professional Biography**: Approved clinical background text.
- [ ] **Associate Doctors / Team**: Decision made on visiting consultants vs. solo practice.

---

## 3. Contact & Facility Information
- [ ] **Physical Address**: Complete street, landmark, area, city, and PIN code.
- [ ] **Telephone Number**: Primary reception phone line.
- [ ] **WhatsApp Business Number**: Dedicated enquiry number.
- [ ] **Official Email**: Reception or appointment notification email address.
- [ ] **OPD & Consultation Hours**: Weekday, Saturday, and Sunday timings.
- [ ] **Google Maps Embed**: Google Business listing confirmed and iframe URL provided.
- [ ] **Social Media Profiles**: Links supplied for Facebook, Instagram, YouTube (or kept hidden).

---

## 4. Clinical Facilities & Services
- [ ] **Clinical Services**: 6 core outpatient service categories reviewed and approved.
- [ ] **Facility Photos**: 8 real photographs supplied (`800 × 600px` recommended) for reception, consultation rooms, therapy area, etc.
- [ ] **Emergency Disclaimer**: Approved clinical advisory directing acute trauma and stroke cases to immediate emergency room facilities.

---

## 5. Appointment Booking & Backend Configuration
- [ ] **Appointment Workflow**: Request-only workflow with "Pending Confirmation" status approved.
- [ ] **Hosting Server**: Node.js hosting platform provisioned (Render, Railway, Fly.io, or VPS).
- [ ] **Database Persistence**: Persistent volume attached for `appointments.db`.
- [ ] **CORS Configuration**: Production domain registered in `ALLOWED_ORIGIN`.
- [ ] **Notification Channel**: Decision on manual reception review vs. automated email/SMS dispatch.

---

## 6. Legal, SEO & Compliance Disclosures
- [ ] **Privacy Notice**: Health data confidentiality statement approved.
- [ ] **Medical Disclaimer**: Guidance statement confirming web content is educational and not clinical diagnosis approved.
- [ ] **Sitemap & Robots**: Production domain updated in `sitemap.xml` and `robots.txt`.
