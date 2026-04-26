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
        <div style={{
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
    ['/blog', 'writing'],
    ['/talks', 'talks'],
    ['/news', 'news'],
    ['/resume', 'resume'],
    ['/contact', 'contact'],
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
          <span style={{ width: 14, height: 14, background: 'var(--accent)', borderRadius: '50%' }}/>
          <span style={{ font: '500 12px var(--mono)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Shashank&nbsp;Bangalore&nbsp;Lakshman
          </span>
        </a>
        <span className="lbl-mono" style={{ display: 'inline-block' }}>
          AI · Software · Semiconductors
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
                <span style={{ color: 'var(--accent)' }}>{String(i).padStart(2,'0')}/</span>{lbl}
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
    <footer style={{
      marginTop: 80, background: 'var(--ink)', color: 'var(--bg)',
      padding: '40px 32px 28px',
    }}>
      <div style={{
        maxWidth: 1180, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'baseline',
      }}>
        <div>
          <div className="lbl-mono" style={{ color: 'rgba(244,241,236,.5)' }}>
            ── <span style={{ color: 'var(--accent)' }}>07</span> / CONTACT
          </div>
          <div className="display" style={{
            font: '500 30px/1.15 var(--display)', marginTop: 10, maxWidth: 540,
          }}>
            Let's connect if you are interested to chat about my expertise or projects.
          </div>
        </div>
        <div style={{
          font: '400 11px var(--mono)', color: 'rgba(244,241,236,.65)',
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
      <div style={{
        maxWidth: 1180, margin: '32px auto 0', paddingTop: 18,
        borderTop: '1px solid rgba(244,241,236,.15)',
        display: 'flex', justifyContent: 'space-between',
        font: '400 10.5px var(--mono)', color: 'rgba(244,241,236,.45)',
        letterSpacing: '.1em', textTransform: 'uppercase',
      }}>
        <span>© {SITE.name} · 2014 → {new Date().getFullYear()}</span>
        <span>Press <kbd style={{ color: 'var(--bg)' }}>?</kbd> for keyboard nav</span>
      </div>
    </footer>
  );
};

// ─── Pages ───────────────────────────────────────────────────────────────────

window.HomePage = function HomePage({ nav }) {
  return (
    <>
      {/* Hero */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '72px 32px 56px' }}>
        <div className="reveal">
          <SectionLabel n="01">HELLO</SectionLabel>
        </div>
        <div style={{
          marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, alignItems: 'end',
        }}>
          <div>
            <h1 className="reveal display" style={{
              font: '500 clamp(48px, 7vw, 78px)/1.02 var(--display)',
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
                <span>AI Inference. Edge Computing. AI Acceleration.</span>
                <span style={{ color: 'var(--muted)' }}>OPEN&nbsp;TO</span>
                <span style={{ color: 'var(--accent)' }}>● collaborations · talks</span>
              </div>
            </div>
            <div className="reveal" style={{
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
      <section style={{
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

      {/* Now */}
      <section style={{
        maxWidth: 1180, margin: '0 auto', padding: '52px 32px',
        borderTop: '1px solid var(--rule)',
      }}>
        <div className="reveal">
          <SectionLabel n="02">Now</SectionLabel>
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
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="02">Selected work</SectionLabel></div>
      <h1 className="display reveal" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Things I've shipped.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        A handful of artifacts across the AI / software / silicon stack.
      </p>

      <ProjectGroup label="Engineering" kind="engineering"
                    items={PROJECTS.filter(p => p.kind === 'engineering')}/>
      <ProjectGroup label="Art"         kind="art"
                    items={PROJECTS.filter(p => p.kind === 'art')}/>
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
            <article key={p.id} className="reveal" style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 200px',
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
                  <span>SCALE · {p.loc}</span>
                  {p.url && (
                    <a className="hover-line" href={p.url} target="_blank" rel="noreferrer"
                       style={{ color: 'var(--accent)' }}>
                      DEMO ↗
                    </a>
                  )}
                </div>
              </div>
              <div>
                <Placeholder label={`Figure / ${p.n}`} h={120}/>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

window.BlogPage = function BlogPage({ nav }) {
  return (
    <section style={{ maxWidth: 880, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="03">Writing</SectionLabel></div>
      <h1 className="display reveal" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Long-form notes.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 540, fontSize: 14.5 }}>
        On inference, accelerators, and the seam between the two.
      </p>

      <SubstackAd/>

      <div style={{ marginTop: 32 }}>
        {POSTS.map((p, i) => (
          <a key={p.slug} href={'#/blog/'+p.slug}
             onClick={(e)=>{e.preventDefault(); nav('/blog/'+p.slug);}}
             className="reveal"
             style={{
               display: 'block', padding: '24px 0',
               borderTop: '1px solid var(--rule)', color: 'var(--ink)',
             }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline' }}>
              <span style={{ font: '400 11px var(--mono)', color: 'var(--muted)', letterSpacing: '.06em', minWidth: 90 }}>
                {p.date}
              </span>
              <h3 className="display" style={{
                flex: 1, font: '500 22px/1.3 var(--display)', margin: 0,
              }}>{p.title}</h3>
              <span style={{ font: '400 11px var(--mono)', color: 'var(--muted)', minWidth: 60, textAlign: 'right' }}>
                {p.read}
              </span>
            </div>
            <p style={{ margin: '8px 0 0 106px', color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              {p.blurb}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
};

window.PostPage = function PostPage({ slug, nav }) {
  const post = POSTS.find(p => p.slug === slug) || POSTS[0];
  const idx = POSTS.indexOf(post);
  const prev = POSTS[idx - 1], next = POSTS[idx + 1];
  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px' }}>
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

window.ResumePage = function ResumePage() {
  return (
    <section style={{ maxWidth: 880, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="04">Resume</SectionLabel></div>
      <h1 className="display reveal" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Thirteen years across memory, compute, and AI. Two+ years leading ML engineering.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        From NVM silicon pathfinding to AI accelerator solutions and cloud-native MLOps — and 25+ U.S. patents along the way.
      </p>
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
            <div style={{
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
            <div style={{ marginTop: 18, paddingLeft: 184, borderLeft: 'none' }}>
              {emp.roles.map((r, j) => (
                <div key={j} style={{
                  marginTop: j ? 22 : 0,
                  paddingTop: j ? 22 : 0,
                  borderTop: j ? '1px dashed var(--rule-soft)' : 'none',
                }}>
                  <div className="lbl-mono" style={{ color: 'var(--muted)' }}>{r.y}</div>
                  <h4 className="display" style={{
                    font: '500 19px/1.3 var(--display)', margin: '4px 0 0',
                  }}>
                    {r.role}
                  </h4>
                  <ul style={{
                    marginTop: 10, marginBottom: 0, paddingLeft: 0, listStyle: 'none',
                    color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.65,
                  }}>
                    {r.bullets.map((b, k) => (
                      <li key={k} style={{
                        display: 'grid', gridTemplateColumns: '14px 1fr', gap: 10,
                        marginTop: k ? 8 : 0,
                      }}>
                        <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', lineHeight: 1.65 }}>▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.TalksPage = function TalksPage() {
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="05">Talks</SectionLabel></div>
      <h1 className="display reveal" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 32px', letterSpacing: '-.025em',
      }}>
        Things I've said out loud.
      </h1>
      <div>
        {TALKS.map((t, i) => (
          <div key={i} className="reveal" style={{
            display: 'grid', gridTemplateColumns: '90px 180px 1fr 140px',
            padding: '20px 0', borderTop: '1px solid var(--rule)',
            alignItems: 'baseline', gap: 16,
          }}>
            <span className="lbl-mono">{t.date}</span>
            <span className="lbl-mono" style={{ color: 'var(--accent)' }}>{t.venue}</span>
            <span className="display" style={{ font: '500 18px/1.3 var(--display)' }}>{t.title}</span>
            <span className="lbl-mono" style={{ textAlign: 'right' }}>{t.loc}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

window.NewsPage = function NewsPage() {
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="06">News</SectionLabel></div>
      <h1 className="display reveal" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        In the news.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        Articles, podcasts, and interviews.
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
               className="reveal hover-line"
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

window.ContactPage = function ContactPage() {
  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="07">Contact</SectionLabel></div>
      <h1 className="display reveal" style={{
        font: '500 56px/1.05 var(--display)', margin: '14px 0 8px',
        letterSpacing: '-.025em', maxWidth: 620,
      }}>
        Currently open to <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>collaborations</span> on AI/HW co-design research.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 540, marginTop: 18, fontSize: 15 }}>
        Drop a line if you're working on inference systems, accelerator co-design, or vector ISAs —
        or just want to swap notes on the state of the art in AI and semiconductors.
      </p>
      <div className="reveal" style={{
        marginTop: 36, display: 'grid', gridTemplateColumns: '120px 1fr',
        gap: '14px 28px', font: '400 14px/1.6 var(--mono)',
      }}>
        <span style={{ color: 'var(--muted)' }}>GITHUB</span>
        <a className="hover-line" href={SITE.social.github} target="_blank" rel="noreferrer">
          github.com/shashankbl ↗
        </a>
        <span style={{ color: 'var(--muted)' }}>LINKEDIN</span>
        <a className="hover-line" href={SITE.social.linkedin} target="_blank" rel="noreferrer">
          linkedin.com/in/shashankbl ↗
        </a>
        <span style={{ color: 'var(--muted)' }}>SCHOLAR</span>
        <a className="hover-line" href={SITE.social.scholar} target="_blank" rel="noreferrer">
          scholar.google.com ↗
        </a>
      </div>
    </section>
  );
};

// Help overlay
window.HelpOverlay = function HelpOverlay({ open, onClose }) {
  if (!open) return null;
  const rows = [
    ['j  /  ↓', 'scroll down'],
    ['k  /  ↑', 'scroll up'],
    ['g h',     'home'],
    ['g p',     'projects'],
    ['g w',     'writing / blog'],
    ['g r',     'resume'],
    ['g t',     'talks'],
    ['g n',     'news'],
    ['g c',     'contact'],
    ['1 — 6',   'jump to section'],
    ['t',       'toggle theme'],
    ['?',       'this help'],
    ['esc',     'close'],
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
