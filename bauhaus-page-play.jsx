// bauhaus-page-play.jsx — Play page: tiny Wall-E-style robot explorer with
// turn-based skirmishes, rendered into a phone-frame canvas via p5.js.
(function() {

const { useEffect, useRef, useState } = React;

// ─── Game data ──────────────────────────────────────────────────────────────

// Tile codes
const T = {
  SAND: 0,
  PATH: 1,
  JUNK: 2,   // tall-grass equivalent — encounters trigger here
  SCRAP: 3,  // impassable
};

// 9 cols × 14 rows fits the 9:14 phone screen aspect.
const COLS = 9;
const ROWS = 14;

// Hand-authored map: 14 rows of 9 chars each.
const RAW_MAP = [
  'SSSSSSSSS',
  'S....P..S',
  'S.JJ.P..S',
  'S....P.SS',
  'SS...PPP.',  // path bends — last cell is '.' to leave it traversable
  'S....J.JS',
  'S.SS....S',
  'S....P..S',
  'S.JJ.P.SS',
  'S....P..S',
  'SS.J.P..S',
  'S....PJ.S',
  'S.......S',
  'SSSSSSSSS',
];

const CHAR_TILE = { '.': T.SAND, 'P': T.PATH, 'J': T.JUNK, 'S': T.SCRAP };

const CRITTERS = [
  { id: 'bitbot',   name: 'Bitbot',   sprite: 'bitbot',   hp: 12, atk: [2, 4] },
  { id: 'cogkit',   name: 'Cogkit',   sprite: 'cogkit',   hp: 16, atk: [2, 4] },
  { id: 'sparkpup', name: 'Sparkpup', sprite: 'sparkpup', hp: 14, atk: [3, 5] },
];

const PLAYER_MAX_HP = 30;
const ENCOUNTER_RATE = 0.32;

const SAVE_KEY = 'bauhaus.play.v1';

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
}
function saveProgress(state) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (_) {}
}

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
    const save = loadSave() || { caught: 0, defeated: {} };

    let mode = 'explore';            // 'explore' | 'battle' | 'message' | 'gameover'
    let messageText = '';
    let messageNext = null;          // function to run when message dismissed

    let player = { col: 1, row: 1, dir: 'down', hp: PLAYER_MAX_HP, defending: false };
    let move = null;                 // { fromCol, fromRow, toCol, toRow, t }
    let bobT = 0;

    let battle = null;               // { critter, hp, maxHp, phase, log, choice }
    let battleAnimT = 0;

    // ── preload assets ──
    p.preload = () => {
      sprites.robot    = p.loadImage('images/play/robot.svg');
      sprites.sand     = p.loadImage('images/play/sand.svg');
      sprites.path     = p.loadImage('images/play/path.svg');
      sprites.junk     = p.loadImage('images/play/junk.svg');
      sprites.scrap    = p.loadImage('images/play/scrap.svg');
      sprites.bitbot   = p.loadImage('images/play/bitbot.svg');
      sprites.cogkit   = p.loadImage('images/play/cogkit.svg');
      sprites.sparkpup = p.loadImage('images/play/sparkpup.svg');
    };

    p.setup = () => {
      p.createCanvas(W, H);
      p.frameRate(60);
      p.textFont('IBM Plex Mono, ui-monospace, monospace');
      api.onReady && api.onReady();
    };

    // ── input plumbing — accept both keyboard and DOM-button calls ──
    api.input = (action) => handleInput(action);

    p.keyPressed = () => {
      const k = p.key;
      if (p.keyCode === p.UP_ARROW    || k === 'w' || k === 'W') handleInput('up');
      else if (p.keyCode === p.DOWN_ARROW  || k === 's' || k === 'S') handleInput('down');
      else if (p.keyCode === p.LEFT_ARROW  || k === 'a' || k === 'A') handleInput('left');
      else if (p.keyCode === p.RIGHT_ARROW || k === 'd' || k === 'D') handleInput('right');
      else if (k === ' ' || k === 'Enter') handleInput('a');
      else if (k === 'b' || k === 'B' || k === 'Escape') handleInput('b');
    };

    function handleInput(action) {
      if (mode === 'message') {
        if (action === 'a' || action === 'b') dismissMessage();
        return;
      }
      if (mode === 'gameover') {
        if (action === 'a') resetRun();
        return;
      }
      if (mode === 'battle') {
        handleBattleInput(action);
        return;
      }
      // explore
      if (move) return;
      if (action === 'up')    tryMove(0, -1, 'up');
      if (action === 'down')  tryMove(0,  1, 'down');
      if (action === 'left')  tryMove(-1, 0, 'left');
      if (action === 'right') tryMove( 1, 0, 'right');
    }

    // ── exploration ──
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
      const tile = map[player.row][player.col];
      move = null;
      if (tile === T.JUNK && Math.random() < ENCOUNTER_RATE) startBattle();
    }

    // ── battles ──
    function startBattle() {
      const critter = CRITTERS[Math.floor(Math.random() * CRITTERS.length)];
      battle = {
        critter,
        hp: critter.hp,
        maxHp: critter.hp,
        phase: 'menu',  // 'menu' | 'player-attack' | 'enemy-attack' | 'win' | 'lose' | 'fled'
        log: 'A wild ' + critter.name + ' rebooted in the junk!',
        choice: 0,
      };
      battleAnimT = 0;
      mode = 'battle';
    }

    const BATTLE_OPTIONS = ['ATTACK', 'DEFEND', 'RUN'];

    function handleBattleInput(action) {
      if (battle.phase !== 'menu') return;
      if (action === 'left' || action === 'up') {
        battle.choice = (battle.choice + BATTLE_OPTIONS.length - 1) % BATTLE_OPTIONS.length;
        return;
      }
      if (action === 'right' || action === 'down') {
        battle.choice = (battle.choice + 1) % BATTLE_OPTIONS.length;
        return;
      }
      if (action === 'a') {
        const opt = BATTLE_OPTIONS[battle.choice];
        if (opt === 'ATTACK') {
          const dmg = 4 + Math.floor(Math.random() * 4);
          battle.hp = Math.max(0, battle.hp - dmg);
          battle.log = 'You hit ' + battle.critter.name + ' for ' + dmg + '.';
          battle.phase = 'player-attack';
          battleAnimT = 0;
        } else if (opt === 'DEFEND') {
          player.defending = true;
          battle.log = 'You brace your chassis.';
          battle.phase = 'enemy-attack';
          battleAnimT = 0;
        } else if (opt === 'RUN') {
          if (Math.random() < 0.6) {
            battle.log = 'Got away safely!';
            battle.phase = 'fled';
            battleAnimT = 0;
          } else {
            battle.log = 'No clear path — they cornered you!';
            battle.phase = 'enemy-attack';
            battleAnimT = 0;
          }
        }
      }
    }

    function tickBattle() {
      battleAnimT += 1 / 60;
      if (battle.phase === 'player-attack' && battleAnimT > 0.7) {
        if (battle.hp <= 0) {
          save.caught += 1;
          save.defeated[battle.critter.id] = (save.defeated[battle.critter.id] || 0) + 1;
          saveProgress(save);
          battle.log = 'Caught ' + battle.critter.name + '!';
          battle.phase = 'win';
          battleAnimT = 0;
        } else {
          battle.phase = 'enemy-attack';
          battleAnimT = 0;
        }
      } else if (battle.phase === 'enemy-attack' && battleAnimT > 0.6) {
        const [a, b] = battle.critter.atk;
        let dmg = a + Math.floor(Math.random() * (b - a + 1));
        if (player.defending) { dmg = Math.max(1, Math.floor(dmg / 2)); player.defending = false; }
        player.hp = Math.max(0, player.hp - dmg);
        battle.log = battle.critter.name + ' hit you for ' + dmg + '.';
        if (player.hp <= 0) {
          battle.phase = 'lose';
          battleAnimT = 0;
        } else {
          battle.phase = 'menu';
          battle.choice = 0;
          battleAnimT = 0;
        }
      } else if ((battle.phase === 'win' || battle.phase === 'fled') && battleAnimT > 1.0) {
        battle = null;
        mode = 'explore';
      } else if (battle.phase === 'lose' && battleAnimT > 1.4) {
        battle = null;
        mode = 'gameover';
      }
    }

    function resetRun() {
      player = { col: 1, row: 1, dir: 'down', hp: PLAYER_MAX_HP, defending: false };
      move = null;
      mode = 'explore';
    }

    function dismissMessage() {
      mode = 'explore';
      const fn = messageNext;
      messageNext = null;
      messageText = '';
      if (fn) fn();
    }

    // ── draw loop ──
    p.draw = () => {
      bobT += 1 / 60;
      if (mode === 'battle') {
        if (battle.phase !== 'menu') tickBattle();
        drawBattle();
      } else if (mode === 'gameover') {
        drawExplore();
        drawGameOverOverlay();
      } else {
        if (move) {
          move.t += 1 / 11;  // ~180ms per tile
          if (move.t >= 1) finishMove();
        }
        drawExplore();
      }
      drawHUD();
    };

    function drawExplore() {
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

    function drawBattle() {
      // arena background
      p.noStroke();
      p.fill('#e6d9b0');
      p.rect(0, 0, W, H);
      // top half — enemy stage
      p.fill('#d2c598');
      p.rect(0, 0, W, H * 0.42);
      // ground line
      p.fill('#bfb37e');
      p.ellipse(W * 0.7, H * 0.42, W * 0.7, 22);
      p.ellipse(W * 0.3, H * 0.78, W * 0.7, 22);

      // enemy sprite
      let ex = W * 0.62;
      let ey = H * 0.18;
      if (battle.phase === 'player-attack') {
        const k = Math.sin(battleAnimT * 18) * 4 * (1 - battleAnimT / 0.7);
        ex += k;
      }
      const enemyVisible = !(battle.phase === 'win' && battleAnimT > 0.5);
      if (enemyVisible && sprites[battle.critter.sprite]) {
        const eimg = sprites[battle.critter.sprite];
        const size = battle.phase === 'win'
          ? Math.max(0, 72 * (1 - battleAnimT / 0.5))
          : 72;
        p.image(eimg, ex, ey, size, size);
      }

      // player robot (back view feel — same sprite, smaller, lower-left)
      const px = W * 0.12;
      const py = H * 0.55;
      let pxOff = 0;
      if (battle.phase === 'enemy-attack') {
        pxOff = Math.sin(battleAnimT * 18) * 4 * (1 - battleAnimT / 0.6);
      }
      if (sprites.robot) p.image(sprites.robot, px + pxOff, py, 60, 60);

      // enemy HP bar
      drawBar(8, 8, W - 16, 'ENEMY · ' + battle.critter.name, battle.hp, battle.maxHp, '#7a5ec0');
      // player HP bar
      drawBar(8, H - 96, W - 16, 'YOU', player.hp, PLAYER_MAX_HP, '#3f8a6a');

      // bottom panel — menu / log
      p.noStroke();
      p.fill('#1a1814');
      p.rect(6, H - 70, W - 12, 64, 4);
      p.fill('#ece6da');
      p.textSize(9);
      p.textAlign(p.LEFT, p.TOP);
      wrapText(battle.log, 14, H - 64, W - 28, 11);

      if (battle.phase === 'menu') {
        const baseY = H - 30;
        for (let i = 0; i < BATTLE_OPTIONS.length; i++) {
          const x = 14 + i * 80;
          const sel = i === battle.choice;
          p.fill(sel ? '#d4502a' : '#2a241d');
          p.rect(x, baseY, 76, 20, 3);
          p.fill(sel ? '#1a1814' : '#ece6da');
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(9);
          p.text(BATTLE_OPTIONS[i], x + 38, baseY + 11);
        }
      }
    }

    function drawBar(x, y, w, label, hp, max, fillColor) {
      p.noStroke();
      p.fill('#1a1814');
      p.rect(x, y, w, 22, 3);
      p.fill('#ece6da');
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(8);
      p.text(label, x + 6, y + 4);
      p.textAlign(p.RIGHT, p.TOP);
      p.text(hp + '/' + max, x + w - 6, y + 4);
      // bar
      const bw = w - 12;
      p.fill('#3a3128');
      p.rect(x + 6, y + 14, bw, 5, 2);
      p.fill(fillColor);
      const pct = max > 0 ? hp / max : 0;
      p.rect(x + 6, y + 14, bw * pct, 5, 2);
    }

    function wrapText(text, x, y, maxW, lineH) {
      const words = text.split(' ');
      let line = '';
      let yy = y;
      for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (p.textWidth(test) > maxW) {
          p.text(line, x, yy);
          yy += lineH;
          line = w;
        } else {
          line = test;
        }
      }
      if (line) p.text(line, x, yy);
    }

    function drawGameOverOverlay() {
      p.noStroke();
      p.fill('rgba(26,24,20,.78)');
      p.rect(0, 0, W, H);
      p.fill('#ece6da');
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.text('SHUTDOWN', W / 2, H / 2 - 20);
      p.textSize(9);
      p.text('Press A to reboot.', W / 2, H / 2 + 8);
    }

    function drawHUD() {
      // mini HP bar overlay during exploration
      if (mode === 'explore') {
        p.noStroke();
        p.fill('rgba(26,24,20,.72)');
        p.rect(4, 4, 86, 14, 3);
        p.fill('#ece6da');
        p.textSize(8);
        p.textAlign(p.LEFT, p.CENTER);
        p.text('HP', 9, 12);
        p.fill('#3a3128');
        p.rect(22, 8, 60, 6, 2);
        p.fill('#3f8a6a');
        const pct = player.hp / PLAYER_MAX_HP;
        p.rect(22, 8, 60 * pct, 6, 2);

        // caught counter
        p.fill('rgba(26,24,20,.72)');
        p.rect(W - 70, 4, 66, 14, 3);
        p.fill('#ece6da');
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('CAUGHT ' + save.caught, W - 8, 12);
      }
    }

    api.getStatus = () => ({
      hp: player.hp,
      maxHp: PLAYER_MAX_HP,
      caught: save.caught,
      mode,
    });
  };
}

// ─── React component ────────────────────────────────────────────────────────

window.PlayPage = function PlayPage() {
  const screenRef = useRef(null);
  const apiRef = useRef({ input: () => {}, getStatus: () => ({ hp: 0, maxHp: PLAYER_MAX_HP, caught: 0, mode: 'explore' }) });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!screenRef.current) return;
    if (typeof window.p5 === 'undefined') {
      console.warn('p5.js not loaded yet');
      return;
    }
    const api = { input: () => {}, getStatus: () => null, onReady: null };
    apiRef.current = api;

    const sketch = makeSketch(api);
    const instance = new window.p5(sketch, screenRef.current);

    // poll status for the status bar
    const pollId = setInterval(() => setTick(t => t + 1), 250);

    return () => {
      clearInterval(pollId);
      instance.remove();
    };
  }, []);

  const press = (action) => {
    apiRef.current.input(action);
  };

  const status = apiRef.current.getStatus ? apiRef.current.getStatus() : null;
  const hp = status ? status.hp : PLAYER_MAX_HP;
  const caught = status ? status.caught : 0;

  return (
    <section className="pad-x section-block" style={{ maxWidth: 880, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="09">Play</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        A tiny robot adventure.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 540, fontSize: 14.5 }}>
        Wander the scrap fields, scuffle with rogue micro-bots in the junk piles, catch them all.
        Arrow keys / WASD to walk, Space / Enter to confirm, Escape / B to cancel — or use the
        on-screen pad below.
      </p>

      <div className="play-phone reveal" role="application" aria-label="Robot adventure mini-game">
        <div className="play-statusbar">
          <span>● PLAY · v1</span>
          <span style={{ color: 'var(--accent)' }}>HP {hp}/{PLAYER_MAX_HP}</span>
          <span>★ {caught}</span>
        </div>
        <div ref={screenRef} className="play-screen"/>
        <div className="play-controls">
          <div className="play-dpad">
            <button className="up"    aria-label="Up"    onMouseDown={() => press('up')}    onTouchStart={(e) => { e.preventDefault(); press('up'); }}>▲</button>
            <button className="left"  aria-label="Left"  onMouseDown={() => press('left')}  onTouchStart={(e) => { e.preventDefault(); press('left'); }}>◀</button>
            <button className="down"  aria-label="Down"  onMouseDown={() => press('down')}  onTouchStart={(e) => { e.preventDefault(); press('down'); }}>▼</button>
            <button className="right" aria-label="Right" onMouseDown={() => press('right')} onTouchStart={(e) => { e.preventDefault(); press('right'); }}>▶</button>
          </div>
          <div className="play-actions">
            <button onMouseDown={() => press('a')} onTouchStart={(e) => { e.preventDefault(); press('a'); }}>A</button>
            <button className="secondary" onMouseDown={() => press('b')} onTouchStart={(e) => { e.preventDefault(); press('b'); }}>B</button>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 18, color: 'var(--muted)', fontSize: 12, textAlign: 'center' }}>
        Built with <a className="hover-line" href="https://p5js.org/" target="_blank" rel="noreferrer" style={{ color: 'var(--ink)' }}>p5.js</a>.
        Progress saves to your browser only.
      </p>
    </section>
  );
};

})();
