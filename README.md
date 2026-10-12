# S&S Smokehouse — Landing Page

Cinematic one-page site for **S&S Smokehouse** (Sire & Sons) — Generational BBQ · Texas Smoke · Live Fire. Richardson, TX — opening Fall 2026.

## Run it locally

No build step and no dependencies. Either open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's in it

| Section | What it does |
| --- | --- |
| Hero | Live WebGL smoke + rising ember particles, staggered headline reveal |
| Marquee | Brand-red ticker band |
| Story | "Sire & Sons" origin, animated stats |
| The Pit | Pinned horizontal scroll: Wood → Rub → Fire → Rest → Slice |
| The Signature | Spotlight for **THE ONE** sandwich |
| Menu | Tabbed menu built from the S&S menu sheets (Smokehouse, Sandwiches, Shareables, Sides, Sweet Endings) |
| Catering | Quote-request form |
| Be First in Line | Email signup for opening news |
| Footer | Location, hours, Instagram |

## Files

- `index.html` — page structure and copy
- `styles.css` — all styling (brand colors are CSS variables at the top)
- `main.js` — menu data, animations, smoke shader, forms
- `assets/logo-mark.png`, `assets/favicon.png` — logo cropped from the Instagram profile (swap for the original high-res file when available)

## To finish before launch

- **Forms**: set `CONTACT_EMAIL` at the top of `main.js`, or connect a form service (Formspree, Netlify Forms, Mailchimp, etc.). Right now the forms only show an on-page confirmation.
- **Menu**: edit the `MENU` array in `main.js` to change items, descriptions, or add prices.
- **Copy to confirm**: hours, stats (14 hrs, 100% post oak), and menu descriptions are placeholder concept copy.
- **Photos**: drop real food/pit photography in once it exists.
