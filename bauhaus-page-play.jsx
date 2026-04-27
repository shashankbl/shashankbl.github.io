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

// Procedural-but-deterministic terrain via p5's Perlin noise. Border is scrap;
// horizontal + vertical "main roads" cut through the spawn for a sense of
// place; a 7×7 clearing around the spawn guarantees the robot can always move.
function buildMap(p) {
  p.noiseSeed(1337);
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

// ─── p5 sketch factory ──────────────────────────────────────────────────────

function makeSketch(api) {
  return function sketch(p) {
    const TILE = 32;
    const W = COLS_V * TILE;
    const H = ROWS_V * TILE;

    const sprites = {};
    let map = null;

    let player = { col: SPAWN_C, row: SPAWN_R, dir: 'down' };
    let move = null;                 // { fromCol, fromRow, toCol, toRow, t }
    let bobT = 0;
    const camera = { x: 0, y: 0 };

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
      map = buildMap(p);
      updateCamera();
      api.onReady && api.onReady();
    };

    api.input = (action) => handleInput(action);

    p.keyPressed = () => {
      const k = p.key;
      if (p.keyCode === p.UP_ARROW    || k === 'w' || k === 'W') handleInput('up');
      else if (p.keyCode === p.DOWN_ARROW  || k === 's' || k === 'S') handleInput('down');
      else if (p.keyCode === p.LEFT_ARROW  || k === 'a' || k === 'A') handleInput('left');
      else if (p.keyCode === p.RIGHT_ARROW || k === 'd' || k === 'D') handleInput('right');
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
      if (nc < 0 || nc >= COLS_W || nr < 0 || nr >= ROWS_W) return;
      if (!passable(map[nr][nc])) return;
      move = { fromCol: player.col, fromRow: player.row, toCol: nc, toRow: nr, t: 0 };
    }

    function finishMove() {
      player.col = move.toCol;
      player.row = move.toRow;
      move = null;
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
        move.t += 1 / 11;  // ~180ms per tile
        if (move.t >= 1) finishMove();
      }
      updateCamera();
      drawWorld();
    };

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
      // player
      const pp = playerPixel();
      const bob = move ? Math.sin(move.t * Math.PI) * 1.5 : Math.sin(bobT * 4) * 0.6;
      if (sprites.robot) p.image(sprites.robot, pp.x - camera.x, pp.y - camera.y - bob, TILE, TILE);
    }
  };
}

// ─── React component ────────────────────────────────────────────────────────

window.PlayPage = function PlayPage() {
  const screenRef = useRef(null);
  const apiRef = useRef({ input: () => {} });

  useEffect(() => {
    if (!screenRef.current) return;
    if (typeof window.p5 === 'undefined') {
      console.warn('p5.js not loaded yet');
      return;
    }
    const api = { input: () => {}, onReady: null };
    apiRef.current = api;

    const sketch = makeSketch(api);
    const instance = new window.p5(sketch, screenRef.current);

    return () => instance.remove();
  }, []);

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
        Wander the scrap fields. Arrow keys / WASD to walk on a desktop, or use the on-screen
        pad below.
      </p>

      <div className="play-phone reveal" role="application" aria-label="Robot adventure mini-game">
        <div className="play-statusbar">
          <span>● PLAY · v1</span>
          <span style={{ color: 'var(--accent)' }}>FREE ROAM</span>
          <span>100 × 60</span>
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
        Built with <a className="hover-line" href="https://p5js.org/" target="_blank" rel="noreferrer" style={{ color: 'var(--ink)' }}>p5.js</a>.
      </p>
    </section>
  );
};

})();
