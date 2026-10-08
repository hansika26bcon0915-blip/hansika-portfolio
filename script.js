/**
 * ==========================================================================
 * SCRIPT.JS - HANSIKA CHAUHAN PORTFOLIO
 * Features:
 * - Theme Toggle (Dark / Light) with LocalStorage & OS Preference
 * - Responsive Mobile Navigation Drawer
 * - Header Scroll Effects & Active Link Scroll Spy
 * - Dynamic Hero Typewriter Animation
 * - Interactive Project Filtering
 * - Client-Side Contact Form Validation & Toast Notification
 * - Back-to-Top Smooth Scrolling
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollEffects();
  initTypewriter();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  updateCopyrightYear();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved theme or fallback to user system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    toggleMenu(!isOpen);
  });

  // Close menu when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  });

  // Close menu on clicks outside
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  function toggleMenu(open) {
    if (open) {
      navMenu.classList.add('active');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
    } else {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
}

/* --------------------------------------------------------------------------
   3. Header Scroll Behavior & Active Section Scroll Spy
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header elevation on scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll spy for navigation items
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. Typewriter Animation for Hero Section
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter-text');
  if (!typewriterElement) return;

  const words = [
    'First-Year B.Tech CSE Core Student',
    'Aspiring Software Developer',
    'Tech & AI Enthusiast',
    'Problem Solver'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 2000;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
      typewriterElement.textContent = currentWord.substring(0, charIndex);
    } else {
      charIndex++;
      typewriterElement.textContent = currentWord.substring(0, charIndex);
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

/* --------------------------------------------------------------------------
   5. Project Category Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Contact Form Validation & Toast Notification
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formToast = document.getElementById('form-toast');
  const toastCloseBtn = document.getElementById('toast-close-btn');

  if (!contactForm) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  // Clear errors when the user types
  const inputs = [
    { el: nameInput, error: nameError },
    { el: emailInput, error: emailError },
    { el: subjectInput, error: subjectError },
    { el: messageInput, error: messageError }
  ];

  inputs.forEach(({ el, error }) => {
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('input-error');
        if (error) error.textContent = '';
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    const nameVal = nameInput.value.trim();
    if (!nameVal) {
      showError(nameInput, nameError, 'Please enter your name.');
      isValid = false;
    } else if (nameVal.length < 2) {
      showError(nameInput, nameError, 'Name must be at least 2 characters.');
      isValid = false;
    }

    // Validate Email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      showError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Subject
    const subjectVal = subjectInput.value.trim();
    if (!subjectVal) {
      showError(subjectInput, subjectError, 'Please enter a subject.');
      isValid = false;
    }

    // Validate Message
    const messageVal = messageInput.value.trim();
    if (!messageVal) {
      showError(messageInput, messageError, 'Please enter your message.');
      isValid = false;
    } else if (messageVal.length < 10) {
      showError(messageInput, messageError, 'Message must be at least 10 characters.');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending state
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <i class="fa-solid fa-circle-notch fa-spin"></i>
      <span>Sending...</span>
    `;

    setTimeout(() => {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;

      // Reset form
      contactForm.reset();

      // Show toast
      showToast();
    }, 900);
  });

  function showError(inputEl, errorEl, message) {
    inputEl.classList.add('input-error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function showToast() {
    if (!formToast) return;
    formToast.classList.add('active');

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      formToast.classList.remove('active');
    }, 6000);
  }

  if (toastCloseBtn && formToast) {
    toastCloseBtn.addEventListener('click', () => {
      formToast.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   7. Back-to-Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   8. Copyright Year Dynamic Update
   -------------------------------------------------------------------------- */
function updateCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
