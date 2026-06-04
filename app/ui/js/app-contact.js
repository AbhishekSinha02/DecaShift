// app-contact.js — Help & Feedback form (FEAT-006). A signed-in user sends a message
// (name / email / phone / mood-type / text) → users/{userId}/contact/ on Drive. Fully
// isolated module; reachable only via the Settings tile, which is gated by
// FEATURES.contactForm and only exists for a logged-in user.

let _contactType = null;

// Reset + prefill the form each time the section opens.
function _initContactSection() {
  if (!state.user) return;

  document.getElementById('contact-form-fields')?.classList.remove('hidden');
  document.getElementById('contact-success')?.classList.add('hidden');

  const nameEl  = document.getElementById('contact-name');
  const emailEl = document.getElementById('contact-email');
  const phoneEl = document.getElementById('contact-phone');
  const msgEl   = document.getElementById('contact-message');
  if (nameEl)  nameEl.value  = state.user.name  || '';
  if (emailEl) emailEl.value = state.user.email || '';   // prefill legacy email if present
  if (phoneEl) phoneEl.value = '';
  if (msgEl)   msgEl.value   = '';

  _contactType = null;
  document.querySelectorAll('#contact-type-chips .contact-chip').forEach(c => c.classList.remove('active'));
  const err = document.getElementById('contact-err');
  if (err) err.textContent = '';
}

function _selectContactType(btn) {
  _contactType = btn.getAttribute('data-type');
  document.querySelectorAll('#contact-type-chips .contact-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const err = document.getElementById('contact-err');
  if (err) err.textContent = '';
}

async function _submitContactForm() {
  if (!state.user) return;
  const err = document.getElementById('contact-err');
  const set = m => { if (err) err.textContent = m; };
  set('');

  const name    = (document.getElementById('contact-name').value    || '').trim();
  const email   = (document.getElementById('contact-email').value   || '').trim();
  const phone   = (document.getElementById('contact-phone').value   || '').trim();
  const message = (document.getElementById('contact-message').value || '').trim();

  // Email required; phone optional but validated if present (FEAT-006 decisions).
  if (!name)                                       return set('Please enter your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))    return set('Please enter a valid email so we can reply.');
  if (phone && phone.replace(/\D/g, '').length !== 10) return set('Phone should be a 10-digit number, or leave it blank.');
  if (!_contactType)                               return set('Please pick what this is about.');
  if (message.length < 10)                         return set('Please write a little more (at least 10 characters).');

  const btn = document.getElementById('contact-send-btn');
  btn.disabled = true; btn.textContent = 'Sending…';

  const now = new Date();
  const payload = {
    userId:      state.user.userId,
    loginId:     state.user.loginId || null,
    name, email, phone: phone || null,
    type:        _contactType,
    message,
    build:       (typeof BUILD !== 'undefined') ? BUILD : null,
    date:        now.toISOString().slice(0, 10),
    submittedAt: now.toISOString()
  };

  const res = await Storage.submitContact(payload);
  btn.disabled = false; btn.textContent = 'Send →';

  if (res && res.success) {
    // swap to the confirmation; the typed message is gone only on success
    document.getElementById('contact-form-fields').classList.add('hidden');
    document.getElementById('contact-success').classList.remove('hidden');
  } else {
    // never lose the user's words on a failure — fields are untouched
    set('Couldn’t send right now. Check your connection and try again — your message is safe.');
  }
}

function _resetContactForm() {
  _initContactSection();
}
