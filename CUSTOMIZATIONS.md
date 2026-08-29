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
