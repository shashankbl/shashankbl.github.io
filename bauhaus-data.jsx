// bauhaus-data.jsx — Static content for the Bauhaus portfolio.

window.SITE = {
  name: 'Shashank Bangalore Lakshman',
  short: 'Shashank BL',
  tagline: 'Engineer at the intersection of AI and silicon.',
  blurb: 'I build the systems that make models faster — and the silicon that makes them possible. Compilers, kernels, accelerators.',
  location: 'Austin, TX',
  status: 'Open to collaborations · talks',
  social: {
    github:   'https://github.com/shashankbl',
    linkedin: 'https://www.linkedin.com/in/shashankbl/',
    scholar:  'https://scholar.google.com/citations?user=_BI5HM8AAAAJ&hl=en',
  },
};

window.PROJECTS = [
  { id: 'moe-compiler', n: '001', title: 'MoE Inference Compiler', tag: 'AI · SYSTEMS', year: '2025',
    blurb: 'Graph rewriter and codegen pipeline for sparse mixture-of-experts. Cuts serving cost ~38% across A100/H100 fleets.',
    stack: 'CUDA · MLIR · C++', loc: '~24k LOC' },
  { id: 'rv-vector-core', n: '002', title: 'RISC-V Vector Core', tag: 'SILICON', year: '2024',
    blurb: 'Tape-out of a 7nm vector ISA extension targeting on-device LLM workloads. Owned RTL → DV → bring-up.',
    stack: 'Verilog · Chisel · 7nm', loc: 'Tape-out' },
  { id: 'tensor-sched', n: '003', title: 'Tensor Scheduler', tag: 'OSS · SOFTWARE', year: '2024',
    blurb: 'Latency-aware scheduler for heterogeneous accelerators. In production at four teams. 3.1k stars.',
    stack: 'Rust · Python · gRPC', loc: 'github.com/shashankbl/tensor-sched' },
  { id: 'whisper-edge', n: '004', title: 'On-Device ASR Runtime', tag: 'AI · EDGE', year: '2023',
    blurb: 'Streaming Whisper-class runtime under 80MB, 4× realtime on mobile NPUs.',
    stack: 'C++ · ONNX · NPU', loc: 'Internal' },
];

window.POSTS = [
  { date: '2026-03-12', slug: 'moe-memory-problem',
    title: 'Why MoE serving is a memory problem, not a compute problem', read: '12 min',
    blurb: 'Expert-routing latency, KV cache pressure, and why "more FLOPs" is the wrong dial.' },
  { date: '2025-11-02', slug: 'vector-isa',
    title: 'Building a vector ISA from first principles', read: '18 min',
    blurb: 'Notes from a tape-out: what I would change about RVV, and what surprised me about it.' },
  { date: '2025-08-19', slug: 'compiler-is-the-model',
    title: 'The compiler is the model: AI/HW co-design', read: '9 min',
    blurb: 'A short polemic. Models are graphs. Graphs are programs. Programs need compilers, not frameworks.' },
  { date: '2025-04-08', slug: 'inference-bottlenecks',
    title: 'A taxonomy of inference bottlenecks for transformer workloads', read: '14 min',
    blurb: 'A working checklist; you can have it.' },
];

window.TALKS = [
  { date: '2026·05', venue: 'HotChips ’26',  title: 'A vector ISA for the on-device era', loc: 'Stanford' },
  { date: '2025·09', venue: 'MLSys ’25',     title: 'Sparse MoE serving at low cost',    loc: 'Vancouver' },
  { date: '2024·11', venue: 'NeurIPS ’24',   title: 'Co-design or perish: lessons from RTL → MLIR', loc: 'New Orleans' },
  { date: '2024·06', venue: 'PyTorch Conf',  title: 'Latency-aware scheduling for heterogeneous accelerators', loc: 'Online' },
];

window.RESUME = [
  { y: '2022 → now',  role: 'Staff Engineer · AI / Silicon', co: 'Stealth-mode startup',
    d: 'Inference compilers, custom accelerator co-design, model serving infrastructure.' },
  { y: '2018 → 2022', role: 'Senior Engineer · ML Systems', co: 'Large semis company',
    d: 'Tape-outs of two NPUs. Owned the kernel + compiler stack from frontend to bring-up.' },
  { y: '2014 → 2018', role: 'Engineer · Compilers / Architecture', co: 'Foundational chip company',
    d: 'CPU vector backend. Patches upstreamed in LLVM.' },
];

window.NOW_LINES = [
  'Writing about vector ISAs and what RVV gets right (and wrong).',
  'Tinkering with on-device MoE — single-laptop serving experiments.',
  'Reading: Theodore Gray, "The Elements"; Hennessy & Patterson, 6th ed.',
  'Talks: HotChips ’26 next month.',
  'Available for collaborations on AI/HW co-design.',
];

window.NOW_DATE = '2026·04·21';
