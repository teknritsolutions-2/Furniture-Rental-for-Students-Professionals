const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://localhost:8085';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {})
  });

  const page = await browser.newPage();
  const passes = [];
  const fails = [];

  function test(name, cond, details = '') {
    if (cond) {
      console.log('PASS:', name);
      passes.push(name);
    } else {
      console.error('FAIL:', name, details);
      fails.push({ name, details });
    }
  }

  console.log('\n--- VERIFYING USER REQUIREMENTS ---');

  // 1. Home 1 Banner in Tablet & Mobile
  for (const vp of [{ name: 'tablet', w: 768, h: 1024 }, { name: 'mobile', w: 375, h: 812 }]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto(`${base}/index.html`);
    const bg = await page.$eval('.hero-home1', el => getComputedStyle(el).backgroundImage);
    test(`Home 1 banner has background image in ${vp.name} view`, bg.includes('package-essential-1bhk') || bg.includes('gradient'), `got ${bg}`);
    
    const textAlign = await page.$eval('.hero-home1-content', el => getComputedStyle(el).textAlign);
    test(`Home 1 banner content is centered in ${vp.name} view`, textAlign === 'center', `got ${textAlign}`);

    const mediaDisplay = await page.$eval('.hero-home1-media', el => getComputedStyle(el).display);
    test(`Home 1 media is hidden in ${vp.name} view`, mediaDisplay === 'none', `got ${mediaDisplay}`);
  }

  // 2. Navbar toggles hidden in header and kept in hamburger drawer in tablet & mobile
  for (const vp of [{ name: 'tablet', w: 768, h: 1024 }, { name: 'mobile', w: 375, h: 812 }]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto(`${base}/index.html`);
    const headerThemeBtn = await page.$eval('.nav-actions .theme-toggle-btn', el => getComputedStyle(el).display);
    const headerRtlBtn = await page.$eval('.nav-actions .dir-toggle-btn', el => getComputedStyle(el).display);
    test(`Theme toggle hidden from top header in ${vp.name}`, headerThemeBtn === 'none', `got ${headerThemeBtn}`);
    test(`RTL toggle hidden from top header in ${vp.name}`, headerRtlBtn === 'none', `got ${headerRtlBtn}`);

    // Open drawer
    await page.locator('.mobile-menu-toggle').click();
    await page.waitForTimeout(300);
    const drawerThemeBtn = await page.$eval('.drawer-footer .theme-toggle-btn', el => getComputedStyle(el).display);
    const drawerRtlBtn = await page.$eval('.drawer-footer .dir-toggle-btn', el => getComputedStyle(el).display);
    test(`Theme toggle present and visible in hamburger drawer in ${vp.name}`, drawerThemeBtn !== 'none');
    test(`RTL toggle present and visible in hamburger drawer in ${vp.name}`, drawerRtlBtn !== 'none');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 3. Page hero banners in public pages
  const publicPages = [
    'about.html',
    'packages.html',
    'pricing.html',
    'coverage.html',
    'contact.html',
    'how-it-works.html',
    'faq.html',
    'terms.html',
    'privacy.html'
  ];
  for (const p of publicPages) {
    await page.goto(`${base}/pages/${p}`);
    const bannerCount = await page.locator('.page-hero-banner').count();
    test(`Page ${p} has .page-hero-banner`, bannerCount >= 1, `count: ${bannerCount}`);
  }

  // 4. Coverage page checks: Operational hubs comfortable spacing & On-site execution vertical stacking
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${base}/pages/coverage.html`);
  
  // Operational hubs
  const cityCardPad = await page.$eval('.city-card', el => {
    const cs = getComputedStyle(el);
    return { l: parseFloat(cs.paddingLeft), r: parseFloat(cs.paddingRight), t: parseFloat(cs.paddingTop) };
  });
  test('Active operational hubs cards have comfortable padding in tablet', cityCardPad.l >= 20 && cityCardPad.r >= 20, JSON.stringify(cityCardPad));

  await page.setViewportSize({ width: 375, height: 812 });
  const cityCardPadMobile = await page.$eval('.city-card', el => {
    const cs = getComputedStyle(el);
    return { l: parseFloat(cs.paddingLeft), r: parseFloat(cs.paddingRight) };
  });
  test('Active operational hubs cards have comfortable padding in mobile (not 0)', cityCardPadMobile.l >= 16 && cityCardPadMobile.r >= 16, JSON.stringify(cityCardPadMobile));

  // Onsite execution vertical stacking in tablet view
  await page.setViewportSize({ width: 768, height: 1024 });
  const inclusionsColumns = await page.$eval('section[aria-labelledby="inclusions-title"] .two-column-grid', el => {
    return getComputedStyle(el).gridTemplateColumns.split(' ').length;
  });
  test('On-site execution items aligned vertically (1 column) in tablet view', inclusionsColumns === 1, `got ${inclusionsColumns} columns`);

  // 5. Dashboard checks
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${base}/pages/dashboard.html`);
  
  // Profile switcher button removed in all views
  const switcherBtn = await page.locator('#dash-switch-user-btn').count();
  test('Profile switcher button #dash-switch-user-btn is removed', switcherBtn === 0);
  const personaLabel = await page.locator('#dash-persona-label').count();
  test('Persona label #dash-persona-label exists for user name display', personaLabel === 1);

  // Side panel navigation
  const sidebarLinksInSidepanel = await page.locator('.dash-sidebar .dash-nav .dash-nav-link').count();
  test('Dashboard has sidepanel with all 7 links in side panel', sidebarLinksInSidepanel === 7);

  // Check Upcoming Payment Cycle in Dark Mode
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(200);
  
  const paymentBannerStyles = await page.$eval('.next-payment-banner', el => {
    const cs = getComputedStyle(el);
    const title = el.querySelector('.banner-title');
    const desc = el.querySelector('.banner-desc');
    const tag = el.querySelector('.banner-tag');
    const btn = el.querySelector('.btn-primary');
    return {
      bg: cs.backgroundColor,
      titleColor: title ? getComputedStyle(title).color : '',
      descColor: desc ? getComputedStyle(desc).color : '',
      tagColor: tag ? getComputedStyle(tag).color : '',
      btnBg: btn ? getComputedStyle(btn).backgroundColor : '',
      btnColor: btn ? getComputedStyle(btn).color : ''
    };
  });
  
  // Ensure title and desc are clearly visible (not dark on dark and not white on white)
  test('Upcoming payment cycle card has dark background in dark mode', paymentBannerStyles.bg !== 'rgb(255, 255, 255)', `got ${paymentBannerStyles.bg}`);
  test('Upcoming payment cycle title is crisp light/white in dark mode', paymentBannerStyles.titleColor.includes('255, 255, 255'), `got ${paymentBannerStyles.titleColor}`);
  test('Upcoming payment cycle primary button is visible in dark mode', paymentBannerStyles.btnBg !== paymentBannerStyles.bg && paymentBannerStyles.btnColor !== paymentBannerStyles.btnBg, JSON.stringify(paymentBannerStyles));

  // 6. Pill shape padding check
  await page.goto(`${base}/pages/packages.html`);
  const filterPillPad = await page.$eval('.filter-pill', el => {
    const cs = getComputedStyle(el);
    return { l: parseFloat(cs.paddingLeft), r: parseFloat(cs.paddingRight), t: parseFloat(cs.paddingTop), b: parseFloat(cs.paddingBottom) };
  });
  test('Filter pills have comfortable loosened padding', filterPillPad.l >= 16 && filterPillPad.t >= 6, JSON.stringify(filterPillPad));

  console.log('\n=========================================');
  console.log(`TOTAL PASSES: ${passes.length}`);
  console.log(`TOTAL FAILS:  ${fails.length}`);
  console.log('=========================================');

  await browser.close();

  if (fails.length > 0) {
    process.exit(1);
  }
})();
