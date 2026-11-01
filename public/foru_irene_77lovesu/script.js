const unlockTimes = [
  '2026-10-29T15:00:00Z', // Oct 30, 00:00 in Seoul
  '2026-10-30T00:00:00Z', // Day 2 opened early for Irene
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
const birdDialog = document.querySelector('#bird-dialog');
const birdStage = document.querySelector('#bird-stage');
const birdWeave = document.querySelector('#bird-weave');
const birdReveal = document.querySelector('#bird-reveal');
const birdTurn = document.querySelector('#bird-turn');
const birdTurnHint = document.querySelector('#bird-turn-hint');
const birdNote = document.querySelector('#bird-note');
const birdNoteBody = birdNote.querySelector('.letter-body');
const birdNoteScrollHint = document.querySelector('#bird-note-scroll-hint');
const birdNoteOpen = document.querySelector('#bird-note-open');
const birdNoteClose = document.querySelector('#bird-note-close');
const weaveGlow = document.querySelector('#weave-glow');
const weaveLayers = ['#silk-weave-head', '#silk-weave-body', '#silk-weave-tail'].map((selector) => document.querySelector(selector));
const birdInstruction = document.querySelector('#bird-instruction');
const birdCount = document.querySelector('#bird-count');
const birdReplay = document.querySelector('#bird-replay');
const incenseDialog = document.querySelector('#incense-dialog');
const incenseStage = document.querySelector('#incense-stage');
const incenseScene = document.querySelector('#incense-scene');
const incenseReveal = document.querySelector('#incense-reveal');
const incenseIgnite = document.querySelector('#incense-ignite');
const incenseNote = document.querySelector('#incense-note');
const incenseNoteBody = incenseNote.querySelector('.letter-body');
const incenseNoteScrollHint = document.querySelector('#incense-note-scroll-hint');
const incenseNoteOpen = document.querySelector('#incense-note-open');
const incenseNoteClose = document.querySelector('#incense-note-close');
const incenseInstruction = document.querySelector('#incense-instruction');
const incenseReplay = document.querySelector('#incense-replay');
const toast = document.querySelector('#toast');
const statusText = document.querySelector('#status-text');
const previewParams = new URLSearchParams(location.search);
const isLocalPreview = ['localhost', '127.0.0.1'].includes(location.hostname);
const previewFirstDay = isLocalPreview && previewParams.has('preview');
const previewSecondDay = isLocalPreview && previewParams.has('preview-day-2');
const previewThirdDay = isLocalPreview && previewParams.has('preview-day-3');
const previewFourthDay = isLocalPreview && previewParams.has('preview-day-4');
const baseHeartPath = [[2,1], [3,0], [4,0], [5,1], [6,2], [7,3], [6,4], [5,5], [4,6], [3,6], [2,5], [2,4], [3,3], [2,2]];
const bubbleRows = 11;
const bubbleColumns = 7;
const heartPath = baseHeartPath.map(([row, col]) => [row + 1, col]);
let bubbleStep = 0;
let revealTimer;
let birdRevealTimer;
let birdGlowTimer;
let birdThreadStep = 0;
let incenseRevealTimer;
let toastTimer;
let serverTimeOffset = 0;

function isPreviewed(index) {
  return (index === 0 && previewFirstDay) || (index === 1 && previewSecondDay) || (index === 2 && previewThirdDay) || (index === 3 && previewFourthDay);
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
    card.querySelector('.day-card__bottom').firstChild.textContent = locked ? 'Opens at 12 ' : index === 0 ? 'A gift for you ' : index === 1 ? 'A book for you ' : index === 2 ? 'A bird for you ' : index === 3 ? 'A moment of calm ' : 'Little surprise ';
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

function setBirdTurned(turned) {
  birdTurn.classList.toggle('is-turned', turned);
  birdTurn.setAttribute('aria-label', turned ? 'Turn Sophiae to see her face' : 'Turn Sophiae around to see her tail');
  birdTurnHint.textContent = turned ? 'Tap Sophiae to see her face ↻' : 'Tap Sophiae to see her other side ↻';
}

function buildSilkWeave() {
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const addFiber = (layer, path, color, delay, width = 2.4, type = '') => {
    const fiber = document.createElementNS(svgNamespace, 'path');
    fiber.setAttribute('d', path);
    fiber.setAttribute('pathLength', '1');
    fiber.setAttribute('class', `silk-fiber${type ? ` silk-fiber--${type}` : ''}`);
    fiber.style.setProperty('--fiber-color', color);
    fiber.style.setProperty('--fiber-delay', `${delay}ms`);
    fiber.style.setProperty('--fiber-width', String(width));
    layer.append(fiber);
  };

  const head = weaveLayers[0];
  for (let row = 0; row < 30; row++) {
    const y = 68 + row * 5.4;
    const wave = Math.sin(row * .64) * 4;
    const path = `M 72 ${y.toFixed(1)} C 145 ${(y - 7 + wave).toFixed(1)} 255 ${(y + 7 - wave).toFixed(1)} 328 ${y.toFixed(1)}`;
    addFiber(head, path, row < 17 ? (row % 3 ? '#e8ba8f' : '#f4d5aa') : (row % 3 ? '#e5c4d9' : '#d7b8db'), row * 27, 2.7);
    if (row % 4 === 0) addFiber(head, `M 92 ${(y - 1).toFixed(1)} Q 200 ${(y - 8).toFixed(1)} 307 ${(y - 1).toFixed(1)}`, '#fff2d8', row * 27 + 160, .8, 'glint');
  }
  for (let column = 0; column < 29; column++) {
    const x = 90 + column * 7.8;
    const sway = Math.sin(column * .7) * 6;
    addFiber(head, `M ${x.toFixed(1)} 48 C ${(x + sway).toFixed(1)} 112 ${(x - sway).toFixed(1)} 164 ${x.toFixed(1)} 236`, column % 3 ? '#f5ddc2' : '#d2add2', 280 + column * 23, 1.4, 'cross');
  }

  const body = weaveLayers[1];
  for (let row = 0; row < 31; row++) {
    const y = 169 + row * 5.7;
    const wave = Math.sin(row * .7) * 7;
    addFiber(body, `M 61 ${y.toFixed(1)} C 135 ${(y + wave).toFixed(1)} 265 ${(y - wave).toFixed(1)} 339 ${y.toFixed(1)}`, row % 4 === 0 ? '#e8c5e8' : row % 2 ? '#b79bd5' : '#cbb1e4', row * 24, 2.8);
    if (row % 4 === 1) addFiber(body, `M 74 ${(y - 1).toFixed(1)} C 160 ${(y - 5).toFixed(1)} 245 ${(y + 4).toFixed(1)} 325 ${(y - 1).toFixed(1)}`, '#f8e8ff', row * 24 + 125, .85, 'glint');
  }
  for (let column = 0; column < 35; column++) {
    const x = 65 + column * 7.9;
    const bend = Math.sin(column * .52) * 8;
    addFiber(body, `M ${x.toFixed(1)} 158 C ${(x + bend).toFixed(1)} 222 ${(x - bend).toFixed(1)} 275 ${x.toFixed(1)} 348`, column % 3 ? '#e1cbed' : '#9d82c3', 330 + column * 19, 1.4, 'cross');
  }
  for (let row = 0; row < 11; row++) {
    const y = 190 + row * 13;
    for (let column = 0; column < 9; column++) {
      const x = 91 + column * 27 + (row % 2) * 13;
      addFiber(body, `M ${x} ${y - 2} Q ${x + 1.4} ${y} ${x} ${y + 2}`, '#fff5ff', 600 + row * 45 + column * 12, 1, 'glint');
    }
  }

  const tail = weaveLayers[2];
  for (let row = 0; row < 22; row++) {
    const y = 316 + row * 4.5;
    addFiber(tail, `M 152 ${y.toFixed(1)} Q 200 ${(y + Math.sin(row * .6) * 7).toFixed(1)} 248 ${y.toFixed(1)}`, row % 3 ? '#8e78b5' : '#bb9fd6', row * 37, 2.5);
  }
  for (let column = 0; column < 17; column++) {
    const x = 166 + column * 4.3;
    addFiber(tail, `M ${x.toFixed(1)} 315 Q ${(x - 5 + column * .6).toFixed(1)} 360 ${x.toFixed(1)} 414`, column % 3 ? '#bca6db' : '#625386', 320 + column * 35, 1.3, 'cross');
  }
}

buildSilkWeave();

function resetBird() {
  clearTimeout(birdRevealTimer);
  clearTimeout(birdGlowTimer);
  birdThreadStep = 0;
  birdStage.classList.remove('is-revealed');
  birdStage.dataset.threadStep = '0';
  birdWeave.setAttribute('aria-hidden', 'false');
  birdReveal.setAttribute('aria-hidden', 'true');
  birdTurn.tabIndex = -1;
  birdNoteOpen.tabIndex = -1;
  birdNote.hidden = true;
  setBirdTurned(false);
  birdInstruction.hidden = false;
  weaveGlow.hidden = false;
  weaveGlow.disabled = false;
  weaveGlow.setAttribute('aria-label', 'Tap the glowing light to weave golden silk');
  birdCount.hidden = false;
  birdReplay.hidden = true;
  birdInstruction.textContent = 'Tap the glowing light inside the picture.';
  birdCount.textContent = '0 / 3 silks woven';
  weaveLayers.forEach((layer) => layer.classList.remove('is-woven'));
}

function revealBird() {
  birdStage.classList.add('is-revealed');
  birdWeave.setAttribute('aria-hidden', 'true');
  birdReveal.setAttribute('aria-hidden', 'false');
  birdTurn.tabIndex = 0;
  birdNoteOpen.tabIndex = 0;
  weaveGlow.hidden = true;
  birdCount.hidden = true;
  birdReplay.hidden = false;
  birdInstruction.hidden = true;
  try { if (!previewThirdDay) localStorage.setItem('irene-day-3-revealed', 'true'); } catch {}
}

function openBird() {
  resetBird();
  try {
    if (!previewThirdDay && localStorage.getItem('irene-day-3-revealed') === 'true') revealBird();
  } catch {}
  birdDialog.showModal();
}

function resetIncense() {
  clearTimeout(incenseRevealTimer);
  incenseStage.classList.remove('is-lit', 'is-revealed');
  incenseScene.setAttribute('aria-hidden', 'false');
  incenseReveal.setAttribute('aria-hidden', 'true');
  incenseIgnite.hidden = false;
  incenseIgnite.disabled = false;
  incenseNote.hidden = true;
  incenseNoteOpen.hidden = true;
  incenseReplay.hidden = true;
  incenseInstruction.textContent = 'Tap the glowing tip to light the incense.';
}

function revealIncense() {
  incenseStage.classList.add('is-revealed');
  incenseScene.setAttribute('aria-hidden', 'true');
  incenseReveal.setAttribute('aria-hidden', 'false');
  incenseIgnite.hidden = true;
  incenseNoteOpen.hidden = false;
  incenseReplay.hidden = false;
  incenseInstruction.textContent = 'Your gift is here. Let the warmth linger a little.';
  try { if (!previewFourthDay) localStorage.setItem('irene-day-4-revealed', 'true'); } catch {}
}

function openIncense() {
  resetIncense();
  try {
    if (!previewFourthDay && localStorage.getItem('irene-day-4-revealed') === 'true') revealIncense();
  } catch {}
  incenseDialog.showModal();
}

weaveGlow.addEventListener('click', () => {
  if (weaveGlow.disabled || birdThreadStep >= weaveLayers.length) return;
  weaveGlow.disabled = true;
  weaveLayers[birdThreadStep].classList.add('is-woven');
  birdThreadStep++;
  birdCount.textContent = `${birdThreadStep} / ${weaveLayers.length} silks woven`;
  if (birdThreadStep === weaveLayers.length) {
    weaveGlow.hidden = true;
    birdInstruction.textContent = 'The last silk is finding its place…';
    birdRevealTimer = setTimeout(revealBird, 2400);
  } else {
    const nextSilk = birdThreadStep === 1 ? 'lilac' : 'violet';
    birdInstruction.textContent = `The ${birdThreadStep === 1 ? 'golden' : 'lilac'} silk is woven. Follow the light again.`;
    birdStage.dataset.threadStep = String(birdThreadStep);
    weaveGlow.setAttribute('aria-label', `Tap the glowing light to weave ${nextSilk} silk`);
    birdGlowTimer = setTimeout(() => { weaveGlow.disabled = false; }, 700);
  }
});

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
    } else if (index === 2) {
      openBird();
      card.classList.add('is-opened');
      try { localStorage.setItem('irene-day-3-opened', 'true'); } catch {}
    } else if (index === 3) {
      openIncense();
      card.classList.add('is-opened');
      try { if (!previewFourthDay) localStorage.setItem('irene-day-4-opened', 'true'); } catch {}
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
birdTurn.addEventListener('click', () => setBirdTurned(!birdTurn.classList.contains('is-turned')));
birdReplay.addEventListener('click', resetBird);
function updateBirdNoteScrollHint() {
  birdNoteScrollHint.hidden = birdNoteBody.scrollHeight - birdNoteBody.scrollTop - birdNoteBody.clientHeight < 8;
}
birdNoteBody.addEventListener('scroll', updateBirdNoteScrollHint);
birdNoteOpen.addEventListener('click', () => {
  birdNote.hidden = false;
  birdReveal.setAttribute('aria-hidden', 'true');
  birdTurn.tabIndex = -1;
  birdNoteOpen.tabIndex = -1;
  birdNoteBody.scrollTop = 0;
  requestAnimationFrame(updateBirdNoteScrollHint);
  birdNoteBody.focus();
});
birdNoteClose.addEventListener('click', () => {
  birdNote.hidden = true;
  birdReveal.setAttribute('aria-hidden', 'false');
  birdTurn.tabIndex = 0;
  birdNoteOpen.tabIndex = 0;
  birdNoteOpen.focus();
});
birdDialog.addEventListener('close', () => clearTimeout(birdRevealTimer));
incenseIgnite.addEventListener('click', () => {
  if (incenseIgnite.disabled) return;
  incenseIgnite.disabled = true;
  incenseIgnite.hidden = true;
  incenseStage.classList.add('is-lit');
  incenseInstruction.textContent = 'Watch the smoke carry a wish to you…';
  incenseRevealTimer = setTimeout(revealIncense, 2800);
});
incenseReplay.addEventListener('click', resetIncense);
function updateIncenseNoteScrollHint() {
  incenseNoteScrollHint.hidden = incenseNoteBody.scrollHeight - incenseNoteBody.scrollTop - incenseNoteBody.clientHeight < 8;
}
incenseNoteBody.addEventListener('scroll', updateIncenseNoteScrollHint);
incenseNoteOpen.addEventListener('click', () => {
  incenseNote.hidden = false;
  incenseReveal.setAttribute('aria-hidden', 'true');
  incenseNoteBody.scrollTop = 0;
  requestAnimationFrame(updateIncenseNoteScrollHint);
  incenseNoteBody.focus();
});
incenseNoteClose.addEventListener('click', () => {
  incenseNote.hidden = true;
  incenseReveal.setAttribute('aria-hidden', 'false');
  incenseNoteOpen.focus();
});
incenseDialog.addEventListener('close', () => clearTimeout(incenseRevealTimer));

document.querySelectorAll('.dialog-close').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});

[giftDialog, bookDialog, birdDialog, incenseDialog, pendingDialog].forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

try {
  if (localStorage.getItem('irene-day-1-opened') === 'true') cards[0].classList.add('is-opened');
  if (localStorage.getItem('irene-day-2-opened') === 'true') cards[1].classList.add('is-opened');
  if (localStorage.getItem('irene-day-3-opened') === 'true') cards[2].classList.add('is-opened');
  if (localStorage.getItem('irene-day-4-opened') === 'true') cards[3].classList.add('is-opened');
} catch {}

updateCalendar();
syncClock();
setInterval(updateCalendar, 15000);
setInterval(syncClock, 300000);
