// On browser refresh, return the invitation to its home section.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const navigationEntry = performance.getEntriesByType('navigation')[0];
if (navigationEntry && navigationEntry.type === 'reload') {
  // Remove any saved section hash so refresh always starts at the top.
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.addEventListener('pageshow', () => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, { once: true });
}

// Scroll reveals, mobile navigation and draggable photo carousel.
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.loader')?.classList.add('done'), 450);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .timeline-item').forEach(el => revealObserver.observe(el));

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const track = document.querySelector('.gallery-track');
const progress = document.querySelector('.gallery-progress span');
const updateProgress = () => {
  const max = track.scrollWidth - track.clientWidth;
  progress.style.width = `${max > 0 ? 10 + (track.scrollLeft / max) * 90 : 100}%`;
};
track.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
document.querySelector('.gallery-prev').addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * .72, behavior: 'smooth' }));
document.querySelector('.gallery-next').addEventListener('click', () => track.scrollBy({ left: track.clientWidth * .72, behavior: 'smooth' }));

let isDown = false, startX = 0, scrollStart = 0;
track.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') return;
  isDown = true; track.classList.add('dragging'); startX = e.clientX; scrollStart = track.scrollLeft;
  track.setPointerCapture(e.pointerId);
});
track.addEventListener('pointermove', e => {
  if (!isDown) return;
  track.scrollLeft = scrollStart - (e.clientX - startX);
});
['pointerup','pointercancel','lostpointercapture'].forEach(type => track.addEventListener(type, () => {
  isDown = false; track.classList.remove('dragging');
}));
updateProgress();

// Gentle parallax on large screens only.
const heroImage = document.querySelector('.hero-image');
window.addEventListener('scroll', () => {
  if (window.innerWidth > 760) {
    const y = Math.min(window.scrollY * .18, 150);
    heroImage.style.backgroundPosition = `center calc(38% + ${y}px)`;
  }
}, { passive: true });
