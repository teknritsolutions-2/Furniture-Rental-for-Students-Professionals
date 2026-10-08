/**
 * NESTLOOP — Shared Application JS
 * Manages sticky navigation, mobile drawer with focus trap and escape support,
 * persistent theme toggling (Light/Dark), persistent directional toggling (LTR/RTL),
 * and global toast messaging.
 */

(function () {
  'use strict';

  // State keys
  const THEME_KEY = 'nestloop_theme_pref';
  const DIR_KEY = 'nestloop_dir_pref';

  // Apply initial theme & dir immediately before paint
  const savedTheme = localStorage.getItem(THEME_KEY) || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);

  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initDirToggle();
    initMobileDrawer();
    initDropdowns();
    highlightActiveNav();
    initNavAuthLink();
  });

  // Theme Toggle logic
  function initThemeToggle() {
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(THEME_KEY, next);
        updateToggleAria();
        showToast(`Theme switched to ${next} mode`, 'info');
      });
    });
    updateToggleAria();
  }

  function updateToggleAria() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // Direction Toggle logic (LTR / RTL)
  function initDirToggle() {
    const toggles = document.querySelectorAll('.dir-toggle-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', next);
        localStorage.setItem(DIR_KEY, next);
        updateDirLabels();
        showToast(`Layout direction switched to ${next.toUpperCase()}`, 'info');
      });
    });
    updateDirLabels();
  }

  function updateDirLabels() {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    document.querySelectorAll('.dir-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', isRtl ? 'Switch to LTR layout' : 'Switch to RTL layout');
      const textSpan = btn.querySelector('.dir-label-text');
      if (textSpan) {
        textSpan.textContent = isRtl ? 'LTR' : 'RTL';
      }
    });
  }

  // Mobile Drawer with accessible focus trap and restoration
  function initMobileDrawer() {
    const openBtn = document.querySelector('.mobile-menu-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay');
    const closeBtn = document.querySelector('.drawer-close-btn');

    if (!drawer || !overlay || !openBtn) return;

    let previousActiveElement = null;
    drawer.inert = true;

    function openDrawer() {
      previousActiveElement = document.activeElement;
      drawer.inert = false;
      drawer.classList.add('is-active');
      overlay.classList.add('is-active');
      drawer.removeAttribute('aria-hidden');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Commit visibility/inert changes before moving focus into the drawer.
      drawer.getBoundingClientRect();
      if (closeBtn) closeBtn.focus();

      document.addEventListener('keydown', handleDrawerKeydown);
    }

    function closeDrawer() {
      drawer.inert = true;
      drawer.classList.remove('is-active');
      overlay.classList.remove('is-active');
      drawer.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      document.removeEventListener('keydown', handleDrawerKeydown);

      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }

    function handleDrawerKeydown(e) {
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = drawer.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Close on link click inside drawer
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  // Keyboard navigation for dropdowns
  function initDropdowns() {
    const dropdownContainers = document.querySelectorAll('.nav-item-dropdown');
    dropdownContainers.forEach(container => {
      const trigger = container.querySelector('.dropdown-trigger');
      const menu = container.querySelector('.dropdown-menu');
      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = menu.classList.contains('is-open');
        menu.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          menu.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Escape key closes menu
      container.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          menu.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });
  }

  // Highlight active link based on current path
  function highlightActiveNav() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-link, .drawer-nav-link, .dropdown-item, .drawer-sublink');

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      // Match file name or ending
      const cleanHref = href.split('?')[0].replace(/^(\.\.\/|\.\/)/, '');
      if (cleanHref && path.endsWith(cleanHref)) {
        link.classList.add('active');
        if (link.getAttribute('aria-current') === null) {
          link.setAttribute('aria-current', 'page');
        }
      }
    });
  }

  // Initialize and ensure direct Customer Dashboard link behavior across all pages
  function initNavAuthLink() {
    const authLink = document.getElementById('nav-auth-link');
    if (!authLink) return;
    const isPagesDir = window.location.pathname.includes('/pages/');
    const dashUrl = isPagesDir ? 'dashboard.html' : 'pages/dashboard.html';
    authLink.href = dashUrl;
    authLink.setAttribute('title', 'Open Customer Rental Dashboard');

    const auth = window.NestloopAuth;
    if (auth && auth.isAuthenticated()) {
      const user = auth.getCurrentUser();
      const initials = (user && user.avatar) ? user.avatar : 'AC';
      authLink.innerHTML = `<span class="user-avatar" style="width: 22px; height: 22px; font-size: 0.65rem; border-radius: 50%; background: var(--color-cobalt); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-inline-end: 6px;">${initials}</span><span>Dashboard</span>`;
    } else {
      authLink.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-inline-end: 5px;"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg><span>Dashboard</span>`;
    }
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Expose global helpers
  window.NestloopApp = {
    showToast,
    getTheme: () => document.documentElement.getAttribute('data-theme'),
    getDir: () => document.documentElement.getAttribute('dir')
  };
})();
