# azazel1z.page

A links page built as a PS3-style **XrossMediaBar**. No framework, no build step —
GitHub Pages serves the files exactly as they sit in this repo.

```
index.html
css/styles.css      all layout + the responsive breakpoints
js/links.js         ← the only file you edit day to day
js/xmb.js           cross navigation (keyboard, gamepad, pointer, wheel, touch)
js/wave.js          month tint + the animated ribbon background
js/audio.js         synthesised navigation blips
assets/avatar.jpeg  profile photo (cropped to a circle in CSS)
assets/resume.pdf   linked from About
assets/fonts/       M+ 1p, latin subset, self-hosted
```

The look follows the **PSP's** XMB rather than the PS3's: flat filled white
silhouettes, no glassy plates, a bare `26/6 10:21 PM` clock with no bordered
plate, and only the *selected* row captioned — every other row in a column is a
bare icon. The PS3 contributions are the animated ribbon background and the
month tint.

**The ladder.** The icon bar and the column share one ladder of slots, spaced
`--item-h` apart and anchored on the category row. Slot 0 belongs to the
category icon, so rows step *around* it — the selected row sits at slot 1, and a
row scrolling up past the selection jumps from slot 1 straight to slot −1,
leaving the gap the PSP leaves. `js/xmb.js` writes a `--slot` number on each
row; all the arithmetic stays in CSS. If you retune `--item-h`, keep it wide
enough that the category label still clears the slot-1 row.

**Type.** The XMB's real face is Fontworks' Rodin, which can't be licensed for
this, so the page uses **M+ 1p** — the closest open substitute, same
Japanese-gothic construction. Only the latin subset ships (~35KB for both
weights) and it's served from `assets/fonts/`, so the page makes no third-party
font request. It's OFL-licensed; `assets/fonts/OFL.txt` must stay alongside it.
Text carries a white bloom over a dark shadow (`--bloom` in the CSS) to mimic the
halo the PSP's LCD gave everything.

## Editing your links

Everything lives in [`js/links.js`](js/links.js). Each category is a column of the
cross; each item is a row in it.

```js
{ type: 'link', label: 'Spotify', sub: 'what I listen to',
  url: 'https://open.spotify.com/user/azazel1z', icon: 'si:spotify' }
```

Three row types:

| `type`  | behaviour                                        |
|---------|--------------------------------------------------|
| `link`  | opens `url` in a new tab                          |
| `info`  | plain text, not clickable (used in **About**)     |
| `form`  | opens the message panel                           |

### What you can change here alone

The whole cross is generated from `CATEGORIES` at load, so **adding or removing
rows, reordering them, adding a whole new category, or renaming anything needs
no changes anywhere else.** A new category becomes a new column automatically.
Two things to keep in step: `DEFAULT_CATEGORY` must match some category's `id`,
and an `si:` icon has to be a real Simple Icons slug.

You need to touch other files only for: a new **built-in glyph** (add it to
`GLYPHS` in `js/xmb.js`), a new **row type** beyond the three above, or layout
and colour changes (`css/styles.css`).

**Icons** — `icon` accepts:

- `'si:spotify'` — a brand mark from `assets/icons/spotify.svg`. These are
  vendored, not fetched at runtime. To add one, find its slug on
  [Simple Icons](https://simpleicons.org) and save it:
  `curl https://cdn.simpleicons.org/<slug>/white -o assets/icons/<slug>.svg`
- `'glyph:mail'` — one of the built-in glyphs (`user`, `pin`, `gamepad`, `heart`,
  `doc`, `briefcase`, `people`, `list`, `mail`, `linkedin`), at the top of `js/xmb.js`.
  Worth knowing: Simple Icons **dropped LinkedIn** at the brand's request, so
  `si:linkedin` 404s. `glyph:linkedin` is a plain lettered tile standing in for it.
- `'assets/anything.svg'` — any file you drop in `assets/`.

The page makes **no third-party requests at all** — icons, fonts and images are
all local. That is deliberate: the icons used to come from a CDN, and thirteen
round trips was why they sometimes trickled in after the page had already drawn.

## The background

Drop a **`assets/background.jpg`** in and the page switches to photo mode by
itself. With no such file it falls back to the month tint, the XMB ribbon and
drifting motes, so the page is never broken by its absence.

Photo mode is deliberately quiet — the only motion is **parallax**:

- `js/xmb.js` writes the cross's position as `--par-x` / `--par-y` (−1..1) and
  CSS slides the image against it, up to `--par-range`. The image is inset
  negatively to overscan, so an edge never shows mid-slide.
- Grading (blur, darken, desaturate) is a CSS `filter` on `#photo` — GPU work
  done once, not per frame. There is no canvas loop running in this mode at all.
- A vignette switches on with the photo to hold the white icons off a busy frame.

Pick something dark and low-contrast, at least 1920px wide, landscape. The icons
are flat white silhouettes and will disappear into anything bright or busy;
`--photo-blur` and the `brightness()` in the `#photo` filter are the two dials.

Filenames are **case-sensitive on GitHub Pages** even though they aren't on
Windows. `assets/Resume.pdf` would 404 in production while working fine locally,
so everything here is lowercase. Keep it that way.

## Making the contact form work

GitHub Pages is static and cannot send email. The form posts to
[Web3Forms](https://web3forms.com), which relays it to your inbox. The key is
already set in `FORM_ACCESS_KEY` in `js/links.js`.

Your address never appears in the page source, so scrapers don't get it. A hidden
`botcheck` honeypot field catches most spam bots. Free tier is 250 submissions a
month; swap the `fetch` URL in `js/xmb.js` for Formspree if you'd rather.

## Controls

| Input     | Action                                          |
|-----------|-------------------------------------------------|
| Arrows / WASD | move the cross                              |
| Enter / Space | open the selected row                       |
| Mouse     | click a category, click a row to focus it, again to open |
| Wheel     | scroll the column (or the row, horizontally)     |
| Touch     | swipe in any direction                           |
| Gamepad   | D-pad or left stick; ✕ opens, ◯ backs out        |

The speaker button top-right mutes the blips; the choice is remembered in
`localStorage`. The whole thing honours `prefers-reduced-motion` — that turns off
the animated background and all transitions.

## Sound and the background

The blips are **synthesised** with the Web Audio API, not sampled from a PSP —
Sony's audio is copyrighted and doesn't belong in a public repo. To use your own
files, replace the bodies of `move`/`enter`/`back` in `js/audio.js`.

The background re-tints itself every month, like the real XMB did (December is
pine green, August deep blue, and so on). The table is `MONTHS` in `js/wave.js`.

## Running it locally

```sh
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly via `file://`
mostly works but the contact form's `fetch` will be blocked by CORS.

## Deploying

Push to GitHub, then **Settings → Pages → Source: Deploy from a branch → `main` / root**.
Works from either `azazel1z.github.io` (user site) or a project repo — every path
in here is relative, so no base-path configuration is needed.
