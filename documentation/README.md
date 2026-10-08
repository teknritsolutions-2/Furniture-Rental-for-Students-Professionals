# NESTLOOP — Furniture Rental for Students & Professionals

> **"Furniture that moves with you."**
> A modern, modular consumer furniture rental web platform and interactive customer portal built with pure HTML5, CSS3, and Vanilla JavaScript.

---

## 1. Quick Start & Local Run Instructions

This project is a completely static, dependency-free web application. It requires **no build step**, no package managers, and no Node.js runtime to preview.

### Option A: Python HTTP Server (Recommended)
From the project root directory:
```bash
python3 -m http.server 8000
```
Open your browser at: [http://localhost:8000](http://localhost:8000)

### Option B: VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click on `index.html` and select **"Open with Live Server"**.

### Option C: Direct Browser Preview
You can double-click `index.html` directly from your file manager to open it in any modern web browser.

---

## 2. Documented Demonstration Credentials

The platform features a client-side session management system with pre-configured demonstration profiles.

| User Profile | Role | Demo Email | Demo Password | Default City |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Chen** | Working Professional | `alex.chen@nestloop.demo` | `password123` | Bengaluru |
| **Priya Sharma** | University Student | `priya.sharma@nestloop.demo` | `password123` | Hyderabad |

> **Convenience Feature**: The login screen (`pages/login.html`) provides **one-click fill buttons** to instantly load these demo credentials. You may also register new custom demonstration users on `pages/register.html`.

---

## 3. Complete Site Pages Inventory

| Route | Page Name | Primary Features & Narrative |
| :--- | :--- | :--- |
| `/index.html` | **Home 1: Consumer Storefront** | 10 meaningful sections: functional discovery bar (linking to filtered packages), benefits, Starter/Essential/Premium previews, room categories, furnished vs unfurnished split, rent vs buy model, student vs professional tabs, and quick coverage checker. |
| `/pages/home2.html` | **Home 2: Modular Living** | Distinct visual arrangement: panoramic photographic hero (strictly matching global H1 font sizing), horizontal category navigation bar, photographic room-story grid, and subscription lifecycle timeline. |
| `/pages/packages.html` | **Packages Catalogue** | Dynamic multi-filter catalogue (tier, room category, audience, search keyword) and live 3/6/12-month tenure switching updating monthly prices in real-time. |
| `/pages/package-details.html` | **Package Details Dynamic View** | Driven by `?id=...` and `?tenure=...`. Room-inspiration gallery with thumbnail switcher, included items specification checklist, dynamic cost breakdown, and 1-click rental request action. |
| `/pages/how-it-works.html` | **How It Works Journey** | Editorial step-by-step rental lifecycle: package selection, PIN verification, white-glove assembly, portal management, and flexible swaps. |
| `/pages/pricing.html` | **Transparent Pricing** | Interactive tenure toggle (3, 6, 12 months) updating Starter, Essential, and Premium monthly rates and deposits, with transparent terms on swaps, early returns, and billing. |
| `/pages/coverage.html` | **Coverage Areas & Checker** | Deterministic postal PIN code lookup for Hyderabad, Bengaluru, Pune, Chennai, and Mumbai with supported, needs-confirmation, and unavailable states, plus an area expansion interest form. |
| `/pages/about.html` | **About NESTLOOP** | Sustainable circular economy model, furniture sanitization lifecycle, and core quality standards without fabricated company history. |
| `/pages/faq.html` | **Frequently Asked Questions** | Categorized accordion modules covering leases, security deposits, white-glove setup, wear-and-tear policies, swaps, and receipts. |
| `/pages/contact.html` | **Contact & Regional Hubs** | Validated static contact form, illustrative regional contact details, and customer service operating hours. |
| `/pages/login.html` | **Customer Login** | Auth-specific header without full navbar, 1-click demo credential prefill buttons, show/hide password toggle, and portal access redirection. |
| `/pages/register.html` | **Demo Registration** | Client-side customer onboarding creating local session records in browser LocalStorage. |
| `/pages/dashboard.html` | **Customer Rental Portal** | Complete customer management application: Overview metrics, Portal Package Browsing, My Rentals, Billing Schedule, Swap & Return Request Workflows, and Vector PDF Document Generation. |
| `/pages/terms.html` | **Rental Agreement Terms** | Clearly labeled demonstration specimen terms governing subscriptions, deposits, swaps, and returns. |
| `/pages/privacy.html` | **Privacy Policy** | Clearly labeled demonstration privacy policy detailing client-side local storage handling. |
| `/404.html` | **404 Not Found** | Clean error page with direct navigation routes back to the storefront and catalogue. |

---

## 4. Customer Dashboard Modules & Features

The customer dashboard (`pages/dashboard.html`) is structured as a dedicated customer portal:

1. **Account Overview**:
   - Active rentals count, monthly rent commitment, next payment due date, and pending requests.
   - Upcoming payment banner with quick action links.
   - Quick preview of currently rented furniture.
2. **Browse Packages**:
   - Embedded portal catalogue allowing customers to explore and add new furniture bundles directly from within their active account.
3. **My Rentals**:
   - Cards showing genuine photos, bundle names, categories, lease start and end dates, tenure, monthly rent, and next due date.
   - Quick actions on each item: **Download Agreement PDF**, **Request Swap**, and **Request Early Return**.
4. **Billing & Due Dates**:
   - Total monthly commitment and billing cycle indicators.
   - Past statements table with invoice numbers, periods, and amounts.
   - **Simulate Advance Payment (Demo)** button providing real-time demonstration payment status transitions and due-date roll-forwards.
   - 1-click official **PDF Receipt generation**.
5. **Swap / Return Requests**:
   - Interactive modal workflow to select an active rented item, choose a replacement bundle, specify the reason, and pick a target swap date.
   - Submitting generates a unique `REQ-SWAP-XXXX` or `REQ-RET-XXXX` record, saves it to LocalStorage, and marks it as **Pending Review**.
   - Active rental items are preserved during pending review per customer usability requirements.
6. **Documents Center**:
   - Real, client-side vector PDF downloads using bundled `jsPDF` for both **Rental Agreements** and **Payment Receipts**, complete with customer name, itemized lists, agreement numbers, and prominent `DEMO / SAMPLE` watermarks.
7. **Profile & Settings**:
   - User profile details and registered delivery address.
   - **Reset Demonstration Data** action to safely wipe modified state and restore default demo seed data.

---

## 5. Engineering & Design Architecture

- **Shared Component Sizing (Client Requirement)**:
  - Global design tokens defined in `assets/css/tokens.css` enforce identical heading scales across the platform.
  - `--h1-hero-size` strictly governs both Home 1 and Home 2 hero banners, ensuring identical font sizes across every breakpoint (1440px down to 320px).
- **Color Palette**:
  - Warm Chalk: `#F7F6F2`
  - Deep Ink: `#20252B`
  - Cobalt Blue: `#465DDE`
  - Pale Mint: `#E6F1E9`
  - Neutral Grey: `#E5E7E6`
  - Muted Text: `#656D73`
- **Persistent Theme & Direction**:
  - **Light / Dark Mode**: Toggles between light and dark palettes, stored persistently in `localStorage`.
  - **LTR / RTL Mode**: Toggles layout direction, utilizing CSS logical properties while strictly keeping logos and furniture photography unmirrored.
- **Accessible Mobile Drawer**:
  - Full keyboard navigation with Tab/Shift+Tab focus trapping, Escape key support, and focus restoration to the toggle trigger upon closing.
- **Zero AI-Generated Images**:
  - 100% genuine photography of real furnished spaces and furniture sourced from verified creators on Unsplash under the Unsplash license. All images are downloaded locally in WebP format. Documented in `documentation/IMAGE-SOURCES.md`.
- **Offline / Local PDF Generation**:
  - Powered by local `assets/vendor/jspdf.umd.min.js`. Generates real `.pdf` files without external API calls or hotlinks.

---

## 6. GitHub Pages Deployment

1. Initialize git in the workspace:
   ```bash
   git init
   git add .
   git commit -m "Initial release of NESTLOOP furniture rental platform"
   ```
2. Push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/your-username/nestloop-furniture-rental.git
   git branch -M main
   git push -u origin main
   ```
3. In GitHub repository settings:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Choose branch **`main`** and folder **`/ (root)`**.
   - Click **Save**.
4. The site will be live at `https://your-username.github.io/nestloop-furniture-rental/`. All relative paths, links, PDF generators, and asset references will function seamlessly in any subdirectory.

---

## 7. Assumptions & Scope Declarations

1. **Static Demonstration Scope**: This web application is a complete frontend demonstration. It does not connect to live banking networks, real credit card processors, or production government identity APIs.
2. **Pricing Model**: Sample demonstration pricing in INR is provided across 3, 6, and 12-month tenures for illustration.
3. **Coverage Network**: Metro corridors in Hyderabad, Bengaluru, Pune, Chennai, and Mumbai are simulated based on deterministic demo postal PIN codes.


## 8. Visual refinement and browser QA

See [REFINEMENT-REPORT.md](REFINEMENT-REPORT.md) for the implemented design changes, image corrections, 792 responsive/appearance checks, 44 functional assertions, test commands and remaining limitations. The static HTML/CSS/JavaScript architecture and public demo dashboard access are retained.
