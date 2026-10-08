# NESTLOOP visual refinement — October 2026

## Implemented

- **Home 1:** room-led asymmetric hero, integrated discovery panel, compact benefits rail, more distinct tier surfaces, offset room categories, photographic furnished/empty comparison, refined audience panels, open process steps and mint coverage strip.
- **Home 2:** panoramic room photograph beneath a two-column introduction, linked room stories, consistent card headings, balanced four-stage rental timeline and clear catalogue/pricing routes. Its hero uses exactly the same typography tokens as Home 1.
- **Catalogue:** consistent image frames, clearer price/tenure grouping, full-width primary actions, responsive search and filters, accessible pressed states and recovery from empty searches.
- **Details:** category-relevant inspiration gallery, mobile media → configuration → specifications order, clearer sample cost breakdown, supported-tenure validation, URL updates, focus retained after recalculation and related packages. Sticky desktop summary applies only to sufficiently tall screens.
- **Pricing:** room photographs replace the purely subscription-like treatment; active tenure styling and CTA tenure propagation now agree with calculated prices/deposits.
- **Journey / coverage:** connected editorial steps, compact city directory, responsive PIN panel and theme-aware feedback. Contact and secondary page grids now collapse properly.
- **Dashboard:** slimmer sidebar, consistent navigation, compact account facts, mint payment summary, larger rental thumbnails, aligned rental actions, mobile billing statement cards, improved document wrapping and responsive settings/forms.
- **Dialogs / navigation:** swap and return dialogs trap focus, support Escape/backdrop dismissal, restore focus and keep their controls reachable on short screens. Closed drawers/dialogs leave the focus order. Dashboard hash navigation works when reached from other controls.
- **Shared design:** retained chalk/ink/cobalt/mint palette, reduced shadow weight, consistent button and card heading tokens, reusable responsive grid classes, balanced footer columns, stable dark footer/CTA backgrounds, logical RTL borders and no mirrored photographs. Reduced-motion preferences remain supported.

## Photography and trust

Added two optimized local WebP photographs: an empty apartment by Louie A and a desk by Edward Lee, both from Unsplash. Source pages, license context and filenames are recorded in [IMAGE-SOURCES.md](IMAGE-SOURCES.md). No AI imagery was generated.

Reused relevant existing photographs and replaced incorrect placements: a gym used for an office package, a bathroom used for professionals, a villa exterior used as a furnished interior, and dining/living photos used for office/bedroom packages. Alternative text now describes visible subjects. Gallery photos are explicitly room inspiration, not exact product photographs or a before/after pair.

Removed or qualified prominent free-delivery, damage, cleaning, dispatch and refund promises. Coverage/contact feedback no longer implies that a real message or delivery request was sent. The existing sample amounts, seed records, browser storage and public dashboard entry are preserved.

## Verification

Real browser: headless Brave (Chromium) through Playwright, served locally. No backend or build framework was introduced.

- **792 layout combinations passed:** 16 HTML routes plus six additional dashboard views × 9 widths × 4 appearance modes. No document horizontal overflow, broken images or JavaScript page errors were detected.
- Widths: **1440, 1280, 1024, 820, 768, 430, 390, 360, 320px**.
- Modes: **light/LTR, dark/LTR, light/RTL, dark/RTL**.
- Computed Home 1 / Home 2 H1 font sizes match at every requested width. The shared heading tokens were preserved; conflicting inline common-component sizes were removed.
- Screenshot review covered every route and dashboard view at 820px in all four modes, plus representative 1440px and 390px storefront, pricing, detail and dashboard screens. Full-page home/detail captures were also inspected during iteration.
- **44 functional assertions passed**, including discovery, all filter types, search/reset, detail query handling and gallery, tenure pricing, sample coverage states, audience tabs, theme/direction persistence, mobile menu focus, all dashboard routes, direct access, rental creation, payment/due-date updates, swap and early return submission, required-field validation, actual agreement/receipt PDF downloads, login validation, demo login/register and reset.
- JavaScript syntax and `git diff --check` passed.

### Reproduce

Start the existing static preview with `python3 -m http.server 8000 --bind 127.0.0.1`.
Use an already installed Playwright module and Chromium-compatible browser; neither is a runtime dependency of the site:

```sh
PLAYWRIGHT_PATH=/path/to/playwright BROWSER_PATH=/path/to/browser node tests/browser-regression.cjs
PLAYWRIGHT_PATH=/path/to/playwright BROWSER_PATH=/path/to/browser node tests/visual-matrix.cjs
```

Optional `BASE_URL` and `QA_OUTPUT` variables select the server and artifact directory. Tests use isolated browser storage and do not touch an existing customer/browser profile. Browser JSON results and screenshots from this run are in `/private/tmp/nestloop-qa`.

## Remaining limitations

- This pass tested Chromium/Brave; Safari, Firefox and physical-device testing were not performed.
- Original stock-photo creator attributions contained mismatches. The inherited inventory is now explicitly flagged as unverified; the two new sources were checked directly. Stock images remain inspiration rather than exact catalogue inventory.
- Seed rental records and fixed sample dates are intentionally preserved, including their existing chronological inconsistencies. They are demonstration data, not a live account.
- The local changes have not been published to GitHub Pages.
