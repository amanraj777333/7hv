export const INITIAL_SEED_DATA = {
  // 1. Central Media Mapping System (stable identifiers)
  media_mappings: [
    {
      id: "mm-01",
      key: "home.hero.background",
      page: "Home",
      section: "Hero Section",
      role: "Hero Presentation Image",
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
      alt: "Founders and investors in executive discussion at 7 Horse Ventures",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-02",
      key: "home.introduction.image",
      page: "Home",
      section: "Introduction Split",
      role: "Boardroom Collaboration Image",
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      alt: "Founders collaborating in modern Indian tech hub",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-03",
      key: "home.founder_connect.image",
      page: "Home",
      section: "Flagship Experiences",
      role: "7H Founder Connect Showcase",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      alt: "Curated founder peer roundtable session",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-04",
      key: "home.pitch_connect.image",
      page: "Home",
      section: "Flagship Experiences",
      role: "7H Pitch & Capital Connect Showcase",
      url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
      alt: "Startup founder presenting before angel syndicates",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-05",
      key: "about.hero.image",
      page: "About Us",
      section: "Hero Section",
      role: "Vision Leadership Image",
      url: "https://images.unsplash.com/photo-1522071823991-b9671e9d7fbe?auto=format&fit=crop&w=1200&q=80",
      alt: "Diverse team of entrepreneurs in collaborative session",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-06",
      key: "events.hero.image",
      page: "Events",
      section: "Hero Banner",
      role: "Conference Hall Image",
      url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
      alt: "Ecosystem conference hall in Delhi NCR",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-07",
      key: "founder_connect.hero.image",
      page: "Founder Connect",
      section: "Hero Overview",
      role: "Roundtable Atmosphere",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      alt: "Founder roundtable gathering in Gurugram",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-08",
      key: "pitch_connect.hero.image",
      page: "Pitch & Capital Connect",
      section: "Hero Overview",
      role: "Pitch Presentation Image",
      url: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1200&q=80",
      alt: "Pitch stage in Aerocity, New Delhi",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-09",
      key: "partnerships.hero.image",
      page: "Partnerships",
      section: "Hero Overview",
      role: "Enterprise Partnership Image",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      alt: "Modern corporate tower representing enterprise partnerships",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-10",
      key: "community.hero.image",
      page: "Community",
      section: "Hero Overview",
      role: "Community Engagement Image",
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      alt: "Founder community members sharing perspectives",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-11",
      key: "blog.default_cover",
      page: "Blog & Insights",
      section: "Editorial Banner",
      role: "Default Article Cover",
      url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      alt: "Venture strategy and legal briefing documents",
      position: "center",
      fit: "cover",
      history: []
    },
    {
      id: "mm-12",
      key: "newsletter.header",
      page: "Newsletter",
      section: "7H Founder Brief",
      role: "Newsletter Masthead Cover",
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      alt: "Professional editorial business desk",
      position: "center",
      fit: "cover",
      history: []
    }
  ],

  // 2. Central Media Library Assets
  media: [
    {
      id: "med-01",
      filename: "executive-networking.jpg",
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
      title: "Founder Discussion Cyber City",
      alt: "Founders and investors in executive discussion",
      category: "Events",
      size: "248 KB",
      mimeType: "image/jpeg",
      createdAt: "2026-03-01T10:00:00.000Z",
      usages: ["home.hero.background"]
    },
    {
      id: "med-02",
      filename: "boardroom-collaboration.jpg",
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      title: "Boardroom Collaboration Session",
      alt: "Founders collaborating in modern tech office",
      category: "Office & Meetings",
      size: "310 KB",
      mimeType: "image/jpeg",
      createdAt: "2026-03-01T10:00:00.000Z",
      usages: ["home.introduction.image"]
    },
    {
      id: "med-03",
      filename: "pitch-stage-aerocity.jpg",
      url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
      title: "Aerocity Pitch Forum",
      alt: "Startup founder presenting before angel syndicates",
      category: "Pitch & Capital",
      size: "295 KB",
      mimeType: "image/jpeg",
      createdAt: "2026-03-01T10:00:00.000Z",
      usages: ["home.pitch_connect.image", "events.hero.image"]
    },
    {
      id: "med-04",
      filename: "cyber-city-towers.jpg",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      title: "Gurugram Cyber Hub Skyline",
      alt: "Modern architecture representing corporate partnerships",
      category: "Corporate",
      size: "412 KB",
      mimeType: "image/jpeg",
      createdAt: "2026-03-01T10:00:00.000Z",
      usages: ["partnerships.hero.image"]
    }
  ],

  // 3. Events CMS Roster
  events: [
    {
      id: "evt-01",
      slug: "founders-builders-roundtable",
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
      featured: true,
      isFree: true,
      price: 0,
      originalPrice: 0,
      currency: "INR",
      offerText: "Curated Free Access with RSVP",
      ticketBadge: "Complimentary Founder Pass",
      capacity: 45,
      registeredCount: 38,
      curationNote: "Curated cohort. Prior registration & profile review required.",
      description: "An intimate, high-signal gathering designed for tech and consumer founders. Structured introductions, focused peer roundtables on early traction & hiring, and candid opportunity exchange in a private boardroom environment.",
      agenda: [
        { time: "4:00 PM – 4:30 PM", item: "Guest Arrival & Welcome Coffee" },
        { time: "4:30 PM – 5:15 PM", item: "Roundtable: Navigating Market Realities & Traction" },
        { time: "5:15 PM – 6:15 PM", item: "Structured 1-on-1 Founder Introductions & Problem Exchange" },
        { time: "6:15 PM – 7:30 PM", item: "Open Collaboration Reception & Networking" }
      ],
      speakers: [
        { name: "Advisory Council", role: "Venture Partners & Operators", company: "7 Horse Ecosystem" }
      ],
      ticketTypes: [
        { name: "Curated Founder Pass", price: "Complimentary (Upon Review)", status: "Active" }
      ],
      sponsors: ["Supporting Ecosystem Partners"],
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
      tags: ["Early Stage", "Founder Roundtable", "In-Person"]
    },
    {
      id: "evt-02",
      slug: "q2-pitch-capital-showcase",
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
      featured: true,
      isFree: false,
      price: 1499,
      originalPrice: 2999,
      currency: "INR",
      offerText: "Early Bird 50% Off (Showcase Pass)",
      ticketBadge: "Delegate Pass",
      capacity: 38,
      registeredCount: 26,
      curationNote: "Presentations by invitation following committee screening. No pitch fee required.",
      description: "A private presentation forum connecting 8 vetted seed & pre-Series A startups with active angel syndicates, institutional seed funds, and seasoned operators.",
      agenda: [
        { time: "2:30 PM – 3:00 PM", item: "Investor & Founder Registration" },
        { time: "3:00 PM – 4:45 PM", item: "Startup Presentations (7-min pitch + 5-min Q&A each)" },
        { time: "4:45 PM – 5:15 PM", item: "Ecosystem Panel: Capital Allocation Trends in India" },
        { time: "5:15 PM – 6:30 PM", item: "Private Breakout Conversations & High Tea" }
      ],
      speakers: [
        { name: "Screening Board", role: "Investment Committee", company: "7 Horse Ventures" }
      ],
      ticketTypes: [
        { name: "Startup Presenter", price: "Selected by Committee (No Fee)", status: "Active" },
        { name: "Accredited Investor Guest", price: "By Invitation", status: "Active" }
      ],
      sponsors: ["Institutional Partners"],
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
      tags: ["Pitch Showcase", "Seed Capital", "In-Person"]
    },
    {
      id: "evt-03",
      slug: "corporate-tax-readiness-masterclass",
      title: "Founder Masterclass: Corporate, Legal & ESOP Structuring",
      category: "Professional Ecosystem",
      type: "Founder Workshops",
      organizerType: "Collaborative",
      format: "Online",
      partnerName: "Professional Advisory Circle",
      partnerLogo: "",
      date: "Wednesday, June 10, 2026",
      time: "5:30 PM – 8:00 PM IST",
      location: "Interactive Online Webinar",
      city: "Online",
      onlineDetails: "Interactive session hosted via Google Meet. Secure meeting link sent upon RSVP confirmation.",
      registrationLink: "",
      status: "Upcoming",
      published: true,
      featured: false,
      isFree: false,
      price: 499,
      originalPrice: 999,
      currency: "INR",
      offerText: "Limited Seats • 50% Discount",
      ticketBadge: "Masterclass Pass",
      capacity: 100,
      registeredCount: 42,
      curationNote: "Open to seed-stage founders and finance heads.",
      description: "Practical compliance, ESOP structuring, GST insights, and governance essentials delivered by seasoned chartered accountants and legal practitioners who work with venture-backed startups.",
      agenda: [
        { time: "5:30 PM – 6:00 PM", item: "Online Welcome & Overview" },
        { time: "6:00 PM – 7:15 PM", item: "Deep-Dive Masterclass: ESOPs, Cross-Border IP & Compliance" },
        { time: "7:15 PM – 8:00 PM", item: "Direct Clinic: Open Q&A with Legal & Tax Partners" }
      ],
      speakers: [
        { name: "Corporate Legal Partners", role: "Partner", company: "Senior Advisors" }
      ],
      ticketTypes: [
        { name: "Founder Workshop Seat", price: "Free RSVP (Members)", status: "Active" }
      ],
      sponsors: ["Legal & Compliance Enablers"],
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      tags: ["Online Masterclass", "Legal & Tax", "ESOPs"]
    },
    {
      id: "evt-04",
      slug: "cross-border-saas-growth-roundtable",
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
      featured: false,
      isFree: true,
      price: 0,
      originalPrice: 0,
      currency: "INR",
      offerText: "Free Community Access",
      ticketBadge: "Archived Session",
      capacity: 40,
      registeredCount: 34,
      curationNote: "Completed session. Summary insights shared with community.",
      description: "A focused builder session for SaaS, hardware, and D2C entrepreneurs discussing manufacturing partnerships, talent retention, and cross-border expansion.",
      agenda: [
        { time: "4:00 PM – 5:00 PM", item: "Introductions & Roundtable Kickoff" },
        { time: "5:00 PM – 6:30 PM", item: "Peer problem-solving on tech hiring and growth" },
        { time: "6:30 PM – 7:00 PM", item: "Wrap-up & community next steps" }
      ],
      speakers: [
        { name: "Community Lead", role: "Moderator", company: "Emerging Tech Circle" }
      ],
      ticketTypes: [
        { name: "Community Pass", price: "Archived", status: "Past" }
      ],
      sponsors: [],
      image: "https://images.unsplash.com/photo-1522071823991-b9671e9d7fbe?auto=format&fit=crop&w=1200&q=80",
      tags: ["Hybrid Session", "SaaS & Growth", "Completed"]
    }
  ],

  // 4. Registrations
  registrations: [
    {
      id: "reg-01",
      eventId: "evt-01",
      eventTitle: "7H Founder Connect — Delhi NCR Inaugural Cohort",
      name: "Rohit Malhotra",
      email: "rohit@logixtrack.in",
      phone: "+91 98110 44321",
      company: "LogixTrack Solutions",
      role: "Founder & CEO",
      linkedin: "https://linkedin.com/in/rohitm",
      passId: "7H-PASS-491023",
      checkedIn: false,
      createdAt: "2026-03-01T12:30:00.000Z"
    },
    {
      id: "reg-02",
      eventId: "evt-02",
      eventTitle: "7H Pitch & Capital Connect — Q2 Showcase",
      name: "Ananya Saxena",
      email: "ananya@finscale.io",
      phone: "+91 98711 88920",
      company: "FinScale Technologies",
      role: "Co-Founder",
      linkedin: "https://linkedin.com/in/ananyas",
      passId: "7H-PASS-882194",
      checkedIn: true,
      createdAt: "2026-03-02T14:15:00.000Z"
    }
  ],

  // 5. Blog, News & Founder Stories
  articles: [
    {
      id: "art-01",
      slug: "navigating-seed-rounds-delhi-ncr-2026",
      type: "blog",
      title: "Navigating Early Seed Rounds in Delhi NCR: Valuations, Dilution & Real Due Diligence",
      excerpt: "An unvarnished guide for North Indian founders on managing term sheets, cap table hygiene, and setting realistic milestones in today's disciplined venture market.",
      content: `The fundraising landscape in Delhi NCR has evolved markedly over the past twenty-four months. The era of loose capital allocations based merely on slides has yielded to rigorous evaluation of unit economics, founder velocity, and customer retention.

### 1. The Real Valuation Discipline
In Gurugram and Delhi, angel syndicates and micro-VC funds now prioritize customer willingness to pay from day one. Rather than demanding inflated early valuations that create brutal down-round risks at Series A, smart founders are opting for clean, realistic valuation caps on convertible notes or simple equity structures.

### 2. Cap Table Hygiene & ESOP Structuring
One of the most frequent hurdles observed by institutional seed investors is messy cap tables:
- Unbalanced co-founder equity splits with no vesting cliffs.
- Dilution exceeding 25% at pre-seed stages.
- Undefined ESOP pools that force dilutive re-allocations prior to institutional rounds.

Establishing a minimum 4-year vesting schedule with a 1-year cliff and reserving a clear 10–12% ESOP pool early signals institutional maturity.

### 3. High-Signal Founder Relationships
Ultimately, venture capital is an amplification tool, not a business model. Connecting with fellow builders who have weathered regional expansion in North India often provides more practical return on time than endless cold outreach.`,
      coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      category: "Venture Insights",
      tags: ["Fundraising", "Delhi NCR", "Cap Table", "Seed Capital"],
      author: {
        name: "Ecosystem Editorial Desk",
        role: "Research & Insights Lead",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      },
      readTime: "5 min read",
      published: true,
      scheduledAt: null,
      featured: true,
      views: 342,
      createdAt: "2026-03-01T09:00:00.000Z"
    },
    {
      id: "art-02",
      slug: "delhi-ncr-deeptech-manufacturing-corridor",
      type: "news",
      title: "Delhi NCR's Emerging DeepTech & Industrial Corridor: Noida & Gurugram Forge New Supply Hubs",
      excerpt: "How hardware, precision robotics, and electric mobility startups are leveraging Greater Noida manufacturing zones alongside Gurugram software talent.",
      content: `While Bangalore has historically dominated pure-play software, Delhi NCR is rapidly establishing an uncontested lead in hardware-enabled tech, logistics automation, and clean mobility.

With the proximity of Noida's electronics manufacturing clusters, Greater Noida's testing grounds, and Gurugram's concentration of enterprise commercial headquarters, builders in North India enjoy a unique structural advantage: they can design prototypes in the morning, inspect factory molds in the afternoon, and pitch enterprise clients in Cyber City by evening.`,
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      category: "Industry News",
      tags: ["Hardware", "Noida", "Manufacturing", "Supply Chain"],
      author: {
        name: "7 Horse Editorial Desk",
        role: "Technology Correspondent",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
      },
      readTime: "4 min read",
      published: true,
      scheduledAt: null,
      featured: true,
      views: 215,
      createdAt: "2026-03-02T11:00:00.000Z"
    },
    {
      id: "art-03",
      slug: "founder-story-zero-to-one-cyber-city",
      type: "founder-story",
      title: "Founder Story: From First Cold Call in Gurugram to 40 Enterprise Clients",
      excerpt: "A candid conversation with an NCR B2B software founder on surviving the first 18 months, hiring engineering talent, and building without vanity metrics.",
      content: `In our inaugural Founder Story feature, we sat down with a Gurugram-based founder who bootstrapped an enterprise workflow platform to 40 enterprise clients across India and Southeast Asia.

### The Myth of Overnight Inbound
"For the first nine months, no one was searching for our brand," the founder reflected. "Every single deal came from being in the room—attending closed-door founder roundtables, asking peers for direct introductions to procurement heads, and listening intently to why early trials were stalling."

### Culture and Hiring in Delhi NCR
Hiring in the NCR market demands transparent equity conversations and clear cultural boundaries. Founders who articulate a long-term roadmap rather than flashing short-term funding headlines attract engineers with genuine ownership mindsets.`,
      coverImage: "https://images.unsplash.com/photo-1522071823991-b9671e9d7fbe?auto=format&fit=crop&w=1200&q=80",
      category: "Founder Spotlight",
      tags: ["Founder Journey", "B2B", "Gurugram", "Bootstrapping"],
      author: {
        name: "Community Story Desk",
        role: "Interviews Editor",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
      },
      readTime: "6 min read",
      published: true,
      scheduledAt: null,
      featured: true,
      views: 489,
      createdAt: "2026-03-03T14:30:00.000Z"
    }
  ],

  // 6. Newsletter Subscribers for "7H Founder Brief"
  subscribers: [
    {
      id: "sub-01",
      name: "Tarun Bajaj",
      email: "tarun@techcapital.in",
      city: "Gurugram",
      interests: ["Venture Capital", "B2B SaaS", "Founder Roundtables"],
      status: "active",
      doubleOptIn: true,
      source: "Homepage Footer",
      createdAt: "2026-03-01T15:20:00.000Z"
    },
    {
      id: "sub-02",
      name: "Meenakshi Sundaram",
      email: "meenakshi@growthflow.co",
      city: "New Delhi",
      interests: ["D2C", "Early Stage", "Legal Insights"],
      status: "active",
      doubleOptIn: true,
      source: "Newsletter Landing Page",
      createdAt: "2026-03-02T16:40:00.000Z"
    }
  ],

  // 7. Newsletter Campaigns (7H Founder Brief)
  newsletters: [
    {
      id: "nl-01",
      subject: "7H Founder Brief #01: Navigating Term Sheets in Delhi NCR & Q2 Cohort Dates",
      previewText: "Your monthly digest of high-signal founder insights, upcoming roundtables, and regional venture mechanics.",
      content: "Welcome to the inaugural edition of the 7H Founder Brief. In this edition, we break down term sheet trends across Delhi NCR and unveil the official agenda for our Cyber City and Aerocity cohorts.",
      status: "sent",
      scheduledDate: null,
      sentAt: "2026-03-01T10:00:00.000Z",
      recipientsCount: 240,
      stats: { opened: 156, clicked: 89 }
    }
  ],

  // 8. Founder Directory (Approved Profiles)
  founders: [
    {
      id: "fnd-01",
      name: "Vikram Malhotra",
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      role: "Founder & CEO",
      startup: "Zenith Mobility",
      industry: "EV Fleet & Telematics",
      city: "Gurugram",
      bio: "Building smart charging and predictive fleet analytics for commercial EV logistics across North India.",
      website: "https://zenithmobility.in",
      linkedin: "https://linkedin.com/in/vikram-zenith",
      status: "approved",
      featured: true,
      createdAt: "2026-03-01T11:00:00.000Z"
    },
    {
      id: "fnd-02",
      name: "Pooja Singhania",
      profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      role: "Co-Founder & CTO",
      startup: "Nexus LegalTech",
      industry: "Legal Automation & Compliance",
      city: "New Delhi",
      bio: "Democratizing corporate compliance, automated ESOP management, and contract review for Indian startups.",
      website: "https://nexuslegal.in",
      linkedin: "https://linkedin.com/in/poojasinghania",
      status: "approved",
      featured: true,
      createdAt: "2026-03-02T13:00:00.000Z"
    }
  ],

  // 9. Startup Directory (Approved Listings)
  startups: [
    {
      id: "stp-01",
      name: "Zenith Mobility",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
      description: "Intelligent IoT telematics and battery swap optimization for B2B fleet logistics in NCR.",
      industry: "CleanTech & Logistics",
      stage: "Seed",
      founderName: "Vikram Malhotra",
      city: "Gurugram",
      website: "https://zenithmobility.in",
      demoLink: "https://zenithmobility.in/demo",
      status: "approved",
      featured: true,
      createdAt: "2026-03-01T11:30:00.000Z"
    },
    {
      id: "stp-02",
      name: "Nexus LegalTech",
      logo: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80",
      description: "AI-assisted compliance management and statutory audit readiness tailored for Indian startups.",
      industry: "Enterprise SaaS",
      stage: "Early Traction",
      founderName: "Pooja Singhania",
      city: "New Delhi",
      website: "https://nexuslegal.in",
      demoLink: "https://nexuslegal.in/sandbox",
      status: "approved",
      featured: true,
      createdAt: "2026-03-02T13:30:00.000Z"
    }
  ],

  // 10. Opportunity Board (Founder Opportunity Radar)
  opportunities: [
    {
      id: "opp-01",
      title: "Seeking Founding Full-Stack / ML Engineer for B2B Supply Chain AI",
      category: "Cofounder Opportunities",
      company: "Apex Logix (Seed Backed)",
      contactEmail: "founder@apexlogix.in",
      description: "Looking for a seasoned tech builder in Delhi NCR with experience in Python/FastAPI, modern React, and route optimization algorithms. Generous equity split + market salary upon seed closure.",
      location: "Gurugram (Hybrid)",
      expiryDate: "2026-05-31",
      status: "approved",
      createdAt: "2026-03-01T14:00:00.000Z"
    },
    {
      id: "opp-02",
      title: "Pilot Customer Trial: 3-Month Automated ESOP Management for NCR Startups",
      category: "Pilot Customers",
      company: "Nexus LegalTech",
      contactEmail: "pilots@nexuslegal.in",
      description: "Offering 5 seed-stage Delhi NCR startups complimentary access to our cap-table and ESOP digitisation engine in exchange for structured product feedback.",
      location: "Delhi NCR (All)",
      expiryDate: "2026-06-15",
      status: "approved",
      createdAt: "2026-03-02T16:00:00.000Z"
    }
  ],

  // 11. Pitch Applications (Private & Confidential)
  pitch_applications: [
    {
      id: "pa-01",
      startupName: "OmniHealth Diagnostics",
      founderName: "Dr. Arvind Verma",
      email: "arvind@omnihealth.io",
      phone: "+91 98101 22334",
      sector: "HealthTech & Diagnostics",
      stage: "Seed",
      arrTraction: "₹45L ARR across 12 hospitals in NCR",
      pitchDeckUrl: "https://drive.google.com/confidential-deck-preview",
      problemSolution: "Point-of-care rapid blood analysis reducing turnaround from 8 hours to 15 minutes.",
      targetRaise: "₹3.5 Crores",
      status: "shortlisted",
      score: 8.5,
      internalNotes: ["Strong clinical validation in Gurugram hospital trial. Invite to Q2 Showcase."],
      assignedReviewer: "Investment Committee",
      createdAt: "2026-03-01T17:00:00.000Z"
    }
  ],

  // 12. Partnerships CRM (Pipeline Stages)
  partnerships: [
    {
      id: "crm-01",
      organizationName: "HyperCloud Infrastructure India",
      contactPerson: "Siddharth Mehra",
      officialEmail: "siddharth@hypercloud.com",
      phone: "+91 99110 55667",
      website: "https://hypercloud.com",
      category: "Technology & Cloud",
      collaborationInterest: "Powered By Partner (₹40,000–₹50,000)",
      budgetRange: "₹50,000 per cohort",
      status: "Negotiation",
      internalOwner: "Partnership Lead",
      followUpDate: "2026-03-15",
      notes: ["Agreed to provide $25k in cloud credits to selected cohort startups. Finalising MoU."],
      createdAt: "2026-03-01T11:00:00.000Z"
    },
    {
      id: "crm-02",
      organizationName: "Vertex Coworking Hubs",
      contactPerson: "Kavita Rastogi",
      officialEmail: "kavita@vertexspaces.in",
      phone: "+91 98118 77665",
      website: "https://vertexspaces.in",
      category: "Coworking & Real Estate",
      collaborationInterest: "Community Partner (₹25,000)",
      budgetRange: "Venue Sponsorship",
      status: "Confirmed",
      internalOwner: "Ecosystem Operations",
      followUpDate: "2026-04-01",
      notes: ["Confirmed venue hosting for Cyber City April session."],
      createdAt: "2026-03-02T10:00:00.000Z"
    }
  ],

  // 13. Contact & Inquiries Inbox
  enquiries: [
    {
      id: "enq-01",
      name: "Rishi Kaushik",
      email: "rishi@investorcircle.in",
      phone: "+91 98100 11223",
      organization: "Angel Syndicate Member",
      enquiryType: "Investor and Mentor Interest",
      message: "Looking to attend the Q2 Pitch Connect showcase in Aerocity as an accredited angel investor.",
      status: "in_progress",
      assignedTo: "Venture Relations Lead",
      internalNotes: ["Accreditation verified. Sending private guest invitation."],
      createdAt: "2026-03-01T16:00:00.000Z"
    }
  ],

  // 14. Resource Library
  resources: [
    {
      id: "res-01",
      title: "Delhi NCR Startup ESOP Structuring & Governance Playbook",
      category: "Legal & Compliance",
      format: "PDF Document (24 Pages)",
      description: "Practical templates, vesting agreements, tax implications, and pool allocation calculators for Indian seed-stage founders.",
      downloadUrl: "/resources/7h-esop-playbook.pdf",
      accessLevel: "members",
      downloadsCount: 184,
      createdAt: "2026-03-01T12:00:00.000Z"
    },
    {
      id: "res-02",
      title: "Seed Due Diligence Checklist: What Indian Angels Look For",
      category: "Fundraising",
      format: "Spreadsheet & Guide",
      description: "An exhaustive 45-point checklist covering cap table hygiene, statutory filings, vendor contracts, and IP assignment.",
      downloadUrl: "/resources/7h-due-diligence-checklist.xlsx",
      accessLevel: "public",
      downloadsCount: 312,
      createdAt: "2026-03-02T14:00:00.000Z"
    }
  ],

  // 15. Website Settings & Section Visibility
  website_settings: {
    brandName: "7 Horse Ventures",
    tagline: "Connect. Build. Grow. Scale.",
    contactEmail: "connect@7horseventures.com",
    contactPhone: "+91 124 490 XXXX",
    whatsappCommunityPlaceholder: "https://chat.whatsapp.com/configure-official-7horse-link",
    socialLinks: {
      linkedin: "https://linkedin.com/company/7horseventures",
      twitter: "https://x.com/7horseventures",
      instagram: "https://instagram.com/7horseventures"
    },
    announcement: {
      active: true,
      text: "Inaugural 2026 Delhi NCR Cohorts: Applications for 7H Founder Connect & Pitch Connect are now being accepted.",
      link: "/events"
    },
    homepageCtas: {
      primaryText: "Explore Our Ecosystem",
      primaryLink: "/ecosystem",
      secondaryText: "Become a Member",
      secondaryLink: "/community"
    },
    sectionVisibility: {
      hero: true,
      intro: true,
      audience: true,
      ecosystem: true,
      flagship: true,
      differentiators: true,
      partnerships: true,
      vision: true,
      cta: true
    },
    seo: {
      defaultTitle: "7 Horse Ventures — Connect. Build. Grow. Scale.",
      defaultDescription: "7 Horse Ventures is building a connected ecosystem for founders, entrepreneurs, investors, professionals, and businesses across Delhi NCR (Gurugram, Delhi, Noida) and India.",
      defaultKeywords: "7 Horse Ventures, Startup networking Delhi NCR, Founder networking Gurugram, Startup events Delhi, Business networking Noida, Startup pitch events India, Entrepreneur community India"
    }
  },

  // 16. Team Members & Roles
  users: [
    {
      id: "usr-01",
      name: "Ecosystem Admin",
      email: "admin@7horseventures.com",
      role: "Super Admin",
      passcode: "7horse2026",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      assignedModules: ["*"],
      permissions: {
        "*": { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: true }
      },
      lastLogin: "2026-03-04T12:00:00.000Z",
      createdAt: "2026-03-01T08:00:00.000Z"
    },
    {
      id: "usr-02",
      name: "Aman Sharma (Events Lead)",
      email: "aman@7horseventures.com",
      role: "Event Manager",
      passcode: "7horse2026",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      assignedModules: ["events", "registrations", "academy_sessions"],
      permissions: {
        events: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: true },
        registrations: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: false, settings: false },
        academy_sessions: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: false }
      },
      lastLogin: "2026-03-03T16:30:00.000Z",
      createdAt: "2026-03-01T08:30:00.000Z"
    },
    {
      id: "usr-03",
      name: "Rhea Kapoor (Community Lead)",
      email: "rhea@7horseventures.com",
      role: "Community Moderator",
      passcode: "7horse2026",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      assignedModules: ["founders_dir", "startups_dir", "opportunities"],
      permissions: {
        founders_dir: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: false },
        startups_dir: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: false },
        opportunities: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: false }
      },
      lastLogin: "2026-03-04T09:15:00.000Z",
      createdAt: "2026-03-01T09:00:00.000Z"
    },
    {
      id: "usr-04",
      name: "Vikram Seth (Marketing Lead)",
      email: "vikram@7horseventures.com",
      role: "Marketing Manager",
      passcode: "7horse2026",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      assignedModules: ["articles", "newsletter", "subscribers", "crm_email_studio"],
      permissions: {
        articles: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: false },
        newsletter: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: false },
        subscribers: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: false, settings: false },
        crm_email_studio: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: true }
      },
      lastLogin: "2026-03-02T11:45:00.000Z",
      createdAt: "2026-03-01T09:30:00.000Z"
    },
    {
      id: "usr-05",
      name: "Neha Gupta (Partnerships Lead)",
      email: "neha@7horseventures.com",
      role: "Partnerships Manager",
      passcode: "7horse2026",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      assignedModules: ["partnerships_crm", "enquiries", "pitch_applications"],
      permissions: {
        partnerships_crm: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: false },
        enquiries: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: false, settings: false },
        pitch_applications: { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: false, settings: false }
      },
      lastLogin: "2026-03-03T14:20:00.000Z",
      createdAt: "2026-03-01T10:00:00.000Z"
    }
  ],

  // 17. Analytics
  analytics: {
    totalVisitors: 4180,
    pageViews: 12450,
    registrationsCount: 83,
    applicationsCount: 29,
    newsletterSubscribers: 242,
    conversionRate: "4.8%",
    topLandingPages: [
      { path: "/", views: 5620, title: "Homepage" },
      { path: "/events", views: 2840, title: "Events Directory" },
      { path: "/founder-connect", views: 1910, title: "7H Founder Connect" },
      { path: "/pitch-capital-connect", views: 1140, title: "Pitch & Capital Connect" },
      { path: "/for-founders", views: 940, title: "For Founders" }
    ],
    trafficSources: [
      { source: "Direct & Community", percentage: 46 },
      { source: "LinkedIn & Founder Shares", percentage: 32 },
      { source: "Organic Search", percentage: 14 },
      { source: "Partner Referrals", percentage: 8 }
    ]
  },

  // 18. Audit Logs
  audit_logs: [
    {
      id: "log-01",
      user: "Ecosystem Admin",
      action: "System Initialization",
      details: "Database initialized with full CMS collections and persistent mappings.",
      timestamp: "2026-03-01T08:00:00.000Z"
    }
  ],

  // 19. Academy Sessions (Workshops, Masterclasses, Expert Sessions, Online Learning)
  academy_sessions: [
    {
      id: "acad-01",
      title: "Cap Table Architecture & Term Sheet Mechanics",
      slug: "cap-table-architecture-term-sheets",
      category: "Masterclass",
      targetAudience: "Founders & Co-Founders",
      format: "Online",
      locationOrLink: "Live Virtual Classroom (Link issued upon confirmed registration)",
      dateTime: "2026-04-12T16:00:00.000Z",
      displayDate: "Sunday, April 12, 2026 • 4:00 PM - 6:00 PM IST",
      duration: "2 Hours",
      status: "upcoming",
      shortDescription: "A comprehensive breakdown of equity dilution, SAFEs vs Convertible Notes, liquidation preferences, and founder vesting schedules.",
      fullDescription: "Cap table mismanagement in the pre-seed and seed stages is one of the most common reasons promising startups face financing hurdles later. In this technical masterclass, participants will dissect actual anonymized term sheets, build dilution simulation models in spreadsheets, and learn how to navigate investor rights while retaining alignment.",
      speaker: {
        name: "7 Horse Academy Finance Desk",
        role: "Venture Finance & Governance Mentors",
        organization: "7 Horse Ventures Academy",
        bio: "Senior corporate finance practitioners and startup legal counsels guiding builders through cap-table structuring and seed-stage governance.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      },
      capacity: 60,
      registeredCount: 28,
      keyTakeaways: [
        "Convertible Note vs SAFE note mechanics in the Indian corporate context",
        "Modeling post-money SAFEs and calculating pro-rata rights",
        "Understanding participating vs non-participating liquidation preferences",
        "ESOP pool structuring before vs after priced rounds"
      ],
      coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
      createdAt: "2026-03-01T08:00:00.000Z"
    },
    {
      id: "acad-02",
      title: "Zero-to-One Product Validation & First 20 Customer Pilots",
      slug: "product-validation-pilot-playbooks",
      category: "Workshop",
      targetAudience: "Early Builders & Product Leads",
      format: "Online",
      locationOrLink: "Interactive Workshop via Google Meet",
      dateTime: "2026-04-19T17:00:00.000Z",
      displayDate: "Sunday, April 19, 2026 • 5:00 PM - 7:30 PM IST",
      duration: "2.5 Hours",
      status: "upcoming",
      shortDescription: "Hands-on framework to validate problem hypotheses, conduct non-leading customer discovery interviews, and close early enterprise POCs.",
      fullDescription: "Most startups fail not from engineering obstacles, but from building things nobody actually pays for. This interactive workshop walks founders through structured customer discovery frameworks, drafting pilot agreements with clear success metrics, and converting early pilots into recurring paid customers.",
      speaker: {
        name: "Product & Growth Faculty",
        role: "Operator-in-Residence",
        organization: "7 Horse Ventures Academy",
        bio: "Experienced product leaders and zero-to-one operators who have scaled B2B SaaS and consumer tech products across emerging markets.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
      },
      capacity: 50,
      registeredCount: 34,
      keyTakeaways: [
        "The Mom Test framework adapted for Indian B2B enterprise procurement",
        "Structuring low-risk pilot memorandums with 30-day decision gates",
        "Identifying customer willingness-to-pay before writing code",
        "Building repeatable outbound discovery cadences without ad spend"
      ],
      coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
      createdAt: "2026-03-01T08:00:00.000Z"
    },
    {
      id: "acad-03",
      title: "Startup Legal Essentials & Regulatory Compliance in India",
      slug: "startup-legal-compliance-essentials",
      category: "Expert Session",
      targetAudience: "Business Owners, Founders & Operators",
      format: "Hybrid",
      locationOrLink: "In-Person Hub (Gurugram) & Live Stream Broadcast",
      dateTime: "2026-04-26T15:30:00.000Z",
      displayDate: "Sunday, April 26, 2026 • 3:30 PM - 5:30 PM IST",
      duration: "2 Hours",
      status: "upcoming",
      shortDescription: "Essential compliance guidelines for Private Limited incorporation, GST filings, DPIIT startup recognition, and IP trademark registration.",
      fullDescription: "An expert-led deep dive into setting up clean regulatory foundations from Day 1. Covers corporate governance requirements, IP assignment agreements for co-founders and employees, FEMA compliances for foreign remittances, and DPIIT benefits under Startup India.",
      speaker: {
        name: "Legal & Regulatory Advisory Group",
        role: "Corporate Counsel",
        organization: "7 Horse Ventures Legal Circle",
        bio: "Practicing startup counsels and company secretaries advising emerging growth ventures on corporate law and regulatory structuring.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
      },
      capacity: 45,
      registeredCount: 21,
      keyTakeaways: [
        "Step-by-step DPIIT recognition and Section 56(2)(viib) angel tax exemptions",
        "Co-founder agreements: reverse vesting, IP assignment, and exit clauses",
        "Statutory compliance calendar: MCA filings, AGM timelines, and GST audits",
        "Trademark, patent, and trade secret protection strategies"
      ],
      coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      createdAt: "2026-03-01T08:00:00.000Z"
    },
    {
      id: "acad-04",
      title: "From Campus to Co-Founder: The Aspiring Builder's Launchpad",
      slug: "campus-to-cofounder-launchpad",
      category: "Online Learning",
      targetAudience: "Students, Aspiring Founders & First-Time Builders",
      format: "Online",
      locationOrLink: "Live Interactive Session via Zoom",
      dateTime: "2026-05-03T17:00:00.000Z",
      displayDate: "Sunday, May 3, 2026 • 5:00 PM - 6:45 PM IST",
      duration: "1.75 Hours",
      status: "upcoming",
      shortDescription: "A foundational clinic for university students and early-career professionals learning how to evaluate startup ideas and find complementary co-founders.",
      fullDescription: "Breaking the myth that you need millions in funding to start building. This session provides university students and first-time builders with the mental models, no-code prototyping tools, and co-founder matchmaking frameworks needed to launch their first venture experiment.",
      speaker: {
        name: "Campus Venture Fellowship",
        role: "Ecosystem Mentor",
        organization: "7 Horse Ventures Academy",
        bio: "Community leads and university venture mentors passionate about fostering student-led entrepreneurship and open innovation.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
      },
      capacity: 100,
      registeredCount: 62,
      keyTakeaways: [
        "Evaluating venture ideas using the Market-Founder Fit matrix",
        "Building working MVPs using modern no-code and AI developer stacks",
        "Finding and vetting complementary co-founders with aligned values",
        "Applying to student incubation programs and regional grants"
      ],
      coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      createdAt: "2026-03-01T08:00:00.000Z"
    },
    {
      id: "acad-05",
      title: "Unit Economics, CAC Payback & Cash-Flow Modeling",
      slug: "unit-economics-cac-payback-modelling",
      category: "Masterclass",
      targetAudience: "Founders & Finance Leaders",
      format: "Online",
      locationOrLink: "Session Recording & Presentation Slidedeck Archive",
      dateTime: "2026-02-15T16:00:00.000Z",
      displayDate: "February 15, 2026",
      duration: "2 Hours",
      status: "completed",
      shortDescription: "A tactical teardown on cohort retention, gross margin health, and calculating true fully-loaded customer acquisition cost.",
      fullDescription: "Archived masterclass recording and spreadsheet workbook detailing how venture investors assess unit economics health. Covers blended vs organic CAC, payback periods, LTV calculations across cohorts, and burn multiple targets.",
      speaker: {
        name: "7 Horse Ventures Academy Faculty",
        role: "Venture Finance Lead",
        organization: "7 Horse Ventures",
        bio: "Venture finance and growth analysts specializing in early-stage SaaS and marketplace business models.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      },
      capacity: 75,
      registeredCount: 75,
      keyTakeaways: [
        "Fully-loaded CAC accounting including team salaries and overhead",
        "Evaluating 30/60/90-day cohort retention curves",
        "Understanding the difference between accounting margin vs contribution margin"
      ],
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      createdAt: "2026-02-10T08:00:00.000Z"
    }
  ],

  // 20. Academy Registrations
  academy_registrations: [
    {
      id: "acad-reg-01",
      sessionId: "acad-01",
      sessionTitle: "Cap Table Architecture & Term Sheet Mechanics",
      fullName: "Aditya Khurana",
      email: "aditya@finscale.io",
      phone: "+91 98112 34567",
      organization: "FinScale",
      role: "Founder / CEO",
      questionsForSpeaker: "How do convertible debt interest rates affect equity dilution during a down round?",
      status: "confirmed",
      registeredAt: "2026-03-02T10:30:00.000Z"
    }
  ],

  // 21. CRM Email Studio — Templates
  email_templates: [
    {
      id: "tpl-01",
      name: "Event Booking Confirmation",
      category: "Event Booking",
      subject: "Confirmed: Your Official Executive Pass for {{event_name}}",
      body: `<h2>7 HORSE VENTURES</h2>
<p>Dear {{first_name}},</p>
<p>Your delegate pass for <strong>{{event_name}}</strong> has been confirmed.</p>
<div style="background:#141414;color:#F7F5F0;padding:20px;border-radius:12px;border:1px solid #C5A46D;">
  <p><strong>Pass Reference:</strong> {{ticket_reference}}</p>
  <p><strong>Date & Time:</strong> {{event_date}} at {{event_time}}</p>
  <p><strong>Venue / Location:</strong> {{event_location}}</p>
  <p><strong>Attendee:</strong> {{full_name}}</p>
</div>
<p>Please present this digital pass or printed copy at the reception check-in desk.</p>
<p><a href="{{registration_link}}" style="background:#C5A46D;color:#101010;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">View Digital Pass</a></p>
<p>Best regards,<br>7 Horse Ventures Curation Committee</p>`,
      variables: ["first_name", "full_name", "event_name", "event_date", "event_time", "event_location", "ticket_reference", "registration_link"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-02",
      name: "Event Reminder (Upcoming Cohort)",
      category: "Event Reminders",
      subject: "Reminder: {{event_name}} is taking place on {{event_date}}",
      body: `<h2>7 HORSE VENTURES</h2>
<p>Hi {{first_name}},</p>
<p>This is a quick reminder that <strong>{{event_name}}</strong> will commence on <strong>{{event_date}} at {{event_time}}</strong>.</p>
<p><strong>Location:</strong> {{event_location}}</p>
<p><strong>Your Pass ID:</strong> {{ticket_reference}}</p>
<p>We recommend arriving 15 minutes early for curated peer introductions and welcome high tea.</p>
<p><a href="{{registration_link}}" style="background:#C5A46D;color:#101010;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Access Pass & Directions</a></p>
<p>See you there,<br>7 Horse Ventures Team</p>`,
      variables: ["first_name", "full_name", "event_name", "event_date", "event_time", "event_location", "ticket_reference", "registration_link"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-03",
      name: "Post-Event Thank You & Resources",
      category: "Post-Event",
      subject: "Thank you for joining {{event_name}} • Key Takeaways & Deck",
      body: `<h2>7 HORSE VENTURES</h2>
<p>Dear {{first_name}},</p>
<p>Thank you for participating in <strong>{{event_name}}</strong>. Your perspectives and active engagement contributed significantly to the high signal of the cohort.</p>
<p>We have compiled session highlights, executive presentation decks, and peer connection links in your portal:</p>
<p><a href="{{registration_link}}" style="background:#101010;color:#D8C39A;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Download Session Resources</a></p>
<p>We would love your brief feedback to help us continually elevate future editions.</p>
<p>Warm regards,<br>7 Horse Ventures Community Leadership</p>`,
      variables: ["first_name", "full_name", "event_name", "registration_link"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-04",
      name: "No-Show Friendly Follow-up",
      category: "Post-Event",
      subject: "We missed you at {{event_name}} — Here is what you missed",
      body: `<h2>7 HORSE VENTURES</h2>
<p>Dear {{first_name}},</p>
<p>We missed having you at <strong>{{event_name}}</strong> yesterday. We understand urgent founder commitments often take precedence.</p>
<p>To keep you in the loop, we've made the executive summary and speaker resource workbook available for you:</p>
<p><a href="{{registration_link}}" style="background:#C5A46D;color:#101010;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Review Event Takeaways</a></p>
<p>We look forward to welcoming you at an upcoming edition soon.</p>
<p>Warmly,<br>7 Horse Ventures</p>`,
      variables: ["first_name", "full_name", "event_name", "registration_link"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-05",
      name: "Academy Registration Confirmation",
      category: "Academy",
      subject: "Confirmed: 7H Academy Masterclass Access for {{first_name}}",
      body: `<h2>7 HORSE ACADEMY</h2>
<p>Welcome {{first_name}},</p>
<p>Your enrollment in <strong>{{event_name}}</strong> is confirmed. You now have access to the curriculum syllabus, reading materials, and live stream link.</p>
<p><a href="{{registration_link}}" style="background:#C5A46D;color:#101010;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Open Academy Portal</a></p>
<p>7 Horse Ventures Academy Faculty</p>`,
      variables: ["first_name", "full_name", "event_name", "registration_link"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-06",
      name: "Academy Session 24h Reminder",
      category: "Academy",
      subject: "Starting Tomorrow: 7H Academy Masterclass with Faculty",
      body: `<h2>7 HORSE ACADEMY</h2>
<p>Hi {{first_name}},</p>
<p>Your enrolled session <strong>{{event_name}}</strong> begins in 24 hours.</p>
<p>Please review pre-session case studies and submit your questions for the speaker beforehand.</p>
<p><a href="{{registration_link}}" style="background:#101010;color:#D8C39A;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Access Webinar Link</a></p>`,
      variables: ["first_name", "event_name", "registration_link"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-07",
      name: "Ecosystem Monthly Newsletter",
      category: "Newsletter",
      subject: "7H Ventures Dispatch: Founder Signals & Capital Trends",
      body: `<h2>7 HORSE VENTURES DISPATCH</h2>
<p>Hello {{first_name}},</p>
<p>Here are this month's curated investment insights, builder teardowns, and upcoming networking opportunities across Delhi NCR and India's venture landscape.</p>
<p>Read full insights on our portal.</p>
<p><a href="{{registration_link}}">Unsubscribe from ecosystem dispatches</a></p>`,
      variables: ["first_name", "registration_link"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-08",
      name: "WhatsApp Community Exclusive Invitation",
      category: "Community",
      subject: "Exclusive Invitation: Join the 7 Horse Ventures WhatsApp Circle",
      body: `<h2>7 HORSE VENTURES</h2>
<p>Hi {{first_name}},</p>
<p>You are invited to join our private WhatsApp founder & investor community to receive real-time notices on upcoming roundtables, private pitch forums, and peer collaborations.</p>
<p><a href="https://chat.whatsapp.com/IzTObDPm8pw80Hw811RJvC?s=cl&p=a&iam=2" style="background:#25D366;color:#FFFFFF;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Join Official WhatsApp Group</a></p>`,
      variables: ["first_name"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-09",
      name: "Partnership Alliance Introduction",
      category: "Partnerships",
      subject: "Strategic Partnership with 7 Horse Ventures Ecosystem",
      body: `<h2>7 HORSE VENTURES ALLIANCES</h2>
<p>Dear {{first_name}},</p>
<p>Following our initial conversation, we are pleased to share our partnership alignment framework and strategic opportunities for {{event_name}}.</p>
<p>Best regards,<br>Strategic Partnerships Team</p>`,
      variables: ["first_name", "event_name"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tpl-10",
      name: "General Ecosystem Announcement",
      category: "General",
      subject: "Notice: Important Ecosystem Update from 7 Horse Ventures",
      body: `<h2>7 HORSE VENTURES</h2>
<p>Dear {{first_name}},</p>
<p>We are announcing an important enhancement to the 7 Horse Ventures ecosystem infrastructure.</p>
<p>Warm regards,<br>7 Horse Ventures Management</p>`,
      variables: ["first_name"],
      updatedAt: "2026-03-01T10:00:00.000Z"
    }
  ],

  // 22. CRM Email Studio — Automations
  email_automations: [
    {
      id: "auto-01",
      name: "Event Attendee Journey & Reminders",
      description: "Automated booking confirmation, scheduled reminders, post-event gratitude, and no-show follow-ups.",
      trigger: "EVENT_REGISTRATION",
      status: "active",
      steps: [
        { id: "step-1", type: "email", delay: "immediate", templateId: "tpl-01", title: "Instant Booking Confirmation Pass" },
        { id: "step-2", type: "delay_until", delay: "3_days_before", templateId: "tpl-02", title: "3-Day Advance Event Reminder" },
        { id: "step-3", type: "delay_until", delay: "2_hours_before", templateId: "tpl-02", title: "Final Gate Check-in Reminder" },
        { id: "step-4", type: "condition_branch", condition: "checked_in", attendedTemplateId: "tpl-03", noShowTemplateId: "tpl-04", title: "Post-Event Reconciliation (Attended vs No-Show)" }
      ],
      stats: { triggered: 94, delivered: 94, opened: 76, clicked: 48 },
      createdAt: "2026-03-01T08:00:00.000Z"
    },
    {
      id: "auto-02",
      name: "Academy Enrollment Sequence",
      description: "Masterclass registration confirmation, 24-hour syllabus alert, and slidedeck delivery.",
      trigger: "ACADEMY_REGISTRATION",
      status: "active",
      steps: [
        { id: "step-1", type: "email", delay: "immediate", templateId: "tpl-05", title: "Masterclass Enrollment Confirmation" },
        { id: "step-2", type: "delay_until", delay: "1_day_before", templateId: "tpl-06", title: "24-Hour Webinar Access Alert" }
      ],
      stats: { triggered: 48, delivered: 48, opened: 39, clicked: 24 },
      createdAt: "2026-03-01T08:00:00.000Z"
    },
    {
      id: "auto-03",
      name: "Founder Directory Approval Onboarding",
      description: "Triggered when a founder application is approved, sending community WhatsApp invite.",
      trigger: "FOUNDER_APPROVED",
      status: "active",
      steps: [
        { id: "step-1", type: "email", delay: "immediate", templateId: "tpl-08", title: "Welcome to 7H Founder Network & WhatsApp Circle" }
      ],
      stats: { triggered: 22, delivered: 22, opened: 20, clicked: 18 },
      createdAt: "2026-03-01T08:00:00.000Z"
    }
  ],

  // 23. CRM Email Studio — Contact Segments
  email_segments: [
    {
      id: "seg-01",
      name: "All Registered Event Delegates",
      type: "dynamic",
      category: "Events",
      sourceCollection: "registrations",
      criteria: "all_registrations",
      description: "Every attendee who has registered or booked a ticket for any 7H event.",
      estimatedCount: 84
    },
    {
      id: "seg-02",
      name: "Confirmed Paid Delegates (Cashfree)",
      type: "dynamic",
      category: "Events",
      sourceCollection: "registrations",
      criteria: "paid_only",
      description: "Attendees with verified Cashfree paid passes.",
      estimatedCount: 26
    },
    {
      id: "seg-03",
      name: "Past Attended Delegates",
      type: "dynamic",
      category: "Events",
      sourceCollection: "registrations",
      criteria: "attended_checked_in",
      description: "Reconciled attendees who checked in at past summits.",
      estimatedCount: 38
    },
    {
      id: "seg-04",
      name: "Event No-Shows (Follow-up Pool)",
      type: "dynamic",
      category: "Events",
      sourceCollection: "registrations",
      criteria: "no_show",
      description: "Registered delegates who did not attend and need re-engagement.",
      estimatedCount: 12
    },
    {
      id: "seg-05",
      name: "Vetted Tech Founders",
      type: "dynamic",
      category: "Founders",
      sourceCollection: "founders",
      criteria: "approved_founders",
      description: "Verified founders in the 7 Horse Ventures directory.",
      estimatedCount: 45
    },
    {
      id: "seg-06",
      name: "Academy Masterclass Participants",
      type: "dynamic",
      category: "Academy",
      sourceCollection: "academy_registrations",
      criteria: "all_academy",
      description: "Founders and operators enrolled in 7H Academy masterclasses.",
      estimatedCount: 65
    },
    {
      id: "seg-07",
      name: "Active Newsletter Subscribers",
      type: "dynamic",
      category: "Publishing",
      sourceCollection: "subscribers",
      criteria: "active_subscribers",
      description: "Subscribers opted in for monthly venture dispatches.",
      estimatedCount: 242
    },
    {
      id: "seg-08",
      name: "Corporate & VC Partnership Leads",
      type: "dynamic",
      category: "Partnerships",
      sourceCollection: "partnerships",
      criteria: "all_partners",
      description: "Enterprise sponsors, VC syndicates, and alliance contacts.",
      estimatedCount: 18
    }
  ],

  // 24. CRM Email Studio — Campaigns
  email_campaigns: [
    {
      id: "camp-01",
      title: "Q2 Founder Connect Gurugram Announcement",
      segmentId: "seg-05",
      segmentName: "Vetted Tech Founders",
      templateId: "tpl-02",
      subject: "Exclusive Invite: 7H Founder Connect — Founders & Builders Roundtable",
      status: "sent",
      scheduledAt: "2026-03-01T10:00:00.000Z",
      sentAt: "2026-03-01T10:05:00.000Z",
      recipientCount: 45,
      stats: { sent: 45, delivered: 45, opened: 36, clicked: 24, bounced: 0, unsubscribed: 0 }
    },
    {
      id: "camp-02",
      title: "7H Academy Cap Table Masterclass Dispatch",
      segmentId: "seg-06",
      segmentName: "Academy Masterclass Participants",
      templateId: "tpl-05",
      subject: "Seats Open: Cap Table Architecture & Term Sheet Mechanics",
      status: "sent",
      scheduledAt: "2026-03-02T12:00:00.000Z",
      sentAt: "2026-03-02T12:02:00.000Z",
      recipientCount: 65,
      stats: { sent: 65, delivered: 64, opened: 48, clicked: 31, bounced: 1, unsubscribed: 0 }
    }
  ],

  // 25. CRM Email Studio — Delivery Logs
  email_logs: [
    {
      id: "elog-01",
      recipientEmail: "rohit@logixtrack.in",
      recipientName: "Rohit Malhotra",
      subject: "Confirmed: Your Official Executive Pass for 7H Founder Connect",
      templateId: "tpl-01",
      workflowId: "auto-01",
      status: "DELIVERED",
      providerResponse: "250 OK (SMTP TLS Delivered)",
      sentAt: "2026-03-01T12:30:15.000Z"
    },
    {
      id: "elog-02",
      recipientEmail: "aditya@finscale.io",
      recipientName: "Aditya Khurana",
      subject: "Confirmed: 7H Academy Masterclass Access for Aditya",
      templateId: "tpl-05",
      workflowId: "auto-02",
      status: "DELIVERED",
      providerResponse: "250 OK (SMTP TLS Delivered)",
      sentAt: "2026-03-02T10:30:10.000Z"
    }
  ],

  // 26. CRM Email Studio — Unsubscribes
  email_unsubscribes: []
};
