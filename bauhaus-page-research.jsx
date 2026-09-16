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
                  {(m.url || m.artifact) && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {m.url && (
                        <a className="lbl-mono hover-line" href={m.url}
                           target="_blank" rel="noreferrer"
                           style={{ color: 'var(--accent)' }}>
                          Paper ↗
                        </a>
                      )}
                      {m.artifact && (
                        <a className="lbl-mono hover-line" href={m.artifact}
                           target="_blank" rel="noreferrer"
                           style={{ color: 'var(--accent)' }}>
                          Live artifact ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <span className="lbl-mono" style={{ textAlign: 'right' }}>
                  {m.loc}
                </span>
              </>
            );
            const style = {
              display: 'grid', gridTemplateColumns: '90px 200px 1fr 140px',
              padding: '20px 0',
              borderTop: i ? '1px solid var(--rule-soft)' : 'none',
              alignItems: 'baseline', gap: 16, color: 'var(--ink)',
            };
            return <div key={i} className="reveal list-row" style={style}>{inner}</div>;
          })}
        </div>
      )}
    </div>
  );
};

window.ResearchPage = function ResearchPage() {
  const r = window.RESEARCH || {};
  const interests = r.interests || '';
  const pubs = r.publications || [];

  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="03">Research</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Papers &amp; research.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        Active research and publications.
      </p>

      <ResearchSection label="Research interests">
        <p className="reveal" style={{
          marginTop: 20, color: 'var(--ink)', fontSize: 17, lineHeight: 1.6,
        }}>
          Academic research interests: {interests}
        </p>
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

    </section>
  );
};

})();
