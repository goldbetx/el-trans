# EL TRANS — Website

Bilingual (Albanian / English) static website for **EL TRANS**, an Albanian
freight transport company based in Elbasan.

Built with plain **HTML + CSS + vanilla JavaScript** — no frameworks, no build
step. It runs by simply opening the files in a browser.

🌍 **Live site:** https://goldbetx.github.io/el-trans/

---

## Features

- **Dark / luxury theme** — charcoal background with muted-gold accents.
- **Bilingual** — Albanian at the root, English under `/en/`, with a `SQ | EN`
  language switch and `hreflang` SEO tags linking each page to its counterpart.
- **Scroll-driven truck journey** on the home page — an SVG truck follows a route
  from Elbasan to Germany as you scroll; destination pins light up in turn.
- **Animated count-up stats** and **fade-in/slide-up** reveals on scroll.
- **Dark destination map** (Leaflet + free CartoDB tiles, static — no GPS).
- **Fully responsive** with a mobile hamburger menu.
- Respects `prefers-reduced-motion`.

---

## Project structure

```
el-trans/
├─ index.html            Home (Albanian)
├─ rreth-nesh.html       About
├─ sherbimet.html        Services
├─ galeria.html          Gallery
├─ kontakt.html          Contact
├─ en/                   English versions
│  ├─ index.html         Home
│  ├─ about.html
│  ├─ services.html
│  ├─ gallery.html
│  └─ contact.html
├─ images/               Logo + photos
├─ style.css             Shared styles (one file for every page)
├─ script.js             Shared JavaScript (one file for every page)
├─ .gitignore
└─ .gitattributes
```

`style.css` and `script.js` are **shared by every page**, so a change in one
place updates the whole site.

---

## Edit the site

It's plain HTML/CSS/JS, so you can edit any file in a text editor.

- **Text & content** — edit the `.html` files. Albanian pages are in the root,
  English pages in `en/`. Remember to update **both** languages.
- **Colors, spacing, fonts** — edit `style.css`. The theme colors live in the
  `:root { ... }` block at the top (e.g. `--gold`, `--bg`), so you can recolor
  the whole site by changing a couple of values.
- **Behavior** (menu, count-up, scroll truck, maps) — edit `script.js`.
- **Photos** — drop new images into `images/` and update the `src` in the
  gallery pages. If a filename contains spaces, write the space as `%20` in the
  `src` (e.g. `images/Flota%20e%20mjeteve.jpeg`).
- **Contact form** — it currently opens the visitor's email app. To receive
  messages automatically, connect it to a service like
  [Formspree](https://formspree.io) or a small backend (see the comment in the
  contact pages).

---

## Preview locally

Because the maps and fonts load over HTTPS, it's best to run a tiny local server
rather than opening the file directly:

```powershell
# from the project folder
python -m http.server 8000
```

Then open <http://localhost:8000>. (Any static server works — e.g. the VS Code
"Live Server" extension.)

---

## Deploy with GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch**, branch **main**, folder **/ (root)**, Save.
4. After ~1 minute the site is live at
   `https://goldbetx.github.io/el-trans/`.

All asset paths are relative, so the site works correctly under the
`/el-trans/` subpath without changes.

---

## Contact

**EL TRANS** — Rruga Kadri Hoxha, Elbasan, Albania
📞 +355 69 409 0535 · +355 69 242 7125
✉️ info@eltrans.com.al · elton@eltrans.com.al
[Facebook](https://www.facebook.com/eltrans.al/)
