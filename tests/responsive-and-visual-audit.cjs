const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://localhost:8085';

const PAGES = [
  'index.html',
  'pages/home2.html',
  'pages/about.html',
  'pages/packages.html',
  'pages/package-details.html?id=essential-pro-workspace',
  'pages/pricing.html',
  'pages/coverage.html',
  'pages/contact.html',
  'pages/how-it-works.html',
  'pages/faq.html',
  'pages/terms.html',
  'pages/privacy.html',
  'pages/dashboard.html'
];

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 }
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {})
  });

  const failures = [];
  const passes = [];

  function record(desc, cond, details = '') {
    if (cond) {
      passes.push(desc);
      console.log('✅ PASS:', desc);
    } else {
      failures.push({ desc, details });
      console.error('❌ FAIL:', desc, details);
    }
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('\n--- 1. SPECIFIC COMPONENT & STYLE CHECKS ---');

  // Check 1: Home 1 "The Moving Reality" images
  await page.goto(`${base}/index.html`);
  await page.locator('.split-editorial').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const movingImgs = await page.$$eval('.split-side-img', imgs => imgs.map(img => ({
    src: img.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    clientWidth: img.clientWidth,
    clientHeight: img.clientHeight,
    objectFit: window.getComputedStyle(img).objectFit
  })));
  record(
    'Moving reality has 2 images with object-fit cover and matching natural dimensions',
    movingImgs.length === 2 &&
    movingImgs.every(img => img.objectFit === 'cover' && img.naturalWidth >= 900 && img.clientHeight > 0),
    JSON.stringify(movingImgs)
  );

  // Check 2: Cost transparency table has no red color
  const redInCostTable = await page.$$eval('.cost-comp-table *', els => {
    const dangerColors = ['rgb(220, 38, 38)', 'rgb(239, 68, 68)', '#DC2626', '#EF4444', '#dc2626', '#ef4444'];
    return els.filter(el => {
      const style = window.getComputedStyle(el);
      return dangerColors.includes(style.color) || dangerColors.includes(style.backgroundColor);
    }).length;
  });
  record('Cost transparency section has no red font or danger colors', redInCostTable === 0, `Found: ${redInCostTable}`);

  // Check 3: Home 2 button hover visibility in light mode
  await page.goto(`${base}/pages/home2.html`);
  const h2Btn = page.locator('.hero-home2 .btn-outline');
  await h2Btn.hover();
  await page.waitForTimeout(100);
  const h2BtnHoveredStyle = await h2Btn.evaluate(btn => {
    const s = window.getComputedStyle(btn);
    return { color: s.color, bg: s.backgroundColor };
  });
  // Verify text is dark navy and background is near white
  const rgbMatch = h2BtnHoveredStyle.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  const isDarkNavyText = rgbMatch && parseInt(rgbMatch[1]) < 60 && parseInt(rgbMatch[2]) < 60 && parseInt(rgbMatch[3]) < 80;
  record(
    'Home 2 outline button is clearly legible on hover in light mode',
    isDarkNavyText && h2BtnHoveredStyle.bg.includes('255, 255, 255'),
    JSON.stringify(h2BtnHoveredStyle)
  );

  // Check 4: About page hero banner
  await page.goto(`${base}/pages/about.html`);
  const aboutBanner = await page.$eval('.page-hero-banner', el => ({
    exists: !!el,
    hasStats: el.querySelectorAll('.stats-counter-strip > div, .stats-counter-strip .card').length === 4,
    hasH1: !!el.querySelector('h1')
  }));
  record('About page hero banner has H1 and 4 stats cards', aboutBanner.exists && aboutBanner.hasStats && aboutBanner.hasH1);

  // Check 5: Active operational hubs (coverage page) has 6 cards
  await page.goto(`${base}/pages/coverage.html`);
  const hubCardsCount = await page.$$eval('.city-card', cards => cards.length);
  record('Coverage page has exactly 6 city hub cards (no empty block)', hubCardsCount === 6, `Count: ${hubCardsCount}`);

  // Check 6: Contact page local presence has 8 cards
  await page.goto(`${base}/pages/contact.html`);
  const contactCitiesCount = await page.$$eval('.cities-grid .city-card', cards => cards.length);
  record('Contact page has 8 local presence cards (no empty block)', contactCitiesCount === 8, `Count: ${contactCitiesCount}`);

  // Check 7: Dashboard checks
  await page.goto(`${base}/pages/dashboard.html`);
  const demoTagExists = await page.$('.dash-demo-tag');
  record('Dashboard Demo Mode tag removed', demoTagExists === null);

  const storefrontBtnExists = await page.$('#btn-storefront');
  record('Dashboard Storefront button removed', storefrontBtnExists === null);

  const studentLabels = await page.$$eval('.dash-user-role, .user-badge, .dash-header', els => {
    return els.map(e => e.textContent).filter(t => /student/i.test(t));
  });
  record('Dashboard customer label has no [Student] or (Student)', studentLabels.length === 0, JSON.stringify(studentLabels));

  const logoutBtn = await page.$eval('.dash-sidebar-footer .action-logout', btn => {
    const style = window.getComputedStyle(btn);
    return {
      text: btn.textContent.trim(),
      color: style.color,
      border: style.borderColor,
      opacity: style.opacity,
      display: style.display
    };
  });
  record(
    'Dashboard sign out button has no (Demo) and is clearly visible in sidebar',
    !logoutBtn.text.includes('(Demo)') && logoutBtn.text.includes('Sign Out') && parseFloat(logoutBtn.opacity) >= 0.9,
    JSON.stringify(logoutBtn)
  );

  // Check 8: Green fonts in packages comparison table removed
  await page.goto(`${base}/pages/packages.html`);
  const greenInPackagesTable = await page.$$eval('.table-wrapper table *', els => {
    const greenColors = ['rgb(22, 163, 74)', 'rgb(34, 197, 94)', '#16A34A', '#22C55E'];
    return els.filter(el => {
      const style = window.getComputedStyle(el);
      return greenColors.includes(style.color);
    }).length;
  });
  record('Packages comparison table has no green font colors', greenInPackagesTable === 0, `Found: ${greenInPackagesTable}`);

  console.log('\n--- 2. CTA CENTER ALIGNMENT ACROSS ALL PAGES ---');
  for (const pagePath of PAGES) {
    if (pagePath.includes('dashboard')) continue;
    await page.goto(`${base}/${pagePath}`);
    const ctaStatus = await page.$eval('.cta-banner-section', sec => {
      const card = sec.querySelector('.cta-banner-card');
      if (!card) return { hasCard: false };
      const cardStyle = window.getComputedStyle(card);
      const title = card.querySelector('.cta-banner-title');
      const actions = card.querySelector('.cta-banner-actions');
      return {
        hasCard: true,
        textAlign: cardStyle.textAlign,
        alignItems: cardStyle.alignItems,
        justifyContent: cardStyle.justifyContent,
        hasTitle: !!title,
        hasActions: !!actions
      };
    }).catch(e => ({ error: e.message }));

    record(
      `CTA banner card in ${pagePath.split('?')[0]} is centered with common container`,
      ctaStatus.hasCard && ctaStatus.textAlign === 'center',
      JSON.stringify(ctaStatus)
    );
  }

  console.log('\n--- 3. RESPONSIVE VIEWPORT & HORIZONTAL OVERFLOW AUDIT ---');
  for (const vp of VIEWPORTS) {
    for (const theme of ['light', 'dark']) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const pagePath of PAGES) {
        await page.goto(`${base}/${pagePath}`);
        if (theme === 'dark') {
          await page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('moduliv_theme', 'dark');
          });
        } else {
          await page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('moduliv_theme', 'light');
          });
        }

        // Evaluate overflow
        const overflowCheck = await page.evaluate(() => {
          const docW = document.documentElement.scrollWidth;
          const bodyW = document.body.scrollWidth;
          const winW = window.innerWidth;
          // find any element wider than window width + 2px buffer
          const wideElements = [];
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winW + 2) {
              wideElements.push({
                tag: el.tagName,
                id: el.id,
                className: (el.className || '').toString().slice(0, 50),
                right: Math.round(rect.right),
                winW
              });
              if (wideElements.length >= 3) break;
            }
          }
          return {
            docW,
            bodyW,
            winW,
            hasOverflow: docW > winW + 2,
            wideElements
          };
        });

        record(
          `No overflow on [${vp.name} ${theme}] in ${pagePath.split('?')[0]} (scrollW: ${overflowCheck.docW}px, winW: ${overflowCheck.winW}px)`,
          !overflowCheck.hasOverflow,
          JSON.stringify(overflowCheck.wideElements)
        );
      }
    }
  }

  await browser.close();

  console.log('\n=========================================');
  console.log(`TOTAL PASSES: ${passes.length}`);
  console.log(`TOTAL FAILURES: ${failures.length}`);
  console.log('=========================================');

  if (failures.length > 0) {
    console.error('FAILED CHECKS:');
    failures.forEach(f => console.error('-', f.desc, f.details));
    process.exit(1);
  } else {
    console.log('🎉 ALL AUDIT CHECKS PASSED PERFECTLY!');
    process.exit(0);
  }
})();
