import cardInit from '../card/card.js';

const VISIBLE = 3;

function getSlideWidth(track) {
  const slide = track.querySelector('.carousel-slide');
  return slide ? slide.getBoundingClientRect().width : 0;
}

function buildArrow(direction) {
  const btn = document.createElement('button');
  btn.className = `carousel-arrow carousel-arrow-${direction}`;
  btn.setAttribute('aria-label', direction === 'prev' ? 'Previous slide' : 'Next slide');
  btn.setAttribute('type', 'button');
  btn.innerHTML = direction === 'prev' ? '&#8249;' : '&#8250;';
  return btn;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  console.log(rows);
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';
  viewport.append(track);

  rows.forEach((row) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    const card = document.createElement('div');
    card.className = 'card';
    [...el.classList]
      .filter((c) => c !== 'carousel' && c !== 'block')
      .forEach((c) => card.classList.add(c));
    card.append(row);
    cardInit(card);

    slide.append(card);
    track.append(slide);
  });

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  const prevBtn = buildArrow('prev');
  const nextBtn = buildArrow('next');
  nav.append(prevBtn, nextBtn);

  let idx = 0;
  const max = rows.length - VISIBLE;

  function updateState() {
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx >= max;
    const offset = idx * getSlideWidth(track);
    track.style.transform = `translateX(-${offset}px)`;
  }

  prevBtn.addEventListener('click', () => {
    idx = Math.max(0, idx - VISIBLE);
    updateState();
  });

  nextBtn.addEventListener('click', () => {
    idx = Math.min(max, idx + VISIBLE);
    updateState();
  });

  window.addEventListener('resize', updateState);

  el.innerHTML = '';
  el.append(viewport, nav);
  updateState();
}
