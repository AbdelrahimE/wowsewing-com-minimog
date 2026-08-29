# WOW Sewing theme customizations

This file documents store-specific code so future Minimog releases can be
merged without losing custom behavior.

## Compact sale-saving badge

Purpose:

- Render `وفّر 150 ج` for Arabic EGP storefronts.
- Render `Save E£150` for English EGP storefronts.
- Use the active market currency symbol for other currencies, such as `$`.
- Remove redundant zero decimals while preserving real fractional amounts.
- Use RTL ordering for Arabic EGP values and LTR isolation for Latin currency
  symbols, keeping the badge readable in both RTL and LTR pages.
- Preserve the compact format when a product-card variant changes.

Custom-owned files (copy these into every upgraded theme):

- `snippets/wow-sale-badge-money.liquid`
- `assets/wow-sale-badge-money.js`
- `CUSTOMIZATIONS.md`

Small integration points to reapply or merge:

- `snippets/custom-code-body.liquid`: exposes locale/currency configuration and
  loads `wow-sale-badge-money.js`. Minimog marks this file as preserved during
  theme updates.
- `snippets/product-card-1.liquid` through `product-card-5.liquid`: the fixed
  amount branch renders `wow-sale-badge-money`.
- `snippets/product-prices.liquid`: the product-page fixed saving amount renders
  `wow-sale-badge-money`.
- `assets/product-card-swatch.js`: delegates live variant badge updates to
  `window.WowSaleBadgeMoney.update`, with the original formatter retained as a
  safe fallback.

Upgrade workflow:

1. Create a branch for the new upstream Minimog version.
2. Merge the vendor update into the repository.
3. Resolve only the small integration points listed above if Git reports a
   conflict; keep the `wow-*` files as the source of truth.
4. Run `shopify theme check`.
5. Upload as a new unpublished draft and test Arabic, English, EGP, and any
   enabled presentment currencies before publishing.

## Localized FoxKit flash-sale countdown

Purpose:

- Keep FoxKit and Minimog responsible for the real offer deadline and live
  numeric updates.
- Render an explicit `ينتهي العرض بعد` prompt with `يوم`, `ساعة`, `دقيقة`,
  and `ثانية` unit captions on Arabic storefronts.
- Render `Offer ends in` with `Day`, `Hour`, `Minute`, and `Second` captions on
  English storefronts.
- Place the unit boxes in RTL reading order for Arabic and LTR reading order
  for English while isolating each numeric value as LTR so two-digit values do
  not reverse.
- Replace the ambiguous colon-only presentation with labeled, responsive unit
  boxes that remain readable on small mobile screens.

Custom-owned files (copy these into every upgraded theme):

- `snippets/wow-flashsale-countdown.liquid`
- `assets/wow-flashsale-countdown.css`
- `CUSTOMIZATIONS.md`

Small integration point to reapply or merge:

- `sections/featured-collection.liquid`: load
  `wow-flashsale-countdown.css` after the vendor stylesheet and replace the
  original `[data-flashsale-countdown]` markup with
  `{% render 'wow-flashsale-countdown' %}`.

Important invariants:

- Keep the original `data-flashsale-countdown` attribute and the
  `countdown-timer-day`, `countdown-timer-hour`, `countdown-timer-minute`, and
  `countdown-timer-sec` classes. Minimog uses these hooks to update the timer.
- Do not edit FoxKit app-extension assets for this presentation change.
- Expiry visibility remains controlled through FoxKit and the theme settings;
  this customization intentionally does not change the zero/expired state.
- The snippet supports Arabic and English intentionally; add another localized
  branch there before enabling an additional storefront language.

Countdown QA after a theme update:

1. Confirm FoxKit's configured deadline counts down without being changed by
   the custom presentation.
2. In Arabic, confirm the unit order reads from right to left as day, hour,
   minute, second and the individual two-digit values are not reversed.
3. In English, confirm the same units read from left to right.
4. Test at 320 px, 375 px, 768 px, and desktop widths.
5. Confirm the original published theme remains untouched until the new draft
   passes final review.

## Customer reviews masonry section

Purpose:

- Provide a native `WOW customer reviews` section in Shopify's **Add section**
  menu without editing a JSON template.
- Render review blocks in a lightweight responsive masonry layout using CSS
  columns, so text-only cards do not reserve empty image space.
- Support optional review media, customer avatars, dates, verified status, and
  related products without rendering empty wrappers for missing content.
- Reveal reviews progressively with configurable initial and per-click counts.
  Every review remains in the HTML and visible when JavaScript is unavailable.
- Switch operational labels between Arabic and English from the active Shopify
  locale while inheriting RTL/LTR direction and the theme's color schemes and
  typography.
- Reuse Minimog's native `m-section__subheading`, `m-section__heading`, and
  `m-section__description` classes so the section header follows the same font,
  weight, sizing scale, and RTL-aware alignment as core theme sections.
- Keep the review date aligned to the page's reading direction while isolating
  the numeric date itself as LTR, and render rating stars with compact spacing.

Custom-owned files (copy these into every upgraded theme):

- `sections/wow-customer-reviews.liquid`
- `assets/wow-customer-reviews.css`
- `assets/wow-customer-reviews.js`
- `CUSTOMIZATIONS.md`

There are no integration points in core theme files. Removing the three
`wow-customer-reviews` files removes the feature; individual section instances
can be added or removed through the Theme Editor.

Theme Editor setup:

1. Open the target draft theme and choose **Customize**.
2. Open the required page template, select **Add section**, then choose
   **WOW customer reviews**.
3. Select **Add review** for every genuine customer review. Add only the fields
   available for that review; blank image, avatar, date, and product fields do
   not create placeholders.
4. Enable **Verified customer** only when that status is supported by the
   store's records.
5. Configure **Initial reviews count**, **Reviews per load**, and the desktop,
   tablet, and mobile column selectors under **Layout and loading**.
6. Keep the manual rating summary disabled until its average and count are
   supported by real review data.

Localization notes:

- Verified and load-more/load-less labels have separate Arabic and English
  settings and switch automatically from `request.locale.iso_code`.
- Rating accessibility labels and manual summary phrasing also switch between
  Arabic and English automatically.
- Merchant content such as the heading, description, customer name, review
  text, and display date belongs to Shopify content. Translate those values
  with Shopify Translate & Adapt (or another compatible translation workflow)
  after the final content is entered.

Upgrade and QA workflow:

1. Merge the new vendor theme version on a separate Git branch.
2. Retain the three isolated `wow-customer-reviews` files; no vendor core file
   should need conflict resolution for this feature.
3. Run `shopify theme check` and separately confirm that it reports no offense
   for `sections/wow-customer-reviews.liquid`.
4. Upload to an unpublished draft theme only.
5. Test Arabic RTL and English LTR at 360, 390, 430, 768, 1024, and 1440 px.
   Confirm dates align right in Arabic and left in English without reversing
   their digits, and compare the section header with a native Minimog header at
   the same configured heading size.
6. Verify natural and cover images, missing optional fields, ratings 1–5,
   related product links, keyboard focus, load-more batches, optional load-less,
   multiple section instances, and Theme Editor block selection.
7. Confirm the published theme is unchanged before considering publication.

## Product purchase assurances block

Purpose:

- Replace the single-image product trust badge with four concise purchase
  assurances in one row: secure payment, cash on delivery, fast delivery, and
  guaranteed returns and exchanges.
- Keep all four items in one responsive grid row on desktop and mobile while
  reducing icon and text sizes at narrow widths.
- Use consistent inline SVG icons instead of platform-dependent emoji and
  inherit the product section's RTL/LTR direction and theme color tokens.
- Expose the four labels as translatable text settings in the Theme Editor.

Custom-owned files (copy these into every upgraded theme):

- `snippets/wow-product-assurances.liquid`
- `assets/wow-product-assurances.css`
- `CUSTOMIZATIONS.md`

Small integration points to reapply or merge:

- `sections/main-product.liquid`: defines the `wow_assurances` block and its
  merchant-editable settings.
- `snippets/main-product-blocks.liquid`: renders the isolated snippet for the
  `wow_assurances` block type.

Theme Editor setup:

1. In the target draft's default product template, remove the old **Trust
   badge** block.
2. Add **WOW purchase assurances** in the same position beneath the buy
   buttons and above shipping information.
3. Translate the four text settings with Shopify Translate & Adapt after the
   source wording is approved.

Upgrade and QA workflow:

1. Preserve the two custom-owned files and reapply the two small integration
   points after merging a new Minimog version.
2. Run Theme Check and confirm the Shopify code editor reports no Liquid or
   schema problems.
3. Test Arabic RTL and English LTR on desktop and at 320, 360, 390, and 430 px.
4. Confirm all four items remain in one row, labels wrap without overflow, and
   icon colors retain sufficient contrast.
5. Confirm the active theme remains unchanged until the draft passes final QA.
