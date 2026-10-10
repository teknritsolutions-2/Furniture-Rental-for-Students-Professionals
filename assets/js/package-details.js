/**
 * MODULIV — Package Details Controller
 * Renders package details dynamically based on ?id= query param,
 * provides thumbnail photo gallery switching, dynamic tenure cost recalculation,
 * and handles the interactive demo rental request workflow.
 */

document.addEventListener('DOMContentLoaded', () => {
  const detailRoot = document.getElementById('package-detail-container');
  if (!detailRoot) return;

  const data = window.NestloopData;
  if (!data) return;

  // Read URL params
  const params = new URLSearchParams(window.location.search);
  const packageId = params.get('id') || 'starter-student-room';
  let selectedTenure = [3, 6, 12].includes(Number(params.get('tenure'))) ? Number(params.get('tenure')) : 12;

  const pkg = data.getPackageById(packageId);

  // Set document title
  document.title = `${pkg.name} — Furniture Rental | MODULIV`;

  // Gallery items (main package photo + authentic detail close-ups)
  const roomPhotos = {
    bedroom: ['category-bedroom.webp', 'lifestyle-student.webp'],
    living: ['package-premium-living.webp', 'gallery-detail-1.webp'],
    workspace: ['category-workspace.webp', 'office-desk.webp'],
    apartment: ['category-studio.webp', 'hero-home2.webp']
  };
  const galleryPhotos = [...new Set([pkg.image, ...(roomPhotos[pkg.categoryKey] || roomPhotos.living)])]
    .map((file, i) => ({ src: data.getImagePath(file), alt: `${pkg.category} room inspiration, photograph ${i + 1}` }));

  let currentActivePhotoIndex = 0;

  function renderView() {
    const cost = data.calculateCost(pkg, selectedTenure);
    const tierChipClass = pkg.tier === 'Starter' ? 'chip-starter' : (pkg.tier === 'Essential' ? 'chip-essential' : 'chip-premium');

    detailRoot.innerHTML = `
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" style="margin-bottom: 24px;">
        <ol style="display: flex; gap: 8px; list-style: none; flex-wrap: wrap; font-size: 0.875rem; color: var(--color-muted-text); align-items: center;">
          <li><a href="../index.html" style="color: inherit; text-decoration: none;">Home</a></li>
          <li>/</li>
          <li><a href="packages.html" style="color: inherit; text-decoration: none;">Packages</a></li>
          <li>/</li>
          <li style="color: var(--color-deep-ink); font-weight: 600;">${pkg.name}</li>
        </ol>
      </nav>

      <div class="detail-layout">
        <!-- Media Gallery -->
        <div class="detail-gallery">
          <img id="detail-main-img" class="detail-main-img" src="${galleryPhotos[currentActivePhotoIndex].src}" alt="${galleryPhotos[currentActivePhotoIndex].alt}">
          <div class="detail-thumbs">
            ${galleryPhotos.map((photo, idx) => `
              <button type="button" class="detail-thumb-btn ${idx === currentActivePhotoIndex ? 'active' : ''}" aria-pressed="${idx === currentActivePhotoIndex}" data-thumb-idx="${idx}" aria-label="View photo ${idx + 1}">
                <img src="${photo.src}" alt="${photo.alt}">
              </button>
            `).join('')}
          </div>

          <p class="detail-assumptions">Room inspiration photographs. Exact items and specifications below are illustrative demo data.</p>
          <!-- Included Furniture Breakdown -->
          <div class="card" style="margin-top: 24px;">
            <h3 class="subsection-h3" style="margin-bottom: 16px;">Included Furniture Pieces (${pkg.includedItems.length})</h3>
            <ul class="items-checklist">
              ${pkg.includedItems.map(item => `
                <li class="checklist-item">
                  <div class="checklist-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <div style="font-weight: 600; color: var(--color-deep-ink); font-size: 0.95rem;">${item.qty}x ${item.name}</div>
                    <div style="font-size: 0.8125rem; color: var(--color-muted-text);">${item.specs}</div>
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Room Fit & Specs -->
          <div class="card" style="margin-top: 20px;">
            <h3 class="subsection-h3" style="margin-bottom: 14px;">Package Specifications</h3>
            <div class="two-column-grid" style="gap: 14px; font-size: 0.875rem;">
              <div>
                <div style="color: var(--color-muted-text); font-size: 0.75rem; text-transform: uppercase;">Room Compatibility</div>
                <div style="font-weight: 600;">${pkg.roomFit}</div>
              </div>
              <div>
                <div style="color: var(--color-muted-text); font-size: 0.75rem; text-transform: uppercase;">Aesthetic Finish</div>
                <div style="font-weight: 600;">${pkg.packageSpecs.finish}</div>
              </div>
              <div>
                <div style="color: var(--color-muted-text); font-size: 0.75rem; text-transform: uppercase;">Delivery & Setup</div>
                <div style="font-weight: 600; color: var(--color-deep-ink);">${pkg.packageSpecs.assemblyRequirement}</div>
              </div>
              <div>
                <div style="color: var(--color-muted-text); font-size: 0.75rem; text-transform: uppercase;">Sample care provision</div>
                <div style="font-weight: 600;">${pkg.packageSpecs.maintenanceCover}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration & Booking Side -->
        <div class="detail-sidebar">
          <div class="detail-config-card" id="rent-config">
            <div>
              <span class="chip ${tierChipClass}" style="margin-bottom: 10px;">${pkg.tier} Bundle</span>
              <h1 class="inner-h1" style="margin-bottom: 8px;">${pkg.name}</h1>
              <p class="body-lead" style="font-size: 1rem; margin-bottom: 16px;">${pkg.tagline}</p>
              <div style="font-size: 0.875rem; color: var(--color-muted-text);">${pkg.shortDescription}</div>
            </div>

            <!-- Tenure Selector -->
            <div>
              <label class="form-label" style="margin-bottom: 8px; display: block;">Select Rental Tenure</label>
              <div class="detail-tenures">
                <button type="button" class="btn ${selectedTenure === 3 ? 'btn-secondary' : 'btn-outline'} btn-sm" aria-pressed="${selectedTenure === 3}" data-detail-tenure="3">
                  3 Months
                </button>
                <button type="button" class="btn ${selectedTenure === 6 ? 'btn-secondary' : 'btn-outline'} btn-sm" aria-pressed="${selectedTenure === 6}" data-detail-tenure="6">
                  6 Months
                </button>
                <button type="button" class="btn ${selectedTenure === 12 ? 'btn-secondary' : 'btn-outline'} btn-sm" aria-pressed="${selectedTenure === 12}" data-detail-tenure="12">
                  12 Months
                </button>
              </div>
              <div style="font-size: 0.75rem; color: var(--color-muted-text); margin-top: 6px;">
                ${selectedTenure === 12 ? 'Lowest monthly rate in this sample' : 'Sample tenure. Review demo terms before requesting.'}
              </div>
            </div>

            <!-- Pricing Breakdown -->
            <div class="detail-cost-breakdown">
              <div class="cost-row">
                <span>Monthly Rent (${selectedTenure} mos)</span>
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--color-forest);">₹${cost.monthlyRate.toLocaleString('en-IN')} / mo</span>
              </div>
              <div class="cost-row">
                <span>Refundable deposit (demo)</span>
                <span>₹${cost.deposit.toLocaleString('en-IN')}</span>
              </div>
              <div class="cost-row">
                <span>Delivery & assembly (demo)</span>
                <span style="color: var(--color-deep-ink); font-weight: 600;">₹${cost.delivery + cost.assembly}</span>
              </div>
              <div class="cost-row total-first">
                <span>Estimated Upfront Total</span>
                <span style="color: var(--color-deep-ink); font-size: 1.2rem;">₹${cost.totalFirstMonth.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <!-- Action Button -->
            <div>
              <button type="button" id="btn-request-rental" class="btn btn-primary btn-lg" style="width: 100%;">
                Request Rental
              </button>
              <p style="font-size: 0.75rem; color: var(--color-muted-text); text-align: center; margin-top: 10px;">
                Demonstration request. Saves to your local customer session.
              </p>
            </div>

            <!-- Highlights Checklist -->
            <div style="border-top: 1px solid var(--color-border); padding-top: 18px;">
              <h4 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; color: var(--color-deep-ink);">Sample package highlights</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.8125rem; color: var(--color-muted-text);">
                ${pkg.highlights.map(h => `<li style="display: flex; gap: 8px; align-items: center;"><span style="color: var(--color-forest); font-weight: bold;">✓</span> ${h}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    const related = data.PACKAGES.filter(p => p.id !== pkg.id && (p.categoryKey === pkg.categoryKey || p.tier === pkg.tier)).slice(0, 3);
    detailRoot.insertAdjacentHTML('beforeend', `<section aria-label="Related packages"><div class="section-header"><span class="eyebrow">Keep exploring</span><h2 class="section-h2">More room for choice.</h2></div><div class="packages-grid">${related.map(p => `<a class="card related-package" href="package-details.html?id=${p.id}&tenure=${selectedTenure}"><img src="${data.getImagePath(p.image)}" alt="Room inspiration for ${p.name}" loading="lazy"><div><h3 class="card-title">${p.name}</h3><p class="body-sm">${p.category} · ${selectedTenure} months</p><strong>₹${p.monthlyRates[selectedTenure].toLocaleString('en-IN')} / month →</strong></div></a>`).join('')}</div></section>`);
    attachEvents();
  }

  function attachEvents() {
    // Thumbnail switching
    const thumbs = detailRoot.querySelectorAll('.detail-thumb-btn');
    const mainImg = detailRoot.getElementById ? detailRoot.getElementById('detail-main-img') : document.getElementById('detail-main-img');

    thumbs.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-thumb-idx'), 10);
        currentActivePhotoIndex = idx;
        if (mainImg) {
          mainImg.src = galleryPhotos[idx].src;
          mainImg.alt = galleryPhotos[idx].alt;
        }
        thumbs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('active');
      });
    });

    // Tenure buttons
    const tenureButtons = detailRoot.querySelectorAll('[data-detail-tenure]');
    tenureButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        selectedTenure = parseInt(btn.getAttribute('data-detail-tenure'), 10);
        const url = new URL(location.href); url.searchParams.set('tenure', selectedTenure); history.replaceState(null, '', url);
        renderView();
        detailRoot.querySelector(`[data-detail-tenure="${selectedTenure}"]`)?.focus({ preventScroll: true });
      });
    });

    // Request Rental action
    const reqBtn = detailRoot.querySelector('#btn-request-rental');
    if (reqBtn) {
      reqBtn.addEventListener('click', handleRentalRequest);
    }
  }

  function handleRentalRequest() {
    const auth = window.NestloopAuth;
    const isAuthed = auth && auth.isAuthenticated();
    const cost = data.calculateCost(pkg, selectedTenure);

    // If logged in, add active rental directly into demo customer state!
    if (isAuthed) {
      const state = data.getDemoState();
      const newRentalId = 'NL-' + Math.floor(1000 + Math.random() * 9000);
      const newAgrId = 'AGR-2026-' + newRentalId;

      const now = new Date();
      const startDateStr = now.toISOString().split('T')[0];
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + selectedTenure);
      const endDateStr = endDate.toISOString().split('T')[0];

      // Next due date: 15th of next month
      const nextDue = new Date(now);
      nextDue.setDate(15);
      if (now.getDate() >= 15) {
        nextDue.setMonth(nextDue.getMonth() + 1);
      }
      const nextDueStr = nextDue.toISOString().split('T')[0];

      const newRentalRecord = {
        rentalId: newRentalId,
        packageId: pkg.id,
        packageName: pkg.name,
        category: pkg.category,
        image: pkg.image,
        tenureMonths: selectedTenure,
        monthlyRate: cost.monthlyRate,
        depositPaid: cost.deposit,
        startDate: startDateStr,
        endDate: endDateStr,
        nextDueDate: nextDueStr,
        status: "Active",
        agreementNumber: newAgrId,
        itemsSummary: pkg.includedItems.map(i => `${i.qty}x ${i.name.split(' (')[0]}`).join(', '),
        paymentMethod: "Demo Billing Account"
      };

      state.rentals.unshift(newRentalRecord);
      data.saveDemoState(state);

      if (window.NestloopApp && window.NestloopApp.showToast) {
        window.NestloopApp.showToast(`Package "${pkg.name}" added to your Active Rentals!`, 'success');
      }

      setTimeout(() => {
        window.location.href = 'dashboard.html#rentals';
      }, 800);
    } else {
      // Direct unauthenticated demo flow: preserve requested item and tenure, then prompt login
      if (confirm(`You selected "${pkg.name}" (${selectedTenure} months at ₹${cost.monthlyRate.toLocaleString('en-IN')}/mo).\n\nContinue to sign in to save this sample rental?`)) {
        const destParams = new URLSearchParams();
        destParams.set('id', pkg.id);
        destParams.set('tenure', String(selectedTenure));
        destParams.set('auto_request', '1');
        const targetDest = 'package-details.html?' + destParams.toString();

        const loginParams = new URLSearchParams();
        loginParams.set('redirect', targetDest);
        window.location.href = 'login.html?' + loginParams.toString();
      }
    }
  }

  // Initial render
  renderView();

  // If returning authenticated from login with auto_request parameter, execute rental request
  if (params.get('auto_request') === '1' && window.NestloopAuth && window.NestloopAuth.isAuthenticated()) {
    // Remove auto_request from URL history cleanly without reloading
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('auto_request');
    window.history.replaceState(null, '', cleanUrl.toString());

    setTimeout(() => {
      handleRentalRequest();
    }, 400);
  }
});
