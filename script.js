/* =============================================
   DREAM SOLUTIONS – MAIN JAVASCRIPT
   ============================================= */

// ---- THEME MANAGEMENT ----
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ds-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active-theme'));
    const activeBtn = document.getElementById('btn-' + theme);
    if (activeBtn) activeBtn.classList.add('active-theme');
}

function toggleThemePanel() {
    const panel = document.getElementById('themePanel');
    panel.classList.toggle('open');
}

// Close panel on outside click (desktop) or tap (mobile)
document.addEventListener('click', (e) => {
    const switcher = document.querySelector('.theme-switcher');
    if (switcher && !switcher.contains(e.target)) {
        document.getElementById('themePanel').classList.remove('open');
    }
});

// Load saved theme on page load
(function initTheme() {
    const saved = localStorage.getItem('ds-theme') || 'dark';
    setTheme(saved);
})();


// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');

function handleScroll() {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
}

window.addEventListener('scroll', handleScroll, { passive: true });


// ---- MOBILE MENU ----
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

// Close menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    }
});


// ---- ACTIVE NAV LINK ON SCROLL ----
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}


// ---- SCROLL REVEAL ----
const revealElements = document.querySelectorAll(
    '.service-card, .gallery-item, .testimonial-card, .about-content, .about-images, .why-item, .contact-detail-item, .eq-contact-item'
);
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));


// ---- GALLERY FILTER ----
function filterGallery(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
            item.classList.remove('hidden');
            item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
            item.classList.add('hidden');
        }
    });
}


// ---- TESTIMONIALS DRAG / SWIPE SCROLL ----
const track = document.getElementById('testimonialsTrack');
let isDown = false, startX, scrollLeftPos;

if (track) {
    // Mouse drag (desktop)
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.cursor = 'grabbing';
        startX = e.pageX - track.offsetLeft;
        scrollLeftPos = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollLeftPos - (x - startX) * 1.5;
    });

    // Touch swipe (mobile)
    let touchStartX = 0;
    let touchScrollLeft = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchScrollLeft = track.scrollLeft;
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
        const diff = touchStartX - e.touches[0].clientX;
        track.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });
}


// ---- ENQUIRY FORM SUBMIT ----
function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById('enquiryForm');
    const success = document.getElementById('formSuccess');
    form.style.display = 'none';
    success.classList.add('show');
    const enquirySection = document.getElementById('enquiry');
    if (enquirySection) {
        const top = enquirySection.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}


// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            // On mobile account for bottom bar (52px)
            const isMobile = window.innerWidth <= 768;
            const offset = isMobile ? 64 : 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});


// ---- HERO PARALLAX (desktop only — skip on mobile to prevent overflow) ----
const heroBg = document.getElementById('heroBg');

function heroParallax() {
    if (!heroBg) return;
    // Only apply parallax on screens wider than 768px
    if (window.innerWidth > 768) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    } else {
        heroBg.style.transform = 'translateY(0)';
    }
}

window.addEventListener('scroll', heroParallax, { passive: true });
window.addEventListener('resize', heroParallax, { passive: true });


// ---- IMAGE LAZY LOAD FALLBACK (in case browser doesn't support native lazy) ----
if ('loading' in HTMLImageElement.prototype === false) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
}


// ---- PREVENT ZOOM ON DOUBLE TAP (iOS Safari fix) ----
let lastTap = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
        // Only prevent double-tap zoom on buttons and links, not inputs
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
        }
    }
    lastTap = now;
}, { passive: false });


// ---- VIEWPORT HEIGHT FIX for mobile browsers (address bar issue) ----
function setMobileVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setMobileVh();
window.addEventListener('resize', setMobileVh, { passive: true });


console.log('%c✦ Dream Solutions — Built with ❤️', 'color: #c9a96e; font-size: 14px; font-weight: bold;');
