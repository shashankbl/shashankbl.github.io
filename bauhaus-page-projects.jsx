// bauhaus-page-projects.jsx — ProjectsPage, ProjectGroup, Placeholder.
(function() {

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
        <div className="proj-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          columnGap: 32, rowGap: 0, marginTop: 12,
        }}>
          {items.map((p) => (
            <article key={p.id} className="reveal" style={{
              padding: '24px 0 4px',
              borderTop: '1px solid var(--rule-soft)',
            }}>
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
                marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap',
              }}>
                <span>STACK · {p.stack}</span>
                <span>{p.loc}</span>
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
