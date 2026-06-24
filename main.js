/* ================================================================
   MAGNIFICENT GOD MATERNITY CENTER — main.js
   LIVE FORM INTEGRATIONS:
   ① EmailJS  → sends booking details to hospital email
   ② WhatsApp → opens pre-filled WhatsApp message to hospital
   ================================================================

   ██ SETUP REQUIRED — Read SETUP.md before going live ██
   Replace these 4 values with your real credentials:
================================================================ */

'use strict';

const MGMC_CONFIG = {

  // ════════════════════════════════════════════════════════
  //  ★  TO UPDATE CONTACT DETAILS — CHANGE HERE ONLY  ★
  //  Every email link, phone link & WhatsApp link on
  //  every page will update automatically on page load.
  // ════════════════════════════════════════════════════════

  hospital_email:         'ogunfunmilayomosun@gmail.com',
  hospital_phone:         '+2347031549155',
  hospital_phone_display: '+234 703 154 9155',
  whatsapp_number:        '2347031549155',

  // ── EmailJS (form → email delivery) ─────────────────────
  // Sign up free at https://emailjs.com then paste your keys:
  emailjs_service_id:  'service_abc1234',
  emailjs_template_id: 'template_dncioi9',
  emailjs_public_key:  '3MRgckVjiZV6pHQy_',

};

/* ================================================================
   NOTHING BELOW THIS LINE NEEDS TO BE CHANGED
================================================================ */


// ── UTILITY ──────────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

// ── PAGE LOADER ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = $('#pageLoader');
  if (loader) setTimeout(() => loader.classList.add('done'), 1200);
  initAll();
});

function initAll() {
  injectContactDetails(); // ← auto-updates all email/phone/WA links from config
  initTheme();
  initNav();
  initScrollReveal();
  initCounters();
  initTestimonialSlider();
  initFAQ();
  initFAQFilter();
  initForms();            // ← handles EmailJS + WhatsApp
  initGallery();
  initBackToTop();
  setActiveNavLink();
  loadEmailJS();          // ← injects EmailJS SDK
}

// ── CENTRALISED CONTACT INJECTION ────────────────────────────────
// Reads MGMC_CONFIG and rewrites every email, phone, and WhatsApp
// link on the page — so you only ever change the config above.
function injectContactDetails() {
  const { hospital_email, hospital_phone, hospital_phone_display, whatsapp_number } = MGMC_CONFIG;

  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.href = 'mailto:' + hospital_email;
    // Update visible text only if it looks like an email address
    if (a.textContent.trim().includes('@')) {
      a.textContent = hospital_email;
    }
  });

  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.href = 'tel:' + hospital_phone;
    // Update visible text only if it looks like a phone number
    const txt = a.textContent.trim();
    if (/[\d\s\+\-]{7,}/.test(txt)) {
      a.textContent = hospital_phone_display;
    }
  });

  document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
    // Preserve any ?text= query string already on the link
    const url    = new URL(a.href);
    const params = url.search; // e.g. ?text=Hello
    a.href = 'https://wa.me/' + whatsapp_number + params;
  });

  // Also update any plain-text spans/divs that display the phone number
  // (looks for the old display number pattern and swaps it)
  document.querySelectorAll('[data-contact="phone"]').forEach(el => {
    el.textContent = hospital_phone_display;
  });
  document.querySelectorAll('[data-contact="email"]').forEach(el => {
    el.textContent = hospital_email;
  });
}

// ── EMAILJS SDK (loaded dynamically, no extra script tag needed) ──
function loadEmailJS() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    if (window.emailjs) {
      emailjs.init({ publicKey: MGMC_CONFIG.emailjs_public_key });
    }
  };
  document.head.appendChild(script);
}

// ── THEME (DARK / LIGHT) ─────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('mgmc-theme') || 'light';
  applyTheme(saved);
  $$('.theme-toggle').forEach(btn => {
    on(btn, 'click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('mgmc-theme', next);
    });
  });
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// ── NAVBAR ───────────────────────────────────────────────────────
function initNav() {
  const navbar    = $('#navbar');
  const hamburger = $('#navHamburger');
  const mobileNav = $('#mobileNav');

  const handleScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  on(hamburger, 'click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (mobileNav) mobileNav.classList.toggle('open');
  });

  if (mobileNav) {
    $$('a', mobileNav).forEach(a => {
      on(a, 'click', () => {
        hamburger && hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }
}

function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .mobile-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

// ── SCROLL REVEAL ────────────────────────────────────────────────
function initScrollReveal() {
  const els = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

// ── ANIMATED COUNTERS ────────────────────────────────────────────
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}
function animateCounter(el) {
  const target   = parseFloat(el.getAttribute('data-count'));
  const suffix   = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start    = performance.now();
  const update   = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = (Number.isInteger(target) ? Math.round(target * eased) : (target * eased).toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(update);
}

// ── TESTIMONIAL SLIDER ───────────────────────────────────────────
function initTestimonialSlider() {
  const track = $('#testimonialsTrack');
  if (!track) return;
  const cards = $$('.testimonial-card', track);
  if (!cards.length) return;

  let currentIndex = 0;
  let perView  = getPerView();
  let maxIndex = Math.max(0, cards.length - perView);

  function getPerView() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }
  function goTo(i) {
    currentIndex = Math.max(0, Math.min(i, maxIndex));
    const cardW  = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${currentIndex * cardW}px)`;
    cards.forEach((c, idx) => c.classList.toggle('active', idx === currentIndex));
    $$('.tn-dot').forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  on($('#testimonialsBack'), 'click', () => goTo(currentIndex - 1));
  on($('#testimonialsNext'), 'click', () => goTo(currentIndex + 1));

  const dotsContainer = $('#testimonialsDots');
  if (dotsContainer) {
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'tn-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      on(dot, 'click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  let autoplay = setInterval(() => goTo(currentIndex + 1 > maxIndex ? 0 : currentIndex + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(currentIndex + 1 > maxIndex ? 0 : currentIndex + 1), 5000);
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      perView  = getPerView();
      maxIndex = Math.max(0, cards.length - perView);
      // Clear and re-render dots to avoid duplication
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
          const dot = document.createElement('button');
          dot.className = 'tn-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          on(dot, 'click', () => goTo(i));
          dotsContainer.appendChild(dot);
        }
      }
      goTo(Math.min(currentIndex, maxIndex));
    }, 150);
  });

  goTo(0);

  // Clear autoplay when tab is hidden — prevents background CPU drain
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(autoplay);
    } else {
      autoplay = setInterval(() => goTo(currentIndex + 1 > maxIndex ? 0 : currentIndex + 1), 5000);
    }
  });
}

// ── FAQ ACCORDION ────────────────────────────────────────────────
function initFAQ() {
  const items = $$('.faq-item');
  items.forEach(item => {
    const question = $('.faq-question', item);
    on(question, 'click', () => {
      const isOpen = item.classList.contains('open');
      // Close all and reset aria
      items.forEach(i => {
        i.classList.remove('open');
        const q = $('.faq-question', i);
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
    // Keyboard support
    on(question, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); question.click(); }
    });
  });
}

// ── FAQ CATEGORY FILTER (now inside initFAQ to avoid dual listener) ─
function initFAQFilter() {
  const catBtns  = $$('.faq-cat-btn');
  const faqItems = $$('.faq-item');
  catBtns.forEach(btn => {
    on(btn, 'click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      faqItems.forEach(item => {
        item.style.display = (cat === 'all' || item.getAttribute('data-category') === cat) ? '' : 'none';
      });
    });
  });
}

// ════════════════════════════════════════════════════════════════
// ── FORMS — EmailJS + WhatsApp ──────────────────────────────────
// ════════════════════════════════════════════════════════════════

function initForms() {
  // ── Contact / quick booking form (index.html) ──
  const contactForm = $('#contactForm');
  if (contactForm) {
    on(contactForm, 'submit', async (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      await handleFormSubmit(contactForm, {
        successId:   '#contactSuccess',
        formType:    'Quick Booking',
        fields: {
          name:    getVal('cfFirstName') + ' ' + getVal('cfLastName'),
          phone:   getVal('cfPhone'),
          email:   getVal('cfEmail'),
          service: getVal('cfService'),
          date:    getVal('cfDate'),
          time:    getVal('cfTime'),
          message: getVal('cfMessage'),
        }
      });
    });
  }

  // ── Full appointment form (contact.html) ──
  const apptForm = $('#appointmentForm');
  if (apptForm) {
    on(apptForm, 'submit', async (e) => {
      e.preventDefault();
      if (!validateForm(apptForm)) return;
      await handleFormSubmit(apptForm, {
        successId: '#apptSuccess',
        formType:  'Full Appointment',
        fields: {
          name:      getVal('apptFirst') + ' ' + getVal('apptLast'),
          phone:     getVal('apptPhone'),
          email:     getVal('apptEmail'),
          age:       getVal('apptAge'),
          service:   getVal('apptService'),
          date:      getVal('apptDate'),
          time:      getVal('apptTime'),
          insurance: getVal('apptInsurance'),
          notes:     getVal('apptNotes'),
          source:    getVal('apptSource'),
        }
      });
    });
  }

  // Real-time inline validation
  $$('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    on(field, 'blur',  () => validateField(field));
    on(field, 'input', () => { if (field.classList.contains('error')) validateField(field); });
  });

  // Set minimum date to today on all date inputs
  const today = new Date().toISOString().split('T')[0];
  $$('input[type="date"]').forEach(input => input.setAttribute('min', today));
}

// Helper — safely get a field value (returns '' if field not on this page)
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ── CORE SUBMIT HANDLER ──────────────────────────────────────────
async function handleFormSubmit(form, { successId, formType, fields }) {
  const submitBtn = form.querySelector('[type="submit"]');

  // 1. Set loading state
  setButtonLoading(submitBtn, true);

  // 2. Build a human-readable summary for WhatsApp
  const waMessage = buildWhatsAppMessage(formType, fields);

  // 3. Run both integrations in parallel
  const [emailResult, waResult] = await Promise.allSettled([
    sendViaEmailJS(fields, formType),
    sendViaWhatsApp(waMessage),
  ]);

  // 4. Check outcomes
  const emailOK = emailResult.status === 'fulfilled' && emailResult.value === true;
  const waOK    = waResult.status    === 'fulfilled' && waResult.value    === true;

  if (emailOK || waOK) {
    // At least one channel succeeded — show success
    setButtonLoading(submitBtn, false);
    showFormSuccess(form, successId, { emailOK, waOK });
  } else {
    // Both failed — show a friendly error
    setButtonLoading(submitBtn, false);
    showFormError(submitBtn, emailResult.reason);
  }
}

// ── EMAIL VIA EmailJS ────────────────────────────────────────────
async function sendViaEmailJS(fields, formType) {
  // If credentials haven't been configured yet, skip gracefully
  // if (!MGMC_CONFIG.emailjs_service_id || MGMC_CONFIG.emailjs_service_id === 'YOUR_SERVICE_ID' || MGMC_CONFIG.emailjs_service_id === 'service_abc1234') {
  //   console.warn('[MGMC] EmailJS not configured — skipping email. Add real credentials to MGMC_CONFIG.');
  //   return false;
  // }

  // if (!MGMC_CONFIG.emailjs_service_id) {
  //   console.warn('[MGMC] EmailJS not configured.');
  //   return false;
  // }

  if (
    !MGMC_CONFIG.emailjs_service_id ||
    !MGMC_CONFIG.emailjs_template_id ||
    !MGMC_CONFIG.emailjs_public_key
  ) {
    console.warn('[MGMC] EmailJS configuration incomplete.');
    return false;
  }

  if (!window.emailjs) {
    console.warn('[MGMC] EmailJS SDK not loaded yet.');
    return false;
  }

  // Build the template parameters that map to your EmailJS template variables
  const templateParams = {
    form_type:       formType,
    patient_name:    fields.name    || 'Not provided',
    patient_phone:   fields.phone   || 'Not provided',
    patient_email:   fields.email   || 'Not provided',
    patient_age:     fields.age     || 'Not provided',
    service:         fields.service || 'Not provided',
    preferred_date:  fields.date    || 'Not provided',
    preferred_time:  fields.time    || 'Not provided',
    insurance:       fields.insurance || 'None / Self-pay',
    notes:           fields.notes   || fields.message || 'None',
    referral_source: fields.source  || 'Not specified',
    submitted_at:    new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
    reply_to:        fields.email   || '',
  };

  try {
    const response = await emailjs.send(
      MGMC_CONFIG.emailjs_service_id,
      MGMC_CONFIG.emailjs_template_id,
      templateParams
    );
    console.log('[MGMC] EmailJS sent:', response.status, response.text);
    return true;
  } catch (err) {
    console.error('[MGMC] EmailJS error:', err);
    throw err;
  }
}

// ── WHATSAPP INTEGRATION ─────────────────────────────────────────
async function sendViaWhatsApp(message) {
  if (MGMC_CONFIG.whatsapp_number === '2348000000000') {
    console.warn('[MGMC] WhatsApp number is still a placeholder. See SETUP.md');
    // Still open WhatsApp — just with the placeholder number in dev
  }

  const encoded = encodeURIComponent(message);
  const waURL   = `https://wa.me/${MGMC_CONFIG.whatsapp_number}?text=${encoded}`;

  // Open in new tab — patient sees the WhatsApp chat pre-filled
  window.open(waURL, '_blank', 'noopener,noreferrer');
  return true;
}

// ── BUILD WHATSAPP MESSAGE ────────────────────────────────────────
function buildWhatsAppMessage(formType, f) {
  const divider = '─────────────────────────';
  const lines = [
    `🏥 *MGMC ${formType} Request*`,
    divider,
    `👤 *Name:* ${f.name        || 'Not provided'}`,
    `📞 *Phone:* ${f.phone      || 'Not provided'}`,
    `✉️ *Email:* ${f.email      || 'Not provided'}`,
  ];

  if (f.age)       lines.push(`🤰 *Age/Gestation:* ${f.age}`);
  if (f.service)   lines.push(`🩺 *Service:* ${f.service}`);
  if (f.date)      lines.push(`📅 *Date:* ${formatDate(f.date)}`);
  if (f.time)      lines.push(`🕒 *Time:* ${f.time}`);
  if (f.insurance) lines.push(`🏥 *Insurance/HMO:* ${f.insurance}`);
  if (f.notes || f.message) lines.push(`📝 *Notes:* ${f.notes || f.message}`);
  if (f.source)    lines.push(`📣 *Heard via:* ${f.source}`);

  lines.push(divider);
  lines.push(`⏰ *Sent:* ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}`);
  lines.push('');
  lines.push('_Sent from MGMC website booking form_');

  return lines.join('\n');
}

function formatDate(dateStr) {
  if (!dateStr) return 'Not specified';
  try {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch { return dateStr; }
}

// ── FORM UI HELPERS ──────────────────────────────────────────────
function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.setAttribute('data-original', btn.innerHTML);
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending...';
    btn.disabled  = true;
    btn.style.opacity = '0.75';
  } else {
    btn.innerHTML = btn.getAttribute('data-original') || 'Submit';
    btn.disabled  = false;
    btn.style.opacity = '';
  }
}

function showFormSuccess(form, successId, { emailOK, waOK } = {}) {
  form.style.opacity       = '0';
  form.style.pointerEvents = 'none';
  setTimeout(() => {
    form.style.display = 'none';
    const successEl = $(successId);
    if (successEl) {
      // Inject a channel status summary into the success message
      const summaryId = successId.replace('#', '') + 'Channels';
      const existing  = document.getElementById(summaryId);
      if (!existing) {
        const div = document.createElement('div');
        div.id    = summaryId;
        div.style.cssText = 'margin:0.75rem 0;font-size:0.85rem;display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap';
        div.innerHTML = `
          <span style="color:${emailOK ? 'var(--green)' : 'var(--gray-400)'}">
            ${emailOK ? '✅' : '⚠️'} Email ${emailOK ? 'sent' : 'unavailable'}
          </span>
          <span style="color:${waOK ? '#25D366' : 'var(--gray-400)'}">
            ${waOK ? '✅' : '⚠️'} WhatsApp ${waOK ? 'opened' : 'unavailable'}
          </span>
        `;
        const para = successEl.querySelector('p');
        if (para) para.after(div);
      }
      successEl.style.display = 'block';
    }
  }, 500);
}

function showFormError(btn, err) {
  // Restore button
  if (btn) {
    btn.innerHTML = btn.getAttribute('data-original') || 'Submit';
    btn.disabled  = false;
    btn.style.opacity = '';
  }

  // Show a non-blocking error toast
  showToast(
    '⚠️ Submission issue — please call us directly on <a href="tel:+2347033163621" style="color:#fff;font-weight:700">+234 703 316 3621</a>',
    'error'
  );
  console.error('[MGMC] Form submission failed:', err);
}

// ── TOAST NOTIFICATION ───────────────────────────────────────────
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.getElementById('mgmcToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id    = 'mgmcToast';
  const bg    = type === 'error' ? 'var(--emergency)' : 'var(--green)';
  toast.style.cssText = `
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(100px);
    background:${bg}; color:#fff; padding:1rem 1.5rem; border-radius:var(--radius);
    box-shadow:0 8px 32px rgba(0,0,0,0.3); z-index:9999; font-size:0.92rem;
    max-width:420px; text-align:center; line-height:1.5;
    transition:transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease;
  `;
  toast.innerHTML = message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  // Auto-dismiss after 6 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 400);
  }, 6000);
}

// ── FIELD VALIDATION ─────────────────────────────────────────────
function validateField(field) {
  const val   = field.value.trim();
  let valid   = true;
  let message = '';

  if (field.required && !val) {
    valid   = false;
    message = 'This field is required';
  } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    valid   = false;
    message = 'Please enter a valid email address';
  } else if (field.type === 'tel' && val && !/^[\d\s\+\-\(\)]{7,}$/.test(val)) {
    valid   = false;
    message = 'Please enter a valid phone number';
  }

  field.classList.toggle('error', !valid);

  // Show/hide inline error message
  let errorEl = field.parentElement.querySelector('.field-error');
  if (!valid) {
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.style.cssText = 'font-size:0.78rem;color:var(--emergency);margin-top:0.2rem;display:block';
      field.after(errorEl);
    }
    errorEl.textContent = message;
  } else if (errorEl) {
    errorEl.remove();
  }

  return valid;
}

function validateForm(form) {
  const fields   = $$('input[required], select[required], textarea[required]', form);
  let allValid   = true;
  fields.forEach(f => {
    // Special handling for checkboxes
    if (f.type === 'checkbox' && !f.checked) {
      f.classList.add('error');
      let errorEl = f.parentElement.querySelector('.field-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = 'font-size:0.78rem;color:var(--emergency);margin-top:0.2rem;display:block';
        f.after(errorEl);
      }
      errorEl.textContent = 'You must agree to continue';
      allValid = false;
    } else if (f.type !== 'checkbox' && !validateField(f)) {
      allValid = false;
    }
  });
  if (!allValid) {
    const firstError = form.querySelector('.error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return allValid;
}

// ── GALLERY LIGHTBOX ─────────────────────────────────────────────
function initGallery() {
  const lightbox  = $('#lightbox');
  const lbEmoji   = $('#lbEmoji');
  const lbCaption = $('#lbCaption');
  const lbClose   = $('#lbClose');

  $$('.gallery-page-item, .gallery-item').forEach(item => {
    on(item, 'click',   () => openLightbox(item));
    on(item, 'keydown', e => { if (e.key === 'Enter') openLightbox(item); });
  });

  function openLightbox(item) {
    if (!lightbox) return;
    const emoji = item.querySelector('.g-emoji')?.textContent || '🏥';
    const label = item.getAttribute('data-label') || '';
    if (lbEmoji)   lbEmoji.textContent   = emoji;
    if (lbCaption) lbCaption.textContent = label;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose && lbClose.focus();
  }

  function closeLightbox() {
    lightbox && lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  on(lbClose,   'click',   closeLightbox);
  on(lightbox,  'click',   e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ── BACK TO TOP ──────────────────────────────────────────────────
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── SMOOTH SCROLL ────────────────────────────────────────────────
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  // Only intercept pure in-page hashes (e.g. "#about"), not cross-page hashes (e.g. "contact.html#form")
  if (href.startsWith('#') && href.length > 1) {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// ── HERO PARALLAX ────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  $$('.hero-shape').forEach((shape, i) => {
    shape.style.transform = `translateY(${scrollY * (0.03 + i * 0.02)}px)`;
  });
}, { passive: true });

// ── LOADING SPINNER STYLES (injected once) ───────────────────────
(function injectSpinnerCSS() {
  if (document.getElementById('mgmc-spinner-css')) return;
  const style = document.createElement('style');
  style.id = 'mgmc-spinner-css';
  style.textContent = `
    @keyframes mgmc-spin { to { transform: rotate(360deg); } }
    .spinner {
      display: inline-block;
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: mgmc-spin 0.7s linear infinite;
      vertical-align: middle;
      margin-right: 6px;
    }
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
      border-color: var(--emergency) !important;
      box-shadow: 0 0 0 3px rgba(198,40,40,0.1) !important;
    }
  `;
  document.head.appendChild(style);
})();
