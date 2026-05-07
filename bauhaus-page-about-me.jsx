// bauhaus-page-about-me.jsx — AboutMePage, ResumeGroup, GanttChart, parseRange.
(function() {

const { useRef } = React;

// Parse date strings like 'Jan 2024 → now', 'Aug 2015 → Aug 2021', '2020 → Jun 2022'.
window.parseRange = function parseRange(y) {
  if (!y) return null;
  const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6,
                   Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const parseOne = (s) => {
    const t = s.trim();
    if (!t) return null;
    if (/^now$/i.test(t)) return new Date();
    const parts = t.split(/\s+/);
    if (parts.length === 1) {
      const yr = parseInt(parts[0], 10);
      return isNaN(yr) ? null : new Date(yr, 0, 1);
    }
    const m = MONTHS[parts[0]] ?? 0;
    const yr = parseInt(parts[1], 10);
    return isNaN(yr) ? null : new Date(yr, m, 1);
  };
  const sides = y.split(/\s*(?:→|->)\s*/);
  if (sides.length === 1) {
    const d = parseOne(sides[0]);
    return d ? { start: d, end: d } : null;
  }
  const start = parseOne(sides[0]);
  const end = parseOne(sides[1]);
  if (!start || !end) return null;
  return { start, end };
};

window.GanttChart = function GanttChart({ professional, academic }) {
  const svgRef = React.useRef(null);

  const buildEntries = (list, kind) => (list || []).map(emp => ({
    co: emp.co, kind,
    roles: (emp.roles || [])
      .map(role => {
        const r = parseRange(role.y);
        return r ? { role: role.role, ...r } : null;
      })
      .filter(Boolean),
  })).filter(e => e.roles.length > 0);

  const profEntries = buildEntries(professional, 'work');
  const acadEntries = buildEntries(academic, 'school');
  if (profEntries.length === 0 && acadEntries.length === 0) return null;

  // Sort each employer's roles oldest first; sort employers newest-first (resume order).
  [...profEntries, ...acadEntries].forEach(e => e.roles.sort((a, b) => a.start - b.start));
  profEntries.sort((a, b) => b.roles[0].start - a.roles[0].start);
  acadEntries.sort((a, b) => b.roles[0].start - a.roles[0].start);

  const allDates = [...profEntries, ...acadEntries].flatMap(e => e.roles.flatMap(r => [r.start, r.end]));
  const minYear = new Date(Math.min.apply(null, allDates)).getFullYear();
  const maxYear = new Date(Math.max.apply(null, allDates)).getFullYear() + 1;
  const minB = new Date(minYear, 0, 1);
  const maxB = new Date(maxYear, 0, 1);

  // Layout
  const W = 1180;
  const rowHeight = 24;
  const barHeight = 12;
  const yearAxisHeight = 26;
  const sectionHeaderHeight = 20;
  const sectionGap = 8;
  const labelWidth = 340;
  const chartLeft = labelWidth + 16;
  const chartRight = W - 24;
  const chartWidth = chartRight - chartLeft;

  // Distinct hue per employer.
  const palette = ['#d4502a', '#3a8fa3', '#3f8a6a', '#c08e2c', '#7a5ec0', '#5a7a8c', '#8d5a3a', '#a64b69'];
  const allEmployers = [...profEntries, ...acadEntries];
  const colorByCo = {};
  allEmployers.forEach((e, i) => { colorByCo[e.co] = palette[i % palette.length]; });

  const xScale = (date) => chartLeft + ((date - minB) / (maxB - minB)) * chartWidth;
  const yearTicks = [];
  for (let yr = minYear; yr <= maxYear; yr++) yearTicks.push(yr);

  // Y bookkeeping: section header → rows.
  let yCursor = yearAxisHeight;
  const profHeaderY = yCursor;
  yCursor += sectionHeaderHeight;
  const profRowsStart = yCursor;
  yCursor += profEntries.length * rowHeight;
  if (acadEntries.length > 0) yCursor += sectionGap;
  const eduHeaderY = yCursor;
  if (acadEntries.length > 0) yCursor += sectionHeaderHeight;
  const eduRowsStart = yCursor;
  yCursor += acadEntries.length * rowHeight;
  const H = yCursor + 14;

  const renderRow = (e, y) => (
    <g key={`${e.kind}-${e.co}`}>
      <text x={labelWidth} y={y + barHeight - 2} textAnchor="end" fontSize="11"
            fontFamily="ui-monospace, monospace" fontWeight="500" fill="#1a1814">
        {e.co}
      </text>
      {e.roles.map((r, ri) => {
        const x1 = xScale(r.start);
        const x2 = xScale(r.end);
        const w = Math.max(2, x2 - x1);
        return (
          <g key={ri}>
            <title>{`${e.co} · ${r.role} (${r.start.toLocaleString('en-US', { month: 'short', year: 'numeric' })} → ${r.end.toLocaleString('en-US', { month: 'short', year: 'numeric' })})`}</title>
            <rect x={x1} y={y} width={w} height={barHeight}
                  fill={colorByCo[e.co]} fillOpacity={0.9}/>
            {ri > 0 && (
              <line x1={x1} y1={y} x2={x1} y2={y + barHeight}
                    stroke="#fbf9f5" strokeWidth="2"/>
            )}
          </g>
        );
      })}
    </g>
  );

  const renderSectionHeader = (label, y) => (
    <g>
      <line x1={chartLeft} y1={y + sectionHeaderHeight - 6}
            x2={chartRight} y2={y + sectionHeaderHeight - 6}
            stroke="rgba(26,24,20,.18)"/>
      <text x={labelWidth} y={y + sectionHeaderHeight - 9} textAnchor="end"
            fontSize="10.5" letterSpacing="1.2" fontWeight="600"
            fontFamily="ui-monospace, monospace" fill="rgba(26,24,20,.55)">
        {label}
      </text>
    </g>
  );

  const downloadPNG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fbf9f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'experience-gantt.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <div className="reveal" style={{ marginTop: 32 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 12, flexWrap: 'wrap', gap: 12,
      }}>
        <h2 className="display" style={{ font: '500 24px/1.2 var(--display)', margin: 0 }}>
          Timeline
        </h2>
        <button onClick={downloadPNG} className="focus-outline" style={{
          background: 'var(--paper)', border: '1px solid var(--rule)',
          padding: '6px 14px', cursor: 'default', color: 'var(--ink)',
          font: '500 11px var(--mono)', letterSpacing: '.1em', textTransform: 'uppercase',
        }}>
          ↓ Download PNG
        </button>
      </div>
      <div style={{ overflowX: 'auto', border: '1px solid var(--rule)' }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
             style={{ width: '100%', height: 'auto', display: 'block', minWidth: 800, background: '#fbf9f5' }}>
          <rect x="0" y="0" width={W} height={H} fill="#fbf9f5"/>

          {/* Year ticks */}
          {yearTicks.map(yr => {
            const x = xScale(new Date(yr, 0, 1));
            return (
              <g key={yr}>
                <line x1={x} y1={yearAxisHeight} x2={x} y2={H - 14}
                      stroke="rgba(26,24,20,.08)" strokeDasharray="3 5"/>
                <text x={x} y={20} textAnchor="middle" fontSize="10.5"
                      fontFamily="ui-monospace, monospace" fill="rgba(26,24,20,.55)">
                  {yr}
                </text>
              </g>
            );
          })}

          {/* Professional section */}
          {profEntries.length > 0 && renderSectionHeader('── PROFESSIONAL', profHeaderY)}
          {profEntries.map((e, i) => renderRow(e, profRowsStart + i * rowHeight + (rowHeight - barHeight) / 2 + 4))}

          {/* Education section */}
          {acadEntries.length > 0 && renderSectionHeader('── EDUCATION', eduHeaderY)}
          {acadEntries.map((e, i) => renderRow(e, eduRowsStart + i * rowHeight + (rowHeight - barHeight) / 2 + 4))}

          {/* "Today" marker — vertical line spanning the chart at the current date */}
          {(() => {
            const today = new Date();
            if (today < minB || today > maxB) return null;
            const x = xScale(today);
            return (
              <g>
                <line x1={x} y1={6} x2={x} y2={H - 4}
                      stroke="#d4502a" strokeWidth="1.5"/>
                <rect x={x - 22} y={H - 16} width={44} height={14}
                      fill="#d4502a"/>
                <text x={x} y={H - 6} textAnchor="middle" fontSize="9"
                      fontFamily="ui-monospace, monospace" fontWeight="600"
                      letterSpacing="1.2" fill="#ffffff">
                  TODAY
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

window.AboutMePage = function AboutMePage() {
  return (
    <section className="pad-x section-block" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
      <div className="reveal"><SectionLabel n="08">About me</SectionLabel></div>
      <h1 className="display reveal page-headline" style={{
        font: '500 48px/1.05 var(--display)', margin: '14px 0 8px', letterSpacing: '-.025em',
      }}>
        Fifteen years in engineering and leadership across memory, compute, and AI.
      </h1>
      <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 580, fontSize: 14.5 }}>
        From NVM silicon pathfinding to AI accelerator solutions and cloud-native MLOps — and 25+ U.S. patents along the way.
      </p>
      <GanttChart professional={PROFESSIONAL} academic={ACADEMIC}/>
      <ResumeGroup label="Professional experience" entries={PROFESSIONAL}/>
      <ResumeGroup label="Academic experience"     entries={ACADEMIC}/>
    </section>
  );
};

window.ResumeGroup = function ResumeGroup({ label, entries }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ marginTop: 48 }}>
      <button onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              className="reveal focus-outline"
              style={{
                display: 'flex', alignItems: 'baseline', gap: 12,
                width: '100%', padding: 0,
                background: 'transparent', border: 'none',
                color: 'var(--ink)', cursor: 'default', textAlign: 'left',
              }}>
        <span aria-hidden="true" style={{
          color: 'var(--accent)', font: '500 14px var(--mono)',
          display: 'inline-block', minWidth: 14,
        }}>
          {open ? '▾' : '▸'}
        </span>
        <h2 className="display" style={{
          font: '500 26px/1.2 var(--display)', margin: 0,
          letterSpacing: '-.01em',
        }}>
          {label}
        </h2>
        <span className="lbl-mono" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </button>
      {!open ? (
        <hr className="rule" style={{ marginTop: 12 }}/>
      ) : (<>
      <hr className="rule" style={{ marginTop: 12 }}/>
      <div>
        {entries.map((emp, i) => (
          <div key={i} style={{
            padding: '28px 0', borderTop: i ? '1px solid var(--rule-soft)' : 'none',
          }}>
            {/* Employer header */}
            <div className="stack-grid" style={{
              display: 'grid', gridTemplateColumns: '160px 1fr',
              gap: 24, alignItems: 'center',
            }}>
              <div className="lbl-mono">{emp.span}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                {emp.logo && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    height: 36, padding: '4px 10px', minWidth: 56,
                    background: 'var(--logo-frame)',
                    border: '1px solid var(--rule-soft)',
                    flex: '0 0 auto',
                  }}>
                    <img src={emp.logo} alt="" aria-hidden="true"
                         style={{ maxHeight: 24, maxWidth: 96, objectFit: 'contain' }}/>
                  </span>
                )}
                <div>
                  <h3 className="display" style={{
                    font: '500 24px/1.2 var(--display)', margin: 0, color: 'var(--accent)',
                  }}>
                    {emp.co}
                  </h3>
                  {emp.loc && (
                    <div className="lbl-mono" style={{ marginTop: 4 }}>{emp.loc}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Roles under this employer */}
            <div className="role-indent" style={{ marginTop: 18, paddingLeft: 184, borderLeft: 'none' }}>
              {emp.roles.map((r, j) => (
                <div key={j} className="stack-grid-role" style={{
                  marginTop: j ? 22 : 0,
                  paddingTop: j ? 22 : 0,
                  borderTop: j ? '1px dashed var(--rule-soft)' : 'none',
                }}>
                  <div className="lbl-mono" style={{ color: 'var(--muted)' }}>
                    {r.y}
                    {/now\s*$/i.test(r.y) && <LiveDot/>}
                  </div>
                  <h4 className="display" style={{
                    font: '500 19px/1.3 var(--display)', margin: '4px 0 0',
                  }}>
                    {r.role}
                  </h4>
                  {r.note && (
                    <div className="lbl-mono" style={{ marginTop: 4, color: 'var(--muted)' }}>
                      {r.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </>)}
    </div>
  );
};

})();
