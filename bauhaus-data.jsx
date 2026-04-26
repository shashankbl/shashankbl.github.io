// bauhaus-data.jsx — Static content for the Bauhaus portfolio.

window.SITE = {
  name: 'Shashank Bangalore Lakshman',
  short: 'Shashank Bangalore Lakshman',
  tagline: 'Silicon to Software Systems for AI',
  blurb: 'Engineering leader at the intersection of memory, compute, and AI. I build MLOps platforms and AI systems for edge accelerators — from silicon characterization to cloud-native deployment.',
  location: 'Folsom, CA',
  status: 'Open to collaborations · talks',
  social: {
    github:   'https://github.com/shashankbl',
    linkedin: 'https://www.linkedin.com/in/shashankbl/',
    scholar:  'https://scholar.google.com/citations?user=_BI5HM8AAAAJ&hl=en',
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

window.RESUME = [
  { y: 'Jan 2024 → now', role: 'Engineering Lead and Manager · ML', co: 'Renesas Electronics America',
    d: 'Product owner for "RoX AI Studio", a cloud-native MLOps platform for Renesas R-Car SoC customers — enables HIL performance evaluation for BYO models via a custom Web UI; featured at Renesas CES demo pavilion. Joined as founding Staff Engineer, developed the 0→1 product, and was promoted to Manager within a year. Reduced AI SDK setup time from 6hrs to under 30 mins through CI/CD on Azure. Three patent disclosures pertaining to novel MLOps. Scaled and managed a global team from 2 to 6 engineers.' },

  { y: 'Mar 2023 → Dec 2023', role: 'Senior Systems Architect · Automotive', co: 'Micron Technology · Folsom CA & Boise ID',
    d: 'Systems architect for US and Japan OEM/Tier-1 automotive engagements. Analyzed memory & compute requirements for L3/L4 ADAS and mid/high-segment IVI. Mapped trending automotive AI workloads to memory systems requirements to influence the automotive memory/storage product roadmap. Evangelized memory products through demos and workshops in the US and Japan.' },

  { y: 'Aug 2021 → Mar 2023', role: 'Senior Systems Architect · AI Solutions', co: 'Micron Technology · Folsom CA & Boise ID',
    d: 'Technical leader for the Micron DLA AI acceleration solution — delivered AI accelerator demos and the "MDLA CEBU" benchmarking suite. Filed 20+ patent disclosures across AI applications and hardware architectures. Built a customer-centric AI lab in Folsom and mentored two Ph.D. interns. Conducted competitor research on edge AI inference, PIM/PNM and influenced product strategy.' },

  { y: 'Aug 2015 → Aug 2021', role: 'Product Engineer II / III · Emerging Memories', co: 'Micron Technology · Folsom CA & Boise ID',
    d: 'Pathfinding for industry-first multi-Gb 3D NV-RAM through silicon electrical characterization of multi-tier, multi-Gb memory arrays (FeRAM and TFT). Created a novel bit-level silicon characterization and analytics technique that unlocked deeper insights into process and reliability engineering. Four patents filed on FeRAM memory management.' },

  { y: 'Jun 2014 → Jun 2015', role: 'Characterization Engineer II', co: 'SanDisk Corporation · San Jose, CA',
    d: 'Defined and executed product qualification for raw NAND for a leading consumer electronics OEM.' },

  { y: 'Sep 2010 → Jun 2012', role: 'Software Engineer · Powertrain Systems', co: 'Bosch · Bangalore, India',
    d: 'Developed and validated automotive embedded platform software for global OEM customers.' },

  { y: 'Aug 2025 → now', role: 'M.S. in Artificial Intelligence', co: 'The University of Texas at Austin',
    d: 'Coursework: Case Studies in ML, Natural Language Processing, Deep Learning, Ethics in AI. Research interests: LLM-aided design, efficient on-device ML.' },

  { y: 'Jan 2020 → Jun 2022', role: 'Graduate Coursework in Machine Learning (non-degree)', co: 'Boise State University, ID',
    d: 'Machine Learning, Deep Learning, NLP, Artificial Intelligence, Design and Analysis of Algorithms, Advanced Software Engineering.' },

  { y: 'Aug 2012 → May 2014', role: 'M.S. in Electrical Engineering', co: 'San Jose State University, CA',
    d: 'Digital System Design and Synthesis, Advanced Computer Architectures, SoC Design and Verification with SystemVerilog, Digital Design for DSP (FPGA).' },

  { y: 'Sep 2006 → Jun 2010', role: 'B.E. in Electrical and Electronics Engineering', co: 'VTU, India',
    d: 'C programming, Embedded Systems, Control Systems, Analog and Digital Electronics.' },
];

window.NOW_LINES = [
  'Leading ML engineering at Renesas — building RoX AI Studio for R-Car SoC customers.',
  'Pursuing M.S. in Artificial Intelligence at UT Austin (Case Studies in ML, NLP, DL, Ethics in AI).',
  'Researching LLM-aided design and efficient on-device ML.',
  'Volunteering as AI technical advisor at Folsom Lake College CS and industry evaluator at UC Davis.',
  'Open to collaborations and talks on edge AI inference, AI/HW co-design, and MLOps for embedded systems.',
];

window.NOW_DATE = '2026·04·25';
