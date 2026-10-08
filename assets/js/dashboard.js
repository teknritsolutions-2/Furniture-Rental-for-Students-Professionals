/**
 * NESTLOOP — Customer Dashboard Application Controller
 * Manages customer portal navigation, active rentals display, billing schedules,
 * interactive swap & early return workflows, live demo payment transitions,
 * document PDF downloads, and persistent demo state.
 */

document.addEventListener('DOMContentLoaded', () => {
  const dashContainer = document.getElementById('customer-dashboard-root');
  if (!dashContainer) return; // Not on dashboard page

  const auth = window.NestloopAuth;
  const data = window.NestloopData;
  const pdfGen = window.NestloopPDF;

  // Route Guard: Redirect unauthenticated users
  if (!auth.guardDashboard()) return;

  // State
  let user = auth.getCurrentUser();
  let state = data.getDemoState();

  // Navigation Links
  const navLinks = document.querySelectorAll('.dash-nav-link[data-dash-view]');
  const views = document.querySelectorAll('.dash-view');
  const viewTitleEl = document.getElementById('dash-topbar-title');

  // Initialize
  initNavigation();
  renderAllViews();
  setupModals();

  // Navigation controller
  function initNavigation() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetViewId = link.getAttribute('data-dash-view');
        switchView(targetViewId);
      });
    });

    // Handle hash on page load
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`view-${hash}`)) {
      switchView(hash);
    } else {
      switchView('overview');
    }

    // Top logout button
    const logoutBtns = document.querySelectorAll('.action-logout');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Sign out of the NESTLOOP customer demonstration session?")) {
          auth.logout();
        }
      });
    });
  }

  function switchView(viewId) {
    views.forEach(v => v.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewId}`);
    const activeLink = document.querySelector(`.dash-nav-link[data-dash-view="${viewId}"]`);

    if (targetView) targetView.classList.add('active');
    if (activeLink) activeLink.classList.add('active');

    // Update title
    const titles = {
      overview: "Account Overview",
      browse: "Browse Furniture Packages",
      rentals: "My Active Rentals",
      billing: "Billing & Due Dates",
      requests: "Swap & Return Requests",
      documents: "Agreements & Receipts",
      settings: "Profile & Settings"
    };

    if (viewTitleEl) {
      viewTitleEl.textContent = titles[viewId] || "Customer Portal";
    }

    window.location.hash = viewId;
  }

  // Renders all dashboard modules
  function renderAllViews() {
    state = data.getDemoState(); // refresh state
    renderUserMini();
    renderOverview();
    renderBrowse();
    renderRentals();
    renderBilling();
    renderRequests();
    renderDocuments();
    renderSettings();
  }

  function renderUserMini() {
    const avatarEls = document.querySelectorAll('.user-avatar-text');
    const nameEls = document.querySelectorAll('.user-name-text');
    const roleEls = document.querySelectorAll('.user-role-text');

    avatarEls.forEach(el => el.textContent = user.avatar || "AC");
    nameEls.forEach(el => el.textContent = user.name || "Alex Chen");
    roleEls.forEach(el => el.textContent = user.role || "Customer");
  }

  // 1. Overview View
  function renderOverview() {
    const totalMonthly = state.rentals.reduce((sum, r) => sum + (r.monthlyRate || 0), 0);
    const activeCount = state.rentals.length;
    const pendingReqCount = state.requests.filter(r => r.status.includes('Pending')).length;

    // Metrics
    const activeCountEl = document.getElementById('metric-active-count');
    const monthlyTotalEl = document.getElementById('metric-monthly-total');
    const nextDueEl = document.getElementById('metric-next-due');
    const pendingCountEl = document.getElementById('metric-pending-count');

    if (activeCountEl) activeCountEl.textContent = activeCount;
    if (monthlyTotalEl) monthlyTotalEl.textContent = `₹${totalMonthly.toLocaleString('en-IN')}`;
    if (nextDueEl) nextDueEl.textContent = state.rentals[0] ? state.rentals[0].nextDueDate : "None";
    if (pendingCountEl) pendingCountEl.textContent = pendingReqCount;

    // Next Payment Banner
    const bannerAmountEl = document.getElementById('banner-pay-amount');
    const bannerDateEl = document.getElementById('banner-pay-date');
    if (bannerAmountEl) bannerAmountEl.textContent = `₹${totalMonthly.toLocaleString('en-IN')}`;
    if (bannerDateEl) bannerDateEl.textContent = state.rentals[0] ? state.rentals[0].nextDueDate : "15th of next month";

    // Overview Quick Rentals List
    const ovRentalsList = document.getElementById('overview-rentals-preview');
    if (ovRentalsList) {
      if (state.rentals.length === 0) {
        ovRentalsList.innerHTML = `<div style="padding: 20px; color: var(--color-muted-text);">No active rentals found. Browse our packages to start renting!</div>`;
      } else {
        ovRentalsList.innerHTML = state.rentals.slice(0, 2).map(r => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--color-border); gap: 16px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <img src="${data.getImagePath(r.image)}" alt="${r.packageName}" style="width: 58px; height: 42px; border-radius: var(--radius-sm); object-fit: cover;">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem; color: var(--color-deep-ink);">${r.packageName}</div>
                <div style="font-size: 0.775rem; color: var(--color-muted-text);">${r.rentalId} • ${r.tenureMonths} Months • ₹${r.monthlyRate.toLocaleString('en-IN')}/mo</div>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" onclick="window.NestloopDash.openAgreement('${r.rentalId}')">
              Agreement PDF
            </button>
          </div>
        `).join('');
      }
    }
  }

  // 2. Browse Packages View (inside customer dashboard)
  function renderBrowse() {
    const browseGrid = document.getElementById('dash-browse-grid');
    if (!browseGrid) return;

    browseGrid.innerHTML = data.PACKAGES.map(pkg => `
      <div class="card package-card">
        <div class="package-card-img-wrap" style="aspect-ratio: 16/10;">
          <span class="chip ${pkg.tier === 'Starter' ? 'chip-starter' : (pkg.tier === 'Essential' ? 'chip-essential' : 'chip-premium')} package-card-tag">${pkg.tier}</span>
          <img src="${data.getImagePath(pkg.image)}" alt="${pkg.name}" loading="lazy">
        </div>
        <div class="package-card-body">
          <div class="package-card-category">${pkg.category}</div>
          <h4 class="package-card-title" style="font-size: 1.05rem;">${pkg.name}</h4>
          <p class="package-card-desc" style="font-size: 0.8125rem;">${pkg.tagline}</p>
          <div class="package-card-pricing">
            <span class="price-val" style="font-size: 1.25rem;">₹${pkg.monthlyRates[12].toLocaleString('en-IN')}<span style="font-size: 0.75rem; font-weight: normal;">/mo</span></span>
            <span style="font-size: 0.72rem; color: var(--color-muted-text);">12-mo plan</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <a href="package-details.html?id=${pkg.id}" class="btn btn-outline btn-sm" target="_blank">Specs</a>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.NestloopDash.requestPackageQuick('${pkg.id}')">Add Rental</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 3. My Rentals View
  function renderRentals() {
    const listEl = document.getElementById('my-rentals-list');
    if (!listEl) return;

    if (state.rentals.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 48px 20px; text-align: center; background: var(--color-card-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
          <h3 class="subsection-h3">No Active Rentals</h3>
          <p class="body-text" style="margin-top: 8px; margin-bottom: 20px;">You currently have no active furniture subscriptions.</p>
          <button type="button" class="btn btn-primary" onclick="window.location.hash = 'browse'">Browse Packages</button>
        </div>
      `;
      return;
    }

    listEl.innerHTML = state.rentals.map(rental => `
      <div class="rental-item-card">
        <img class="rental-thumb-img" src="${data.getImagePath(rental.image)}" alt="${rental.packageName}">
        
        <div class="rental-info-col">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
            <span class="chip chip-active">${rental.status}</span>
            <span style="font-size: 0.75rem; color: var(--color-muted-text); font-weight: 600;">ID: ${rental.rentalId}</span>
          </div>
          <h4>${rental.packageName}</h4>
          <p>${rental.itemsSummary}</p>
        </div>

        <div class="rental-meta-col">
          <div class="meta-field">
            <label>Rental Period</label>
            <span>${rental.startDate} – ${rental.endDate}</span>
          </div>
          <div class="meta-field">
            <label>Monthly Rate</label>
            <span style="color: var(--color-cobalt); font-size: 0.95rem;">₹${rental.monthlyRate.toLocaleString('en-IN')}/mo</span>
          </div>
          <div class="meta-field">
            <label>Next Due Date</label>
            <span>${rental.nextDueDate}</span>
          </div>
          <div class="meta-field">
            <label>Security Deposit</label>
            <span>₹${rental.depositPaid.toLocaleString('en-IN')} (Paid)</span>
          </div>
        </div>

        <div class="rental-actions-col">
          <button type="button" class="btn btn-outline btn-sm" onclick="window.NestloopDash.openAgreement('${rental.rentalId}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Agreement PDF
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.NestloopDash.openSwapModal('${rental.rentalId}')">
            Swap Item
          </button>
          <button type="button" class="btn btn-outline btn-sm" style="color: var(--color-muted-text);" onclick="window.NestloopDash.openReturnModal('${rental.rentalId}')">
            Early Return
          </button>
        </div>
      </div>
    `).join('');
  }

  // 4. Billing & Due Dates View
  function renderBilling() {
    const tableBody = document.getElementById('billing-history-tbody');
    const billingTotalEl = document.getElementById('billing-monthly-sum');
    const totalMonthly = state.rentals.reduce((sum, r) => sum + (r.monthlyRate || 0), 0);

    if (billingTotalEl) billingTotalEl.textContent = `₹${totalMonthly.toLocaleString('en-IN')} / month`;

    if (tableBody) {
      if (!state.billingHistory || state.billingHistory.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-muted-text); padding: 24px;">No past billing statements recorded.</td></tr>`;
      } else {
        tableBody.innerHTML = state.billingHistory.map(inv => `
          <tr>
            <td style="font-weight: 600;">${inv.invoiceId}</td>
            <td>${inv.date}</td>
            <td style="color: var(--color-muted-text); font-size: 0.8125rem;">${inv.period}</td>
            <td style="font-weight: 700; color: var(--color-deep-ink);">₹${inv.amount.toLocaleString('en-IN')}</td>
            <td><span class="chip chip-paid">${inv.status}</span></td>
            <td>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.NestloopDash.openReceipt('${inv.invoiceId}')" title="Download Official PDF Receipt">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                PDF Receipt
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Demo Pay Now Button Action
    const payNowBtn = document.getElementById('btn-demo-pay-now');
    if (payNowBtn) {
      payNowBtn.onclick = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const newInvoice = {
          invoiceId: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          date: todayStr,
          period: "Simulated Advance Month Payment",
          amount: totalMonthly,
          status: "Paid",
          method: "Demonstration Payment (Verified)",
          items: state.rentals.map(r => ({
            description: `Monthly Rental: ${r.packageName} (${r.rentalId})`,
            amount: r.monthlyRate
          }))
        };

        state.billingHistory.unshift(newInvoice);

        // Advance next due date by 1 month
        state.rentals.forEach(r => {
          const d = new Date(r.nextDueDate || todayStr);
          d.setMonth(d.getMonth() + 1);
          r.nextDueDate = d.toISOString().split('T')[0];
        });

        data.saveDemoState(state);
        renderOverview();
        renderRentals();
        renderBilling();
        renderDocuments();

        if (window.NestloopApp && window.NestloopApp.showToast) {
          window.NestloopApp.showToast(`Demonstration payment of ₹${totalMonthly.toLocaleString('en-IN')} processed successfully!`, 'success');
        }
      };
    }
  }

  // 5. Swap & Return Requests View
  function renderRequests() {
    const listEl = document.getElementById('requests-history-list');
    if (!listEl) return;

    if (!state.requests || state.requests.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 32px 20px; text-align: center; background: var(--color-card-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); color: var(--color-muted-text);">
          No active swap or return requests currently pending.
        </div>
      `;
      return;
    }

    listEl.innerHTML = state.requests.map(req => `
      <div class="request-history-card">
        <div class="request-card-info">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="request-id-badge">${req.requestId}</span>
            <span class="chip ${req.status === 'Pending Review' ? 'chip-pending' : 'chip-active'}">${req.status}</span>
            <span style="font-size: 0.775rem; color: var(--color-muted-text); font-weight: 500;">Submitted: ${req.submittedAt}</span>
          </div>
          <h4 style="font-size: 1rem; margin-top: 6px; color: var(--color-deep-ink);">${req.type}: ${req.rentalName || req.rentalId}</h4>
          <div style="font-size: 0.8125rem; color: var(--color-muted-text); margin-top: 2px;">
            <strong>Details:</strong> ${req.requestedItem || req.reason} • <strong>Target Date:</strong> ${req.preferredDate}
          </div>
          ${req.notes ? `<div style="font-size: 0.75rem; color: var(--color-muted-text); font-style: italic; margin-top: 4px;">Note: "${req.notes}"</div>` : ''}
        </div>
        <div style="text-align: end; font-size: 0.75rem; color: var(--color-muted-text);">
          Dispatch Route Under Logistics Review
        </div>
      </div>
    `).join('');
  }

  // 6. Documents View (Agreements & Receipts)
  function renderDocuments() {
    const agreementsListEl = document.getElementById('docs-agreements-list');
    const receiptsListEl = document.getElementById('docs-receipts-list');

    if (agreementsListEl) {
      if (state.rentals.length === 0) {
        agreementsListEl.innerHTML = `<p style="color: var(--color-muted-text); font-size: 0.875rem;">No active agreements on file.</p>`;
      } else {
        agreementsListEl.innerHTML = state.rentals.map(rental => `
          <div class="doc-card">
            <div class="doc-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </div>
            <div class="doc-info">
              <div class="doc-title">${rental.agreementNumber}</div>
              <div class="doc-meta">${rental.packageName} • Term: ${rental.tenureMonths} Months (${rental.startDate})</div>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.NestloopDash.openAgreement('${rental.rentalId}')">
                Download PDF
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    if (receiptsListEl) {
      if (!state.billingHistory || state.billingHistory.length === 0) {
        receiptsListEl.innerHTML = `<p style="color: var(--color-muted-text); font-size: 0.875rem;">No paid receipts recorded.</p>`;
      } else {
        receiptsListEl.innerHTML = state.billingHistory.map(inv => `
          <div class="doc-card">
            <div class="doc-icon-box" style="background-color: var(--color-pale-mint); color: var(--color-success);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="doc-info">
              <div class="doc-title">${inv.invoiceId} (₹${inv.amount.toLocaleString('en-IN')})</div>
              <div class="doc-meta">Paid on ${inv.date} • ${inv.period}</div>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.NestloopDash.openReceipt('${inv.invoiceId}')">
                Download PDF
              </button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // 7. Profile & Settings View
  function renderSettings() {
    const nameInput = document.getElementById('settings-name');
    const emailInput = document.getElementById('settings-email');
    const phoneInput = document.getElementById('settings-phone');
    const addressInput = document.getElementById('settings-address');

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput) phoneInput.value = user.phone || "";
    if (addressInput) addressInput.value = state.address || user.address || "";

    const resetBtn = document.getElementById('btn-reset-demo-data');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm("Reset all local demonstration state (rentals, requests, payments) back to the initial demo seed?")) {
          data.resetDemoState();
          state = data.getDemoState();
          renderAllViews();
          if (window.NestloopApp && window.NestloopApp.showToast) {
            window.NestloopApp.showToast("Demonstration state reset successfully.", "info");
          }
        }
      };
    }
  }

  // Modals & Interactive Workflow Handlers
  function setupModals() {
    const swapModal = document.getElementById('modal-swap-request');
    const returnModal = document.getElementById('modal-return-request');
    const closeBtns = document.querySelectorAll('[data-close-modal]');

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (swapModal) swapModal.classList.remove('is-active');
        if (returnModal) returnModal.classList.remove('is-active');
      });
    });

    // Swap Form Submit
    const swapForm = document.getElementById('form-swap-request');
    if (swapForm) {
      swapForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rentalId = document.getElementById('swap-rental-select').value;
        const replaceWith = document.getElementById('swap-replacement-select').value;
        const reason = document.getElementById('swap-reason').value;
        const prefDate = document.getElementById('swap-date').value;
        const notes = document.getElementById('swap-notes').value;

        if (!rentalId || !replaceWith || !prefDate) {
          alert("Please fill in all required swap details.");
          return;
        }

        const matchedRental = state.rentals.find(r => r.rentalId === rentalId);
        const newReq = {
          requestId: `REQ-SWAP-${Math.floor(1000 + Math.random() * 9000)}`,
          type: "Swap Request",
          rentalId: rentalId,
          rentalName: matchedRental ? matchedRental.packageName : rentalId,
          requestedItem: replaceWith,
          reason: reason,
          preferredDate: prefDate,
          submittedAt: new Date().toISOString().split('T')[0],
          status: "Pending Review",
          notes: notes
        };

        state.requests.unshift(newReq);
        data.saveDemoState(state);

        swapModal.classList.remove('is-active');
        swapForm.reset();
        renderRequests();
        renderOverview();

        if (window.NestloopApp && window.NestloopApp.showToast) {
          window.NestloopApp.showToast(`Swap request ${newReq.requestId} submitted for logistics review!`, 'success');
        }
        switchView('requests');
      });
    }

    // Early Return Form Submit
    const returnForm = document.getElementById('form-return-request');
    if (returnForm) {
      returnForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rentalId = document.getElementById('return-rental-select').value;
        const returnDate = document.getElementById('return-date').value;
        const reason = document.getElementById('return-reason').value;
        const notes = document.getElementById('return-notes').value;

        if (!rentalId || !returnDate) {
          alert("Please specify the rental item and requested collection date.");
          return;
        }

        const matchedRental = state.rentals.find(r => r.rentalId === rentalId);
        const newReq = {
          requestId: `REQ-RET-${Math.floor(1000 + Math.random() * 9000)}`,
          type: "Early Return Request",
          rentalId: rentalId,
          rentalName: matchedRental ? matchedRental.packageName : rentalId,
          requestedItem: "Pickup & Inspection Request",
          reason: reason,
          preferredDate: returnDate,
          submittedAt: new Date().toISOString().split('T')[0],
          status: "Pending Review",
          notes: notes
        };

        state.requests.unshift(newReq);
        data.saveDemoState(state);

        returnModal.classList.remove('is-active');
        returnForm.reset();
        renderRequests();
        renderOverview();

        if (window.NestloopApp && window.NestloopApp.showToast) {
          window.NestloopApp.showToast(`Early return pickup request ${newReq.requestId} submitted. Rental remains active until approved.`, 'info');
        }
        switchView('requests');
      });
    }
  }

  // Global window functions for inline onclick bindings
  window.NestloopDash = {
    openAgreement: function (rentalId) {
      const match = state.rentals.find(r => r.rentalId === rentalId);
      if (!match) return;
      pdfGen.generateAgreement(match, user);
    },

    openReceipt: function (invoiceId) {
      const match = state.billingHistory.find(i => i.invoiceId === invoiceId);
      if (!match) return;
      pdfGen.generateReceipt(match, user);
    },

    openSwapModal: function (rentalId) {
      const modal = document.getElementById('modal-swap-request');
      const select = document.getElementById('swap-rental-select');
      const replacementSelect = document.getElementById('swap-replacement-select');

      if (!modal || !select) return;

      // Populate options with current user rentals
      select.innerHTML = state.rentals.map(r => `
        <option value="${r.rentalId}" ${r.rentalId === rentalId ? 'selected' : ''}>${r.packageName} (${r.rentalId})</option>
      `).join('');

      // Populate replacement options with packages
      if (replacementSelect) {
        replacementSelect.innerHTML = data.PACKAGES.map(p => `
          <option value="${p.name} (${p.tier})">${p.name} [${p.tier}]</option>
        `).join('');
      }

      modal.classList.add('is-active');
    },

    openReturnModal: function (rentalId) {
      const modal = document.getElementById('modal-return-request');
      const select = document.getElementById('return-rental-select');

      if (!modal || !select) return;

      select.innerHTML = state.rentals.map(r => `
        <option value="${r.rentalId}" ${r.rentalId === rentalId ? 'selected' : ''}>${r.packageName} (${r.rentalId})</option>
      `).join('');

      modal.classList.add('is-active');
    },

    requestPackageQuick: function (pkgId) {
      const pkg = data.getPackageById(pkgId);
      const cost = data.calculateCost(pkg, 12);
      const newRentalId = 'NL-' + Math.floor(1000 + Math.random() * 9000);
      const now = new Date();
      const startStr = now.toISOString().split('T')[0];
      const endD = new Date(now);
      endD.setMonth(endD.getMonth() + 12);
      const endStr = endD.toISOString().split('T')[0];

      const nextDue = new Date(now);
      nextDue.setDate(15);
      if (now.getDate() >= 15) nextDue.setMonth(nextDue.getMonth() + 1);
      const nextDueStr = nextDue.toISOString().split('T')[0];

      const newRecord = {
        rentalId: newRentalId,
        packageId: pkg.id,
        packageName: pkg.name,
        category: pkg.category,
        image: pkg.image,
        tenureMonths: 12,
        monthlyRate: cost.monthlyRate,
        depositPaid: cost.deposit,
        startDate: startStr,
        endDate: endStr,
        nextDueDate: nextDueStr,
        status: "Active",
        agreementNumber: "AGR-2026-" + newRentalId,
        itemsSummary: pkg.includedItems.map(i => `${i.qty}x ${i.name.split(' (')[0]}`).join(', '),
        paymentMethod: "Demo Auto-Debit"
      };

      state.rentals.unshift(newRecord);
      data.saveDemoState(state);
      renderAllViews();

      if (window.NestloopApp && window.NestloopApp.showToast) {
        window.NestloopApp.showToast(`"${pkg.name}" added to your Active Rentals!`, 'success');
      }
      switchView('rentals');
    }
  };
});
