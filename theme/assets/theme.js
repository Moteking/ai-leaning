(function () {
  'use strict';

  /* =========================================================================
     Mobile menu toggle
     ========================================================================= */
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });
  }

  /* =========================================================================
     Search panel toggle
     ========================================================================= */
  const searchToggle = document.querySelector('[data-search-toggle]');
  const searchPanel = document.querySelector('[data-search-panel]');

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      const hidden = searchPanel.hasAttribute('hidden');
      if (hidden) {
        searchPanel.removeAttribute('hidden');
        const input = searchPanel.querySelector('input[type="search"]');
        if (input) setTimeout(() => input.focus(), 50);
      } else {
        searchPanel.setAttribute('hidden', '');
      }
    });
  }

  /* =========================================================================
     Product gallery (thumbnails)
     ========================================================================= */
  document.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
    const thumbs = gallery.querySelectorAll('[data-thumb-target]');
    const slides = gallery.querySelectorAll('.product-gallery__slide');

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const targetId = thumb.getAttribute('data-thumb-target');
        thumbs.forEach((t) => t.classList.remove('is-active'));
        slides.forEach((s) => s.classList.remove('is-active'));
        thumb.classList.add('is-active');
        const targetSlide = gallery.querySelector(`[data-media-id="${targetId}"]`);
        if (targetSlide) targetSlide.classList.add('is-active');
      });
    });
  });

  /* =========================================================================
     Quantity input
     ========================================================================= */
  document.querySelectorAll('[data-quantity]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.quantity-input');
      if (!wrapper) return;
      const input = wrapper.querySelector('input');
      if (!input) return;
      const current = parseInt(input.value, 10) || 0;
      const min = parseInt(input.min, 10) || 0;
      if (btn.getAttribute('data-quantity') === 'increase') {
        input.value = current + 1;
      } else {
        input.value = Math.max(min, current - 1);
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  /* =========================================================================
     Product variant selection
     ========================================================================= */
  document.querySelectorAll('[data-product-form]').forEach((form) => {
    const values = form.querySelectorAll('[data-option-value]');
    const variantInput = form.querySelector('[data-variant-id]');
    if (!values.length || !variantInput) return;

    const selected = {};
    form.querySelectorAll('.product-form__option').forEach((option, index) => {
      const active = option.querySelector('.is-selected');
      if (active) {
        selected[index] = active.getAttribute('data-option-value');
      }
    });

    values.forEach((value) => {
      value.addEventListener('click', () => {
        const index = parseInt(value.getAttribute('data-option-index'), 10);
        const siblings = value.closest('.product-form__values').querySelectorAll('.product-form__value');
        siblings.forEach((s) => s.classList.remove('is-selected'));
        value.classList.add('is-selected');
        selected[index] = value.getAttribute('data-option-value');
      });
    });
  });

  /* =========================================================================
     Add-to-cart AJAX (minimal)
     ========================================================================= */
  document.querySelectorAll('[data-product-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      // If Shopify supports AJAX cart and we want to intercept:
      if (!form.dataset.ajax) return;
      e.preventDefault();

      const formData = new FormData(form);
      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        if (!res.ok) throw new Error('Add to cart failed');
        await updateCartCount();
      } catch (err) {
        console.error(err);
      }
    });
  });

  async function updateCartCount() {
    try {
      const res = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
      const cart = await res.json();
      const countEl = document.querySelector('[data-cart-count]');
      if (countEl) countEl.textContent = cart.item_count;
    } catch (err) {
      console.error(err);
    }
  }

  /* =========================================================================
     Sticky header scroll state
     ========================================================================= */
  const header = document.querySelector('.site-header--sticky');
  if (header) {
    let lastScroll = 0;
    window.addEventListener(
      'scroll',
      () => {
        const scroll = window.scrollY;
        if (scroll > 10) header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');
        lastScroll = scroll;
      },
      { passive: true }
    );
  }
})();
