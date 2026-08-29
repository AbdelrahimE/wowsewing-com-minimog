if (!customElements.get('wow-customer-reviews')) {
  class WowCustomerReviews extends HTMLElement {
    connectedCallback() {
      if (this.isConnectedToReviews) return;

      this.isConnectedToReviews = true;
      this.cards = Array.from(this.querySelectorAll('[data-wow-review-card]'));
      this.actions = this.querySelector('[data-wow-reviews-actions]');
      this.moreButton = this.querySelector('[data-wow-reviews-more]');
      this.lessButton = this.querySelector('[data-wow-reviews-less]');
      this.initialCount = this.parsePositiveInteger(this.dataset.initialCount, this.cards.length);
      this.perLoad = this.parsePositiveInteger(this.dataset.perLoad, 1);
      this.visibleCount = Math.min(this.initialCount, this.cards.length);

      this.handleMore = this.showMore.bind(this);
      this.handleLess = this.showLess.bind(this);
      this.handleBlockSelect = this.revealSelectedBlock.bind(this);

      this.moreButton?.addEventListener('click', this.handleMore);
      this.lessButton?.addEventListener('click', this.handleLess);
      this.addEventListener('shopify:block:select', this.handleBlockSelect);

      this.update({ animateFrom: null });
    }

    disconnectedCallback() {
      this.moreButton?.removeEventListener('click', this.handleMore);
      this.lessButton?.removeEventListener('click', this.handleLess);
      this.removeEventListener('shopify:block:select', this.handleBlockSelect);
      this.isConnectedToReviews = false;
    }

    parsePositiveInteger(value, fallback) {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    }

    showMore() {
      const previousCount = this.visibleCount;
      this.visibleCount = Math.min(this.visibleCount + this.perLoad, this.cards.length);
      this.update({ animateFrom: previousCount });
    }

    showLess() {
      this.visibleCount = Math.min(this.initialCount, this.cards.length);
      this.update({ animateFrom: null });

      if (this.moreButton && !this.moreButton.hidden) {
        this.moreButton.focus({ preventScroll: true });
      }
    }

    revealSelectedBlock(event) {
      const selectedCard = event.target.closest?.('[data-wow-review-card]');
      if (!selectedCard || !this.contains(selectedCard)) return;

      const selectedIndex = this.cards.indexOf(selectedCard);
      if (selectedIndex >= this.visibleCount) {
        this.visibleCount = selectedIndex + 1;
        this.update({ animateFrom: null });
      }
    }

    update({ animateFrom }) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.cards.forEach((card, index) => {
        const shouldShow = index < this.visibleCount;
        card.hidden = !shouldShow;

        if (shouldShow && animateFrom !== null && index >= animateFrom && !reduceMotion) {
          card.classList.remove('wow-reviews__card--revealed');
          void card.offsetWidth;
          card.classList.add('wow-reviews__card--revealed');
          card.addEventListener(
            'animationend',
            () => card.classList.remove('wow-reviews__card--revealed'),
            { once: true }
          );
        }
      });

      const hasMore = this.visibleCount < this.cards.length;
      const canShowLess = Boolean(this.lessButton) && this.visibleCount > Math.min(this.initialCount, this.cards.length);

      if (this.moreButton) {
        this.moreButton.hidden = !hasMore;
        this.moreButton.setAttribute('aria-expanded', String(!hasMore));
      }

      if (this.lessButton) {
        this.lessButton.hidden = !canShowLess;
      }

      if (this.actions) {
        this.actions.hidden = !hasMore && !canShowLess;
      }
    }
  }

  customElements.define('wow-customer-reviews', WowCustomerReviews);
}
