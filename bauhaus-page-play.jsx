// bauhaus-page-play.jsx — Play page: free-roam Wall-E-style robot explorer
// rendered into a landscape phone-frame canvas via p5.js.
(function() {

const { useEffect, useRef } = React;

// ─── Game data ──────────────────────────────────────────────────────────────

// Tile codes
const T = {
  SAND: 0,
  PATH: 1,
  JUNK: 2,   // passable, just visual variety
  SCRAP: 3,  // impassable
};

// World is 100 × 60 tiles; viewport (visible window) is 16 × 9 tiles.
const COLS_W = 100;
const ROWS_W = 60;
const COLS_V = 16;
const ROWS_V = 9;
const SPAWN_C = 50;
const SPAWN_R = 30;
const SPAWN_CLEAR_RADIUS = 3;

// Procedural terrain via p5's Perlin noise, parameterised by a seed so each
// session yields a different layout. Border is scrap; horizontal + vertical
// "main roads" cut through spawn; a 7×7 clearing around spawn guarantees the
// robot can always move.
function buildMap(p, seed) {
  p.noiseSeed(seed);
  const grid = [];
  for (let r = 0; r < ROWS_W; r++) {
    const row = [];
    for (let c = 0; c < COLS_W; c++) {
      if (r === 0 || r === ROWS_W - 1 || c === 0 || c === COLS_W - 1) {
        row.push(T.SCRAP);
        continue;
      }
      const v = p.noise(c * 0.18, r * 0.18);
      let tile;
      if      (v < 0.32) tile = T.SCRAP;
      else if (v < 0.42) tile = T.JUNK;
      else if (v < 0.50) tile = T.PATH;
      else               tile = T.SAND;
      row.push(tile);
    }
    grid.push(row);
  }
  // Carve main roads
  for (let c = 1; c < COLS_W - 1; c++) grid[SPAWN_R][c] = T.PATH;
  for (let r = 1; r < ROWS_W - 1; r++) grid[r][SPAWN_C] = T.PATH;
  // Clear the spawn area so the robot starts on a usable patch
  for (let r = SPAWN_R - SPAWN_CLEAR_RADIUS; r <= SPAWN_R + SPAWN_CLEAR_RADIUS; r++) {
    for (let c = SPAWN_C - SPAWN_CLEAR_RADIUS; c <= SPAWN_C + SPAWN_CLEAR_RADIUS; c++) {
      if (r < 1 || r >= ROWS_W - 1 || c < 1 || c >= COLS_W - 1) continue;
      if (grid[r][c] === T.SCRAP) grid[r][c] = T.SAND;
    }
  }
  return grid;
}

function passable(tile) {
  return tile === T.SAND || tile === T.PATH || tile === T.JUNK;
}

// Robot sprite faces "down" (south) by default. Map travel direction → radians.
const DIR_ANGLE = {
  down:  0,
  left:  Math.PI / 2,
  up:    Math.PI,
  right: -Math.PI / 2,
};

// ─── Chiptune sound effects ─────────────────────────────────────────────────
// Square-wave synth via Web Audio. Default muted (preference in localStorage).

function tone(ctx, t, freq, dur, vol) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.005);
  gain.gain.linearRampToValueAtTime(0, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur);
}

function fmtTime(sec) {
  if (sec == null) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m + ':' + String(s).padStart(2, '0');
}

const SOUNDS = {
  step: (ctx) => tone(ctx, ctx.currentTime, 220,  0.04, 0.025),
  bump: (ctx) => tone(ctx, ctx.currentTime,  90,  0.10, 0.060),
  gem:  (ctx) => {
    const t = ctx.currentTime;
    tone(ctx, t,        880,  0.07, 0.06);
    tone(ctx, t + 0.06, 1320, 0.10, 0.06);
  },
  core: (ctx) => {
    // Celebratory fanfare: rising C-major arpeggio + held triad.
    const t = ctx.currentTime;
    tone(ctx, t,         523, 0.06, 0.06);  // C5
    tone(ctx, t + 0.05,  659, 0.06, 0.06);  // E5
    tone(ctx, t + 0.10,  784, 0.06, 0.06);  // G5
    tone(ctx, t + 0.15, 1047, 0.06, 0.07);  // C6
    tone(ctx, t + 0.20, 1319, 0.07, 0.07);  // E6
    tone(ctx, t + 0.28, 1568, 0.30, 0.07);  // G6 (held)
    tone(ctx, t + 0.28, 2093, 0.30, 0.05);  // C7 harmony
  },
  hit: (ctx) => {
    const t = ctx.currentTime;
    tone(ctx, t,        110, 0.12, 0.10);
    tone(ctx, t + 0.05,  73, 0.18, 0.10);
  },
};

const BOT_COUNT = 4;
const BOT_STEP_FRAMES = 22;     // pause between steps
const BOT_MOVE_SPEED = 0.05;    // per frame; ~20 frames per tile (~330ms)
const HIT_PENALTY = 5;
const HIT_COOLDOWN_MS = 900;

function placeBots(p, map, seed) {
  p.randomSeed(seed);
  const candidates = [];
  for (let r = 1; r < ROWS_W - 1; r++) {
    for (let c = 1; c < COLS_W - 1; c++) {
      if (Math.abs(r - SPAWN_R) <= 6 && Math.abs(c - SPAWN_C) <= 6) continue;
      if (map[r][c] === T.PATH) candidates.push({ r, c });
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(p.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, BOT_COUNT).map(({ r, c }) => ({
    col: c, row: r, dir: 'down',
    fromCol: c, fromRow: r, toCol: c, toRow: r,
    t: 1,
  }));
}

const GEM_COUNT = 100;
const CORE_COUNT = 5;

// Seeded placement of gems (yellow) and cores (cyan, scrap-rich tiles) on
// passable tiles, excluding the spawn clearing.
function placeGems(p, map, seed) {
  p.randomSeed(seed);
  const candidates = [];
  for (let r = 1; r < ROWS_W - 1; r++) {
    for (let c = 1; c < COLS_W - 1; c++) {
      if (Math.abs(r - SPAWN_R) <= 1 && Math.abs(c - SPAWN_C) <= 1) continue;
      if (passable(map[r][c])) candidates.push({ r, c });
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(p.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  // Cores prefer scrap-heavy neighborhoods (5x5 window with >= 10 scrap tiles).
  const cores = new Set();
  for (const { r, c } of candidates) {
    if (cores.size >= CORE_COUNT) break;
    let scraps = 0;
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const rr = r + dr, cc = c + dc;
        if (rr < 0 || rr >= ROWS_W || cc < 0 || cc >= COLS_W) continue;
        if (map[rr][cc] === T.SCRAP) scraps++;
      }
    }
    if (scraps >= 10) cores.add(r + '_' + c);
  }
  // Gems from remaining candidates.
  const gems = new Set();
  for (const { r, c } of candidates) {
    if (gems.size >= GEM_COUNT) break;
    const key = r + '_' + c;
    if (cores.has(key)) continue;
    gems.add(key);
  }
  return { gems, cores };
}

// ─── p5 sketch factory ──────────────────────────────────────────────────────

function makeSketch(api) {
  return function sketch(p) {
    const TILE = 32;
    const W = COLS_V * TILE;
    const H = ROWS_V * TILE;

    const sprites = {};
    let map = null;
    let gems = new Set();
    let cores = new Set();
    let gemsTotal = 0;
    let coresTotal = 0;
    let gemsCollected = 0;
    let coresCollected = 0;
    let sessionSeed = 0;

    function regenerate() {
      sessionSeed = 1000 + Math.floor(Math.random() * 9000);
      map = buildMap(p, sessionSeed);
      ({ gems, cores } = placeGems(p, map, sessionSeed * 7 + 1));
      bots = placeBots(p, map, sessionSeed * 13 + 3);
      gemsTotal = gems.size;
      coresTotal = cores.size;
      api.onSeed && api.onSeed(sessionSeed);
    }

    function notifyProgress() {
      api.onProgress && api.onProgress({
        gems: gemsCollected, gemsTotal,
        cores: coresCollected, coresTotal,
      });
    }

    let player = { col: SPAWN_C, row: SPAWN_R, dir: 'down' };
    let move = null;                 // { fromCol, fromRow, toCol, toRow, t, speed }
    let bots = [];
    let botFrames = 0;
    let lastHitAt = 0;
    let bobT = 0;
    const camera = { x: 0, y: 0 };
    let minimapVisible = false;

    p.preload = () => {
      sprites.robot = p.loadImage('images/play/robot.svg');
      sprites.sand  = p.loadImage('images/play/sand.svg');
      sprites.path  = p.loadImage('images/play/path.svg');
      sprites.junk  = p.loadImage('images/play/junk.svg');
      sprites.scrap = p.loadImage('images/play/scrap.svg');
    };

    p.setup = () => {
      p.createCanvas(W, H);
      p.frameRate(60);
      p.textFont('IBM Plex Mono, ui-monospace, monospace');
      regenerate();
      updateCamera();
      notifyProgress();
      api.onReady && api.onReady();
    };

    api.input = (action) => handleInput(action);
    api.reset = () => {
      player = { col: SPAWN_C, row: SPAWN_R, dir: 'down' };
      move = null;
      gemsCollected = 0;
      coresCollected = 0;
      botFrames = 0;
      lastHitAt = 0;
      regenerate();
      updateCamera();
      notifyProgress();
    };

    p.keyPressed = () => {
      const k = p.key;
      if      (k === 'w' || k === 'W') handleInput('up');
      else if (k === 's' || k === 'S') handleInput('down');
      else if (k === 'a' || k === 'A') handleInput('left');
      else if (k === 'd' || k === 'D') handleInput('right');
      else if (k === 'm' || k === 'M') minimapVisible = !minimapVisible;
    };

    function handleInput(action) {
      if (move) return;
      if (action === 'up')    tryMove(0, -1, 'up');
      if (action === 'down')  tryMove(0,  1, 'down');
      if (action === 'left')  tryMove(-1, 0, 'left');
      if (action === 'right') tryMove( 1, 0, 'right');
    }

    function tryMove(dc, dr, dir) {
      player.dir = dir;
      const nc = player.col + dc;
      const nr = player.row + dr;
      if (nc < 0 || nc >= COLS_W || nr < 0 || nr >= ROWS_W) {
        api.playSound && api.playSound('bump');
        return;
      }
      if (!passable(map[nr][nc])) {
        api.playSound && api.playSound('bump');
        return;
      }
      const sprinting = p.keyIsDown(p.SHIFT);
      move = {
        fromCol: player.col, fromRow: player.row,
        toCol: nc, toRow: nr, t: 0,
        speed: sprinting ? 1 / 6 : 1 / 11,
      };
      api.playSound && api.playSound('step');
    }

    function finishMove() {
      player.col = move.toCol;
      player.row = move.toRow;
      move = null;
      const key = player.row + '_' + player.col;
      if (gems.has(key)) {
        gems.delete(key);
        gemsCollected++;
        notifyProgress();
        api.playSound && api.playSound('gem');
      } else if (cores.has(key)) {
        cores.delete(key);
        coresCollected++;
        notifyProgress();
        api.playSound && api.playSound('core');
      }
    }

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    function playerPixel() {
      let pc = player.col;
      let pr = player.row;
      if (move) {
        const ease = 1 - Math.pow(1 - move.t, 2);
        pc = move.fromCol + (move.toCol - move.fromCol) * ease;
        pr = move.fromRow + (move.toRow - move.fromRow) * ease;
      }
      return { x: pc * TILE, y: pr * TILE };
    }

    function updateCamera() {
      const { x, y } = playerPixel();
      camera.x = clamp(x - W / 2 + TILE / 2, 0, COLS_W * TILE - W);
      camera.y = clamp(y - H / 2 + TILE / 2, 0, ROWS_W * TILE - H);
    }

    p.draw = () => {
      bobT += 1 / 60;
      if (move) {
        move.t += move.speed;
        if (move.t >= 1) finishMove();
      }
      updateBots();
      checkBotCollision();
      updateCamera();
      drawWorld();
    };

    function updateBots() {
      botFrames++;
      for (const bot of bots) {
        if (bot.t < 1) {
          bot.t = Math.min(1, bot.t + BOT_MOVE_SPEED);
          if (bot.t >= 1) {
            bot.col = bot.toCol;
            bot.row = bot.toRow;
          }
          continue;
        }
        if (botFrames % BOT_STEP_FRAMES !== 0) continue;
        // Pick a direction; bias 60% toward continuing forward.
        const dirs = [[0,-1,'up'], [0,1,'down'], [-1,0,'left'], [1,0,'right']];
        const order = Math.random() < 0.6
          ? [dirs.find(d => d[2] === bot.dir), ...dirs.filter(d => d[2] !== bot.dir).sort(() => Math.random() - 0.5)]
          : dirs.slice().sort(() => Math.random() - 0.5);
        for (const opt of order) {
          if (!opt) continue;
          const [dc, dr, dir] = opt;
          const nc = bot.col + dc, nr = bot.row + dr;
          if (nc < 1 || nc >= COLS_W - 1 || nr < 1 || nr >= ROWS_W - 1) continue;
          if (map[nr][nc] !== T.PATH) continue;
          bot.dir = dir;
          bot.fromCol = bot.col; bot.fromRow = bot.row;
          bot.toCol = nc; bot.toRow = nr;
          bot.t = 0;
          break;
        }
      }
    }

    function checkBotCollision() {
      const now = Date.now();
      if (now - lastHitAt < HIT_COOLDOWN_MS) return;
      for (const bot of bots) {
        if (bot.col === player.col && bot.row === player.row) {
          lastHitAt = now;
          gemsCollected = Math.max(0, gemsCollected - HIT_PENALTY);
          notifyProgress();
          api.playSound && api.playSound('hit');
          return;
        }
      }
    }

    function drawWorld() {
      if (!map) return;
      const startC = Math.max(0, Math.floor(camera.x / TILE) - 1);
      const endC   = Math.min(COLS_W, startC + COLS_V + 3);
      const startR = Math.max(0, Math.floor(camera.y / TILE) - 1);
      const endR   = Math.min(ROWS_W, startR + ROWS_V + 3);
      // tiles (only the visible window)
      for (let r = startR; r < endR; r++) {
        for (let c = startC; c < endC; c++) {
          const t = map[r][c];
          let img = sprites.sand;
          if (t === T.PATH)  img = sprites.path;
          if (t === T.JUNK)  img = sprites.junk;
          if (t === T.SCRAP) img = sprites.scrap;
          if (img) p.image(img, c * TILE - camera.x, r * TILE - camera.y, TILE, TILE);
        }
      }
      // gems
      for (let r = startR; r < endR; r++) {
        for (let c = startC; c < endC; c++) {
          const key = r + '_' + c;
          if (gems.has(key)) drawGem(c * TILE - camera.x, r * TILE - camera.y);
          else if (cores.has(key)) drawCore(c * TILE - camera.x, r * TILE - camera.y);
        }
      }
      // bots
      drawBots();
      // player
      const pp = playerPixel();
      const bob = move ? Math.sin(move.t * Math.PI) * 1.5 : Math.sin(bobT * 4) * 0.6;
      if (sprites.robot) {
        const angle = DIR_ANGLE[player.dir] || 0;
        p.push();
        p.imageMode(p.CENTER);
        p.translate(pp.x - camera.x + TILE / 2, pp.y - camera.y - bob + TILE / 2);
        p.rotate(angle);
        p.image(sprites.robot, 0, 0, TILE, TILE);
        p.pop();
      }
      // minimap overlay
      drawMinimap();
    }

    function drawMinimap() {
      const MM_W = 120;
      const MM_H = 72;
      const MM_X = W - MM_W - 6;
      const MM_Y = 6;
      const sx = MM_W / COLS_W;
      const sy = MM_H / ROWS_W;

      p.push();
      p.noStroke();
      if (!minimapVisible) {
        // tiny "M" hint
        p.fill(20, 18, 14, 200);
        p.rect(W - 24, 6, 18, 14);
        p.fill(236, 230, 218, 220);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(10);
        p.text('M', W - 15, 13);
        p.pop();
        return;
      }

      // background panel
      p.fill(20, 18, 14, 230);
      p.rect(MM_X - 2, MM_Y - 2, MM_W + 4, MM_H + 4);

      // scrap tiles only (rest stays as panel bg)
      p.fill(70, 56, 44);
      for (let r = 0; r < ROWS_W; r++) {
        for (let c = 0; c < COLS_W; c++) {
          if (map[r][c] === T.SCRAP) p.rect(MM_X + c * sx, MM_Y + r * sy, sx + 0.5, sy + 0.5);
        }
      }

      // gems (yellow)
      p.fill(245, 200, 74, 220);
      for (const key of gems) {
        const u = key.indexOf('_');
        const r = +key.slice(0, u);
        const c = +key.slice(u + 1);
        p.rect(MM_X + c * sx, MM_Y + r * sy, sx + 0.5, sy + 0.5);
      }

      // cores (cyan, slightly larger)
      p.fill(80, 220, 240, 240);
      for (const key of cores) {
        const u = key.indexOf('_');
        const r = +key.slice(0, u);
        const c = +key.slice(u + 1);
        p.rect(MM_X + c * sx - 1, MM_Y + r * sy - 1, sx + 2.5, sy + 2.5);
      }

      // bots (red)
      p.fill(220, 60, 40, 230);
      for (const bot of bots) {
        const ease = 1 - Math.pow(1 - bot.t, 2);
        const bc = bot.fromCol + (bot.toCol - bot.fromCol) * ease;
        const br = bot.fromRow + (bot.toRow - bot.fromRow) * ease;
        p.rect(MM_X + bc * sx - 1, MM_Y + br * sy - 1, sx + 2, sy + 2);
      }

      // viewport rectangle
      p.noFill();
      p.stroke(236, 230, 218, 200);
      p.strokeWeight(1);
      p.rect(MM_X + (camera.x / TILE) * sx, MM_Y + (camera.y / TILE) * sy, COLS_V * sx, ROWS_V * sy);

      // player position
      p.noStroke();
      p.fill(212, 80, 42);
      const pmm = playerPixel();
      p.rect(MM_X + (pmm.x / TILE) * sx - 1, MM_Y + (pmm.y / TILE) * sy - 1, 3, 3);

      p.pop();
    }

    function drawGem(x, y) {
      const pulse = 0.85 + Math.sin(bobT * 5 + (x + y) * 0.02) * 0.15;
      const size = TILE * 0.34 * pulse;
      p.push();
      p.translate(x + TILE / 2, y + TILE / 2);
      p.rotate(Math.PI / 4);
      p.rectMode(p.CENTER);
      p.noStroke();
      // soft halo
      p.fill(245, 200, 74, 70);
      p.rect(0, 0, size * 1.9, size * 1.9, 2);
      // body
      p.fill(245, 200, 74, 240);
      p.rect(0, 0, size, size, 1.5);
      // bright corner highlight
      p.fill(255, 246, 210, 230);
      p.rect(-size * 0.2, -size * 0.2, size * 0.32, size * 0.32, 0.5);
      p.pop();
    }

    function drawBots() {
      for (const bot of bots) {
        const ease = 1 - Math.pow(1 - bot.t, 2);
        const bc = bot.fromCol + (bot.toCol - bot.fromCol) * ease;
        const br = bot.fromRow + (bot.toRow - bot.fromRow) * ease;
        const x = bc * TILE - camera.x + TILE / 2;
        const y = br * TILE - camera.y + TILE / 2;
        // off-screen cull
        if (x < -TILE || x > W + TILE || y < -TILE || y > H + TILE) continue;
        const size = TILE * 0.66;
        p.push();
        p.translate(x, y);
        p.rotate(DIR_ANGLE[bot.dir] || 0);
        p.noStroke();
        // shadow
        p.fill(0, 0, 0, 70);
        p.ellipse(0, size * 0.42, size * 0.8, size * 0.18);
        // body — dark with rust tint
        p.rectMode(p.CENTER);
        p.fill(58, 36, 26);
        p.rect(0, 0, size, size, 2);
        // head plate
        p.fill(82, 50, 36);
        p.rect(0, -size * 0.18, size * 0.78, size * 0.32, 1.5);
        // red eye/lens
        p.fill(220, 60, 40);
        p.ellipse(0, -size * 0.18, size * 0.22, size * 0.22);
        p.fill(255, 220, 200);
        p.ellipse(-size * 0.04, -size * 0.21, size * 0.07, size * 0.07);
        // belt detail
        p.fill(40, 22, 14);
        p.rect(0, size * 0.26, size * 0.84, size * 0.08);
        p.pop();
      }
    }

    function drawCore(x, y) {
      const pulse = 0.85 + Math.sin(bobT * 4 + (x + y) * 0.02) * 0.15;
      const size = TILE * 0.42 * pulse;
      p.push();
      p.translate(x + TILE / 2, y + TILE / 2);
      p.rotate(Math.PI / 4);
      p.rectMode(p.CENTER);
      p.noStroke();
      // wide outer halo
      p.fill(80, 200, 230, 50);
      p.rect(0, 0, size * 2.4, size * 2.4, 3);
      p.fill(80, 200, 230, 100);
      p.rect(0, 0, size * 1.7, size * 1.7, 2);
      // body — bright cyan
      p.fill(80, 220, 240, 240);
      p.rect(0, 0, size, size, 1.5);
      // bright highlight
      p.fill(220, 250, 255, 240);
      p.rect(-size * 0.22, -size * 0.22, size * 0.34, size * 0.34, 0.5);
      p.pop();
    }
  };
}

// ─── React component ────────────────────────────────────────────────────────

window.PlayPage = function PlayPage() {
  const screenRef = useRef(null);
  const apiRef = useRef({ input: () => {} });
  const [progress, setProgress] = React.useState({ gems: 0, gemsTotal: 100, cores: 0, coresTotal: 5 });
  const [seed, setSeed] = React.useState(null);
  const [muted, setMuted] = React.useState(() => {
    try {
      const v = localStorage.getItem('play-muted');
      return v == null ? true : v === '1';
    } catch { return true; }
  });
  const [sprint, setSprint] = React.useState(false);
  const [runStartedAt, setRunStartedAt] = React.useState(null);
  const [runEndedAt, setRunEndedAt] = React.useState(null);
  const [tick, setTick] = React.useState(0);
  const [best, setBest] = React.useState(() => {
    try { const v = localStorage.getItem('play-best'); return v ? +v : null; } catch { return null; }
  });

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Shift') setSprint(e.type === 'keydown');
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, []);

  const handleReset = React.useCallback(() => {
    apiRef.current.reset && apiRef.current.reset();
    setRunStartedAt(null);
    setRunEndedAt(null);
    setTick(0);
  }, []);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'r' || e.key === 'R') handleReset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleReset]);

  // Auto-start the timer on first pickup; stop and update best when all gems collected.
  React.useEffect(() => {
    const total = (progress.gems || 0) + (progress.cores || 0);
    if (total > 0 && runStartedAt == null) {
      setRunStartedAt(Date.now());
    }
    if (progress.gemsTotal > 0 && progress.gems >= progress.gemsTotal
        && runEndedAt == null && runStartedAt != null) {
      const end = Date.now();
      setRunEndedAt(end);
      const seconds = Math.floor((end - runStartedAt) / 1000);
      if (best == null || seconds < best) {
        setBest(seconds);
        try { localStorage.setItem('play-best', String(seconds)); } catch {}
      }
    }
  }, [progress, runStartedAt, runEndedAt, best]);

  // Live tick while a run is in progress.
  React.useEffect(() => {
    if (runStartedAt == null || runEndedAt != null) return;
    const id = setInterval(() => setTick(t => t + 1), 250);
    return () => clearInterval(id);
  }, [runStartedAt, runEndedAt]);

  const elapsedSec = runStartedAt == null
    ? 0
    : Math.max(0, Math.floor(((runEndedAt ?? Date.now()) - runStartedAt) / 1000));
  void tick; // re-renders driven by tick state for live timer
  const mutedRef = useRef(muted);
  const audioCtxRef = useRef(null);

  React.useEffect(() => {
    mutedRef.current = muted;
    try { localStorage.setItem('play-muted', muted ? '1' : '0'); } catch {}
  }, [muted]);

  const playSound = React.useCallback((name) => {
    if (mutedRef.current) return;
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      try { audioCtxRef.current = new Ctx(); } catch { return; }
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    if (SOUNDS[name]) SOUNDS[name](ctx);
  }, []);

  useEffect(() => {
    if (!screenRef.current) return;
    if (typeof window.p5 === 'undefined') {
      console.warn('p5.js not loaded yet');
      return;
    }
    const api = {
      input: () => {},
      onProgress: (p) => setProgress(p),
      onSeed: (s) => setSeed(s),
      playSound,
      onReady: null,
    };
    apiRef.current = api;

    const sketch = makeSketch(api);
    const instance = new window.p5(sketch, screenRef.current);

    return () => instance.remove();
  }, [playSound]);

  const press = (action) => apiRef.current.input(action);

  return (
    <section className="pad-x section-block" style={{ maxWidth: 880, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="09">Play</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        A tiny robot adventure.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 540, fontSize: 14.5 }}>
        Wander the scrap fields. WASD to walk, hold Shift to sprint, R to reset, M to toggle minimap.
        Or use the on-screen pad on a phone.
      </p>

      <div className="play-phone reveal" role="application" aria-label="Robot adventure mini-game">
        <div className="play-statusbar">
          <span style={{ color: sprint ? 'var(--accent)' : '#ece6da' }}>
            {sprint ? '▶ BOOST' : (seed != null ? `● PLAY #${seed}` : '● PLAY')}
          </span>
          <span>
            <span style={{ color: '#f5c84a' }}>◆ {progress.gems}/{progress.gemsTotal}</span>
            <span style={{ marginLeft: 10, color: '#67d8e6' }}>◇ {progress.cores}/{progress.coresTotal}</span>
          </span>
          <span style={{ color: runEndedAt != null ? '#f5c84a' : '#ece6da' }}>
            {fmtTime(elapsedSec)}
          </span>
          <button
            type="button"
            onClick={() => setMuted(m => !m)}
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            aria-pressed={!muted}
            style={{
              background: 'transparent', border: 0,
              color: muted ? 'rgba(236,230,218,.45)' : '#ece6da',
              font: '500 10px var(--mono)', letterSpacing: '.14em',
              textTransform: 'uppercase', padding: '2px 4px',
              cursor: 'pointer',
            }}
          >
            ♪ {muted ? 'OFF' : 'ON'}
          </button>
        </div>
        <div ref={screenRef} className="play-screen"/>
        <div className="play-controls">
          <div className="play-dpad">
            <button className="up"    aria-label="Up"    onMouseDown={() => press('up')}    onTouchStart={(e) => { e.preventDefault(); press('up'); }}>▲</button>
            <button className="left"  aria-label="Left"  onMouseDown={() => press('left')}  onTouchStart={(e) => { e.preventDefault(); press('left'); }}>◀</button>
            <button className="down"  aria-label="Down"  onMouseDown={() => press('down')}  onTouchStart={(e) => { e.preventDefault(); press('down'); }}>▼</button>
            <button className="right" aria-label="Right" onMouseDown={() => press('right')} onTouchStart={(e) => { e.preventDefault(); press('right'); }}>▶</button>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 18, color: 'var(--muted)', fontSize: 12, textAlign: 'center' }}>
        Best run: {fmtTime(best)}
        {' · '}
        <button onClick={handleReset} className="hover-line"
                style={{ background: 'transparent', border: 0, padding: 0, font: 'inherit', color: 'var(--ink)', cursor: 'pointer' }}>
          ↻ Reset
        </button>
        {' · '}
        Built with <a className="hover-line" href="https://p5js.org/" target="_blank" rel="noreferrer" style={{ color: 'var(--ink)' }}>p5.js</a>.
      </p>
    </section>
  );
};

})();
