// Initial seed data for 7 Horse Ventures
// Flexible event architecture: 7 Horse Ventures, Collaborative, Partner / Community

export const INITIAL_EVENTS = [
  {
    id: "evt-01",
    title: "7H Founder Connect — Founders & Builders Roundtable",
    category: "Founder & Business Networking",
    type: "Founder Connect",
    organizerType: "7 Horse Ventures",
    format: "In-Person",
    partnerName: "",
    partnerLogo: "",
    date: "Saturday, April 18, 2026",
    time: "4:00 PM – 7:30 PM IST",
    location: "Cyber City, DLF Phase 2, Gurugram",
    city: "Gurugram",
    onlineDetails: "",
    registrationLink: "",
    status: "Upcoming",
    published: true,
    isFree: true,
    price: 0,
    originalPrice: 0,
    currency: "INR",
    offerText: "Curated Free Access with RSVP",
    ticketBadge: "Complimentary Founder Pass",
    capacity: "45 Founders",
    curationNote: "Curated cohort. Prior registration & profile review required.",
    description: "An intimate, high-signal gathering designed for tech and consumer founders. Structured introductions, focused peer roundtables on early traction & hiring, and candid opportunity exchange in a private boardroom environment.",
    agenda: [
      { time: "4:00 PM – 4:30 PM", item: "Guest Arrival & Welcome Coffee" },
      { time: "4:30 PM – 5:15 PM", item: "Roundtable: Navigating Market Realities & Traction" },
      { time: "5:15 PM – 6:15 PM", item: "Structured 1-on-1 Founder Introductions & Problem Exchange" },
      { time: "6:15 PM – 7:30 PM", item: "Open Collaboration Reception & Networking" },
    ],
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Early Stage", "Founder Roundtable", "In-Person"],
  },
  {
    id: "evt-02",
    title: "7H Pitch & Capital Connect — Early-Stage Showcase",
    category: "Startup Pitch & Capital Networking",
    type: "Pitch & Capital Connect",
    organizerType: "7 Horse Ventures",
    format: "In-Person",
    partnerName: "",
    partnerLogo: "",
    date: "Saturday, May 16, 2026",
    time: "2:30 PM – 6:30 PM IST",
    location: "Aerocity Hospitality District, New Delhi",
    city: "Delhi",
    onlineDetails: "",
    registrationLink: "",
    status: "Applications Open",
    published: true,
    isFree: false,
    price: 1499,
    originalPrice: 2999,
    currency: "INR",
    offerText: "Early Bird 50% Off (Showcase Pass)",
    ticketBadge: "Delegate Pass",
    capacity: "8 Presenting Startups • 30 Accredited Investors & Operators",
    curationNote: "Presentations by invitation following screening. No pitch fee required.",
    description: "A private presentation forum connecting 8 vetted seed & pre-Series A startups with active angel syndicates, institutional seed funds, and seasoned operators.",
    agenda: [
      { time: "2:30 PM – 3:00 PM", item: "Investor & Founder Registration" },
      { time: "3:00 PM – 4:45 PM", item: "Startup Presentations (7-min pitch + 5-min Q&A each)" },
      { time: "4:45 PM – 5:15 PM", item: "Ecosystem Panel: Capital Allocation Trends" },
      { time: "5:15 PM – 6:30 PM", item: "Private Breakout Conversations & High Tea" },
    ],
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    tags: ["Pitch Showcase", "Seed Capital", "In-Person"],
  },
  {
    id: "evt-03",
    title: "Founder Masterclass: Corporate, Legal & ESOP Structuring",
    category: "Professional Ecosystem",
    type: "Knowledge Session",
    organizerType: "Collaborative",
    format: "Online",
    partnerName: "Professional Advisory Circle",
    partnerLogo: "",
    date: "Wednesday, June 10, 2026",
    time: "5:30 PM – 8:00 PM IST",
    location: "Interactive Online Webinar",
    city: "Online",
    onlineDetails: "Interactive session hosted via Google Meet. Secure meeting access link sent upon RSVP confirmation.",
    registrationLink: "",
    status: "Upcoming",
    published: true,
    isFree: false,
    price: 499,
    originalPrice: 999,
    currency: "INR",
    offerText: "Limited Seats • 50% Discount",
    ticketBadge: "Masterclass Pass",
    capacity: "100 Founders",
    curationNote: "Open to seed-stage founders and finance leads.",
    description: "Practical compliance, ESOP structuring, GST insights, and governance essentials delivered by seasoned chartered accountants and legal practitioners who work with venture-backed startups.",
    agenda: [
      { time: "5:30 PM – 6:00 PM", item: "Online Welcome & Overview" },
      { time: "6:00 PM – 7:15 PM", item: "Deep-Dive Masterclass: ESOPs, Cross-Border IP & Compliance" },
      { time: "7:15 PM – 8:00 PM", item: "Direct Clinic: Open Q&A with Legal & Tax Partners" },
    ],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    tags: ["Online Masterclass", "Legal & Tax", "ESOPs"],
  },
  {
    id: "evt-04",
    title: "Cross-Border SaaS & Growth Roundtable",
    category: "Founder & Business Networking",
    type: "Founder Connect",
    organizerType: "Partner / Community",
    format: "Hybrid",
    partnerName: "Emerging Tech Circle",
    partnerLogo: "",
    date: "Saturday, March 7, 2026",
    time: "4:00 PM – 7:00 PM IST",
    location: "Expressway Tech Zone & Live Online Stream",
    city: "Noida / Online",
    onlineDetails: "Live stream access link provided to remote participants.",
    registrationLink: "",
    status: "Completed",
    published: true,
    isFree: true,
    price: 0,
    originalPrice: 0,
    currency: "INR",
    offerText: "Free Community Access",
    ticketBadge: "Archived Session",
    capacity: "40 In-Person & Remote Participants",
    curationNote: "Completed session. Summary insights shared with community.",
    description: "A focused builder session for SaaS, hardware, and D2C entrepreneurs discussing manufacturing partnerships, talent retention, and cross-border expansion.",
    agenda: [
      { time: "4:00 PM – 5:00 PM", item: "Introductions & Roundtable Kickoff" },
      { time: "5:00 PM – 6:30 PM", item: "Peer problem-solving on tech hiring and growth" },
      { time: "6:30 PM – 7:00 PM", item: "Wrap-up & community next steps" },
    ],
    image: "https://images.unsplash.com/photo-1522071823991-b9671e9d7fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["Hybrid Session", "SaaS & Growth", "Completed"],
  }
];

export const PARTNERSHIP_PACKAGES = [
  {
    name: "Supporting Partner",
    priceRange: "₹10,000 – ₹15,000",
    duration: "Per Event",
    bestFor: "Growing business services, boutique agencies, early-stage SaaS platforms looking to establish credibility with founders.",
    highlights: [
      "Brand recognition on event welcome displays & digital brochure",
      "Official acknowledgement during opening remarks",
      "1 VIP representative pass to the event",
      "Inclusion in post-event attendee recap email (opt-in)",
      "Social media mention across 7 Horse Ventures ecosystem channels"
    ],
    featured: false
  },
  {
    name: "Community Partner",
    priceRange: "₹25,000",
    duration: "Per Event",
    bestFor: "Coworking spaces, specialized advisory firms, cloud consultancies, and growth platforms targeting high-intent founders.",
    highlights: [
      "Prominent brand placement across registration page & all printed collaterals",
      "Dedicated 3-minute stage introduction / perspective sharing",
      "2 VIP passes for your leadership team",
      "Display table / branded materials in networking lounge",
      "Direct opt-in attendee connection for relevant collaborative inquiries",
      "Dedicated featured spotlight in community newsletter"
    ],
    featured: true
  },
  {
    name: "Powered By Partner",
    priceRange: "₹40,000 – ₹50,000",
    duration: "Per Event",
    bestFor: "Established cloud infrastructure providers, fintech & banking institutions, and premier ecosystem enablers.",
    highlights: [
      "Title naming rights: '[Event Name] Powered by [Your Brand]'",
      "Keynote speaking or panel moderation slot (15 mins)",
      "4 VIP all-access passes for executives and portfolio guests",
      "Exclusive branding on main stage backdrop & badge lanyards",
      "Custom co-branded masterclass or fireside session",
      "Direct opt-in follow-up and curated 1-on-1 introductions"
    ],
    featured: false
  },
  {
    name: "Quarterly Ecosystem Partner",
    priceRange: "₹75,000 – ₹1,00,000",
    duration: "Quarterly (3 Months)",
    bestFor: "Strategic corporate partners, enterprise tech giants, and financial institutions seeking long-term integration.",
    highlights: [
      "Consistent presence across all 7 Horse Ventures events for 3 full months",
      "Co-branded content & ecosystem whitepaper collaboration",
      "Direct channel to present corporate perks, credits, or pilot programs to members",
      "Dedicated partner landing page section on the 7 Horse Ventures website",
      "Quarterly private dinner with curated top founders & ecosystem leaders",
      "First right of refusal for flagship regional summits"
    ],
    featured: false
  }
];

export const WHO_WE_BRING_TOGETHER = [
  {
    id: "founders",
    title: "Founders & Entrepreneurs",
    subtitle: "Builders & Visionaries",
    description: "Meet other builders navigating the messy middle, exchange raw operational experiences, find co-founders or mentors, and discover real business opportunities across our ecosystem.",
    icon: "Rocket",
    badge: "Core Community"
  },
  {
    id: "investors",
    title: "Investors & Syndicates",
    subtitle: "Angels, VCs & Operators",
    description: "Discover emerging, high-conviction businesses before they hit mainstream radar, interact directly with founders in high-signal settings, and contribute strategic guidance.",
    icon: "TrendingUp",
    badge: "Capital Ecosystem"
  },
  {
    id: "startups",
    title: "Startups & Scaleups",
    subtitle: "Early & Growth Stages",
    description: "Gain focused visibility, receive honest and constructive feedback from market practitioners, unlock partnerships, and access critical early-stage resources.",
    icon: "Zap",
    badge: "Growth Engine"
  },
  {
    id: "students",
    title: "Students & Aspiring Founders",
    subtitle: "Next Generation Builders",
    description: "Step into India's entrepreneurial arena before graduating. Learn directly from active founders, gain internships, and test early venture concepts.",
    icon: "GraduationCap",
    badge: "Next Generation"
  },
  {
    id: "professionals",
    title: "Professionals & Domain Experts",
    subtitle: "Legal, Finance, Tech & HR",
    description: "Connect with high-growth companies that need trusted expertise across corporate law, taxation, tech architecture, product strategy, and executive search.",
    icon: "Briefcase",
    badge: "Advisory Network"
  },
  {
    id: "corporates",
    title: "Corporates & Tech Partners",
    subtitle: "Enterprise & Platforms",
    description: "Engage with India's entrepreneurial ecosystem through strategic partnerships, startup credit programs, technical workshops, and direct innovation initiatives.",
    icon: "Building2",
    badge: "Strategic Partners"
  }
];

export const FIVE_PILLARS = [
  {
    number: "01",
    id: "founder-connect",
    title: "7H Founder Connect",
    subtitle: "High-Signal Founder & Business Networking",
    summary: "Curated in-person gatherings designed to cut through superficial small talk and create genuine peer relationships, operational vulnerability, and collaborative business outcomes.",
    whatItIs: "An intentionally designed offline environment for founders, business owners, and aspiring entrepreneurs to meet, share hard lessons, and unlock synergies.",
    whoItServes: "Early-stage founders, growth-stage operators, SME business owners, and select domain experts.",
    whatToExpect: "Pre-screened guest lists, no pitch-fests or sales spam, structured roundtables, intimate group sizes (30-50 people), and meaningful follow-up accountability.",
    howToParticipate: "Register interest online. Each cohort is curated based on stage and industry relevance to ensure mutual value for every participant.",
    ctaText: "Explore Founder Connect",
    ctaLink: "/founder-connect",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
  },
  {
    number: "02",
    id: "pitch-capital",
    title: "7H Pitch & Capital Connect",
    subtitle: "Transparent Startup Presentation Platform",
    summary: "A private presentation forum where pre-screened startups present to active angel investors, family offices, and seed fund representatives with complete ethical transparency.",
    whatItIs: "A platform bridging rigorous Indian startups with capital providers through focused presentations, structured Q&A, and direct feedback.",
    whoItServes: "Seed to pre-Series A startups seeking institutional or angel capital, alongside qualified angel investors and VC operators.",
    whatToExpect: "Objective screening by our ecosystem panel, confidential pitch deck handling, 7-minute presentations, constructive investor critiques, and direct follow-ups.",
    howToParticipate: "Startups apply with their deck and metrics. Investors register for accredited access. No hidden presentation fees.",
    ctaText: "Explore Pitch & Capital",
    ctaLink: "/pitch-capital-connect",
    image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    number: "03",
    id: "professional-ecosystem",
    title: "7H Professional Ecosystem",
    subtitle: "Knowledge, Advisory & Corporate Infrastructure",
    summary: "Connecting high-growth startups with vetted professionals across chartered accountancy, corporate legal counsel, IP, compliance, and talent advisory.",
    whatItIs: "A curated advisory network enabling founders to access fractional or retained professional expertise without navigating unreliable agency markets.",
    whoItServes: "Startups requiring reliable compliance, legal structuring, ESOP pools, financial modeling, or technology auditing.",
    whatToExpect: "Masterclasses, 1-on-1 diagnostic clinics, practical compliance checklists, and introductions to verified boutique firms.",
    howToParticipate: "Professionals can apply to join our advisory roster. Founders can request ecosystem referrals through our member portal.",
    ctaText: "View Ecosystem Directory",
    ctaLink: "/ecosystem",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    number: "04",
    id: "corporate-partnerships",
    title: "7H Corporate & Tech Partnerships",
    subtitle: "Enterprise Collaboration & Technology Enablement",
    summary: "Bridging large corporate enterprises, cloud hyper-scalers, banks, and coworking leaders directly into India's emerging founder base.",
    whatItIs: "A collaborative gateway for corporate leaders wanting authentic touchpoints with startups through sponsorships, pilot trials, and educational workshops.",
    whoItServes: "Technology providers, financial institutions, coworking chains, educational institutes, and corporate venture arms.",
    whatToExpect: "Indicative event packages, workshop hosting, targeted brand visibility among high-intent founders, and custom ecosystem initiatives.",
    howToParticipate: "Submit a partnership enquiry to receive our corporate collaboration deck and tailor an engagement plan.",
    ctaText: "Explore Partnerships",
    ctaLink: "/partnerships",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
  },
  {
    number: "05",
    id: "startup-growth",
    title: "7H Startup Growth Ecosystem",
    subtitle: "Long-Term Scaled Founder Enablement",
    summary: "Our progressive initiative focused on sustained founder education, cohort masterclasses, cross-city delegations, and incubation readiness.",
    whatItIs: "A structured, long-term roadmap that guides entrepreneurs from initial community entry to investment readiness and market scaling.",
    whoItServes: "Determined founders committed to building resilient, sustainable Indian enterprises for the long haul.",
    whatToExpect: "Playbooks on operational hiring, unit economics masterclasses, peer accountability groups, and future incubation opportunities.",
    howToParticipate: "Join as an active community member to qualify for upcoming closed-cohort growth programs as they launch.",
    ctaText: "Join the Community",
    ctaLink: "/community",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
  }
];

export const DIFFERENTIATORS = [
  {
    number: "01",
    title: "A Diverse, Multi-Disciplinary Community",
    description: "We do not isolate tech founders from the rest of the business world. We intentionally cross-pollinate SaaS builders with traditional SME leaders, D2C innovators, financial strategists, and corporate decision-makers."
  },
  {
    number: "02",
    title: "Curated, High-Signal Interactions",
    description: "Every gathering is capped, curated, and structured. We reject the generic 300-person auditorium where attendees merely exchange business cards that get forgotten the next morning."
  },
  {
    number: "03",
    title: "Grounded in Practical Reality",
    description: "Our initiatives directly address real business hurdles, vendor ecosystems, talent dynamics, and the operational realities of building enduring companies."
  },
  {
    number: "04",
    title: "Absolute Ethical Transparency",
    description: "No exaggerated promises of guaranteed funding, no fake claims of vetted unicorn deal-flow, and no hidden fees for startup pitches. We believe trust is the only sustainable foundation for venture ecosystems."
  },
  {
    number: "05",
    title: "A Long-Term Vision Beyond Individual Events",
    description: "Events are our catalyst, not our final destination. We are building persistent community circles, knowledge frameworks, and corporate conduits that compound value over years, not hours."
  }
];
