---
name: Input & display standards
description: Every text input needs char limits + profanity filter; all displayed text must handle overflow; pagination wherever lists can grow
type: feedback
---

Three rules for all UI work in this project:

1. **Every text input must have a character limit and profanity check.** This means a `CharCounter` component, enforcement in `updateField`, and the red border highlight (`hasProfanity`) on the input itself. No exceptions.

2. **All displayed text must handle excessively long content.** Use `break-words`, `break-all`, `truncate`, `overflow-hidden`, `min-w-0`, etc. as appropriate — never let text overflow its container.

3. **Pagination should be available whenever a list can grow.** Don't render unbounded lists. Use paginated views (like the 10-per-page pattern in Reviews).

**Why:** The user has had to flag missing char limits, missing profanity borders, and overflow bugs multiple times. These are baseline expectations for every feature going forward.

**How to apply:** When building any new form (application tracker, networking, resources), apply all three from the start. When displaying user-generated content, always test with long unbroken strings.
