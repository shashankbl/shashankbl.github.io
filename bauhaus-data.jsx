// bauhaus-data.jsx — Static content for the Bauhaus portfolio.

window.SITE = {
  name: 'Shashank Bangalore Lakshman',
  short: 'Shashank Bangalore Lakshman',
  tagline: 'Silicon to Software Systems for AI',
  blurb: "Systems thinker, creative maker, and customer advocate. I've done pathfinding for high-density NVM and AI accelerators, and shipped AI solutions, MLOps products, and automotive software.",
  location: 'Folsom, CA',
  status: 'Open to collaborations · talks',
  social: {
    github:   'https://github.com/shashankbl',
    linkedin: 'https://www.linkedin.com/in/shashankbl/',
    scholar:  'https://scholar.google.com/citations?user=_BI5HM8AAAAJ&hl=en',
    substack: 'https://shashankbl.substack.com/',
  },
};

// kind: 'engineering' (■) | 'art' (●) | 'science' (▲)
window.PROJECTS = [
  { id: 'rox-ai-studio', n: '001', kind: 'engineering',
    title: 'RoX AI Studio', tag: 'AI · MLOPS', year: '2024',
    blurb: 'Cloud-native MLOps platform for Renesas R-Car SoC customers. Enables HIL performance evaluation for BYO models on a custom Web UI. Featured at Renesas CES demo pavilion.',
    stack: 'Python · Azure · CI/CD', loc: 'Renesas Electronics' },
  { id: 'mdla-cebu', n: '002', kind: 'engineering',
    title: 'MDLA CEBU', tag: 'AI · ACCELERATION', year: '2023',
    blurb: 'AI accelerator demos and benchmarking suite for Micron DLA. Customer-centric AI lab in Folsom; led two Ph.D. interns; influenced edge AI/PIM/PNM product strategy.',
    stack: 'Python · CUDA · ONNX', loc: 'Micron Technology' },
  { id: 'feram-tft-pathfinding', n: '003', kind: 'science',
    title: '3D NV-RAM Pathfinding', tag: 'SILICON · MEMORIES', year: '2015 → 2021',
    blurb: 'Silicon characterization for industry-first multi-Gb 3D NV-RAM (FeRAM, TFT). Novel bit-level analytics technique unlocked deeper insight into process and reliability. Four patents filed.',
    stack: 'Verilog · Python · Benchlab', loc: 'Micron Technology' },
  { id: 'campml', n: '004', kind: 'engineering',
    title: 'CampML.org', tag: 'COMMUNITY · EDU', year: 'Ongoing',
    blurb: 'Founder and AI educator at CampML.org — a community-driven ML bootcamp. Also AI technical advisor at Folsom Lake College CS and industry evaluator at UC Davis.',
    stack: 'Curriculum · Mentorship', loc: 'Volunteer' },
];

window.POSTS = [
  { date: '2026-03-12', slug: '...',
    title: '...', read: '10 min',
    blurb: '...' },
];

window.TALKS = [
  { date: '2025·04', venue: 'FLC Tech Summit 2025',
    title: 'Agentic BoD: Building my own LLM-powered personal board of directors',
    loc: 'Folsom, CA' },
  { date: '2025·01', venue: 'GITPRO World 2025',
    title: 'Lowering the technology adoption barriers with low-code/no-code MLOps',
    loc: 'SF Bay Area' },
  { date: '2023·08', venue: 'CA Capital Airshow STEM Expo',
    title: 'Panel · If You Can See It, You Can Be It.',
    loc: 'Sacramento, CA' },
  { date: '2020·08', venue: 'BNM Institute FDP',
    title: 'Machine Learning Trends',
    loc: 'Online · India' },
  { date: '2020·08', venue: 'IC RTEETIMP-2020',
    title: 'Computer Vision with Machine Learning',
    loc: 'Online · India' },
];

// Each employer/institution groups one or more roles. `span` is shown beside
// the employer header; each `role` carries its own date range and bullets.
window.PROFESSIONAL = [
  { co: 'Renesas Electronics America', loc: 'Remote', span: 'Jan 2024 → now',
    logo: 'images/logos/renesas.svg',
    roles: [
      { y: 'Jan 2024 → now', role: 'Engineering Lead and Manager · ML',
        bullets: [
          'Product owner for "RoX AI Studio" — a cloud-native MLOps platform for Renesas R-Car SoC customers; enables customers to evaluate HIL performance for BYO models via a custom Web UI. Featured at the Renesas CES demo pavilion.',
          'Joined as founding Staff Engineer and developed the 0→1 product by leading software architecture and engineering. Promoted to Manager within one year, driving engineering execution and influencing the product roadmap with a strong understanding of customer requirements and competitor MLOps platforms.',
          'Enabled real-time deployment of new AI SDK to cloud customers by reducing setup time from 6hrs to under 30 mins through CI/CD (Azure pipeline).',
          'Demonstrated expertise in LLM-assisted product development — first-of-its-kind Web UI built using LLM assistance within 6 weeks. Three patent disclosures pertaining to novel MLOps in the filing process.',
          'Scaled and managed a global team from 2 to 6 engineers, working closely with leadership (Sr Dir and VP). Led multiple product demos and customer engagements through cross-functional collaboration with FAE and Marketing teams. Technical authorship to evangelize the product (blog).',
        ] },
    ] },

  { co: 'Micron Technology, Inc.', loc: 'Folsom CA & Boise ID', span: 'Aug 2015 → Dec 2023',
    logo: 'images/logos/micron.png',
    roles: [
      { y: 'Mar 2023 → Dec 2023', role: 'Senior Systems Architect · Automotive',
        bullets: [
          'Systems architect for US and Japan OEM/Tier-1 automotive engagements; analyzed and discussed memory & compute requirements for L3/L4 ADAS and mid/high-segment IVI.',
          'Mapped trending automotive AI workloads to memory systems requirements to technically influence the automotive memory/storage product roadmap.',
          'Evangelized memory products to OEM/Tier-1 customers through demos and workshops in the US and Japan.',
        ] },
      { y: 'Aug 2021 → Mar 2023', role: 'Senior Systems Architect · AI Solutions',
        bullets: [
          'Technical leader for the AI acceleration solution (Micron DLA) — delivered AI accelerator demos and the "MDLA CEBU" benchmarking suite.',
          'Filed 20+ patent disclosures, demonstrating strong understanding of pathfinding and innovation in AI applications and hardware architectures.',
          'Built a customer-centric AI lab at the Folsom site to accelerate AI solutions; led two Ph.D. interns.',
          'Conducted competitor research on edge AI inference and PIM/PNM, influencing product strategy.',
        ] },
      { y: 'Aug 2015 → Aug 2021', role: 'Product Engineer II / III · Emerging Memories',
        bullets: [
          'Pathfinding for industry-first multi-Gb 3D NV-RAM through silicon electrical characterization of multi-tier, multi-Gb memory arrays (FeRAM and TFT).',
          'Created a novel bit-level silicon characterization and analytics technique that unlocked deeper insights into process and reliability engineering. Filed 4 patent disclosures on FeRAM memory management.',
        ] },
    ] },

  { co: 'SanDisk Corporation', loc: 'San Jose, CA', span: 'Jun 2014 → Jun 2015',
    logo: 'images/logos/sandisk.svg',
    roles: [
      { y: 'Jun 2014 → Jun 2015', role: 'Characterization Engineer II',
        bullets: [
          'Defined and executed product qualification for raw NAND for a leading consumer electronics OEM.',
        ] },
    ] },

  { co: 'Bosch', loc: 'Bangalore, India', span: 'Sep 2010 → Jun 2012',
    logo: 'images/logos/bosch.svg',
    roles: [
      { y: 'Sep 2010 → Jun 2012', role: 'Software Engineer · Powertrain Systems',
        bullets: [
          'Developed and validated automotive embedded platform software for global OEM customers.',
        ] },
    ] },
];

window.ACADEMIC = [
  { co: 'The University of Texas at Austin', loc: 'Austin, TX', span: 'Aug 2025 → now',
    roles: [
      { y: 'Aug 2025 → now', role: 'M.S. in Artificial Intelligence',
        bullets: [
          'Coursework: Case Studies in ML, Natural Language Processing, Deep Learning, Ethics in AI.',
          'Research interests: LLM-aided design, efficient on-device ML.',
        ] },
    ] },

  { co: 'Boise State University', loc: 'Boise, ID', span: 'Jan 2020 → Jun 2022',
    roles: [
      { y: 'Jan 2020 → Jun 2022', role: 'Graduate Coursework in Machine Learning (non-degree)',
        bullets: [
          'Machine Learning, Deep Learning, Natural Language Processing, Artificial Intelligence, Design and Analysis of Algorithms, Advanced Software Engineering.',
        ] },
    ] },

  { co: 'San Jose State University', loc: 'San Jose, CA', span: 'Aug 2012 → May 2014',
    roles: [
      { y: 'Aug 2012 → May 2014', role: 'M.S. in Electrical Engineering',
        bullets: [
          'Digital System Design and Synthesis, Advanced Computer Architectures, SoC Design and Verification with SystemVerilog, Digital Design for DSP (FPGA).',
        ] },
    ] },

  { co: 'Visvesvaraya Technological University (VTU)', loc: 'India', span: 'Sep 2006 → Jun 2010',
    roles: [
      { y: 'Sep 2006 → Jun 2010', role: 'B.E. in Electrical and Electronics Engineering',
        bullets: [
          'C programming, Embedded Systems, Control Systems, Analog and Digital Electronics.',
        ] },
    ] },
];

// Affiliations shown on the home page. `file` points to a local logo asset
// in /logos. If absent, `slug` resolves to a Simple Icons SVG. Entries with
// neither render as a typographic wordmark.
window.AFFILIATIONS = {
  current: [
    { name: 'Renesas Electronics', short: 'Renesas',   file: 'images/logos/renesas.svg', kind: 'employer', cc: 'US' },
    { name: 'UT Austin',           short: 'UT Austin',                                   kind: 'school',   cc: 'US' },
  ],
  past: [
    { name: 'Micron Technology',          short: 'Micron',      file: 'images/logos/micron.png',  kind: 'employer', cc: 'US' },
    { name: 'SanDisk',                    short: 'SanDisk',     file: 'images/logos/sandisk.svg', kind: 'employer', cc: 'US' },
    { name: 'Bosch',                      short: 'Bosch',       file: 'images/logos/bosch.svg',   kind: 'employer', cc: 'IN' },
    { name: 'Boise State University',     short: 'Boise State',                                   kind: 'school',   cc: 'US' },
    { name: 'San Jose State University',  short: 'SJSU',                                          kind: 'school',   cc: 'US' },
    { name: 'VTU India',                  short: 'VTU',                                           kind: 'school',   cc: 'IN' },
  ],
};

window.NOW_LINES = [
  'Leading ML and Agentic projects at Renesas — building RoX AI Studio for R-Car SoC customers.',
  'Pursuing M.S. in Artificial Intelligence at UT Austin.',
  'Researching LLM-aided design and efficient on-device ML.',
  'AI technical advisor at Folsom Lake College and industry evaluator at UC Davis.',
  'AI-assisted prototyping in robotics and autonomous AI agents.',
];

window.NOW_DATE = '2026·04·26';
