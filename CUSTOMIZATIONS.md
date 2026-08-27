# WOW Sewing theme customizations

This file documents store-specific code so future Minimog releases can be
merged without losing custom behavior.

## Compact sale-saving badge

Purpose:

- Render `وفّر 150 ج` for Arabic EGP storefronts.
- Render `Save E£150` for English EGP storefronts.
- Use the active market currency symbol for other currencies, such as `$`.
- Remove redundant zero decimals while preserving real fractional amounts.
- Keep the badge direction stable inside both RTL and LTR pages.
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
