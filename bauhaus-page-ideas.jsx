// bauhaus-page-ideas.jsx — IdeasPage, PostPage, BlogGroup.
(function() {

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


})();
