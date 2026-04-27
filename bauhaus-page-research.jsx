// bauhaus-page-research.jsx — ResearchPage, ResearchSection, PubGroup.
(function() {

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

})();
