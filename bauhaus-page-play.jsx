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

// 16 cols × 9 rows fits the 16:9 landscape phone screen.
const COLS = 16;
const ROWS = 9;

// Hand-authored map: 9 rows of 16 chars each.
const RAW_MAP = [
  'SSSSSSSSSSSSSSSS',
  'S..............S',
  'S.JJ..P........S',
  'S....PPP.SS....S',
  'S.SS..P........S',
  'S.....PPP..JJ..S',
  'S.JJ.....SS....S',
  'S..............S',
  'SSSSSSSSSSSSSSSS',
];

const CHAR_TILE = { '.': T.SAND, 'P': T.PATH, 'J': T.JUNK, 'S': T.SCRAP };

function buildMap() {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    const line = RAW_MAP[r];
    for (let c = 0; c < COLS; c++) {
      const ch = line[c] || '.';
      row.push(CHAR_TILE[ch] !== undefined ? CHAR_TILE[ch] : T.SAND);
    }
    grid.push(row);
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
    const W = COLS * TILE;
    const H = ROWS * TILE;

    const sprites = {};
    const map = buildMap();

    let player = { col: 1, row: 1, dir: 'down' };
    let move = null;                 // { fromCol, fromRow, toCol, toRow, t }
    let bobT = 0;

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
      if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) return;
      if (!passable(map[nr][nc])) return;
      move = { fromCol: player.col, fromRow: player.row, toCol: nc, toRow: nr, t: 0 };
    }

    function finishMove() {
      player.col = move.toCol;
      player.row = move.toRow;
      move = null;
    }

    p.draw = () => {
      bobT += 1 / 60;
      if (move) {
        move.t += 1 / 11;  // ~180ms per tile
        if (move.t >= 1) finishMove();
      }
      drawWorld();
    };

    function drawWorld() {
      // tiles
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = map[r][c];
          let img = sprites.sand;
          if (t === T.PATH)  img = sprites.path;
          if (t === T.JUNK)  img = sprites.junk;
          if (t === T.SCRAP) img = sprites.scrap;
          if (img) p.image(img, c * TILE, r * TILE, TILE, TILE);
        }
      }
      // player
      let px = player.col * TILE;
      let py = player.row * TILE;
      if (move) {
        const ease = 1 - Math.pow(1 - move.t, 2);
        px = (move.fromCol + (move.toCol - move.fromCol) * ease) * TILE;
        py = (move.fromRow + (move.toRow - move.fromRow) * ease) * TILE;
      }
      const bob = move ? Math.sin(move.t * Math.PI) * 1.5 : Math.sin(bobT * 4) * 0.6;
      if (sprites.robot) p.image(sprites.robot, px, py - bob, TILE, TILE);
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
          <span>16 × 9</span>
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
