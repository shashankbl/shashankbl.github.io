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

window.Header = function Header({ path, nav }) {
  const items = [
    ['/', 'index'],
    ['/projects', 'work'],
    ['/blog', 'writing'],
    ['/resume', 'resume'],
    ['/talks', 'talks'],
    ['/now', 'now'],
    ['/contact', 'contact'],
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'color-mix(in oklab, var(--bg) 92%, transparent)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--rule)',
    }}>
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
        <nav style={{
          marginLeft: 'auto', display: 'flex', gap: 22, flexWrap: 'wrap',
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
              Engineer at the<br/>
              intersection of <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>AI</span><br/>
              and <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>silicon</span>.
            </h1>
            <p className="reveal" style={{
              marginTop: 26, font: '400 14.5px/1.7 var(--mono)',
              color: 'var(--muted)', maxWidth: 520,
            }}>
              {SITE.name}. {SITE.blurb}
            </p>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
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
                <span>LLM inference · accelerator design</span>
                <span style={{ color: 'var(--muted)' }}>OPEN&nbsp;TO</span>
                <span style={{ color: 'var(--accent)' }}>● collaborations · talks</span>
              </div>
            </div>
            <div className="reveal" style={{
              border: '1px solid var(--rule)', background: 'var(--paper)', padding: 20,
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14,
            }}>
              {[['12+','years'],['9','papers'],['4','patents']].map(([a,b]) => (
                <div key={b}>
                  <div className="display" style={{ font: '500 30px/1 var(--display)' }}>{a}</div>
                  <div className="lbl-mono" style={{ marginTop: 4 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section style={{
        maxWidth: 1180, margin: '0 auto', padding: '52px 32px',
        borderTop: '1px solid var(--rule)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28,
        }}>
          <div className="reveal">
            <SectionLabel n="02">Selected work</SectionLabel>
            <h2 className="display" style={{ font: '500 32px/1.1 var(--display)', margin: '8px 0 0' }}>
              Things I've shipped.
            </h2>
          </div>
          <a href="#/projects" onClick={(e)=>{e.preventDefault(); nav('/projects');}}
             className="hover-line lbl-mono" style={{ color: 'var(--ink)' }}>
            All work →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          {PROJECTS.map(p => (
            <a key={p.id} href={'#/projects'}
               onClick={(e)=>{e.preventDefault(); nav('/projects');}}
               className="reveal"
               style={{
                 border: '1px solid var(--rule)', background: 'var(--paper)', padding: 22,
                 display: 'flex', flexDirection: 'column', gap: 14,
                 color: 'var(--ink)', transition: 'border-color .2s ease, transform .2s ease',
               }}
               onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}>
              <div className="lbl-mono" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><span className="num">{p.n}</span> · {p.tag}</span>
                <span>{p.year}</span>
              </div>
              <Placeholder label={`Figure / ${p.n}`} h={140}/>
              <div>
                <div className="display" style={{ font: '500 21px/1.2 var(--display)' }}>{p.title}</div>
                <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 14, lineHeight: 1.55 }}>
                  {p.blurb}
                </div>
              </div>
              <div className="lbl-mono" style={{
                marginTop: 'auto', paddingTop: 10,
                borderTop: '1px dashed var(--rule)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>{p.stack}</span>
                <span style={{ color: 'var(--accent)' }}>READ →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Writing teaser */}
      <section style={{
        maxWidth: 1180, margin: '0 auto', padding: '40px 32px 64px',
        borderTop: '1px solid var(--rule)',
      }}>
        <div className="reveal">
          <SectionLabel n="03">Writing</SectionLabel>
        </div>
        <div style={{ marginTop: 18 }}>
          {POSTS.map((p, i) => (
            <a key={p.slug} href={'#/blog/'+p.slug}
               onClick={(e)=>{e.preventDefault(); nav('/blog/'+p.slug);}}
               className="reveal"
               style={{
                 display: 'grid', gridTemplateColumns: '110px 1fr 80px',
                 padding: '18px 0', borderTop: i ? '1px solid var(--rule-soft)' : 'none',
                 alignItems: 'baseline', color: 'var(--ink)',
               }}>
              <span style={{ font: '400 11px var(--mono)', color: 'var(--muted)', letterSpacing: '.06em' }}>
                {p.date}
              </span>
              <span className="display" style={{ font: '400 18px/1.3 var(--display)' }}>{p.title}</span>
              <span style={{ font: '400 11px var(--mono)', color: 'var(--muted)', textAlign: 'right' }}>
                {p.read}
              </span>
            </a>
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
      <div style={{ marginTop: 36, display: 'grid', gap: 0 }}>
        {PROJECTS.map((p, i) => (
          <article key={p.id} className="reveal" style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 200px',
            gap: 28, padding: '32px 0',
            borderTop: '1px solid var(--rule)',
          }}>
            <div className="lbl-mono"><span className="num">{p.n}</span></div>
            <div>
              <div className="lbl-mono">{p.tag} · {p.year}</div>
              <h3 className="display" style={{
                font: '500 28px/1.15 var(--display)', margin: '8px 0 0',
              }}>{p.title}</h3>
              <p style={{ marginTop: 10, color: 'var(--muted)', maxWidth: 720, fontSize: 14.5, lineHeight: 1.65 }}>
                {p.blurb}
              </p>
              <div className="lbl-mono" style={{ marginTop: 14, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                <span>STACK · {p.stack}</span>
                <span>SCALE · {p.loc}</span>
              </div>
            </div>
            <div>
              <Placeholder label={`Figure / ${p.n}`} h={120}/>
            </div>
          </article>
        ))}
      </div>
    </section>
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
        Twelve years.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 540, fontSize: 14.5 }}>
        Compilers, accelerators, and the path that connected them.
      </p>
      <div style={{ marginTop: 36 }}>
        {RESUME.map((r, i) => (
          <div key={i} className="reveal" style={{
            display: 'grid', gridTemplateColumns: '160px 1fr',
            padding: '24px 0', borderTop: '1px solid var(--rule)', gap: 24,
          }}>
            <div className="lbl-mono">{r.y}</div>
            <div>
              <h3 className="display" style={{ font: '500 22px/1.25 var(--display)', margin: 0 }}>{r.role}</h3>
              <div className="lbl-mono" style={{ marginTop: 4, color: 'var(--accent)' }}>{r.co}</div>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.65 }}>{r.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
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

window.NowPage = function NowPage() {
  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="06">Now</SectionLabel></div>
      <h1 className="display reveal" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        What I'm doing now.
      </h1>
      <div className="lbl-mono">Last updated · {NOW_DATE}</div>
      <div className="reveal" style={{
        marginTop: 28, padding: '22px 24px',
        background: 'var(--paper)',
        border: '1px solid var(--rule)', borderLeft: '2px solid var(--accent)',
        font: '400 15.5px/1.85 var(--sans)',
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
      <p style={{ marginTop: 18, color: 'var(--muted)', fontSize: 13 }}>
        Inspired by <a href="https://nownownow.com" target="_blank" rel="noreferrer"
           className="hover-line" style={{ color: 'var(--ink)' }}>nownownow.com</a>.
      </p>
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
        Currently open to <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>collaborations</span> on AI/HW co-design.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 540, marginTop: 18, fontSize: 15 }}>
        Drop a line if you're working on inference systems, accelerator co-design, or vector ISAs —
        or just want to swap notes on the state of the art.
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
    ['g n',     'now'],
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
