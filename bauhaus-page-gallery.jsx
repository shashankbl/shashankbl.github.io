// bauhaus-page-gallery.jsx — GalleryPage and ArtModal.
(function() {

const { useState, useEffect, useRef } = React;

window.ArtModal = function ArtModal({ art, onClose, onPrev, onNext, hasNav }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (hasNav && e.key === 'ArrowLeft' && onPrev) onPrev();
      else if (hasNav && e.key === 'ArrowRight' && onNext) onNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onPrev, onNext, hasNav]);
  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label={art.title} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="art-modal" style={{
        background: 'var(--bg)', border: '1px solid var(--rule)',
        maxWidth: 'min(1200px, 100%)', width: '100%', maxHeight: 'calc(100vh - 48px)',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          background: 'var(--paper)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          minHeight: 320, position: 'relative',
        }}>
          <img src={art.image} alt={art.title}
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{
              maxWidth: 'calc(100% - 16px)', maxHeight: 'calc(100vh - 64px)',
              objectFit: 'contain', display: 'block',
              border: '8px solid #ffffff', background: '#ffffff',
              boxSizing: 'content-box',
              userSelect: 'none', WebkitUserSelect: 'none',
              WebkitUserDrag: 'none', WebkitTouchCallout: 'none',
            }}/>
          <div aria-hidden="true" style={{
            position: 'absolute', left: 16, bottom: 16,
            padding: '6px 10px',
            background: 'rgba(0,0,0,.42)', color: '#fff',
            font: '500 10px var(--mono)',
            letterSpacing: '.14em', textTransform: 'uppercase',
            pointerEvents: 'none', userSelect: 'none',
          }}>
            Artist: Shashank Bangalore Lakshman
          </div>
        </div>
        <div style={{
          padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 12,
          overflowY: 'auto', overflowX: 'hidden',
          borderLeft: '1px solid var(--rule)',
          wordBreak: 'break-word', overflowWrap: 'anywhere',
          minWidth: 0,
        }}>
          {hasNav && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', gap: 12,
              paddingBottom: 12,
              borderBottom: '1px solid var(--rule)',
            }}>
              <button onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}
                      aria-label="Previous" style={{
                background: 'transparent', border: '1px solid var(--rule)',
                padding: '4px 12px', cursor: 'default', color: 'var(--ink)',
                font: '500 10px var(--mono)', letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}>‹ Prev</button>
              <button onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
                      aria-label="Next" style={{
                background: 'transparent', border: '1px solid var(--rule)',
                padding: '4px 12px', cursor: 'default', color: 'var(--ink)',
                font: '500 10px var(--mono)', letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}>Next ›</button>
            </div>
          )}
          {art.year && <div className="lbl-mono" style={{ color: 'var(--accent)' }}>{art.year}</div>}
          <h2 className="display" style={{ font: '500 22px/1.25 var(--display)', margin: 0 }}>
            {art.title}
          </h2>
          {art.medium && <div className="lbl-mono">{art.medium}</div>}
          {art.tags && art.tags.length > 0 && (
            <div className="lbl-mono" style={{
              color: 'var(--muted)',
              display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            }}>
              {art.tags.map((t, i) => (
                <React.Fragment key={t}>
                  {i > 0 && <span style={{ color: 'var(--accent)' }}>·</span>}
                  <span>#{t}</span>
                </React.Fragment>
              ))}
            </div>
          )}
          {art.description && (
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              {art.description}
            </p>
          )}
        </div>
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', bottom: 12, right: 12,
          background: 'rgba(0,0,0,.45)', border: 'none', color: '#fff',
          width: 32, height: 32, borderRadius: 4, cursor: 'default',
          font: '400 18px var(--mono)', lineHeight: '32px',
        }}>×</button>
      </div>
    </div>
  );
};

window.GalleryPage = function GalleryPage() {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const items = window.ART || [];
  const hasNav = items.length > 1;
  const close = () => setActiveIndex(null);
  const prev = () => setActiveIndex(i => (i === null ? null : (i - 1 + items.length) % items.length));
  const next = () => setActiveIndex(i => (i === null ? null : (i + 1) % items.length));

  // Group items by their normalized medium (first segment before " · "),
  // preserving first-seen order and the original flat index for modal nav.
  const groupOrder = [];
  const groups = {};
  items.forEach((art, idx) => {
    const key = ((art.medium || 'Other').split(' · ')[0] || 'Other').trim();
    if (!groups[key]) { groups[key] = []; groupOrder.push(key); }
    groups[key].push({ art, index: idx });
  });

  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="05">Gallery</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Selected art.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        Visual experiments and personal pieces. Click any tile for the full image and notes.
      </p>

      {items.length === 0 ? (
        <EmptyNote/>
      ) : groupOrder.map((name, gi) => (
        <div key={name} className="reveal" style={{
          marginTop: gi === 0 ? 32 : 16,
          padding: '24px 28px',
          border: '1px solid var(--rule)', background: 'var(--paper)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 12,
            marginBottom: 4, flexWrap: 'wrap',
          }}>
            <h2 className="display" style={{
              font: '500 22px/1.2 var(--display)', margin: 0, letterSpacing: '-.01em',
            }}>{name}</h2>
            <span className="lbl-mono" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
              {groups[name].length} {groups[name].length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>
          <hr className="rule" style={{ marginTop: 8 }}/>
          <div style={{
            marginTop: 18, display: 'grid', gap: 10,
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          }}>
            {groups[name].map(({ art, index }) => (
              <button key={art.id || index} onClick={() => setActiveIndex(index)}
                      aria-label={`Open ${art.title}`}
                      className="reveal focus-outline"
                      style={{
                        display: 'flex', flexDirection: 'column',
                        padding: 0, border: '1px solid var(--rule)',
                        background: 'var(--paper)', cursor: 'default',
                        overflow: 'hidden', textAlign: 'left',
                        transition: 'border-color .2s ease, transform .2s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}>
                <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', background: 'var(--bg)' }}>
                  <img src={art.thumbnail || art.image} alt={art.title}
                       draggable="false"
                       onContextMenu={(e) => e.preventDefault()}
                       onDragStart={(e) => e.preventDefault()}
                       style={{
                         width: '100%', height: '100%',
                         objectFit: 'cover', display: 'block',
                         userSelect: 'none', WebkitUserSelect: 'none',
                         WebkitUserDrag: 'none', WebkitTouchCallout: 'none',
                       }}/>
                </div>
                <div style={{
                  padding: '10px 12px', borderTop: '1px solid var(--rule)',
                }}>
                  <span className="display" style={{
                    display: 'block',
                    font: '500 13.5px/1.25 var(--display)', letterSpacing: '-.005em',
                    color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{art.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {activeIndex !== null && (
        <ArtModal art={items[activeIndex]} onClose={close}
                  onPrev={prev} onNext={next} hasNav={hasNav}/>
      )}
    </section>
  );
};

})();
