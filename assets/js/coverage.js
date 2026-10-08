/**
 * NESTLOOP — Coverage Areas Controller
 * Functional demo postal / PIN-code checker with deterministic states:
 * Supported / Needs Confirmation / Unavailable across Hyderabad, Bengaluru,
 * Pune, Chennai, and Mumbai metro corridors.
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.NestloopData;
  if (!data) return;

  const pinForm = document.getElementById('coverage-checker-form');
  const pinInput = document.getElementById('coverage-pin-input');
  const citySelect = document.getElementById('coverage-city-select');
  const resultBox = document.getElementById('coverage-status-result');
  const citiesGrid = document.getElementById('coverage-cities-grid');

  // Render city cards
  if (citiesGrid) {
    citiesGrid.innerHTML = data.COVERAGE_CITIES.map(city => `
      <div class="city-card card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <h3 class="card-title">${city.name}</h3>
            <div style="font-size: 0.8125rem; color: var(--color-muted-text);">${city.state}</div>
          </div>
          <span class="chip chip-active">Demo coverage</span>
        </div>
        <div style="font-size: 0.8125rem; color: var(--color-deep-ink); font-weight: 600; margin-top: 10px;">
          Sample estimate: <span style="color: var(--color-cobalt);">${city.avgDeliveryDays}</span>
        </div>
        <div style="margin-top: 12px; border-top: 1px solid var(--color-border); padding-top: 10px;">
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted-text);">Sample service areas</div>
          <ul class="city-hubs-list">
            ${city.hubs.map(h => `<li>• ${h}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-top: 14px; font-size: 0.75rem; color: var(--color-muted-text);">
          Popular Pins: ${city.samplePins.slice(0, 3).map(p => `<code style="background: var(--color-surface-tint); padding: 2px 4px; border-radius: 4px;">${p.pin}</code>`).join(' ')}
        </div>
      </div>
    `).join('');
  }

  // Pre-fill PIN if selected from city dropdown
  if (citySelect && pinInput) {
    citySelect.addEventListener('change', () => {
      const cityId = citySelect.value;
      if (!cityId || cityId === 'all') return;
      const foundCity = data.COVERAGE_CITIES.find(c => c.id === cityId);
      if (foundCity && foundCity.samplePins.length > 0) {
        pinInput.value = foundCity.samplePins[0].pin;
        checkCurrentPin();
      }
    });
  }

  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      checkCurrentPin();
    });
  }

  function checkCurrentPin() {
    if (!pinInput || !resultBox) return;
    const pin = pinInput.value.trim();

    if (!pin) {
      showResult("Please enter a 6-digit postal PIN code.", "invalid");
      return;
    }

    const check = data.checkPinCode(pin);

    if (check.status === "invalid") {
      showResult(check.message, "invalid");
    } else if (check.status === "supported") {
      resultBox.className = "coverage-status-box status-supported";
      resultBox.style.display = "block";
      resultBox.innerHTML = `
        <div style="display: flex; gap: 14px; align-items: flex-start;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink: 0; margin-top: 2px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <div>
            <div style="font-weight: 700; font-size: 1rem; margin-bottom: 4px;">PIN Code ${check.pin} is supported in the demo dataset</div>
            <div style="font-size: 0.875rem; margin-bottom: 6px;"><strong>Region:</strong> ${check.area}, ${check.city} • <strong>Sample estimate:</strong> ${check.timeline}</div>
            <div style="font-size: 0.8125rem; opacity: 0.9;">This is a sample result, not confirmation of a real delivery service.</div>
            <a href="packages.html" class="btn btn-primary btn-sm" style="margin-top: 12px; display: inline-flex;">Explore Available Packages</a>
          </div>
        </div>
      `;
    } else if (check.status === "needs_confirmation") {
      resultBox.className = "coverage-status-box status-needs-confirmation";
      resultBox.style.display = "block";
      resultBox.innerHTML = `
        <div style="display: flex; gap: 14px; align-items: flex-start;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div>
            <div style="font-weight: 700; font-size: 1rem; margin-bottom: 4px;">PIN Code ${check.pin} — Extended Service Corridor</div>
            <div style="font-size: 0.875rem; margin-bottom: 6px;"><strong>Location:</strong> ${check.area} (${check.city})</div>
            <div style="font-size: 0.8125rem; opacity: 0.9;">${check.note} Delivery timeline is typically ${check.timeline}. Building access and elevator clearance will be confirmed upon order placement.</div>
          </div>
        </div>
      `;
    } else {
      resultBox.className = "coverage-status-box status-unavailable";
      resultBox.style.display = "block";
      resultBox.innerHTML = `
        <div style="display: flex; gap: 14px; align-items: flex-start;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          <div>
            <div style="font-weight: 700; font-size: 1rem; margin-bottom: 4px;">PIN Code ${check.pin} Outside Active Network</div>
            <div style="font-size: 0.875rem; margin-bottom: 8px;">${check.message}</div>
            <div style="font-size: 0.8125rem;">Try the interest form below. This demonstration does not send a request.</div>
          </div>
        </div>
      `;
    }
  }

  function showResult(msg, type) {
    if (!resultBox) return;
    resultBox.className = `coverage-status-box status-${type}`;
    resultBox.style.display = "block";
    resultBox.textContent = msg;
  }

  // Expansion Request Form Handler
  const requestForm = document.getElementById('area-request-form');
  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = document.getElementById('req-city').value;
      const pin = document.getElementById('req-pin').value;
      const email = document.getElementById('req-email').value;

      if (!pin || !email) {
        alert("Please provide both your postal PIN and email address.");
        return;
      }

      if (window.NestloopApp && window.NestloopApp.showToast) {
        window.NestloopApp.showToast(`Demo form completed for ${city} (${pin}). Nothing was sent.`, 'success');
      } else {
        alert(`Demo form completed for PIN ${pin}. Nothing was sent or subscribed.`);
      }

      requestForm.reset();
    });
  }
});
