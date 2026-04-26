// bauhaus-app.jsx — App shell, routing, tweaks, keyboard nav.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#d4502a",
  "fontPair": "fraunces",
  "showAscii": true,
  "showDots": true
}/*EDITMODE-END*/;

const ACCENTS = {
  orange: '#d4502a',
  cyan:   '#3a8fa3',
  mint:   '#3f8a6a',
  amber:  '#c08e2c',
  violet: '#7a5ec0',
};

const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakToggle, TweakSelect } = window;

const ROUTES = ['/', '/projects', '/research', '/open-source', '/blog', '/talks', '/news', '/about-me'];

function useHashRoute() {
  const [path, setPath] = React.useState(() => {
    const h = window.location.hash.replace(/^#/, '') || '/';
    return h;
  });
  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, '') || '/';
      setPath(h);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const nav = (to) => { window.location.hash = to; };
  return [path, nav];
}

function useReveal(key) {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(e => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), i * 50);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}

function useKeyboardNav(nav, toggleTheme, postsList, currentPath) {
  const [help, setHelp] = React.useState(false);
  const lastKey = React.useRef({ k: '', t: 0 });

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '?') { e.preventDefault(); setHelp(h => !h); return; }
      if (e.key === 'Escape') { setHelp(false); return; }
      if (e.key === 't') { toggleTheme(); return; }

      if (e.key === 'j' || e.key === 'ArrowDown') { window.scrollBy({ top: 120, behavior: 'smooth' }); return; }
      if (e.key === 'k' || e.key === 'ArrowUp')   { window.scrollBy({ top: -120, behavior: 'smooth' }); return; }

      // Prev/next post
      if ((e.key === '[' || e.key === ']') && currentPath.startsWith('/blog/')) {
        const slug = currentPath.slice(6);
        const idx = postsList.findIndex(p => p.slug === slug);
        if (idx >= 0) {
          const target = e.key === '[' ? postsList[idx-1] : postsList[idx+1];
          if (target) nav('/blog/'+target.slug);
        }
        return;
      }

      const now = Date.now();
      if (lastKey.current.k === 'g' && now - lastKey.current.t < 800) {
        const map = { h: '/', p: '/projects', r: '/research', o: '/open-source', w: '/blog', t: '/talks', n: '/news', a: '/about-me' };
        if (map[e.key]) { nav(map[e.key]); lastKey.current = { k: '', t: 0 }; return; }
      }
      if (e.key === 'g') { lastKey.current = { k: 'g', t: now }; return; }

      const numMap = { '1': '/projects', '2': '/research', '3': '/open-source', '4': '/blog', '5': '/talks', '6': '/news', '7': '/about-me' };
      if (numMap[e.key]) { nav(numMap[e.key]); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav, toggleTheme, postsList, currentPath]);

  return [help, setHelp];
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [path, nav] = useHashRoute();

  React.useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = t.theme;
    r.dataset.font = t.fontPair;
    r.style.setProperty('--accent', t.accent);
  }, [t.theme, t.fontPair, t.accent]);

  React.useEffect(() => {
    const ad = document.getElementById('ascii-bg');
    const dd = document.getElementById('dot-bg');
    if (ad) ad.style.display = t.showAscii ? 'block' : 'none';
    if (dd) dd.style.display = t.showDots ? 'block' : 'none';
  }, [t.showAscii, t.showDots]);

  const toggleTheme = () => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark');
  const [help, setHelp] = useKeyboardNav(nav, toggleTheme, window.POSTS, path);

  useReveal(path);

  let page;
  if (path === '/') page = <window.HomePage nav={nav}/>;
  else if (path === '/projects') page = <window.ProjectsPage/>;
  else if (path === '/research') page = <window.ResearchPage/>;
  else if (path === '/open-source') page = <window.OpenSourcePage/>;
  else if (path === '/blog') page = <window.BlogPage nav={nav}/>;
  else if (path.startsWith('/blog/')) page = <window.PostPage slug={path.slice(6)} nav={nav}/>;
  else if (path === '/about-me' || path === '/experience' || path === '/contact') page = <window.AboutMePage/>;
  else if (path === '/talks') page = <window.TalksPage/>;
  else if (path === '/news') page = <window.NewsPage/>;
  else page = <window.HomePage nav={nav}/>;

  const accentName = Object.entries(ACCENTS).find(([,v]) => v === t.accent)?.[0] || 'orange';

  return (
    <>
      <window.Header path={path} nav={nav} theme={t.theme} toggleTheme={toggleTheme}/>
      <main key={path} style={{ minHeight: 'calc(100vh - 280px)' }}>{page}</main>
      <window.Footer/>
      <window.HelpOverlay open={help} onClose={() => setHelp(false)}/>
      <TweaksPanel>
        <TweakSection label="Theme"/>
        <TweakRadio label="Mode" value={t.theme} options={['light','dark']}
                    onChange={v => setTweak('theme', v)}/>
        <TweakRadio label="Accent" value={accentName}
                    options={['orange','cyan','mint','amber','violet']}
                    onChange={v => setTweak('accent', ACCENTS[v])}/>
        <TweakColor label="Custom" value={t.accent} onChange={v => setTweak('accent', v)}/>
        <TweakSection label="Type"/>
        <TweakSelect label="Display" value={t.fontPair}
                     options={[
                       { value: 'fraunces', label: 'Fraunces (serif)' },
                       { value: 'grotesk',  label: 'IBM Plex Sans' },
                       { value: 'mono',     label: 'IBM Plex Mono' },
                     ]}
                     onChange={v => setTweak('fontPair', v)}/>
        <TweakSection label="Background"/>
        <TweakToggle label="Dot grid" value={t.showDots} onChange={v => setTweak('showDots', v)}/>
        <TweakToggle label="ASCII drift" value={t.showAscii} onChange={v => setTweak('showAscii', v)}/>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
