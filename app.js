// === GLOBAL VARIABLES ===
let currentLanguage = 'tr';
let currentPage = '';

// === LANGUAGE MANAGEMENT ===
const languages = {
  tr: {
    name: 'Türkçe',
    flag: '🇹🇷',
    world: 'Dünya',
    back: 'Geri',
    close: 'Kapat',
    loading: 'Yükleniyor...',
    error: 'Hata oluştu',
    noData: 'Veri bulunamadı'
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    world: 'World',
    back: 'Back',
    close: 'Close',
    loading: 'Loading...',
    error: 'An error occurred',
    noData: 'No data found'
  }
};

// === UTILITY FUNCTIONS ===
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// === LANGUAGE SELECTOR ===
function initLanguageSelector() {
  const langBtn = document.querySelector('.lang-btn');
  const langList = document.querySelector('.lang-list');
  
  if (!langBtn || !langList) return;
  
  langBtn.addEventListener('click', () => {
    langList.classList.toggle('show');
  });
  
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!langBtn.contains(e.target) && !langList.contains(e.target)) {
      langList.classList.remove('show');
    }
  });
  
  // Language selection
  langList.addEventListener('click', (e) => {
    if (e.target.classList.contains('lang-item')) {
      const lang = e.target.dataset.lang;
      changeLanguage(lang);
      langList.classList.remove('show');
    }
  });
  
  updateLanguageDisplay();
}

function changeLanguage(lang) {
  if (currentLanguage === lang) return;
  
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Update page content
  updatePageContent();
  updateLanguageDisplay();
  
  showNotification(`Dil ${languages[lang].name} olarak değiştirildi`);
}

function updateLanguageDisplay() {
  const langBtn = document.querySelector('.lang-btn');
  const langItems = document.querySelectorAll('.lang-item');
  
  if (langBtn) {
    const currentLang = languages[currentLanguage];
    langBtn.innerHTML = `${currentLang.flag} ${currentLang.name}`;
  }
  
  langItems.forEach(item => {
    item.classList.remove('active');
    if (item.dataset.lang === currentLanguage) {
      item.classList.add('active');
    }
  });
}

// === PHOTO MODAL ===
function initPhotoModal() {
  const modal = document.querySelector('.photo-modal');
  if (!modal) return;
  
  // Close modal on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePhotoModal();
    }
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePhotoModal();
    }
  });
  
  // Close button
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePhotoModal);
  }
}

function openPhotoModal(imageSrc, imageAlt = '') {
  const modal = document.querySelector('.photo-modal');
  const modalImage = modal.querySelector('.modal-image');
  
  if (modalImage) {
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
  }
  
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
  const modal = document.querySelector('.photo-modal');
  modal.classList.remove('show');
  
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

// === PHOTO CARDS ===
function initPhotoCards() {
  const photoCards = document.querySelectorAll('.photo-card');
  
  photoCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img) {
        openPhotoModal(img.src, img.alt);
      }
    });
  });
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  const elements = document.querySelectorAll('.city-section, .city-card');
  elements.forEach(el => observer.observe(el));
}

// === SEARCH AND FILTER ===
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;
  
  const debouncedSearch = debounce(performSearch, 300);
  searchInput.addEventListener('input', debouncedSearch);
}

function performSearch(query) {
  const searchTerm = query.toLowerCase().trim();
  const cityCards = document.querySelectorAll('.city-card');
  
  cityCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const description = card.querySelector('p')?.textContent.toLowerCase() || '';
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = 'block';
      card.classList.add('animate-in');
    } else {
      card.style.display = 'none';
    }
  });
}

// === LAZY LOADING ===
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// === PAGE CONTENT UPDATE ===
function updatePageContent() {
  // Update text content based on current language
  const elements = document.querySelectorAll('[data-lang]');
  
  elements.forEach(element => {
    const key = element.dataset.lang;
    if (languages[currentLanguage][key]) {
      element.textContent = languages[currentLanguage][key];
    }
  });
}

// === INITIALIZATION ===
function initApp() {
  // Load saved language
  const savedLang = localStorage.getItem('language');
  if (savedLang && languages[savedLang]) {
    currentLanguage = savedLang;
  }
  
  // Initialize components
  initLanguageSelector();
  initPhotoModal();
  initPhotoCards();
  initScrollAnimations();
  initSearch();
  initLazyLoading();
  
  // Update content
  updatePageContent();
  
  // Add loading animation
  document.body.classList.add('loaded');
}

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', initApp);

// === EXPORT FUNCTIONS ===
window.AppUtils = {
  changeLanguage,
  openPhotoModal,
  closePhotoModal,
  showNotification,
  debounce
};
