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
    const chips = Array.isArray(p.tipo) ? p.tipo.slice(0,2).map(t => `<span class="card-chip ${t}">${t}</span>`).join('') : '';
    const techs = Array.isArray(p.tecnologias) ? p.tecnologias.slice(0,3) : [];
    const techChips = techs.map(t => `<span class="tech-chip ${t}">${t}</span>`).join('');
    return `
      <article class="card" data-project-id="${p.slug}">
        <div class="card-chips">${chips}</div>
        <div class="card-media">
          <img src="${p.thumb}" class="card-thumb" alt="Imagen del proyecto ${p.titulo}">
          <div class="tech-chips">${techChips}</div>
        </div>
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
    const res = await fetch('scripts/projects.json?v=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    projects = await res.json();
  } catch (e) {
    console.error('No se pudo cargar projects.json', e);
    // Fallback minimal para no dejar vacío el grid
    projects = [
      {
        slug: 'fallback',
        titulo: 'Portafolio en actualización',
        tipo: ['frontend'],
        descripcion: 'No se pudo cargar la lista de proyectos. Intenta recargar la página.',
        repo: 'https://github.com/DanteRRLopez',
        demo: '',
        thumb: 'assets/img/proyectos/Proyecto-Generation.png',
        video: ''
      }
    ];
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

  // Initial render (only after we have projects)
  if (Array.isArray(projects) && projects.length) {
    render(projects);
  } else {
    $grid.innerHTML = '<p>No hay proyectos para mostrar.</p>';
  }

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