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

Paste the English email from Exercise 3.

### How you validated

What you checked in GTM Preview and GA4 DebugView for add to cart and the newsletter.

#### Newsletter (Exercise 2)

GTM setup:

| Type      | Name                                                    | What it does                                                                               |
| --------- | --------------------------------------------------------| -------------------------------------------------------------------------------------------|
| Variables | `DLV - formName`, `DLV - formStatus`, `DLV - formError` | Read the keys of the site's `formSubmission` push                                          |
| Variable  | `LT - formError (errors only)`                          | Lookup Table: returns `formError` only when `formStatus` is `Error`, otherwise `undefined` |
| Trigger   | `CE - formSubmission`                                   | Custom Event on `formSubmission`                                                           |
| Tag       | `GA4 - Event - form_submission`                         | Sends `form_name`, `form_status` and `form_error`                                          |

The version is published as "Ex 2 - Newsletter form tracking".

Checks in GTM Preview, with the submissions made in this order: empty, `abc`, `test@test.com`.

| Submission      | `form_name` | `form_status` | `form_error` |
| ----------------| ------------| --------------| -------------|
| Empty           | Newsletter  | Error         | Empty email  |
| `abc`           | Newsletter  | Error         | Wrong format |
| `test@test.com` | Newsletter  | Ok            | (not sent)   |

- The tag fires once per submit, only on `formSubmission`. It does not fire on page load, on route changes, or on clicks.
- Stale value check: after an invalid attempt followed by a valid one, the raw `DLV - formError` still returned "Wrong format" on the `Ok` event, because GTM keeps every key ever pushed until it is overwritten. With Display Variables set to Values, the tag showed `form_error: undefined` on that event, which confirms the Lookup Table fix.
- One mistake surfaced during testing: the tag was first wired to the raw `DLV - formError`. The tag details in Preview showed it, and I switched it to the Lookup Table variable.

In GA4 DebugView, the three `form_submission` events arrived with the expected parameters, and the successful one had no `form_error`.

Per Claude's suggestion, I registered event-scoped custom dimensions in GA4 for `form_name`, `form_status` and `form_error`, so these parameters can be used in reports and Explorations, not only in DebugView.

### Design notes

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
- **Exercise 2:** working through the design step by step (Data Layer Variables, Lookup Table, Custom Event trigger, GA4 Event tag), and reviewing my Tag Assistant screenshots. It warned me in advance about the stale `formError` value, which I then reproduced in Preview, and its screenshot review caught the wrong variable in the tag. I built and tested everything in GTM and GA4 myself.

_To be completed as each exercise is finished._
