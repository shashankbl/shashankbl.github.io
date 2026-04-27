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

// kind: 'engineering' (■) | 'art' (●)
window.PROJECTS = [
  { id: 'rox-ai-studio', n: '001', kind: 'engineering',
    title: 'RoX AI Studio', tag: 'AI · MLOPS · Evals', year: '2024-Present',
    blurb: 'Cloud-native MLOps platform for Renesas R-Car SoC customers. Enables HIL performance evaluation for BYO models on an intuitive Web UI. Featured at Renesas CES demo pavilion.',
    stack: 'Python · PyTorch · MLFlow · Airflow · Azure · CI/CD', loc: 'Renesas Electronics',
    image: 'images/things_built/rox-ai-studio.png',
    links: [
      { label: 'Product', url: 'https://aistudio.renesas.com' },
      { label: 'Blog', url: 'https://www.renesas.com/en/blogs/accelerate-automotive-ai-innovation-rox-ai-studio' },
    ] },
  { id: 'mdla-cebu', n: '002', kind: 'engineering',
    title: 'Micron DLA Customer Eval and Benchmark Utility', tag: 'AI · MLOps · Evals', year: '2021-2023',
    blurb: 'AI accelerator customer demos and benchmarking suite for Micron DLA.',
    stack: 'Python · PyTorch · ONNX', loc: 'Micron Technology',
    image: 'images/things_built/micron-dla.png' },
  { id: 'feram-tft-pathfinding', n: '003', kind: 'engineering',
    title: '3D NV-RAM Pathfinding', tag: 'SILICON · MEMORIES', year: '2015 → 2021',
    blurb: 'Silicon characterization for industry-first multi-Gb 3D NV-RAM (FeRAM, TFT). Novel bit-level analytics technique unlocked deeper insight into process and reliability.',
    stack: 'Verilog · Python · Benchlab', loc: 'Micron Technology',
    links: [
      { label: 'Related work', url: 'https://ieeexplore.ieee.org/abstract/document/10413848' },
      { label: 'Related work', url: 'https://ieeexplore.ieee.org/document/11075050' },
    ] },
  { id: 'campml', n: '004', kind: 'engineering',
    title: 'CampML.org', tag: 'COMMUNITY · EDU', year: 'Ongoing',
    blurb: 'Founder and AI educator at CampML.org — a community-driven ML bootcamp. Technical keynote, AI technical advisor/mentor at Folsom Lake College, Industry evaluator at UC Davis Engg Design Showcase.',
    stack: 'Volunteer · Mentorship', loc: 'CampML.org' },
];

window.POSTS = [
  { date: '2026·03', flair: 'AI agents',
    title: 'MicroAgent', url: 'https://shashankbl.substack.com/p/microagent' },
  { date: '2026·03', flair: 'AI agents',
    title: 'MicroAgent — Part 2', url: 'https://shashankbl.substack.com/p/microagent-part-2' },
  { date: '2026·03', flair: 'AI agents',
    title: 'MicroAgent — Part 3', url: 'https://shashankbl.substack.com/p/microagent-part-3' },
  { date: '2026·04', flair: 'Robotics',
    title: 'Keeping Old Robots Cool With New Tricks', url: 'https://shashankbl.substack.com/p/keeping-old-robots-cool-with-new' },
  { date: '2026·04', flair: 'Career',
    title: 'Think Like a Game Theorist', url: 'https://shashankbl.substack.com/p/think-like-a-game-theorist' },
  { date: '2026·04', flair: 'Career',
    title: 'Bet hard on your human skills', url: 'https://shashankbl.substack.com/p/bet-hard-on-your-human-skills' },
];

window.OSS = [
  { name: 'zumo-shield-arduino-rev4wifi-library', role: 'Author', year: '2026',
    tag: 'EMBEDDED · ROBOTICS',
    desc: 'Port of the Pololu Zumo Arduino library (v1.3) from Uno R3 (8-bit AVR) to Uno R4 WiFi (Renesas RA4M1, 32-bit ARM Cortex-M4). Existing AVR paths kept byte-identical behind compile-time guards — zero regression for R3 users. Built as a side quest with Claude Code pair-programming, then debugged on hardware.',
    url: 'https://github.com/shashankbl/zumo-shield-arduino-rev4wifi-library/tree/feature/uno-r4-wifi-timers' },

  { name: 'LiveResume', role: 'Author · MIT licensed', year: '2026',
    tag: 'TOOLING · DEV',
    desc: 'Turn a Markdown resume into a print-ready PDF and host it on a GitHub Pages site. No build step or dependencies — vanilla HTML, CSS, and JavaScript; auto-detects the latest dated file in resume_md/.',
    url: 'https://github.com/shashankbl/LiveResume' },

  { name: 'PixelSynth', role: 'Author · MIT licensed', year: '2025',
    tag: 'CREATIVE CODING · ART',
    desc: 'A creative-coding tool that uses Python to procedurally compile and generate interactive p5.js sketches for live webcam manipulation — so indie artists can make fun music videos at zero budget. Vibe-coded.',
    url:  'https://github.com/shashankbl/pixelsynth',
    demo: 'https://shashankbl.github.io/pixelsynth/' },
];

window.NEWS = [
  // { date: 'YYYY·MM', outlet: 'Outlet', title: 'Headline / segment',
  //   url: 'https://example.com/article', loc: 'Article · podcast · video' },
];

window.ART = [
  // { id: 'piece-id', title: 'Title', year: '2026',
  //   medium: 'Acrylic on canvas', tags: ['tag1', 'tag2'],
  //   image: 'images/artwork/piece.jpg', thumbnail: 'images/artwork/piece-thumb.jpg',
  //   description: 'Optional notes about the piece.' },
  { id: 'sea-of-blue', title: 'Sea of blue', year: '2025',
    tags: ['py5', 'computationalart'],
    image: 'images/artwork/generative-art-arrays.webp' },
  { id: 'fired-by-passion-act-1', title: 'Fired by Passion · Act 1', year: '2017',
    medium: 'Acrylic pour on canvas · 24″ × 18″',
    image: 'images/artwork/DanceOfTheHummingbirds_ONE.webp',
    description: "An artist's passion burns bright as the fire in earth's bosom, it only seeks the light that is timeless and eternal. This painting focuses on a passionate artist's struggle to find a righteous place for their sacred art. Visual art for Dance of the Hummingbirds by Vid. Jayanthi Raman (Portland, Oregon USA, 2017)." },
];

window.RESEARCH = {
  active: [
    // { id: 'proj-id', year: '2026', title: 'Title', blurb: 'One-liner.',
    //   status: 'In progress', url: 'https://...' },
  ],
  publications: [
    { date: '2025', kind: 'science', venue: 'IOVS 66(8)',
      title: 'High-Resolution Wireless EOG Sensor for Real-Time Characterization of Blink Kinematics',
      authors: 'H Govinde, SR Singh, SB Lakshman, P Padmanabhan, S Rachapalli, et al.',
      url: 'https://iovs.arvojournals.org/article.aspx?articleid=2804475',
      loc: 'Journal · abstract' },
    { date: '2022', kind: 'engineering', venue: 'SERP4IoT',
      title: 'Software engineering approaches for TinyML based IoT embedded vision: A systematic literature review',
      authors: 'SB Lakshman, NU Eisty',
      url: 'https://dl.acm.org/doi/10.1145/3528227.3528569',
      loc: 'Workshop · paper' },
  ],
  collaborators: [
    // { name: 'Name', affiliation: 'Lab / University', url: 'https://...' },
  ],
};

// Capabilities (what I do)
window.SKILLS = [
  { group: 'Hardware Engineering',
    items: ['Silicon characterization', 'System validation', 'Probing', 'RTL Design Verification', 'Circuit Design', 'Embedded Systems', 'Sensors and Actuators'] },
  { group: 'Machine Learning',
    items: ['Pre-training', 'Fine-tuning (PEFT / QLoRA)', 'Inference deployment', 'Model evals'] },
  { group: 'AI Engineering',
    items: ['NLP', 'LLM & Agentic AI', 'RAG', 'Computer vision', 'MLOps'] },
  { group: 'Software Engineering',
    items: ['Spec-driven development', 'Web UI', 'API', 'Containerization', 'CI/CD · DevOps'] },
  { group: 'Leadership',
    items: ['Engineering management', 'Product ownership', 'Customer engagement', 'Technical writing', 'Patent disclosures'] },
];

// Specific tools, libraries, frameworks, hardware (what I use)
window.TOOLS = [
  { group: 'Languages',
    items: ['Python', 'C / C++', 'Verilog / SystemVerilog', 'SQL'] },
  { group: 'ML & DL',
    items: ['PyTorch', 'ONNX', 'scikit-learn', 'NumPy', 'Pandas', 'Hugging Face', 'OpenCV'] },
  { group: 'LLM stack',
    items: ['OpenAI SDK', 'LangChain', 'Autogen', 'Google ADK', 'MCP'] },
  { group: 'MLOps',
    items: ['Streamlit', 'Airflow', 'MLflow', 'Matplotlib'] },
  { group: 'Hardware',
    items: ['Nvidia A100 / T4 / RTX', 'Jetson Orin', 'Renesas R-Car SoC', 'Raspberry Pi', 'Arduino'] },
  { group: 'Cloud & DevTools',
    items: ['Azure', 'Linux', 'Claude Code', 'OpenCode'] },
];

window.TALKS = [
  { date: '2026·04', venue: 'Los Rios STEM Fair',
    title: 'Keynote · STEM Professional 2.0: Thriving on the Razor Edge of AI',
    loc: 'Folsom, CA' },
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
      { y: 'Oct 2024 → now', role: 'Engineering Lead and Manager · ML/MLOps',
        bullets: [
          'Experienced Engineer managing a team of engineers in the ML solutions team.',
          'Building LLM tools: RAG and Agents for engineering workflows.',
          'Deployed cloud-native workflows for AI model deployment and benchmarking on Renesas R-Car SoC.',
          'Product owner for "RoX AI Studio" (https://aistudio.renesas.com).',
        ] },
      { y: 'Jan 2024 → Oct 2024', role: 'Staff Software Engineer · ML/MLOps',
        bullets: [
          'Founding engineer at ML team that developed 0→1 MLOps product for automotive customers of Renesas R-Car SoC.',
          'Enabled workflows for AI model evaluation and benchmarking.',
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
      { y: 'Aug 2021 → Mar 2023', role: 'Senior Systems Engineer · AI Solutions',
        bullets: [
          'Technical leader for the AI acceleration solution (Micron DLA) — delivered AI accelerator demos and the "MDLA CEBU" benchmarking suite.',
          'Filed 20+ patents, demonstrating strong understanding of pathfinding and innovation in AI applications and hardware architectures.',
          'Built a customer-centric AI lab at the Folsom site to accelerate AI solutions; led two Ph.D. interns.',
          'Conducted competitor research on edge AI inference and PIM/PNM, influencing product strategy.',
        ] },
      { y: 'Aug 2015 → Aug 2021', role: 'Product Engineer II / III · Emerging Memories',
        bullets: [
          'Pathfinding for industry-first multi-Gb 3D NV-RAM through silicon electrical characterization of multi-tier, multi-Gb memory arrays (FeRAM and TFT).',
          'Created a novel bit-level silicon characterization and analytics technique that unlocked deeper insights into process and reliability engineering. Filed 4 patent disclosures on FeRAM memory management.',
        ] },
    ] },

  { co: 'SanDisk Corporation', loc: 'San Jose, CA', span: 'Jun 2013 → Jun 2015',
    logo: 'images/logos/sandisk.svg',
    roles: [
      { y: 'Jun 2014 → Jun 2015', role: 'Characterization Engineer II',
        bullets: [
          'Defined and executed product qualification for raw NAND for a leading consumer electronics OEM.',
        ] },
      { y: 'Jun 2013 → May 2014', role: 'ASIC Characterization',
        note: 'Internship · 1 yr',
        bullets: [
          'Performed PVT characterization of NAND controller IP (TSMC 28nm analog node), with bench lab electrical measurement equipment (JTAG debugger, mixed-signal oscilloscope, function generator, electronic load, continuity tester, and temperature controller).',
          'Hands-on experience in test development (Perl), automation (VBA), and statistical analysis techniques (Excel). Gained a good understanding of design spec requirements of NAND controller for eMMC solutions (mobile segment, iNAND).',
        ] },
    ] },

  { co: 'Bosch', loc: 'Bangalore, India', span: 'Feb 2010 → Jun 2012',
    logo: 'images/logos/bosch.svg',
    roles: [
      { y: 'Sep 2010 → Jun 2012', role: 'Software Engineer · Powertrain Systems',
        bullets: [
          'Developed and validated automotive embedded platform software for global OEM customers.',
        ] },
      { y: 'Feb 2010 → Jun 2010', role: 'Project Intern',
        note: 'Internship · 5 mos',
        bullets: [
          'Developed online production monitoring system for Industrial CNC, using PLC+HMI (Bosch Rexroth) and proximity+position sensors (Festo) to provide real-time insights to senior managers overseeing the production of diesel pump camshafts.',
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
      { y: 'Jan 2020 → Jun 2022', role: 'Ph.D. program in Computer Science',
        note: 'Withdrew from program · graduate coursework in ML / DL / NLP / AI.',
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
    { name: 'San Jose State University',  short: 'San Jose State',                                          kind: 'school',   cc: 'US' },
    { name: 'Visvesvaraya Technological University',                  short: 'Visvesvaraya Tech Univ',                                           kind: 'school',   cc: 'IN' },
  ],
};

window.NOW_LINES = [
  'Leading ML and Agentic solutions at Renesas — building RoX AI Studio for R-Car SoC customers.',
  'Pursuing M.S. in Artificial Intelligence at UT Austin.',
  'Researching LLM-aided design and efficient on-device ML.',
  'AI technical advisor at Folsom Lake College and industry evaluator at UC Davis.',
  'AI-assisted prototyping in robotics and autonomous AI agents.',
];
