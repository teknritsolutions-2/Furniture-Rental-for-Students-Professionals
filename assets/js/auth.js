/**
 * NESTLOOP — Demo Authentication Module
 * Manages simulated client-side session state with explicit demonstration labeling.
 * Protects customer dashboard routes and supports demo registration and sign-in.
 */

window.NestloopAuth = (function () {
  'use strict';

  const AUTH_KEY = 'nestloop_demo_auth_session';

  // Demo pre-configured accounts
  const DEMO_ACCOUNTS = [
    {
      name: "Alex Chen",
      email: "alex.chen@nestloop.demo",
      password: "password123",
      role: "Working Professional",
      phone: "+91 98765 43210",
      city: "Bengaluru",
      avatar: "AC"
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@nestloop.demo",
      password: "password123",
      role: "University Student",
      phone: "+91 91234 56789",
      city: "Hyderabad",
      avatar: "PS"
    }
  ];

  function isAuthenticated() {
    try {
      const session = localStorage.getItem(AUTH_KEY);
      return !!session;
    } catch (e) {
      return false;
    }
  }

  function getCurrentUser() {
    try {
      const session = localStorage.getItem(AUTH_KEY);
      if (session) {
        return JSON.parse(session);
      }
    } catch (e) {
      console.warn("Auth session parse error:", e);
    }
    return null;
  }

  function login(email, password) {
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // Check pre-configured demo accounts
    let match = DEMO_ACCOUNTS.find(acc => acc.email.toLowerCase() === cleanEmail);

    // If not found in default list, check if created locally via demo registration
    if (!match) {
      try {
        const customUsers = JSON.parse(localStorage.getItem('nestloop_custom_demo_users') || '[]');
        match = customUsers.find(acc => acc.email.toLowerCase() === cleanEmail);
      } catch (e) {}
    }

    if (!match) {
      return {
        success: false,
        error: "Demo account not recognized. Click 'Use Demo Credentials' below to pre-fill."
      };
    }

    if (cleanPass !== "password123" && cleanPass !== match.password) {
      return {
        success: false,
        error: "Incorrect demo password. (Use 'password123' for demonstration)."
      };
    }

    const sessionData = {
      name: match.name,
      email: match.email,
      role: match.role,
      phone: match.phone || "+91 98765 43210",
      city: match.city || "Bengaluru",
      avatar: match.avatar || match.name.substring(0, 2).toUpperCase(),
      loginTime: new Date().toISOString(),
      isDemo: true
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  }

  function register(data) {
    const { name, email, password, role, city } = data;

    if (!name || !email || !password) {
      return { success: false, error: "Please provide your full name, email, and password." };
    }

    const cleanEmail = email.trim().toLowerCase();
    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      role: role || "Working Professional",
      city: city || "Bengaluru",
      phone: "+91 98765 43210",
      avatar: name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "NL"
    };

    try {
      const customUsers = JSON.parse(localStorage.getItem('nestloop_custom_demo_users') || '[]');
      customUsers.push(newUser);
      localStorage.setItem('nestloop_custom_demo_users', JSON.stringify(customUsers));
    } catch (e) {}

    // Auto login
    const sessionData = {
      ...newUser,
      loginTime: new Date().toISOString(),
      isDemo: true
    };
    delete sessionData.password;

    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    // Redirect to login or home
    const isPagesDir = window.location.pathname.includes('/pages/');
    window.location.href = isPagesDir ? 'login.html' : 'pages/login.html';
  }

  /**
   * Route Guard for Customer Dashboard
   * Call on dashboard.html — redirects unauthenticated demo users to login
   */
  function guardDashboard() {
    if (!isAuthenticated()) {
      const isPagesDir = window.location.pathname.includes('/pages/');
      const loginUrl = isPagesDir ? 'login.html?notice=login_required' : 'pages/login.html?notice=login_required';
      window.location.href = loginUrl;
      return false;
    }
    return true;
  }

  /**
   * Route Guard for Auth Pages
   * If user is already authenticated, redirect them directly to the dashboard
   */
  function guardAuthPages() {
    if (isAuthenticated()) {
      const isPagesDir = window.location.pathname.includes('/pages/');
      const dashUrl = isPagesDir ? 'dashboard.html' : 'pages/dashboard.html';
      window.location.href = dashUrl;
      return true;
    }
    return false;
  }

  return {
    isAuthenticated,
    getCurrentUser,
    login,
    register,
    logout,
    guardDashboard,
    guardAuthPages,
    DEMO_ACCOUNTS
  };
})();
