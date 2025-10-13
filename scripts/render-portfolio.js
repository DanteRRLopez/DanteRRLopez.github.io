(async () => {
  const $grid = document.getElementById('grid');
  const $chips = document.querySelectorAll('.chip');

  function card(p) {
    const tags = p.tipo.map(t => `<span class="tag">${t}</span>`).join('');
    const demoBtn = p.demo
      ? `<a href="${p.demo}" target="_blank" rel="noopener" class="btn">Demo</a>`
      : '';
    const videoBtn = p.video
      ? `<a href="${p.video}" target="_blank" rel="noopener" class="btn btn-secondary">Vídeo</a>`
      : '';
    return `
      <article class="card" data-project-id="${p.slug}">
        <img src="${p.thumb}" class="card-thumb" alt="Imagen del proyecto ${p.titulo}">
        <div class="card-body">
          <h3>${p.titulo}</h3>
          <p>${p.descripcion}</p>
          <div class="tags">${tags}</div>
          <div class="actions">
            <a href="${p.repo}" target="_blank" rel="noopener" class="btn">Código</a>
            ${demoBtn}
            ${videoBtn}
          </div>
        </div>
      </article>`;
  }

  // Render function that also binds interactions after DOM update
  function render(items) {
    $grid.innerHTML = items.map(card).join('');
    bindFloatingInteractions();
  }

  let projects = [];
  try {
    const res = await fetch('scripts/projects.json', { cache: 'no-store' });
    projects = await res.json();
  } catch (e) {
    console.error('No se pudo cargar projects.json', e);
  }

  // Interaction: highlight floating object related to project on hover
  function bindFloatingInteractions() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const id = card.getAttribute('data-project-id');
        if (!id) return;
        const target = document.querySelector('.floating-item[data-related="' + id + '"]');
        if (target) {
          target.style.opacity = '0.32';
          target.style.transform = 'scale(1.12) translateY(-8px)';
        }
      });
      card.addEventListener('mouseleave', () => {
        const id = card.getAttribute('data-project-id');
        if (!id) return;
        const target = document.querySelector('.floating-item[data-related="' + id + '"]');
        if (target) {
          target.style.opacity = '';
          target.style.transform = '';
        }
      });
    });
  }

  // Initial render
  render(projects);

  // Filter buttons
  $chips.forEach(chip => {
    chip.addEventListener('click', () => {
      $chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      const f = chip.dataset.filter;
      if (f === 'all') return render(projects);
      render(projects.filter(p => p.tipo.includes(f)));
    });
  });
})();