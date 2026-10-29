const unlockTimes = [
  '2026-10-29T15:00:00Z', // Oct 30, 00:00 in Seoul
  '2026-10-30T15:00:00Z',
  '2026-10-31T15:00:00Z',
  '2026-11-01T15:00:00Z',
  '2026-11-02T15:00:00Z',
  '2026-11-03T15:00:00Z',
  '2026-11-04T15:00:00Z',
].map((value) => Date.parse(value));

const dates = ['Oct 30', 'Oct 31', 'Nov 1', 'Nov 2', 'Nov 3', 'Nov 4', 'Nov 5'];
const cards = [...document.querySelectorAll('.day-card')];
const giftDialog = document.querySelector('#gift-dialog');
const pendingDialog = document.querySelector('#pending-dialog');
const flipCard = document.querySelector('#flip-card');
const frontFace = document.querySelector('.flip-card__front');
const backFace = document.querySelector('.flip-card__back');
const flipToLetter = document.querySelector('#flip-to-letter');
const flipToPhoto = document.querySelector('#flip-to-photo');
const letterBody = document.querySelector('.letter-body');
const toast = document.querySelector('#toast');
const statusText = document.querySelector('#status-text');
const previewFirstDay = new URLSearchParams(location.search).has('preview');
let toastTimer;
let serverTimeOffset = 0;

async function syncClock() {
  try {
    const before = Date.now();
    const response = await fetch(location.pathname, { method: 'HEAD', cache: 'no-store' });
    const after = Date.now();
    const serverDate = Date.parse(response.headers.get('Date'));
    if (response.ok && Number.isFinite(serverDate)) {
      serverTimeOffset = serverDate + (after - before) / 2 - after;
    }
  } catch {
    // The calendar also works offline using the device clock.
  }
  updateCalendar();
}

function now() { return Date.now() + serverTimeOffset; }

function pad(value) { return String(value).padStart(2, '0'); }

function countdown(milliseconds) {
  const total = Math.max(0, Math.ceil(milliseconds / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days > 0) return `${days}d ${pad(hours)}h until the next gift`;
  return `${pad(hours)}h ${pad(minutes)}m until the next gift`;
}

function updateCalendar() {
  const current = now();
  cards.forEach((card, index) => {
    const locked = current < unlockTimes[index] && !(previewFirstDay && index === 0);
    card.classList.toggle('is-locked', locked);
    card.setAttribute('aria-label', `Day ${index + 1}, ${dates[index]}${locked ? ', locked until midnight Korea time' : ', unlocked'}`);
    card.querySelector('.day-card__mark').textContent = locked ? '' : '✦';
    card.querySelector('.day-card__bottom').firstChild.textContent = locked ? 'Opens at 12 ' : index === 0 ? 'A gift for you ' : 'Little surprise ';
  });

  const next = unlockTimes.find((time) => time > current);
  if (next) {
    statusText.textContent = countdown(next - current);
  } else {
    statusText.textContent = 'All seven days are here for you ♡';
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

function setFlipped(flipped) {
  flipCard.classList.toggle('is-flipped', flipped);
  frontFace.setAttribute('aria-hidden', String(flipped));
  backFace.setAttribute('aria-hidden', String(!flipped));
  flipToLetter.tabIndex = flipped ? -1 : 0;
  flipToPhoto.tabIndex = flipped ? 0 : -1;
  if (flipped) letterBody.scrollTop = 0;
}

cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    if (now() < unlockTimes[index] && !(previewFirstDay && index === 0)) {
      showToast(`Day ${index + 1} opens ${dates[index]} at 12:00 AM Korea time ♡`);
      return;
    }
    if (index === 0) {
      setFlipped(false);
      giftDialog.showModal();
      card.classList.add('is-opened');
      try { localStorage.setItem('irene-day-1-opened', 'true'); } catch {}
    } else {
      pendingDialog.showModal();
    }
  });
});

flipToLetter.addEventListener('click', () => setFlipped(true));
flipToPhoto.addEventListener('click', () => setFlipped(false));

document.querySelectorAll('.dialog-close').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});

[giftDialog, pendingDialog].forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

try {
  if (localStorage.getItem('irene-day-1-opened') === 'true') cards[0].classList.add('is-opened');
} catch {}

updateCalendar();
syncClock();
setInterval(updateCalendar, 15000);
setInterval(syncClock, 300000);
