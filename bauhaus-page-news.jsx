// bauhaus-page-news.jsx — NewsPage.
(function() {

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

})();
