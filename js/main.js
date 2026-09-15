/**
 * RS Neuro Health Care Center — Phase 1 Foundation Script
 * Accessible, lightweight client interaction without heavy dependencies
 */

(function () {
  'use strict';

  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (!navToggle || !mobileDrawer) return;

    function openDrawer() {
      navToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeDrawer();
        navToggle.focus();
      }
    });

    // Close on link click inside drawer
    mobileDrawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        closeDrawer();
      }
    });

    // Close when clicking outside of drawer and toggle
    document.addEventListener('click', function (e) {
      if (
        navToggle.getAttribute('aria-expanded') === 'true' &&
        !mobileDrawer.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeDrawer();
      }
    });
  }

  function initYear() {
    const yearElem = document.getElementById('currentYear');
    if (yearElem) {
      yearElem.textContent = new Date().getFullYear();
    }
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const consent = document.getElementById('consent');
    const statusBanner = document.getElementById('formStatusBanner');

    function showError(fieldId, errorId, show) {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(errorId);
      if (field) {
        if (show) field.classList.add('has-error');
        else field.classList.remove('has-error');
      }
      if (error) {
        if (show) error.classList.add('is-visible');
        else error.classList.remove('is-visible');
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Full Name
      if (!fullName || !fullName.value.trim()) {
        showError('fullName', 'fullNameError', true);
        isValid = false;
      } else {
        showError('fullName', 'fullNameError', false);
      }

      // Phone
      const phoneVal = phone ? phone.value.trim() : '';
      const phoneDigits = phoneVal.replace(/\D/g, '');
      if (!phoneVal || phoneDigits.length < 7) {
        showError('phone', 'phoneError', true);
        isValid = false;
      } else {
        showError('phone', 'phoneError', false);
      }

      // Email (optional, but validate format if entered)
      const emailVal = email ? email.value.trim() : '';
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showError('email', 'emailError', true);
        isValid = false;
      } else {
        showError('email', 'emailError', false);
      }

      // Message
      if (!message || !message.value.trim()) {
        showError('message', 'messageError', true);
        isValid = false;
      } else {
        showError('message', 'messageError', false);
      }

      // Consent
      if (consent && !consent.checked) {
        showError('consent', 'consentError', true);
        isValid = false;
      } else {
        showError('consent', 'consentError', false);
      }

      if (isValid && statusBanner) {
        statusBanner.classList.add('is-visible');
        statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Clear errors on input
    [fullName, phone, email, message].forEach(input => {
      if (input) {
        input.addEventListener('input', function () {
          showError(input.id, input.id + 'Error', false);
        });
      }
    });
    if (consent) {
      consent.addEventListener('change', function () {
        showError('consent', 'consentError', false);
      });
    }
  }

  function initAppointmentBooking() {
    const form = document.getElementById('appointmentForm');
    const formCard = document.getElementById('appointmentFormCard');
    const confCard = document.getElementById('appointmentConfirmationCard');
    const alertBanner = document.getElementById('appointmentAlertBanner');
    const submitBtn = document.getElementById('appointmentSubmitBtn');
    const btnSpinner = document.getElementById('appointmentBtnSpinner');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const charCounter = document.getElementById('charCounter');
    const messageInput = document.getElementById('message');
    const dateInput = document.getElementById('preferredDate');
    const btnBookAnother = document.getElementById('btnBookAnother');

    if (!form) return;

    // 1. Dynamic min date restriction (today)
    if (dateInput) {
      const todayStr = new Date().toISOString().split('T')[0];
      dateInput.min = todayStr;
    }

    // 2. Character counter for message textarea
    if (messageInput && charCounter) {
      messageInput.addEventListener('input', function () {
        const len = messageInput.value.length;
        charCounter.textContent = len + ' / 500 characters';
      });
    }

    // 3. Error display helper
    function showFieldError(fieldId, errorId, show, customMsg) {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(errorId);
      if (field) {
        if (show) {
          field.classList.add('has-error');
          field.setAttribute('aria-invalid', 'true');
          field.setAttribute('aria-describedby', errorId);
        } else {
          field.classList.remove('has-error');
          field.removeAttribute('aria-invalid');
          field.removeAttribute('aria-describedby');
        }
      }
      if (error) {
        if (customMsg) error.textContent = customMsg;
        if (show) error.classList.add('is-visible');
        else error.classList.remove('is-visible');
      }
    }

    // 4. Alert Banner helper
    function showAlert(message, isError = true) {
      if (!alertBanner) return;
      alertBanner.textContent = message;
      alertBanner.className = 'form-status-banner is-visible ' + (isError ? 'emergency-alert-box' : 'form-status-info');
      alertBanner.focus();
      alertBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearAlert() {
      if (!alertBanner) return;
      alertBanner.textContent = '';
      alertBanner.className = 'form-status-banner';
    }

    // 5. Loading State helper
    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      if (isLoading) {
        submitBtn.classList.add('btn-loading');
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        if (btnText) btnText.textContent = 'Submitting Request…';
      } else {
        submitBtn.classList.remove('btn-loading');
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnText) btnText.textContent = 'Submit Appointment Request';
      }
    }

    // 6. Form Submission Workflow
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearAlert();

      const fullName = document.getElementById('fullName');
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      const service = document.getElementById('service');
      const preferredDoctor = document.getElementById('preferredDoctor');
      const preferredDate = document.getElementById('preferredDate');
      const preferredTime = document.getElementById('preferredTime');
      const contactMethodRadio = document.querySelector('input[name="contactMethod"]:checked');
      const consent = document.getElementById('appointmentConsent');

      let isValid = true;
      let firstInvalidField = null;

      function markInvalid(field, fieldId, errorId, msg) {
        showFieldError(fieldId, errorId, true, msg);
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field;
      }

      // Full Name
      const nameVal = fullName ? fullName.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        markInvalid(fullName, 'fullName', 'fullNameError');
      } else {
        showFieldError('fullName', 'fullNameError', false);
      }

      // Phone
      const phoneVal = phone ? phone.value.trim() : '';
      const phoneDigits = phoneVal.replace(/\D/g, '');
      const normPhone = phoneDigits.length === 12 && phoneDigits.startsWith('91')
        ? phoneDigits.slice(2)
        : (phoneDigits.length === 11 && phoneDigits.startsWith('0') ? phoneDigits.slice(1) : phoneDigits);

      if (!normPhone || !/^[6-9]\d{9}$/.test(normPhone)) {
        markInvalid(phone, 'phone', 'phoneError');
      } else {
        showFieldError('phone', 'phoneError', false);
      }

      // Email
      const emailVal = email ? email.value.trim() : '';
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        markInvalid(email, 'email', 'emailError');
      } else {
        showFieldError('email', 'emailError', false);
      }

      // Service
      if (!service || !service.value) {
        markInvalid(service, 'service', 'serviceError');
      } else {
        showFieldError('service', 'serviceError', false);
      }

      // Doctor
      if (!preferredDoctor || !preferredDoctor.value) {
        markInvalid(preferredDoctor, 'preferredDoctor', 'preferredDoctorError');
      } else {
        showFieldError('preferredDoctor', 'preferredDoctorError', false);
      }

      // Date
      const dateVal = preferredDate ? preferredDate.value : '';
      const todayStr = new Date().toISOString().split('T')[0];
      if (!dateVal || dateVal < todayStr) {
        markInvalid(preferredDate, 'preferredDate', 'preferredDateError');
      } else {
        showFieldError('preferredDate', 'preferredDateError', false);
      }

      // Time
      if (!preferredTime || !preferredTime.value) {
        markInvalid(preferredTime, 'preferredTime', 'preferredTimeError');
      } else {
        showFieldError('preferredTime', 'preferredTimeError', false);
      }

      // Contact Method
      if (!contactMethodRadio) {
        showFieldError('contactMethod', 'contactMethodError', true);
        isValid = false;
      } else {
        showFieldError('contactMethod', 'contactMethodError', false);
      }

      // Consent
      if (!consent || !consent.checked) {
        showFieldError('appointmentConsent', 'appointmentConsentError', true);
        isValid = false;
        if (!firstInvalidField) firstInvalidField = consent;
      } else {
        showFieldError('appointmentConsent', 'appointmentConsentError', false);
      }

      if (!isValid) {
        if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
          firstInvalidField.focus();
        }
        return;
      }

      // All fields valid — submit to Backend API
      setLoading(true);

      const payload = {
        fullName: nameVal,
        phone: normPhone,
        email: emailVal,
        service: service.value,
        preferredDoctor: preferredDoctor.value,
        preferredDate: dateVal,
        preferredTime: preferredTime.value,
        contactMethod: contactMethodRadio ? contactMethodRadio.value : 'phone',
        message: messageInput ? messageInput.value.trim() : '',
        consent: true
      };

      // API Endpoint: Use configured base or localhost fallback
      const apiEndpoint = (window.API_BASE_URL || 'http://localhost:3000/api') + '/appointments';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (response.status === 201 && data.success && data.data) {
          // Real backend persistence confirmed!
          const booking = data.data;

          // Populate confirmation card
          const confRef = document.getElementById('confReferenceId');
          const confName = document.getElementById('confPatientName');
          const confSvc = document.getElementById('confService');
          const confDoc = document.getElementById('confDoctor');
          const confDate = document.getElementById('confDate');
          const confTime = document.getElementById('confTime');
          const confContact = document.getElementById('confContactMethod');

          if (confRef) confRef.textContent = booking.referenceId;
          if (confName) confName.textContent = booking.details.fullName;
          if (confSvc) confSvc.textContent = booking.details.service;
          if (confDoc) confDoc.textContent = booking.details.preferredDoctor;
          if (confDate) confDate.textContent = booking.details.preferredDate;
          if (confTime) confTime.textContent = booking.details.preferredTime;
          if (confContact) {
            const methodNames = { phone: 'Phone Call', whatsapp: 'WhatsApp', email: 'Email' };
            confContact.textContent = methodNames[booking.details.contactMethod] || booking.details.contactMethod;
          }

          // Hide form, show confirmation card
          if (formCard) formCard.style.display = 'none';
          if (confCard) {
            confCard.style.display = 'block';
            confCard.classList.add('is-visible');
            confCard.focus();
            confCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (response.status === 409) {
          // Duplicate submission detected
          showAlert(data.error || 'A consultation request for this mobile number, date, and service was already submitted recently. Please wait before submitting another request.', true);
        } else if (response.status === 400 && data.fieldErrors) {
          // Server-side validation errors
          Object.keys(data.fieldErrors).forEach(field => {
            showFieldError(field, field + 'Error', true, data.fieldErrors[field]);
          });
          showAlert(data.error || 'Please correct the highlighted errors and try again.', true);
        } else if (response.status === 429) {
          showAlert('Too many requests. Please wait a few moments before trying again.', true);
        } else {
          showAlert(data.error || 'Unable to submit your request. Please contact the clinic directly at [Phone Number].', true);
        }
      } catch (err) {
        // Network error, backend server not running, or request timeout
        console.error('[Booking Request Error]', err);
        showAlert('The appointment booking server is currently unreachable or not configured. To request an appointment, please contact the clinic reception directly at [Phone Number] or visit during [Consultation Hours]. (Note: Zero fake confirmations are generated when backend is unreachable).', true);
      } finally {
        setLoading(false);
      }
    });

    // 7. Clear errors on change/input
    const inputsToWatch = [
      ['fullName', 'fullNameError'],
      ['phone', 'phoneError'],
      ['email', 'emailError'],
      ['service', 'serviceError'],
      ['preferredDoctor', 'preferredDoctorError'],
      ['preferredDate', 'preferredDateError'],
      ['preferredTime', 'preferredTimeError']
    ];

    inputsToWatch.forEach(([id, errId]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => showFieldError(id, errId, false));
        el.addEventListener('change', () => showFieldError(id, errId, false));
      }
    });

    const consentEl = document.getElementById('appointmentConsent');
    if (consentEl) {
      consentEl.addEventListener('change', () => showFieldError('appointmentConsent', 'appointmentConsentError', false));
    }

    // 8. "Request Another Appointment" Handler
    if (btnBookAnother) {
      btnBookAnother.addEventListener('click', function () {
        form.reset();
        clearAlert();
        if (confCard) {
          confCard.style.display = 'none';
          confCard.classList.remove('is-visible');
        }
        if (formCard) {
          formCard.style.display = 'block';
        }
        if (charCounter) charCounter.textContent = '0 / 500 characters';
        const fullNameInput = document.getElementById('fullName');
        if (fullNameInput) fullNameInput.focus();
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initMobileNav();
      initYear();
      initContactForm();
      initAppointmentBooking();
    });
  } else {
    initMobileNav();
    initYear();
    initContactForm();
    initAppointmentBooking();
  }
})();
