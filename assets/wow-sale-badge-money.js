/**
 * WOW Sewing customization: compact money formatting for saving badges.
 *
 * This file intentionally owns all client-side formatting so the vendor's
 * product-card code only needs one guarded integration call.
 */
(() => {
  const config = window.WowSaleBadgeConfig || {};
  const locale = config.locale || document.documentElement.lang || "en";
  const currencyCode = config.currencyCode || "";
  const defaultCurrencySymbol = config.currencySymbol || currencyCode;

  const isArabic = locale.toLowerCase() === "ar" || locale.toLowerCase().startsWith("ar-");

  function getDisplayOptions() {
    if (currencyCode === "EGP") {
      return isArabic
        ? { symbol: "ج", symbolAfterAmount: true, direction: "rtl" }
        : { symbol: "E£", symbolAfterAmount: false, direction: "ltr" };
    }

    return {
      symbol: defaultCurrencySymbol,
      symbolAfterAmount: false,
      direction: "ltr",
    };
  }

  function formatNumber(cents) {
    const numericCents = Number(cents);
    if (!Number.isFinite(numericCents)) return "";

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      numberingSystem: "latn",
    }).format(numericCents / 100);
  }

  function format(cents) {
    const amount = formatNumber(cents);
    const { symbol, symbolAfterAmount } = getDisplayOptions();
    if (!amount) return "";
    if (!symbol) return amount;

    return symbolAfterAmount ? `${amount}\u00a0${symbol}` : `${symbol}${amount}`;
  }

  function update(element, cents) {
    if (!element) return;

    const target = element.matches?.("[data-wow-sale-badge-cents]")
      ? element
      : element.querySelector?.("[data-wow-sale-badge-cents]") || element;

    target.textContent = format(cents);
    target.setAttribute("dir", getDisplayOptions().direction);
    target.dataset.wowSaleBadgeCents = cents;
  }

  function refresh(root = document) {
    if (root.matches?.("[data-wow-sale-badge-cents]")) {
      update(root, root.dataset.wowSaleBadgeCents);
    }

    root.querySelectorAll?.("[data-wow-sale-badge-cents]").forEach((element) => {
      update(element, element.dataset.wowSaleBadgeCents);
    });
  }

  window.WowSaleBadgeMoney = { format, refresh, update };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => refresh(), { once: true });
  } else {
    refresh();
  }

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) refresh(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
