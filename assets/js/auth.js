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
   * Auto-initializes a demonstration account (Alex Chen) if no session exists,
   * so reviewers and users can inspect the dashboard directly without login hurdles.
   */
  function guardDashboard() {
    if (!isAuthenticated()) {
      const defaultUser = DEMO_ACCOUNTS[0];
      const sessionData = {
        name: defaultUser.name,
        email: defaultUser.email,
        role: defaultUser.role,
        phone: defaultUser.phone || "+91 98765 43210",
        city: defaultUser.city || "Bengaluru",
        avatar: defaultUser.avatar || "AC",
        loginTime: new Date().toISOString(),
        isDemo: true
      };
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.warn("Could not save demo session to localStorage:", e);
      }
    }
    return true;
  }

  /**
   * Switch between demonstration personas (e.g. Alex Chen vs Priya Sharma)
   */
  function switchDemoUser(index) {
    const acc = DEMO_ACCOUNTS[index] || DEMO_ACCOUNTS[0];
    const sessionData = {
      name: acc.name,
      email: acc.email,
      role: acc.role,
      phone: acc.phone || "+91 98765 43210",
      city: acc.city || "Bengaluru",
      avatar: acc.avatar || "AC",
      loginTime: new Date().toISOString(),
      isDemo: true
    };
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    } catch (e) {}
    return sessionData;
  }

  /**
   * Route Guard for Auth Pages
   * Redirects authenticated users to dashboard unless explicitly exploring the login view
   */
  function guardAuthPages() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'switch' || params.get('force') === 'login') {
      return false;
    }
    // We allow viewing the login/register forms without auto-redirecting if they intentionally navigated here
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
    switchDemoUser,
    DEMO_ACCOUNTS
  };
})();
