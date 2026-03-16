// Sarah Chapman Site - Shared JavaScript
// Multi-page 90s house music theme

// ========================================
// THEME TOGGLE
// ========================================

let currentTheme = 'dark';
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeIcon) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
  localStorage.setItem('sarah-theme', theme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(currentTheme);
}

// Load saved theme on page load
const savedTheme = localStorage.getItem('sarah-theme');
if (savedTheme) {
  currentTheme = savedTheme;
  setTheme(currentTheme);
}

// ========================================
// MOBILE MENU
// ========================================

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', function() {
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      const menu = document.getElementById('mobileMenu');
      if (menu) {
        menu.classList.remove('show');
      }
    });
  });

  // Set active navigation link based on current page
  setActiveNav();
});

// ========================================
// ACTIVE NAVIGATION
// ========================================

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ========================================
// SMOOTH SCROLLING
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========================================
// CONTACT FORM (if present on page)
// ========================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
      contactType: formData.get('contactType'),
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    // Update button state
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Sending...';
    button.disabled = true;
    
    // Simulate form submission (replace with actual endpoint later)
    setTimeout(() => {
      alert(`Thank you ${data.name}! Your ${data.contactType} inquiry has been received. We'll get back to you at ${data.email} soon.`);
      this.reset();
      button.innerHTML = originalText;
      button.disabled = false;
    }, 2000);
  });
}

// ========================================
// MUSIC PLAYER TOGGLE (Home page only)
// ========================================

function toggleMusicPlayer() {
  const player = document.getElementById('musicPlayer');
  const btn = document.getElementById('houseMusicBtn');
  
  if (!player || !btn) return;
  
  if (player.classList.contains('hidden')) {
    player.classList.remove('hidden');
    btn.textContent = '🎵 Music Playing...';
    btn.style.background = 'linear-gradient(135deg, #00ff80, #ff0080)';
  } else {
    player.classList.add('hidden');
    btn.textContent = '🎵 House Music All Night Long';
    btn.style.background = 'linear-gradient(135deg, #ff0080, #00ff80)';
  }
}

// ========================================
// GALLERY FUNCTIONS (for content population)
// ========================================

function addFlyer(imageSrc, title, description, year, venue, lineupDJs = []) {
  const gallery = document.getElementById('flyerGallery');
  if (!gallery) return;
  
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.setAttribute('data-year', year);
  item.setAttribute('data-venue', venue);
  
  // SEO: Add structured data attributes for DJ lineup
  item.setAttribute('itemscope', '');
  item.setAttribute('itemtype', 'https://schema.org/MusicEvent');
  
  // Build lineup text for SEO
  let lineupHTML = '';
  if (lineupDJs && lineupDJs.length > 0) {
    const djList = lineupDJs.join(', ');
    lineupHTML = `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.1)">
        <div style="color:var(--accent);font-size:0.85rem;font-weight:600;margin-bottom:6px">
          <i class="fas fa-users"></i> Lineup:
        </div>
        <div style="color:var(--text-dim);font-size:0.85rem;line-height:1.5" itemprop="performer">
          Sarah Chapman, ${djList}
        </div>
      </div>
    `;
    // Store lineup in data attribute for filtering
    item.setAttribute('data-lineup', 'Sarah Chapman, ' + djList);
  }
  
  item.innerHTML = `
    <img src="${imageSrc}" alt="${title}" class="gallery-img" loading="lazy" itemprop="image">
    <div class="gallery-content">
      <div class="gallery-title" itemprop="name">${title}</div>
      <div class="gallery-desc">
        <span itemprop="description">${description}</span> • 
        <span itemprop="startDate">${year}</span> • 
        <span itemprop="location">${venue}</span>
      </div>
      ${lineupHTML}
      <button onclick="downloadFlyer('${imageSrc}', '${title}')" class="btn-secondary" style="margin-top:12px;padding:8px 16px;font-size:0.85rem">
        <i class="fas fa-download"></i> Download
      </button>
    </div>
  `;
  
  // SEO: Add hidden text for search engines (DJ collaborations)
  if (lineupDJs && lineupDJs.length > 0) {
    const seoText = document.createElement('meta');
    seoText.setAttribute('itemprop', 'description');
    seoText.setAttribute('content', `DJ Sarah Chapman performed with ${lineupDJs.join(', ')} at ${venue} in ${year}. Event: ${title}. ${description}`);
    item.appendChild(seoText);
  }
  
  gallery.appendChild(item);
}

function addPhoto(imageSrc, title, description) {
  const gallery = document.getElementById('photoGallery');
  if (!gallery) return;
  
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.innerHTML = `
    <img src="${imageSrc}" alt="${title}" class="gallery-img" loading="lazy">
    <div class="gallery-content">
      <div class="gallery-title">${title}</div>
      <div class="gallery-desc">${description}</div>
    </div>
  `;
  gallery.appendChild(item);
}

function addTestimonial(quote, author, context) {
  const container = document.getElementById('testimonialGrid');
  if (!container) return;
  
  const item = document.createElement('div');
  item.className = 'card';
  item.style.borderLeftColor = 'var(--accent2)';
  item.innerHTML = `
    <blockquote style="color:var(--text-dim);font-style:italic;line-height:1.7;margin-bottom:16px">
      "${quote}"
    </blockquote>
    <p style="color:var(--accent);font-weight:600;font-size:0.9rem">— ${author}</p>
    ${context ? `<p style="color:var(--text-dim);font-size:0.85rem;margin-top:8px">${context}</p>` : ''}
  `;
  container.appendChild(item);
}

// ========================================
// FLYER FILTERING (Flyers page)
// ========================================

function filterFlyers(filterType, filterValue) {
  const items = document.querySelectorAll('.gallery-item[data-venue]');
  
  items.forEach(item => {
    if (filterValue === 'all') {
      item.style.display = 'block';
    } else {
      const itemValue = item.getAttribute(`data-${filterType}`);
      item.style.display = itemValue === filterValue ? 'block' : 'none';
    }
  });
}

// Search flyers by DJ name (for finding Sarah's collaborations)
function searchFlyersByDJ(djName) {
  const items = document.querySelectorAll('.gallery-item[data-lineup]');
  const results = [];
  
  items.forEach(item => {
    const lineup = item.getAttribute('data-lineup').toLowerCase();
    if (lineup.includes(djName.toLowerCase())) {
      item.style.display = 'block';
      results.push({
        title: item.querySelector('.gallery-title').textContent,
        lineup: item.getAttribute('data-lineup'),
        year: item.getAttribute('data-year'),
        venue: item.getAttribute('data-venue')
      });
    } else {
      item.style.display = 'none';
    }
  });
  
  return results;
}

// Extract all unique DJs from flyers (for collaboration network)
function extractDJCollaborations() {
  const items = document.querySelectorAll('.gallery-item[data-lineup]');
  const djMap = new Map();
  
  items.forEach(item => {
    const lineup = item.getAttribute('data-lineup');
    const venue = item.getAttribute('data-venue');
    const year = item.getAttribute('data-year');
    
    if (lineup) {
      const djs = lineup.split(',').map(dj => dj.trim());
      djs.forEach(dj => {
        if (dj !== 'Sarah Chapman') { // Exclude Sarah herself
          if (!djMap.has(dj)) {
            djMap.set(dj, []);
          }
          djMap.get(dj).push({ venue, year });
        }
      });
    }
  });
  
  // Sort by frequency of collaboration
  const collaborations = Array.from(djMap.entries())
    .map(([dj, events]) => ({ dj, count: events.length, events }))
    .sort((a, b) => b.count - a.count);
  
  return collaborations;
}

function downloadFlyer(imageSrc, title) {
  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = imageSrc;
  link.download = `sarah-chapman-${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ========================================
// MODAL FOR EXPANDED VIEWS
// ========================================

function expandImage(imageSrc, title) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.style.cssText = `
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:rgba(0,0,0,0.9);
    z-index:9999;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
  `;
  
  modal.innerHTML = `
    <div style="max-width:90%;max-height:90%;position:relative">
      <button onclick="this.parentElement.parentElement.remove()" style="
        position:absolute;
        top:-40px;
        right:0;
        background:rgba(255,0,128,0.8);
        border:none;
        color:white;
        font-size:1.5rem;
        width:40px;
        height:40px;
        border-radius:50%;
        cursor:pointer;
      ">×</button>
      <img src="${imageSrc}" alt="${title}" style="max-width:100%;max-height:80vh;border-radius:8px">
      <p style="color:white;text-align:center;margin-top:16px;font-size:1.1rem">${title}</p>
    </div>
  `;
  
  // Close on click outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  document.body.appendChild(modal);
}

// ========================================
// SCROLL ANIMATIONS (optional enhancement)
// ========================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Initialize scroll animations on DOM ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Log for debugging (remove in production)
function debugLog(message) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[Sarah Chapman Site]', message);
  }
}
