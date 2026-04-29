// bauhaus-shared.jsx — Chrome (Header / Footer / HelpOverlay) and the small
// widgets that more than one page renders (SectionLabel, LiveDot, Pill, EmptyNote).
(function() {

const { useState } = React;

// ─── Cross-page utility widgets ─────────────────────────────────────────────

window.SectionLabel = function SectionLabel({ n, children }) {
  return (
    <div className="lbl-mono">
      ── <span className="num">{n}</span> / {children}
    </div>
  );
};

window.LiveDot = function LiveDot() {
  return (
    <span aria-label="active" title="Active" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      marginLeft: 8, verticalAlign: 'middle',
      font: '500 9px var(--mono)', letterSpacing: '.18em',
      textTransform: 'uppercase', color: 'var(--accent)',
    }}>
      <span className="live-dot"/>
      LIVE
    </span>
  );
};

window.Pill = function Pill({ kind }) {
  const map = {
    engineering: { glyph: '■', label: 'Engineering' },
    art:         { glyph: '●', label: 'Art' },
  };
  const m = map[kind];
  if (!m) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px',
      border: '1px solid var(--rule)',
      borderRadius: 999,
      background: 'var(--paper)',
      font: '500 10px var(--mono)',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--ink)',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: 'var(--accent)', fontSize: 11, lineHeight: 1 }}>{m.glyph}</span>
      {m.label}
    </span>
  );
};

window.NewsFlash = function NewsFlash({ items, nav }) {
  if (!items || items.length === 0) return null;

  const TYPE_MS  = 26;     // ms per character while typing forward
  const ERASE_MS = 12;     // ms per character while erasing
  const HOLD_MS  = 3200;   // pause once fully typed before erasing

  const reduceMotion = React.useMemo(() => (
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ), []);

  const [idx, setIdx] = React.useState(0);
  const [shown, setShown] = React.useState('');
  const [phase, setPhase] = React.useState('typing'); // typing | erasing

  React.useEffect(() => {
    const item = items[idx];
    if (!item) return;
    let t;
    if (reduceMotion) {
      // No typewriter — just rotate the headline every few seconds.
      setShown(item.text);
      t = setTimeout(() => setIdx((idx + 1) % items.length), 5000);
      return () => clearTimeout(t);
    }
    if (phase === 'typing') {
      if (shown.length < item.text.length) {
        t = setTimeout(() => setShown(item.text.slice(0, shown.length + 1)), TYPE_MS);
      } else {
        t = setTimeout(() => setPhase('erasing'), HOLD_MS);
      }
    } else {
      if (shown.length > 0) {
        t = setTimeout(() => setShown(item.text.slice(0, shown.length - 1)), ERASE_MS);
      } else {
        setIdx((idx + 1) % items.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(t);
  }, [shown, phase, idx, items, reduceMotion]);

  const item = items[idx];
  const onItemClick = (e, url) => {
    if (!url) return;
    if (url.startsWith('#/')) {
      e.preventDefault();
      nav && nav(url.slice(1));
    }
  };
  const linkProps = item.url
    ? {
        href: item.url,
        target: item.url.startsWith('http') ? '_blank' : undefined,
        rel:    item.url.startsWith('http') ? 'noreferrer' : undefined,
        onClick: (e) => onItemClick(e, item.url),
      }
    : null;

  return (
    <div className="news-flash" role="region" aria-label="Latest updates">
      <div className="news-flash-inner">
        <span className="news-flash-kind">{item.tag}</span>
        <span className="news-flash-stream" aria-live="polite">
          {linkProps
            ? <a {...linkProps}>{shown}</a>
            : <span>{shown}</span>}
          <span className="news-flash-caret" aria-hidden="true">▍</span>
        </span>
      </div>
    </div>
  );
};

window.EmptyNote = function EmptyNote({ children }) {
  return (
    <div className="reveal lbl-mono" style={{
      marginTop: 8, padding: '24px 0', color: 'var(--muted)',
    }}>
      {children || '◇ More coming soon.'}
    </div>
  );
};

// ─── Chrome ─────────────────────────────────────────────────────────────────

window.Header = function Header({ path, nav, theme, toggleTheme }) {
  const items = [
    ['/', 'index'],
    ['/projects', 'work'],
    ['/research', 'research'],
    ['/open-source', 'open-source'],
    ['/gallery', 'gallery'],
    ['/ideas', 'ideas'],
    ['/news', 'news'],
    ['/about-me', 'about me'],
    ['/play', 'play'],
  ];
  const isDark = theme === 'dark';
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'color-mix(in oklab, var(--bg) 92%, transparent)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--rule)',
    }}>
      {/* Top row — brand + theme toggle */}
      <div style={{
        maxWidth: 1180, margin: '0 auto', padding: '14px 32px',
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
      }}>
        <a href="#/" onClick={(e)=>{e.preventDefault(); nav('/');}}
           style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)' }}>
          <span className="brand-icon" aria-hidden="true"/>
          <span style={{ font: '500 12px var(--mono)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Shashank&nbsp;Bangalore&nbsp;Lakshman
          </span>
        </a>
        <span className="lbl-mono" style={{ display: 'inline-block' }}>
          Innovation at Hyperscale
        </span>
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="focus-outline"
          style={{
            marginLeft: 'auto',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            background: 'var(--paper)', color: 'var(--ink)',
            border: '1px solid var(--rule)', borderRadius: 999,
            font: '400 11px var(--mono)', letterSpacing: '.1em', textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'border-color .2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}
        >
          <span style={{ color: 'var(--accent)', fontSize: 13, lineHeight: 1 }}>
            {isDark ? '☀' : '☾'}
          </span>
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Bottom row — nav menu */}
      <div style={{
        maxWidth: 1180, margin: '0 auto', padding: '0 32px 12px',
        borderTop: '1px solid var(--rule-soft)',
      }}>
        <nav style={{
          paddingTop: 12,
          display: 'flex', gap: 22, flexWrap: 'wrap',
          font: '400 11px var(--mono)', letterSpacing: '.1em', textTransform: 'uppercase',
        }}>
          {items.map(([href, lbl], i) => {
            const active = path === href || (href === '/blog' && path.startsWith('/blog/'));
            return (
              <a key={href} href={'#'+href}
                 onClick={(e)=>{e.preventDefault(); nav(href);}}
                 className="focus-outline"
                 style={{
                   color: active ? 'var(--ink)' : 'var(--muted)',
                   borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent',
                   paddingBottom: 2,
                 }}>
                <span style={{ color: 'var(--accent)' }}>{String(i+1).padStart(2,'0')}/</span>{lbl}
              </a>
            );
          })}
        </nav>
      </div>

      {/* News flash — scrolling ticker of recent activity */}
      <NewsFlash items={typeof FLASH !== 'undefined' ? FLASH : []} nav={nav}/>
    </header>
  );
};

window.Footer = function Footer() {
  return (
    <footer className="pad-x" style={{
      marginTop: 80, background: 'var(--ink)', color: 'var(--bg)',
      padding: '40px 32px 28px',
    }}>
      <div className="footer-grid" style={{
        maxWidth: 1180, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'baseline',
      }}>
        <div>
          <div className="lbl-mono" style={{ color: 'color-mix(in oklab, var(--bg) 55%, transparent)' }}>
            ── <span style={{ color: 'var(--accent)' }}>08</span> / CONTACT
          </div>
          <div className="display" style={{
            font: '500 30px/1.15 var(--display)', marginTop: 10, maxWidth: 540,
          }}>
            Let's connect if you are interested to chat about my expertise or projects.
          </div>
        </div>
        <div style={{
          font: '400 11px var(--mono)', color: 'color-mix(in oklab, var(--bg) 70%, transparent)',
          letterSpacing: '.08em', textTransform: 'uppercase', textAlign: 'right',
        }}>
          <a className="hover-line" href={SITE.social.github} target="_blank" rel="noreferrer" style={{ color: 'inherit', display: 'block' }}>
            GitHub ↗ shashankbl
          </a>
          <a className="hover-line" href={SITE.social.linkedin} target="_blank" rel="noreferrer" style={{ color: 'inherit', display: 'block', marginTop: 4 }}>
            LinkedIn ↗ shashankbl
          </a>
          <a className="hover-line" href={SITE.social.scholar} target="_blank" rel="noreferrer" style={{ color: 'inherit', display: 'block', marginTop: 4 }}>
            Scholar ↗ _BI5HM8AAAAJ
          </a>
          <div style={{ marginTop: 16, color: 'var(--accent)' }}>● AVAILABLE</div>
        </div>
      </div>
      <div className="footer-bottom" style={{
        maxWidth: 1180, margin: '32px auto 0', paddingTop: 18,
        borderTop: '1px solid color-mix(in oklab, var(--bg) 18%, transparent)',
        display: 'flex', justifyContent: 'space-between',
        font: '400 10.5px var(--mono)', color: 'color-mix(in oklab, var(--bg) 50%, transparent)',
        letterSpacing: '.1em', textTransform: 'uppercase',
      }}>
        <span>© {SITE.name} · {new Date().getFullYear()}</span>
        <span>Built with Claude Code and Claude Design</span>
        <span>Press <kbd style={{
          background: 'transparent',
          border: '1px solid color-mix(in oklab, var(--bg) 30%, transparent)',
          color: 'var(--bg)',
        }}>?</kbd> for keyboard nav</span>
      </div>
    </footer>
  );
};

// Help overlay
window.HelpOverlay = function HelpOverlay({ open, onClose }) {
  if (!open) return null;
  const rows = [
    ['1',   'index'],
    ['2',   'work'],
    ['3',   'research'],
    ['4',   'open-source'],
    ['5',   'gallery'],
    ['6',   'ideas'],
    ['7',   'news'],
    ['8',   'about me'],
    ['9',   'play'],
    ['t',   'toggle theme'],
    ['?',   'this help'],
    ['esc', 'close'],
  ];
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg)', border: '1px solid var(--rule)',
        padding: 26, minWidth: 380, maxWidth: 440,
        font: '400 13px/1.7 var(--mono)', position: 'relative',
      }}>
        <div className="lbl-mono">── Keyboard</div>
        <div style={{
          marginTop: 14, display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 8,
        }}>
          {rows.map(([k,v]) => (
            <React.Fragment key={k}>
              <kbd style={{ justifySelf: 'start' }}>{k}</kbd>
              <span style={{ color: 'var(--muted)' }}>{v}</span>
            </React.Fragment>
          ))}
        </div>
        <button onClick={onClose} aria-label="close" style={{
          position: 'absolute', top: 10, right: 10,
          background: 'transparent', border: 'none', color: 'var(--muted)',
          cursor: 'default', font: '400 18px var(--mono)',
        }}>×</button>
      </div>
    </div>
  );
};

})();
