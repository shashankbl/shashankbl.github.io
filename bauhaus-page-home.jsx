// bauhaus-page-home.jsx — HomePage and its widgets.
(function() {

const { useState } = React;

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
            <h1 className="reveal display hero-headline" style={{
              font: '500 clamp(26px, 3.6vw, 41px)/1.05 var(--display)',
              margin: 0, letterSpacing: '-.025em',
            }}>
              Engineering Leader at the intersection of{' '}
              <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>AI</span>{' '}
              and{' '}
              <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Silicon</span>.
            </h1>
            <p className="reveal" style={{
              marginTop: 26, font: '400 14.5px/1.7 var(--mono)',
              color: 'var(--muted)', maxWidth: 520,
            }}>
              {SITE.blurb}
            </p>
            <NewsFlash items={typeof FLASH !== 'undefined' ? FLASH : []} nav={nav}/>
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
              <div style={{
                display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 8,
                font: '400 12.5px var(--mono)',
              }}>
                <span style={{ color: 'var(--muted)' }}>LOCATION</span>
                <span>{SITE.location}</span>
                <span style={{ color: 'var(--muted)' }}>FOCUS</span>
                <span>Memory & Compute for AI systems. AI Evals. Agentic AI.</span>
                <span style={{ color: 'var(--muted)' }}>OPEN&nbsp;TO</span>
                <span style={{ color: 'var(--accent)' }}>research collaborations · invited talks</span>
                <span style={{ color: 'var(--muted)' }}>SOCIAL</span>
                <SocialRow size={20} gap={14}/>
              </div>
            </div>
            <div className="reveal stats-card" style={{
              border: '1px solid var(--rule)', background: 'var(--paper)', padding: 20,
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14,
            }}>
              {[['15+','years'],['EE+CS','Expertise'],['25+','patents']].map(([a,b]) => (
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

})();
