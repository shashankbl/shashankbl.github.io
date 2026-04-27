// bauhaus-page-open-source.jsx — OpenSourcePage.
(function() {

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

})();
