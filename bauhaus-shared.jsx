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

  const TYPE_MS = 95;      // ms per word while streaming
  const HOLD_MS = 3200;    // pause once fully typed before shifting

  const reduceMotion = React.useMemo(() => (
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ), []);

  const wordLists = React.useMemo(
    () => items.map(it => (it.text || '').split(/\s+/).filter(Boolean)),
    [items]
  );

  const [idx, setIdx]         = React.useState(0);
  const [count, setCount]     = React.useState(0);
  const [phase, setPhase]     = React.useState('typing'); // typing | shifting
  const [history, setHistory] = React.useState([]);       // newest-first, max 2

  React.useEffect(() => {
    const item  = items[idx];
    const words = wordLists[idx];
    if (!item || !words) return;
    let t;
    if (reduceMotion) {
      setCount(words.length);
      t = setTimeout(() => {
        setHistory(h => [item, ...h].slice(0, 2));
        setIdx((idx + 1) % items.length);
        setCount(0);
      }, 4500);
      return () => clearTimeout(t);
    }
    if (phase === 'typing') {
      if (count < words.length) {
        t = setTimeout(() => setCount(c => c + 1), TYPE_MS);
      } else {
        t = setTimeout(() => setPhase('shifting'), HOLD_MS);
      }
    } else {
      setHistory(h => [item, ...h].slice(0, 2));
      setIdx((idx + 1) % items.length);
      setCount(0);
      setPhase('typing');
    }
    return () => clearTimeout(t);
  }, [count, phase, idx, items, wordLists, reduceMotion]);

  const onItemClick = (e, url) => {
    if (!url) return;
    if (url.startsWith('#/')) {
      e.preventDefault();
      nav && nav(url.slice(1));
    }
  };
  const linkPropsFor = (url) => url ? {
    href: url,
    target: url.startsWith('http') ? '_blank' : undefined,
    rel:    url.startsWith('http') ? 'noreferrer' : undefined,
    onClick: (e) => onItemClick(e, url),
  } : null;

  const current = items[idx];
  const shown   = (wordLists[idx] || []).slice(0, count).join(' ');

  const renderRow = (it, text, isCurrent, slotKey) => {
    if (!it) {
      return <div className={'news-flash-row is-empty ' + slotKey} key={slotKey}/>;
    }
    const lp = linkPropsFor(it.url);
    return (
      <div className={'news-flash-row ' + (isCurrent ? 'is-current' : 'is-history ' + slotKey)}
           key={slotKey}>
        <span className="news-flash-prompt" aria-hidden="true">{isCurrent ? '$' : '›'}</span>
        <span className="news-flash-kind">{it.tag}</span>
        <span className="news-flash-stream"
              aria-live={isCurrent ? 'polite' : undefined}>
          {lp ? <a {...lp}>{text}</a> : <span>{text}</span>}
          {isCurrent && <span className="news-flash-caret" aria-hidden="true">▍</span>}
        </span>
      </div>
    );
  };

  return (
    <div className="news-flash news-flash-card reveal" role="region" aria-label="Latest updates">
      <div className="news-flash-titlebar" aria-hidden="true">
        <span className="tl-dot tl-red"/>
        <span className="tl-dot tl-yel"/>
        <span className="tl-dot tl-grn"/>
        <span className="news-flash-title">flash.log — tail -f</span>
      </div>
      <div className="news-flash-body">
        {renderRow(current,    shown,                  true,  'slot-1')}
        {renderRow(history[0], history[0]?.text || '', false, 'slot-2')}
        {renderRow(history[1], history[1]?.text || '', false, 'slot-3')}
      </div>
    </div>
  );
};

window.SocialIcon = function SocialIcon({ kind, size = 18 }) {
  const paths = {
    github:   'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    scholar:  'M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z',
    substack: 'M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z',
  };
  const d = paths[kind];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
         role="img" aria-hidden="true" focusable="false"
         style={{ display: 'block' }}>
      <path d={d}/>
    </svg>
  );
};

window.SocialRow = function SocialRow({
  kinds = ['github', 'linkedin', 'scholar', 'substack'],
  size = 18, gap = 14, justify = 'flex-start',
}) {
  if (!window.SITE || !SITE.social) return null;
  const labels = { github: 'GitHub', linkedin: 'LinkedIn', scholar: 'Google Scholar', substack: 'Substack' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      gap, justifyContent: justify, flexWrap: 'wrap',
    }}>
      {kinds.map(k => {
        const href = SITE.social[k];
        if (!href) return null;
        return (
          <a key={k} href={href} target="_blank" rel="noreferrer"
             aria-label={labels[k]} title={labels[k]}
             className="social-link focus-outline">
            <SocialIcon kind={k} size={size}/>
          </a>
        );
      })}
    </span>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SocialRow size={22} gap={18} justify="flex-end"/>
          </div>
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
