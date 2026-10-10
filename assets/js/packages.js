/**
 * NESTLOOP — Packages Catalogue Module
 * Handles dynamic filtering by tier, room category, audience, and rental tenure,
 * plus search and real-time monthly price recalculations.
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('packages-grid');
  if (!container) return; // Not on packages page

  const data = window.NestloopData;
  if (!data) return;

  // State
  let currentTier = 'all';
  let currentCategory = 'all';
  let currentAudience = 'all';
  let currentTenure = 12;
  let currentSearch = '';

  // Read URL query params (e.g., from Discovery Bar)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('tier')) currentTier = urlParams.get('tier');
  if (urlParams.has('category')) currentCategory = urlParams.get('category');
  if (urlParams.has('audience')) currentAudience = urlParams.get('audience');
  if (urlParams.has('tenure')) currentTenure = parseInt(urlParams.get('tenure'), 10) || 12;
  if (urlParams.has('search')) currentSearch = urlParams.get('search');

  if (![3, 6, 12].includes(currentTenure)) currentTenure = 12;

  // Elements
  const tierPills = document.querySelectorAll('[data-filter-tier]');
  const catPills = document.querySelectorAll('[data-filter-category]');
  const audienceSelect = document.getElementById('filter-audience');
  const searchInput = document.getElementById('filter-search');
  const tenureBtns = document.querySelectorAll('[data-tenure-val]');
  const resetBtn = document.getElementById('filter-reset-btn');
  const countEl = document.getElementById('packages-count-badge');

  // Initialize UI controls to reflect state
  syncUiControls();
  renderPackages();

  // Attach event listeners
  tierPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      currentTier = pill.getAttribute('data-filter-tier');
      tierPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderPackages();
    });
  });

  catPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      currentCategory = pill.getAttribute('data-filter-category');
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderPackages();
    });
  });

  if (audienceSelect) {
    audienceSelect.addEventListener('change', (e) => {
      currentAudience = e.target.value;
      renderPackages();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderPackages();
    });
  }

  tenureBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTenure = parseInt(btn.getAttribute('data-tenure-val'), 10) || 12;
      tenureBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPackages();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentTier = 'all';
      currentCategory = 'all';
      currentAudience = 'all';
      currentTenure = 12;
      currentSearch = '';
      if (searchInput) searchInput.value = '';
      if (audienceSelect) audienceSelect.value = 'all';
      syncUiControls();
      renderPackages();
    });
  }

  function syncUiControls() {
    tierPills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-filter-tier') === currentTier);
    });
    catPills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-filter-category') === currentCategory);
    });
    if (audienceSelect) audienceSelect.value = currentAudience;
    if (searchInput) searchInput.value = currentSearch;
    tenureBtns.forEach(b => {
      b.classList.toggle('active', parseInt(b.getAttribute('data-tenure-val'), 10) === currentTenure);
    });
  }

  function renderPackages() {
    document.querySelectorAll('.filter-pill, .tenure-btn').forEach(btn => btn.setAttribute('aria-pressed', btn.classList.contains('active')));
    let filtered = data.PACKAGES.filter(pkg => {
      // Tier filter
      if (currentTier !== 'all' && pkg.tier.toLowerCase() !== currentTier.toLowerCase()) {
        return false;
      }
      // Category filter
      if (currentCategory !== 'all' && pkg.categoryKey !== currentCategory) {
        return false;
      }
      // Audience filter
      if (currentAudience !== 'all') {
        if (currentAudience === 'Student' && pkg.audience !== 'Student' && pkg.audience !== 'Both') return false;
        if (currentAudience === 'Professional' && pkg.audience !== 'Working Professional' && pkg.audience !== 'Both') return false;
      }
      // Search filter
      if (currentSearch) {
        const textToMatch = `${pkg.name} ${pkg.tagline} ${pkg.shortDescription} ${pkg.includedItems.map(i => i.name).join(' ')}`.toLowerCase();
        if (!textToMatch.includes(currentSearch)) return false;
      }
      return true;
    });

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${data.PACKAGES.length} Bundles`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--color-card-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--color-surface-tint); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted-text)" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 class="subsection-h3" style="margin-bottom: 8px;">No matching furniture packages</h3>
          <p class="body-text" style="max-width: 480px; margin-inline: auto; margin-bottom: 20px;">Try adjusting your selected filters or clearing the search keyword to browse all modular room sets.</p>
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('filter-reset-btn').click()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(pkg => {
      const monthlyPrice = pkg.monthlyRates[currentTenure] || pkg.monthlyRates[12];
      const tierChipClass = pkg.tier === 'Starter' ? 'chip-starter' : (pkg.tier === 'Essential' ? 'chip-essential' : 'chip-premium');
      const isPagesDir = window.location.pathname.includes('/pages/');
      const detailsUrl = (isPagesDir ? 'package-details.html' : 'pages/package-details.html') + `?id=${pkg.id}&tenure=${currentTenure}`;
      const imgSrc = data.getImagePath(pkg.image);

      return `
        <article class="card package-card card-hover">
          <div class="package-card-img-wrap">
            <span class="chip ${tierChipClass} package-card-tag">${pkg.tier} Bundle</span>
            <img src="${imgSrc}" alt="${pkg.name} room photography" loading="lazy">
          </div>
          <div class="package-card-body">
            <div class="package-card-category">${pkg.category} • ${pkg.targetText}</div>
            <h3 class="package-card-title">${pkg.name}</h3>
            <p class="package-card-desc">${pkg.tagline}</p>
            
            <div class="package-items-pills">
              ${pkg.includedItems.slice(0, 3).map(it => `<span class="package-item-pill">${it.qty}x ${it.name.split(' (')[0]}</span>`).join('')}
              ${pkg.includedItems.length > 3 ? `<span class="package-item-pill">+${pkg.includedItems.length - 3} more items</span>` : ''}
            </div>

            <div class="package-card-pricing">
              <div>
                <span class="price-val">₹${monthlyPrice.toLocaleString('en-IN')}</span>
                <span class="price-period">/ month</span>
              </div>
              <div class="price-tenure-note">${currentTenure}-month tenure</div>
            </div>

            <div class="package-card-actions">
              <a href="${detailsUrl}#rent-config" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;">Select Package</a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
});
