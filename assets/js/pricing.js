/**
 * NESTLOOP — Pricing Page Controller
 * Controls live tenure switching (3, 6, 12 months) and updates monthly estimates,
 * deposits, and comparison metrics across all pricing tiers in real-time.
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.NestloopData;
  if (!data) return;

  const tenureButtons = document.querySelectorAll('[data-pricing-tenure]');
  if (!tenureButtons.length) return;

  let currentTenure = 12;

  // Starter sample benchmark: Student Core Study Room (1199/1449/1699)
  // Essential sample benchmark: Essential 1BHK / Bedroom (1999/2399/2799)
  // Premium sample benchmark: Premium Living Lounge / 2BHK (2999/3499/3999)
  const tierPricing = {
    starter: {
      3: 1699,
      6: 1449,
      12: 1199,
      deposit: (t) => Math.round(tierPricing.starter[t] * 1.5)
    },
    essential: {
      3: 2799,
      6: 2399,
      12: 1999,
      deposit: (t) => Math.round(tierPricing.essential[t] * 1.5)
    },
    premium: {
      3: 3999,
      6: 3499,
      12: 2999,
      deposit: (t) => Math.round(tierPricing.premium[t] * 1.5)
    }
  };

  function updatePricingDisplay() {
    tenureButtons.forEach(btn => {
      const btnTenure = parseInt(btn.getAttribute('data-pricing-tenure'), 10);
      btn.classList.toggle('active', btnTenure === currentTenure);
    });

    // Update Starter
    const starterPriceEl = document.getElementById('price-val-starter');
    const starterDepositEl = document.getElementById('deposit-val-starter');
    if (starterPriceEl) starterPriceEl.textContent = `₹${tierPricing.starter[currentTenure].toLocaleString('en-IN')}`;
    if (starterDepositEl) starterDepositEl.textContent = `₹${tierPricing.starter.deposit(currentTenure).toLocaleString('en-IN')}`;

    // Update Essential
    const essentialPriceEl = document.getElementById('price-val-essential');
    const essentialDepositEl = document.getElementById('deposit-val-essential');
    if (essentialPriceEl) essentialPriceEl.textContent = `₹${tierPricing.essential[currentTenure].toLocaleString('en-IN')}`;
    if (essentialDepositEl) essentialDepositEl.textContent = `₹${tierPricing.essential.deposit(currentTenure).toLocaleString('en-IN')}`;

    // Update Premium
    const premiumPriceEl = document.getElementById('price-val-premium');
    const premiumDepositEl = document.getElementById('deposit-val-premium');
    if (premiumPriceEl) premiumPriceEl.textContent = `₹${tierPricing.premium[currentTenure].toLocaleString('en-IN')}`;
    if (premiumDepositEl) premiumDepositEl.textContent = `₹${tierPricing.premium.deposit(currentTenure).toLocaleString('en-IN')}`;

    // Update tenure label indicators
    document.querySelectorAll('.tenure-indicator-text').forEach(el => {
      el.textContent = `${currentTenure}-Month Term`;
    });
  }

  tenureButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTenure = parseInt(btn.getAttribute('data-pricing-tenure'), 10);
      updatePricingDisplay();
    });
  });

  // Initial update
  updatePricingDisplay();
});
