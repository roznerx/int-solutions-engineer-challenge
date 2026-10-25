# Challenge checklist

Requirements taken from `README.md`, grouped by the branch where each one is worked on.

## Setup (`main`)

- [x] GTM web container created (`GTM-MQK4683L`)
- [x] GA4 property and web stream created (`G-FNDZTXBCQT`)
- [x] Site served over HTTP from `website/`
- [x] Container snippet installed in the right place (`index.html`, head script and body noscript)
- [x] Empty container version published before using Preview
- [x] GA4 connected from GTM (Google tag, Initialization – All Pages)
- [ ] `LOG.md` copied from `LOG.md.example` (template file kept)

## Part 1 · Exercise 1: Add to cart (`exercise/gtm-add-to-cart`)

- [ ] dataLayer pushes in `website/` are not modified
- [ ] GTM reacts to the existing `ga4.trackEvent` push with `eventName: add_to_cart`
- [ ] New `dataLayer.push` uses the GA4 recommended `add_to_cart` structure (`event`, `ecommerce.value`, `ecommerce.currency`, `ecommerce.items`)
- [ ] Values come from the dataLayer at click time, with no catalog hardcoded in the tag
- [ ] Every item keeps its original fields (`item_id`, `item_name`, `item_brand`, `price`, `item_category`, `item_variant`, `quantity`)
- [ ] Every item gets `tax` = 21% of its unit price, rounded to 2 decimals
- [ ] Beach Boat output matches the README example exactly (`value` 8.47, `tax` 1.47)
- [ ] At least one other price verified, including $5.95
- [ ] `add_to_cart` sent to GA4
- [ ] DebugView shows the event with value, currency and items

## Part 1 · Exercise 2: Newsletter (`exercise/newsletter-tracking`)

- [x] Existing dataLayer pushes inspected for all three cases
- [x] Empty submission recorded
- [x] Non-email submission recorded
- [x] Valid email submission recorded
- [x] GA4 event implemented, based on the outcome and not on the click
- [x] Parameter for which form it was
- [x] Parameter for success or failure
- [x] Parameter for the failure reason (on errors)
- [x] Verified in Preview and DebugView

## Part 1 · Exercise 3: Email to the Director

- [ ] Written in English, in plain language, for a reader who doesn't write code
- [ ] Explains why the approaches in Exercises 1 and 2 are worth doing
- [ ] Pasted into `LOG.md`
- [ ] "How you validated" section filled in (Preview and DebugView, both events)
- [ ] Container ID and measurement ID in `LOG.md`

## Part 2: Apps Script (`exercise/apps-script`)

- [ ] Sheet created from the CSV and named `[Your name] Technical challenge - Apps Script`
- [ ] Layout preserved: rows 1–2 blank, headers on row 3, data from row 4
- [ ] No spreadsheet formulas anywhere
- [ ] `Validaciones` menu with `Conteo` and `Alias`, visible after a reload
- [ ] Ex 1: any edit writes the date and time into B1, replacing the previous value
- [ ] Ex 1: the B1 write does not cause an update loop
- [ ] Ex 2: function takes one 50-letter hash
- [ ] Ex 2: finds the longest contiguous strictly increasing run (letters need not be adjacent in the alphabet)
- [ ] Ex 2: the winning run contains at least one vowel
- [ ] Ex 2: `acbcrxorzeh` → 3
- [ ] Ex 2: length written to column E for every employee, run from Validaciones → Conteo
- [ ] Ex 3: aliases come from `https://hp-api.onrender.com/api/characters`
- [ ] Ex 3: aliases are random and unique across all employees, written to column C
- [ ] Ex 3: run from Validaciones → Alias
- [ ] Ex 4: email to the client developer covering technical and practical decisions, in `LOG.md`
- [ ] `LOG.md`: Sheet URL and "Decisions worth knowing" (hash count, alias uniqueness)

## Submission (`main`)

- [ ] Container exported (Admin → Export Container) and the `.json` committed
- [ ] GTM container shared with `douglas.franquiz@monks.com` and `ivan.pfaab@monks.com` (Edit or higher)
- [ ] GA4 property shared with both (Editor or higher)
- [ ] Sheet shared with both (edit access)
- [ ] `LOG.md` complete (name, date, all sections)
- [ ] Hiring team invited as collaborators on the fork
