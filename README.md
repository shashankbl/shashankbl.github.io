# Shashank Bangalore Lakshman — Personal Site

A minimalist techno-futuristic portfolio + blog. **Bauhaus Technical** direction.

- Static HTML/JS — no build step, no Node, no bundler.
- Single-file SPA with hash routing: `/`, `/projects`, `/blog`, `/blog/:slug`, `/resume`, `/talks`, `/now`, `/contact`.
- Light/dark, accent color, font pairing exposed via the in-page Tweaks panel.
- Live ASCII drift + schematic dot grid background, scroll-driven reveal animations, keyboard-only navigation (`?` for help).

---

## Files

```
site/
├── index.html           # shell + CSS variables + ASCII bg
├── tweaks-panel.jsx     # tweak panel primitives (theme/accent/font controls)
├── bauhaus-data.jsx     # all your content: projects, posts, talks, resume, now
├── bauhaus-pages.jsx    # page components (home, projects, blog, post, etc.)
└── bauhaus-app.jsx      # router + keyboard nav + tweaks wiring
```

To swap your content, edit **`bauhaus-data.jsx`** — projects, posts, talks, resume, now lines, social links all live there.

---

## Deploying to your existing GitHub Pages repo

You have two common GitHub Pages setups. Use whichever matches yours.

### Setup A — User/Org site (`<username>.github.io`)

This serves from the repo root.

```bash
# 1. Clone your existing pages repo locally (or cd into it)
git clone https://github.com/shashankbl/shashankbl.github.io.git
cd shashankbl.github.io

# 2. (Optional) keep your old site under /old/ as a backup
mkdir -p old && git mv -k * old/ 2>/dev/null || true

# 3. Copy the new site's contents to the repo root
#    (download/extract this project, then from inside it:)
cp -R /path/to/this/project/site/. ./

# 4. Commit and push
git add -A
git commit -m "New portfolio: Bauhaus Technical theme"
git push origin main
```

Live at `https://shashankbl.github.io/` within a minute.

### Setup B — Project site (`<username>.github.io/<repo>`)

Same idea — replace your existing site files at the repo root and push. GitHub Pages serves whatever's in the configured branch (usually `main` or `gh-pages`).

If your repo currently builds via Jekyll, drop a `.nojekyll` file at the repo root so Pages serves files as-is:

```bash
touch .nojekyll
git add .nojekyll && git commit -m "disable Jekyll" && git push
```

### Setup C — Side-by-side preview before replacing

If you don't want to overwrite your old site yet, drop the contents of `site/` into a `v2/` subfolder:

```bash
mkdir v2
cp -R /path/to/this/project/site/. v2/
git add v2 && git commit -m "Preview new site at /v2/" && git push
```

Then visit `https://shashankbl.github.io/v2/` to review before promoting it to the root.

---

## Customizing

### Content
Open `bauhaus-data.jsx`. Each array maps 1:1 to the rendered page. Add or remove entries freely.

### Default theme/accent/font
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

### Real blog post bodies
The post page (`PostPage` in `bauhaus-pages.jsx`) currently renders a placeholder body. The simplest upgrade path:

1. Drop your post bodies as `.md` files in `posts/`.
2. Add a `marked` script tag and `fetch('/posts/' + slug + '.md')` inside `PostPage`.

I can wire that up if you want — just say the word.

---

## Local preview

Any static server works. From inside `site/`:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Or `npx serve .`, or just open `index.html` directly in a browser (most things work, but `fetch`-based features like Markdown loading would need a server).

---

## Keyboard cheatsheet

```
j  /  ↓        scroll down
k  /  ↑        scroll up
g h            home
g p            projects
g w            writing
g r            resume
g t            talks
g n            now
g c            contact
1 — 6          jump to section
[ / ]          prev / next post (on a post page)
t              toggle theme
?              help
esc            close
```
