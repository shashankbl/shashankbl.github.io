# Contributing

This site is a static SPA — no build step, no Node, no bundler. JSX is compiled in-browser via `@babel/standalone`.

## File layout

```text
shashankbl.github.io/
├── index.html                    # shell, CSS variables, ASCII bg, script tags
├── bauhaus-app.jsx               # router, keyboard nav, theme/tweaks wiring
├── bauhaus-data.jsx              # all content: site, projects, posts, OSS, art, …
├── bauhaus-shared.jsx            # Header, Footer, HelpOverlay, NewsFlash, Pill, …
├── bauhaus-page-home.jsx         # HomePage
├── bauhaus-page-projects.jsx     # ProjectsPage (closed-source + open-source + patents)
├── bauhaus-page-research.jsx     # ResearchPage
├── bauhaus-page-gallery.jsx      # GalleryPage
├── bauhaus-page-ideas.jsx        # IdeasPage / PostPage
├── bauhaus-page-about-me.jsx     # AboutMePage
├── bauhaus-page-play.jsx         # PlayPage (the /play mini-game)
├── tweaks-panel.jsx              # tweak panel primitives
└── .github/workflows/lint.yml    # JSX parse-check CI
```

To add or update content (projects, posts, OSS, patents, art, FLASH headlines, etc.), edit **`bauhaus-data.jsx`**.

## Local preview

Any static server works:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Or `npx serve .`. Opening `index.html` directly mostly works, but `fetch`-based features need a server.

## Default theme / accent / font

At the top of `bauhaus-app.jsx`:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",        // "light" | "dark"
  "accent": "#d4502a",     // any hex
  "fontPair": "fraunces",  // "fraunces" | "grotesk" | "mono"
  "showAscii": true,
  "showDots": true
}/*EDITMODE-END*/;
```

Whatever you set as the default is what visitors see on first load.

## Deploying

This is a User/Org GitHub Pages site (`shashankbl.github.io`) served from the repo root on `main`. Pushing to `main` auto-publishes within a minute.

```bash
git add -A
git commit -m "your message"
git push origin main
```

If Pages ever tries to run Jekyll, ensure a `.nojekyll` file exists at the root.

## CI

`.github/workflows/lint.yml` parses every `.jsx` file with `@babel/parser` on push/PR. To run the same check locally:

```bash
node -e "
const fs = require('fs');
const parser = require('@babel/parser');
const files = fs.readdirSync('.').filter(f => f.endsWith('.jsx'));
for (const f of files) {
  parser.parse(fs.readFileSync(f, 'utf8'), { sourceType: 'script', plugins: ['jsx'] });
  console.log('OK ' + f);
}
"
```

## Routes

`/`, `/projects`, `/research`, `/gallery`, `/ideas`, `/about-me`, `/play`. Aliases: `/blog`, `/blog/:slug`, `/talks` → ideas; `/experience`, `/contact` → about me; `/open-source` → projects.

## Keyboard shortcuts

```text
1     index
2     work (projects)
3     research
4     gallery
5     ideas
6     about me
7     play
t     toggle theme
?     this help
esc   close
```
