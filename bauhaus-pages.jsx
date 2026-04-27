// bauhaus-pages.jsx — Page components for the Bauhaus portfolio.

const { useState, useEffect, useRef } = React;

// ─── Shared chrome ───────────────────────────────────────────────────────────

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

window.flagEmoji = function flagEmoji(cc) {
  if (!cc || cc.length !== 2) return '';
  return cc.toUpperCase().split('').map(c =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  ).join('');
};

window.SubstackAd = function SubstackAd() {
  const [failed, setFailed] = React.useState(false);
  const href = (window.SITE && SITE.social && SITE.social.substack) || 'https://shashankbl.substack.com/';
  return (
    <a href={href} target="_blank" rel="noreferrer"
       className="reveal focus-outline"
       style={{
         display: 'block', marginTop: 28,
         border: '1px solid var(--rule)', background: 'var(--paper)',
         color: 'var(--ink)',
         transition: 'border-color .2s ease',
       }}
       onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
       onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}>
      {!failed ? (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'var(--paper)', padding: 16,
        }}>
          <img
            src="images/substack-ad.jpeg"
            alt="HYPERSCALE — Subscribe on Substack"
            onError={() => setFailed(true)}
            style={{
              display: 'block', maxWidth: '100%', maxHeight: 520,
              width: 'auto', height: 'auto', objectFit: 'contain',
            }}
          />
        </div>
      ) : (
        <div className="substack-fallback" style={{
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 24,
          alignItems: 'center', padding: '20px 24px',
        }}>
          <div>
            <div className="lbl-mono" style={{ marginBottom: 6 }}>
              ── <span className="num">HYPERSCALE</span> · ON SUBSTACK
            </div>
            <div className="display" style={{ font: '500 22px/1.25 var(--display)' }}>
              Read my notes on AI, silicon &amp; systems.
            </div>
            <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 14 }}>
              Subscribe to <span style={{ color: 'var(--ink)' }}>HYPERSCALE</span> at @shashankbl on Substack.
            </div>
          </div>
          <div className="lbl-mono" style={{
            color: 'var(--accent)', whiteSpace: 'nowrap',
          }}>
            Subscribe →
          </div>
        </div>
      )}
    </a>
  );
};

window.LogoTile = function LogoTile({ item }) {
  const [failed, setFailed] = React.useState(false);
  const src = !failed && (item.file || (item.slug && `https://cdn.simpleicons.org/${item.slug}`));
  const flag = flagEmoji(item.cc);
  return (
    <div title={item.name} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: '16px 14px',
      border: '1px solid var(--rule)', background: 'var(--paper)',
      minWidth: 120, flex: '1 1 140px',
      transition: 'border-color .2s ease, transform .2s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}>
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', padding: '6px 10px',
        background: 'var(--logo-frame)',
        border: '1px solid var(--rule-soft)',
      }}>
        {src ? (
          <img
            src={src}
            alt={item.name}
            onError={() => setFailed(true)}
            style={{
              maxHeight: 36, maxWidth: '100%', objectFit: 'contain',
              filter: 'grayscale(100%)', transition: 'filter .2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'grayscale(0%)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(100%)'; }}
          />
        ) : (
          <span className="display" style={{
            font: '500 18px/1 var(--display)', color: 'var(--logo-frame-ink)',
            letterSpacing: '-.01em', textAlign: 'center',
          }}>{item.short}</span>
        )}
      </div>
      <div className="lbl-mono" style={{
        textAlign: 'center', fontSize: 10, color: 'var(--muted)',
        display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center',
      }}>
        <span>{item.short}</span>
        {flag && (
          <span aria-label={item.cc} title={item.cc}
                style={{ fontSize: 13, lineHeight: 1, filter: 'saturate(.85)' }}>
            {flag}
          </span>
        )}
      </div>
    </div>
  );
};

window.SkillList = function SkillList({ items }) {
  return (
    <div style={{
      font: '400 12.5px/1.75 var(--mono)', color: 'var(--ink)',
    }}>
      {items.map((s, i) => (
        <React.Fragment key={s}>
          {i > 0 && <span style={{ color: 'var(--accent)', margin: '0 7px' }}>·</span>}
          <span>{s}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

window.SkillMatrix = function SkillMatrix({ groups }) {
  return (
    <div className="skills-grid" style={{ display: 'grid', gap: 10 }}>
      {groups.map(g => (
        <div key={g.group} className="reveal skill-row" style={{
          border: '1px solid var(--rule)',
          background: 'var(--paper)',
          padding: '12px 18px',
          display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20,
          alignItems: 'center',
          transition: 'border-color .2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}>
          <div className="lbl-mono" style={{ color: 'var(--accent)' }}>
            {g.group}
          </div>
          <SkillList items={g.items}/>
        </div>
      ))}
    </div>
  );
};

window.LogoStrip = function LogoStrip({ items }) {
  return (
    <div className="reveal" style={{
      display: 'flex', gap: 14, flexWrap: 'wrap',
    }}>
      {items.map(item => <LogoTile key={item.domain} item={item}/>)}
    </div>
  );
};

window.Placeholder = function Placeholder({ label, h = 180 }) {
  return (
    <div style={{
      height: h, position: 'relative', overflow: 'hidden',
      background: 'repeating-linear-gradient(135deg, var(--rule-soft) 0 6px, transparent 6px 12px)',
      border: '1px solid var(--rule)',
    }}>
      <div style={{
        position: 'absolute', top: 8, left: 10,
        font: '400 10.5px var(--mono)', color: 'var(--muted)',
        letterSpacing: '.08em', textTransform: 'uppercase',
      }}>◇ {label}</div>
    </div>
  );
};

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
        <span>Press <kbd style={{
          background: 'transparent',
          border: '1px solid color-mix(in oklab, var(--bg) 30%, transparent)',
          color: 'var(--bg)',
        }}>?</kbd> for keyboard nav</span>
      </div>
    </footer>
  );
};

// ─── Pages ───────────────────────────────────────────────────────────────────

window.HomePage = function HomePage({ nav }) {
  return (
    <>
      {/* Hero */}
      <section className="pad-x hero-section" style={{ maxWidth: 1180, margin: '0 auto', padding: '72px 32px 56px' }}>
        <div className="reveal">
          <SectionLabel n="01">Index</SectionLabel>
        </div>

        <div className="hero-grid" style={{
          marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, alignItems: 'end',
        }}>
          <div>
            <div className="reveal icon-row" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 12,
              marginBottom: 22,
            }}>
              {[
                { icon: 'smart_toy',       label: 'Robotics' },
                { icon: 'directions_car',  label: 'Automotive' },
                { icon: 'memory',          label: 'Semiconductors' },
                { icon: 'cloud',           label: 'Cloud' },
                { icon: 'psychology',      label: 'Machine Learning' },
                { icon: 'palette',         label: 'Art' },
              ].map(d => (
                <div key={d.label} title={d.label}
                     style={{
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       padding: '6px 4px',
                     }}>
                  <span className="material-symbols-outlined" aria-label={d.label}
                        style={{
                          fontSize: 28, color: 'var(--accent)', lineHeight: 1,
                          fontVariationSettings: '"opsz" 24, "wght" 400, "FILL" 0, "GRAD" 0',
                        }}>{d.icon}</span>
                </div>
              ))}
            </div>
            <h1 className="reveal display hero-headline" style={{
              font: '500 clamp(36px, 5vw, 56px)/1.05 var(--display)',
              margin: 0, letterSpacing: '-.025em',
            }}>
              Engineering Leader at the<br/>
              intersection of <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>AI</span><br/>
              and <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Silicon</span>.
            </h1>
            <p className="reveal" style={{
              marginTop: 26, font: '400 14.5px/1.7 var(--mono)',
              color: 'var(--muted)', maxWidth: 520,
            }}>
              {SITE.blurb}
            </p>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <a href="https://www.utexas.edu/" target="_blank" rel="noreferrer"
               className="reveal"
               aria-label="hookem — UT Austin"
               style={{ display: 'block' }}>
              <img src="images/hookem.png" alt="hookem — UT Austin"
                   className="hookem-img"
                   style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 176, objectFit: 'contain' }}/>
            </a>
            <div className="reveal" style={{
              border: '1px solid var(--rule)', background: 'var(--paper)', padding: 20,
            }}>
              <div className="lbl-mono" style={{ marginBottom: 12 }}>◇ Status · 2026</div>
              <div style={{
                display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 8,
                font: '400 12.5px var(--mono)',
              }}>
                <span style={{ color: 'var(--muted)' }}>LOCATION</span>
                <span>{SITE.location}</span>
                <span style={{ color: 'var(--muted)' }}>FOCUS</span>
                <span>Edge AI. Agentic Tools. AI Evals. AI Systems.</span>
                <span style={{ color: 'var(--muted)' }}>OPEN&nbsp;TO</span>
                <span style={{ color: 'var(--accent)' }}>● collaborations · talks</span>
              </div>
            </div>
            <div className="reveal stats-card" style={{
              border: '1px solid var(--rule)', background: 'var(--paper)', padding: 20,
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14,
            }}>
              {[['13+','years'],['M.S.','UT Austin'],['25+','patents']].map(([a,b]) => (
                <div key={b}>
                  <div className="display" style={{ font: '500 30px/1 var(--display)' }}>{a}</div>
                  <div className="lbl-mono" style={{ marginTop: 4 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section className="pad-x section-block" style={{
        maxWidth: 1180, margin: '0 auto', padding: '52px 32px',
        borderTop: '1px solid var(--rule)',
      }}>
        <div className="reveal">
          <SectionLabel n="01·b">Affiliations</SectionLabel>
          <h2 className="display" style={{ font: '500 32px/1.1 var(--display)', margin: '8px 0 4px' }}>
            Where I've worked &amp; studied.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            Current and prior employers and academic institutions.
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <div className="lbl-mono reveal" style={{ marginBottom: 14 }}>
            ── <span className="num">CURRENT</span>
          </div>
          <LogoStrip items={AFFILIATIONS.current}/>
        </div>

        <div style={{ marginTop: 32 }}>
          <div className="lbl-mono reveal" style={{ marginBottom: 14 }}>
            ── <span className="num">PRIOR</span>
          </div>
          <LogoStrip items={AFFILIATIONS.past}/>
        </div>
      </section>

      {/* Skills */}
      <section className="pad-x section-block" style={{
        maxWidth: 1180, margin: '0 auto', padding: '52px 32px',
        borderTop: '1px solid var(--rule)',
      }}>
        <div className="reveal">
          <SectionLabel n="01·c">Skills</SectionLabel>
          <h2 className="display" style={{ font: '500 32px/1.1 var(--display)', margin: '8px 0 4px' }}>
            What I do.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            Capabilities, grouped by domain.
          </p>
        </div>
        <div style={{ marginTop: 28 }}>
          <SkillMatrix groups={SKILLS}/>
        </div>
      </section>

      {/* Tools */}
      <section className="pad-x section-block" style={{
        maxWidth: 1180, margin: '0 auto', padding: '52px 32px',
        borderTop: '1px solid var(--rule)',
      }}>
        <div className="reveal">
          <SectionLabel n="01·d">Tools</SectionLabel>
          <h2 className="display" style={{ font: '500 32px/1.1 var(--display)', margin: '8px 0 4px' }}>
            What I use.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            Languages, libraries, frameworks, and hardware.
          </p>
        </div>
        <div style={{ marginTop: 28 }}>
          <SkillMatrix groups={TOOLS}/>
        </div>
      </section>

      {/* Now */}
      <section className="pad-x section-block" style={{
        maxWidth: 1180, margin: '0 auto', padding: '52px 32px',
        borderTop: '1px solid var(--rule)',
      }}>
        <div className="reveal">
          <SectionLabel n="01·e">Now</SectionLabel>
          <h2 className="display" style={{ font: '500 32px/1.1 var(--display)', margin: '8px 0 4px' }}>
            What I'm doing now.
          </h2>
          <div className="lbl-mono" style={{ color: 'var(--muted)' }}>
            Last updated · {(() => {
              const d = new Date();
              const pad = n => String(n).padStart(2, '0');
              return `${d.getFullYear()}·${pad(d.getMonth() + 1)}·${pad(d.getDate())}`;
            })()}
          </div>
        </div>
        <div className="reveal" style={{
          marginTop: 22, padding: '22px 24px',
          background: 'var(--paper)',
          border: '1px solid var(--rule)', borderLeft: '2px solid var(--accent)',
          font: '400 15.5px/1.85 var(--sans)',
          maxWidth: 760,
        }}>
          {NOW_LINES.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: 'var(--accent)', font: '500 12px var(--mono)', paddingTop: 5, minWidth: 18 }}>
                {String(i+1).padStart(2,'0')}
              </span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </section>

    </>
  );
};

window.ProjectsPage = function ProjectsPage() {
  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="02">Work</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Things I've shipped.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        A handful of artifacts across the AI / software / silicon stack.
      </p>

      <ProjectGroup label="Engineering" kind="engineering"
                    items={PROJECTS.filter(p => p.kind === 'engineering')}/>
    </section>
  );
};

window.ProjectGroup = function ProjectGroup({ label, kind, items }) {
  return (
    <div style={{ marginTop: 48 }}>
      <div className="reveal" style={{
        display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4,
      }}>
        <h2 className="display" style={{
          font: '500 26px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
        }}>
          {label}
        </h2>
        <Pill kind={kind}/>
        <span className="lbl-mono" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
          {items.length} {items.length === 1 ? 'piece' : 'pieces'}
        </span>
      </div>
      <hr className="rule" style={{ marginTop: 8 }}/>

      {items.length === 0 ? (
        <div className="reveal lbl-mono" style={{
          padding: '28px 0', color: 'var(--muted)',
        }}>
          ◇ More coming soon.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 0 }}>
          {items.map((p) => (
            <article key={p.id} className="reveal proj-row" style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 320px',
              gap: 28, padding: '32px 0',
              borderTop: '1px solid var(--rule-soft)',
            }}>
              <div className="lbl-mono"><span className="num">{p.n}</span></div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span className="lbl-mono">{p.tag} · {p.year}</span>
                  <Pill kind={p.kind}/>
                </div>
                <h3 className="display" style={{
                  font: '500 28px/1.15 var(--display)', margin: '8px 0 0',
                }}>{p.title}</h3>
                <p style={{ marginTop: 10, color: 'var(--muted)', maxWidth: 720, fontSize: 14.5, lineHeight: 1.65 }}>
                  {p.blurb}
                </p>
                <div className="lbl-mono" style={{ marginTop: 14, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                  <span>STACK · {p.stack}</span>
                  <span>{p.loc}</span>
                  {(p.links || (p.url ? [{ label: 'Demo', url: p.url }] : [])).map((l, li) => (
                    <a key={li} className="hover-line" href={l.url} target="_blank" rel="noreferrer"
                       style={{ color: 'var(--accent)' }}>
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div>
                {p.image ? (
                  <div style={{
                    height: 200, border: '1px solid var(--rule)',
                    background: 'var(--paper)', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src={p.image} alt={p.title}
                         style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}/>
                  </div>
                ) : (
                  <Placeholder label={`Figure / ${p.n}`} h={200}/>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

window.BlogGroup = function BlogGroup({ name, posts, nav }) {
  return (
    <div style={{ marginTop: 40 }}>
      <div className="reveal" style={{
        display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4, flexWrap: 'wrap',
      }}>
        <h2 className="display" style={{
          font: '500 22px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
        }}>{name}</h2>
        <span className="lbl-mono" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>
      <hr className="rule" style={{ marginTop: 8 }}/>
      <div>
        {posts.map((p, i) => {
          const isExt = !!p.url;
          const style = {
            display: 'block', padding: '16px 0',
            borderTop: i ? '1px solid var(--rule-soft)' : 'none',
            color: 'var(--ink)',
          };
          const inner = (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
              {p.date && (
                <span className="lbl-mono" style={{ minWidth: 70 }}>{p.date}</span>
              )}
              <span className="display" style={{ font: '500 19px/1.35 var(--display)', flex: 1 }}>
                {p.title}{isExt && ' ↗'}
              </span>
            </div>
          );
          return isExt
            ? <a key={i} href={p.url} target="_blank" rel="noreferrer"
                 className="reveal hover-line" style={style}>{inner}</a>
            : <a key={p.slug || i} href={'#/blog/'+p.slug}
                 onClick={(e)=>{e.preventDefault(); nav('/blog/'+p.slug);}}
                 className="reveal hover-line" style={style}>{inner}</a>;
        })}
      </div>
    </div>
  );
};

window.IdeasPage = function IdeasPage({ nav }) {
  // Group POSTS by flair, preserving first-seen order.
  const order = [];
  const groups = {};
  (window.POSTS || []).forEach(p => {
    const g = p.flair || 'Posts';
    if (!groups[g]) {
      groups[g] = { name: g, posts: [] };
      order.push(g);
    }
    groups[g].posts.push(p);
  });
  const grouped = order.map(g => groups[g]);
  const talks = window.TALKS || [];

  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="06">Ideas</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Writing &amp; talks.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 540, fontSize: 14.5 }}>
        On AI systems, agentic tooling, and engineering reflections.
      </p>
      <p className="reveal" style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14.5 }}>
        Read on{' '}
        <a className="hover-line" href={SITE.social.substack || 'https://shashankbl.substack.com/'}
           target="_blank" rel="noreferrer"
           style={{ color: 'var(--accent)' }}>
          HYPERSCALE ↗
        </a>{' '}on Substack.
      </p>

      <div className="reveal" style={{
        marginTop: 40, padding: '24px 28px',
        border: '1px solid var(--rule)', background: 'var(--paper)',
      }}>
        <h2 className="display" style={{
          font: '500 24px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
        }}>Writing</h2>
        <hr className="rule" style={{ marginTop: 12 }}/>
        {grouped.length === 0 ? (
          <EmptyNote/>
        ) : (
          grouped.map(g => (
            <BlogGroup key={g.name} name={g.name} posts={g.posts} nav={nav}/>
          ))
        )}
      </div>

      <div className="reveal" style={{
        marginTop: 16, padding: '24px 28px',
        border: '1px solid var(--rule)', background: 'var(--paper)',
      }}>
        <h2 className="display" style={{
          font: '500 24px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
        }}>Talks</h2>
        <hr className="rule" style={{ marginTop: 12 }}/>
        {talks.length === 0 ? (
          <EmptyNote/>
        ) : (
          <div style={{ marginTop: 4 }}>
            {talks.map((t, i) => (
              <div key={i} className="list-row" style={{
                display: 'grid', gridTemplateColumns: '90px 200px 1fr 140px',
                padding: '20px 0',
                borderTop: i ? '1px solid var(--rule-soft)' : 'none',
                alignItems: 'baseline', gap: 16,
              }}>
                <span className="lbl-mono">{t.date}</span>
                <span className="lbl-mono" style={{ color: 'var(--accent)' }}>{t.venue}</span>
                <span className="display" style={{ font: '500 18px/1.3 var(--display)' }}>{t.title}</span>
                <span className="lbl-mono" style={{ textAlign: 'right' }}>{t.loc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

window.PostPage = function PostPage({ slug, nav }) {
  const post = POSTS.find(p => p.slug === slug) || POSTS[0];
  const idx = POSTS.indexOf(post);
  const prev = POSTS[idx - 1], next = POSTS[idx + 1];
  return (
    <article className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <a href="#/blog" onClick={(e)=>{e.preventDefault(); nav('/blog');}}
         className="hover-line lbl-mono" style={{ color: 'var(--ink)' }}>
        ← back to writing
      </a>
      <div className="lbl-mono" style={{ marginTop: 32 }}>
        {post.date} · {post.read}
      </div>
      <h1 className="display" style={{
        font: '500 44px/1.12 var(--display)', margin: '10px 0 22px', letterSpacing: '-.022em',
      }}>{post.title}</h1>
      <p style={{ color: 'var(--ink)', fontSize: 16.5, lineHeight: 1.75, fontStyle: 'italic', maxWidth: 640 }}>
        {post.blurb}
      </p>
      <hr className="rule" style={{ margin: '28px 0' }}/>
      <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8 }}>
        Post body lives in <code style={{
          background: 'var(--paper)', padding: '1px 6px', margin: '0 2px',
          border: '1px solid var(--rule-soft)', font: '400 13px var(--mono)',
        }}>/posts/{post.slug}.md</code>{' '}
        and is rendered by your build step. The shell, navigation, and styling are the same on every page.
      </p>
      <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8 }}>
        Use <kbd>j</kbd>/<kbd>k</kbd> to scroll, <kbd>[</kbd>/<kbd>]</kbd> to move between posts,
        or <kbd>g</kbd> <kbd>w</kbd> for the index.
      </p>

      <nav style={{
        marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--rule)',
        display: 'flex', justifyContent: 'space-between', gap: 16,
      }}>
        {prev ? (
          <a href={'#/blog/'+prev.slug} onClick={(e)=>{e.preventDefault(); nav('/blog/'+prev.slug);}}
             className="hover-line" style={{ color: 'var(--ink)' }}>
            <div className="lbl-mono">← Prev</div>
            <div style={{ marginTop: 4, fontSize: 14 }}>{prev.title}</div>
          </a>
        ) : <span/>}
        {next ? (
          <a href={'#/blog/'+next.slug} onClick={(e)=>{e.preventDefault(); nav('/blog/'+next.slug);}}
             className="hover-line" style={{ color: 'var(--ink)', textAlign: 'right' }}>
            <div className="lbl-mono">Next →</div>
            <div style={{ marginTop: 4, fontSize: 14 }}>{next.title}</div>
          </a>
        ) : <span/>}
      </nav>
    </article>
  );
};

// Parse date strings like 'Jan 2024 → now', 'Aug 2015 → Aug 2021', '2020 → Jun 2022'.
window.parseRange = function parseRange(y) {
  if (!y) return null;
  const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6,
                   Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const parseOne = (s) => {
    const t = s.trim();
    if (!t) return null;
    if (/^now$/i.test(t)) return new Date();
    const parts = t.split(/\s+/);
    if (parts.length === 1) {
      const yr = parseInt(parts[0], 10);
      return isNaN(yr) ? null : new Date(yr, 0, 1);
    }
    const m = MONTHS[parts[0]] ?? 0;
    const yr = parseInt(parts[1], 10);
    return isNaN(yr) ? null : new Date(yr, m, 1);
  };
  const sides = y.split(/\s*(?:→|->)\s*/);
  if (sides.length === 1) {
    const d = parseOne(sides[0]);
    return d ? { start: d, end: d } : null;
  }
  const start = parseOne(sides[0]);
  const end = parseOne(sides[1]);
  if (!start || !end) return null;
  return { start, end };
};

window.GanttChart = function GanttChart({ professional, academic }) {
  const svgRef = React.useRef(null);

  const buildEntries = (list, kind) => (list || []).map(emp => ({
    co: emp.co, kind,
    roles: (emp.roles || [])
      .map(role => {
        const r = parseRange(role.y);
        return r ? { role: role.role, ...r } : null;
      })
      .filter(Boolean),
  })).filter(e => e.roles.length > 0);

  const profEntries = buildEntries(professional, 'work');
  const acadEntries = buildEntries(academic, 'school');
  if (profEntries.length === 0 && acadEntries.length === 0) return null;

  // Sort each employer's roles oldest first; sort employers newest-first (resume order).
  [...profEntries, ...acadEntries].forEach(e => e.roles.sort((a, b) => a.start - b.start));
  profEntries.sort((a, b) => b.roles[0].start - a.roles[0].start);
  acadEntries.sort((a, b) => b.roles[0].start - a.roles[0].start);

  const allDates = [...profEntries, ...acadEntries].flatMap(e => e.roles.flatMap(r => [r.start, r.end]));
  const minYear = new Date(Math.min.apply(null, allDates)).getFullYear();
  const maxYear = new Date(Math.max.apply(null, allDates)).getFullYear() + 1;
  const minB = new Date(minYear, 0, 1);
  const maxB = new Date(maxYear, 0, 1);

  // Layout
  const W = 1180;
  const rowHeight = 24;
  const barHeight = 12;
  const yearAxisHeight = 26;
  const sectionHeaderHeight = 20;
  const sectionGap = 8;
  const labelWidth = 340;
  const chartLeft = labelWidth + 16;
  const chartRight = W - 24;
  const chartWidth = chartRight - chartLeft;

  // Distinct hue per employer.
  const palette = ['#d4502a', '#3a8fa3', '#3f8a6a', '#c08e2c', '#7a5ec0', '#5a7a8c', '#8d5a3a', '#a64b69'];
  const allEmployers = [...profEntries, ...acadEntries];
  const colorByCo = {};
  allEmployers.forEach((e, i) => { colorByCo[e.co] = palette[i % palette.length]; });

  const xScale = (date) => chartLeft + ((date - minB) / (maxB - minB)) * chartWidth;
  const yearTicks = [];
  for (let yr = minYear; yr <= maxYear; yr++) yearTicks.push(yr);

  // Y bookkeeping: section header → rows.
  let yCursor = yearAxisHeight;
  const profHeaderY = yCursor;
  yCursor += sectionHeaderHeight;
  const profRowsStart = yCursor;
  yCursor += profEntries.length * rowHeight;
  if (acadEntries.length > 0) yCursor += sectionGap;
  const eduHeaderY = yCursor;
  if (acadEntries.length > 0) yCursor += sectionHeaderHeight;
  const eduRowsStart = yCursor;
  yCursor += acadEntries.length * rowHeight;
  const H = yCursor + 14;

  const renderRow = (e, y) => (
    <g key={`${e.kind}-${e.co}`}>
      <text x={labelWidth} y={y + barHeight - 2} textAnchor="end" fontSize="11"
            fontFamily="ui-monospace, monospace" fontWeight="500" fill="#1a1814">
        {e.co}
      </text>
      {e.roles.map((r, ri) => {
        const x1 = xScale(r.start);
        const x2 = xScale(r.end);
        const w = Math.max(2, x2 - x1);
        return (
          <g key={ri}>
            <title>{`${e.co} · ${r.role} (${r.start.toLocaleString('en-US', { month: 'short', year: 'numeric' })} → ${r.end.toLocaleString('en-US', { month: 'short', year: 'numeric' })})`}</title>
            <rect x={x1} y={y} width={w} height={barHeight}
                  fill={colorByCo[e.co]} fillOpacity={0.9}/>
            {ri > 0 && (
              <line x1={x1} y1={y} x2={x1} y2={y + barHeight}
                    stroke="#fbf9f5" strokeWidth="2"/>
            )}
          </g>
        );
      })}
    </g>
  );

  const renderSectionHeader = (label, y) => (
    <g>
      <line x1={chartLeft} y1={y + sectionHeaderHeight - 6}
            x2={chartRight} y2={y + sectionHeaderHeight - 6}
            stroke="rgba(26,24,20,.18)"/>
      <text x={labelWidth} y={y + sectionHeaderHeight - 9} textAnchor="end"
            fontSize="10.5" letterSpacing="1.2" fontWeight="600"
            fontFamily="ui-monospace, monospace" fill="rgba(26,24,20,.55)">
        {label}
      </text>
    </g>
  );

  const downloadPNG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fbf9f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'experience-gantt.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <div className="reveal" style={{ marginTop: 32 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 12, flexWrap: 'wrap', gap: 12,
      }}>
        <h2 className="display" style={{ font: '500 24px/1.2 var(--display)', margin: 0 }}>
          Timeline
        </h2>
        <button onClick={downloadPNG} className="focus-outline" style={{
          background: 'var(--paper)', border: '1px solid var(--rule)',
          padding: '6px 14px', cursor: 'default', color: 'var(--ink)',
          font: '500 11px var(--mono)', letterSpacing: '.1em', textTransform: 'uppercase',
        }}>
          ↓ Download PNG
        </button>
      </div>
      <div style={{ overflowX: 'auto', border: '1px solid var(--rule)' }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
             style={{ width: '100%', height: 'auto', display: 'block', minWidth: 800, background: '#fbf9f5' }}>
          <rect x="0" y="0" width={W} height={H} fill="#fbf9f5"/>

          {/* Year ticks */}
          {yearTicks.map(yr => {
            const x = xScale(new Date(yr, 0, 1));
            return (
              <g key={yr}>
                <line x1={x} y1={yearAxisHeight} x2={x} y2={H - 14}
                      stroke="rgba(26,24,20,.08)" strokeDasharray="3 5"/>
                <text x={x} y={20} textAnchor="middle" fontSize="10.5"
                      fontFamily="ui-monospace, monospace" fill="rgba(26,24,20,.55)">
                  {yr}
                </text>
              </g>
            );
          })}

          {/* Professional section */}
          {profEntries.length > 0 && renderSectionHeader('── PROFESSIONAL', profHeaderY)}
          {profEntries.map((e, i) => renderRow(e, profRowsStart + i * rowHeight + (rowHeight - barHeight) / 2 + 4))}

          {/* Education section */}
          {acadEntries.length > 0 && renderSectionHeader('── EDUCATION', eduHeaderY)}
          {acadEntries.map((e, i) => renderRow(e, eduRowsStart + i * rowHeight + (rowHeight - barHeight) / 2 + 4))}

          {/* "Today" marker — vertical line spanning the chart at the current date */}
          {(() => {
            const today = new Date();
            if (today < minB || today > maxB) return null;
            const x = xScale(today);
            return (
              <g>
                <line x1={x} y1={6} x2={x} y2={H - 6}
                      stroke="#d4502a" strokeWidth="1.5"/>
                <rect x={x - 22} y={2} width={44} height={14}
                      fill="#d4502a"/>
                <text x={x} y={12} textAnchor="middle" fontSize="9"
                      fontFamily="ui-monospace, monospace" fontWeight="600"
                      letterSpacing="1.2" fill="#ffffff">
                  TODAY
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

window.AboutMePage = function AboutMePage() {
  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="08">About me</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Fifteen years in engineering and leadership across memory, compute, and AI.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        From NVM silicon pathfinding to AI accelerator solutions and cloud-native MLOps — and 25+ U.S. patents along the way.
      </p>
      <GanttChart professional={PROFESSIONAL} academic={ACADEMIC}/>
      <ResumeGroup label="Professional experience" entries={PROFESSIONAL}/>
      <ResumeGroup label="Academic experience"     entries={ACADEMIC}/>
    </section>
  );
};

window.ResumeGroup = function ResumeGroup({ label, entries }) {
  return (
    <div style={{ marginTop: 48 }}>
      <h2 className="display reveal" style={{
        font: '500 26px/1.2 var(--display)', margin: '0 0 4px',
        letterSpacing: '-.01em',
      }}>
        {label}
      </h2>
      <hr className="rule" style={{ marginTop: 12 }}/>
      <div>
        {entries.map((emp, i) => (
          <div key={i} className="reveal" style={{
            padding: '28px 0', borderTop: i ? '1px solid var(--rule-soft)' : 'none',
          }}>
            {/* Employer header */}
            <div className="stack-grid" style={{
              display: 'grid', gridTemplateColumns: '160px 1fr',
              gap: 24, alignItems: 'center',
            }}>
              <div className="lbl-mono">{emp.span}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                {emp.logo && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    height: 36, padding: '4px 10px', minWidth: 56,
                    background: 'var(--logo-frame)',
                    border: '1px solid var(--rule-soft)',
                    flex: '0 0 auto',
                  }}>
                    <img src={emp.logo} alt="" aria-hidden="true"
                         style={{ maxHeight: 24, maxWidth: 96, objectFit: 'contain' }}/>
                  </span>
                )}
                <div>
                  <h3 className="display" style={{
                    font: '500 24px/1.2 var(--display)', margin: 0, color: 'var(--accent)',
                  }}>
                    {emp.co}
                  </h3>
                  {emp.loc && (
                    <div className="lbl-mono" style={{ marginTop: 4 }}>{emp.loc}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Roles under this employer */}
            <div className="role-indent" style={{ marginTop: 18, paddingLeft: 184, borderLeft: 'none' }}>
              {emp.roles.map((r, j) => (
                <div key={j} className="stack-grid-role" style={{
                  marginTop: j ? 22 : 0,
                  paddingTop: j ? 22 : 0,
                  borderTop: j ? '1px dashed var(--rule-soft)' : 'none',
                }}>
                  <div className="lbl-mono" style={{ color: 'var(--muted)' }}>
                    {r.y}
                    {/now\s*$/i.test(r.y) && <LiveDot/>}
                  </div>
                  <h4 className="display" style={{
                    font: '500 19px/1.3 var(--display)', margin: '4px 0 0',
                  }}>
                    {r.role}
                  </h4>
                  {r.note && (
                    <div className="lbl-mono" style={{ marginTop: 4, color: 'var(--muted)' }}>
                      {r.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.NewsPage = function NewsPage() {
  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="07">News</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        News &amp; announcements.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        Press coverage, personal updates, podcasts, and interviews.
      </p>

      {(!NEWS || NEWS.length === 0) ? (
        <div className="reveal lbl-mono" style={{
          marginTop: 36, padding: '28px 0', borderTop: '1px solid var(--rule)',
          color: 'var(--muted)',
        }}>
          ◇ More coming soon.
        </div>
      ) : (
        <div style={{ marginTop: 32 }}>
          {NEWS.map((m, i) => (
            <a key={i} href={m.url} target="_blank" rel="noreferrer"
               className="reveal hover-line list-row"
               style={{
                 display: 'grid', gridTemplateColumns: '90px 200px 1fr 140px',
                 padding: '20px 0', borderTop: '1px solid var(--rule)',
                 alignItems: 'baseline', gap: 16, color: 'var(--ink)',
               }}>
              <span className="lbl-mono">{m.date}</span>
              <span className="lbl-mono" style={{ color: 'var(--accent)' }}>{m.outlet}</span>
              <span className="display" style={{ font: '500 18px/1.3 var(--display)' }}>{m.title}</span>
              <span className="lbl-mono" style={{ textAlign: 'right' }}>{m.loc} ↗</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

window.ResearchSection = function ResearchSection({ label, children }) {
  return (
    <div style={{ marginTop: 48 }}>
      <h2 className="display reveal" style={{
        font: '500 24px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
      }}>{label}</h2>
      <hr className="rule" style={{ marginTop: 12 }}/>
      {children}
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

window.PubGroup = function PubGroup({ label, kind, items }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div className="reveal" style={{
        display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4, flexWrap: 'wrap',
      }}>
        <h3 className="display" style={{
          font: '500 22px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
        }}>{label}</h3>
        <Pill kind={kind}/>
        <span className="lbl-mono" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
          {items.length} {items.length === 1 ? 'paper' : 'papers'}
        </span>
      </div>
      <hr className="rule" style={{ marginTop: 8 }}/>
      {items.length === 0 ? (
        <EmptyNote/>
      ) : (
        <div style={{ marginTop: 4 }}>
          {items.map((m, i) => {
            const inner = (
              <>
                <span className="lbl-mono">{m.date}</span>
                <span className="lbl-mono" style={{ color: 'var(--accent)' }}>{m.venue}</span>
                <div>
                  <div className="display" style={{ font: '500 18px/1.3 var(--display)' }}>{m.title}</div>
                  {m.authors && (
                    <div style={{ marginTop: 4, color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>
                      {m.authors}
                    </div>
                  )}
                </div>
                <span className="lbl-mono" style={{ textAlign: 'right' }}>
                  {m.loc}{m.url ? ' ↗' : ''}
                </span>
              </>
            );
            const style = {
              display: 'grid', gridTemplateColumns: '90px 200px 1fr 140px',
              padding: '20px 0',
              borderTop: i ? '1px solid var(--rule-soft)' : 'none',
              alignItems: 'baseline', gap: 16, color: 'var(--ink)',
            };
            return m.url
              ? <a key={i} href={m.url} target="_blank" rel="noreferrer"
                   className="reveal hover-line list-row" style={style}>{inner}</a>
              : <div key={i} className="reveal list-row" style={style}>{inner}</div>;
          })}
        </div>
      )}
    </div>
  );
};

window.ResearchPage = function ResearchPage() {
  const r = window.RESEARCH || {};
  const active = r.active || [];
  const pubs = r.publications || [];
  const collabs = r.collaborators || [];

  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="03">Research</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Papers &amp; research.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        Active research, publications, and collaborators.
      </p>

      <ResearchSection label="Active research projects">
        {active.length === 0 ? (
          <EmptyNote/>
        ) : (
          <div style={{ marginTop: 4 }}>
            {active.map((p, i) => (
              <article key={p.id || i} className="reveal list-row" style={{
                display: 'grid', gridTemplateColumns: '90px 1fr 140px',
                gap: 20, padding: '24px 0',
                borderTop: i ? '1px solid var(--rule-soft)' : 'none',
                alignItems: 'baseline',
              }}>
                <span className="lbl-mono">{p.year}</span>
                <div>
                  <h3 className="display" style={{ font: '500 20px/1.3 var(--display)', margin: 0 }}>
                    {p.url ? (
                      <a className="hover-line" href={p.url} target="_blank" rel="noreferrer"
                         style={{ color: 'var(--ink)' }}>
                        {p.title} ↗
                      </a>
                    ) : p.title}
                  </h3>
                  {p.blurb && (
                    <p style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.65 }}>
                      {p.blurb}
                    </p>
                  )}
                </div>
                {p.status && (
                  <span className="lbl-mono" style={{ color: 'var(--accent)', textAlign: 'right' }}>
                    {p.status}
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </ResearchSection>

      <ResearchSection label="Publications">
        {pubs.length === 0 ? (
          <EmptyNote>
            ◇ More coming soon. Browse{' '}
            <a className="hover-line" href={SITE.social.scholar} target="_blank" rel="noreferrer"
               style={{ color: 'var(--ink)' }}>
              Google Scholar ↗
            </a>{' '}in the meantime.
          </EmptyNote>
        ) : (
          <>
            <PubGroup label="Engineering" kind="engineering"
                      items={pubs.filter(p => p.kind === 'engineering')}/>
            <PubGroup label="Science" kind="science"
                      items={pubs.filter(p => p.kind === 'science')}/>
          </>
        )}
      </ResearchSection>

      <ResearchSection label="Collaborators">
        {collabs.length === 0 ? (
          <EmptyNote/>
        ) : (
          <div className="reveal" style={{
            marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 12,
          }}>
            {collabs.map((c, i) => {
              const inner = (
                <div style={{
                  padding: '12px 16px', border: '1px solid var(--rule)',
                  background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: 2,
                  transition: 'border-color .2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}>
                  <span className="display" style={{ font: '500 15px/1.2 var(--display)' }}>
                    {c.name}
                  </span>
                  {c.affiliation && (
                    <span className="lbl-mono" style={{ color: 'var(--muted)' }}>
                      {c.affiliation}
                    </span>
                  )}
                </div>
              );
              return c.url
                ? <a key={i} href={c.url} target="_blank" rel="noreferrer"
                     style={{ color: 'var(--ink)' }}>{inner}</a>
                : <div key={i} style={{ color: 'var(--ink)' }}>{inner}</div>;
            })}
          </div>
        )}
      </ResearchSection>
    </section>
  );
};

window.ArtModal = function ArtModal({ art, onClose, onPrev, onNext, hasNav }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (hasNav && e.key === 'ArrowLeft' && onPrev) onPrev();
      else if (hasNav && e.key === 'ArrowRight' && onNext) onNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onPrev, onNext, hasNav]);
  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label={art.title} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="art-modal" style={{
        background: 'var(--bg)', border: '1px solid var(--rule)',
        maxWidth: 'min(1200px, 100%)', width: '100%', maxHeight: 'calc(100vh - 48px)',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          background: 'var(--paper)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          minHeight: 320, position: 'relative',
        }}>
          <img src={art.image} alt={art.title}
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{
              maxWidth: 'calc(100% - 16px)', maxHeight: 'calc(100vh - 64px)',
              objectFit: 'contain', display: 'block',
              border: '8px solid #ffffff', background: '#ffffff',
              boxSizing: 'content-box',
              userSelect: 'none', WebkitUserSelect: 'none',
              WebkitUserDrag: 'none', WebkitTouchCallout: 'none',
            }}/>
          <div aria-hidden="true" style={{
            position: 'absolute', left: 16, bottom: 16,
            padding: '6px 10px',
            background: 'rgba(0,0,0,.42)', color: '#fff',
            font: '500 10px var(--mono)',
            letterSpacing: '.14em', textTransform: 'uppercase',
            pointerEvents: 'none', userSelect: 'none',
          }}>
            Artist: Shashank Bangalore Lakshman
          </div>
        </div>
        <div style={{
          padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 12,
          overflowY: 'auto', overflowX: 'hidden',
          borderLeft: '1px solid var(--rule)',
          wordBreak: 'break-word', overflowWrap: 'anywhere',
          minWidth: 0,
        }}>
          {hasNav && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', gap: 12,
              paddingBottom: 12,
              borderBottom: '1px solid var(--rule)',
            }}>
              <button onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}
                      aria-label="Previous" style={{
                background: 'transparent', border: '1px solid var(--rule)',
                padding: '4px 12px', cursor: 'default', color: 'var(--ink)',
                font: '500 10px var(--mono)', letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}>‹ Prev</button>
              <button onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
                      aria-label="Next" style={{
                background: 'transparent', border: '1px solid var(--rule)',
                padding: '4px 12px', cursor: 'default', color: 'var(--ink)',
                font: '500 10px var(--mono)', letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}>Next ›</button>
            </div>
          )}
          {art.year && <div className="lbl-mono" style={{ color: 'var(--accent)' }}>{art.year}</div>}
          <h2 className="display" style={{ font: '500 22px/1.25 var(--display)', margin: 0 }}>
            {art.title}
          </h2>
          {art.medium && <div className="lbl-mono">{art.medium}</div>}
          {art.tags && art.tags.length > 0 && (
            <div className="lbl-mono" style={{
              color: 'var(--muted)',
              display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            }}>
              {art.tags.map((t, i) => (
                <React.Fragment key={t}>
                  {i > 0 && <span style={{ color: 'var(--accent)' }}>·</span>}
                  <span>#{t}</span>
                </React.Fragment>
              ))}
            </div>
          )}
          {art.description && (
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              {art.description}
            </p>
          )}
        </div>
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', bottom: 12, right: 12,
          background: 'rgba(0,0,0,.45)', border: 'none', color: '#fff',
          width: 32, height: 32, borderRadius: 4, cursor: 'default',
          font: '400 18px var(--mono)', lineHeight: '32px',
        }}>×</button>
      </div>
    </div>
  );
};

window.GalleryPage = function GalleryPage() {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const items = window.ART || [];
  const hasNav = items.length > 1;
  const close = () => setActiveIndex(null);
  const prev = () => setActiveIndex(i => (i === null ? null : (i - 1 + items.length) % items.length));
  const next = () => setActiveIndex(i => (i === null ? null : (i + 1) % items.length));
  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="05">Gallery</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Selected art.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        Visual experiments and personal pieces. Click any tile for the full image and notes.
      </p>

      {items.length === 0 ? (
        <EmptyNote/>
      ) : (() => {
        // Group items by their normalized medium (first segment before " · "),
        // preserving first-seen order and the original flat index for modal nav.
        const groupOrder = [];
        const groups = {};
        items.forEach((art, idx) => {
          const key = ((art.medium || 'Other').split(' · ')[0] || 'Other').trim();
          if (!groups[key]) { groups[key] = []; groupOrder.push(key); }
          groups[key].push({ art, index: idx });
        });
        return groupOrder.map(medium => (
          <div key={medium} style={{ marginTop: 40 }}>
            <div className="reveal" style={{
              display: 'flex', alignItems: 'baseline', gap: 12,
              marginBottom: 4, flexWrap: 'wrap',
            }}>
              <h2 className="display" style={{
                font: '500 22px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
              }}>{medium}</h2>
              <span className="lbl-mono" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
                {groups[medium].length} {groups[medium].length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
            <hr className="rule" style={{ marginTop: 8 }}/>
            <div style={{
              marginTop: 18, display: 'grid', gap: 10,
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            }}>
              {groups[medium].map(({ art, index }) => (
                <button key={art.id || index} onClick={() => setActiveIndex(index)}
                        aria-label={`Open ${art.title}`}
                        className="reveal focus-outline"
                        style={{
                          display: 'block', padding: 0, border: '1px solid var(--rule)',
                          background: 'var(--paper)', cursor: 'default',
                          aspectRatio: '1 / 1', overflow: 'hidden',
                          transition: 'border-color .2s ease, transform .2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}>
                  <img src={art.thumbnail || art.image} alt={art.title}
                       draggable="false"
                       onContextMenu={(e) => e.preventDefault()}
                       onDragStart={(e) => e.preventDefault()}
                       style={{
                         width: '100%', height: '100%',
                         objectFit: 'cover', display: 'block',
                         userSelect: 'none', WebkitUserSelect: 'none',
                         WebkitUserDrag: 'none', WebkitTouchCallout: 'none',
                       }}/>
                </button>
              ))}
            </div>
          </div>
        ));
      })()}

      {activeIndex !== null && (
        <ArtModal art={items[activeIndex]} onClose={close}
                  onPrev={prev} onNext={next} hasNav={hasNav}/>
      )}
    </section>
  );
};

window.OpenSourcePage = function OpenSourcePage() {
  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="04">Open-source</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Open-source contributions.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        Tools, libraries, and patches I've authored or contributed to.
      </p>

      {(!OSS || OSS.length === 0) ? (
        <div className="reveal lbl-mono" style={{
          marginTop: 36, padding: '28px 0', borderTop: '1px solid var(--rule)',
          color: 'var(--muted)',
        }}>
          ◇ More coming soon. Browse{' '}
          <a className="hover-line" href={SITE.social.github} target="_blank" rel="noreferrer"
             style={{ color: 'var(--ink)' }}>
            github.com/shashankbl ↗
          </a>{' '}in the meantime.
        </div>
      ) : (
        <div style={{ marginTop: 32 }}>
          {OSS.map((o, i) => (
            <article key={i} className="reveal list-row" style={{
              display: 'grid', gridTemplateColumns: '90px 1fr 140px',
              padding: '24px 0', borderTop: '1px solid var(--rule)',
              gap: 20, alignItems: 'baseline',
            }}>
              <span className="lbl-mono">{o.year}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <h3 className="display" style={{
                    font: '500 22px/1.25 var(--display)', margin: 0,
                  }}>
                    {o.url ? (
                      <a className="hover-line" href={o.url} target="_blank" rel="noreferrer"
                         style={{ color: 'var(--ink)' }}>{o.name}</a>
                    ) : o.name}
                  </h3>
                  {o.tag && <span className="lbl-mono">{o.tag}</span>}
                </div>
                <div className="lbl-mono" style={{ marginTop: 4, color: 'var(--accent)' }}>{o.role}</div>
                {o.desc && (
                  <p style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.65 }}>
                    {o.desc}
                  </p>
                )}
              </div>
              <div className="lbl-mono" style={{
                textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end',
              }}>
                {o.url && (
                  <a className="hover-line" href={o.url} target="_blank" rel="noreferrer"
                     style={{ color: 'var(--accent)' }}>
                    REPO ↗
                  </a>
                )}
                {o.demo && (
                  <a className="hover-line" href={o.demo} target="_blank" rel="noreferrer"
                     style={{ color: 'var(--accent)' }}>
                    DEMO ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
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
