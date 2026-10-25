# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## How to work in this repo

Claude is a pair-programming and learning assistant here, not the author. The candidate must be able to explain and defend every change.

- `README.md` is the spec. Don't add, reinterpret or "improve" requirements. Flag ambiguities instead of resolving them silently.
- For every change: explain the concept, then propose the change (what and why), then wait for approval, then implement it, then give a manual test checklist and list what still needs human verification.
- Explain GTM, GA4 and Apps Script concepts in terms of this repo's files and dataLayer pushes before using them.
- When platform behavior is uncertain (GTM, GA4, Apps Script triggers and quotas), check the official docs and say so. Don't guess.
- Prefer the simplest implementation that meets the spec. No speculative abstractions.

## Git

- Never commit, push, merge, or create or switch branches. The candidate does all git operations.
- `main` is the submission branch. Work happens on `exercise/gtm-add-to-cart`, `exercise/newsletter-tracking` and `exercise/apps-script`, each merged into `main` when finished. Check the current branch before working and keep changes scoped to it.

## Progress

`CHECKLIST.md` tracks every requirement from the README and is visible to reviewers. Update it only with approval.

## What this repo is

A hiring challenge (Analytics / Solutions Engineer), not a product. It has two parts:

1. **GTM + GA4**: tag the static site in `website/` (add_to_cart ecommerce event, newsletter form event) and export the GTM container `.json` into the repo.
2. **Apps Script**: run against a Google Sheet imported from `data/bixby_employees.csv` (timestamp on edit, a "security count" over hashes, unique Harry Potter aliases, and a `Validaciones` custom menu).

Written deliverables go in `LOG.md`, which follows the template in `LOG.md.example`: two emails, how validation was done, design decisions, and how AI was used.

There is no build, lint, or test tooling. The site is plain ES5 JS with no dependencies.

## Running the site

```bash
cd website
python3 -m http.server 5500   # then open http://localhost:5500
```

Serve it over HTTP. GTM Preview is unreliable from `file://`. Pages: `#home`, `#shop` (Exercise 1), `#workshop` (Exercise 2, newsletter form is in the footer). Firefox tracking protection blocked `gtm.js` during setup, so test in Edge or Chrome, in a private window if Preview won't connect.

## Site architecture (matters for where GTM goes)

- `index.html` is the only real document. It loads every script (`products.js`, `cart.js`, `shop.js`, `newsletter.js`, `pages.js`) and has a `[data-outlet]` container. The GTM container `GTM-MQK4683L` is installed here.
- `pages.js` is a hash router. For `#shop` / `#workshop` it `fetch`es `shop.html` / `landing.html`, parses them, and injects only their `<main>` and `.site-footer` into the outlet. **The `<head>` and `<script>` tags of those files are discarded**, so a GTM snippet placed in `shop.html` or `landing.html` never runs. Route changes are hash changes, not page loads (relevant for page_view / History Change triggers).
- After injecting a page, the router calls `window.renderShop` or `window.bindNewsletter`. Both guard with `dataset.bound` so they bind only once per injected DOM.
- Cart count is stored in `localStorage` (`pipoCartCount`). It is cosmetic and not tracked.

## Existing dataLayer contracts (do not modify the pushes)

The README forbids rewriting the site's dataLayer pushes. GTM must consume them as they are.

- **Add to cart** (`shop.js` `pushAddToCart`): `event: "ga4.trackEvent"`, `eventName: "add_to_cart"`, `eventParams: { section, value, currency, items[], site }`. Items use GA4 field names, but the push is not in GA4 ecommerce shape. The task is to re-push it as `{ event: "add_to_cart", ecommerce: { value, currency, items } }`, with a per-item `tax` = 21% of the unit price rounded to 2 decimals. `value` in the expected output includes tax (7 → 8.47). Read the values from the dataLayer. Do not hardcode the catalog. The odd prices in `products.js` (5.95, 40000, 92000) are the edge cases to check against.
- **Newsletter** (`newsletter.js`): `event: "formSubmission"`, `formName: "Newsletter"`, `formStatus: "Error" | "Ok"`, `formError: "Empty email" | "Wrong format"` (only present on errors). The form uses `novalidate`, and the JS validates the address.

## Apps Script constraints (from README)

- Sheet layout: rows 1–2 blank (**B1 is reserved** for the last-edit timestamp), headers on row 3, data starting at row 4. Columns: Name, Mail, Alias (C), Hash (D), Conteo de Seguridad (E).
- No spreadsheet formulas. Everything is done in Apps Script.
- The onEdit timestamp must not re-trigger itself when it writes B1.
- Security count: find the longest contiguous strictly increasing letter run in the hash (letters need not be adjacent in the alphabet) that contains at least one vowel. Worked example: `acbcrxorzeh` → 3.
- Aliases come from `https://hp-api.onrender.com/api/characters` and must be random and unique across all employees.
- The Apps Script code lives in the Google Sheet, not in this repo, unless it gets added here for review.

## Custom commands

`.claude/commands/` defines review-style workflows (`/resume`, `/end`, `/review`, `/debug`, `/improve`, `/simplify`, `/catch`). `/end` updates this file with lasting decisions at the end of a session.
