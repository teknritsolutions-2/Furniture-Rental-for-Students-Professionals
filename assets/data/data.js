/**
 * NESTLOOP — Centralized Demo Data Model
 * Powers Public Packages, Details, Pricing, Coverage Checker,
 * and Customer Dashboard simulation state.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NestloopData = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Path helper: handles root index.html vs pages/ subfolder
  function getImagePath(relativeImageName) {
    if (!relativeImageName) return '';
    if (relativeImageName.startsWith('http://') || relativeImageName.startsWith('https://')) {
      return relativeImageName;
    }
    const cleanName = relativeImageName.replace(/^(\.\.\/)*assets\/images\//, '').replace(/^\/+/, '');
    const isInsidePages = window.location.pathname.includes('/pages/');
    return (isInsidePages ? '../assets/images/' : 'assets/images/') + cleanName;
  }

  const PACKAGES = [
    {
      id: "starter-student-room",
      name: "Student Core Study Room",
      tier: "Starter",
      category: "Bedroom",
      categoryKey: "bedroom",
      audience: "Student",
      targetText: "Students & Budget Living",
      featured: true,
      tagline: "Compact, durable study sanctuary engineered for high-focus academic terms.",
      image: "package-starter-student.webp",
      monthlyRates: {
        3: 1699,
        6: 1449,
        12: 1199
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "48 to 72 hours",
      shortDescription: "Solid student study desk, breathable task chair, single storage bed, and modular 3-tier bookcase.",
      includedItems: [
        { name: "Nordic Solid Oak Study Desk", qty: 1, specs: "110 x 55 cm, anti-scratch top with rear cord notch" },
        { name: "ErgoMesh Student Task Chair", qty: 1, specs: "Breathable back, pneumatic height lift, tilt-tension" },
        { name: "Compact Bed Frame with Drawers", qty: 1, specs: "Single (75 x 36 in) with 2 smooth underbed storage rollouts" },
        { name: "ComfortGuard Coir-Foam Mattress", qty: 1, specs: "5-inch orthopedic dual firmness, hypoallergenic cover" },
        { name: "Modular 3-Tier Book & Utility Rack", qty: 1, specs: "Powder-coated steel uprights with oak composite shelves" }
      ],
      highlights: [
        "Zero-stain, scratch-proof table laminate",
        "Deep underbed roll-out drawers for textbooks & gear",
        "Free seasonal maintenance & deep sanitization",
        "Flexible 3 to 12 month rental terms"
      ],
      roomFit: "Ideal for rooms 80 - 130 sq.ft (Hostels, PGs, shared apartments)",
      packageSpecs: {
        totalPieces: 5,
        finish: "Warm Scandinavian Oak & Matte Charcoal",
        assemblyRequirement: "Included free by NESTLOOP technicians",
        maintenanceCover: "Full normal wear & tear protection"
      }
    },
    {
      id: "starter-studio-living",
      name: "Starter Studio Living Set",
      tier: "Starter",
      category: "Living Room",
      categoryKey: "living",
      audience: "Both",
      targetText: "Compact Studios & Flatshares",
      featured: false,
      tagline: "Sleek living room essentials that make small apartments feel airy and welcoming.",
      image: "package-starter-studio.webp",
      monthlyRates: {
        3: 2099,
        6: 1799,
        12: 1499
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "48 to 72 hours",
      shortDescription: "Two-seater cushioned sofa, nesting coffee table pair, slim TV console, and warm ambient floor lamp.",
      includedItems: [
        { name: "Modena 2-Seater Fabric Sofa", qty: 1, specs: "Dense foam core, water-repellent grey tweed fabric" },
        { name: "Dual Nesting Round Coffee Tables", qty: 2, specs: "Oak top with black hairpin legs, space-saving tuck" },
        { name: "Slimline 42-inch Media Console", qty: 1, specs: "Cable management ports with soft-close sliding doors" },
        { name: "Arc Ambient Metal Floor Lamp", qty: 1, specs: "Matte black finish with warm LED bulb included" }
      ],
      highlights: [
        "High-resilience foam retaining shape across years",
        "Tuck-away nesting tables to maximize floor space",
        "Easy-clean textured performance upholstery",
        "Swap to a larger sofa whenever you relocate"
      ],
      roomFit: "Ideal for living zones 100 - 160 sq.ft",
      packageSpecs: {
        totalPieces: 5,
        finish: "Heather Slate Fabric & Natural Ash",
        assemblyRequirement: "Delivered & assembled in ~35 mins",
        maintenanceCover: "Accidental spill coverage included"
      }
    },
    {
      id: "starter-wfh-pod",
      name: "Compact WFH Workstation",
      tier: "Starter",
      category: "Workspace",
      categoryKey: "workspace",
      audience: "Working Professional",
      targetText: "Remote Workers & Hybrid Teams",
      featured: false,
      tagline: "Ergonomically certified workspace bundle keeping you productive and strain-free.",
      image: "category-workspace.webp",
      monthlyRates: {
        3: 1549,
        6: 1299,
        12: 1049
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "48 hours",
      shortDescription: "Clean writing desk, ergonomic adjustable office chair, locking mobile drawer pedestal, and task light.",
      includedItems: [
        { name: "Urban Minimalist Work Desk", qty: 1, specs: "120 x 60 cm, heavy-gauge steel legs, cable channel" },
        { name: "AeroPro Ergonomic Task Chair", qty: 1, specs: "2D lumbar cushion, 3D adjustable armrests, mesh back" },
        { name: "Underdesk Lockable 2-Drawer Pedestal", qty: 1, specs: "Silent ball-bearing glides with keyed master lock" },
        { name: "Directional LED Desk Lamp", qty: 1, specs: "3 color temperatures, dimmer touch slider" }
      ],
      highlights: [
        "Certified 8+ hour continuous posture support",
        "Tangle-free cord organizers & underdesk tray",
        "Sturdy wobble-free steel frame construction",
        "Simple monthly tenure extension"
      ],
      roomFit: "Fits into any bedroom corner or hallway nook (40+ sq.ft)",
      packageSpecs: {
        totalPieces: 4,
        finish: "Matte White & Chrome Graphite",
        assemblyRequirement: "Ready to work within 20 mins",
        maintenanceCover: "Hydraulic gas lift & caster replacement warranty"
      }
    },
    {
      id: "essential-1bhk-combo",
      name: "Essential 1BHK Full Apartment",
      tier: "Essential",
      category: "Full Apartment",
      categoryKey: "apartment",
      audience: "Both",
      targetText: "Young Couples & Solo Professionals",
      featured: true,
      tagline: "The complete move-in suite. Bedroom, living lounge, and compact dining in one seamless bundle.",
      image: "package-essential-1bhk.webp",
      monthlyRates: {
        3: 4599,
        6: 3999,
        12: 3499
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "72 hours",
      shortDescription: "Queen bed + orthopaedic mattress, 3-seater living room sofa, dining table with 2 chairs, coffee table, and bedside unit.",
      includedItems: [
        { name: "Stockholm Queen Platform Bed", qty: 1, specs: "60 x 78 in, engineered teak with cushioned headboard" },
        { name: "7-Zone Ortho Spring Mattress", qty: 1, specs: "6-inch pocket spring with cooling memory foam layer" },
        { name: "Stockholm Bedside Storage Table", qty: 1, specs: "Single drawer with open storage cubby" },
        { name: "Copenhagen 3-Seater Fabric Sofa", qty: 1, specs: "Wide track arms, durable oat-linen weave" },
        { name: "Solid Wood Oval Coffee Table", qty: 1, specs: "Rounded child-safe bevel edges, walnut tone" },
        { name: "Compact 2-Seater Dining Bistro Table", qty: 1, specs: "75 x 75 cm square bistro table with solid birch legs" },
        { name: "Molded Scandinavian Dining Chairs", qty: 2, specs: "Ergonomic polypropylene shell with padded seat pad" }
      ],
      highlights: [
        "Everything needed to transform an empty 1BHK overnight",
        "Saves over ₹1,20,000 compared to purchasing brand new furniture",
        "Harmonious neutral palette matching any rental apartment paint",
        "Complimentary moving assistance on 12-month renewals"
      ],
      roomFit: "Recommended for 1BHK apartments (450 - 750 sq.ft)",
      packageSpecs: {
        totalPieces: 8,
        finish: "Warm Walnut, Oat-Linen, and Powder Black",
        assemblyRequirement: "Complete room-by-room white glove assembly",
        maintenanceCover: "Full comprehensive bundle coverage"
      }
    },
    {
      id: "essential-bedroom-suite",
      name: "Essential Bedroom Sanctuary",
      tier: "Essential",
      category: "Bedroom",
      categoryKey: "bedroom",
      audience: "Both",
      targetText: "Professionals & Relocating Couples",
      featured: false,
      tagline: "Restful luxury without the capital expense: queen bed, premium mattress, dual nightstands, and 2-door wardrobe.",
      image: "category-bedroom.webp",
      monthlyRates: {
        3: 2799,
        6: 2399,
        12: 1999
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "48 hours",
      shortDescription: "Solid engineered queen bed, 6-inch orthopedic mattress, dual matching nightstands, and a 2-door wardrobe with vanity mirror.",
      includedItems: [
        { name: "Aura Queen Engineered Wood Bed", qty: 1, specs: "Sturdy slatted platform, noise-dampening joinery" },
        { name: "Royal Spine-Care 6-inch Mattress", qty: 1, specs: "High-density bonded foam with breathable cotton jacquard" },
        { name: "Aura Matching Nightstands", qty: 2, specs: "Soft-close drawer and lower storage compartment" },
        { name: "Aura 2-Door Wardrobe with Mirror", qty: 1, specs: "Full hanging rod, 3 internal shelves, security locker" }
      ],
      highlights: [
        "Zero-creak tested frame joinery for peaceful sleep",
        "Spacious wardrobe organization designed for city professionals",
        "Antimicrobial treated fabric mattress covers",
        "Swap bed styles easily when extending your tenure"
      ],
      roomFit: "Ideal for master bedrooms 120 - 200 sq.ft",
      packageSpecs: {
        totalPieces: 5,
        finish: "Natural Teak & Matte Sandstone",
        assemblyRequirement: "Full bed & wardrobe assembly included",
        maintenanceCover: "Mattress sanitization check every 6 months"
      }
    },
    {
      id: "essential-pro-workspace",
      name: "Essential Professional Suite",
      tier: "Essential",
      category: "Workspace",
      categoryKey: "workspace",
      audience: "Working Professional",
      targetText: "Engineers, Consultants & Creators",
      featured: false,
      tagline: "Premium productivity setup: solid hardwood desk, high-performance chair, and open architecture shelving.",
      image: "office-desk.webp",
      monthlyRates: {
        3: 2199,
        6: 1849,
        12: 1499
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "48 hours",
      shortDescription: "140cm solid oak desk, multi-point ergonomic chair, 4-tier architectural bookcase, and wireless charging mat.",
      includedItems: [
        { name: "Solid Oak 140cm Executive Desk", qty: 1, specs: "Beveled edge, dual monitor weight rated, cable tray" },
        { name: "Verve High-Back Ergonomic Chair", qty: 1, specs: "Dynamic synchronous recline, 4D armrests, headrest" },
        { name: "Verve 4-Tier Open Metal Bookshelf", qty: 1, specs: "Heavy duty steel frame, 40kg per shelf weight capacity" },
        { name: "Desk Companion Mobile File Drawer", qty: 1, specs: "Anti-tip caster, letter & A4 file hanging rails" }
      ],
      highlights: [
        "Ample space for dual 27-inch monitors and desktop speakers",
        "High-back ergonomic lumbar support with breathable Korean mesh",
        "Modular shelving adaptable to books, plants, and awards",
        "Includes surge-protected underdesk power mount"
      ],
      roomFit: "Requires dedicated space 70 - 120 sq.ft",
      packageSpecs: {
        totalPieces: 4,
        finish: "Smoked Oak & Gunmetal Grey",
        assemblyRequirement: "Precision leveled assembly",
        maintenanceCover: "Lifetime mechanical chair part replacement"
      }
    },
    {
      id: "premium-2bhk-executive",
      name: "Premium 2BHK Executive Residence",
      tier: "Premium",
      category: "Full Apartment",
      categoryKey: "apartment",
      audience: "Working Professional",
      targetText: "Corporate Relocations & Executive Flats",
      featured: true,
      tagline: "Sophisticated full-home furnishing with high-end designer pieces for both bedrooms, living, and dining.",
      image: "package-premium-2bhk.webp",
      monthlyRates: {
        3: 7999,
        6: 6999,
        12: 5999
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "72 to 96 hours",
      shortDescription: "Master & guest bedroom suites, L-shaped fabric sectional sofa, 4-seater walnut dining suite, coffee table, and media unit.",
      includedItems: [
        { name: "King Size Heritage Bed & Mattress", qty: 1, specs: "72 x 78 in, padded boucle headboard, 8-inch pocket spring" },
        { name: "Queen Size Guest Bed & Mattress", qty: 1, specs: "60 x 78 in, solid wood base, orthopedic coir-foam" },
        { name: "L-Shaped Lounger Sectional Sofa", qty: 1, specs: "Right/left reversible chaise, stain-guarded fabric" },
        { name: "Solid Walnut 4-Seater Dining Table", qty: 1, specs: "140 x 85 cm solid timber top with chamfered edges" },
        { name: "Upholstered Dining Carver Chairs", qty: 4, specs: "Curved back support, linen-blend fabric upholstery" },
        { name: "Grand 55-inch Credenza Media Unit", qty: 1, specs: "Acoustic slat wooden front with concealed cord route" },
        { name: "Designer Fluted Coffee Table", qty: 1, specs: "Tempered fluted glass & matte brass accents" }
      ],
      highlights: [
        "Instant turnkey solution for luxury 2BHK rental apartments",
        "Includes dedicated personal interior styling consultation",
        "Priority swap privileges every 6 months at no extra charge",
        "Zero-hassle relocation pickup across all covered cities"
      ],
      roomFit: "Suited for 2BHK / 3BHK residences (900 - 1500 sq.ft)",
      packageSpecs: {
        totalPieces: 10,
        finish: "Smoked Walnut, Boucle, and Brushed Brass",
        assemblyRequirement: "Senior technician installation & room staging",
        maintenanceCover: "VIP zero-deductible damage & stain cover"
      }
    },
    {
      id: "premium-living-lounge",
      name: "Premium Designer Living Lounge",
      tier: "Premium",
      category: "Living Room",
      categoryKey: "living",
      audience: "Both",
      targetText: "Design Enthusiasts & Entertaining",
      featured: false,
      tagline: "Showstopping living room set with deep sectional seating, sculptural lighting, and artisanal coffee table.",
      image: "package-premium-living.webp",
      monthlyRates: {
        3: 3999,
        6: 3499,
        12: 2999
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "48 hours",
      shortDescription: "Deep 3-piece modular sectional, solid walnut organic coffee table, accent club chair, and architectural floor lamp.",
      includedItems: [
        { name: "Komorebi 3-Piece Deep Sectional", qty: 1, specs: "Feather-down blend wrap, charcoal woven textural fabric" },
        { name: "Sculptural Organic Walnut Coffee Table", qty: 1, specs: "Freeform solid wood surface with pillared timber base" },
        { name: "Mid-Century Modern Velvet Club Chair", qty: 1, specs: "Mustard gold velvet, solid brass ferrule tapered legs" },
        { name: "Minimalist Brass Arc Floor Lamp", qty: 1, specs: "Weighted marble base, warm dimmable illumination" }
      ],
      highlights: [
        "Deep seating configured for generous relaxation & entertaining",
        "Artisanal timber finishes that elevate apartment interiors",
        "Commercial-grade double rub count fabric durability",
        "Complimentary professional upholstery shampooing every 6 months"
      ],
      roomFit: "Best for living spaces 180 - 300 sq.ft",
      packageSpecs: {
        totalPieces: 4,
        finish: "Charcoal Weave, Solid Walnut & Brushed Brass",
        assemblyRequirement: "White glove placement with anti-floor-scuff pads",
        maintenanceCover: "Full stain & fabric warranty included"
      }
    },
    {
      id: "premium-executive-suite",
      name: "Presidential Home Office Suite",
      tier: "Premium",
      category: "Workspace",
      categoryKey: "workspace",
      audience: "Working Professional",
      targetText: "Executives, Founders & Senior Leaders",
      featured: false,
      tagline: "The pinnacle of remote executive presence: 160cm walnut desk, genuine leather chair, and credenza.",
      image: "office-desk.webp",
      monthlyRates: {
        3: 3499,
        6: 2999,
        12: 2499
      },
      depositMultiplier: 1.5,
      deliveryFee: 0,
      assemblyFee: 0,
      deliveryTimeline: "48 hours",
      shortDescription: "160cm executive desk, genuine bonded leather ergonomic chair, matching lateral filing credenza, and accent guest chair.",
      includedItems: [
        { name: "The Sovereign 160cm Executive Desk", qty: 1, specs: "Walnut burl inlay, built-in leather desk blotter pad" },
        { name: "Grand Executive High-Back Chair", qty: 1, specs: "Top-grain leather, polished aluminum frame, pneumatic tilt" },
        { name: "Matching 3-Door Storage Credenza", qty: 1, specs: "Adjustable internal shelving with soft-close hinges" },
        { name: "Executive Visitor Lounge Chair", qty: 1, specs: "Curved walnut shell with matching leather cushion" }
      ],
      highlights: [
        "Uncompromising professional aesthetic for executive video calls",
        "Concealed cable trays accommodating docking stations & monitors",
        "Lockable security drawers for confidential papers",
        "Upgrade or swap components anytime as your setup evolves"
      ],
      roomFit: "Requires dedicated office room 100 - 180 sq.ft",
      packageSpecs: {
        totalPieces: 4,
        finish: "Hand-finished Walnut, Cognac Leather, Polished Alloy",
        assemblyRequirement: "White-glove assembly with precision leveling",
        maintenanceCover: "Leather conditioning & mechanism protection"
      }
    }
  ];

  const ROOM_CATEGORIES = [
    { key: "all", name: "All Packages", count: 9, icon: "grid" },
    { key: "bedroom", name: "Bedroom", count: 2, icon: "bed", image: "category-bedroom.webp" },
    { key: "living", name: "Living Room", count: 2, icon: "sofa", image: "category-living.webp" },
    { key: "workspace", name: "Workspace / WFH", count: 3, icon: "desk", image: "category-workspace.webp" },
    { key: "apartment", name: "Full Apartment", count: 2, icon: "home", image: "category-studio.webp" }
  ];

  // Coverage dataset for Indian metros (clearly labeled demo dataset per client instructions)
  const COVERAGE_CITIES = [
    {
      id: "hyderabad",
      name: "Hyderabad",
      state: "Telangana",
      status: "Active Delivery",
      hubs: ["Madhapur Hub", "Gachibowli Logistics Center", "Kukatpally Depot"],
      avgDeliveryDays: "2 Business Days",
      samplePins: [
        { pin: "500081", area: "Madhapur / HITEC City", status: "Supported", note: "Standard 48-hr delivery & assembly available" },
        { pin: "500032", area: "Gachibowli / Financial Dist", status: "Supported", note: "Same-week delivery with white-glove setup" },
        { pin: "500084", area: "Kondapur", status: "Supported", note: "Standard 48-hr delivery" },
        { pin: "500034", area: "Banjara Hills", status: "Supported", note: "Next-day slot availability on select packages" },
        { pin: "500072", area: "KPHB Colony / Kukatpally", status: "Supported", note: "Standard 48-hr delivery" },
        { pin: "500008", area: "Mehdipatnam", status: "Supported", note: "Weekly scheduled route delivery" },
        { pin: "500019", area: "Lingampally / BHEL", status: "Needs Confirmation", note: "Extended zone: elevator clearance check needed" },
        { pin: "500001", area: "Old City / Charminar", status: "Needs Confirmation", note: "Narrow street access verification required" }
      ]
    },
    {
      id: "bengaluru",
      name: "Bengaluru",
      state: "Karnataka",
      status: "Active Delivery",
      hubs: ["Koramangala Fulfillment", "Whitefield Hub", "Hebbal Depot"],
      avgDeliveryDays: "2 to 3 Business Days",
      samplePins: [
        { pin: "560100", area: "Electronic City Phase 1", status: "Supported", note: "Active daily fleet operations" },
        { pin: "560102", area: "HSR Layout", status: "Supported", note: "Express 48-hr setup available" },
        { pin: "560037", area: "Marathahalli", status: "Supported", note: "Standard delivery schedule" },
        { pin: "560066", area: "Whitefield", status: "Supported", note: "Full technician assembly coverage" },
        { pin: "560034", area: "Koramangala", status: "Supported", note: "Daily route coverage" },
        { pin: "560029", area: "BTM Layout", status: "Supported", note: "Standard delivery schedule" },
        { pin: "560001", area: "MG Road / Central", status: "Supported", note: "Building delivery window booking required" },
        { pin: "560095", area: "Kaverappa Layout", status: "Needs Confirmation", note: "Truck parking verification required" }
      ]
    },
    {
      id: "pune",
      name: "Pune",
      state: "Maharashtra",
      status: "Active Delivery",
      hubs: ["Hinjawadi Tech Center", "Viman Nagar Depot"],
      avgDeliveryDays: "2 to 3 Business Days",
      samplePins: [
        { pin: "411057", area: "Hinjawadi Phase 1 & 2", status: "Supported", note: "High student & tech professional priority lane" },
        { pin: "411045", area: "Baner", status: "Supported", note: "Standard 48-hr delivery" },
        { pin: "411014", area: "Viman Nagar", status: "Supported", note: "Standard 48-hr delivery" },
        { pin: "411028", area: "Hadapsar / Magarpatta", status: "Supported", note: "Standard delivery coverage" },
        { pin: "411001", area: "Pune Station / Camp", status: "Needs Confirmation", note: "Old building stairwell review required" }
      ]
    },
    {
      id: "chennai",
      name: "Chennai",
      state: "Tamil Nadu",
      status: "Active Delivery",
      hubs: ["OMR Logistics Hub", "Guindy Depot"],
      avgDeliveryDays: "3 Business Days",
      samplePins: [
        { pin: "600096", area: "Perungudi / OMR", status: "Supported", note: "Active daily route coverage" },
        { pin: "600113", area: "Taramani / Ascendas", status: "Supported", note: "Standard delivery" },
        { pin: "600028", area: "R.A. Puram", status: "Supported", note: "Standard delivery" },
        { pin: "600040", area: "Anna Nagar", status: "Supported", note: "Scheduled delivery" }
      ]
    },
    {
      id: "mumbai",
      name: "Mumbai",
      state: "Maharashtra",
      status: "Active Delivery",
      hubs: ["Bandra Kurla Center", "Andheri East Logistics"],
      avgDeliveryDays: "2 to 3 Business Days",
      samplePins: [
        { pin: "400051", area: "BKC / Bandra East", status: "Supported", note: "Service lift coordination required" },
        { pin: "400076", area: "Powai", status: "Supported", note: "Daily route coverage for students & professionals" },
        { pin: "400069", area: "Andheri East", status: "Supported", note: "Standard 48-hr delivery" },
        { pin: "400053", area: "Andheri West", status: "Supported", note: "Standard delivery" }
      ]
    }
  ];

  // Default Seed Customer Profile & Active Rentals for demonstration
  const SEED_CUSTOMER = {
    id: "usr_alex_chen",
    name: "Alex Chen",
    email: "alex.chen@nestloop.demo",
    phone: "+91 98765 43210",
    role: "Working Professional",
    city: "Bengaluru",
    address: "Apt 402, Oakwood Residences, HSR Layout Sector 2, Bengaluru 560102",
    avatar: "AC",
    memberSince: "November 2025",
    rentals: [
      {
        rentalId: "NL-7821",
        packageId: "starter-studio-living",
        packageName: "Starter Studio Living Set",
        category: "Living Room",
        image: "package-starter-studio.webp",
        tenureMonths: 6,
        monthlyRate: 1799,
        depositPaid: 2699,
        startDate: "2026-06-15",
        endDate: "2026-12-15",
        nextDueDate: "2026-10-15",
        status: "Active",
        agreementNumber: "AGR-2026-NL7821",
        itemsSummary: "2-Seater Sofa, Dual Nesting Coffee Tables, TV Console, Arc Lamp",
        paymentMethod: "HDFC Auto-Debit (Demo **** 4112)"
      },
      {
        rentalId: "NL-8452",
        packageId: "essential-pro-workspace",
        packageName: "Essential Professional Suite",
        category: "Workspace",
        image: "office-desk.webp",
        tenureMonths: 12,
        monthlyRate: 1499,
        depositPaid: 2249,
        startDate: "2026-02-01",
        endDate: "2027-02-01",
        nextDueDate: "2026-10-15",
        status: "Active",
        agreementNumber: "AGR-2026-NL8452",
        itemsSummary: "Solid Oak 140cm Desk, Verve Ergonomic Chair, 4-Tier Bookshelf, File Drawer",
        paymentMethod: "ICICI Corporate Card (Demo **** 8920)"
      }
    ],
    billingHistory: [
      {
        invoiceId: "INV-2026-0915",
        date: "2026-09-15",
        period: "15 Sep 2026 – 14 Oct 2026",
        amount: 3298,
        status: "Paid",
        method: "Auto-Debit (Demo)",
        items: [
          { description: "Monthly Rental: Starter Studio Living Set (NL-7821)", amount: 1799 },
          { description: "Monthly Rental: Essential Professional Suite (NL-8452)", amount: 1499 }
        ]
      },
      {
        invoiceId: "INV-2026-0815",
        date: "2026-08-15",
        period: "15 Aug 2026 – 14 Sep 2026",
        amount: 3298,
        status: "Paid",
        method: "Auto-Debit (Demo)",
        items: [
          { description: "Monthly Rental: Starter Studio Living Set (NL-7821)", amount: 1799 },
          { description: "Monthly Rental: Essential Professional Suite (NL-8452)", amount: 1499 }
        ]
      },
      {
        invoiceId: "INV-2026-0715",
        date: "2026-07-15",
        period: "15 Jul 2026 – 14 Aug 2026",
        amount: 3298,
        status: "Paid",
        method: "Auto-Debit (Demo)",
        items: [
          { description: "Monthly Rental: Starter Studio Living Set (NL-7821)", amount: 1799 },
          { description: "Monthly Rental: Essential Professional Suite (NL-8452)", amount: 1499 }
        ]
      }
    ],
    requests: [
      {
        requestId: "REQ-SWAP-3091",
        type: "Swap Request",
        rentalId: "NL-7821",
        rentalName: "Starter Studio Living Set",
        requestedItem: "Komorebi 3-Piece Deep Sectional (Upgrade)",
        reason: "Relocating to larger living room",
        preferredDate: "2026-10-22",
        submittedAt: "2026-10-02",
        status: "Pending Review",
        notes: "Elevator access available in new building."
      }
    ]
  };

  // Local Storage Management & State Initialization
  const STORAGE_KEY = "nestloop_demo_session_v1";

  function getDemoState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Self-heal known outdated seed date inconsistency while strictly preserving user modifications
        if (parsed && Array.isArray(parsed.rentals)) {
          let updated = false;
          parsed.rentals.forEach(r => {
            if (r.rentalId === 'NL-7821' && r.endDate === '2026-06-15' && r.nextDueDate === '2026-10-15') {
              r.startDate = '2026-06-15';
              r.endDate = '2026-12-15';
              r.agreementNumber = 'AGR-2026-NL7821';
              updated = true;
            }
          });
          if (updated) {
            saveDemoState(parsed);
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not read localStorage for NESTLOOP demo:", e);
    }
    // Initialize fresh seed copy
    const initial = JSON.parse(JSON.stringify(SEED_CUSTOMER));
    saveDemoState(initial);
    return initial;
  }

  function saveDemoState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save localStorage for NESTLOOP demo:", e);
    }
  }

  function resetDemoState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const initial = JSON.parse(JSON.stringify(SEED_CUSTOMER));
      saveDemoState(initial);
      return initial;
    } catch (e) {
      console.error("Error resetting demo state:", e);
      return SEED_CUSTOMER;
    }
  }

  // Lookup helper by ID
  function getPackageById(id) {
    return PACKAGES.find(p => p.id === id) || PACKAGES[0];
  }

  // Calculate upfront cost
  function calculateCost(pkg, tenureMonths) {
    const tenure = Number(tenureMonths) || 12;
    const monthlyRate = pkg.monthlyRates[tenure] || pkg.monthlyRates[12];
    const deposit = Math.round(monthlyRate * (pkg.depositMultiplier || 1.5));
    const delivery = pkg.deliveryFee || 0;
    const assembly = pkg.assemblyFee || 0;
    const totalFirstMonth = monthlyRate + deposit + delivery + assembly;

    return {
      tenure,
      monthlyRate,
      deposit,
      delivery,
      assembly,
      totalFirstMonth,
      totalContractValue: monthlyRate * tenure
    };
  }

  // Check pin coverage
  function checkPinCode(pinInput) {
    const cleanPin = String(pinInput).trim();
    if (!cleanPin || cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      return {
        status: "invalid",
        message: "Please enter a valid 6-digit postal code (PIN)."
      };
    }

    // Check cities
    for (const city of COVERAGE_CITIES) {
      const match = city.samplePins.find(p => p.pin === cleanPin);
      if (match) {
        return {
          status: match.status === "Supported" ? "supported" : "needs_confirmation",
          pin: cleanPin,
          city: city.name,
          area: match.area,
          note: match.note,
          timeline: city.avgDeliveryDays,
          hubs: city.hubs
        };
      }
    }

    // Deterministic demo rule for unknown PINs:
    // If it starts with known metro prefixes (50, 56, 41, 60, 40)
    const prefix = cleanPin.substring(0, 2);
    const prefixMap = {
      "50": "Hyderabad Greater Area",
      "56": "Bengaluru Metro Area",
      "41": "Pune Region",
      "60": "Chennai Region",
      "40": "Mumbai Metropolitan"
    };

    if (prefixMap[prefix]) {
      return {
        status: "needs_confirmation",
        pin: cleanPin,
        city: prefixMap[prefix],
        area: "Peripheral Zone / Developing Hub",
        note: "Serviceable upon technician route verification. Confirmation provided within 4 hours.",
        timeline: "3 to 4 Business Days"
      };
    }

    return {
      status: "unavailable",
      pin: cleanPin,
      message: `PIN code ${cleanPin} is currently outside our regular active delivery corridors. You may submit an expansion request below.`
    };
  }

  return {
    PACKAGES,
    ROOM_CATEGORIES,
    COVERAGE_CITIES,
    SEED_CUSTOMER,
    getDemoState,
    saveDemoState,
    resetDemoState,
    getPackageById,
    calculateCost,
    checkPinCode,
    getImagePath
  };
}));
