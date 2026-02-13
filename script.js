const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

const anchorLinks = document.querySelectorAll('a[href^="#"]');
for (const link of anchorLinks) {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();

    const rect = target.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clampedY = Math.max(0, Math.min(targetY, maxY));

    window.scrollTo({ top: clampedY, behavior: 'smooth' });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);

for (const item of revealItems) observer.observe(item);

const projectImages = document.querySelectorAll('.project-media img');
for (const image of projectImages) {
  image.addEventListener('error', () => {
    const media = image.closest('.project-media');
    if (!media) return;
    media.classList.add('missing');
    image.remove();
  });
}

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const track = carousel.querySelector('.project-grid');
  const viewport = carousel.querySelector('.carousel-viewport');
  const slides = Array.from(carousel.querySelectorAll('.project-card'));
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  let index = 0;

  const updateCarousel = () => {
    if (!track || !viewport || slides.length === 0) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const slideWidth = slides[0].getBoundingClientRect().width;
    const viewportWidth = viewport.getBoundingClientRect().width;
    const slidesPerView = Math.max(1, Math.round((viewportWidth + gap) / (slideWidth + gap)));
    const maxIndex = Math.max(0, slides.length - slidesPerView);
    index = Math.min(index, maxIndex);
    const offset = index * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === maxIndex;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      index += 1;
      updateCarousel();
    });
  }

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}
