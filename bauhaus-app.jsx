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

const ROUTES = ['/', '/projects', '/research', '/gallery', '/ideas', '/about-me', '/play'];

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

function useKeyboardNav(nav, toggleTheme) {
  const [help, setHelp] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '?') { e.preventDefault(); setHelp(h => !h); return; }
      if (e.key === 'Escape') { setHelp(false); return; }
      if (e.key === 't') { toggleTheme(); return; }

      const numMap = { '1': '/', '2': '/projects', '3': '/research', '4': '/gallery', '5': '/ideas', '6': '/about-me', '7': '/play' };
      if (numMap[e.key]) { nav(numMap[e.key]); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav, toggleTheme]);

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

  React.useEffect(() => {
    const BASE = 'Shashank Bangalore Lakshman';
    const HOME_TITLE = `${BASE} — Engineer · AI & Semiconductors`;
    const labels = {
      '/': HOME_TITLE,
      '/projects': 'Projects', '/open-source': 'Projects',
      '/research': 'Research',
      '/gallery': 'Gallery',
      '/ideas': 'Ideas', '/blog': 'Ideas', '/talks': 'Ideas',
      '/about-me': 'About me', '/experience': 'About me', '/contact': 'About me',
      '/play': 'Play',
    };
    let title = labels[path];
    if (!title && path.startsWith('/blog/')) {
      const slug = path.slice(6);
      const post = (window.POSTS || []).find(p => p.slug === slug);
      title = post?.title || slug;
    }
    document.title = title === HOME_TITLE ? HOME_TITLE : (title ? `${title} · ${BASE}` : HOME_TITLE);

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [path]);

  const toggleTheme = () => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark');
  const [help, setHelp] = useKeyboardNav(nav, toggleTheme);

  useReveal(path);

  let page;
  if (path === '/') page = <window.HomePage nav={nav}/>;
  else if (path === '/projects' || path === '/open-source') page = <window.ProjectsPage/>;
  else if (path === '/research') page = <window.ResearchPage/>;
  else if (path === '/gallery') page = <window.GalleryPage/>;
  else if (path === '/ideas' || path === '/blog' || path === '/talks') page = <window.IdeasPage nav={nav}/>;
  else if (path.startsWith('/blog/')) page = <window.PostPage slug={path.slice(6)} nav={nav}/>;
  else if (path === '/about-me' || path === '/experience' || path === '/contact') page = <window.AboutMePage/>;
  else if (path === '/play') page = <window.PlayPage/>;
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
