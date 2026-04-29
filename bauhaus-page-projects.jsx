// bauhaus-page-projects.jsx — ProjectsPage, ProjectGroup, Placeholder.
(function() {

const { useState } = React;

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

      <ProjectGroup label="Closed-source" kind="closed-source"
                    items={PROJECTS.filter(p => p.kind === 'closed-source')}/>

      <ProjectGroup label="Open-source" kind="open-source"
                    items={(window.OSS || []).map((o, i) => ({
                      id:    'oss-' + i,
                      n:     String(i + 1).padStart(3, '0'),
                      kind:  'open-source',
                      title: o.name,
                      tag:   o.tag,
                      year:  o.year,
                      blurb: o.desc,
                      stack: o.stack,
                      loc:   o.role,
                      links: [
                        o.url  && { label: 'Repo', url: o.url  },
                        o.demo && { label: 'Demo', url: o.demo },
                      ].filter(Boolean),
                    }))}/>

      <PatentTable items={PATENTS}/>
    </section>
  );
};

window.PatentTable = function PatentTable({ items }) {
  const PER_PAGE = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PER_PAGE;
  const visible = items.slice(start, start + PER_PAGE);
  const leads   = items.filter(p => p.lead).length;
  const granted = items.filter(p => /B\d*$/.test(p.pub)).length;
  return (
    <div style={{ marginTop: 56 }}>
      <div className="reveal" style={{
        display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4,
      }}>
        <h2 className="display" style={{
          font: '500 26px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
        }}>
          Patents
        </h2>
        <span className="lbl-mono" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
          {items.length} filings · {leads} as primary inventor · {granted} granted
          {' '}
          <a href="https://credentials.micron.com/4ef384bc-e26a-4727-a03b-8941cb61458e#acc.HKzuJxY7"
             target="_blank" rel="noreferrer"
             style={{
               display: 'inline-flex', alignItems: 'center', gap: 6,
               padding: '3px 10px', marginLeft: 6,
               border: '1px solid var(--accent)', borderRadius: 999,
               background: 'transparent',
               font: '500 10px var(--mono)',
               letterSpacing: '.14em', textTransform: 'uppercase',
               color: 'var(--accent)', whiteSpace: 'nowrap',
               transition: 'background .2s ease, color .2s ease',
             }}
             onMouseEnter={e => {
               e.currentTarget.style.background = 'var(--accent)';
               e.currentTarget.style.color = 'var(--bg)';
             }}
             onMouseLeave={e => {
               e.currentTarget.style.background = 'transparent';
               e.currentTarget.style.color = 'var(--accent)';
             }}>
            <span style={{ fontSize: 11, lineHeight: 1 }}>✓</span>
            Verified by Micron ↗
          </a>
        </span>
      </div>
      <hr className="rule" style={{ marginTop: 8 }}/>

      <div className="patent-table reveal" style={{
        marginTop: 18, display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 130px 80px',
        columnGap: 18, rowGap: 0,
        font: '400 13px var(--mono)',
      }}>
        <div className="lbl-mono" style={{ paddingBottom: 8, color: 'var(--muted)' }}>Title</div>
        <div className="lbl-mono" style={{ paddingBottom: 8, color: 'var(--muted)' }}>Role</div>
        <div className="lbl-mono" style={{ paddingBottom: 8, color: 'var(--muted)' }}>Status</div>
        {visible.map(p => {
          const isGranted = /B\d*$/.test(p.pub);
          const cell = {
            padding: '10px 0', borderTop: '1px solid var(--rule-soft)',
          };
          return (
            <React.Fragment key={p.pub}>
              <span title={p.pub} style={{
                ...cell, color: 'var(--ink)', lineHeight: 1.45,
              }}>
                {p.title}
              </span>
              <span style={{ ...cell, color: p.lead ? 'var(--accent)' : 'var(--muted)' }}>
                {p.lead ? 'Primary inventor' : 'Co-inventor'}
              </span>
              <span style={{ ...cell, color: isGranted ? 'var(--accent)' : 'var(--muted)' }}>
                {isGranted ? 'Granted' : 'Published'}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="reveal" style={{
          marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--rule-soft)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          gap: 16, flexWrap: 'wrap',
          font: '400 11px var(--mono)', letterSpacing: '.1em', textTransform: 'uppercase',
        }}>
          <span style={{ color: 'var(--muted)' }}>
            Showing <span style={{ color: 'var(--ink)' }}>{start + 1}–{Math.min(start + PER_PAGE, items.length)}</span> of {items.length}
          </span>
          <div style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
            <PageButton
              disabled={safePage === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}>
              ← prev
            </PageButton>
            <span style={{ color: 'var(--muted)' }}>
              page <span style={{ color: 'var(--accent)' }}>{safePage + 1}</span> / {totalPages}
            </span>
            <PageButton
              disabled={safePage === totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
              next →
            </PageButton>
          </div>
        </div>
      )}
    </div>
  );
};

window.PageButton = function PageButton({ disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="focus-outline"
      style={{
        background: 'none', border: 'none', padding: 0,
        font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit',
        color: disabled ? 'var(--faint)' : 'var(--ink)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'color .2s ease',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = 'var(--accent)'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.color = 'var(--ink)'; }}>
      {children}
    </button>
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
          {items.length} {items.length === 1 ? 'project' : 'projects'}
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
        <div className="proj-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 18, marginTop: 18,
        }}>
          {items.map((p) => (
            <article key={p.id} className="reveal" style={{
              padding: 22,
              background: 'var(--paper)',
              border: '1px solid var(--rule)',
              transition: 'border-color .2s ease',
              display: 'flex', flexDirection: 'column',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="lbl-mono"><span className="num">{p.n}</span> · {p.tag} · {p.year}</span>
                <Pill kind={p.kind}/>
              </div>
              <h3 className="display" style={{
                font: '500 26px/1.18 var(--display)', margin: '8px 0 0',
              }}>{p.title}</h3>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.65 }}>
                {p.blurb}
              </p>
              <div className="lbl-mono" style={{
                marginTop: 'auto', paddingTop: 14,
                display: 'flex', gap: 16, flexWrap: 'wrap',
              }}>
                {p.stack && p.kind !== 'closed-source' && <span>STACK · {p.stack}</span>}
                {p.loc && <span>{p.loc}</span>}
                {(p.links || (p.url ? [{ label: 'Demo', url: p.url }] : [])).map((l, li) => (
                  <a key={li} className="hover-line" href={l.url} target="_blank" rel="noreferrer"
                     style={{ color: 'var(--accent)' }}>
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

})();
