document.getElementById('year').textContent = new Date().getFullYear();
const btn = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
if (btn && links) {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('open');
  });
}

// Hover inverse: when hovering a floating item, highlight related card
(function() {
  function bindFloatingHover() {
    const items = document.querySelectorAll('.floating-item[data-related]');
    items.forEach(it => {
      it.addEventListener('mouseenter', () => {
        const id = it.getAttribute('data-related');
        const card = document.querySelector('.card[data-project-id="' + id + '"]');
        if (card) card.classList.add('floating-highlight');
      });
      it.addEventListener('mouseleave', () => {
        const id = it.getAttribute('data-related');
        const card = document.querySelector('.card[data-project-id="' + id + '"]');
        if (card) card.classList.remove('floating-highlight');
      });
    });
  }

  bindFloatingHover();
  const grid = document.getElementById('grid');
  if (grid && window.MutationObserver) {
    const mo = new MutationObserver(() => bindFloatingHover());
    mo.observe(grid, { childList: true, subtree: true });
  }
})();