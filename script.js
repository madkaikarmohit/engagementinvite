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
document.querySelectorAll('.reveal, .timeline-item, .gallery-card').forEach(el => revealObserver.observe(el));

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

// Cute sound effects when the pet cards are tapped or activated by keyboard.
(() => {
  const petCards = document.querySelectorAll('.pet-card');
  if (!petCards.length) return;

  const sounds = {
    cat: new Audio('audios/cat-meow.mp3'),
    dog: new Audio('audios/dog-bark.mp3')
  };
  Object.values(sounds).forEach(audio => {
    audio.preload = 'none';
    audio.volume = 0.45;
  });

  petCards.forEach(card => {
    const isCat = Boolean(card.querySelector('img[alt="KITTY"]'));
    const kind = isCat ? 'cat' : 'dog';
    const sound = sounds[kind];

    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Hear our ${kind}`);
    card.setAttribute('aria-pressed', 'false');

    const playPetSound = () => {
      sound.pause();
      sound.currentTime = 0;
      const playback = sound.play();
      if (playback && typeof playback.catch === 'function') playback.catch(() => {});

      card.classList.remove('pet-sound-playing');
      void card.offsetWidth;
      card.classList.add('pet-sound-playing');
      card.setAttribute('aria-pressed', 'true');

      const reaction = document.createElement('span');
      reaction.className = 'pet-sound-paw';
      reaction.textContent = kind === 'cat' ? '💗💗💗💗💗💗💗💗💗💗💗' : '💗💗💗💗💗💗💗💗💗💗💗';
      reaction.setAttribute('aria-hidden', 'true');
      card.appendChild(reaction);
      reaction.addEventListener('animationend', () => reaction.remove(), { once: true });

      window.setTimeout(() => {
        card.classList.remove('pet-sound-playing');
        card.setAttribute('aria-pressed', 'false');
      }, 700);
    };

    card.addEventListener('click', playPetSound);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        playPetSound();
      }
    });
  });
})();


const header = document.querySelector(".header");
window.addEventListener('scroll', () => {
	header.classList.toggle('stuck', window.scrollY > 0);
});