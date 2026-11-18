document.documentElement.classList.add('has-js');

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
function setMenu(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navMenu.classList.toggle('is-open', open);
}
navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
navMenu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    navToggle.focus();
  }
});

const viewport = document.getElementById('editorial-carousel');
const slides = [...viewport.querySelectorAll('.carousel-slide')];
const counter = document.getElementById('carousel-counter');
const progressBar = document.getElementById('carousel-progress-bar');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide = -1;

function highlightSlide(index) {
  if (currentSlide === index) return;
  currentSlide = index;
  slides.forEach((slide, position) => slide.classList.toggle('is-active', position === index));
  counter.textContent = (index + 1) + ' z ' + slides.length;
  progressBar.style.transform = 'scaleX(' + (index + 1) / slides.length + ')';
}

function jumpSlide(direction) {
  const index = (currentSlide + direction + slides.length) % slides.length;
  viewport.scrollTo({
    left: slides[index].offsetLeft - slides[0].offsetLeft,
    behavior: reducedMotion.matches ? 'instant' : 'smooth',
  });
}

highlightSlide(0);
viewport.addEventListener('scroll', () => {
  const stride = slides[1].offsetLeft - slides[0].offsetLeft;
  const index = Math.round(Math.max(0, viewport.scrollLeft) / stride);
  highlightSlide(Math.min(index, slides.length - 1));
}, { passive: true });

document.getElementById('carousel-prev').addEventListener('click', () => jumpSlide(-1));
document.getElementById('carousel-next').addEventListener('click', () => jumpSlide(1));
viewport.addEventListener('keydown', event => {
  if (event.target !== viewport) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    jumpSlide(event.key === 'ArrowLeft' ? -1 : 1);
  }
});

const searchInput = document.getElementById('service-search');
const searchStatus = document.getElementById('catalog-status');
const groups = [...document.querySelectorAll('.catalog-group')];
function searchable(text) {
  return text.toLocaleLowerCase('pl').normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l').trim();
}
const catalog = groups.map(group => ({
  group,
  summary: group.querySelector('summary'),
  count: group.querySelector('.category-count'),
  items: [...group.querySelectorAll('.service-item')].map(item => ({
    item,
    keywords: searchable(item.dataset.search),
  })),
}));
let originalExpanded = null;
searchInput.addEventListener('input', () => {
  const query = searchable(searchInput.value);
  const terms = query.split(/\s+/).filter(Boolean);
  if (query && !originalExpanded) originalExpanded = groups.map(group => group.open);
  let matches = 0;

  catalog.forEach(({ group, summary, count, items }, index) => {
    const category = searchable(summary.querySelector('.category-name').textContent);
    let categoryMatches = 0;
    items.forEach(({ item, keywords }) => {
      const includesTerms = terms.every(term => keywords.includes(term) || category.includes(term));
      item.hidden = !includesTerms;
      if (includesTerms) categoryMatches += 1;
    });
    matches += categoryMatches;
    group.hidden = categoryMatches === 0;
    count.textContent = categoryMatches;
    if (query) group.open = categoryMatches > 0;
    else if (originalExpanded) group.open = originalExpanded[index];
  });

  searchStatus.hidden = !query;
  searchStatus.textContent = matches ? 'Znalezione usługi · ' + matches : 'Brak wyników. Wpisz inną nazwę zabiegu.';
  if (!query) originalExpanded = null;
});

const filterButtons = [...document.querySelectorAll('.filter-btn')];
const gallery = document.getElementById('editorial-gallery');
const galleryItems = [...gallery.querySelectorAll('.lookbook-item')];
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    gallery.classList.toggle('is-filtered', filter !== 'all');
    galleryItems.forEach(item => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
let pictureLink;

gallery.addEventListener('click', event => {
  const link = event.target.closest('.lookbook-trigger');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  pictureLink = link;
  lightboxImage.src = link.href;
  lightboxImage.alt = link.querySelector('img').alt;
  lightboxCaption.textContent = link.closest('figure').querySelector('figcaption').textContent;
  lightbox.showModal();
  lightboxClose.focus();
});
lightboxClose.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('close', () => {
  pictureLink?.focus();
});

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));
}
