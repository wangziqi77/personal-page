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
const bookDialog = document.querySelector('#book-dialog');
const pendingDialog = document.querySelector('#pending-dialog');
const flipCard = document.querySelector('#flip-card');
const frontFace = document.querySelector('.flip-card__front');
const backFace = document.querySelector('.flip-card__back');
const flipToLetter = document.querySelector('#flip-to-letter');
const flipToPhoto = document.querySelector('#flip-to-photo');
const letterBody = giftDialog.querySelector('.letter-body');
const bookStage = document.querySelector('#book-stage');
const bookFlip = document.querySelector('#book-flip');
const bookFront = document.querySelector('#book-to-letter');
const bookBack = bookFlip.querySelector('.flip-card__back');
const bookToCover = document.querySelector('#book-to-cover');
const bookWrap = document.querySelector('#bubble-wrap');
const bubbleGrid = document.querySelector('#bubble-grid');
const bubbleLight = bookWrap.querySelector('.bubble-wrap__light');
const bookInstruction = document.querySelector('#book-instruction');
const bubbleCount = document.querySelector('#bubble-count');
const bubbleReplay = document.querySelector('#bubble-replay');
const toast = document.querySelector('#toast');
const statusText = document.querySelector('#status-text');
const previewParams = new URLSearchParams(location.search);
const isLocalPreview = ['localhost', '127.0.0.1'].includes(location.hostname);
const previewFirstDay = isLocalPreview && previewParams.has('preview');
const previewSecondDay = isLocalPreview && previewParams.has('preview-day-2');
const baseHeartPath = [[2,1], [3,0], [4,0], [5,1], [6,2], [7,3], [6,4], [5,5], [4,6], [3,6], [2,5], [2,4], [3,3], [2,2]];
const bubbleRows = 11;
const bubbleColumns = 7;
const heartPath = baseHeartPath.map(([row, col]) => [row + 1, col]);
let bubbleStep = 0;
let revealTimer;
let toastTimer;
let serverTimeOffset = 0;

function isPreviewed(index) {
  return (index === 0 && previewFirstDay) || (index === 1 && previewSecondDay);
}

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
    const locked = current < unlockTimes[index] && !isPreviewed(index);
    card.classList.toggle('is-locked', locked);
    card.setAttribute('aria-label', `Day ${index + 1}, ${dates[index]}${locked ? ', locked until midnight Korea time' : ', unlocked'}`);
    card.querySelector('.day-card__mark').textContent = locked ? '' : '✦';
    card.querySelector('.day-card__bottom').firstChild.textContent = locked ? 'Opens at 12 ' : index === 0 ? 'A gift for you ' : index === 1 ? 'A book for you ' : 'Little surprise ';
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

function setBookFlipped(flipped) {
  bookFlip.classList.toggle('is-flipped', flipped);
  bookFront.setAttribute('aria-hidden', String(flipped));
  bookBack.setAttribute('aria-hidden', String(!flipped));
  bookFront.tabIndex = flipped || !bookStage.classList.contains('is-revealed') ? -1 : 0;
  bookToCover.tabIndex = flipped ? 0 : -1;
  if (flipped) bookBack.querySelector('.letter-body').scrollTop = 0;
}

function guideNextBubble() {
  const [row, col] = heartPath[bubbleStep];
  const next = bubbleGrid.querySelector(`[data-step="${bubbleStep}"]`);
  next.disabled = false;
  next.tabIndex = 0;
  next.classList.add('is-next');
  bubbleLight.style.left = `${(col + .5) / bubbleColumns * 100}%`;
  bubbleLight.style.top = `${(row + .5) / bubbleRows * 100}%`;
  bookWrap.style.setProperty('--light-x', `${(col + .5) / bubbleColumns * 100}%`);
  bookWrap.style.setProperty('--light-y', `${(row + .5) / bubbleRows * 100}%`);
  bubbleCount.textContent = `${bubbleStep} / ${heartPath.length}`;
}

function revealBook() {
  bookStage.classList.add('is-revealed');
  bookWrap.setAttribute('aria-hidden', 'true');
  bookFlip.setAttribute('aria-hidden', 'false');
  bookFront.tabIndex = 0;
  bubbleCount.hidden = true;
  bubbleReplay.hidden = false;
  bookInstruction.textContent = 'Your book is here. Tap the cover to read the letter ♡';
  try { localStorage.setItem('irene-day-2-revealed', 'true'); } catch {}
}

function buildBubbleWrap() {
  clearTimeout(revealTimer);
  bubbleStep = 0;
  bookStage.classList.remove('is-revealed', 'is-heart-complete');
  bookWrap.setAttribute('aria-hidden', 'false');
  bookFlip.setAttribute('aria-hidden', 'true');
  bubbleCount.hidden = false;
  bubbleReplay.hidden = true;
  bookInstruction.textContent = 'Follow the light. Pop the bubbles to make a heart ♡';
  setBookFlipped(false);
  const steps = new Map(heartPath.map(([row, col], step) => [row * bubbleColumns + col, step]));
  bubbleGrid.replaceChildren();
  for (let index = 0; index < bubbleColumns * bubbleRows; index++) {
    const step = steps.get(index);
    const bubble = document.createElement(step === undefined ? 'span' : 'button');
    bubble.className = 'bubble';
    if (step === undefined) {
      bubble.setAttribute('aria-hidden', 'true');
    } else {
      bubble.type = 'button';
      bubble.disabled = true;
      bubble.tabIndex = -1;
      bubble.dataset.step = String(step);
      bubble.setAttribute('aria-label', `Pop heart bubble ${step + 1} of ${heartPath.length}`);
      bubble.addEventListener('click', () => {
        if (step !== bubbleStep) return;
        bubble.classList.remove('is-next');
        bubble.classList.add('is-popped');
        bubble.disabled = true;
        bubbleStep++;
        bubbleCount.textContent = `${bubbleStep} / ${heartPath.length}`;
        if (bubbleStep === heartPath.length) {
          bookStage.classList.add('is-heart-complete');
          bookInstruction.textContent = 'A heart for you. Unwrapping your gift… ♡';
          revealTimer = setTimeout(revealBook, 750);
        } else {
          guideNextBubble();
        }
      });
    }
    bubbleGrid.append(bubble);
  }
  guideNextBubble();
}

function openBook() {
  buildBubbleWrap();
  try {
    if (!previewSecondDay && localStorage.getItem('irene-day-2-revealed') === 'true') revealBook();
  } catch {}
  bookDialog.showModal();
}

cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    if (now() < unlockTimes[index] && !isPreviewed(index)) {
      showToast(`Day ${index + 1} opens ${dates[index]} at 12:00 AM Korea time ♡`);
      return;
    }
    if (index === 0) {
      setFlipped(false);
      giftDialog.showModal();
      card.classList.add('is-opened');
      try { localStorage.setItem('irene-day-1-opened', 'true'); } catch {}
    } else if (index === 1) {
      openBook();
      card.classList.add('is-opened');
      try { localStorage.setItem('irene-day-2-opened', 'true'); } catch {}
    } else {
      pendingDialog.showModal();
    }
  });
});

flipToLetter.addEventListener('click', () => setFlipped(true));
flipToPhoto.addEventListener('click', () => setFlipped(false));
bookFront.addEventListener('click', () => setBookFlipped(true));
bookToCover.addEventListener('click', () => setBookFlipped(false));
bubbleReplay.addEventListener('click', buildBubbleWrap);

document.querySelectorAll('.dialog-close').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});

[giftDialog, bookDialog, pendingDialog].forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

try {
  if (localStorage.getItem('irene-day-1-opened') === 'true') cards[0].classList.add('is-opened');
  if (localStorage.getItem('irene-day-2-opened') === 'true') cards[1].classList.add('is-opened');
} catch {}

updateCalendar();
syncClock();
setInterval(updateCalendar, 15000);
setInterval(syncClock, 300000);
