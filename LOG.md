# Challenge submission

> Copy this file to `LOG.md` and complete it before you submit.

**Candidate name:** Ignacio Elías Rosner  
**Date completed:** 2026-10-25

---

## Part 1 — Google Tag Manager

**Web container ID:** GTM-MQK4683L  
**GA4 measurement ID:** G-FNDZTXBCQT  
**Google Sheet is not part of this section.**

### Email to the Director of Analytics

**Subject:** Pipo Toys - Analytics Solutions

Dear Director of Analytics,

As requested, we have come up with solutions for the problems regarding the Pipo Toys website. We'll explain each of the selected approaches and why we think they are worth implementing.

First, the "add to cart" problem. We solved it purely in Google Tag Manager (GTM), so no development work was needed on the site itself. This way, the tracking can be changed without any risk to how the site works or looks. The website already reports each "add to cart", but in its own format, which Google Analytics can't use for its ecommerce reports. We convert it to Google's standard format, so product and revenue reports work out of the box. Furthermore, this won't need maintenance if the catalogue changes. Each product now carries its 21% tax, and the cart value includes tax. Google's convention usually excludes tax, so please confirm which you prefer for reporting.

Second, the "newsletter" issue. We have managed to track the outcomes of each submission instead of the clicks, which tells us whether each signup actually succeeded. Without care, a successful signup could be reported with the error from a previous failed attempt, which distorts the numbers. Our setup prevents that, so the results stay accurate. We also record why a submission failed (an empty field or an invalid email), which shows what to improve in the form. Again, this is done without affecting the site's overall functionality.

We have tested both solutions in GTM's preview mode and in Google Analytics 4's live debug view. If you approve, we can move both changes to the live site. The only open decision is whether cart value should include tax. We're happy to walk you through either solution before we go live.

Regards,

Ignacio Elías Rosner  
Semi-Senior Technical Solutions Engineering, Data

### How you validated

What you checked in GTM Preview and GA4 DebugView for add to cart and the newsletter.

#### Add to cart (Exercise 1)

GTM setup:

| Type      | Name                                   | What it does                                                                                 |
| --------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| Variables | `DLV - eventName`, `DLV - eventParams` | Read the action name and the full parameters object of the site's `ga4.trackEvent` push      |
| Trigger   | `CE - ga4.trackEvent - add_to_cart`    | Custom Event on `ga4.trackEvent`, only when `DLV - eventName` equals `add_to_cart`           |
| Tag       | `cHTML - add_to_cart ecommerce push`   | Custom HTML: clears `ecommerce`, then pushes `add_to_cart` in GA4 format with `tax` per item |
| Trigger   | `CE - add_to_cart`                     | Custom Event on the new `add_to_cart` push                                                   |
| Tag       | `GA4 - Event - add_to_cart`            | GA4 Event with "Send Ecommerce data" from the Data Layer                                     |

The version is published as "Ex 1 - add_to_cart ecommerce push with tax". The export is in `gtm/GTM-MQK4683L_v5.json`.

Checks in GTM Preview, comparing the `add_to_cart` push with the README example:

| Product price | `tax` | `ecommerce.value` |
| ------------- | ----- | ----------------- |
| 7             | 1.47  | 8.47              |
| 5.95          | 1.25  | 7.2               |
| 40000         | 8400  | 48400             |
| 92000         | 19320 | 111320            |

- The Beach Boat push matches the README example field by field, with `tax` placed after `price`.
- Each add to cart produces three entries: the site's original `ga4.trackEvent`, `{ ecommerce: null }`, and the new `add_to_cart`. Only the last one has a GA4 tag, so nothing is counted twice.
- Adding the same product twice: the second `add_to_cart` carried only its own data, with no leftovers from the first.

In GA4 DebugView, `add_to_cart` arrived with `value`, `currency` and the items, including `tax`.

#### Newsletter (Exercise 2)

GTM setup:

| Type      | Name                                                    | What it does                                                                               |
| --------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Variables | `DLV - formName`, `DLV - formStatus`, `DLV - formError` | Read the keys of the site's `formSubmission` push                                          |
| Variable  | `LT - formError (errors only)`                          | Lookup Table: returns `formError` only when `formStatus` is `Error`, otherwise `undefined` |
| Trigger   | `CE - formSubmission`                                   | Custom Event on `formSubmission`                                                           |
| Tag       | `GA4 - Event - form_submission`                         | Sends `form_name`, `form_status` and `form_error`                                          |

The version is published as "Ex 2 - Newsletter form tracking".

Checks in GTM Preview, with the submissions made in this order: empty, `abc`, `test@test.com`.

| Submission      | `form_name` | `form_status` | `form_error` |
| --------------- | ----------- | ------------- | ------------ |
| Empty           | Newsletter  | Error         | Empty email  |
| `abc`           | Newsletter  | Error         | Wrong format |
| `test@test.com` | Newsletter  | Ok            | (not sent)   |

- The tag fires once per submit, only on `formSubmission`. It does not fire on page load, on route changes, or on clicks.
- Stale value check: after an invalid attempt followed by a valid one, the raw `DLV - formError` still returned "Wrong format" on the `Ok` event, because GTM keeps every key ever pushed until it is overwritten. With Display Variables set to Values, the tag showed `form_error: undefined` on that event, which confirms the Lookup Table fix.
- One mistake surfaced during testing: the tag was first wired to the raw `DLV - formError`. The tag details in Preview showed it, and I switched it to the Lookup Table variable.

In GA4 DebugView, the three `form_submission` events arrived with the expected parameters, and the successful one had no `form_error`.

Per Claude's suggestion, I registered event-scoped custom dimensions in GA4 for `form_name`, `form_status` and `form_error`, so these parameters can be used in reports and Explorations, not only in DebugView.

### Design notes

**Add to cart: translate in GTM, don't touch the site.** The site's push is kept as it is. A Custom HTML tag reads it and pushes a second, GA4-shaped `add_to_cart`. Only that one is sent to GA4. The transformation stays in one place, and if the developers later push GA4 format directly, the tag can be removed and one trigger changed.

**Add to cart: filtering the wrapper event.** `ga4.trackEvent` is a generic event name, and the real action is in `eventName`. The trigger requires `eventName` to equal `add_to_cart`, so future pushes like `view_item` on the same wrapper won't be turned into fake add-to-cart events.

**Add to cart: robust tag code.** The code is wrapped in a function, so its variables don't leak into the page's global scope. Each item is copied field by field with `for...in`, so fields the developers add later are kept automatically, and `tax` is inserted right after `price`. `{ ecommerce: null }` is pushed first, as Google recommends, so a second add to cart can't inherit data from the first. Tax is rounded per unit, and the total is rounded again to avoid floating-point results like 7.199999.

**Add to cart: `value` includes tax.** The README expects 8.47 for a 7 USD product, so `value` includes tax. Google's examples calculate `value` as price × quantity without tax, so I'd confirm this with the client before production. Item-level `tax` is a custom item parameter in GA4: it shows in DebugView, but it would need an item-scoped custom definition to appear in reports.

**Newsletter: outcome-based trigger.** The trigger listens to the site's `formSubmission` dataLayer push, not to GTM's built-in Form Submission or Click triggers. Those triggers fire on every attempt and don't know whether the address was valid. `newsletter.js` also calls `preventDefault()` on every submit, so the built-in trigger with "Check Validation" turned on would never fire. The site's push is sent only after validation and carries the result.

**Newsletter: one event with a status parameter.** I chose the name `form_submission`, matching the developers' push, because it can be reused for other forms, and `form_name` tells them apart. I avoided `form_submit`, which is GA4's automatic Enhanced Measurement event, and `sign_up`, which in GA4 means a successful registration and so doesn't fit failed attempts.

**Newsletter: error reason only on errors.** The success push has no `formError` key, so GTM's data model still holds the previous error. A Lookup Table on `formStatus` fixes this with no custom code. Successful signups then reach GA4 without an error reason, rather than with a stale one.

---

## Part 2 — Apps Script

**Google Sheet URL:**  

### Email to the client developer

Paste the email from Exercise 4.

### Decisions worth knowing

Short notes on how the hash count works and how aliases stay unique.

---

## How I used AI

I used Claude Code as a pair-programming and learning assistant, not as the author of the solution. The rules I set for it are in `CLAUDE.md`:

- It explains a concept first, then proposes a change. Nothing is written until I approve it.
- It never commits, pushes or manages branches. I made every git operation myself.
- Every behavior is validated manually by me, in GTM Preview, GA4 DebugView and the Sheet.

What I used it for:

- **Learning:** having GTM and GA4 concepts explained in terms of this site's code and dataLayer pushes, alongside the MeasureSchool courses.
- **Setup troubleshooting:** working out why Tag Assistant could not connect. Firefox tracking protection was blocking `gtm.js`, so I moved testing to Edge.
- **Planning:** turning the README into `CHECKLIST.md` and writing the project instructions in `CLAUDE.md`.
- **Exercise 1:** it proposed the Custom HTML code. Before pasting it, I reviewed it with Claude line by line until I could explain each part, and my questions during that review led to two changes: wrapping the code in a function to avoid global variables, and copying item fields generically instead of listing them. Claude checked the tax rounding for every catalog price in Node, and I verified the results in Preview and DebugView. It also gave me a wrong branch status at first, which it caught itself when it read the files again; I fixed it with a fast-forward merge.
- **Exercise 2:** working through the design step by step (Data Layer Variables, Lookup Table, Custom Event trigger, GA4 Event tag), and reviewing my Tag Assistant screenshots. It warned me in advance about the stale `formError` value, which I then reproduced in Preview, and its screenshot review caught the wrong variable in the tag. I built and tested everything in GTM and GA4 myself.
- **Exercise 3:** I wrote the email myself. Claude reviewed it for accuracy and clarity over a few rounds, and I revised it. The main changes were correcting how I described the newsletter issue, adding the tax decision, and turning the closing into a clear request for approval.

_To be completed as each exercise is finished._
