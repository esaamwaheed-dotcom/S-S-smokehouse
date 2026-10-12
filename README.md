# S&S Smokehouse — Landing Page

Cinematic site for **S&S Smokehouse** (Sire & Sons): 100% halal Texas BBQ. Generational BBQ · Texas Smoke · Live Fire. 109 Beltline Road, Richardson, TX. Coming Fall 2026.

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
| Halal | 100% halal promise with animated seal |
| The Pit | Pinned horizontal scroll: Wood → Rub → Fire → Rest → Slice |
| The Signature | Spotlight for **THE ONE** sandwich |
| Menu | Tabbed menu built from the S&S menu sheets (Smokehouse, Sandwiches, Shareables, Sides, Sweet Endings) |
| Catering | Overview and button to the inquiry page |
| Be First in Line | Button to join the opening list |
| Footer | Address, directions, Instagram |

**`inquire.html`**: separate inquiry page for catering, private events, the opening list, and general questions. It collects guest count, date and time, occasion, venue, service style, menu picks, and budget, with a live summary beside the form. Links can open it on a specific type: `inquire.html#catering`, `#private`, `#list`, `#general`.

## Files

- `index.html` — landing page structure and copy
- `inquire.html`, `inquire.js` — inquiry page and its form logic
- `styles.css` — all styling (brand colors are CSS variables at the top)
- `main.js` — menu data, animations, smoke shader, forms
- `assets/photos/` — food photos (placeholders for now; see below)
- `assets/logo-mark.png`, `assets/favicon.png` — logo cropped from the Instagram profile (swap for the original high-res file when available)

## To finish before launch

- **Inquiry emails**: put the owner's email in `OWNER_EMAIL` at the top of `inquire.js`. Inquiries then go to that inbox through FormSubmit (formsubmit.co, free). The first inquiry sends a one-time activation email to the owner; click the link in it and every inquiry after that arrives as a formatted table. Until the email is set, the form runs in preview mode and nothing is sent.
- **Prices**: the menu sheets had no prices yet. Add `p: "$12"` (or `p: "$28 / lb"`) to any item in the `MENU` array in `main.js` and it shows on the menu.
- **Copy to confirm**: the stats (14 hrs, 100% post oak) and menu descriptions are concept copy.
- **Opening date and hours**: shown as "Coming Fall 2026, date and hours announced soon" for now.
- **Logo**: cropped from the Instagram profile. Swap in the original high-res file when available.
- **Photos**: the three photos in `assets/photos/` are placeholders the owner supplied for the draft. Replace them with S&S's own photography before launch (keep the same filenames to swap them without code changes).
